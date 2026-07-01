// Build a small constituency (kawasan) index for the /cari content search.
// Reads the generated keputusan-pru*.json and writes public/data/_kawasan-index.json
// with unique Parlimen + DUN names. Runs at build time (chained after prebuild),
// so it stays fresh whenever SPR updates the source data.
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const DATA = join(process.cwd(), 'public', 'data');

function load(slug) {
  try {
    const parsed = JSON.parse(readFileSync(join(DATA, `${slug}.json`), 'utf8'));
    return Array.isArray(parsed) ? parsed : parsed.data || [];
  } catch {
    return [];
  }
}

const entries = new Map(); // `${type}|${name}` -> { name, type, negeri }
function add(name, type, negeri) {
  const n = String(name || '').trim();
  if (!n) return;
  const key = `${type}|${n}`;
  if (!entries.has(key)) {
    entries.set(key, { name: n, type, negeri: String(negeri || '').trim() });
  }
}

for (const r of load('keputusan-pru')) add(r['PARLIMEN'], 'parlimen', r['NEGERI']);
for (const r of load('keputusan-pru-dun')) add(r['DEWAN UNDANGAN NEGERI'], 'dun', r['NEGERI']);

const out = [...entries.values()].sort((a, b) => a.name.localeCompare(b.name));
writeFileSync(join(DATA, '_kawasan-index.json'), JSON.stringify(out));
console.log(`[kawasan-index] wrote ${out.length} entries to public/data/_kawasan-index.json`);
