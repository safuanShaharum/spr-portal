import { FilterDef } from "@/lib/katalog-data";

interface Props {
  filters: FilterDef[];
  values: Record<string, string>;
  onChange: (key: string, value: string) => void;
  onReset: () => void;
}

export default function FilterRow({ filters, values, onChange, onReset }: Props) {
  if (filters.length === 0) return null;

  return (
    <div className="bg-spr-bg-secondary border border-spr-border rounded-xl p-4 mb-4">
      <div className="text-[11px] font-semibold text-spr-text-muted uppercase tracking-wider mb-3">
        Penapis
      </div>
      <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-2 sm:gap-3">
        {filters.map((f) => (
          <select
            key={f.key}
            value={values[f.key] || ""}
            onChange={(e) => onChange(f.key, e.target.value)}
            className="w-full sm:w-auto bg-white border border-spr-border rounded-lg px-3 py-2 text-sm text-spr-text outline-none focus:border-spr-primary/40 cursor-pointer"
          >
            <option value="">{f.label}</option>
            {f.options.map((o) => (
              <option key={o} value={o}>{o}</option>
            ))}
          </select>
        ))}
        <button
          onClick={onReset}
          className="px-3 py-2 text-sm text-spr-primary hover:text-spr-primary-dark font-medium transition-colors"
        >
          Set Semula
        </button>
      </div>
    </div>
  );
}
