import { ColumnDef } from "@/lib/katalog-data";

interface Props {
  row: Record<string, unknown>;
  columns: ColumnDef[];
  onClose: () => void;
}

function formatVal(v: unknown, type: string): string {
  if (v == null || v === "") return "—";
  if (type === "number") return Number(v).toLocaleString();
  if (type === "currency") return `RM ${Number(v).toLocaleString()}`;
  if (type === "date") return new Date(String(v)).toLocaleDateString("ms-MY", { day: "numeric", month: "long", year: "numeric" });
  return String(v);
}

export default function DetailModal({ row, columns, onClose }: Props) {
  const title = String(row[columns[0]?.key] || "Butiran");

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-[520px] max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 right-4 p-2 rounded-lg hover:bg-spr-bg-secondary text-spr-text-muted z-10">
          <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 4 4 14M4 4l10 10" strokeLinecap="round" /></svg>
        </button>

        <div className="p-6 sm:p-8">
          <h2 className="text-xl font-bold text-spr-navy mb-6 pr-8">{title}</h2>

          <div className="space-y-0">
            {columns.map((col) => (
              <div key={col.key} className="flex items-center justify-between py-3 border-b border-spr-border-light last:border-b-0">
                <span className="text-sm text-spr-text-muted">{col.header}</span>
                <span className="text-sm font-medium text-spr-navy text-right">
                  {formatVal(row[col.key], col.type)}
                </span>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-3 mt-6">
            <button className="flex-1 py-3 bg-spr-navy text-white rounded-xl text-sm font-semibold hover:bg-spr-navy/90 transition-colors inline-flex items-center justify-center gap-2">
              <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Muat Turun CSV
            </button>
            <button onClick={onClose} className="px-6 py-3 border border-spr-border rounded-xl text-sm font-medium text-spr-text-secondary hover:bg-spr-bg-secondary transition-colors">
              Tutup
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
