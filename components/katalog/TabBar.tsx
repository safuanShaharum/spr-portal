interface Props {
  tabs: string[];
  activeIndex: number;
  onSelect: (index: number) => void;
}

export default function TabBar({ tabs, activeIndex, onSelect }: Props) {
  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-4 -mx-1 px-1">
      {tabs.map((label, i) => (
        <button
          key={i}
          onClick={() => onSelect(i)}
          className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium border transition-all ${
            activeIndex === i
              ? "bg-[#E8740C] text-white border-[#E8740C]"
              : "bg-white text-spr-text-secondary border-spr-border hover:border-[#E8740C]/40 hover:text-[#E8740C]"
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
