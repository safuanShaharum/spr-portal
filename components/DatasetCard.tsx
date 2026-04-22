import Link from "next/link";
import { Dataset } from "@/types/dataset";
import FormatBadge from "./FormatBadge";

interface DatasetCardProps {
  dataset: Dataset;
  view: "grid" | "list";
}

export default function DatasetCard({ dataset, view }: DatasetCardProps) {
  if (view === "list") {
    return (
      <Link
        href={`/katalog/${dataset.slug}`}
        className="group flex flex-col sm:flex-row sm:items-center gap-4 py-4 px-4 border-b border-spr-border hover:bg-spr-bg-secondary rounded-lg transition-all"
      >
        <div className="flex-1 min-w-0">
          <h3 className="text-[15px] font-semibold text-spr-navy group-hover:text-spr-primary transition-colors truncate">
            {dataset.title}
          </h3>
          <p className="text-[13px] text-spr-text-secondary mt-1 line-clamp-1">
            {dataset.excerpt}
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <FormatBadge format={dataset.format} />
          <span className="text-spr-text-muted text-sm">{dataset.file_size}</span>
          <span className="text-spr-text-muted text-sm">{dataset.year}</span>
        </div>

        <div className="flex items-center gap-4 shrink-0">
          <div className="flex items-center gap-1.5 text-spr-text-muted text-sm">
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            {dataset.download_count.toLocaleString()}
          </div>
          <span className="px-4 py-2 rounded-lg border border-spr-border text-spr-primary text-sm font-medium group-hover:bg-spr-primary group-hover:text-white group-hover:border-spr-primary transition-all">
            Lihat
          </span>
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={`/katalog/${dataset.slug}`}
      className="group flex flex-col bg-white border border-spr-border rounded-xl overflow-hidden hover:shadow-md hover:border-spr-primary/30 transition-all duration-200"
    >
      <div className="p-5 flex flex-col flex-1">
        <div className="mb-3">
          <FormatBadge format={dataset.format} />
        </div>

        <h3 className="text-[15px] font-semibold text-spr-navy group-hover:text-spr-primary transition-colors line-clamp-2 leading-snug">
          {dataset.title}
        </h3>

        <p className="text-[13px] text-spr-text-secondary mt-2 line-clamp-2 leading-relaxed flex-1">
          {dataset.excerpt}
        </p>

        <div className="flex items-center gap-2 mt-4 pt-4 border-t border-spr-border-light text-xs text-spr-text-muted">
          <div className="flex items-center gap-1">
            <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M13 2v7h7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            {dataset.file_size}
          </div>
          <span className="text-spr-border">·</span>
          <div className="flex items-center gap-1">
            <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <path d="M16 2v4M8 2v4M3 10h18" strokeLinecap="round" />
            </svg>
            {dataset.year}
          </div>
          <span className="text-spr-border">·</span>
          <div className="flex items-center gap-1">
            <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            {dataset.download_count.toLocaleString()}
          </div>
        </div>
      </div>
    </Link>
  );
}
