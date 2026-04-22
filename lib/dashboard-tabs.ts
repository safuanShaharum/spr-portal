export interface DashboardTab {
  slug: string;
  label: string;
}

export const DASHBOARD_TABS: DashboardTab[] = [
  { slug: "keputusan-pru", label: "Keputusan PRU" },
  { slug: "statistik-pemilih", label: "Statistik Pemilih" },
  { slug: "peta-persempadanan", label: "Peta Persempadanan" },
  { slug: "parti-politik", label: "Parti Politik" },
  { slug: "pemerhati", label: "Pemerhati" },
  { slug: "akademi", label: "Akademi Pilihan Raya" },
  { slug: "persempadanan", label: "Persempadanan" },
  { slug: "perundangan", label: "Perundangan" },
  { slug: "pemantauan", label: "Pemantauan & Operasi" },
];
