#!/usr/bin/env node
/**
 * Pre-converts the master Excel file (served by WordPress ACF) into per-sheet
 * static JSON files under public/data/. Runs at build time via `prebuild`.
 */

import { mkdir, writeFile, readdir, unlink } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import XLSX from 'xlsx';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = join(__dirname, '..');
const OUTPUT_DIR = join(PROJECT_ROOT, 'public', 'data');

const WP_API_URL = process.env.NEXT_PUBLIC_WP_API_URL;

function fail(msg, err) {
  console.error(`\n✗ ${msg}`);
  if (err) console.error(err);
  process.exit(1);
}

function slugify(name) {
  return String(name)
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}

async function clearOutputDir() {
  if (!existsSync(OUTPUT_DIR)) {
    await mkdir(OUTPUT_DIR, { recursive: true });
    return;
  }
  const entries = await readdir(OUTPUT_DIR);
  await Promise.all(
    entries
      .filter((f) => f.endsWith('.json'))
      .map((f) => unlink(join(OUTPUT_DIR, f)))
  );
}

async function fetchExcelUrl() {
  const endpoint = `${WP_API_URL.replace(/\/$/, '')}/spr/v1/data-file`;
  console.log(`→ Fetching data-file metadata from ${endpoint}`);
  let res;
  try {
    res = await fetch(endpoint);
  } catch (err) {
    fail(`Network error fetching ${endpoint}`, err);
  }
  if (!res.ok) {
    fail(`API returned ${res.status} ${res.statusText} from ${endpoint}`);
  }
  const json = await res.json();
  if (!json?.url) {
    fail(`API response missing 'url' field. Got: ${JSON.stringify(json)}`);
  }
  console.log(`  filename: ${json.filename ?? '(unknown)'}`);
  if (json.filesize) console.log(`  filesize: ${formatBytes(json.filesize)}`);
  return json.url;
}

async function downloadExcel(url) {
  console.log(`→ Downloading Excel from ${url}`);
  let res;
  try {
    res = await fetch(url);
  } catch (err) {
    fail(`Network error downloading Excel`, err);
  }
  if (!res.ok) {
    fail(`Download failed: ${res.status} ${res.statusText}`);
  }
  const buf = await res.arrayBuffer();
  console.log(`  downloaded ${formatBytes(buf.byteLength)}`);
  return buf;
}

function parseWorkbook(buffer) {
  console.log(`→ Parsing workbook`);
  try {
    return XLSX.read(new Uint8Array(buffer), { type: 'array' });
  } catch (err) {
    fail(`Failed to parse Excel workbook`, err);
  }
}

// Sheets that don't fit a flat-table shape (e.g. multi-section pivot layouts).
// We still emit the JSON file but exclude them from _index.json so the catalog
// UI doesn't try to render them as a normal dataset. Handle these via a custom
// renderer when needed.
const NON_TABULAR_SHEETS = new Set(['OVERALL PR']);

function trimKeys(rows) {
  if (rows.length === 0) return rows;
  const sample = rows[0];
  const map = {};
  let needsRewrite = false;
  for (const k of Object.keys(sample)) {
    const trimmed = k.replace(/\s+/g, ' ').trim();
    map[k] = trimmed;
    if (trimmed !== k) needsRewrite = true;
  }
  if (!needsRewrite) return rows;
  return rows.map((row) => {
    const out = {};
    for (const [k, v] of Object.entries(row)) out[map[k] ?? k] = v;
    return out;
  });
}

function computeYearRange(data, columns) {
  const yearCol = columns.find((c) => /tahun/i.test(c));
  if (!yearCol) return null;
  let min = Infinity;
  let max = -Infinity;
  for (const row of data) {
    const raw = String(row[yearCol] ?? '').trim();
    const m = raw.match(/(\d{4})/);
    if (!m) continue;
    const y = parseInt(m[1], 10);
    if (y < 1900 || y > 2100) continue;
    if (y < min) min = y;
    if (y > max) max = y;
  }
  if (!isFinite(min) || !isFinite(max)) return null;
  return min === max ? `${min}` : `${min}–${max}`;
}

async function convertSheet(workbook, sheetName) {
  const sheet = workbook.Sheets[sheetName];
  if (!sheet) throw new Error(`Sheet '${sheetName}' not found in workbook`);

  let data = XLSX.utils.sheet_to_json(sheet, { defval: '' });
  data = trimKeys(data);

  const slug = slugify(sheetName);
  const filePath = join(OUTPUT_DIR, `${slug}.json`);
  const json = JSON.stringify(data);
  await writeFile(filePath, json, 'utf8');

  const sizeBytes = Buffer.byteLength(json, 'utf8');
  const columns = data.length > 0 ? Object.keys(data[0]) : [];
  let yearRange = data.length > 0 ? computeYearRange(data, columns) : null;
  // Amendment R2 #22: DPI pamer 2012-2025 sahaja (API route filters runtime)
  if (slug.startsWith('daftar-pemilih-induk') && yearRange) {
    yearRange = '2012–2025';
  }

  return {
    slug,
    name: sheetName,
    rows: data.length,
    columns,
    yearRange,
    size_kb: Math.round(sizeBytes / 1024),
    size_bytes: sizeBytes,
    isEmpty: data.length === 0,
    isNonTabular: NON_TABULAR_SHEETS.has(sheetName),
  };
}

async function main() {
  console.log('━━━ Excel → JSON conversion ━━━\n');

  if (!WP_API_URL) {
    fail(
      `NEXT_PUBLIC_WP_API_URL is not set.\n` +
        `  Set it in .env.local or your environment, e.g.:\n` +
        `  NEXT_PUBLIC_WP_API_URL=https://cmsodspr.sawangville.dev/wp-json`
    );
  }

  await clearOutputDir();

  const url = await fetchExcelUrl();
  const buffer = await downloadExcel(url);
  const workbook = parseWorkbook(buffer);

  console.log(`→ Found ${workbook.SheetNames.length} sheet(s)\n`);

  const index = [];
  const skipped = [];
  let failed = 0;

  for (const sheetName of workbook.SheetNames) {
    try {
      const meta = await convertSheet(workbook, sheetName);
      const label = meta.slug.padEnd(40);
      const rowsStr = String(meta.rows).padStart(7);
      const sizeStr = formatBytes(meta.size_bytes);

      if (meta.isEmpty) {
        skipped.push({ slug: meta.slug, reason: 'empty (0 rows)' });
        console.log(`  − ${label} ${rowsStr} rows  ${sizeStr}  [skipped: empty]`);
        continue;
      }
      if (meta.isNonTabular) {
        skipped.push({ slug: meta.slug, reason: 'non-tabular layout' });
        console.log(`  − ${label} ${rowsStr} rows  ${sizeStr}  [skipped: non-tabular]`);
        continue;
      }

      index.push({
        slug: meta.slug,
        name: meta.name,
        rows: meta.rows,
        columns: meta.columns,
        yearRange: meta.yearRange,
        size_kb: meta.size_kb,
      });
      console.log(`  ✓ ${label} ${rowsStr} rows  ${sizeStr}`);
    } catch (err) {
      failed++;
      console.warn(`  ⚠ ${sheetName}: ${err.message}`);
    }
  }

  await writeFile(
    join(OUTPUT_DIR, '_index.json'),
    JSON.stringify(index, null, 2),
    'utf8'
  );

  const totalRows = index.reduce((s, x) => s + x.rows, 0);
  const totalKb = index.reduce((s, x) => s + x.size_kb, 0);

  console.log('\n━━━ Summary ━━━');
  console.log(`  Sheets in index:  ${index.length}`);
  if (skipped.length) {
    console.log(`  Sheets skipped:   ${skipped.length}`);
    for (const s of skipped) console.log(`    · ${s.slug} (${s.reason})`);
  }
  if (failed) console.log(`  Sheets failed:    ${failed}`);
  console.log(`  Total rows:       ${totalRows.toLocaleString()}`);
  console.log(`  Total size:       ${formatBytes(totalKb * 1024)}`);
  console.log(`  Output:           public/data/`);
  console.log('');
}

main().catch((err) => fail('Unexpected error', err));
