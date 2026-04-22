"use client";

import Link from "next/link";

interface CategoryItem {
  icon: React.ReactNode;
  name: string;
  description: string;
  count: number;
  color: string;
  slug: string;
}

const CATEGORIES: CategoryItem[] = [
  {
    icon: (
      <svg width="28" height="28" fill="none" stroke="#7B4FE0" strokeWidth="1.5" viewBox="0 0 24 24">
        <path d="M9 20l-5.447-2.724A1 1 0 0 1 3 16.382V5.618a1 1 0 0 1 1.447-.894L9 7m0 13l6-3m-6 3V7m6 10l5.447 2.724A1 1 0 0 0 21 18.382V7.618a1 1 0 0 0-.553-.894L15 4m0 13V4m0 0L9 7" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    name: "Sempadan & Peta",
    description: "Data geospatial sempadan kawasan pilihan raya",
    count: 12,
    color: "#7B4FE0",
    slug: "sempadan-peta",
  },
  {
    icon: (
      <svg width="28" height="28" fill="none" stroke="#00D4AA" strokeWidth="1.5" viewBox="0 0 24 24">
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    name: "Statistik Pengundi",
    description: "Data pendaftaran dan statistik pengundi",
    count: 8,
    color: "#00D4AA",
    slug: "statistik-pengundi",
  },
  {
    icon: (
      <svg width="28" height="28" fill="none" stroke="#F0C040" strokeWidth="1.5" viewBox="0 0 24 24">
        <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2m-6 9 2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    name: "Keputusan PRU",
    description: "Keputusan pilihan raya umum & kecil",
    count: 15,
    color: "#F0C040",
    slug: "keputusan-pru",
  },
  {
    icon: (
      <svg width="28" height="28" fill="none" stroke="#FF6B6B" strokeWidth="1.5" viewBox="0 0 24 24">
        <path d="M18 20V10M12 20V4M6 20v-6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    name: "Demografi",
    description: "Data demografi pengundi mengikut kawasan",
    count: 6,
    color: "#FF6B6B",
    slug: "demografi",
  },
  {
    icon: (
      <svg width="28" height="28" fill="none" stroke="#4FC3F7" strokeWidth="1.5" viewBox="0 0 24 24">
        <path d="M3 21h18M3 7v1a3 3 0 0 0 6 0V7m0 1a3 3 0 0 0 6 0V7m0 1a3 3 0 0 0 6 0V7H3l2-4h14l2 4M5 21V10.87M19 21V10.87" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    name: "Pusat Mengundi",
    description: "Lokasi dan maklumat pusat mengundi",
    count: 4,
    color: "#4FC3F7",
    slug: "pusat-mengundi",
  },
];

export default function CategoryGrid() {
  return (
    <section className="py-16 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Section header */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <h2 className="font-display text-3xl font-bold text-spr-text">
              Kategori Data
            </h2>
            <p className="text-spr-text-muted mt-2">
              Terokai dataset mengikut kategori
            </p>
          </div>
          <Link
            href="/katalog"
            className="hidden sm:inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-spr-border text-spr-text-muted hover:text-spr-text hover:border-spr-primary/50 transition-all text-sm font-medium"
          >
            Lihat Semua
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12l5-5-5-5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </div>

        {/* Category cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.slug}
              href={`/katalog?category=${cat.slug}`}
              className="group bg-spr-card border border-spr-border rounded-2xl p-5 hover:border-opacity-100 transition-all duration-300 hover:-translate-y-0.5"
              style={{
                borderColor: 'rgba(88,28,220,0.25)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = cat.color + '60';
                e.currentTarget.style.backgroundColor = cat.color + '08';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(88,28,220,0.25)';
                e.currentTarget.style.backgroundColor = '#12122A';
              }}
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                style={{ backgroundColor: cat.color + '15' }}
              >
                {cat.icon}
              </div>
              <h3 className="text-spr-text font-semibold text-sm mb-1">
                {cat.name}
              </h3>
              <p className="text-spr-text-dim text-xs leading-relaxed mb-3">
                {cat.description}
              </p>
              <span
                className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium"
                style={{
                  backgroundColor: cat.color + '15',
                  color: cat.color,
                }}
              >
                {cat.count} dataset
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
