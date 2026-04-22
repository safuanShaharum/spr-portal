"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Hero() {
  const [query, setQuery] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/katalog?search=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <section className="relative min-h-[85vh] flex items-center justify-center pt-16 overflow-hidden">
      {/* Background grid pattern */}
      <div className="absolute inset-0 opacity-[0.04]">
        <svg width="100%" height="100%">
          <defs>
            <pattern
              id="grid"
              width="40"
              height="40"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 40 0 L 0 0 0 40"
                fill="none"
                stroke="white"
                strokeWidth="0.5"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      {/* Radial purple glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-spr-primary/10 blur-[120px] pointer-events-none" />

      <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-spr-accent/10 border border-spr-accent/20 mb-8">
          <div className="w-2 h-2 rounded-full bg-spr-accent animate-pulse" />
          <span className="text-spr-accent text-sm font-medium">
            Portal Data Terbuka
          </span>
        </div>

        {/* Heading */}
        <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
          <span className="bg-gradient-to-b from-white to-spr-text-muted bg-clip-text text-transparent">
            Suruhanjaya Pilihan Raya
          </span>
          <br />
          <span className="bg-gradient-to-b from-white to-spr-text-muted bg-clip-text text-transparent">
            Malaysia
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-spr-text-muted text-lg sm:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
          Akses data pilihan raya, sempadan kawasan, statistik pengundi dan
          keputusan PRU secara terbuka dan telus untuk rakyat Malaysia.
        </p>

        {/* Search bar */}
        <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
          <div className="relative flex items-center bg-spr-card border border-spr-border rounded-2xl overflow-hidden focus-within:border-spr-primary/50 transition-colors shadow-lg shadow-black/20">
            {/* Search icon */}
            <div className="pl-5 text-spr-text-dim">
              <svg
                width="20"
                height="20"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="9" cy="9" r="7" />
                <path d="m14 14 4 4" strokeLinecap="round" />
              </svg>
            </div>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Cari dataset... cth: sempadan parlimen, statistik pengundi"
              className="flex-1 bg-transparent py-4 px-4 text-spr-text placeholder:text-spr-text-dim outline-none text-sm sm:text-base"
            />
            <button
              type="submit"
              className="m-2 px-6 py-2.5 bg-spr-primary hover:bg-spr-primary-dark text-white rounded-xl font-semibold text-sm transition-colors"
            >
              Cari
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
