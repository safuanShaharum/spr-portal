'use client';

import { useState, useEffect } from 'react';
import { ArrowRight, ArrowLeft } from 'lucide-react';

interface StatRow {
  label: string;
  sublabel?: string;
  value: React.ReactNode;
}

interface Slide {
  imageUrl: string;
  imageAlt: string;
  badge: string;
  headline: React.ReactNode;
  description: string;
  summaryTitle: string;
  stats: StatRow[];
  ctaLabel: string;
  ctaHref: string;
}

const SLIDES: Slide[] = [
  {
    imageUrl: '/images/slides/slide-1.webp',
    imageAlt: 'Pemilih mengundi di pusat mengundi',
    badge: 'Pemilih • 2022',
    headline: (
      <>21.8 juta pemilih berdaftar di <span className="italic">seluruh Malaysia</span></>
    ),
    description:
      'Peningkatan 40% dari PRU-14 berikutan Undi18 yang menurunkan umur mengundi dari 21 ke 18 tahun.',
    summaryTitle: 'Ringkasan PRU-15',
    stats: [
      { label: 'Kerusi Parlimen', value: '222' },
      { label: 'Kerusi DUN', sublabel: '(Semenanjung)', value: '447' },
      { label: 'Negeri & WP', value: '13' },
      { label: 'Parti Bertanding', value: <>20<span className="text-spr-gold">+</span></> },
      { label: 'Calon Bebas', value: '108' },
    ],
    ctaLabel: 'Terokai PRU-15 secara penuh',
    ctaHref: '/katalog?bahagian=penjalanan-pilihan-raya',
  },
  {
    imageUrl: '/images/slides/slide-2.webp',
    imageAlt: 'Pemandangan bandar Kuala Lumpur',
    badge: 'Keputusan • PRU-15',
    headline: (
      <>Kerajaan Perpaduan terbentuk — <span className="italic">pertama dalam sejarah</span></>
    ),
    description:
      'PH, BN, GPS dan GRS membentuk kerajaan gabungan dengan 112 kerusi majoriti — melangkaui perbezaan ideologi politik.',
    summaryTitle: 'Agihan Kerusi',
    stats: [
      { label: 'Pakatan Harapan', value: '82' },
      { label: 'Perikatan Nasional', value: '73' },
      { label: 'Barisan Nasional', value: '30' },
      { label: 'Gabungan Parti Sarawak', value: '23' },
      { label: 'Lain-lain', value: '14' },
    ],
    ctaLabel: 'Lihat keputusan penuh',
    ctaHref: '/dashboard',
  },
  {
    imageUrl: '/images/slides/slide-3.webp',
    imageAlt: 'Rakyat Malaysia pelbagai kaum',
    badge: 'Infografik • Koleksi',
    headline: (
      <>62 infografik untuk <span className="italic">memahami Malaysia</span></>
    ),
    description:
      'Dari statistik pemilih hingga kesalahan pilihan raya — satu perpustakaan visual yang menceritakan sejarah demokrasi negara.',
    summaryTitle: 'Kategori Infografik',
    stats: [
      { label: 'Pilihan Raya Umum', value: '20' },
      { label: 'PRU DUN/DN/DU', value: '13' },
      { label: 'Pilihan Raya Kecil', value: '21' },
      { label: 'Pemerhati', value: '5' },
      { label: 'Kesalahan', value: '3' },
    ],
    ctaLabel: 'Lihat semua infografik',
    ctaHref: '/infografik-pilihan-raya',
  },
];

const AUTOPLAY_MS = 7000;

export function StorytellingCarousel() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  const goTo = (i: number) => setIndex((i + SLIDES.length) % SLIDES.length);
  const prev = () => goTo(index - 1);
  const next = () => goTo(index + 1);

  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => setIndex((i) => (i + 1) % SLIDES.length), AUTOPLAY_MS);
    return () => clearInterval(t);
  }, [paused]);

  const slide = SLIDES[index];

  return (
    <section className="py-24 bg-spr-page-bg">
      <div className="w-full px-4 sm:px-6 lg:px-10">

        {/* Header */}
        <div className="flex items-end justify-between mb-12 flex-wrap gap-4">
          <div>
            <div className="text-xs uppercase tracking-[0.24em] text-spr-purple font-semibold mb-3">
              Sekilas Pandang
            </div>
            <h2 className="display-serif text-5xl md:text-6xl font-normal leading-tight max-w-2xl">
              Malaysia & <span className="italic text-spr-purple">Pilihan Raya</span>
            </h2>
          </div>
          <div className="hidden md:flex items-center gap-2">
            <button
              onClick={prev}
              aria-label="Previous"
              className="w-12 h-12 rounded-full border-2 border-spr-ink/10 hover:border-spr-purple hover:bg-spr-purple hover:text-white transition flex items-center justify-center"
            >
              <ArrowLeft className="w-4 h-4" strokeWidth={2.5} />
            </button>
            <button
              onClick={next}
              aria-label="Next"
              className="w-12 h-12 rounded-full border-2 border-spr-ink/10 hover:border-spr-purple hover:bg-spr-purple hover:text-white transition flex items-center justify-center"
            >
              <ArrowRight className="w-4 h-4" strokeWidth={2.5} />
            </button>
          </div>
        </div>

        {/* Editorial card */}
        <div
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          className="bg-white rounded-3xl overflow-hidden shadow-[0_20px_60px_-20px_rgba(88,28,220,0.15)] grid lg:grid-cols-[1.6fr_1fr]"
        >
          {/* Image side */}
          <div className="relative h-[420px] lg:h-[520px] overflow-hidden bg-spr-purple-deep">
            <img
              key={slide.imageUrl}
              src={slide.imageUrl}
              alt={slide.imageAlt}
              className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500"
              onError={(e) => {
                // Hide broken image — fallback gradient shows through
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
            {/* Fallback gradient always present behind image */}
            <div
              className="absolute inset-0 -z-10"
              style={{
                background: 'linear-gradient(135deg, #F56E7D 0%, #581CDC 50%, #240863 100%)',
              }}
            />
            {/* Dark overlay for text legibility */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/45 to-transparent" />

            {/* Overlay content */}
            <div className="absolute inset-0 flex flex-col justify-end p-8 lg:p-10">
              <div className="inline-flex items-center gap-2 bg-spr-gold text-spr-ink text-[11px] uppercase tracking-wider font-semibold px-3 py-1.5 rounded-full mb-5 self-start">
                <span className="w-1.5 h-1.5 bg-spr-ink rounded-full" />
                {slide.badge}
              </div>
              <h3 className="display-serif text-white text-3xl lg:text-5xl font-medium leading-[1.05] mb-3 max-w-xl">
                {slide.headline}
              </h3>
              <p className="text-white/85 max-w-md">{slide.description}</p>
            </div>
          </div>

          {/* Stats panel side */}
          <div className="p-8 lg:p-12 flex flex-col">
            <div className="text-[11px] uppercase tracking-[0.24em] text-spr-purple font-bold mb-6 flex items-center gap-2">
              <span className="w-2 h-2 bg-spr-gold rounded-full" />
              {slide.summaryTitle}
            </div>

            <div className="space-y-5 flex-1">
              {slide.stats.map((stat, i) => (
                <StatRowView
                  key={`${index}-${i}`}
                  label={stat.label}
                  sublabel={stat.sublabel}
                  value={stat.value}
                  isLast={i === slide.stats.length - 1}
                />
              ))}
            </div>

            <a
              href={slide.ctaHref}
              className="mt-8 inline-flex items-center gap-2 text-spr-purple font-semibold text-sm group"
            >
              {slide.ctaLabel}
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" strokeWidth={2.5} />
            </a>
          </div>
        </div>

        {/* Dots indicator */}
        <div className="flex items-center justify-center gap-2 mt-8">
          {SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              aria-label={`Slide ${i + 1}`}
              className={`h-1.5 rounded-full transition-all ${
                i === index ? 'w-8 bg-spr-purple' : 'w-1.5 bg-spr-ink/20 hover:bg-spr-ink/40'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function StatRowView({
  label,
  sublabel,
  value,
  isLast,
}: {
  label: string;
  sublabel?: string;
  value: React.ReactNode;
  isLast?: boolean;
}) {
  return (
    <div
      className={`flex justify-between items-baseline ${
        isLast ? '' : 'pb-4 border-b border-spr-ink/10'
      }`}
    >
      <span className="text-spr-ink/70 text-sm">
        {label}
        {sublabel && <span className="text-xs opacity-60 ml-1">{sublabel}</span>}
      </span>
      <span className="display-serif text-3xl font-semibold">{value}</span>
    </div>
  );
}
