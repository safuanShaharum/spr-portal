import { useMemo, useState } from "react";
import { ColumnDef } from "@/lib/katalog-data";
import { getPartiLogo } from "@/lib/parti-logo";

interface ServerPagination {
  page: number;
  totalPages: number;
  total: number;
  limit: number;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
}

interface Props {
  columns: ColumnDef[];
  data: Record<string, unknown>[];
  title?: string;
  onRowClick?: (row: Record<string, unknown>) => void;
  serverPagination?: ServerPagination;
}

function formatValue(value: unknown, col: ColumnDef): React.ReactNode {
  if (value == null || value === "" || value === "NaN") return "—";

  switch (col.type) {
    case "number": {
      const n = Number(value);
      return isNaN(n) ? "—" : n.toLocaleString();
    }
    case "currency": {
      const n = Number(value);
      return isNaN(n) ? "—" : `RM ${n.toLocaleString()}`;
    }
    case "date":
      return new Date(String(value)).toLocaleDateString("ms-MY", { day: "numeric", month: "short", year: "numeric" });
    case "badge": {
      const str = String(value);
      const color = col.badgeColors?.[str] || "#6B7280";
      const logo = getPartiLogo(str);
      return logo ? (
        <img src={logo} alt={str} width={80} height={80} className="object-contain rounded-sm max-w-[60px] sm:max-w-[80px]" title={str} />
      ) : (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold text-white" style={{ backgroundColor: color }}>
          {str}
        </span>
      );
    }
    default: {
      const s = String(value);
      return s === "NaN" || s === "undefined" || s === "null" ? "—" : s;
    }
  }
}

export default function KatalogDataTable({ columns, data, title, onRowClick, serverPagination }: Props) {
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [sortCol, setSortCol] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");

  const sorted = useMemo(() => {
    if (!sortCol) return data;
    return [...data].sort((a, b) => {
      const av = a[sortCol] ?? "";
      const bv = b[sortCol] ?? "";
      const numA = Number(av);
      const numB = Number(bv);
      if (!isNaN(numA) && !isNaN(numB)) {
        return sortDir === "asc" ? numA - numB : numB - numA;
      }
      return sortDir === "asc"
        ? String(av).localeCompare(String(bv), "ms")
        : String(bv).localeCompare(String(av), "ms");
    });
  }, [data, sortCol, sortDir]);

  // Server pagination: data is already paginated, use it directly
  const sp = serverPagination;
  const totalPages = sp ? sp.totalPages : Math.ceil(sorted.length / perPage);
  const pageData = sp ? sorted : sorted.slice((page - 1) * perPage, page * perPage);
  const displayTotal = sp ? sp.total : sorted.length;
  const currentPage = sp ? sp.page : page;
  const currentLimit = sp ? sp.limit : perPage;

  const toggleSort = (key: string) => {
    if (sortCol === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortCol(key); setSortDir("asc"); }
    setPage(1);
  };

  const downloadCsv = () => {
    const header = columns.map((c) => c.header).join(",");
    const rows = sorted.map((row) =>
      columns.map((c) => {
        const v = row[c.key];
        return `"${String(v ?? "").replace(/"/g, '""')}"`;
      }).join(",")
    );
    const csv = [header, ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "data-export.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      {/* Header row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
        <div className="text-sm text-spr-text-secondary">
          {title && <span className="font-semibold text-spr-navy">{title}</span>}
          {title && " — "}
          <span>{displayTotal.toLocaleString()} rekod</span>
        </div>
        <button onClick={downloadCsv}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2 bg-spr-navy text-white rounded-lg text-sm font-medium hover:bg-spr-navy/90 transition-colors">
          <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Muat Turun CSV
        </button>
      </div>

      {/* Table */}
      <div className="border border-spr-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#1A2332]">
                {columns.map((col) => (
                  <th key={col.key} onClick={() => toggleSort(col.key)}
                    className="px-4 py-3 text-left text-[11px] font-semibold text-white uppercase tracking-wider cursor-pointer hover:text-white/80 whitespace-nowrap select-none">
                    <div className="flex items-center gap-1">
                      {col.header}
                      {sortCol === col.key && (
                        <span>{sortDir === "asc" ? "↑" : "↓"}</span>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {pageData.map((row, i) => (
                <tr key={i} onClick={() => onRowClick?.(row)}
                  className={`border-t border-spr-border-light hover:bg-spr-primary-50 transition-colors ${onRowClick ? "cursor-pointer" : ""} ${i % 2 === 0 ? "bg-white" : "bg-[#F8FAFC]"}`}>
                  {columns.map((col) => (
                    <td key={col.key} className="px-4 py-2.5 text-spr-text whitespace-nowrap">
                      {formatValue(row[col.key], col)}
                    </td>
                  ))}
                </tr>
              ))}
              {pageData.length === 0 && (
                <tr><td colSpan={columns.length} className="px-4 py-12 text-center text-spr-text-muted">Tiada data dijumpai.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {displayTotal > 0 && totalPages > 0 && (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mt-4">
          <div className="flex items-center gap-2 text-sm text-spr-text-muted">
            <span className="hidden sm:inline">Papar</span>
            <select value={currentLimit} onChange={(e) => {
              const v = Number(e.target.value);
              if (sp) { sp.onLimitChange(v); } else { setPerPage(v); setPage(1); }
            }}
              className="bg-white border border-spr-border rounded px-2 py-1 text-xs outline-none cursor-pointer">
              <option value={10}>10</option><option value={25}>25</option><option value={50}>50</option>
            </select>
            <span>daripada {displayTotal.toLocaleString()} rekod</span>
          </div>
          <div className="flex items-center gap-1.5">
            <button disabled={currentPage <= 1} onClick={() => sp ? sp.onPageChange(currentPage - 1) : setPage(page - 1)}
              className="px-3 py-1.5 rounded border border-spr-border text-xs text-spr-text-secondary hover:bg-spr-bg-secondary disabled:opacity-30 disabled:pointer-events-none">←</button>
            <span className="text-xs text-spr-text-muted px-2">
              {currentPage} / {totalPages}
            </span>
            <button disabled={currentPage >= totalPages} onClick={() => sp ? sp.onPageChange(currentPage + 1) : setPage(page + 1)}
              className="px-3 py-1.5 rounded border border-spr-border text-xs text-spr-text-secondary hover:bg-spr-bg-secondary disabled:opacity-30 disabled:pointer-events-none">→</button>
          </div>
        </div>
      )}
    </div>
  );
}
