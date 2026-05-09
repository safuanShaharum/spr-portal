import Link from "next/link";

const SECTIONS = [
  { slug: "keputusan-pru", title: "Keputusan PRU", subtitle: "Agihan kerusi & keputusan mengikut negeri", ready: true },
  { slug: "statistik-pemilih", title: "Statistik Pemilih", subtitle: "Demografi & trend pendaftaran pemilih", ready: false },
  { slug: "peta-persempadanan", title: "Peta Persempadanan", subtitle: "Visualisasi sempadan kawasan pilihan raya", ready: false },
  { slug: "parti-politik", title: "Parti Politik", subtitle: "Senarai parti berdaftar dan simbol", ready: false },
  { slug: "pemerhati", title: "Pemerhati", subtitle: "Bilangan pemerhati mengikut pertubuhan", ready: false },
  { slug: "akademi", title: "Pendidikan Pengundi", subtitle: "Bilangan program pendidikan pengundi dan peserta mengikut tahun", ready: false },
  { slug: "persempadanan", title: "Persempadanan", subtitle: "Bil. PM, PPC, PPRU mengikut tahun", ready: false },
  { slug: "perundangan", title: "Perundangan", subtitle: "Bilangan petisyen mengikut tahun", ready: false },
  { slug: "pemantauan", title: "Kesalahan Pilihan Raya", subtitle: "Bilangan kesalahan PR mengikut kategori", ready: false },
];

interface Props {
  activeSlug: string;
  onSelect: (slug: string) => void;
}

export default function DashboardSidebar({ activeSlug, onSelect }: Props) {
  return (
    <aside className="w-[260px] shrink-0 hidden lg:block">
      <div className="sticky top-28 max-h-[calc(100vh-8rem)] overflow-y-auto pr-2">
        <div className="text-[11px] font-semibold text-spr-text-muted uppercase tracking-wider mb-3 px-3">
          Dashboard
        </div>
        <nav className="space-y-0.5">
          {SECTIONS.map((s) => (
            <button
              key={s.slug}
              onClick={() => onSelect(s.slug)}
              className={`w-full text-left px-3 py-3 rounded-r-lg transition-all ${
                activeSlug === s.slug
                  ? "border-l-[3px] border-spr-primary bg-spr-primary-50"
                  : "border-l-[3px] border-transparent hover:bg-spr-bg-secondary"
              }`}
            >
              <div className={`text-sm font-semibold ${activeSlug === s.slug ? "text-spr-primary" : "text-spr-text"}`}>
                {s.title}
              </div>
              <div className="text-xs text-spr-text-muted mt-0.5 leading-relaxed">{s.subtitle}</div>
            </button>
          ))}
        </nav>
        <Link href="/" className="flex items-center gap-2 px-3 py-3 mt-6 text-sm text-spr-text-muted hover:text-spr-primary transition-colors">
          <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M19 12H5M12 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Kembali ke Utama
        </Link>
      </div>
    </aside>
  );
}

export { SECTIONS };
