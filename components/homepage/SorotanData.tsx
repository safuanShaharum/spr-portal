'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, Eye, Download } from 'lucide-react';

interface InfografikItem {
  id: number;
  title: string;
  caption: string;
  kategori: string;
  pru_number: number | null;
  tahun: number | null;
  negeri: string | null;
  image: string | null;
  image_thumbnail: string | null;
  pdf_url: string | null;
}

const WP_API = (process.env.NEXT_PUBLIC_WP_API_URL || 'http://spr-open-data.local/wp-json').replace(/\/$/, '');

const FILTER_TABS = [
  { slug: '', label: 'Semua' },
  { slug: 'pru', label: 'Pilihan Raya Umum' },
  { slug: 'dun_dn_du', label: 'PRU DUN/DN/DU' },
  { slug: 'prk', label: 'Pilihan Raya Kecil' },
  { slug: 'pemerhati', label: 'Pemerhati' },
];

export function SorotanData() {
  const [activeFilter, setActiveFilter] = useState<string>('');
  const [items, setItems] = useState<InfografikItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams({ per_page: '4' });
    if (activeFilter) params.set('kategori', activeFilter);

    fetch(`${WP_API}/spr/v1/infografik?${params}`)
      .then((r) => r.json())
      .then((res) => {
        setItems((res.data || []).slice(0, 4));
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to fetch infografik:', err);
        setLoading(false);
      });
  }, [activeFilter]);

  return (
    <section className="py-24 bg-gradient-to-b from-spr-page-bg to-white relative overflow-hidden">
      <div className="w-full px-4 sm:px-6 lg:px-10">

        {/* Header */}
        <div className="flex items-end justify-between mb-12 flex-wrap gap-4">
          <div>
            <div className="text-xs uppercase tracking-[0.24em] text-spr-purple font-semibold mb-3 flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-spr-gold rounded-full" />
              Sorotan
            </div>
            <h2 className="display-serif text-5xl md:text-6xl font-normal leading-tight mb-3">
              Data yang <span className="italic text-spr-purple">bercerita</span>
            </h2>
            <p className="text-spr-ink/65 text-lg">
              Infografik yang mengubah angka kepada pemahaman — dibaca oleh wartawan, penyelidik dan rakyat.
            </p>
          </div>
          <Link
            href="/infografik-pilihan-raya"
            className="inline-flex items-center gap-2 text-spr-purple hover:text-spr-purple-dark font-semibold group"
          >
            <span>Lihat semua infografik</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" strokeWidth={2.5} />
          </Link>
        </div>

        {/* Filter tabs */}
        <div className="flex items-center gap-2 mb-10 overflow-x-auto pb-2">
          {FILTER_TABS.map((tab) => (
            <button
              key={tab.slug}
              onClick={() => setActiveFilter(tab.slug)}
              className={`px-5 py-2.5 rounded-full text-sm font-medium whitespace-nowrap transition ${
                activeFilter === tab.slug
                  ? 'bg-spr-ink text-white font-semibold'
                  : 'bg-white border border-spr-ink/10 text-spr-ink/70 hover:text-spr-ink hover:border-spr-ink/30'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Grid */}
        {loading ? (
          <LoadingGrid />
        ) : items.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {items.map((item) => (
              <InfografikCard key={item.id} item={item} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function InfografikCard({ item }: { item: InfografikItem }) {
  const hasImage = Boolean(item.image_thumbnail || item.image);

  return (
    <article className="lift-card group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl border border-spr-ink/5 flex flex-col">
      <div className="infografik-thumb relative overflow-hidden">
        {hasImage ? (
          <img
            src={item.image_thumbnail || item.image!}
            alt={item.title}
            loading="lazy"
            className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-spr-purple/30 text-sm">Tiada imej</span>
          </div>
        )}
        {item.pru_number && (
          <div className="absolute top-3 right-3 bg-spr-ink/80 text-white text-[10px] px-2 py-1 rounded-md font-mono">
            PRU-{item.pru_number}
          </div>
        )}
        {item.tahun && !item.pru_number && (
          <div className="absolute top-3 right-3 bg-spr-ink/80 text-white text-[10px] px-2 py-1 rounded-md font-mono">
            {item.tahun}
          </div>
        )}
      </div>

      <div className="p-5 flex flex-col flex-1">
        <h3 className="font-semibold text-spr-ink mb-2 leading-snug line-clamp-2">
          {item.title}
        </h3>
        <p className="text-sm text-spr-ink/60 mb-4 line-clamp-2 flex-1">{item.caption}</p>
        <div className="flex items-center gap-2 mt-auto">
          {item.image && (
            <a
              href={item.image}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 bg-spr-purple text-white text-xs font-semibold py-2.5 rounded-lg hover:bg-spr-purple-dark transition flex items-center justify-center gap-1.5"
            >
              <Eye className="w-3.5 h-3.5" strokeWidth={2.5} />
              Lihat
            </a>
          )}
          {item.pdf_url && (
            <a
              href={item.pdf_url}
              target="_blank"
              rel="noopener noreferrer"
              title="Muat Turun PDF"
              className="bg-white border border-spr-ink/10 text-spr-ink text-xs font-semibold py-2.5 px-3 rounded-lg hover:border-spr-ink/30 transition"
            >
              <Download className="w-3.5 h-3.5" strokeWidth={2.5} />
            </a>
          )}
        </div>
      </div>
    </article>
  );
}

function LoadingGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="bg-white rounded-3xl overflow-hidden animate-pulse border border-spr-ink/5">
          <div className="aspect-square bg-gray-200" />
          <div className="p-5 space-y-3">
            <div className="h-4 bg-gray-200 rounded w-3/4" />
            <div className="h-3 bg-gray-200 rounded w-full" />
            <div className="h-9 bg-gray-200 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="text-center py-20 bg-white rounded-3xl border border-spr-ink/5">
      <p className="text-spr-ink/50">Tiada infografik dalam kategori ini.</p>
    </div>
  );
}
