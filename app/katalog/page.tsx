"use client";

import { Suspense, useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { BAHAGIAN_LIST, ColumnDef } from "@/lib/katalog-data";
import Sidebar from "@/components/katalog/Sidebar";
import TabBar from "@/components/katalog/TabBar";
import FilterRow from "@/components/katalog/FilterRow";
import KatalogDataTable from "@/components/katalog/KatalogDataTable";
import PartiGrid from "@/components/katalog/PartiGrid";
import DocumentGrid from "@/components/katalog/DocumentGrid";
import EmptyState from "@/components/katalog/EmptyState";
import ElectionModal from "@/components/katalog/ElectionModal";
import DetailModal from "@/components/katalog/DetailModal";

export default function KatalogPage() {
  return (
    <Suspense fallback={<div className="py-20 text-center"><div className="w-10 h-10 border-2 border-spr-primary border-t-transparent rounded-full animate-spin mx-auto" /></div>}>
      <KatalogContent />
    </Suspense>
  );
}

function KatalogContent() {
  const searchParams = useSearchParams();
  const urlBahagian = searchParams.get("bahagian") || "";

  const [activeBahagianSlug, setActiveBahagianSlug] = useState(() => {
    const match = BAHAGIAN_LIST.find((b) => b.slug === urlBahagian);
    return match ? match.slug : BAHAGIAN_LIST[0].slug;
  });
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [modalRow, setModalRow] = useState<Record<string, unknown> | null>(null);

  // Sync URL param → state
  useEffect(() => {
    if (urlBahagian) {
      const match = BAHAGIAN_LIST.find((b) => b.slug === urlBahagian);
      if (match && match.slug !== activeBahagianSlug) {
        setActiveBahagianSlug(match.slug);
        setActiveTabIndex(0);
        setFilters({});
        setApiPage(1);
      }
    }
  }, [urlBahagian]); // eslint-disable-line react-hooks/exhaustive-deps

  // API data state
  const [apiData, setApiData] = useState<Record<string, unknown>[]>([]);
  const [apiColumns, setApiColumns] = useState<string[]>([]);
  const [apiFilterOptions, setApiFilterOptions] = useState<Record<string, string[]>>({});
  const [apiTotal, setApiTotal] = useState(0);
  const [apiTotalPages, setApiTotalPages] = useState(0);
  const [apiPage, setApiPage] = useState(1);
  const [apiLimit, setApiLimit] = useState(25);
  const [apiLoading, setApiLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const bahagian = useMemo(
    () => BAHAGIAN_LIST.find((b) => b.slug === activeBahagianSlug) || BAHAGIAN_LIST[0],
    [activeBahagianSlug]
  );

  const tab = bahagian.tabs[activeTabIndex] || bahagian.tabs[0];
  const usesApi = !!tab.sheetSlug;

  const handleBahagianChange = useCallback((slug: string) => {
    setActiveBahagianSlug(slug);
    setActiveTabIndex(0);
    setFilters({});
    setApiPage(1);
    setMobileMenuOpen(false);
  }, []);

  const handleTabChange = useCallback((index: number) => {
    setActiveTabIndex(index);
    setFilters({});
    setApiPage(1);
  }, []);

  const handleFilterChange = useCallback((key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setApiPage(1);
  }, []);

  const handleResetFilters = useCallback(() => {
    setFilters({});
    setApiPage(1);
  }, []);

  // Fetch from API when tab has sheetSlug
  useEffect(() => {
    if (!tab.sheetSlug) {
      setApiData([]);
      setApiColumns([]);
      setApiTotal(0);
      setApiLoading(false);
      setApiError(null);
      return;
    }

    const controller = new AbortController();
    setApiLoading(true);
    setApiError(null);

    const params = new URLSearchParams();
    params.set("sheet", tab.sheetSlug);
    params.set("page", String(apiPage));
    params.set("limit", String(apiLimit));
    if (filters.negeri) params.set("negeri", filters.negeri);
    if (filters.tahun) params.set("tahun", filters.tahun);
    if (filters.pilihanRaya) params.set("pilihanRaya", filters.pilihanRaya);

    // Add extra params from tab config (e.g. jenisCalon, statusCalon)
    if (tab.apiExtraParams) {
      Object.entries(tab.apiExtraParams).forEach(([k, v]) => params.set(k, v));
    }

    fetch(`/api/katalog?${params.toString()}`, { signal: controller.signal })
      .then((r) => {
        if (!r.ok) throw new Error(`API error: ${r.status}`);
        return r.json();
      })
      .then((json) => {
        setApiData(json.data || []);
        setApiColumns(json.columns || []);
        setApiTotal(json.total || 0);
        setApiTotalPages(json.totalPages || 0);
        if (json.filterOptions) setApiFilterOptions(json.filterOptions);
      })
      .catch((err) => {
        if (err.name !== "AbortError") {
          setApiError(err.message);
          setApiData([]);
        }
      })
      .finally(() => setApiLoading(false));

    return () => controller.abort();
  }, [tab.sheetSlug, tab.apiExtraParams, apiPage, apiLimit, filters]);

  // Build dynamic columns from API response
  const dynamicColumns: ColumnDef[] = useMemo(() => {
    // If tab has predefined columns with entries, use those
    if (tab.columns && tab.columns.length > 0) return tab.columns;
    // Otherwise auto-generate from API column names
    return apiColumns.map((key) => ({
      key,
      header: key.toUpperCase(),
      type: "string" as const,
    }));
  }, [tab.columns, apiColumns]);

  // Build dynamic filter defs: merge tab.filters with API-provided options
  const dynamicFilters = useMemo(() => {
    if (!tab.filters) return [];
    return tab.filters.map((f) => {
      if (f.options.length > 0) return f; // already has static options
      // Populate from API response
      const apiOpts = apiFilterOptions[f.key] || [];
      return { ...f, options: apiOpts };
    });
  }, [tab.filters, apiFilterOptions]);

  // For non-API tabs, use hardcoded data with client-side filtering
  const displayData = apiData;
  const isTableTab = tab.type === "table";

  return (
    <div>
      {/* Header */}
      <div className="bg-spr-bg-secondary py-6 sm:py-8 px-4 sm:px-6 lg:px-10">
        <div>
          <nav className="flex items-center gap-2 text-[13px] text-spr-text-muted mb-3">
            <Link href="/" className="hover:text-spr-primary transition-colors">Utama</Link>
            <span>/</span>
            <span className="text-spr-text">Katalog Data</span>
            <span>/</span>
            <span className="text-spr-navy font-medium truncate">{bahagian.label}</span>
          </nav>
          <h1 className="font-display text-[28px] sm:text-[32px] font-bold text-spr-navy">{bahagian.label}</h1>
          <p className="text-spr-text-secondary mt-1 text-sm">
            {bahagian.count} set data tersedia dalam bahagian ini
          </p>
        </div>
      </div>

      <div className="px-4 sm:px-6 lg:px-10 py-6">
        {/* Mobile bahagian selector — OUTSIDE flex container */}
        <div className="lg:hidden mb-4">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="w-full flex items-center justify-between px-4 py-3 bg-white border border-spr-border rounded-xl text-sm font-medium text-spr-navy"
          >
            {bahagian.label}
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"
              className={`transition-transform ${mobileMenuOpen ? "rotate-180" : ""}`}>
              <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          {mobileMenuOpen && (
            <div className="mt-1 bg-white border border-spr-border rounded-xl shadow-lg overflow-hidden z-20 relative">
              {BAHAGIAN_LIST.map((b) => (
                <button key={b.slug} onClick={() => handleBahagianChange(b.slug)}
                  className={`w-full flex items-center justify-between px-4 py-2.5 text-left text-sm hover:bg-spr-bg-secondary ${
                    b.slug === activeBahagianSlug ? "text-[#E8740C] font-semibold bg-spr-bg-secondary" : "text-spr-text-secondary"
                  }`}>
                  <span>{b.label}</span>
                  <span className="text-xs text-spr-text-muted">{b.count}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex gap-8">
          {/* Desktop sidebar */}
          <Sidebar items={BAHAGIAN_LIST} activeSlug={activeBahagianSlug} onSelect={handleBahagianChange} />

          {/* Main content */}
          <main className="flex-1 min-w-0">
            {/* Tabs */}
            {bahagian.tabs.length > 1 && (
              <TabBar
                tabs={bahagian.tabs.map((t) => t.label)}
                activeIndex={activeTabIndex}
                onSelect={handleTabChange}
              />
            )}

            {/* Filters */}
            {isTableTab && dynamicFilters.length > 0 && (
              <FilterRow
                filters={dynamicFilters}
                values={filters}
                onChange={handleFilterChange}
                onReset={handleResetFilters}
              />
            )}

            {/* Loading state */}
            {isTableTab && apiLoading && (
              <div className="py-20 text-center">
                <div className="w-10 h-10 border-2 border-spr-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                <p className="text-spr-text-muted text-sm">Memuatkan data...</p>
              </div>
            )}

            {/* Error state */}
            {isTableTab && apiError && !apiLoading && (
              <div className="py-16 text-center">
                <div className="w-14 h-14 rounded-2xl bg-red-50 flex items-center justify-center mx-auto mb-4">
                  <svg width="24" height="24" fill="none" stroke="#EF4444" strokeWidth="1.5" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M15 9l-6 6M9 9l6 6" strokeLinecap="round" />
                  </svg>
                </div>
                <h3 className="text-spr-navy font-semibold mb-1">Gagal memuatkan data</h3>
                <p className="text-spr-text-muted text-sm">{apiError}</p>
              </div>
            )}

            {/* Table content — from API or hardcoded */}
            {isTableTab && !apiLoading && !apiError && dynamicColumns.length > 0 && (
              <KatalogDataTable
                columns={dynamicColumns}
                data={displayData}
                title={tab.label}
                onRowClick={(row) => setModalRow(row)}
                // Server-side pagination for API tabs
                serverPagination={usesApi ? {
                  page: apiPage,
                  totalPages: apiTotalPages,
                  total: apiTotal,
                  limit: apiLimit,
                  onPageChange: setApiPage,
                  onLimitChange: (l) => { setApiLimit(l); setApiPage(1); },
                } : undefined}
              />
            )}

            {/* Empty table — API returned 0 rows or no columns */}
            {isTableTab && !apiLoading && !apiError && displayData.length === 0 && dynamicColumns.length === 0 && (
              <EmptyState message="Data belum tersedia" />
            )}

            {tab.type === "grid-parti" && <PartiGrid />}

            {tab.type === "grid-document" && tab.documents && (
              <DocumentGrid documents={tab.documents} />
            )}

            {tab.type === "empty" && <EmptyState message={tab.emptyMessage} />}
          </main>
        </div>
      </div>

      {/* Modals */}
      {modalRow && tab.modalType === "election" && (
        <ElectionModal row={modalRow} sheetSlug={tab.sheetSlug} onClose={() => setModalRow(null)} />
      )}
      {modalRow && tab.modalType !== "election" && dynamicColumns.length > 0 && (
        <DetailModal row={modalRow} columns={dynamicColumns} onClose={() => setModalRow(null)} />
      )}
    </div>
  );
}
