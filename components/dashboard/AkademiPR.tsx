"use client";

import { useEffect, useMemo, useState } from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip } from "chart.js";
import { getCatalogData } from "@/lib/catalog";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip);

type Row = Record<string, unknown>;
const toNum = (v: unknown) => parseInt(String(v || "0"), 10) || 0;
const fmtNum = (n: number) => n >= 1_000_000 ? (n / 1e6).toFixed(1) + "J" : n >= 1000 ? (n / 1000).toFixed(1) + "K" : String(n);

const chartOpts = () => ({
  responsive: true, maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: { backgroundColor: "#fff", titleColor: "#1A1A2E", bodyColor: "#5A5A72", borderColor: "#E2E2EA", borderWidth: 1, padding: 10, cornerRadius: 8 },
    datalabels: { anchor: "end" as const, align: "end" as const, offset: 4, color: "#1A1A2E", font: { size: 10, weight: "bold" as const }, formatter: (v: number) => fmtNum(v) },
  },
  scales: {
    x: { grid: { display: false }, ticks: { font: { size: 11 }, color: "#8A8AA0", maxRotation: 0, autoSkip: false } },
    y: { grid: { color: "#F0F0F5" }, ticks: { font: { size: 11 }, color: "#8A8AA0" }, grace: "15%" as const },
  },
});

export default function AkademiPR() {
  const [data, setData] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    getCatalogData("bil-program-ve")
      .then((rows) => setData(rows as Row[]))
      .catch(() => setData([]))
      .finally(() => setLoading(false));
  }, []);

  // Filter out non-year rows (nota text in Tahun column)
  const cleanData = useMemo(() =>
    data.filter((r) => /^\d{4}$/.test(String(r["Tahun"] || "").trim())),
    [data]);

  const years = useMemo(() =>
    Array.from(new Set(cleanData.map((r) => String(r["Tahun"] || "").trim()))).sort().reverse(),
    [cleanData]);

  const yearRange = years.length > 0 ? `${years[years.length - 1]} - ${years[0]}` : "—";

  // Filtered data (shared between charts, stats, and table)
  const filtered = useMemo(() => {
    if (!selectedYear) return cleanData;
    return cleanData.filter((r) => String(r["Tahun"] || "").trim() === selectedYear);
  }, [cleanData, selectedYear]);

  const stats = useMemo(() => ({
    program: filtered.reduce((s, r) => s + toNum(r["Bilangan Program"]), 0),
    peserta: filtered.reduce((s, r) => s + toNum(r["Bilangan Peserta"]), 0),
  }), [filtered]);

  // Chart aggregation — uses filtered data (synced with table filter)
  const chartAgg = useMemo(() => {
    const src = selectedYear ? filtered : cleanData; // if no filter, show all years
    const map = new Map<string, { program: number; peserta: number }>();
    for (const r of src) {
      const yr = String(r["Tahun"] || "").trim();
      if (!yr || !/^\d{4}$/.test(yr)) continue; // skip non-year values (nota text etc)
      const e = map.get(yr) || { program: 0, peserta: 0 };
      e.program += toNum(r["Bilangan Program"]);
      e.peserta += toNum(r["Bilangan Peserta"]);
      map.set(yr, e);
    }
    return Array.from(map.entries()).sort(([a], [b]) => a.localeCompare(b));
  }, [cleanData, filtered, selectedYear]);

  const totalPages = Math.ceil(filtered.length / 15);
  const pageData = filtered.slice((page - 1) * 15, page * 15);

  if (loading) return <div className="py-20 text-center"><div className="w-10 h-10 border-2 border-spr-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" /><p className="text-spr-text-muted text-sm">Memuatkan data...</p></div>;

  return (
    <div>
      {/* Stats cards */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { label: "Jumlah Program", value: stats.program.toLocaleString(), color: "#3B82F6" },
          { label: "Jumlah Peserta", value: fmtNum(stats.peserta), color: "#F97316" },
          { label: "Tempoh Data", value: yearRange, color: "#581CDC" },
        ].map((s) => (
          <div key={s.label} className="bg-white border border-spr-border rounded-xl p-5 hover:shadow-md transition-all">
            <div className="font-display text-2xl font-bold text-spr-navy">{s.value}</div>
            <div className="text-sm text-spr-text-secondary">{s.label}</div>
            <div className="w-8 h-[3px] rounded-full mt-2" style={{ backgroundColor: s.color }} />
          </div>
        ))}
      </div>

      {/* Two charts side by side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white border border-spr-border rounded-xl p-6">
          <h3 className="text-base font-semibold text-spr-navy mb-4">Bilangan Program Mengikut Tahun</h3>
          <div className="h-[240px]">
            <Bar
              data={{
                labels: chartAgg.map(([yr]) => yr),
                datasets: [{ data: chartAgg.map(([, v]) => v.program), backgroundColor: "#3B82F6", borderRadius: 4, barPercentage: 0.5 }],
              }}
              options={chartOpts()}
            />
          </div>
        </div>
        <div className="bg-white border border-spr-border rounded-xl p-6">
          <h3 className="text-base font-semibold text-spr-navy mb-4">Bilangan Peserta Mengikut Tahun</h3>
          <div className="h-[240px]">
            <Bar
              data={{
                labels: chartAgg.map(([yr]) => yr),
                datasets: [{ data: chartAgg.map(([, v]) => v.peserta), backgroundColor: "#F97316", borderRadius: 4, barPercentage: 0.5 }],
              }}
              options={chartOpts()}
            />
          </div>
        </div>
      </div>

      <p className="text-[11px] text-spr-text-muted mb-6 italic">
        Nota: Lain-lain Institusi merujuk kepada NGO, Jawatankuasa Kejiranan Kampung, PIBG Sekolah, Pejabat ADUN.
      </p>

      {/* Table */}
      <div className="bg-white border border-spr-border rounded-xl overflow-hidden">
        <div className="flex items-center justify-between px-5 py-3 border-b border-spr-border-light">
          <h3 className="text-base font-semibold text-spr-navy">Senarai Program Pendidikan Pengundi</h3>
          <select value={selectedYear} onChange={(e) => { setSelectedYear(e.target.value); setPage(1); }}
            className="bg-white border border-spr-border rounded-lg px-2.5 py-1.5 text-xs outline-none cursor-pointer">
            <option value="">Semua Tahun</option>
            {years.map((y) => <option key={y} value={y}>{y}</option>)}
          </select>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead><tr className="bg-[#1a2332]">
              {["TAHUN", "INSTITUSI PENDIDIKAN", "BILANGAN PROGRAM", "BILANGAN PESERTA"].map((h) => (
                <th key={h} className="px-4 py-2.5 text-left text-[10px] font-semibold text-white uppercase tracking-wider whitespace-nowrap">{h}</th>
              ))}
            </tr></thead>
            <tbody>
              {pageData.map((r, i) => (
                <tr key={i} className={`border-t border-spr-border-light hover:bg-spr-primary-50 ${i % 2 === 0 ? "bg-white" : "bg-[#F8FAFC]"}`}>
                  <td className="px-4 py-2 font-medium text-spr-navy">{String(r["Tahun"] || "")}</td>
                  <td className="px-4 py-2 text-spr-text">{String(r["Institusi Pendidikan"] || "")}</td>
                  <td className="px-4 py-2 text-spr-text">{toNum(r["Bilangan Program"]).toLocaleString()}</td>
                  <td className="px-4 py-2 text-spr-text">{toNum(r["Bilangan Peserta"]).toLocaleString()}</td>
                </tr>
              ))}
              {pageData.length === 0 && <tr><td colSpan={4} className="px-4 py-8 text-center text-spr-text-muted">Tiada data.</td></tr>}
            </tbody>
          </table>
        </div>
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-5 py-3 border-t border-spr-border-light">
            <span className="text-[10px] text-spr-text-muted">{filtered.length} rekod</span>
            <div className="flex items-center gap-1">
              <button disabled={page <= 1} onClick={() => setPage(page - 1)} className="px-2 py-1 rounded border border-spr-border text-[10px] disabled:opacity-30">←</button>
              <span className="text-[10px] text-spr-text-muted px-2">{page}/{totalPages}</span>
              <button disabled={page >= totalPages} onClick={() => setPage(page + 1)} className="px-2 py-1 rounded border border-spr-border text-[10px] disabled:opacity-30">→</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
