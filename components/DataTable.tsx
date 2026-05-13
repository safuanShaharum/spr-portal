"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import * as XLSX from "xlsx";
import { trackDownload } from "@/lib/analytics/trackDownload";

interface DataTableProps {
  fileUrl: string;
  format: string;
}

type Row = Record<string, string | number | boolean | null>;
type SortDir = "asc" | "desc" | null;

const PER_PAGE = 50;

export default function DataTable({ fileUrl }: DataTableProps) {
  const [headers, setHeaders] = useState<string[]>([]);
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Table state
  const [search, setSearch] = useState("");
  const [sortCol, setSortCol] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<SortDir>(null);
  const [page, setPage] = useState(1);
  const [visibleCols, setVisibleCols] = useState<Set<string>>(new Set());
  const [colDropdownOpen, setColDropdownOpen] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();

  // Debounced search
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const handleSearch = useCallback((val: string) => {
    setSearch(val);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setDebouncedSearch(val);
      setPage(1);
    }, 300);
  }, []);

  // Parse file on mount
  useEffect(() => {
    let cancelled = false;

    async function parseFile() {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch(fileUrl);
        if (!res.ok) throw new Error("Gagal memuat turun fail");

        const buffer = await res.arrayBuffer();
        const workbook = XLSX.read(buffer, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json<Row>(sheet, { defval: "" });

        if (cancelled) return;

        if (jsonData.length === 0) {
          setHeaders([]);
          setRows([]);
        } else {
          const cols = Object.keys(jsonData[0]);
          setHeaders(cols);
          setVisibleCols(new Set(cols));
          setRows(jsonData);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Fail tidak dapat dibaca");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    parseFile();
    return () => { cancelled = true; };
  }, [fileUrl]);

  // Filtered + sorted data
  const processed = useMemo(() => {
    let data = [...rows];

    // Search
    if (debouncedSearch) {
      const q = debouncedSearch.toLowerCase();
      data = data.filter((row) =>
        Object.values(row).some((v) =>
          String(v).toLowerCase().includes(q)
        )
      );
    }

    // Sort
    if (sortCol && sortDir) {
      data.sort((a, b) => {
        const av = a[sortCol] ?? "";
        const bv = b[sortCol] ?? "";
        const numA = Number(av);
        const numB = Number(bv);
        if (!isNaN(numA) && !isNaN(numB)) {
          return sortDir === "asc" ? numA - numB : numB - numA;
        }
        const cmp = String(av).localeCompare(String(bv), "ms");
        return sortDir === "asc" ? cmp : -cmp;
      });
    }

    return data;
  }, [rows, debouncedSearch, sortCol, sortDir]);

  const totalPages = Math.ceil(processed.length / PER_PAGE);
  const pageData = processed.slice((page - 1) * PER_PAGE, page * PER_PAGE);
  const activeHeaders = headers.filter((h) => visibleCols.has(h));

  const toggleSort = (col: string) => {
    if (sortCol === col) {
      setSortDir((d) => (d === "asc" ? "desc" : d === "desc" ? null : "asc"));
      if (sortDir === "desc") setSortCol(null);
    } else {
      setSortCol(col);
      setSortDir("asc");
    }
    setPage(1);
  };

  const exportCsv = () => {
    const ws = XLSX.utils.json_to_sheet(processed);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Data");
    XLSX.writeFile(wb, "data-export.csv", { bookType: "csv" });
    trackDownload("data-export.csv");
  };

  // Loading skeleton
  if (loading) {
    return (
      <div className="space-y-3 animate-pulse">
        <div className="h-10 bg-spr-bg-tertiary rounded-lg w-full" />
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="h-8 bg-spr-bg-tertiary/50 rounded w-full" />
        ))}
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="w-16 h-16 rounded-2xl bg-spr-danger/10 flex items-center justify-center mb-4">
          <svg width="28" height="28" fill="none" stroke="#FF6B6B" strokeWidth="1.5" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" />
            <path d="M15 9l-6 6M9 9l6 6" strokeLinecap="round" />
          </svg>
        </div>
        <h3 className="text-spr-text font-semibold mb-1">Fail tidak dapat dibaca</h3>
        <p className="text-spr-text-muted text-sm">{error}</p>
      </div>
    );
  }

  return (
    <div>
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3 mb-4">
        {/* Search */}
        <div className="relative flex-1 min-w-[200px]">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-spr-text-muted">
            <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="6.5" cy="6.5" r="4.5" />
              <path d="m10 10 3.5 3.5" strokeLinecap="round" />
            </svg>
          </div>
          <input
            type="text"
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Cari dalam jadual..."
            className="w-full bg-spr-bg-secondary border border-spr-border rounded-lg pl-9 pr-4 py-2 text-sm text-spr-text placeholder:text-spr-text-muted outline-none focus:border-spr-primary/50 transition-colors"
          />
        </div>

        {/* Column visibility */}
        <div className="relative">
          <button
            onClick={() => setColDropdownOpen(!colDropdownOpen)}
            className="flex items-center gap-2 px-3 py-2 bg-spr-bg-secondary border border-spr-border rounded-lg text-sm text-spr-text-muted hover:text-spr-text transition-colors"
          >
            <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
            Lajur
          </button>
          {colDropdownOpen && (
            <div className="absolute right-0 top-full mt-1 w-56 bg-white border border-spr-border rounded-xl p-3 shadow-xl z-20 max-h-64 overflow-y-auto">
              {headers.map((h) => (
                <label key={h} className="flex items-center gap-2 py-1.5 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={visibleCols.has(h)}
                    onChange={() => {
                      setVisibleCols((prev) => {
                        const next = new Set(prev);
                        if (next.has(h)) next.delete(h);
                        else next.add(h);
                        return next;
                      });
                    }}
                    className="w-3.5 h-3.5 rounded accent-spr-primary"
                  />
                  <span className="text-xs text-spr-text-muted group-hover:text-spr-text transition-colors truncate">
                    {h}
                  </span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Export */}
        <button
          onClick={exportCsv}
          className="flex items-center gap-2 px-3 py-2 bg-spr-bg-secondary border border-spr-border rounded-lg text-sm text-spr-text-muted hover:text-spr-text transition-colors"
        >
          <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Export CSV
        </button>
      </div>

      {/* Table */}
      <div className="border border-spr-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-spr-bg-tertiary">
                {activeHeaders.map((h) => (
                  <th
                    key={h}
                    onClick={() => toggleSort(h)}
                    className="px-4 py-3 text-left text-xs font-semibold text-spr-text-muted uppercase tracking-wider cursor-pointer hover:text-spr-text transition-colors whitespace-nowrap select-none"
                  >
                    <div className="flex items-center gap-1.5">
                      {h}
                      {sortCol === h && sortDir === "asc" && <span className="text-spr-primary">↑</span>}
                      {sortCol === h && sortDir === "desc" && <span className="text-spr-primary">↓</span>}
                      {sortCol !== h && (
                        <span className="text-spr-border">↕</span>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {pageData.map((row, i) => (
                <tr
                  key={i}
                  className={`border-t border-spr-border/50 hover:bg-spr-primary-50 transition-colors ${
                    i % 2 === 0 ? "bg-white" : "bg-spr-bg-secondary"
                  }`}
                >
                  {activeHeaders.map((h) => (
                    <td
                      key={h}
                      className="px-4 py-2.5 text-spr-text text-sm whitespace-nowrap max-w-[300px] truncate"
                    >
                      {String(row[h] ?? "")}
                    </td>
                  ))}
                </tr>
              ))}
              {pageData.length === 0 && (
                <tr>
                  <td
                    colSpan={activeHeaders.length}
                    className="px-4 py-12 text-center text-spr-text-muted"
                  >
                    Tiada data dijumpai.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4">
          <span className="text-sm text-spr-text-muted">
            Menunjukkan{" "}
            <span className="text-spr-text font-medium">
              {((page - 1) * PER_PAGE + 1).toLocaleString()}–
              {Math.min(page * PER_PAGE, processed.length).toLocaleString()}
            </span>{" "}
            daripada{" "}
            <span className="text-spr-text font-medium">
              {processed.length.toLocaleString()}
            </span>
          </span>
          <div className="flex items-center gap-2">
            <button
              disabled={page <= 1}
              onClick={() => setPage((p) => p - 1)}
              className="px-3 py-1.5 rounded-lg border border-spr-border text-sm text-spr-text-muted hover:text-spr-text hover:border-spr-primary/50 transition-all disabled:opacity-30 disabled:pointer-events-none"
            >
              ← Sebelum
            </button>
            <span className="text-sm text-spr-text-muted px-2">
              {page}/{totalPages}
            </span>
            <button
              disabled={page >= totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="px-3 py-1.5 rounded-lg border border-spr-border text-sm text-spr-text-muted hover:text-spr-text hover:border-spr-primary/50 transition-all disabled:opacity-30 disabled:pointer-events-none"
            >
              Seterusnya →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
