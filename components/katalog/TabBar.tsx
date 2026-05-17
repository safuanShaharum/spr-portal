export interface TabItem {
  label: string;
  yearRange?: string;
  tooltip?: string;
}

interface Props {
  tabs: TabItem[];
  activeIndex: number;
  onSelect: (index: number) => void;
}

export default function TabBar({ tabs, activeIndex, onSelect }: Props) {
  return (
    <div className="flex flex-wrap items-center gap-2 pb-2 mb-4 -mx-1 px-1">
      {tabs.map((tab, i) => (
        <div key={i} className="relative group shrink-0">
          <button
            onClick={() => onSelect(i)}
            className={`px-4 py-2 rounded-full text-sm font-medium border transition-all ${
              activeIndex === i
                ? "bg-[#E8740C] text-white border-[#E8740C]"
                : "bg-white text-spr-text-secondary border-spr-border hover:border-[#E8740C]/40 hover:text-[#E8740C]"
            }`}
          >
            {tab.label}
          </button>
          {(tab.tooltip || tab.yearRange) && (
            <div className="pointer-events-none absolute left-1/2 -translate-x-1/2 top-full mt-2 z-20 opacity-0 group-hover:opacity-100 transition-opacity bg-spr-ink text-white text-xs font-medium px-3 py-1.5 rounded-md shadow-lg whitespace-nowrap text-center">
              {tab.tooltip && <div>{tab.tooltip}</div>}
              {tab.yearRange && <div>Data dari Tahun {tab.yearRange}</div>}
              <span className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-spr-ink rotate-45" />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
