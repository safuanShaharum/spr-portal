import Link from "next/link";
import { BahagianDef } from "@/lib/katalog-data";

interface Props {
  items: BahagianDef[];
  activeSlug: string;
  onSelect: (slug: string) => void;
}

export default function Sidebar({ items, activeSlug, onSelect }: Props) {
  return (
    <aside className="w-[260px] shrink-0 hidden lg:block">
      <div className="sticky top-28 max-h-[calc(100vh-8rem)] overflow-y-auto pr-2">
        <div className="text-[11px] font-semibold text-spr-text-muted uppercase tracking-wider mb-3 px-3">
          Kategori
        </div>
        <nav className="space-y-0.5">
          {items.map((b) => (
            <button
              key={b.slug}
              onClick={() => onSelect(b.slug)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-r-lg text-left text-sm transition-all ${
                activeSlug === b.slug
                  ? "border-l-[3px] border-[#E8740C] bg-spr-bg-secondary font-semibold text-spr-navy"
                  : "border-l-[3px] border-transparent text-spr-text-secondary hover:bg-spr-bg-secondary hover:text-spr-navy"
              }`}
            >
              <span className="truncate">{b.label}</span>
              <span className={`text-xs px-2 py-0.5 rounded-full shrink-0 ml-2 ${
                activeSlug === b.slug ? "bg-[#E8740C]/10 text-[#E8740C]" : "bg-spr-bg-tertiary text-spr-text-muted"
              }`}>
                {b.count}
              </span>
            </button>
          ))}
        </nav>
        <Link href="/" className="flex items-center gap-2 px-3 py-3 mt-6 text-sm text-spr-text-muted hover:text-spr-primary transition-colors">
          <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M19 12H5M12 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Kembali ke Utama
        </Link>
      </div>
    </aside>
  );
}
