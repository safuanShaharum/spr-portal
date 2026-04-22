"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { PageHeader } from "@/components/PageHeader";
import { DASHBOARD_TABS } from "@/lib/dashboard-tabs";
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

const TABS = DASHBOARD_TABS;

export default function DashboardPage() {
  return (
    <Suspense fallback={null}>
      <DashboardContent />
    </Suspense>
  );
}

function DashboardContent() {
  const searchParams = useSearchParams();
  const initialTab = searchParams.get("tab") || "keputusan-pru";
  const [activeTab, setActiveTab] = useState(initialTab);

  const tab = TABS.find((t) => t.slug === activeTab) || TABS[0];
  const isMapTab = activeTab === "peta-persempadanan";

  return (
    <div>
      <PageHeader
        breadcrumb={[
          { label: "Utama", href: "/" },
          { label: "Dashboard" },
          { label: tab.label },
        ]}
        title="Dashboard"
        subtitle="Visualisasi interaktif data pilihan raya — pilih kategori untuk meneroka."
        filterPills={TABS.map((t) => ({
          label: t.label,
          active: activeTab === t.slug,
          onClick: () => setActiveTab(t.slug),
        }))}
      />

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
