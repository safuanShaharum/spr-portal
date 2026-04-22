import { NextRequest, NextResponse } from "next/server";
import * as XLSX from "xlsx";

const WP_API = process.env.NEXT_PUBLIC_WP_API_URL || "http://spr-open-data.local/wp-json";

/* ------------------------------------------------------------------ */
/*  Sheet slug → Excel sheet name mapping                              */
/* ------------------------------------------------------------------ */

const SHEET_MAP: Record<string, string> = {
  "keputusan-pru": "Keputusan PRU",
  "keputusan-dun": "Keputusan PRU DUN",
  "keputusan-prk": "Keputusan PRK",
  "undi-pos": "Statistik Undi Pos",
  "pengundi-awal": "Statistik Pengundi Awal",
  "penyata-belanja": "test Penyata Belanja Calon PR",
  "petugas": "Statistik Petugas",
  "notis-warta": "Notis Warta Belanja PR",
  "maklumat-calon": "Maklumat Calon PR",
  "daftar-pemilih": "Daftar Pemilih Induk 2008-2025",
  "dppr": "DPPR PRU PRN PRK 2008 & KEATAS",
  "senarai-bpr": "SENARAI BPR",
  "pusat-mengundi": "BIL. PM, PPC, PPRU",
  "petisyen": "BIL. PETISYEN",
  "bajet": "BAJET PR",
  "kesalahan": "BIL. KESALAHAN PR ",
  "pemerhati": "BIL. PEMERHATI",
  "program-ve": "BIL. PROGRAM VE",
};

/* ------------------------------------------------------------------ */
/*  Smart cache: workbook buffer + per-sheet parsed data               */
/* ------------------------------------------------------------------ */

let cachedWorkbook: XLSX.WorkBook | null = null;
let cachedModified: string = "";
const sheetCache = new Map<string, Record<string, unknown>[]>();
const MAX_CACHED_SHEETS = 8; // LRU: keep at most 8 sheets in memory

async function getFileInfo(): Promise<{ url: string; modified: string }> {
  const res = await fetch(`${WP_API}/spr/v1/data-file`);
  if (!res.ok) throw new Error("Failed to fetch data-file endpoint");
  const meta = await res.json();
  return { url: meta.url, modified: meta.modified || "" };
}

async function getWorkbook(): Promise<XLSX.WorkBook> {
  const { url, modified } = await getFileInfo();

  // If cached and same modified date → reuse
  if (cachedWorkbook && modified === cachedModified) {
    return cachedWorkbook;
  }

  // File changed or first load → download and parse
  console.log(`[katalog] Downloading Excel (modified: ${modified})...`);
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to download Excel: ${res.status}`);
  const buffer = await res.arrayBuffer();

  cachedWorkbook = XLSX.read(buffer, { type: "array" });
  cachedModified = modified;
  sheetCache.clear(); // invalidate all sheet caches
  console.log(`[katalog] Parsed workbook: ${cachedWorkbook.SheetNames.length} sheets`);

  return cachedWorkbook;
}

function parseSheet(workbook: XLSX.WorkBook, sheetName: string): Record<string, unknown>[] {
  // Check sheet cache
  if (sheetCache.has(sheetName)) {
    return sheetCache.get(sheetName)!;
  }

  const sheet = workbook.Sheets[sheetName];
  if (!sheet) return [];

  let jsonData: Record<string, unknown>[];
  try {
    jsonData = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet, { defval: "" });
  } catch {
    return [];
  }

  // Skip sub-header rows
  if (jsonData.length > 0) {
    const vals = Object.values(jsonData[0]).map(String);
    if (vals.some((v) => v.includes("(RM)") || v.includes("(Bil)"))) {
      jsonData = jsonData.slice(1);
    }
  }

  // Normalize column names: trim whitespace, replace \n with space
  const normalized = jsonData.map((row) => {
    const clean: Record<string, unknown> = {};
    for (const [key, val] of Object.entries(row)) {
      clean[key.replace(/\n/g, " ").trim()] = val;
    }
    return clean;
  });

  // LRU eviction: remove oldest if at capacity
  if (sheetCache.size >= MAX_CACHED_SHEETS) {
    const oldest = sheetCache.keys().next().value;
    if (oldest) sheetCache.delete(oldest);
  }

  sheetCache.set(sheetName, normalized);
  return normalized;
}

/* ------------------------------------------------------------------ */
/*  API Handler                                                        */
/* ------------------------------------------------------------------ */

export async function GET(req: NextRequest) {
  const params = req.nextUrl.searchParams;
  const sheetSlug = params.get("sheet") || "keputusan-pru";
  const page = Math.max(1, parseInt(params.get("page") || "1", 10));
  const limit = Math.min(50000, Math.max(1, parseInt(params.get("limit") || "25", 10)));
  const negeri = params.get("negeri") || "";
  const tahun = params.get("tahun") || "";
  const jenisCalon = params.get("jenisCalon") || "";
  const statusCalon = params.get("statusCalon") || "";
  const kawasan = params.get("kawasan") || "";
  const kawasanType = params.get("kawasanType") || "";
  const pilihanRaya = params.get("pilihanRaya") || "";

  // Validate sheet slug
  const excelSheetName = SHEET_MAP[sheetSlug];
  if (!excelSheetName) {
    return NextResponse.json(
      { error: `Unknown sheet: ${sheetSlug}`, availableSheets: Object.keys(SHEET_MAP) },
      { status: 400 }
    );
  }

  try {
    const workbook = await getWorkbook();

    // Find sheet (fuzzy match for trailing spaces)
    let actualName = excelSheetName;
    if (!workbook.Sheets[actualName]) {
      const match = workbook.SheetNames.find(
        (n) => n.trim().toLowerCase() === excelSheetName.trim().toLowerCase()
      );
      if (match) actualName = match;
    }

    let rows = parseSheet(workbook, actualName);

    if (rows.length === 0) {
      return NextResponse.json({
        data: [], total: 0, page, limit, totalPages: 0,
        sheet: sheetSlug, columns: [],
      });
    }

    // --- Aggregate undi-pos ---
    if (sheetSlug === "undi-pos") {
      const groups = new Map<string, { pr: string; negeri: string; parlimen: string; dun: string; a: number; b: number; c: number }>();
      for (const row of rows) {
        const pr = String(row["Nama Pilihan Raya"] || "");
        const negeri = String(row["NegeriPemohon"] || "");
        const parlimen = String(row["ParlimenPemohon"] || "");
        const dun = String(row["DunPemohon"] || "");
        const kat = String(row["KategoriUndiPos"] || "");
        const key = `${pr}||${negeri}||${parlimen}||${dun}`;
        let g = groups.get(key);
        if (!g) { g = { pr, negeri, parlimen, dun, a: 0, b: 0, c: 0 }; groups.set(key, g); }
        if (kat === "1A") g.a++;
        else if (kat === "1B") g.b++;
        else if (kat === "1C") g.c++;
      }
      rows = Array.from(groups.values()).map((g) => ({
        "Nama Pilihan Raya": g.pr,
        "NEGERI": g.negeri,
        "PARLIMEN": g.parlimen,
        "DUN": g.dun,
        "KAT. 1A": g.a,
        "KAT. 1B": g.b,
        "KAT. 1C": g.c,
        "JUMLAH": g.a + g.b + g.c,
      }));
    }

    // --- Pivot pemerhati ---
    if (sheetSlug === "pemerhati") {
      const metaCols = ["TAHUN PILIHAN RAYA", "PILIHAN RAYA", "NEGERI", "PARLIMEN", "DUN"];
      const pivoted: Record<string, unknown>[] = [];
      for (const row of rows) {
        for (const [key, val] of Object.entries(row)) {
          if (metaCols.includes(key)) continue;
          const num = Number(val);
          if (!isNaN(num) && num > 0) {
            pivoted.push({
              "PILIHAN RAYA": row["PILIHAN RAYA"] || "",
              NEGERI: row["NEGERI"] || "",
              PARLIMEN: row["PARLIMEN"] || "",
              ORGANISASI: key,
              "BILANGAN PEMERHATI": num,
            });
          }
        }
      }
      rows = pivoted;
    }

    // Extract columns after all transformations
    const columns = rows.length > 0 ? Object.keys(rows[0]) : [];

    // --- Filters ---
    let filtered = rows;

    if (negeri) {
      const q = negeri.toLowerCase();
      filtered = filtered.filter((row) =>
        String(row["NEGERI"] || row["Negeri"] || row["NegeriPemohon"] || "").toLowerCase().includes(q)
      );
    }

    if (tahun) {
      filtered = filtered.filter((row) => {
        for (const col of ["TAHUN PILIHAN RAYA", "TAHUN", "Tahun", "TahunPilihanraya"]) {
          const val = String(row[col] || "");
          if (val && val.includes(tahun)) return true;
        }
        return false;
      });
    }

    if (pilihanRaya) {
      const q = pilihanRaya.toLowerCase();
      filtered = filtered.filter((row) => {
        for (const col of ["Nama Pilihan Raya", "PILIHAN RAYA", "NamaPR"]) {
          const val = String(row[col] || "").toLowerCase();
          if (val && val.includes(q)) return true;
        }
        return false;
      });
    }

    if (jenisCalon) {
      filtered = filtered.filter((row) =>
        String(row["JenisCalon"] || "").toLowerCase() === jenisCalon.toLowerCase()
      );
    }

    if (statusCalon) {
      filtered = filtered.filter((row) =>
        String(row["StatusCalon"] || row["STATUS"] || "").toLowerCase() === statusCalon.toLowerCase()
      );
    }

    if (kawasan) {
      filtered = filtered.filter((row) => {
        if (kawasanType === "dun") {
          return String(row["DEWAN UNDANGAN NEGERI"] || "") === kawasan;
        }
        if (kawasanType === "parlimen") {
          return String(row["PARLIMEN"] || "") === kawasan;
        }
        // fallback: match either
        const p = String(row["PARLIMEN"] || "");
        const d = String(row["DEWAN UNDANGAN NEGERI"] || "");
        return p === kawasan || d === kawasan;
      });
    }

    // --- Sort descending by year ---
    const yearCol = ["TAHUN PILIHAN RAYA", "TAHUN", "Tahun", "TahunPilihanraya"]
      .find((c) => columns.includes(c));
    if (yearCol) {
      filtered.sort((a, b) => {
        const aNum = parseInt(String(a[yearCol] || "").replace(/\D/g, "").slice(-4), 10) || 0;
        const bNum = parseInt(String(b[yearCol] || "").replace(/\D/g, "").slice(-4), 10) || 0;
        return bNum - aNum;
      });
    }

    // --- Pagination ---
    const total = filtered.length;
    const totalPages = Math.ceil(total / limit);
    const start = (page - 1) * limit;
    const pageData = filtered.slice(start, start + limit);

    // --- Extract unique filter values from UNFILTERED data (before filters applied) ---
    const negeriCols = ["NEGERI", "Negeri", "NegeriPemohon"];
    const yearCols = ["TAHUN PILIHAN RAYA", "TAHUN", "Tahun", "TahunPilihanraya"];
    const prCols = ["Nama Pilihan Raya", "PILIHAN RAYA", "NamaPR"];
    const uniqueNegeri = new Set<string>();
    const uniqueTahun = new Set<string>();
    const uniquePR = new Set<string>();

    // Use base rows (after jenisCalon filter but before user filters) for filter options
    let baseRows = rows;
    if (jenisCalon) {
      baseRows = baseRows.filter((row) =>
        String(row["JenisCalon"] || "").toLowerCase() === jenisCalon.toLowerCase()
      );
    }

    for (const row of baseRows) {
      for (const col of negeriCols) {
        const v = String(row[col] || "").trim();
        if (v) uniqueNegeri.add(v);
      }
      for (const col of yearCols) {
        const v = String(row[col] || "").trim();
        if (v) uniqueTahun.add(v);
      }
      for (const col of prCols) {
        const v = String(row[col] || "").trim();
        if (v) uniquePR.add(v);
      }
    }

    const filterOptions = {
      negeri: Array.from(uniqueNegeri).sort(),
      tahun: Array.from(uniqueTahun).sort((a, b) => {
        const aNum = parseInt(a.replace(/\D/g, "").slice(-4), 10) || 0;
        const bNum = parseInt(b.replace(/\D/g, "").slice(-4), 10) || 0;
        return bNum - aNum;
      }),
      pilihanRaya: Array.from(uniquePR).sort(),
    };

    return NextResponse.json({
      data: pageData, total, page, limit, totalPages, filterOptions,
      sheet: sheetSlug, columns,
    });
  } catch (err) {
    console.error("Katalog API error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to load data" },
      { status: 500 }
    );
  }
}
