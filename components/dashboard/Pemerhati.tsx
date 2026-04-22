"use client";

import { useEffect, useMemo, useState } from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip } from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip);

type Row = Record<string, unknown>;
const toNum = (v: unknown) => { const n = parseInt(String(v || "0"), 10); return isNaN(n) ? 0 : n; };
const fmtNum = (n: number) => n >= 1e6 ? (n / 1e6).toFixed(1) + "J" : n >= 1000 ? (n / 1000).toFixed(1) + "K" : String(n);
const truncate = (s: string, max: number) => s.length > max ? s.slice(0, max) + "..." : s;

export default function Pemerhati() {
  const [data, setData] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterPR, setFilterPR] = useState("");
  const [filterOrg, setFilterOrg] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const PER_PAGE = 20;

  useEffect(() => {
    fetch("/api/katalog?sheet=pemerhati&limit=50000")
      .then((r) => r.json())
      .then((j) => {
        const rows = (j.data || []).filter((r: Row) => toNum(r["BILANGAN PEMERHATI"]) > 0);
        setData(rows);
      })
      .catch(() => setData([]))
      .finally(() => setLoading(false));
  }, []);

  const pilihanRayaList = useMemo(() =>
    Array.from(new Set(data.map((r) => String(r["PILIHAN RAYA"] || "").trim()))).filter(Boolean).sort(),
    [data]);
  const orgList = useMemo(() =>
    Array.from(new Set(data.map((r) => String(r["ORGANISASI"] || "").trim()))).filter(Boolean).sort(),
    [data]);

  const filtered = useMemo(() => {
    let list = data;
    if (filterPR) list = list.filter((r) => String(r["PILIHAN RAYA"] || "").trim() === filterPR);
    if (filterOrg) list = list.filter((r) => String(r["ORGANISASI"] || "").trim() === filterOrg);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((r) => String(r["ORGANISASI"] || "").toLowerCase().includes(q));
    }
    return list.sort((a, b) => toNum(b["BILANGAN PEMERHATI"]) - toNum(a["BILANGAN PEMERHATI"]));
  }, [data, filterPR, filterOrg, search]);

  const stats = useMemo(() => ({
    jumlah: filtered.reduce((s, r) => s + toNum(r["BILANGAN PEMERHATI"]), 0),
    organisasi: new Set(filtered.map((r) => String(r["ORGANISASI"] || "").trim())).size,
    pr: new Set(filtered.map((r) => String(r["PILIHAN RAYA"] || "").trim())).size,
  }), [filtered]);

  // Chart 1: Top 20 organisasi
  const top20Org = useMemo(() => {
    const map = new Map<string, number>();
    for (const r of data) {
      const org = String(r["ORGANISASI"] || "").trim();
      if (!org) continue;
      map.set(org, (map.get(org) || 0) + toNum(r["BILANGAN PEMERHATI"]));
    }
    return Array.from(map.entries()).sort((a, b) => b[1] - a[1]).slice(0, 20);
  }, [data]);

  // Chart 2: By Pilihan Raya
  const byPR = useMemo(() => {
    const map = new Map<string, number>();
    for (const r of data) {
      const pr = String(r["PILIHAN RAYA"] || "").trim();
      if (!pr) continue;
      map.set(pr, (map.get(pr) || 0) + toNum(r["BILANGAN PEMERHATI"]));
    }
    return Array.from(map.entries()).sort((a, b) => b[1] - a[1]);
  }, [data]);

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const pageData = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  if (loading) return <div className="py-20 text-center"><div className="w-10 h-10 border-2 border-spr-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" /><p className="text-spr-text-muted text-sm">Memuatkan data...</p></div>;

  return (
    <div>
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { label: "Jumlah Pemerhati", value: fmtNum(stats.jumlah), color: "#3B82F6" },
          { label: "Organisasi Terlibat", value: String(stats.organisasi), color: "#F97316" },
          { label: "Pilihan Raya", value: String(stats.pr), color: "#581CDC" },
        ].map((s) => (
          <div key={s.label} className="bg-white border border-spr-border rounded-xl p-5 hover:shadow-md transition-all">
            <div className="font-display text-2xl font-bold text-spr-navy">{s.value}</div>
            <div className="text-sm text-spr-text-secondary">{s.label}</div>
            <div className="w-8 h-[3px] rounded-full mt-2" style={{ backgroundColor: s.color }} />
          </div>
        ))}
      </div>

      {/* Chart 1: Top 20 Organisasi */}
      <div className="bg-white border border-spr-border rounded-xl p-6 mb-6">
        <h3 className="text-base font-semibold text-spr-navy mb-1">Pemerhati Mengikut Organisasi (Top 20)</h3>
        <p className="text-[11px] text-spr-text-muted mb-4">Menunjukkan 20 organisasi teratas</p>
        <div style={{ height: top20Org.length * 28 + 40 }}>
          <Bar
            data={{
              labels: top20Org.map(([org]) => truncate(org, 40)),
              datasets: [{ data: top20Org.map(([, v]) => v), backgroundColor: "#3B82F6", borderRadius: 3, barThickness: 18 }],
            }}
            options={{
              indexAxis: "y", responsive: true, maintainAspectRatio: false,
              plugins: { legend: { display: false }, tooltip: { backgroundColor: "#fff", titleColor: "#1A1A2E", bodyColor: "#5A5A72", borderColor: "#E2E2EA", borderWidth: 1, padding: 10, cornerRadius: 8, callbacks: { title: (items) => { const idx = items[0]?.dataIndex; return idx != null ? top20Org[idx]?.[0] || "" : ""; } } }, datalabels: { anchor: "end", align: "right", offset: 6, color: "#1A1A2E", font: { size: 10, weight: "bold" } } },
              scales: { x: { grid: { display: false }, ticks: { font: { size: 10 }, color: "#8A8AA0" }, max: Math.max(...top20Org.map(([, v]) => v)) * 1.2 }, y: { grid: { display: false }, ticks: { font: { size: 10 }, color: "#1A1A2E" } } },
            }}
          />
        </div>
      </div>

      {/* Chart 2: By Pilihan Raya */}
      <div className="bg-white border border-spr-border rounded-xl p-6 mb-6">
        <h3 className="text-base font-semibold text-spr-navy mb-4">Pemerhati Mengikut Pilihan Raya</h3>
        <div className="h-[260px]">
          <Bar
            data={{
              labels: byPR.map(([pr]) => truncate(pr, 30)),
              datasets: [{ data: byPR.map(([, v]) => v), backgroundColor: "#F97316", borderRadius: 4, barPercentage: 0.6 }],
            }}
            options={{
              responsive: true, maintainAspectRatio: false,
              plugins: { legend: { display: false }, tooltip: { backgroundColor: "#fff", titleColor: "#1A1A2E", bodyColor: "#5A5A72", borderColor: "#E2E2EA", borderWidth: 1, padding: 10, cornerRadius: 8, callbacks: { title: (items) => { const idx = items[0]?.dataIndex; return idx != null ? byPR[idx]?.[0] || "" : ""; } } }, datalabels: { anchor: "end", align: "end", offset: 4, color: "#1A1A2E", font: { size: 10, weight: "bold" } } },
              scales: { x: { grid: { display: false }, ticks: { font: { size: 9 }, color: "#8A8AA0", maxRotation: 45 } }, y: { grid: { color: "#F0F0F5" }, ticks: { font: { size: 11 }, color: "#8A8AA0" }, suggestedMax: Math.max(...byPR.map(([, v]) => v)) * 1.15 } },
            }}
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-spr-border rounded-xl overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-2 px-5 py-3 border-b border-spr-border-light">
          <h3 className="text-base font-semibold text-spr-navy">Senarai Pemerhati</h3>
          <div className="flex flex-wrap gap-2">
            <select value={filterPR} onChange={(e) => { setFilterPR(e.target.value); setPage(1); }} className="bg-white border border-spr-border rounded-lg px-2.5 py-1.5 text-xs outline-none cursor-pointer">
              <option value="">Semua Pilihan Raya</option>
              {pilihanRayaList.map((p) => <option key={p} value={p}>{p}</option>)}
            </select>
            <select value={filterOrg} onChange={(e) => { setFilterOrg(e.target.value); setPage(1); }} className="bg-white border border-spr-border rounded-lg px-2.5 py-1.5 text-xs outline-none cursor-pointer max-w-[180px]">
              <option value="">Semua Organisasi</option>
              {orgList.map((o) => <option key={o} value={o}>{truncate(o, 35)}</option>)}
            </select>
            <input type="text" value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} placeholder="Cari organisasi..." className="bg-white border border-spr-border rounded-lg px-2.5 py-1.5 text-xs outline-none w-36 placeholder:text-spr-text-muted" />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead><tr className="bg-[#1a2332]">
              {["PILIHAN RAYA", "NEGERI", "PARLIMEN", "ORGANISASI", "BIL. PEMERHATI"].map((h) => (
                <th key={h} className="px-4 py-2.5 text-left text-[10px] font-semibold text-white uppercase tracking-wider whitespace-nowrap">{h}</th>
              ))}
            </tr></thead>
            <tbody>
              {pageData.map((r, i) => (
                <tr key={i} className={`border-t border-spr-border-light hover:bg-spr-primary-50 ${i % 2 === 0 ? "bg-white" : "bg-[#F8FAFC]"}`}>
                  <td className="px-4 py-2 text-spr-navy font-medium whitespace-nowrap">{String(r["PILIHAN RAYA"] || "")}</td>
                  <td className="px-4 py-2 text-spr-text">{String(r["NEGERI"] || "")}</td>
                  <td className="px-4 py-2 text-spr-text">{String(r["PARLIMEN"] || "")}</td>
                  <td className="px-4 py-2 text-spr-text">{String(r["ORGANISASI"] || "")}</td>
                  <td className="px-4 py-2 text-spr-navy font-semibold">{toNum(r["BILANGAN PEMERHATI"]).toLocaleString()}</td>
                </tr>
              ))}
              {pageData.length === 0 && <tr><td colSpan={5} className="px-4 py-8 text-center text-spr-text-muted">Tiada data.</td></tr>}
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
