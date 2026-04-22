import { notFound } from "next/navigation";
import Link from "next/link";
import { getDatasetBySlug, getRelatedDatasets, getDatasets } from "@/lib/wordpress";
import { getNegeriName } from "@/lib/constants";
import FormatBadge from "@/components/FormatBadge";
import DatasetCard from "@/components/DatasetCard";
import DatasetDetailClient from "./DatasetDetailClient";

interface Props {
  params: { slug: string };
}

export async function generateStaticParams() {
  const res = await getDatasets({ per_page: 50 });
  return (res.data || []).map((d) => ({ slug: d.slug }));
}

export default async function DatasetDetailPage({ params }: Props) {
  const dataset = await getDatasetBySlug(params.slug);
  if (!dataset) return notFound();

  const categorySlug = dataset.categories?.[0]?.slug || "";
  const related = categorySlug
    ? await getRelatedDatasets(categorySlug, dataset.id, 4)
    : [];

  return (
    <div>
      {/* Header with bg */}
      <div className="bg-spr-bg-secondary py-10 px-4">
        <div className="max-w-5xl mx-auto">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-[13px] text-spr-text-muted mb-6">
            <Link href="/" className="hover:text-spr-primary transition-colors">Utama</Link>
            <span>/</span>
            <Link href="/katalog" className="hover:text-spr-primary transition-colors">Katalog Data</Link>
            <span>/</span>
            <span className="text-spr-text truncate max-w-[300px]">{dataset.title}</span>
          </nav>

          <div className="mb-4">
            <FormatBadge format={dataset.format} size="md" />
          </div>

          <h1 className="font-display text-[28px] font-bold text-spr-navy leading-tight mb-6">
            {dataset.title}
          </h1>

          {/* Metadata row */}
          <div className="flex flex-wrap items-center gap-x-6 gap-y-3 mb-6">
            {dataset.source && (
              <div className="flex items-center gap-2">
                <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-spr-text-muted shrink-0" viewBox="0 0 24 24">
                  <path d="M3 21h18M3 7v1a3 3 0 0 0 6 0V7m0 1a3 3 0 0 0 6 0V7m0 1a3 3 0 0 0 6 0V7H3l2-4h14l2 4M5 21V10.87M19 21V10.87" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span className="text-spr-text-muted text-[13px]">Sumber</span>
                <span className="text-spr-navy text-sm font-medium">{dataset.source}</span>
              </div>
            )}
            {dataset.year && (
              <div className="flex items-center gap-2">
                <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-spr-text-muted shrink-0" viewBox="0 0 24 24">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                  <path d="M16 2v4M8 2v4M3 10h18" strokeLinecap="round" />
                </svg>
                <span className="text-spr-text-muted text-[13px]">Tahun</span>
                <span className="text-spr-navy text-sm font-medium">{dataset.year}</span>
              </div>
            )}
            {dataset.last_updated && (
              <div className="flex items-center gap-2">
                <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-spr-text-muted shrink-0" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 6v6l4 2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span className="text-spr-text-muted text-[13px]">Kemaskini</span>
                <span className="text-spr-navy text-sm font-medium">
                  {new Date(dataset.last_updated).toLocaleDateString("ms-MY", { day: "numeric", month: "long", year: "numeric" })}
                </span>
              </div>
            )}
            {dataset.file_size && (
              <div className="flex items-center gap-2">
                <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-spr-text-muted shrink-0" viewBox="0 0 24 24">
                  <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M13 2v7h7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span className="text-spr-text-muted text-[13px]">Saiz</span>
                <span className="text-spr-navy text-sm font-medium">{dataset.file_size}</span>
              </div>
            )}
          </div>

          {/* Download + tags */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-2">
              {(dataset.categories || []).map((cat) => (
                <Link key={cat.id} href={`/katalog?category=${cat.slug}`}
                  className="px-3 py-1 rounded-full bg-spr-primary-50 text-spr-primary text-xs font-medium hover:bg-spr-primary-100 transition-colors">
                  {cat.name}
                </Link>
              ))}
              {getNegeriName(dataset.negeri) && (
                <span className="px-3 py-1 rounded-full bg-spr-bg-tertiary text-spr-text-secondary text-xs font-medium">
                  {getNegeriName(dataset.negeri)}
                </span>
              )}
            </div>
            <div className="flex items-center gap-4">
              <span className="text-spr-text-muted text-sm">
                <span className="text-spr-navy font-semibold">{(dataset.download_count || 0).toLocaleString()}</span> muat turun
              </span>
              <DatasetDetailClient datasetId={dataset.id} format={dataset.format} fileUrl={dataset.file_url} renderType="download-button" />
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-4 py-8">
        <DatasetDetailClient datasetId={dataset.id} format={dataset.format} fileUrl={dataset.file_url}
          previewEnabled={dataset.preview_enabled} description={dataset.description} renderType="tabs" />

        {related.length > 0 && (
          <section className="mt-16">
            <h2 className="font-display text-2xl font-bold text-spr-navy mb-6">Dataset Berkaitan</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {related.map((ds) => (<DatasetCard key={ds.id} dataset={ds} view="grid" />))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
