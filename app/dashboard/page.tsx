"use client";

import { useState } from "react";
import Link from "next/link";
import KeputusanPRU from "@/components/dashboard/KeputusanPRU";
import PartiPolitik from "@/components/dashboard/PartiPolitik";
import StatistikPemilih from "@/components/dashboard/StatistikPemilih";
import AkademiPR from "@/components/dashboard/AkademiPR";
import Perundangan from "@/components/dashboard/Perundangan";
import PemantauanOperasi from "@/components/dashboard/PemantauanOperasi";
import Pemerhati from "@/components/dashboard/Pemerhati";
import PersempadananDashboard from "@/components/dashboard/PersempadananDashboard";
import dynamic from "next/dynamic";

const PetaPersempadanan = dynamic(() => import("@/components/dashboard/PetaPersempadanan"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center bg-spr-bg-secondary rounded-xl" style={{ height: "calc(100vh - 300px)" }}>
      <div className="text-center">
        <div className="w-12 h-12 border-2 border-spr-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-spr-text-muted text-sm">Memuatkan peta...</p>
      </div>
    </div>
  ),
});

const TABS = [
  { slug: "keputusan-pru", label: "Keputusan PRU" },
  { slug: "statistik-pemilih", label: "Statistik Pemilih" },
  { slug: "peta-persempadanan", label: "Peta Persempadanan" },
  { slug: "parti-politik", label: "Parti Politik" },
  { slug: "pemerhati", label: "Pemerhati" },
  { slug: "akademi", label: "Akademi Pilihan Raya" },
  { slug: "persempadanan", label: "Persempadanan" },
  { slug: "perundangan", label: "Perundangan" },
  { slug: "pemantauan", label: "Pemantauan & Operasi" },
];

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState("keputusan-pru");

  const tab = TABS.find((t) => t.slug === activeTab) || TABS[0];
  const isMapTab = activeTab === "peta-persempadanan";

  return (
    <div>
      {/* Header */}
      <div className="bg-spr-bg-secondary py-6 sm:py-8 px-4 sm:px-6 lg:px-10">
        <div>
          <nav className="flex items-center gap-2 text-[13px] text-spr-text-muted mb-3">
            <Link href="/" className="hover:text-spr-primary transition-colors">Utama</Link>
            <span>/</span>
            <span className="text-spr-text">Dashboard</span>
            <span>/</span>
            <span className="text-spr-navy font-medium truncate">{tab.label}</span>
          </nav>
          <h1 className="font-display text-[28px] sm:text-[32px] font-bold text-spr-navy mb-4">Dashboard</h1>

          {/* Horizontal tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {TABS.map((t) => (
              <button
                key={t.slug}
                onClick={() => setActiveTab(t.slug)}
                className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium border transition-all ${
                  activeTab === t.slug
                    ? "bg-[#E8740C] text-white border-[#E8740C]"
                    : "bg-white text-spr-text-secondary border-spr-border hover:border-[#E8740C]/40 hover:text-[#E8740C]"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      {isMapTab ? (
        /* Peta: full width, no container constraint */
        <div className="py-4 px-4">
          <PetaPersempadanan />
        </div>
      ) : (
        /* Other tabs: centered container */
        <div className="px-4 sm:px-6 lg:px-10 py-6">
          {activeTab === "keputusan-pru" && <KeputusanPRU />}
          {activeTab === "statistik-pemilih" && <StatistikPemilih />}
          {activeTab === "parti-politik" && <PartiPolitik />}
          {activeTab === "akademi" && <AkademiPR />}
          {activeTab === "perundangan" && <Perundangan />}
          {activeTab === "pemantauan" && <PemantauanOperasi />}
          {activeTab === "pemerhati" && <Pemerhati />}
          {activeTab === "persempadanan" && <PersempadananDashboard />}
        </div>
      )}
    </div>
  );
}
