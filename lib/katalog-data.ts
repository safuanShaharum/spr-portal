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
  type: "table" | "grid-parti" | "grid-document" | "grid-document-remote" | "empty";
  modalType?: "election" | "detail";
  sheetSlug?: string;
  apiExtraParams?: Record<string, string>;
  columns?: ColumnDef[];
  filters?: FilterDef[];
  documents?: { title: string; year?: string; status?: string }[];
  remoteEndpoint?: string; // for type: "grid-document-remote"
  emptyMessage?: string;
  yearRange?: string;
  description?: string;
  tooltip?: string;
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
  description: "Keputusan rasmi Pilihan Raya Umum bagi setiap kerusi parlimen termasuk calon menang, parti, jumlah undi dan majoriti.",
  type: "table",
  modalType: "election",
  sheetSlug: "keputusan-pru",
  apiExtraParams: { jenisCalon: "Parlimen", statusCalon: "MNG" },
  filters: [
    { key: "tahun", label: "Tahun PRU", options: [] },
    { key: "negeri", label: "Negeri", options: [] },
    { key: "kawasan", label: "Kawasan", options: [] },
  ],
  columns: [
    { key: "TAHUN PILIHAN RAYA", header: "TAHUN", type: "string" },
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
  description: "Keputusan rasmi Pilihan Raya Umum bagi setiap kerusi Dewan Undangan Negeri termasuk calon menang, parti dan majoriti.",
  type: "table",
  modalType: "election",
  sheetSlug: "keputusan-dun",
  apiExtraParams: { statusCalon: "MNG" },
  filters: [
    { key: "tahun", label: "Tahun PRU", options: [] },
    { key: "negeri", label: "Negeri", options: [] },
    { key: "kawasan", label: "Kawasan", options: [] },
  ],
  columns: [
    { key: "TAHUN PILIHAN RAYA", header: "TAHUN", type: "string" },
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
  description: "Keputusan Pilihan Raya Kecil di kawasan parlimen dan DUN termasuk calon menang, parti dan majoriti.",
  type: "table",
  modalType: "election",
  sheetSlug: "keputusan-prk",
  apiExtraParams: { statusCalon: "MENANG" },
  filters: [
    { key: "tahun", label: "Tahun", options: [] },
    { key: "negeri", label: "Negeri", options: [] },
  ],
  columns: [
    { key: "TAHUN PILIHAN RAYA", header: "TAHUN", type: "string" },
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
  description: "Bilangan pengundi pos mengikut kategori 1A (Petugas SPR, Media, Tentera, Polis, Anggota/Pegawai SPR), 1B Luar Negara, 1C (Agensi/Organisasi yang diluluskan SPR).",
  type: "table",
  sheetSlug: "undi-pos",
  filters: [
    { key: "pilihanRaya", label: "Pilihan Raya", options: [] },
    { key: "negeri", label: "Negeri", options: [] },
  ],
  columns: [
    { key: "TAHUN PILIHAN RAYA", header: "TAHUN", type: "string" },
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

const TAB_NOTIS_WARTA: TabDef = {
  label: "Notis Warta Belanja PR",
  description: "Senarai notis warta penyerahan penyata belanja calon dan ejen pilihan raya mengikut kawasan.",
  type: "table",
  sheetSlug: "notis-warta",
  filters: [
    { key: "tahun", label: "Tahun", options: [] },
    { key: "negeri", label: "Negeri", options: [] },
  ],
  columns: [
    { key: "TAHUN PILIHAN RAYA", header: "TAHUN", type: "string" },
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
  description: "Senarai parti politik berdaftar di Malaysia beserta simbol rasmi.",
  type: "grid-parti",
};

// ====================================================================
// BAHAGIAN 2-8
// ====================================================================

const TAB_DPI: TabDef = {
  label: "Statistik Daftar Pemilih Induk (DPI)",
  description: "Bilangan pemilih berdaftar dalam Daftar Pemilih Induk mengikut negeri, parlimen, DUN, daerah mengundi, kumpulan umur dan jantina.",
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

// TODO: Re-enable DPPR after SPR provides updated data (amendment R2 #22)
// HIDDEN (SPR request): TAB_DPPR removed from "Pendaftaran Pemilih" tabs; kept here for restore.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const TAB_DPPR: TabDef = {
  label: "Statistik Daftar Pemilih Pilihan Raya (DPPR)",
  description: "Bilangan pemilih berdaftar dalam Daftar Pemilih Pilihan Raya mengikut negeri, parlimen, DUN, daerah mengundi, kumpulan umur dan jantina untuk setiap pilihan raya.",
  type: "empty",
  emptyMessage: "Data DPPR sedang dikemaskini.",
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
  tooltip: "Senarai Bahagian Pilihan Raya (BPR)",
  description: "Senarai Bahagian Pilihan Raya (BPR) seluruh Malaysia mengikut negeri, parlimen, DUN dan daerah mengundi.",
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
  label: "Statistik PM/PPC/PPRU",
  tooltip: "Statistik Pusat Mengundi (PM) / Pusat Penamaan Calon (PPC) / Pusat Penjumlahan Rasmi Undi (PPRU)",
  description: "Bilangan Pusat Mengundi (PM), Pusat Penamaan Calon (PPC) dan Pusat Penjumlahan Rasmi Undi (PPRU) mengikut tahun dan kawasan.",
  type: "table",
  sheetSlug: "pusat-mengundi",
  filters: [
    { key: "tahun", label: "Tahun", options: [] },
    { key: "negeri", label: "Negeri", options: [] },
  ],
  columns: [
    { key: "TAHUN PILIHAN RAYA", header: "TAHUN", type: "string" },
    { key: "PILIHAN RAYA", header: "PILIHAN RAYA", type: "string" },
    { key: "NEGERI", header: "NEGERI", type: "string" },
    { key: "PARLIMEN", header: "PARLIMEN", type: "string" },
    { key: "DUN", header: "DUN", type: "string" },
    { key: "BIL. PUSAT MENGUNDI", header: "BIL. PUSAT MENGUNDI", type: "number" },
    { key: "BIL. PUSAT PENAMAAN CALON (PPC)", header: "BIL. PPC", type: "number" },
    { key: "BIL. PUSAT PERJUMLAHAN RASMI UNDI (PPRU)", header: "BIL. PPRU", type: "number" },
  ],
};

// Amendment R2 #23: documents managed via WP ACF Options page "Perundangan"
// — SPR team add/remove via WP admin. Fetched from /api/perundangan.
const TAB_PERUNTUKAN: TabDef = {
  label: "Peruntukan Undang-undang",
  description: "Akta dan peraturan-peraturan yang mengawal selia pilihan raya di Malaysia.",
  type: "grid-document-remote",
  remoteEndpoint: "/api/perundangan",
};

const TAB_PETISYEN: TabDef = {
  label: "Petisyen Pilihan Raya",
  description: "Bilangan petisyen pilihan raya yang difailkan di mahkamah mengikut tahun, kawasan dan jenis pilihan raya.",
  type: "table",
  sheetSlug: "petisyen",
  filters: [
    { key: "tahun", label: "Tahun", options: [] },
    { key: "negeri", label: "Negeri", options: [] },
  ],
  columns: [
    { key: "TAHUN PILIHAN RAYA", header: "TAHUN", type: "string" },
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
  description: "Bajet keseluruhan pilihan raya mengikut tahun, negeri dan kawasan.",
  type: "table",
  sheetSlug: "bajet",
  filters: [
    { key: "tahun", label: "Tahun", options: [] },
    { key: "negeri", label: "Negeri", options: [] },
  ],
  columns: [
    { key: "TAHUN PILIHAN RAYA", header: "TAHUN", type: "string" },
    { key: "PILIHAN RAYA", header: "PILIHAN RAYA", type: "string" },
    { key: "NEGERI", header: "NEGERI", type: "string" },
    { key: "PARLIMEN", header: "PARLIMEN", type: "string" },
    { key: "DUN", header: "DUN", type: "string" },
    { key: "BAJET KESELURUHAN", header: "BAJET KESELURUHAN (RM)", type: "currency" },
  ],
};

const TAB_KESALAHAN: TabDef = {
  label: "Bilangan Kesalahan Pilihan Raya",
  description: "Bilangan kesalahan pilihan raya mengikut kategori (ceramah tanpa permit, bahan kempen, hari mengundi) dan kawasan.",
  type: "table",
  sheetSlug: "kesalahan",
  filters: [
    { key: "tahun", label: "Tahun", options: [] },
    { key: "negeri", label: "Negeri", options: [] },
  ],
  columns: [
    { key: "TAHUN PILIHAN RAYA", header: "TAHUN", type: "string" },
    { key: "PILIHAN RAYA", header: "PILIHAN RAYA", type: "string" },
    { key: "NEGERI", header: "NEGERI", type: "string" },
    { key: "PARLIMEN", header: "PARLIMEN", type: "string" },
    { key: "DUN", header: "DUN", type: "string" },
    { key: "KATEGORI KESALAHAN CERAMAH TANPA PERMIT", header: "CERAMAH TANPA PERMIT", type: "number" },
    { key: "KATEGORI KESALAHAN BAHAN KEMPEN", header: "BAHAN KEMPEN", type: "number" },
    { key: "KATEGORI KESALAHAN HARI MENGUNDI", header: "HARI MENGUNDI", type: "number" },
    { key: "BILANGAN", header: "BILANGAN", type: "number" },
  ],
};

const TAB_PEMERHATI: TabDef = {
  label: "Bilangan Pemerhati",
  description: "Bilangan pemerhati pilihan raya dari pertubuhan tempatan dan antarabangsa mengikut tahun dan organisasi.",
  type: "table",
  sheetSlug: "pemerhati",
  filters: [
    { key: "tahun", label: "Tahun", options: [] },
    { key: "negeri", label: "Negeri", options: [] },
  ],
  columns: [
    { key: "TAHUN PILIHAN RAYA", header: "TAHUN", type: "string" },
    { key: "PILIHAN RAYA", header: "PILIHAN RAYA", type: "string" },
    { key: "NEGERI", header: "NEGERI", type: "string" },
    { key: "PARLIMEN", header: "PARLIMEN", type: "string" },
    { key: "ORGANISASI", header: "ORGANISASI", type: "string" },
    { key: "BILANGAN PEMERHATI", header: "BILANGAN PEMERHATI", type: "number" },
  ],
};

// Amendment R2 #24: FAQ tab under Pendidikan Pengundi.
// Documents managed via WP ACF Options page "Soalan Lazim" — SPR team can
// add/remove PDFs without code changes. Frontend fetches from /api/faq
// (proxied to /wp-json/spr/v1/faq, edge-cached 5 min).
const TAB_FAQ: TabDef = {
  label: "Soalan Lazim (FAQ)",
  description: "Soalan lazim berkaitan pilihan raya dan pendidikan pengundi.",
  type: "grid-document-remote",
  remoteEndpoint: "/api/faq",
};

const TAB_VE: TabDef = {
  label: "Bilangan Program Pendidikan Pengundi",
  description: "Bilangan program pendidikan pengundi (Voter Education) mengikut institusi pendidikan dan bilangan peserta.",
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
    count: 6, // HIDDEN (SPR request): Pengundi Awal disembunyikan — restore: count 7
    tabs: [TAB_PRU_PARLIMEN, TAB_PRU_DUN, TAB_PRK, TAB_UNDI_POS,
      // HIDDEN (SPR request): uncomment to restore + bump count above to 7
      // { label: "Pengundi Awal", description: "Bilangan pengundi awal mengikut kategori dan kawasan.", type: "empty", sheetSlug: "pengundi-awal", emptyMessage: "Data belum tersedia" },
      TAB_NOTIS_WARTA, TAB_SIMBOL_PARTI],
  },
  {
    slug: "pendaftaran-pemilih",
    label: "Pendaftaran Pemilih",
    count: 1, // HIDDEN (SPR request): DPPR disembunyikan — restore: count 2
    // HIDDEN (SPR request): restore DPPR → tabs: [TAB_DPI, TAB_DPPR]
    tabs: [TAB_DPI],
  },
  {
    slug: "persempadanan",
    label: "Persempadanan",
    count: 2, // HIDDEN (SPR request): Statistik Pertambahan BPR disembunyikan — restore: count 3
    tabs: [TAB_SENARAI_BPR, TAB_PUSAT_MENGUNDI,
      // HIDDEN (SPR request): uncomment to restore + bump count above to 3
      // { label: "Statistik Pertambahan BPR", description: "Statistik pertambahan Bahagian Pilihan Raya hasil persempadanan semula mengikut tahun.", type: "empty", emptyMessage: "Data akan datang" },
    ],
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
    slug: "kesalahan-pilihan-raya",
    label: "Kesalahan Pilihan Raya",
    count: 1,
    tabs: [TAB_KESALAHAN],
  },
  {
    slug: "pemerhati-pilihan-raya",
    label: "Pemerhati Pilihan Raya",
    count: 1,
    tabs: [TAB_PEMERHATI],
  },
  {
    slug: "pendidikan-pengundi",
    label: "Pendidikan Pengundi",
    count: 1,
    tabs: [TAB_VE],
  },
  {
    slug: "soalan-lazim",
    label: "Soalan Lazim",
    count: 1,
    tabs: [TAB_FAQ],
  },
];
