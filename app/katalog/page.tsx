"use client";

import { Suspense, useCallback, useEffect, useMemo, useState } from "react";
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
import { getCatalogData } from "@/lib/catalog";
import { PageHeader } from "@/components/PageHeader";

type Row = Record<string, unknown>;

// Legacy sheet keys (from BAHAGIAN_LIST) → published JSON slug. Sheets not in
// this map fall through to the legacy /api/katalog endpoint.
const CATALOG_SLUG_MAP: Record<string, string> = {
  "keputusan-pru": "keputusan-pru",
  "keputusan-dun": "keputusan-pru-dun",
  "keputusan-prk": "keputusan-prk",
  "penyata-belanja": "test-penyata-belanja-calon-pr",
  "notis-warta": "notis-warta-belanja-pr",
  "senarai-bpr": "senarai-bpr",
  "pusat-mengundi": "bil-pm-ppc-ppru",
  "petisyen": "bil-petisyen",
  "bajet": "bajet-pr",
  "kesalahan": "bil-kesalahan-pr",
  "pemerhati": "bil-pemerhati",
  "program-ve": "bil-program-ve",
};

// `bil-pemerhati` ships as wide rows (org names as columns). Mirrors the pivot
// previously done server-side for sheet=pemerhati.
const PEMERHATI_META_COLS = new Set([
  "TAHUN PILIHAN RAYA", "PILIHAN RAYA", "NEGERI", "PARLIMEN", "DUN",
]);
function pivotPemerhati(rows: Row[]): Row[] {
  const out: Row[] = [];
  for (const row of rows) {
    for (const [key, val] of Object.entries(row)) {
      if (PEMERHATI_META_COLS.has(key)) continue;
      const num = Number(val);
      if (!isNaN(num) && num > 0) {
        out.push({
          "PILIHAN RAYA": row["PILIHAN RAYA"] || "",
          NEGERI: row["NEGERI"] || "",
          PARLIMEN: row["PARLIMEN"] || "",
          ORGANISASI: key,
          "BILANGAN PEMERHATI": num,
        });
      }
    }
  }
  return out;
}

function yearKey(v: unknown): number {
  return parseInt(String(v || "").replace(/\D/g, "").slice(-4), 10) || 0;
}

interface KatalogQuery {
  negeri?: string;
  tahun?: string;
  pilihanRaya?: string;
  jenisCalon?: string;
  statusCalon?: string;
}

function filterRows(rows: Row[], q: KatalogQuery): Row[] {
  let out = rows;
  if (q.negeri) {
    const needle = q.negeri.toLowerCase();
    out = out.filter((r) =>
      String(r["NEGERI"] || r["Negeri"] || r["NegeriPemohon"] || "")
        .toLowerCase()
        .includes(needle)
    );
  }
  if (q.tahun) {
    out = out.filter((r) => {
      for (const col of ["TAHUN PILIHAN RAYA", "TAHUN", "Tahun", "TahunPilihanraya"]) {
        const val = String(r[col] || "");
        if (val && val.includes(q.tahun!)) return true;
      }
      return false;
    });
  }
  if (q.pilihanRaya) {
    const needle = q.pilihanRaya.toLowerCase();
    out = out.filter((r) => {
      for (const col of ["Nama Pilihan Raya", "PILIHAN RAYA", "NamaPR"]) {
        const val = String(r[col] || "").toLowerCase();
        if (val && val.includes(needle)) return true;
      }
      return false;
    });
  }
  if (q.jenisCalon) {
    out = out.filter(
      (r) => String(r["JenisCalon"] || "").toLowerCase() === q.jenisCalon!.toLowerCase()
    );
  }
  if (q.statusCalon) {
    out = out.filter(
      (r) =>
        String(r["StatusCalon"] || r["STATUS"] || "").toLowerCase() ===
        q.statusCalon!.toLowerCase()
    );
  }
  return out;
}

function extractFilterOptions(rows: Row[]): Record<string, string[]> {
  const negeri = new Set<string>();
  const tahun = new Set<string>();
  const pilihanRaya = new Set<string>();
  for (const r of rows) {
    for (const col of ["NEGERI", "Negeri", "NegeriPemohon"]) {
      const v = String(r[col] || "").trim();
      if (v) negeri.add(v);
    }
    for (const col of ["TAHUN PILIHAN RAYA", "TAHUN", "Tahun", "TahunPilihanraya"]) {
      const v = String(r[col] || "").trim();
      if (v) tahun.add(v);
    }
    for (const col of ["Nama Pilihan Raya", "PILIHAN RAYA", "NamaPR"]) {
      const v = String(r[col] || "").trim();
      if (v) pilihanRaya.add(v);
    }
  }
  return {
    negeri: Array.from(negeri).sort(),
    tahun: Array.from(tahun).sort((a, b) => yearKey(b) - yearKey(a)),
    pilihanRaya: Array.from(pilihanRaya).sort(),
  };
}

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

  // Fetch from static JSON (or fall back to legacy API for unmigrated sheets)
  useEffect(() => {
    if (!tab.sheetSlug) {
      setApiData([]);
      setApiColumns([]);
      setApiTotal(0);
      setApiTotalPages(0);
      setApiFilterOptions({});
      setApiLoading(false);
      setApiError(null);
      return;
    }

    const controller = new AbortController();
    setApiLoading(true);
    setApiError(null);

    const catalogSlug = CATALOG_SLUG_MAP[tab.sheetSlug];

    if (catalogSlug) {
      // New path: static JSON + client-side filter/pagination
      getCatalogData(catalogSlug)
        .then((raw) => {
          if (controller.signal.aborted) return;
          let rows = raw as Row[];
          if (catalogSlug === "bil-pemerhati") rows = pivotPemerhati(rows);

          // Apply tab-level extra params + user filters
          const baseQuery: KatalogQuery = {
            jenisCalon: tab.apiExtraParams?.jenisCalon,
            statusCalon: tab.apiExtraParams?.statusCalon,
          };
          // Filter options come from rows after extra-param scoping but before user filters,
          // so dropdowns reflect what's actually selectable for this tab.
          const baseRows = filterRows(rows, baseQuery);
          const filterOpts = extractFilterOptions(baseRows);

          let filtered = filterRows(baseRows, {
            negeri: filters.negeri,
            tahun: filters.tahun,
            pilihanRaya: filters.pilihanRaya,
          });

          // Sort by year desc when a year column is present
          const sample = filtered[0] || baseRows[0];
          if (sample) {
            const yearCol = ["TAHUN PILIHAN RAYA", "TAHUN", "Tahun", "TahunPilihanraya"]
              .find((c) => c in sample);
            if (yearCol) {
              filtered = [...filtered].sort(
                (a, b) => yearKey(b[yearCol]) - yearKey(a[yearCol])
              );
            }
          }

          const total = filtered.length;
          const totalPages = Math.max(1, Math.ceil(total / apiLimit));
          const start = (apiPage - 1) * apiLimit;
          const pageRows = filtered.slice(start, start + apiLimit);
          const columns = pageRows[0]
            ? Object.keys(pageRows[0])
            : filtered[0]
            ? Object.keys(filtered[0])
            : baseRows[0]
            ? Object.keys(baseRows[0])
            : [];

          setApiData(pageRows);
          setApiColumns(columns);
          setApiTotal(total);
          setApiTotalPages(totalPages);
          setApiFilterOptions(filterOpts);
        })
        .catch((err) => {
          if (controller.signal.aborted) return;
          setApiError(err instanceof Error ? err.message : "Failed to load");
          setApiData([]);
        })
        .finally(() => {
          if (!controller.signal.aborted) setApiLoading(false);
        });

      return () => controller.abort();
    }

    // Legacy fallback: oversized sheets (daftar-pemilih, undi-pos) still go
    // through /api/katalog where pagination + aggregation happens server-side.
    const params = new URLSearchParams();
    params.set("sheet", tab.sheetSlug);
    params.set("page", String(apiPage));
    params.set("limit", String(apiLimit));
    if (filters.negeri) params.set("negeri", filters.negeri);
    if (filters.tahun) params.set("tahun", filters.tahun);
    if (filters.pilihanRaya) params.set("pilihanRaya", filters.pilihanRaya);
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
      <PageHeader
        breadcrumb={[
          { label: "Utama", href: "/" },
          { label: "Katalog Data", href: "/katalog" },
          { label: bahagian.label },
        ]}
        title={bahagian.label}
        subtitle={`${bahagian.count} set data tersedia dalam bahagian ini`}
      />

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
