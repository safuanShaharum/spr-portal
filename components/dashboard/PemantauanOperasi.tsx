"use client";

import { useEffect, useMemo, useState } from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip, Legend } from "chart.js";
import { getCatalogData } from "@/lib/catalog";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

type Row = Record<string, unknown>;
const toNum = (v: unknown) => parseInt(String(v || "0"), 10) || 0;

function getVal(row: Row, partial: string): number {
  for (const key of Object.keys(row)) {
    if (key.includes(partial)) return toNum(row[key]);
  }
  return 0;
}

export default function PemantauanOperasi() {
  const [data, setData] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCatalogData("bil-kesalahan-pr")
      .then((rows) => setData(rows as Row[]))
      .catch(() => setData([]))
      .finally(() => setLoading(false));
  }, []);

  const parsed = useMemo(() =>
    data.map((r) => ({
      raw: r,
      pr: String(r["PILIHAN RAYA"] || "").trim(),
      negeri: String(r["NEGERI"] || "").trim(),
      parlimen: String(r["PARLIMEN"] || "").trim(),
      ceramah: getVal(r, "CERAMAH TANPA PERMIT"),
      bahanKempen: getVal(r, "BAHAN KEMPEN"),
      hariMengundi: getVal(r, "HARI MENGUNDI"),
    }))
    // Drop trailing blank rows (no Pilihan Raya) from the source data.
    .filter((r) => r.pr !== ""),
    [data]
  );

  const stats = useMemo(() => {
    const ceramah = parsed.reduce((s, r) => s + r.ceramah, 0);
    const bahan = parsed.reduce((s, r) => s + r.bahanKempen, 0);
    const hari = parsed.reduce((s, r) => s + r.hariMengundi, 0);
    return { jumlah: ceramah + bahan + hari, bahan, ceramah };
  }, [parsed]);

  // Chart: group by PILIHAN RAYA
  const chartAgg = useMemo(() => {
    const map = new Map<string, { ceramah: number; bahan: number; hari: number }>();
    for (const r of parsed) {
      if (!r.pr) continue;
      const e = map.get(r.pr) || { ceramah: 0, bahan: 0, hari: 0 };
      e.ceramah += r.ceramah;
      e.bahan += r.bahanKempen;
      e.hari += r.hariMengundi;
      map.set(r.pr, e);
    }
    return Array.from(map.entries());
  }, [parsed]);

  if (loading) return <div className="py-20 text-center"><div className="w-10 h-10 border-2 border-spr-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" /><p className="text-spr-text-muted text-sm">Memuatkan data...</p></div>;

  return (
    <div>
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { label: "Jumlah Kesalahan", value: stats.jumlah.toLocaleString(), color: "#EF4444" },
          { label: "Bahan Kempen", value: stats.bahan.toLocaleString(), color: "#F97316" },
          { label: "Ceramah Tanpa Permit", value: stats.ceramah.toLocaleString(), color: "#3B82F6" },
        ].map((s) => (
          <div key={s.label} className="bg-white border border-spr-border rounded-xl p-5 hover:shadow-md transition-all">
            <div className="font-display text-2xl font-bold text-spr-navy">{s.value}</div>
            <div className="text-sm text-spr-text-secondary">{s.label}</div>
            <div className="w-8 h-[3px] rounded-full mt-2" style={{ backgroundColor: s.color }} />
          </div>
        ))}
      </div>

      {chartAgg.length > 0 && (
        <div className="bg-white border border-spr-border rounded-xl p-6 mb-6">
          <h3 className="text-lg font-semibold text-spr-navy mb-4">Kesalahan PR Mengikut Pilihan Raya</h3>
          <div className="h-[300px]">
            <Bar
              data={{
                labels: chartAgg.map(([pr]) => pr),
                datasets: [
                  { label: "Ceramah Tanpa Permit", data: chartAgg.map(([, v]) => v.ceramah), backgroundColor: "#3B82F6", borderRadius: 4 },
                  { label: "Bahan Kempen", data: chartAgg.map(([, v]) => v.bahan), backgroundColor: "#F97316", borderRadius: 4 },
                  { label: "Hari Mengundi", data: chartAgg.map(([, v]) => v.hari), backgroundColor: "#EF4444", borderRadius: 4 },
                ],
              }}
              options={{
                responsive: true, maintainAspectRatio: false,
                plugins: { legend: { position: "bottom", labels: { font: { size: 11 }, color: "#5A5A72", usePointStyle: true, pointStyle: "circle" } }, tooltip: { backgroundColor: "#fff", titleColor: "#1A1A2E", bodyColor: "#5A5A72", borderColor: "#E2E2EA", borderWidth: 1, padding: 10, cornerRadius: 8 }, datalabels: { display: false } },
                scales: { x: { grid: { display: false }, ticks: { font: { size: 9 }, color: "#8A8AA0", maxRotation: 45 } }, y: { grid: { color: "#F0F0F5" }, ticks: { font: { size: 11 }, color: "#8A8AA0" } } },
              }}
            />
          </div>
        </div>
      )}

      <div className="bg-white border border-spr-border rounded-xl overflow-hidden">
        <div className="px-5 py-3 border-b border-spr-border-light">
          <h3 className="text-base font-semibold text-spr-navy">Senarai Kesalahan Pilihan Raya</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead><tr className="bg-[#1a2332]">
              {["PILIHAN RAYA", "NEGERI", "PARLIMEN", "CERAMAH", "BAHAN KEMPEN", "HARI MENGUNDI", "JUMLAH"].map((h) => (
                <th key={h} className="px-4 py-2.5 text-left text-[10px] font-semibold text-white uppercase tracking-wider whitespace-nowrap">{h}</th>
              ))}
            </tr></thead>
            <tbody>
              {parsed.map((r, i) => (
                <tr key={i} className={`border-t border-spr-border-light hover:bg-spr-primary-50 ${i % 2 === 0 ? "bg-white" : "bg-[#F8FAFC]"}`}>
                  <td className="px-4 py-2 text-spr-navy font-medium whitespace-nowrap">{r.pr}</td>
                  <td className="px-4 py-2 text-spr-text">{r.negeri}</td>
                  <td className="px-4 py-2 text-spr-text">{r.parlimen}</td>
                  <td className="px-4 py-2 text-spr-text">{r.ceramah}</td>
                  <td className="px-4 py-2 text-spr-text">{r.bahanKempen}</td>
                  <td className="px-4 py-2 text-spr-text">{r.hariMengundi}</td>
                  <td className="px-4 py-2 text-spr-navy font-semibold">{r.ceramah + r.bahanKempen + r.hariMengundi}</td>
                </tr>
              ))}
              {parsed.length === 0 && <tr><td colSpan={7} className="px-4 py-8 text-center text-spr-text-muted">Tiada data.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
