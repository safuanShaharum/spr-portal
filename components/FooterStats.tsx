"use client";
import { useEffect, useState } from "react";

interface Stats {
  today: number;
  month: number;
  year: number;
  downloads: number;
}

function formatNumber(n: number): string {
  return n.toLocaleString("ms-MY");
}

export default function FooterStats() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    fetch("/api/stats")
      .then((r) => r.ok ? r.json() : null)
      .then((data) => { if (data) setStats(data); })
      .catch(() => {});
  }, []);

  const items = [
    { label: "Pelawat Hari Ini", value: stats?.today ?? 0 },
    { label: "Pelawat Bulan Ini", value: stats?.month ?? 0 },
    { label: "Pelawat Tahun Ini", value: stats?.year ?? 0 },
    { label: "Jumlah Muat Turun", value: stats?.downloads ?? 0 },
  ];

  return (
    <div className="mt-12 pt-10 border-t border-white/10">
      <h4 className="text-[11px] uppercase tracking-[0.2em] text-spr-gold font-bold mb-5">
        Statistik Portal
      </h4>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {items.map((item) => (
          <div key={item.label} className="bg-white/5 rounded-xl px-5 py-4">
            <div className="text-2xl font-semibold text-white tabular-nums">
              {formatNumber(item.value)}
            </div>
            <div className="text-[11px] uppercase tracking-wider text-white/50 mt-1">
              {item.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
