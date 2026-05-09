export type ColumnType = "string" | "number" | "currency" | "badge" | "date";

export interface ColumnDef {
  key: string;
  header: string;
  type: ColumnType;
  badgeColors?: Record<string, string>;
}

export interface FilterDef {
  key: string;
  label: string;
  options: string[]; // populated dynamically from API data
}

export interface CandidateData {
  nama: string;
  parti: string;
  parti_penuh: string;
  undi: number;
  peratusan: number;
  status: "MENANG" | "KALAH" | "HILANG DEPOSIT";
}

export interface TabDef {
  label: string;
  type: "table" | "grid-parti" | "grid-document" | "empty";
  modalType?: "election" | "detail";
  sheetSlug?: string;
  apiExtraParams?: Record<string, string>;
  columns?: ColumnDef[];
  filters?: FilterDef[];
  documents?: { title: string; year?: string; status?: string }[];
  emptyMessage?: string;
}

export interface BahagianDef {
  slug: string;
  label: string;
  count: number;
  tabs: TabDef[];
}

export const PARTI_COLORS: Record<string, string> = {
  PN: "#2563EB", PH: "#DC2626", BN: "#1E3A5F", GPS: "#EAB308",
  GRS: "#059669", PEJUANG: "#7C3AED", BEBAS: "#6B7280", PAS: "#059669",
  DAP: "#DC2626", AMANAH: "#F97316", PKR: "#2563EB", UMNO: "#1E3A5F",
  BERSATU: "#1E3A5F", "GRS/BN": "#059669", MUDA: "#7C3AED", WARISAN: "#0EA5E9",
};

export const STATUS_COLORS: Record<string, string> = {
  MENANG: "#059669", KALAH: "#DC2626", "HILANG DEPOSIT": "#6B7280",
};

// ====================================================================
// BAHAGIAN 1: PENJALANAN PILIHAN RAYA
// ====================================================================

const TAB_PRU_PARLIMEN: TabDef = {
  label: "Keputusan PRU (Parlimen)",
  type: "table",
  modalType: "election",
  sheetSlug: "keputusan-pru",
  apiExtraParams: { jenisCalon: "Parlimen", statusCalon: "MNG" },
  filters: [
    { key: "tahun", label: "Tahun PRU", options: [] },
    { key: "negeri", label: "Negeri", options: [] },
  ],
  columns: [
    { key: "PARLIMEN", header: "KAWASAN", type: "string" },
    { key: "NEGERI", header: "NEGERI", type: "string" },
    { key: "NAMA ATAS KERTAS UNDI", header: "CALON MENANG", type: "string" },
    { key: "SINGKATAN NAMA PARTI BERTANDING", header: "PARTI", type: "badge", badgeColors: PARTI_COLORS },
    { key: "BILANGAN UNDI", header: "UNDI", type: "number" },
    { key: "MAJORITI", header: "MAJORITI", type: "number" },
  ],
};

const TAB_PRU_DUN: TabDef = {
  label: "Keputusan PRU (DUN)",
  type: "table",
  modalType: "election",
  sheetSlug: "keputusan-dun",
  apiExtraParams: { statusCalon: "MNG" },
  filters: [
    { key: "tahun", label: "Tahun PRU", options: [] },
    { key: "negeri", label: "Negeri", options: [] },
  ],
  columns: [
    { key: "DEWAN UNDANGAN NEGERI", header: "KAWASAN (DUN)", type: "string" },
    { key: "PARLIMEN", header: "PARLIMEN", type: "string" },
    { key: "NEGERI", header: "NEGERI", type: "string" },
    { key: "NAMA ATAS KERTAS UNDI", header: "CALON MENANG", type: "string" },
    { key: "SINGKATAN NAMA PARTI BERTANDING", header: "PARTI", type: "badge", badgeColors: PARTI_COLORS },
    { key: "BILANGAN UNDI", header: "UNDI", type: "number" },
    { key: "MAJORITI", header: "MAJORITI", type: "number" },
  ],
};

const TAB_PRK: TabDef = {
  label: "Keputusan PRK",
  type: "table",
  modalType: "election",
  sheetSlug: "keputusan-prk",
  apiExtraParams: { statusCalon: "MENANG" },
  filters: [
    { key: "tahun", label: "Tahun", options: [] },
    { key: "negeri", label: "Negeri", options: [] },
  ],
  columns: [
    { key: "NamaPR", header: "PILIHAN RAYA", type: "string" },
    { key: "PARLIMEN", header: "KAWASAN", type: "string" },
    { key: "NEGERI", header: "NEGERI", type: "string" },
    { key: "NAMA KERTAS UNDI", header: "CALON MENANG", type: "string" },
    { key: "SINGKATAN NAMA PARTI BERTANDING", header: "PARTI", type: "badge", badgeColors: PARTI_COLORS },
    { key: "BILANGAN UNDI", header: "UNDI", type: "number" },
    { key: "MAJORITI", header: "MAJORITI", type: "number" },
  ],
};

const TAB_UNDI_POS: TabDef = {
  label: "Pengundi Pos",
  type: "table",
  sheetSlug: "undi-pos",
  filters: [
    { key: "pilihanRaya", label: "Pilihan Raya", options: [] },
    { key: "negeri", label: "Negeri", options: [] },
  ],
  columns: [
    { key: "Nama Pilihan Raya", header: "NAMA PILIHAN RAYA", type: "string" },
    { key: "NEGERI", header: "NEGERI", type: "string" },
    { key: "PARLIMEN", header: "PARLIMEN", type: "string" },
    { key: "DUN", header: "DUN", type: "string" },
    { key: "KAT. 1A", header: "KAT. 1A", type: "number" },
    { key: "KAT. 1B", header: "KAT. 1B", type: "number" },
    { key: "KAT. 1C", header: "KAT. 1C", type: "number" },
    { key: "JUMLAH", header: "JUMLAH", type: "number" },
  ],
};

const TAB_PENYATA_BELANJA: TabDef = {
  label: "Penyata Belanja Calon",
  type: "table",
  sheetSlug: "penyata-belanja",
  filters: [
    { key: "pilihanRaya", label: "Pilihan Raya", options: [] },
    { key: "negeri", label: "Negeri", options: [] },
  ],
  columns: [
    { key: "PILIHAN RAYA", header: "PILIHAN RAYA", type: "string" },
    { key: "NEGERI", header: "NEGERI", type: "string" },
    { key: "PARLIMEN", header: "PARLIMEN", type: "string" },
    { key: "DUN", header: "DUN", type: "string" },
    { key: "NAMA CALON PILIHAN RAYA", header: "NAMA CALON", type: "string" },
    { key: "NAMA EJEN PILIHAN RAYA", header: "NAMA EJEN", type: "string" },
    { key: "AMAUN/ JUMLAH DANA DITERIMA (RM)", header: "JUMLAH DANA (RM)", type: "currency" },
    { key: "JUMLAH PERBELANJAAN (RM)", header: "JUMLAH PERBELANJAAN (RM)", type: "currency" },
  ],
};

const TAB_NOTIS_WARTA: TabDef = {
  label: "Notis Warta Belanja PR",
  type: "table",
  sheetSlug: "notis-warta",
  filters: [
    { key: "tahun", label: "Tahun", options: [] },
    { key: "negeri", label: "Negeri", options: [] },
  ],
  columns: [
    { key: "PILIHAN RAYA", header: "PILIHAN RAYA", type: "string" },
    { key: "NEGERI", header: "NEGERI", type: "string" },
    { key: "PARLIMEN", header: "PARLIMEN", type: "string" },
    { key: "DUN", header: "DUN", type: "string" },
    { key: "NAMA CALON PILIHAN RAYA", header: "NAMA CALON", type: "string" },
    { key: "NAMA EJEN PILIHAN RAYA", header: "NAMA EJEN", type: "string" },
    { key: "TARIKH PENYATA DIHANTAR", header: "TARIKH PENYATA", type: "date" },
  ],
};

const TAB_SIMBOL_PARTI: TabDef = {
  label: "Simbol Parti Politik",
  type: "grid-parti",
};

// ====================================================================
// BAHAGIAN 2-8
// ====================================================================

const TAB_DPI: TabDef = {
  label: "Statistik Pemilih Berdaftar (DPI)",
  type: "table",
  sheetSlug: "daftar-pemilih",
  filters: [
    { key: "tahun", label: "Tahun", options: [] },
    { key: "negeri", label: "Negeri", options: [] },
  ],
  columns: [
    { key: "TAHUN", header: "TAHUN", type: "string" },
    { key: "Negeri", header: "NEGERI", type: "string" },
    { key: "PARLIMEN", header: "PARLIMEN", type: "string" },
    { key: "DUN", header: "DUN", type: "string" },
    { key: "DAERAH MENGUNDI", header: "DAERAH MENGUNDI", type: "string" },
    { key: "PEMILIH BERDAFTAR", header: "PEMILIH BERDAFTAR", type: "number" },
    { key: "PENGUNDI BIASA", header: "PENGUNDI BIASA", type: "number" },
    { key: "TENTERA & PASANGAN", header: "TENTERA & PASANGAN", type: "number" },
    { key: "POLIS & PSANGAN PGA", header: "POLIS & PGA", type: "number" },
    { key: "PTH LUAR NEGARA", header: "PTH LUAR NEGARA", type: "number" },
    { key: "ORANG KURANG UPAYA", header: "OKU", type: "number" },
    { key: "18-20 TAHUN", header: "18-20 TAHUN", type: "number" },
    { key: "21-30 TAHUN", header: "21-30 TAHUN", type: "number" },
    { key: "31-45 TAHUN", header: "31-45 TAHUN", type: "number" },
    { key: "46-59 TAHUN", header: "46-59 TAHUN", type: "number" },
    { key: "60 TAHUN & KE ATAS", header: "60+ TAHUN", type: "number" },
    { key: "LELAKI", header: "LELAKI", type: "number" },
    { key: "PEREMPUAN", header: "PEREMPUAN", type: "number" },
  ],
};

const TAB_DPPR: TabDef = {
  label: "Statistik Pemilih Berdaftar (DPPR)",
  type: "table",
  sheetSlug: "dppr",
  filters: [
    { key: "tahun", label: "Tahun", options: [] },
    { key: "negeri", label: "Negeri", options: [] },
  ],
  columns: [
    { key: "TAHUN", header: "TAHUN", type: "string" },
    { key: "Negeri", header: "NEGERI", type: "string" },
    { key: "PARLIMEN", header: "PARLIMEN", type: "string" },
    { key: "DUN", header: "DUN", type: "string" },
    { key: "KOD DM", header: "KOD DM", type: "string" },
    { key: "DAERAH MENGUNDI", header: "DAERAH MENGUNDI", type: "string" },
    { key: "PEMILIH BERDAFTAR", header: "PEMILIH BERDAFTAR", type: "number" },
    { key: "PENGUNDI BIASA", header: "PENGUNDI BIASA", type: "number" },
    { key: "TENTERA & PASANGAN", header: "TENTERA & PASANGAN", type: "number" },
    { key: "POLIS & PSANGAN PGA", header: "POLIS & PGA", type: "number" },
    { key: "PTH LUAR NEGARA", header: "PTH LUAR NEGARA", type: "number" },
    { key: "ORANG KURANG UPAYA", header: "OKU", type: "number" },
    { key: "18 TAHUN", header: "18 TAHUN", type: "number" },
    { key: "18-20 TAHUN", header: "18-20 TAHUN", type: "number" },
    { key: "21-30 TAHUN", header: "21-30 TAHUN", type: "number" },
    { key: "31-45 TAHUN", header: "31-45 TAHUN", type: "number" },
    { key: "46-59 TAHUN", header: "46-59 TAHUN", type: "number" },
    { key: "60 TAHUN & KE ATAS", header: "60+ TAHUN", type: "number" },
    { key: "LELAKI", header: "LELAKI", type: "number" },
    { key: "PEREMPUAN", header: "PEREMPUAN", type: "number" },
  ],
};

const TAB_SENARAI_BPR: TabDef = {
  label: "Senarai BPR",
  type: "table",
  sheetSlug: "senarai-bpr",
  filters: [{ key: "negeri", label: "Negeri", options: [] }],
  columns: [
    { key: "Negeri", header: "NEGERI", type: "string" },
    { key: "PARLIMEN", header: "PARLIMEN", type: "string" },
    { key: "DUN", header: "DUN", type: "string" },
    { key: "DAERAH MENGUNDI", header: "DAERAH MENGUNDI", type: "string" },
  ],
};

const TAB_PUSAT_MENGUNDI: TabDef = {
  label: "Senarai Pusat Mengundi",
  type: "table",
  sheetSlug: "pusat-mengundi",
  filters: [
    { key: "tahun", label: "Tahun", options: [] },
    { key: "negeri", label: "Negeri", options: [] },
  ],
  columns: [
    { key: "PILIHAN RAYA", header: "PILIHAN RAYA", type: "string" },
    { key: "NEGERI", header: "NEGERI", type: "string" },
    { key: "PARLIMEN", header: "PARLIMEN", type: "string" },
    { key: "DUN", header: "DUN", type: "string" },
    { key: "BIL. PUSAT MENGUNDI", header: "BIL. PUSAT MENGUNDI", type: "number" },
    { key: "BIL. PUSAT PENAMAAN CALON (PPC)", header: "BIL. PPC", type: "number" },
    { key: "BIL. PUSAT PERJUMLAHAN RASMI UNDI (PPRU)", header: "BIL. PPRU", type: "number" },
  ],
};

const TAB_LAPORAN_KSP: TabDef = {
  label: "Laporan KSP",
  type: "grid-document",
  documents: [
    { title: "Buku Laporan KSP Tanah Melayu Kali Ke-6", status: "Akan datang" },
    { title: "Buku Laporan KSP Sabah Kali Ke-6", status: "Akan datang" },
    { title: "Buku Laporan KSP Sarawak Kali Ke-6", status: "Akan datang" },
  ],
};

const TAB_PERUNTUKAN: TabDef = {
  label: "Peruntukan Undang-undang",
  type: "grid-document",
  documents: [
    { title: "Perlembagaan Persekutuan", year: "Cetakan Semula 2020" },
    { title: "Akta Kesalahan Pilihan Raya 1954", year: "1954" },
    { title: "Akta Pilihan Raya 1958", year: "1958" },
    { title: "Akta Suruhanjaya Pilihan Raya 1957", year: "1957" },
    { title: "Peraturan-Peraturan Penjalanan Pilihan Raya 1981", year: "1981" },
    { title: "Peraturan-Peraturan Pilihan Raya (Pendaftaran Pemilih) 2002", year: "2002" },
    { title: "Peraturan-Peraturan (Pengundian Pos) 2003", year: "2003" },
  ],
};

const TAB_PETISYEN: TabDef = {
  label: "Petisyen Pilihan Raya",
  type: "table",
  sheetSlug: "petisyen",
  filters: [
    { key: "tahun", label: "Tahun", options: [] },
    { key: "negeri", label: "Negeri", options: [] },
  ],
  columns: [
    { key: "PILIHAN RAYA", header: "PILIHAN RAYA", type: "string" },
    { key: "NEGERI", header: "NEGERI", type: "string" },
    { key: "PARLIMEN", header: "PARLIMEN", type: "string" },
    { key: "DUN", header: "DUN", type: "string" },
    { key: "MAHKAMAH", header: "MAHKAMAH", type: "string" },
    { key: "BIL PETISYEN", header: "BIL. PETISYEN", type: "number" },
  ],
};

const TAB_BAJET: TabDef = {
  label: "Bajet Pilihan Raya",
  type: "table",
  sheetSlug: "bajet",
  filters: [
    { key: "tahun", label: "Tahun", options: [] },
    { key: "negeri", label: "Negeri", options: [] },
  ],
  columns: [
    { key: "PILIHAN RAYA", header: "PILIHAN RAYA", type: "string" },
    { key: "NEGERI", header: "NEGERI", type: "string" },
    { key: "PARLIMEN", header: "PARLIMEN", type: "string" },
    { key: "DUN", header: "DUN", type: "string" },
    { key: "BAJET KESELURUHAN", header: "BAJET KESELURUHAN (RM)", type: "currency" },
  ],
};

const TAB_KESALAHAN: TabDef = {
  label: "Bilangan Kesalahan Pilihan Raya",
  type: "table",
  sheetSlug: "kesalahan",
  filters: [
    { key: "tahun", label: "Tahun", options: [] },
    { key: "negeri", label: "Negeri", options: [] },
  ],
  columns: [
    { key: "PILIHAN RAYA", header: "PILIHAN RAYA", type: "string" },
    { key: "NEGERI", header: "NEGERI", type: "string" },
    { key: "PARLIMEN", header: "PARLIMEN", type: "string" },
    { key: "DUN", header: "DUN", type: "string" },
    { key: "KATEGORI KESALAHAN CERAMAH TANPA PERMIT", header: "CERAMAH TANPA PERMIT", type: "number" },
    { key: "KATEGORI KESALAHAN BAHAN KEMPEN", header: "BAHAN KEMPEN", type: "number" },
    { key: "KATEGORI KESALAHAN HARI MENGUNDI", header: "HARI MENGUNDI", type: "number" },
  ],
};

const TAB_PEMERHATI: TabDef = {
  label: "Bilangan Pemerhati",
  type: "table",
  sheetSlug: "pemerhati",
  filters: [
    { key: "tahun", label: "Tahun", options: [] },
    { key: "negeri", label: "Negeri", options: [] },
  ],
  columns: [
    { key: "PILIHAN RAYA", header: "PILIHAN RAYA", type: "string" },
    { key: "NEGERI", header: "NEGERI", type: "string" },
    { key: "PARLIMEN", header: "PARLIMEN", type: "string" },
    { key: "ORGANISASI", header: "ORGANISASI", type: "string" },
    { key: "BILANGAN PEMERHATI", header: "BILANGAN PEMERHATI", type: "number" },
  ],
};

const TAB_VE: TabDef = {
  label: "Bilangan Program VE",
  type: "table",
  sheetSlug: "program-ve",
  filters: [{ key: "tahun", label: "Tahun", options: [] }],
  columns: [
    { key: "Tahun", header: "TAHUN", type: "string" },
    { key: "Program/ Aktiviti", header: "PROGRAM / AKTIVITI", type: "string" },
    { key: "Institusi Pendidikan", header: "INSTITUSI PENDIDIKAN", type: "string" },
    { key: "Bilangan Program", header: "BILANGAN PROGRAM", type: "number" },
    { key: "Bilangan Peserta", header: "BILANGAN PESERTA", type: "number" },
  ],
};

// ====================================================================
// ALL BAHAGIAN
// ====================================================================

export const BAHAGIAN_LIST: BahagianDef[] = [
  {
    slug: "penjalanan-pilihan-raya",
    label: "Penjalanan Pilihan Raya",
    count: 9,
    tabs: [TAB_PRU_PARLIMEN, TAB_PRU_DUN, TAB_PRK, TAB_UNDI_POS,
      { label: "Pengundi Awal", type: "empty", sheetSlug: "pengundi-awal", emptyMessage: "Data belum tersedia" },
      TAB_PENYATA_BELANJA,
      { label: "Bilangan Petugas", type: "empty", sheetSlug: "petugas", emptyMessage: "Data belum tersedia" },
      TAB_NOTIS_WARTA, TAB_SIMBOL_PARTI],
  },
  {
    slug: "pendaftaran-pemilih",
    label: "Pendaftaran Pemilih",
    count: 2,
    tabs: [TAB_DPI, TAB_DPPR],
  },
  {
    slug: "persempadanan",
    label: "Persempadanan",
    count: 5,
    tabs: [TAB_SENARAI_BPR, TAB_PUSAT_MENGUNDI, TAB_LAPORAN_KSP,
      { label: "Statistik Pertambahan BPR", type: "empty", emptyMessage: "Data akan datang" },
      { label: "Pelan Persempadanan BPR", type: "empty", emptyMessage: "Data akan datang" }],
  },
  {
    slug: "perundangan",
    label: "Perundangan",
    count: 2,
    tabs: [TAB_PERUNTUKAN, TAB_PETISYEN],
  },
  {
    slug: "pentadbiran-pengurusan",
    label: "Pentadbiran & Pengurusan",
    count: 1,
    tabs: [TAB_BAJET],
  },
  {
    slug: "pemantauan-operasi",
    label: "Pemantauan & Operasi",
    count: 2,
    tabs: [TAB_KESALAHAN, { label: "Soalan Parlimen", type: "empty", emptyMessage: "Data akan datang" }],
  },
  {
    slug: "penilaian-pemerhati",
    label: "Penilaian Pemerhati",
    count: 1,
    tabs: [TAB_PEMERHATI],
  },
  {
    slug: "akademi-pilihan-raya",
    label: "Akademi Pilihan Raya",
    count: 1,
    tabs: [TAB_VE],
  },
];
