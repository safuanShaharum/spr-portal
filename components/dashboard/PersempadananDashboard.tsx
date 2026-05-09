"use client";

import { useEffect, useMemo, useState } from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip } from "chart.js";
import { getCatalogData } from "@/lib/catalog";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip);

type Row = Record<string, unknown>;
const toNum = (v: unknown) => { const n = parseInt(String(v || "0"), 10); return isNaN(n) ? 0 : n; };
const fmtNum = (n: number) => n >= 1e6 ? (n / 1e6).toFixed(1) + "J" : n >= 1000 ? (n / 1000).toFixed(1) + "K" : String(n);

export default function PersempadananDashboard() {
  const [data, setData] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterTahun, setFilterTahun] = useState("");
  const [filterNegeri, setFilterNegeri] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    getCatalogData("bil-pm-ppc-ppru")
      .then((rows) => setData(rows as Row[]))
      .catch(() => setData([]))
      .finally(() => setLoading(false));
  }, []);

  const years = useMemo(() =>
    Array.from(new Set(data.map((r) => String(r["TAHUN PILIHAN RAYA"] || "").trim()))).filter(Boolean).sort().reverse(),
    [data]);
  const negeris = useMemo(() =>
    Array.from(new Set(data.map((r) => String(r["NEGERI"] || "").trim()))).filter(Boolean).sort(),
    [data]);

  const filtered = useMemo(() => {
    let list = data;
    if (filterTahun) list = list.filter((r) => String(r["TAHUN PILIHAN RAYA"] || "").includes(filterTahun));
    if (filterNegeri) list = list.filter((r) => String(r["NEGERI"] || "").trim() === filterNegeri);
    return list.sort((a, b) => String(b["TAHUN PILIHAN RAYA"] || "").localeCompare(String(a["TAHUN PILIHAN RAYA"] || "")));
  }, [data, filterTahun, filterNegeri]);

  const stats = useMemo(() => ({
    pm: filtered.reduce((s, r) => s + toNum(r["BIL. PUSAT MENGUNDI"]), 0),
    ppc: filtered.reduce((s, r) => s + toNum(r["BIL. PUSAT PENAMAAN CALON (PPC)"]), 0),
    ppru: filtered.reduce((s, r) => s + toNum(r["BIL. PUSAT PERJUMLAHAN RASMI UNDI (PPRU)"]), 0),
  }), [filtered]);

  // Chart: PM by Pilihan Raya
  const chartAgg = useMemo(() => {
    const map = new Map<string, number>();
    for (const r of data) {
      const pr = String(r["PILIHAN RAYA"] || "").trim();
      if (!pr) continue;
      map.set(pr, (map.get(pr) || 0) + toNum(r["BIL. PUSAT MENGUNDI"]));
    }
    return Array.from(map.entries()).sort((a, b) => b[1] - a[1]);
  }, [data]);

  const totalPages = Math.ceil(filtered.length / 15);
  const pageData = filtered.slice((page - 1) * 15, page * 15);

  if (loading) return <div className="py-20 text-center"><div className="w-10 h-10 border-2 border-spr-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" /><p className="text-spr-text-muted text-sm">Memuatkan data...</p></div>;

  return (
    <div>
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { label: "Jumlah Pusat Mengundi", value: fmtNum(stats.pm), color: "#3B82F6" },
          { label: "Jumlah PPC", value: fmtNum(stats.ppc), color: "#10B981" },
          { label: "Jumlah PPRU", value: fmtNum(stats.ppru), color: "#8B5CF6" },
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
          <h3 className="text-base font-semibold text-spr-navy mb-4">Pusat Mengundi Mengikut Pilihan Raya</h3>
          <div className="h-[280px]">
            <Bar
              data={{
                labels: chartAgg.map(([pr]) => pr),
                datasets: [{ data: chartAgg.map(([, v]) => v), backgroundColor: "#3B82F6", borderRadius: 4, barPercentage: 0.6 }],
              }}
              options={{
                responsive: true, maintainAspectRatio: false,
                plugins: { legend: { display: false }, tooltip: { backgroundColor: "#fff", titleColor: "#1A1A2E", bodyColor: "#5A5A72", borderColor: "#E2E2EA", borderWidth: 1, padding: 10, cornerRadius: 8 }, datalabels: { anchor: "end", align: "end", offset: 4, color: "#1A1A2E", font: { size: 10, weight: "bold" } } },
                scales: { x: { grid: { display: false }, ticks: { font: { size: 9 }, color: "#8A8AA0", maxRotation: 45 } }, y: { grid: { color: "#F0F0F5" }, ticks: { font: { size: 11 }, color: "#8A8AA0" }, suggestedMax: Math.max(...chartAgg.map(([, v]) => v)) * 1.15 } },
              }}
            />
          </div>
        </div>
      )}

      <div className="bg-white border border-spr-border rounded-xl overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-2 px-5 py-3 border-b border-spr-border-light">
          <h3 className="text-base font-semibold text-spr-navy">Statistik PM/PPC/PPRU</h3>
          <div className="flex gap-2">
            <select value={filterTahun} onChange={(e) => { setFilterTahun(e.target.value); setPage(1); }} className="bg-white border border-spr-border rounded-lg px-2.5 py-1.5 text-xs outline-none cursor-pointer">
              <option value="">Semua Tahun</option>
              {years.map((y) => <option key={y} value={y}>{y}</option>)}
            </select>
            <select value={filterNegeri} onChange={(e) => { setFilterNegeri(e.target.value); setPage(1); }} className="bg-white border border-spr-border rounded-lg px-2.5 py-1.5 text-xs outline-none cursor-pointer">
              <option value="">Semua Negeri</option>
              {negeris.map((n) => <option key={n} value={n}>{n}</option>)}
            </select>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead><tr className="bg-[#1a2332]">
              {["PILIHAN RAYA", "NEGERI", "PARLIMEN", "DUN", "PUSAT MENGUNDI", "PPC", "PPRU"].map((h) => (
                <th key={h} className="px-4 py-2.5 text-left text-[10px] font-semibold text-white uppercase tracking-wider whitespace-nowrap">{h}</th>
              ))}
            </tr></thead>
            <tbody>
              {pageData.map((r, i) => (
                <tr key={i} className={`border-t border-spr-border-light hover:bg-spr-primary-50 ${i % 2 === 0 ? "bg-white" : "bg-[#F8FAFC]"}`}>
                  <td className="px-4 py-2 text-spr-navy font-medium whitespace-nowrap">{String(r["PILIHAN RAYA"] || "")}</td>
                  <td className="px-4 py-2 text-spr-text">{String(r["NEGERI"] || "")}</td>
                  <td className="px-4 py-2 text-spr-text">{String(r["PARLIMEN"] || "")}</td>
                  <td className="px-4 py-2 text-spr-text">{String(r["DUN"] || "")}</td>
                  <td className="px-4 py-2 text-spr-text font-medium">{toNum(r["BIL. PUSAT MENGUNDI"]).toLocaleString()}</td>
                  <td className="px-4 py-2 text-spr-text">{toNum(r["BIL. PUSAT PENAMAAN CALON (PPC)"])}</td>
                  <td className="px-4 py-2 text-spr-text">{toNum(r["BIL. PUSAT PERJUMLAHAN RASMI UNDI (PPRU)"])}</td>
                </tr>
              ))}
              {pageData.length === 0 && <tr><td colSpan={7} className="px-4 py-8 text-center text-spr-text-muted">Tiada data.</td></tr>}
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
