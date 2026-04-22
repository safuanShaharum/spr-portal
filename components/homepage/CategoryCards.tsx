import Link from 'next/link';
import {
  BarChart3,
  Users,
  MapPin,
  Scale,
  Building2,
  Eye,
  Globe2,
  ArrowRight,
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
    title: 'Perjalanan',
    subtitle: 'Pilihan Raya',
    description:
      'Keputusan PRU, DUN, PRK — pengundi pos/awal, penyata belanja, petugas pilihan raya dan simbol parti politik.',
    icon: <BarChart3 className="w-6 h-6 text-white" />,
    datasets: 9,
    files: 124,
    href: '/katalog/perjalanan-pilihan-raya',
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
    href: '/katalog/pendaftaran-pemilih',
  },
  {
    slug: 'sempadan',
    colorClass: 'cat-sempadan',
    order: '03',
    title: 'Persempadanan',
    description: 'Senarai BPR, pusat mengundi, laporan KSP dan peta sempadan.',
    icon: <MapPin className="w-6 h-6 text-white" />,
    datasets: 5,
    href: '/katalog/persempadanan',
  },
  {
    slug: 'undang',
    colorClass: 'cat-undang',
    order: '04',
    title: 'Perundangan',
    description: 'Peruntukan perlembagaan, undang-undang pilihan raya dan petisyen.',
    icon: <Scale className="w-6 h-6 text-white" />,
    datasets: 2,
    href: '/katalog/perundangan',
  },
  {
    slug: 'tadbir',
    colorClass: 'cat-tadbir',
    order: '05',
    title: 'Pentadbiran',
    description: 'Bajet dan perbelanjaan pilihan raya mengikut tahun dan negeri.',
    icon: <Building2 className="w-6 h-6 text-white" />,
    datasets: 1,
    href: '/katalog/pentadbiran',
  },
  {
    slug: 'pantau',
    colorClass: 'cat-pantau',
    order: '06',
    title: 'Pemantauan',
    description: 'Laporan kesalahan pilihan raya dan bilangan aduan PP-KPR.',
    icon: <Eye className="w-6 h-6 text-white" />,
    datasets: 2,
    href: '/katalog/pemantauan',
  },
  {
    slug: 'antara',
    colorClass: 'cat-antara',
    order: '07',
    title: 'Dasar Antarabangsa',
    description: 'Pemerhati pilihan raya dari organisasi tempatan dan antarabangsa.',
    icon: <Globe2 className="w-6 h-6 text-white" />,
    datasets: 1,
    href: '/katalog/dasar-antarabangsa',
  },
];

export function CategoryCards() {
  const [featured, ...rest] = CATEGORIES;

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
            Tujuh <span className="italic">dunia</span> data pilihan raya.
          </h2>
          <p className="text-spr-ink/65 text-lg">
            Pilih kategori untuk mula meneroka — dari keputusan mengundi hingga perundangan,
            setiap kategori dikurasi untuk akses mudah.
          </p>
        </div>

        {/* Grid: Featured card (2x2) + 6 regular cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          <FeaturedCard category={featured} />
          {rest.map((cat) => (
            <RegularCard key={cat.slug} category={cat} />
          ))}
        </div>
      </div>
    </section>
  );
}

function FeaturedCard({ category }: { category: Category }) {
  return (
    <Link
      href={category.href}
      className={`cat-card ${category.colorClass} lift-card group col-span-1 md:col-span-2 lg:col-span-1 lg:row-span-2 bg-[var(--cat-bg)] rounded-3xl p-8 lg:p-10 relative overflow-hidden border-2 border-transparent hover:border-[var(--cat)]/20 flex flex-col`}
    >
      <div className="absolute top-0 right-0 w-72 h-72 opacity-40 pointer-events-none">
        <svg viewBox="0 0 200 200" className="w-full h-full" style={{ color: 'var(--cat)' }}>
          <circle cx="100" cy="100" r="80" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="4 6" />
          <circle cx="100" cy="100" r="50" fill="currentColor" opacity="0.1" />
        </svg>
      </div>

      <div className="relative flex flex-col flex-1">
        <div className="flex items-start justify-between mb-8">
          <div className="cat-icon-wrap" style={{ background: 'var(--cat)' }}>
            {category.icon}
          </div>
          {category.popular && (
            <span className="text-[10px] uppercase tracking-wider font-bold text-white bg-[var(--cat)] px-2.5 py-1 rounded-full">
              Popular
            </span>
          )}
        </div>

        <div className="text-[11px] uppercase tracking-[0.2em] font-bold mb-2" style={{ color: 'var(--cat)' }}>
          {category.order} / Kategori
        </div>
        <h3 className="display-serif text-4xl lg:text-5xl font-medium mb-4 leading-tight">
          {category.title}
          {category.subtitle && <> {category.subtitle}</>}
        </h3>
        <p className="text-spr-ink/70 mb-8 max-w-md leading-relaxed">{category.description}</p>

        <div className="flex items-center justify-between mt-auto">
          <div className="flex items-center gap-5 text-sm text-spr-ink/60">
            <span>
              <strong className="font-serif text-xl text-spr-ink">{category.datasets}</strong> dataset
            </span>
            {category.files && (
              <span>
                <strong className="font-serif text-xl text-spr-ink">{category.files}</strong> fail
              </span>
            )}
          </div>
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center transition group-hover:translate-x-1 text-white"
            style={{ background: 'var(--cat)' }}
          >
            <ArrowRight className="w-5 h-5" strokeWidth={2.5} />
          </div>
        </div>
      </div>
    </Link>
  );
}

function RegularCard({ category }: { category: Category }) {
  return (
    <Link
      href={category.href}
      className={`cat-card ${category.colorClass} lift-card group bg-[var(--cat-bg)] rounded-3xl p-7 relative overflow-hidden border-2 border-transparent hover:border-[var(--cat)]/20 flex flex-col`}
    >
      <div className="cat-icon-wrap mb-6" style={{ background: 'var(--cat)' }}>
        {category.icon}
      </div>
      <h3 className="display-serif text-2xl font-semibold mb-2">{category.title}</h3>
      <p className="text-spr-ink/65 text-sm mb-6 leading-relaxed flex-1">{category.description}</p>
      <div
        className="flex items-center justify-between text-sm pt-4 border-t"
        style={{ borderColor: 'color-mix(in srgb, var(--cat) 15%, transparent)' }}
      >
        <span className="text-spr-ink/60">
          <strong className="text-spr-ink">{category.datasets}</strong> dataset
        </span>
        <span className="font-semibold" style={{ color: 'var(--cat)' }}>
          Lihat →
        </span>
      </div>
    </Link>
  );
}
