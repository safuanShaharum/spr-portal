"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { incrementDownload } from "@/lib/wordpress";

const DataTable = dynamic(() => import("@/components/DataTable"), {
  ssr: false,
  loading: () => (
    <div className="space-y-3 animate-pulse">
      <div className="h-10 bg-spr-bg-tertiary rounded-lg w-full" />
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="h-8 bg-spr-bg-secondary rounded w-full" />
      ))}
    </div>
  ),
});

const MapPreview = dynamic(() => import("@/components/MapPreview"), {
  ssr: false,
  loading: () => (
    <div className="h-[400px] bg-spr-bg-secondary rounded-xl animate-pulse flex items-center justify-center">
      <div className="text-center">
        <div className="w-10 h-10 border-2 border-spr-primary border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-spr-text-muted text-sm">Memuatkan peta...</p>
      </div>
    </div>
  ),
});

interface Props {
  datasetId: number;
  format: string;
  fileUrl: string;
  previewEnabled?: boolean;
  description?: string;
  renderType: "download-button" | "tabs";
}

export default function DatasetDetailClient({
  datasetId, format, fileUrl, previewEnabled, description, renderType,
}: Props) {
  const [activeTab, setActiveTab] = useState<"preview" | "description">(
    previewEnabled ? "preview" : "description"
  );
  const [downloading, setDownloading] = useState(false);

  const handleDownload = async () => {
    setDownloading(true);
    try {
      await incrementDownload(datasetId);
      if (fileUrl) window.open(fileUrl, "_blank");
    } finally { setDownloading(false); }
  };

  if (renderType === "download-button") {
    return (
      <button onClick={handleDownload} disabled={downloading}
        className="inline-flex items-center gap-2 px-5 py-2.5 bg-spr-primary hover:bg-spr-primary-dark text-white rounded-lg font-semibold text-sm transition-colors disabled:opacity-60">
        <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        {downloading ? "Memuat turun..." : `Muat Turun ${format.toUpperCase()}`}
      </button>
    );
  }

  const fmt = format.toUpperCase();
  const isTabular = ["XLSX", "CSV", "XLS"].includes(fmt);
  const isGeo = ["KMZ", "KML"].includes(fmt);
  const showPreviewTab = previewEnabled && (isTabular || isGeo);

  const tabs = [
    ...(showPreviewTab ? [{ key: "preview" as const, label: "Preview Data" }] : []),
    { key: "description" as const, label: "Penerangan" },
  ];

  return (
    <div>
      {/* Tab headers — border-bottom style */}
      <div className="flex items-center gap-6 border-b border-spr-border mb-6">
        {tabs.map((tab) => (
          <button key={tab.key} onClick={() => setActiveTab(tab.key)}
            className={`pb-3 text-sm font-medium transition-all relative ${
              activeTab === tab.key
                ? "text-spr-primary"
                : "text-spr-text-muted hover:text-spr-text"
            }`}>
            {tab.label}
            {activeTab === tab.key && (
              <span className="absolute bottom-0 left-0 right-0 h-[3px] bg-spr-primary rounded-full" />
            )}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div>
        {activeTab === "preview" && showPreviewTab && (
          <div>
            {isTabular && <DataTable fileUrl={fileUrl} format={format} />}
            {isGeo && (
              <div>
                <div className="bg-white border border-spr-border rounded-xl overflow-hidden">
                  <MapPreview fileUrl={fileUrl} format={format} />
                </div>
                <div className="mt-4">
                  <Link href="/peta"
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-spr-primary hover:bg-spr-primary-dark text-white rounded-lg font-semibold text-sm transition-colors">
                    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    Buka Peta Interaktif Penuh
                  </Link>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === "preview" && !showPreviewTab && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-16 h-16 rounded-2xl bg-spr-bg-secondary flex items-center justify-center mb-4">
              <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-spr-text-muted" viewBox="0 0 24 24">
                <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M13 2v7h7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <p className="text-spr-text-muted text-sm mb-4">Preview tidak tersedia untuk format {format.toUpperCase()}. Sila muat turun fail.</p>
            <button onClick={handleDownload}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-spr-primary hover:bg-spr-primary-dark text-white rounded-lg font-semibold text-sm transition-colors">
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Muat Turun {format.toUpperCase()}
            </button>
          </div>
        )}

        {activeTab === "description" && (
          <div>
            {description ? (
              <div className="prose prose-sm max-w-none
                prose-headings:text-spr-navy prose-headings:font-display
                prose-p:text-spr-text prose-p:leading-relaxed
                prose-a:text-spr-primary prose-a:no-underline hover:prose-a:underline
                prose-strong:text-spr-navy
                prose-li:text-spr-text
                prose-hr:border-spr-border
                prose-blockquote:border-spr-primary prose-blockquote:text-spr-text-secondary"
                dangerouslySetInnerHTML={{ __html: description }} />
            ) : (
              <p className="text-spr-text-muted text-sm">Tiada penerangan tersedia untuk dataset ini.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
