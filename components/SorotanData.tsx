"use client";

import Link from "next/link";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

/* ---- Data ---- */

const SEATS = [
  { name: "PH", seats: 82, color: "#FF6B35" },
  { name: "PN", seats: 73, color: "#2196F3" },
  { name: "BN", seats: 30, color: "#1A237E" },
  { name: "GPS", seats: 23, color: "#4CAF50" },
  { name: "GRS", seats: 6, color: "#FF9800" },
  { name: "Lain", seats: 8, color: "#9E9E9E" },
];

const TURNOUT_DATA = [
  { name: "PRU-13", value: 75.6 },
  { name: "PRU-14", value: 84.8 },
  { name: "PRU-15", value: 73.9 },
];

const VOTERS_DATA = [
  { year: "2008", value: 10.9 },
  { year: "2013", value: 13.3 },
  { year: "2018", value: 14.9 },
  { year: "2022", value: 21.1 },
];

const totalSeats = SEATS.reduce((a, b) => a + b.seats, 0);

export default function SorotanData() {
  return (
    <section className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-end justify-between mb-8">
          <div>
            <div className="text-[11px] font-semibold text-spr-text-muted uppercase tracking-wider mb-1">
              ANALISIS
            </div>
            <h2 className="text-2xl font-bold text-spr-text">Sorotan Data</h2>
          </div>
          <Link
            href="/infografik"
            className="text-spr-primary text-sm font-medium hover:underline hidden sm:inline"
          >
            Lihat infografik →
          </Link>
        </div>

        {/* 3 Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Card 1 — Seats */}
          <div className="bg-white border border-spr-border rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-spr-text-muted">PRU-15 (2022) · Parlimen</span>
              <span className="text-spr-text-muted">🏛️</span>
            </div>
            <div className="text-[28px] font-bold text-spr-text mb-0.5">222 Kerusi</div>
            <div className="text-sm text-spr-text-secondary mb-4">
              Pembahagian mengikut koalisi
            </div>

            {/* Stacked bar */}
            <div className="flex h-5 rounded-full overflow-hidden mb-4">
              {SEATS.map((s) => (
                <div
                  key={s.name}
                  style={{
                    width: `${(s.seats / totalSeats) * 100}%`,
                    backgroundColor: s.color,
                  }}
                  title={`${s.name}: ${s.seats}`}
                />
              ))}
            </div>

            {/* Legend */}
            <div className="grid grid-cols-3 gap-y-2 gap-x-3">
              {SEATS.map((s) => (
                <div key={s.name} className="flex items-center gap-1.5">
                  <div
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: s.color }}
                  />
                  <span className="text-[11px] text-spr-text-secondary">
                    {s.name} <span className="font-semibold text-spr-text">{s.seats}</span>
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Card 2 — Turnout */}
          <div className="bg-white border border-spr-border rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-spr-text-muted">PRU-13 hingga PRU-15</span>
              <span className="text-spr-text-muted">📊</span>
            </div>
            <div className="text-[28px] font-bold text-spr-text mb-0.5">73.9%</div>
            <div className="text-sm text-spr-text-secondary mb-4">
              Kehadiran mengundi PRU-15
            </div>

            <div className="h-[120px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={TURNOUT_DATA} margin={{ top: 5, right: 5, bottom: 0, left: -20 }}>
                  <defs>
                    <linearGradient id="turnoutGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#00D4AA" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#00D4AA" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: 11, fill: "#8A8AA0" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    domain={[60, 90]}
                    tick={{ fontSize: 10, fill: "#8A8AA0" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      background: "#fff",
                      border: "1px solid #E2E2EA",
                      borderRadius: 8,
                      fontSize: 12,
                    }}
                    formatter={(value) => [`${value}%`, "Kehadiran"]}
                  />
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="#00D4AA"
                    strokeWidth={2}
                    fill="url(#turnoutGrad)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Card 3 — Voters */}
          <div className="bg-white border border-spr-border rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-spr-text-muted">2004 · 2022</span>
              <span className="text-spr-text-muted">👥</span>
            </div>
            <div className="text-[28px] font-bold text-spr-text mb-0.5">21.1 Juta</div>
            <div className="text-sm text-spr-text-secondary mb-4">
              Pemilih berdaftar 2022
            </div>

            <div className="h-[120px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={VOTERS_DATA} margin={{ top: 5, right: 5, bottom: 0, left: -20 }}>
                  <XAxis
                    dataKey="year"
                    tick={{ fontSize: 11, fill: "#8A8AA0" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 10, fill: "#8A8AA0" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      background: "#fff",
                      border: "1px solid #E2E2EA",
                      borderRadius: 8,
                      fontSize: 12,
                    }}
                    formatter={(value) => [`${value}M`, "Pemilih"]}
                  />
                  <Bar dataKey="value" fill="#581CDC" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="mt-3 inline-flex items-center gap-1 px-2.5 py-1 bg-green-50 text-green-700 rounded-full text-[11px] font-medium">
              ↑ 185% pertumbuhan dari 2004 ke 2022
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
