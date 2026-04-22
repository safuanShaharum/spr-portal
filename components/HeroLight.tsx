"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const QUICK_CARDS = [
  { icon: "📊", title: "Katalog Data", subtitle: "21 set data tersedia", href: "/katalog" },
  { icon: "📈", title: "Dashboard", subtitle: "Visualisasi interaktif", href: "/dashboard" },
  { icon: "🗺️", title: "Infografik", subtitle: "Data & peta pilihan raya", href: "/infografik" },
];

const CATEGORY_PILLS = [
  "Perjalanan Pilihan Raya",
  "Pendaftaran Pemilih",
  "Persempadanan",
  "Perundangan",
  "Pentadbiran & Pengurusan",
  "Pemantauan & Operasi",
  "Dasar Antarabangsa",
];

export default function HeroLight() {
  const [query, setQuery] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/katalog?search=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <section
      className="relative overflow-hidden"
      style={{
        background: "linear-gradient(135deg, #581CDC 0%, #3D0FA0 60%, #1A1A2E 100%)",
        minHeight: "420px",
      }}
    >
      {/* Subtle pattern overlay */}
      <div className="absolute inset-0 opacity-[0.06]">
        <svg width="100%" height="100%">
          <defs>
            <pattern id="hero-grid" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M 60 0 L 0 0 0 60" fill="none" stroke="white" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#hero-grid)" />
        </svg>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-10">
        {/* Title */}
        <div className="text-center mb-8">
          <h1 className="font-display text-3xl sm:text-4xl lg:text-[40px] font-bold text-white mb-3 leading-tight">
            Portal Data Terbuka Rasmi SPR
          </h1>
          <p className="text-white/75 text-base sm:text-[16px] max-w-xl mx-auto">
            Statistik pemilih, keputusan, calon dan parti dari 1959 hingga kini.
          </p>
        </div>

        {/* Search bar */}
        <form onSubmit={handleSearch} className="max-w-2xl mx-auto mb-8">
          <div className="relative flex items-center bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="pl-4 text-spr-text-muted">
              <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="9" cy="9" r="7" />
                <path d="m14 14 4 4" strokeLinecap="round" />
              </svg>
            </div>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Cari dataset pilihan raya..."
              className="flex-1 py-4 px-3 text-spr-text placeholder:text-spr-text-muted outline-none text-sm sm:text-base bg-transparent"
            />
            <button
              type="submit"
              className="m-1.5 px-6 py-2.5 bg-spr-primary hover:bg-spr-primary-dark text-white rounded-lg font-semibold text-sm transition-colors"
            >
              Cari
            </button>
          </div>
        </form>

        {/* Quick access cards */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-8">
          {QUICK_CARDS.map((card) => (
            <Link
              key={card.title}
              href={card.href}
              className="flex items-center gap-3 px-5 py-3 bg-white/15 backdrop-blur-sm rounded-xl hover:bg-white/25 transition-colors w-full sm:w-auto"
            >
              <span className="text-2xl">{card.icon}</span>
              <div>
                <div className="text-white font-semibold text-sm">{card.title}</div>
                <div className="text-white/60 text-xs">{card.subtitle}</div>
              </div>
            </Link>
          ))}
        </div>

        {/* Category pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 justify-center flex-wrap">
          {CATEGORY_PILLS.map((cat) => (
            <Link
              key={cat}
              href={`/katalog?category=${encodeURIComponent(cat.toLowerCase().replace(/ & /g, "-").replace(/ /g, "-"))}`}
              className="shrink-0 px-4 py-2 bg-white/15 text-white text-[13px] rounded-full hover:bg-white/30 transition-colors"
            >
              {cat}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
