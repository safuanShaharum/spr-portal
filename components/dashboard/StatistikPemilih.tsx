"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip);

type Row = Record<string, unknown>;

function toNum(v: unknown): number {
  const n = parseInt(String(v || "0"), 10);
  return isNaN(n) ? 0 : n;
}

function fmtNum(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(2) + "J";
  if (n >= 1000) return (n / 1000).toFixed(1) + "K";
  return String(n);
}

interface AggRow {
  tahun: string;
  negeri: string;
  jumlah: number;
  lelaki: number;
  perempuan: number;
  belia: number;
}

export default function StatistikPemilih() {
  const [rawData, setRawData] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterTahun, setFilterTahun] = useState("");
  const [filterNegeri, setFilterNegeri] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const PER_PAGE = 15;

  // Fetch data — use latest year by default to keep payload small
  useEffect(() => {
    setLoading(true);
    // Fetch a large batch — API cap is 50000
    fetch("/api/katalog?sheet=daftar-pemilih&limit=50000")
      .then((r) => r.json())
      .then((json) => {
        setRawData(json.data || []);
        console.log("[StatistikPemilih] Rows loaded:", (json.data || []).length);
      })
      .catch(() => setRawData([]))
      .finally(() => setLoading(false));
  }, []);

  // Unique filter values
  const years = useMemo(() =>
    Array.from(new Set(rawData.map((r) => String(r["TAHUN"] || "").trim())))
      .filter(Boolean)
      .sort()
      .reverse(),
    [rawData]
  );

  const negeris = useMemo(() =>
    Array.from(new Set(rawData.map((r) => String(r["Negeri"] || "").trim())))
      .filter(Boolean)
      .sort(),
    [rawData]
  );

  // Aggregate by Tahun + Negeri
  const aggregated: AggRow[] = useMemo(() => {
    const map = new Map<string, AggRow>();
    for (const row of rawData) {
      const tahun = String(row["TAHUN"] || "").trim();
      const negeri = String(row["Negeri"] || "").trim();
      if (!tahun || !negeri) continue;

      const key = `${tahun}||${negeri}`;
      let agg = map.get(key);
      if (!agg) {
        agg = { tahun, negeri, jumlah: 0, lelaki: 0, perempuan: 0, belia: 0 };
        map.set(key, agg);
      }
      agg.jumlah += toNum(row["PEMILIH BERDAFTAR"]);
      agg.lelaki += toNum(row["LELAKI"]);
      agg.perempuan += toNum(row["PEREMPUAN"]);
      agg.belia += toNum(row["18-20 TAHUN"]) + toNum(row["21-30 TAHUN"]);
    }
    return Array.from(map.values());
  }, [rawData]);

  // Filtered aggregated data
  const filtered = useMemo(() => {
    let list = aggregated;
    if (filterTahun) list = list.filter((r) => r.tahun === filterTahun);
    if (filterNegeri) list = list.filter((r) => r.negeri === filterNegeri);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((r) => r.negeri.toLowerCase().includes(q) || r.tahun.includes(q));
    }
    return list.sort((a, b) => b.tahun.localeCompare(a.tahun) || a.negeri.localeCompare(b.negeri));
  }, [aggregated, filterTahun, filterNegeri, search]);

  // Stats from filtered data
  const stats = useMemo(() => {
    const totalJumlah = filtered.reduce((s, r) => s + r.jumlah, 0);
    const totalLelaki = filtered.reduce((s, r) => s + r.lelaki, 0);
    const totalBelia = filtered.reduce((s, r) => s + r.belia, 0);
    return {
      rekod: filtered.length,
      jumlah: totalJumlah,
      lelakiPct: totalJumlah > 0 ? ((totalLelaki / totalJumlah) * 100).toFixed(1) : "0",
      beliaPct: totalJumlah > 0 ? ((totalBelia / totalJumlah) * 100).toFixed(1) : "0",
      lelakiCount: totalLelaki,
      beliaCount: totalBelia,
    };
  }, [filtered]);

  // Chart data: aggregate by negeri (from filtered)
  const chartData = useMemo(() => {
    const byNegeri = new Map<string, number>();
    for (const r of filtered) {
      byNegeri.set(r.negeri, (byNegeri.get(r.negeri) || 0) + r.jumlah);
    }
    return Array.from(byNegeri.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([negeri, jumlah]) => ({ negeri, jumlah }));
  }, [filtered]);

  // Pagination
  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const pageData = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const resetFilters = useCallback(() => {
    setFilterTahun("");
    setFilterNegeri("");
    setSearch("");
    setPage(1);
  }, []);

  // CSV download
  const downloadCsv = () => {
    const header = "TAHUN,NEGERI,JUMLAH PEMILIH,LELAKI,PEREMPUAN,BELIA (18-30)";
    const rows = filtered.map((r) => `${r.tahun},"${r.negeri}",${r.jumlah},${r.lelaki},${r.perempuan},${r.belia}`);
    const blob = new Blob([header + "\n" + rows.join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "statistik-pemilih.csv"; a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="py-20 text-center">
        <div className="w-10 h-10 border-2 border-spr-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-spr-text-muted text-sm">Memuatkan data pemilih (107K rekod)...</p>
      </div>
    );
  }

  return (
    <div>
      {/* Stats cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Jumlah Rekod", value: stats.rekod.toLocaleString(), sub: "Rekod ditapis", color: "#581CDC" },
          { label: "Jumlah Pemilih", value: fmtNum(stats.jumlah), sub: "Dalam paparan semasa", color: "#3B82F6" },
          { label: "Lelaki", value: stats.lelakiPct + "%", sub: fmtNum(stats.lelakiCount) + " pemilih", color: "#059669" },
          { label: "Belia (18-30)", value: stats.beliaPct + "%", sub: fmtNum(stats.beliaCount) + " pemilih", color: "#F59E0B" },
        ].map((s) => (
          <div key={s.label} className="bg-white border border-spr-border rounded-xl p-5 hover:shadow-md transition-all">
            <div className="font-display text-2xl font-bold text-spr-navy">{s.value}</div>
            <div className="text-sm font-medium text-spr-text-secondary">{s.label}</div>
            <div className="text-xs text-spr-text-muted mt-1">{s.sub}</div>
            <div className="w-8 h-[3px] rounded-full mt-2" style={{ backgroundColor: s.color }} />
          </div>
        ))}
      </div>

      {/* Stacked: Chart then Table */}
      <div className="space-y-6">
        {/* Left: Bar chart */}
        <div className="bg-white border border-spr-border rounded-xl p-6">
          <h3 className="text-lg font-semibold text-spr-navy mb-1">Pemilih Mengikut Negeri</h3>
          <p className="text-xs text-spr-text-muted mb-4">
            Agihan {filterTahun || "semua tahun"}
          </p>
          {chartData.length > 0 ? (
            <div style={{ height: chartData.length * 32 + 40 }}>
              <Bar
                data={{
                  labels: chartData.map((d) => d.negeri),
                  datasets: [{
                    data: chartData.map((d) => d.jumlah),
                    backgroundColor: "#3B82F6",
                    borderRadius: 4,
                    barThickness: 20,
                  }],
                }}
                options={{
                  indexAxis: "y",
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: { display: false },
                    tooltip: {
                      backgroundColor: "#fff", titleColor: "#1A1A2E", bodyColor: "#5A5A72",
                      borderColor: "#E2E2EA", borderWidth: 1, padding: 10, cornerRadius: 8,
                      callbacks: { label: (ctx) => fmtNum(ctx.raw as number) + " pemilih" },
                    },
                    datalabels: {
                      anchor: "end", align: "right", offset: 6,
                      color: "#1A1A2E", font: { size: 11, weight: "bold" },
                      formatter: (v: number) => fmtNum(v),
                    },
                  },
                  scales: {
                    x: {
                      grid: { display: false },
                      ticks: { font: { size: 10 }, color: "#8A8AA0", callback: (v) => fmtNum(v as number) },
                      max: Math.max(...chartData.map((d) => d.jumlah)) * 1.2,
                    },
                    y: {
                      grid: { display: false },
                      ticks: { font: { size: 11 }, color: "#1A1A2E" },
                    },
                  },
                }}
              />
            </div>
          ) : (
            <p className="text-spr-text-muted text-sm py-8 text-center">Tiada data.</p>
          )}
        </div>

        {/* Right: Table */}
        <div className="bg-white border border-spr-border rounded-xl overflow-hidden">
          <div className="flex items-center justify-between px-5 py-3 border-b border-spr-border-light">
            <h3 className="text-base font-semibold text-spr-navy">Statistik Pemilih Berdaftar</h3>
            <button onClick={downloadCsv}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#1a2332] text-white rounded-lg text-xs font-medium hover:bg-[#1a2332]/90">
              <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              CSV
            </button>
          </div>

          {/* Filters */}
          <div className="px-5 py-3 bg-spr-bg-secondary border-b border-spr-border-light">
            <div className="text-[10px] font-semibold text-spr-text-muted uppercase tracking-wider mb-2">Penapis</div>
            <div className="flex flex-wrap items-center gap-2">
              <select value={filterTahun} onChange={(e) => { setFilterTahun(e.target.value); setPage(1); }}
                className="bg-white border border-spr-border rounded-lg px-2.5 py-1.5 text-xs text-spr-text outline-none cursor-pointer">
                <option value="">Semua Tahun</option>
                {years.map((y) => <option key={y} value={y}>{y}</option>)}
              </select>
              <select value={filterNegeri} onChange={(e) => { setFilterNegeri(e.target.value); setPage(1); }}
                className="bg-white border border-spr-border rounded-lg px-2.5 py-1.5 text-xs text-spr-text outline-none cursor-pointer">
                <option value="">Semua Negeri</option>
                {negeris.map((n) => <option key={n} value={n}>{n}</option>)}
              </select>
              <input type="text" value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                placeholder="Cari..." className="bg-white border border-spr-border rounded-lg px-2.5 py-1.5 text-xs text-spr-text placeholder:text-spr-text-muted outline-none w-28" />
              <button onClick={resetFilters} className="text-xs text-spr-primary hover:underline">Set Semula</button>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto max-h-[400px] overflow-y-auto">
            <table className="w-full text-xs">
              <thead className="sticky top-0">
                <tr className="bg-[#1a2332]">
                  {["TAHUN", "NEGERI", "JUMLAH", "LELAKI %", "PEREMPUAN %", "BELIA %"].map((h) => (
                    <th key={h} className="px-3 py-2.5 text-left text-[10px] font-semibold text-white uppercase tracking-wider whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {pageData.map((r, i) => {
                  const lelakiP = r.jumlah > 0 ? ((r.lelaki / r.jumlah) * 100).toFixed(1) : "0";
                  const perempuanP = r.jumlah > 0 ? ((r.perempuan / r.jumlah) * 100).toFixed(1) : "0";
                  const beliaP = r.jumlah > 0 ? ((r.belia / r.jumlah) * 100).toFixed(1) : "0";
                  return (
                    <tr key={`${r.tahun}-${r.negeri}`} className={`border-t border-spr-border-light hover:bg-spr-primary-50 transition-colors ${i % 2 === 0 ? "bg-white" : "bg-[#F8FAFC]"}`}>
                      <td className="px-3 py-2 font-medium text-spr-navy">{r.tahun}</td>
                      <td className="px-3 py-2 text-spr-text whitespace-nowrap">{r.negeri}</td>
                      <td className="px-3 py-2 text-spr-text font-medium">{fmtNum(r.jumlah)}</td>
                      <td className="px-3 py-2 text-spr-text">{lelakiP}%</td>
                      <td className="px-3 py-2 text-spr-text">{perempuanP}%</td>
                      <td className="px-3 py-2 text-spr-text">{beliaP}%</td>
                    </tr>
                  );
                })}
                {pageData.length === 0 && (
                  <tr><td colSpan={6} className="px-3 py-8 text-center text-spr-text-muted">Tiada data.</td></tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-5 py-3 border-t border-spr-border-light">
              <span className="text-[10px] text-spr-text-muted">{filtered.length} rekod</span>
              <div className="flex items-center gap-1">
                <button disabled={page <= 1} onClick={() => setPage(page - 1)}
                  className="px-2 py-1 rounded border border-spr-border text-[10px] disabled:opacity-30">←</button>
                <span className="text-[10px] text-spr-text-muted px-2">{page}/{totalPages}</span>
                <button disabled={page >= totalPages} onClick={() => setPage(page + 1)}
                  className="px-2 py-1 rounded border border-spr-border text-[10px] disabled:opacity-30">→</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
