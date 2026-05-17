'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Database, BarChart3, Image as ImageIcon, ArrowRight, Users, MapPin, Scale, Building2, Eye, Globe2 } from 'lucide-react';
import Link from 'next/link';
import { Disclaimer } from '@/components/Disclaimer';

const CATEGORY_CHIPS = [
  { label: 'Penjalanan Pilihan Raya', href: '/katalog?bahagian=penjalanan-pilihan-raya', icon: BarChart3 },
  { label: 'Pendaftaran Pemilih',     href: '/katalog?bahagian=pendaftaran-pemilih',     icon: Users },
  { label: 'Persempadanan',           href: '/katalog?bahagian=persempadanan',           icon: MapPin },
  { label: 'Perundangan',             href: '/katalog?bahagian=perundangan',             icon: Scale },
  { label: 'Pentadbiran & Pengurusan', href: '/katalog?bahagian=pentadbiran-pengurusan', icon: Building2 },
  { label: 'Kesalahan Pilihan Raya',  href: '/katalog?bahagian=kesalahan-pilihan-raya',      icon: Eye },
  { label: 'Pemerhati Pilihan Raya',  href: '/katalog?bahagian=pemerhati-pilihan-raya',     icon: Globe2 },
];

const POPULAR_QUERIES = ['Keputusan PRU-15', 'Kadar keluar mengundi', 'Infografik PRK 2024'];

export function Hero() {
  const router = useRouter();
  const [query, setQuery] = useState('');

  function go(q: string) {
    const trimmed = q.trim();
    if (!trimmed) return;
    router.push(`/cari?q=${encodeURIComponent(trimmed)}`);
  }

  return (
    <section className="hero-bg relative min-h-[840px] pt-48 pb-32 overflow-hidden">
      {/* Decorative circles */}
      <div className="absolute top-32 right-[8%] w-64 h-64 opacity-[0.08] pointer-events-none">
        <svg viewBox="0 0 200 200" className="w-full h-full text-white">
          <circle cx="100" cy="100" r="90" fill="none" stroke="currentColor" strokeWidth="1" />
          <circle cx="100" cy="100" r="60" fill="none" stroke="currentColor" strokeWidth="1" />
          <circle cx="100" cy="100" r="30" fill="none" stroke="currentColor" strokeWidth="1" />
        </svg>
      </div>

      <div className="relative z-10 w-full px-4 sm:px-6 lg:px-10 text-center">
        {/* Eyebrow */}
        <div className="flex items-center justify-center gap-3 mb-8 reveal" style={{ animationDelay: '0.1s', opacity: 0 }}>
          <div className="h-px w-12 bg-spr-gold" />
          <span className="text-[11px] uppercase tracking-[0.28em] text-spr-gold font-medium">
            Portal Data Terbuka Rasmi
          </span>
          <div className="h-px w-12 bg-spr-gold" />
        </div>

        {/* Headline */}
        <h1
          className="display-serif text-white text-[54px] md:text-[88px] lg:text-[84px] font-normal leading-[0.95] mb-8 mx-auto max-w-5xl reveal"
          style={{ animationDelay: '0.2s', opacity: 0 }}
        >
          Portal Data Terbuka SPR
        </h1>

        {/* Subtitle */}
        <p
          className="text-white/75 text-xl md:text-2xl font-light max-w-4xl mx-auto leading-relaxed mb-12 reveal"
          style={{ animationDelay: '0.4s', opacity: 0 }}
        >
          Statistik pemilih, keputusan, calon dan parti dari{' '}
          <span className="text-spr-gold font-medium">2008 hingga kini</span>
        </p>

        <div
          className="max-w-4xl mx-auto mb-10 reveal"
          style={{ animationDelay: '0.45s', opacity: 0 }}
        >
          <Disclaimer variant="dark" />
        </div>

        {/* Search bar */}
        <form
          onSubmit={(e) => { e.preventDefault(); go(query); }}
          role="search"
          className="glass rounded-2xl p-[25px] max-w-4xl mx-auto mb-14 reveal text-left"
          style={{ animationDelay: '0.5s', opacity: 0 }}
        >
          <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-3">
            <div className="flex-1 flex items-center gap-3 px-4 bg-white rounded-xl shadow-sm">
              <Search className="w-5 h-5 text-spr-ink/40" />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Cuba cari: 'keputusan PRU-15' atau 'pemilih muda'"
                aria-label="Cari data"
                className="w-full bg-transparent text-spr-ink placeholder:text-spr-ink/40 py-4 text-base outline-none"
              />
            </div>
            <button
              type="submit"
              className="bg-spr-gold text-spr-ink w-full md:w-auto px-8 py-3.5 rounded-xl font-semibold hover:bg-amber-400 transition flex items-center justify-center gap-2 group"
            >
              <span>Cari Data</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition" />
            </button>
          </div>
          {/* Quick suggestions */}
          <div className="pt-5 mt-5 flex flex-wrap items-center justify-center gap-2 border-t border-white/10">
            <span className="text-[11px] text-white/60 uppercase tracking-wider font-semibold mr-2">Popular:</span>
            {POPULAR_QUERIES.map((q) => (
              <button
                key={q}
                type="button"
                onClick={() => go(q)}
                className="text-xs font-medium text-spr-purple-deep bg-white hover:bg-spr-gold hover:text-spr-ink px-3 py-1.5 rounded-full shadow-sm transition"
              >
                {q}
              </button>
            ))}
          </div>
        </form>

        {/* Quick access cards */}
        <div
          className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto text-left reveal"
          style={{ animationDelay: '0.7s', opacity: 0 }}
        >
          <QuickCard
            href="/katalog"
            title="Katalog Data"
            subtitle="21 set data • 7 kategori"
            icon={<Database className="w-6 h-6" />}
            bgColor="bg-spr-gold/90"
            iconColor="text-spr-ink"
          />
          <QuickCard
            href="/dashboard"
            title="Dashboard"
            subtitle="Visualisasi interaktif"
            icon={<BarChart3 className="w-6 h-6" />}
            bgColor="bg-spr-coral/90"
            iconColor="text-white"
          />
          <QuickCard
            href="/infografik-pilihan-raya"
            title="Infografik"
            subtitle="62 carta & visual"
            icon={<ImageIcon className="w-6 h-6" />}
            bgColor="bg-spr-teal/90"
            iconColor="text-white"
          />
        </div>

        {/* Category chips */}
        <div
          className="flex flex-wrap justify-center gap-2 mt-8 max-w-5xl mx-auto reveal"
          style={{ animationDelay: '0.9s', opacity: 0 }}
        >
          {CATEGORY_CHIPS.map(({ label, href, icon: Icon }) => (
            <Link
              key={label}
              href={href}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm text-white/85 bg-white/8 hover:bg-white/15 border border-white/10 hover:border-white/25 backdrop-blur transition"
            >
              <Icon className="w-4 h-4 opacity-80" strokeWidth={2} />
              {label}
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
}

function QuickCard({
  href,
  title,
  subtitle,
  icon,
  bgColor,
  iconColor,
}: {
  href: string;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  bgColor: string;
  iconColor: string;
}) {
  return (
    <Link href={href} className="glass rounded-2xl p-6 hover:bg-white/15 transition group">
      <div className="flex items-start gap-4">
        <div className={`w-12 h-12 ${bgColor} rounded-xl flex items-center justify-center ${iconColor} flex-shrink-0`}>
          {icon}
        </div>
        <div>
          <div className="text-white font-semibold text-lg group-hover:translate-x-0.5 transition">{title}</div>
          <div className="text-white/60 text-sm mt-0.5">{subtitle}</div>
        </div>
      </div>
    </Link>
  );
}
