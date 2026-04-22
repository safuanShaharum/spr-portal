"use client";

import { useState } from "react";
import { Dataset } from "@/types/dataset";
import { FORMAT_COLORS, NEGERI_LIST, getNegeriName } from "@/lib/constants";

interface RecentDatasetsProps {
  datasets: Dataset[];
}

function FormatBadge({ format }: { format: string }) {
  const color = FORMAT_COLORS[format.toUpperCase()] || "#9B97B0";
  return (
    <span
      className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wider"
      style={{ backgroundColor: color + "18", color }}
    >
      {format}
    </span>
  );
}

export default function RecentDatasets({ datasets }: RecentDatasetsProps) {
  const [activeTab, setActiveTab] = useState<"katalog" | "terkini" | "popular">("katalog");
  const [selectedNegeri, setSelectedNegeri] = useState("");

  const tabs = [
    { key: "katalog" as const, label: "Katalog" },
    { key: "terkini" as const, label: "Terkini" },
    { key: "popular" as const, label: "Popular" },
  ];

  const filteredDatasets = (datasets || []).filter((d) => {
    if (selectedNegeri && getNegeriName(d.negeri) !== selectedNegeri) return false;
    return true;
  });

  const sortedDatasets = [...filteredDatasets].sort((a, b) => {
    if (activeTab === "popular") return b.download_count - a.download_count;
    if (activeTab === "terkini") return new Date(b.date).getTime() - new Date(a.date).getTime();
    return 0;
  });

  return (
    <section className="py-16 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header with tabs */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-2 bg-spr-card rounded-xl p-1 border border-spr-border w-fit">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeTab === tab.key
                    ? "bg-spr-primary text-white"
                    : "text-spr-text-muted hover:text-spr-text"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Negeri filter */}
          <select
            value={selectedNegeri}
            onChange={(e) => setSelectedNegeri(e.target.value)}
            className="bg-spr-card border border-spr-border rounded-xl px-4 py-2.5 text-sm text-spr-text-muted outline-none focus:border-spr-primary/50 transition-colors cursor-pointer"
          >
            <option value="">Semua Negeri</option>
            {NEGERI_LIST.map((n) => (
              <option key={n.code} value={n.name}>
                {n.name}
              </option>
            ))}
          </select>
        </div>

        {/* Table */}
        <div className="bg-spr-card border border-spr-border rounded-2xl overflow-hidden">
          {/* Table header */}
          <div className="hidden sm:grid grid-cols-[1fr_100px_90px_100px_100px_50px] gap-4 px-6 py-3.5 bg-spr-surface/50 border-b border-spr-border text-xs font-semibold text-spr-text-dim uppercase tracking-wider">
            <span>Nama Dataset</span>
            <span>Format</span>
            <span>Saiz</span>
            <span>Tarikh</span>
            <span>Muat Turun</span>
            <span></span>
          </div>

          {/* Rows */}
          {sortedDatasets.length > 0 ? (
            sortedDatasets.map((dataset) => (
              <div
                key={dataset.id}
                className="grid grid-cols-1 sm:grid-cols-[1fr_100px_90px_100px_100px_50px] gap-2 sm:gap-4 px-6 py-4 border-b border-spr-border/50 hover:bg-white/[0.02] transition-colors items-center"
              >
                <div>
                  <div className="text-spr-text font-medium text-sm">
                    {dataset.title}
                  </div>
                  <div className="text-spr-text-dim text-xs mt-0.5 sm:hidden">
                    {dataset.format} · {dataset.file_size}
                  </div>
                </div>
                <div className="hidden sm:block">
                  <FormatBadge format={dataset.format} />
                </div>
                <span className="hidden sm:block text-spr-text-muted text-sm">
                  {dataset.file_size}
                </span>
                <span className="hidden sm:block text-spr-text-muted text-sm">
                  {new Date(dataset.date).toLocaleDateString("ms-MY", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </span>
                <span className="hidden sm:block text-spr-text-muted text-sm">
                  {dataset.download_count.toLocaleString()}
                </span>
                <button
                  className="hidden sm:flex items-center justify-center w-8 h-8 rounded-lg hover:bg-spr-primary/10 text-spr-text-dim hover:text-spr-primary transition-colors"
                  title="Muat turun"
                >
                  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </div>
            ))
          ) : (
            <div className="px-6 py-16 text-center text-spr-text-dim">
              Tiada dataset dijumpai.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
