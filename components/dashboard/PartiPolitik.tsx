"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { PARTI_FULL_LIST, REGION_BADGE_STYLES } from "@/lib/parti-data";

type Filter = "Semua" | "Semenanjung" | "Sabah & Sarawak" | "Koalisi";
const FILTERS: Filter[] = ["Semua", "Semenanjung", "Sabah & Sarawak", "Koalisi"];

const STATS = [
  { label: "Jumlah Parti", value: 71, color: "#581CDC" },
  { label: "Semenanjung", value: PARTI_FULL_LIST.filter((p) => p.region === "Semenanjung").length, color: "#059669" },
  { label: "Sabah", value: PARTI_FULL_LIST.filter((p) => p.region === "Sabah").length, color: "#EA580C" },
  { label: "Sarawak", value: PARTI_FULL_LIST.filter((p) => p.region === "Sarawak").length, color: "#7C3AED" },
];

export default function PartiPolitik() {
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState<Filter>("Semua");

  const filtered = useMemo(() => {
    let list = PARTI_FULL_LIST;

    // Region filter
    if (activeFilter === "Semenanjung") list = list.filter((p) => p.region === "Semenanjung");
    else if (activeFilter === "Sabah & Sarawak") list = list.filter((p) => p.region === "Sabah" || p.region === "Sarawak");
    else if (activeFilter === "Koalisi") list = list.filter((p) => p.region === "Koalisi");

    // Search
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((p) =>
        p.singkatan.toLowerCase().includes(q) || p.nama.toLowerCase().includes(q)
      );
    }

    return list;
  }, [search, activeFilter]);

  const downloadCsv = () => {
    const header = "No,Singkatan,Nama Parti,Region,Warna";
    const rows = PARTI_FULL_LIST.map((p) => `${p.id},"${p.singkatan}","${p.nama}","${p.region}","${p.warna}"`);
    const blob = new Blob([header + "\n" + rows.join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "parti-politik-malaysia.csv"; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      {/* Stats cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {STATS.map((s) => (
          <div key={s.label} className="bg-white border border-spr-border rounded-xl p-5 text-center hover:shadow-md transition-all">
            <div className="font-display text-3xl font-bold text-spr-navy">{s.value}</div>
            <div className="text-sm text-spr-text-secondary mt-1">{s.label}</div>
            <div className="w-8 h-[3px] rounded-full mx-auto mt-2" style={{ backgroundColor: s.color }} />
          </div>
        ))}
      </div>

      {/* Search + Filter + Count */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          {/* Search */}
          <div className="relative w-full sm:w-[280px]">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-spr-text-muted">
              <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="6.5" cy="6.5" r="4.5" /><path d="m10 10 3.5 3.5" strokeLinecap="round" />
              </svg>
            </div>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari nama atau singkatan parti..."
              className="w-full bg-spr-bg-secondary border border-spr-border rounded-lg pl-9 pr-4 py-2.5 text-sm text-spr-text placeholder:text-spr-text-muted outline-none focus:border-spr-primary/40 transition-colors"
            />
          </div>

          {/* Filter pills */}
          <div className="flex items-center gap-1.5">
            {FILTERS.map((f) => (
              <button key={f} onClick={() => setActiveFilter(f)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                  activeFilter === f
                    ? "bg-[#E8740C] text-white border-[#E8740C]"
                    : "bg-white text-spr-text-secondary border-spr-border hover:border-[#E8740C]/40"
                }`}>
                {f}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-sm text-spr-text-muted">{filtered.length} parti</span>
          <button onClick={downloadCsv}
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#1a2332] text-white rounded-lg text-sm font-medium hover:bg-[#1a2332]/90">
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Muat Turun CSV
          </button>
        </div>
      </div>

      {/* Card grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
        {filtered.map((p) => {
          const badge = REGION_BADGE_STYLES[p.region];
          return (
            <div key={p.id}
              className="bg-white border border-spr-border rounded-xl p-4 text-center hover:shadow-md hover:border-spr-primary/20 transition-all">
              <div className="w-16 h-16 mx-auto mb-3 relative">
                <Image
                  src={`/images/parti/${p.logo}`}
                  alt={p.singkatan}
                  width={64}
                  height={64}
                  className="object-contain w-full h-full"
                  unoptimized
                />
              </div>
              <div className="text-base font-bold text-spr-navy">{p.singkatan}</div>
              <div className="text-[11px] text-spr-text-muted mt-0.5 line-clamp-2 leading-tight min-h-[28px]">
                {p.nama}
              </div>
              <span
                className="inline-block mt-2 px-2 py-0.5 rounded-full text-[10px] font-medium"
                style={{ backgroundColor: badge?.bg, color: badge?.text }}
              >
                {p.region}
              </span>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="py-16 text-center text-spr-text-muted">
          Tiada parti dijumpai untuk carian &ldquo;{search}&rdquo;.
        </div>
      )}
    </div>
  );
}
