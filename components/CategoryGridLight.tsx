import Link from "next/link";

interface CategoryItem {
  icon: string;
  iconBg: string;
  iconColor: string;
  title: string;
  description: string;
  count: number;
  slug: string;
}

const CATEGORIES: CategoryItem[] = [
  {
    icon: "🗳️",
    iconBg: "#FFF3E0",
    iconColor: "#FF8C42",
    title: "Perjalanan Pilihan Raya",
    description: "Keputusan PRU, DUN, PRK, pengundi pos/awal, penyata belanja, petugas dan simbol parti",
    count: 5,
    slug: "perjalanan-pilihan-raya",
  },
  {
    icon: "👥",
    iconBg: "#E3F2FD",
    iconColor: "#3B82F6",
    title: "Pendaftaran Pemilih",
    description: "Statistik pemilih berdaftar mengikut negeri, parlimen, DUN, jantina, umur dan kategori",
    count: 4,
    slug: "pendaftaran-pemilih",
  },
  {
    icon: "🗺️",
    iconBg: "#FFEBEE",
    iconColor: "#EF5350",
    title: "Persempadanan",
    description: "Senarai SPR, pusat mengundi, statistik KSP, laporan KSP dan peta sempadan",
    count: 3,
    slug: "persempadanan",
  },
  {
    icon: "📜",
    iconBg: "#E8F5E9",
    iconColor: "#4CAF50",
    title: "Perundangan",
    description: "Peraturan perlembagaan, undang-undang berkaitan pilihan raya dan petugas pilihan raya",
    count: 2,
    slug: "perundangan",
  },
  {
    icon: "🏛️",
    iconBg: "#F3EFFE",
    iconColor: "#581CDC",
    title: "Pentadbiran & Pengurusan",
    description: "Bajet pilihan raya mengikut tahun, negeri dan pecahan kategori perbelanjaan",
    count: 3,
    slug: "pentadbiran-pengurusan",
  },
  {
    icon: "🔍",
    iconBg: "#E0F7FA",
    iconColor: "#00BCD4",
    title: "Pemantauan & Operasi",
    description: "Laporan kesalahan pilihan raya dan bilangan aduan PP KPR mengikut kawasan dan kategori",
    count: 2,
    slug: "pemantauan-operasi",
  },
  {
    icon: "🌐",
    iconBg: "#FFF8E1",
    iconColor: "#FFA000",
    title: "Dasar Antarabangsa",
    description: "Bilangan pemerhati pilihan raya dari organisasi tempatan dan antarabangsa sejak 1959",
    count: 2,
    slug: "dasar-antarabangsa",
  },
];

export default function CategoryGridLight() {
  return (
    <section className="py-12 bg-spr-bg-secondary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-end justify-between mb-8">
          <div>
            <div className="text-[11px] font-semibold text-spr-text-muted uppercase tracking-wider mb-1">
              DATASET
            </div>
            <h2 className="text-2xl font-bold text-spr-text">Semua Kategori Data</h2>
          </div>
          <Link
            href="/katalog"
            className="text-spr-primary text-sm font-medium hover:underline hidden sm:inline"
          >
            Lihat semua →
          </Link>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {CATEGORIES.slice(0, 5).map((cat) => (
            <CategoryCard key={cat.slug} cat={cat} />
          ))}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 max-w-2xl">
          {CATEGORIES.slice(5).map((cat) => (
            <CategoryCard key={cat.slug} cat={cat} />
          ))}
        </div>
      </div>
    </section>
  );
}

function CategoryCard({ cat }: { cat: CategoryItem }) {
  return (
    <Link
      href={`/katalog?category=${cat.slug}`}
      className="group bg-white border border-spr-border rounded-xl p-5 hover:shadow-md hover:border-spr-primary/30 transition-all"
    >
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center text-lg mb-3"
        style={{ backgroundColor: cat.iconBg }}
      >
        {cat.icon}
      </div>
      <h3 className="text-sm font-semibold text-spr-text mb-1.5">{cat.title}</h3>
      <p className="text-[13px] text-spr-text-secondary leading-relaxed mb-4 line-clamp-3">
        {cat.description}
      </p>
      <div className="flex items-center justify-between">
        <span className="text-xs text-spr-text-muted">{cat.count} dataset</span>
        <span className="text-spr-primary opacity-0 group-hover:opacity-100 transition-opacity text-sm">
          →
        </span>
      </div>
    </Link>
  );
}
