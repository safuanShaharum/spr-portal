import Link from 'next/link';
import {
  BarChart3,
  Users,
  MapPin,
  Scale,
  Building2,
  Eye,
  Globe2,
  GraduationCap,
} from 'lucide-react';

interface Category {
  slug: string;
  colorClass: string;
  order: string;
  title: string;
  subtitle?: string;
  description: string;
  icon: React.ReactNode;
  datasets: number;
  files?: number;
  href: string;
  featured?: boolean;
  popular?: boolean;
}

const CATEGORIES: Category[] = [
  {
    slug: 'perjalanan',
    colorClass: 'cat-pr',
    order: '01',
    title: 'Penjalanan',
    subtitle: 'Pilihan Raya',
    description:
      'Keputusan PRU, DUN, PRK — pengundi pos/awal, penyata belanja, petugas pilihan raya dan simbol parti politik.',
    icon: <BarChart3 className="w-6 h-6 text-white" />,
    datasets: 9,
    files: 124,
    href: '/katalog?bahagian=penjalanan-pilihan-raya',
    featured: true,
    popular: true,
  },
  {
    slug: 'pendaftaran',
    colorClass: 'cat-pendaftar',
    order: '02',
    title: 'Pendaftaran Pemilih',
    description: 'Statistik pemilih mengikut negeri, parlimen, DUN, jantina dan umur.',
    icon: <Users className="w-6 h-6 text-white" />,
    datasets: 1,
    href: '/katalog?bahagian=pendaftaran-pemilih',
  },
  {
    slug: 'sempadan',
    colorClass: 'cat-sempadan',
    order: '03',
    title: 'Persempadanan',
    description: 'Senarai BPR, pusat mengundi, laporan KSP dan peta sempadan.',
    icon: <MapPin className="w-6 h-6 text-white" />,
    datasets: 5,
    href: '/katalog?bahagian=persempadanan',
  },
  {
    slug: 'undang',
    colorClass: 'cat-undang',
    order: '04',
    title: 'Perundangan',
    description: 'Peruntukan perlembagaan, undang-undang pilihan raya dan petisyen.',
    icon: <Scale className="w-6 h-6 text-white" />,
    datasets: 2,
    href: '/katalog?bahagian=perundangan',
  },
  {
    slug: 'tadbir',
    colorClass: 'cat-tadbir',
    order: '05',
    title: 'Pentadbiran & Pengurusan',
    description: 'Bajet dan perbelanjaan pilihan raya mengikut tahun dan negeri.',
    icon: <Building2 className="w-6 h-6 text-white" />,
    datasets: 1,
    href: '/katalog?bahagian=pentadbiran-pengurusan',
  },
  {
    slug: 'pantau',
    colorClass: 'cat-pantau',
    order: '06',
    title: 'Pemantauan & Operasi',
    description: 'Laporan kesalahan pilihan raya dan bilangan aduan PP-KPR.',
    icon: <Eye className="w-6 h-6 text-white" />,
    datasets: 2,
    href: '/katalog?bahagian=pemantauan-operasi',
  },
  {
    slug: 'pemerhati',
    colorClass: 'cat-antara',
    order: '07',
    title: 'Penilaian Pemerhati',
    description: 'Pemerhati pilihan raya dari organisasi tempatan dan antarabangsa.',
    icon: <Globe2 className="w-6 h-6 text-white" />,
    datasets: 1,
    href: '/katalog?bahagian=penilaian-pemerhati',
  },
  {
    slug: 'akademi',
    colorClass: 'cat-akademi',
    order: '08',
    title: 'Akademi Pilihan Raya',
    description: 'Program pendidikan pengundi (Voter Education) dan inisiatif Akademi Pilihan Raya.',
    icon: <GraduationCap className="w-6 h-6 text-white" />,
    datasets: 1,
    href: '/katalog?bahagian=akademi-pilihan-raya',
  },
];

export function CategoryCards() {
  return (
    <section className="py-24 bg-white relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[600px] h-[600px] dotted-bg opacity-50 pointer-events-none" />

      <div className="w-full px-4 sm:px-6 lg:px-10 relative">
        {/* Header */}
        <div className="mb-16">
          <div className="text-xs uppercase tracking-[0.24em] text-spr-purple font-semibold mb-3">
            Terokai Kategori
          </div>
          <h2 className="display-serif text-5xl md:text-6xl font-normal leading-tight mb-5">
            Spektrum <span className="italic text-spr-purple">data</span> pilihan raya
          </h2>
          <p className="text-spr-ink/65 text-lg">
            Pilih kategori untuk mula meneroka — dari keputusan mengundi hingga perundangan, setiap kategori dapat diakses dengan mudah.
          </p>
        </div>

        {/* Grid: 8 equal-sized cards (2 rows × 4 cols on lg) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {CATEGORIES.map((cat) => (
            <RegularCard key={cat.slug} category={cat} />
          ))}
        </div>
      </div>
    </section>
  );
}

function RegularCard({ category }: { category: Category }) {
  return (
    <Link
      href={category.href}
      className={`cat-card ${category.colorClass} lift-card group bg-[var(--cat-bg)] rounded-3xl p-7 relative overflow-hidden border-2 border-transparent hover:border-[var(--cat)]/20 flex flex-col`}
    >
      <div className="flex items-start justify-between mb-6">
        <div className="cat-icon-wrap" style={{ background: 'var(--cat)' }}>
          {category.icon}
        </div>
        {category.popular && (
          <span className="text-[10px] uppercase tracking-wider font-bold text-white bg-[var(--cat)] px-2.5 py-1 rounded-full">
            Popular
          </span>
        )}
      </div>
      <h3 className="display-serif text-2xl font-semibold mb-2">
        {category.title}
        {category.subtitle && <> {category.subtitle}</>}
      </h3>
      <p className="text-spr-ink/65 text-sm mb-6 leading-relaxed flex-1">{category.description}</p>
      <div
        className="flex items-center justify-between text-sm pt-4 border-t"
        style={{ borderColor: 'color-mix(in srgb, var(--cat) 15%, transparent)' }}
      >
        <span className="text-spr-ink/60">
          <strong className="text-spr-ink">{category.datasets}</strong> dataset
          {category.files && (
            <>
              {' · '}
              <strong className="text-spr-ink">{category.files}</strong> fail
            </>
          )}
        </span>
        <span className="font-semibold" style={{ color: 'var(--cat)' }}>
          Lihat →
        </span>
      </div>
    </Link>
  );
}
