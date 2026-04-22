'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';

interface InfografikItem {
  id: number;
  title: string;
  caption: string;
  kategori: 'pru' | 'dun_dn_du' | 'prk' | 'pemerhati' | 'kesalahan';
  pru_number: number | null;
  tahun: number | null;
  negeri: string | null;
  lokasi: string | null;
  image: string | null;
  image_thumbnail: string | null;
  pdf_url: string | null;
}

interface FilterMeta {
  years: number[];
  pru_numbers: number[];
}

const TABS = [
  { slug: 'pru',       label: 'Pilihan Raya Umum' },
  { slug: 'dun_dn_du', label: 'PRU DUN/DN/DU' },
  { slug: 'prk',       label: 'Pilihan Raya Kecil' },
  { slug: 'pemerhati', label: 'Pemerhati' },
  { slug: 'kesalahan', label: 'Kesalahan Pilihan Raya' },
] as const;

type TabSlug = typeof TABS[number]['slug'];

const API_BASE = process.env.NEXT_PUBLIC_WORDPRESS_API_URL || 'http://spr-open-data.local';

export default function InfografikPage() {
  const [activeTab, setActiveTab] = useState<TabSlug>('pru');
  const [items, setItems] = useState<InfografikItem[]>([]);
  const [filters, setFilters] = useState<FilterMeta>({ years: [], pru_numbers: [] });
  const [loading, setLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [selectedPru, setSelectedPru] = useState<number | null>(null);
  const [lightboxImage, setLightboxImage] = useState<InfografikItem | null>(null);

  useEffect(() => {
    fetch(`${API_BASE}/wp-json/spr/v1/infografik/filters?kategori=${activeTab}`)
      .then(r => r.json())
      .then(setFilters)
      .catch(console.error);
  }, [activeTab]);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams({ kategori: activeTab });
    if (selectedYear) params.set('tahun', String(selectedYear));
    if (selectedPru)  params.set('pru_number', String(selectedPru));

    fetch(`${API_BASE}/wp-json/spr/v1/infografik?${params}`)
      .then(r => r.json())
      .then(res => {
        setItems(res.data || []);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [activeTab, selectedYear, selectedPru]);

  const handleTabChange = (slug: TabSlug) => {
    setActiveTab(slug);
    setSelectedYear(null);
    setSelectedPru(null);
  };

  const groupedItems = useMemo(() => {
    if (activeTab === 'pru') {
      const groups: Record<number, InfografikItem[]> = {};
      items.forEach(item => {
        const key = item.pru_number || 0;
        if (!groups[key]) groups[key] = [];
        groups[key].push(item);
      });
      return Object.entries(groups)
        .sort(([a], [b]) => Number(b) - Number(a))
        .map(([pru, list]) => ({ label: `Infografik Pilihan Raya Umum Ke-${pru}`, items: list }));
    }
    if (activeTab === 'prk' && !selectedYear) {
      const groups: Record<number, InfografikItem[]> = {};
      items.forEach(item => {
        const key = item.tahun || 0;
        if (!groups[key]) groups[key] = [];
        groups[key].push(item);
      });
      return Object.entries(groups)
        .sort(([a], [b]) => Number(b) - Number(a))
        .map(([yr, list]) => ({ label: `Tahun ${yr}`, items: list }));
    }
    return [{ label: '', items }];
  }, [items, activeTab, selectedYear]);

  return (
    <div className="min-h-screen bg-[#F5F5FA]">
      <div className="bg-spr-bg-secondary py-6 sm:py-8 px-4 sm:px-6 lg:px-10">
        <nav className="flex items-center gap-2 text-[13px] text-spr-text-muted mb-3">
          <Link href="/" className="hover:text-spr-primary transition-colors">Utama</Link>
          <span>/</span>
          <span className="text-spr-navy font-medium">Infografik Pilihan Raya</span>
        </nav>
        <h1 className="font-display text-[28px] sm:text-[32px] font-bold text-spr-navy">Infografik Pilihan Raya</h1>
        <p className="text-spr-text-secondary mt-1 text-sm">
          Untuk rujukan, klik pada gambar untuk paparan lebih besar.
          Bagi maklumat yang disertakan dengan fail PDF, sila klik kapsyen gambar untuk membuka pautan.
        </p>
      </div>

      <section className="bg-white sticky top-0 z-10 border-b border-gray-200 shadow-sm">
        <div className="w-full px-4 sm:px-6 lg:px-10">
          <div className="flex gap-1 overflow-x-auto">
            {TABS.map(tab => (
              <button
                key={tab.slug}
                onClick={() => handleTabChange(tab.slug)}
                className={`px-6 py-4 text-sm font-semibold whitespace-nowrap transition-all border-b-2 ${
                  activeTab === tab.slug
                    ? 'text-[#581CDC] border-[#581CDC]'
                    : 'text-gray-600 border-transparent hover:text-[#581CDC]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {(activeTab === 'prk' || activeTab === 'pru') && (
        <section className="bg-white border-b border-gray-100">
          <div className="w-full px-4 sm:px-6 lg:px-10 py-4 flex flex-wrap gap-2 items-center">
            <span className="text-sm font-medium text-gray-500 mr-2">
              {activeTab === 'prk' ? 'Filter Tahun:' : 'Filter PRU:'}
            </span>
            <button
              onClick={() => { setSelectedYear(null); setSelectedPru(null); }}
              className={`px-4 py-1.5 text-xs font-semibold rounded-full transition ${
                !selectedYear && !selectedPru
                  ? 'bg-[#581CDC] text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Semua
            </button>
            {activeTab === 'prk' && filters.years.map(yr => (
              <button
                key={yr}
                onClick={() => setSelectedYear(yr)}
                className={`px-4 py-1.5 text-xs font-semibold rounded-full transition ${
                  selectedYear === yr
                    ? 'bg-[#581CDC] text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Tahun {yr}
              </button>
            ))}
            {activeTab === 'pru' && filters.pru_numbers.map(n => (
              <button
                key={n}
                onClick={() => setSelectedPru(n)}
                className={`px-4 py-1.5 text-xs font-semibold rounded-full transition ${
                  selectedPru === n
                    ? 'bg-[#581CDC] text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                PRU Ke-{n}
              </button>
            ))}
          </div>
        </section>
      )}

      <main className="w-full px-4 sm:px-6 lg:px-10 py-10">
        {loading ? (
          <LoadingGrid />
        ) : items.length === 0 ? (
          <EmptyState />
        ) : (
          groupedItems.map((group, idx) => (
            <div key={idx} className="mb-12">
              {group.label && (
                <h2 className="text-2xl font-bold text-[#394258] mb-6">{group.label}</h2>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6">
                {group.items.map(item => (
                  <InfografikCard
                    key={item.id}
                    item={item}
                    onImageClick={() => setLightboxImage(item)}
                  />
                ))}
              </div>
            </div>
          ))
        )}
      </main>

      {lightboxImage && <Lightbox item={lightboxImage} onClose={() => setLightboxImage(null)} />}
    </div>
  );
}

function InfografikCard({ item, onImageClick }: { item: InfografikItem; onImageClick: () => void }) {
  const hasImage = Boolean(item.image_thumbnail || item.image);

  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-gray-100">
      <button onClick={onImageClick} className="w-full aspect-[4/3] bg-gray-50 overflow-hidden block group">
        {hasImage ? (
          <img
            src={item.image_thumbnail || item.image!}
            alt={item.title}
            loading="lazy"
            className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#581CDC]/10 to-[#581CDC]/5">
            <svg className="w-16 h-16 text-[#581CDC]/40" fill="currentColor" viewBox="0 0 20 20">
              <path d="M4 18h12V6h-4V2H4v16zm8-14l4 4h-4V4z" />
            </svg>
          </div>
        )}
      </button>

      <div className="p-4 space-y-3">
        <p className="text-sm font-semibold text-[#394258] leading-snug">{item.caption}</p>
        {item.pdf_url && (
          <a
            href={item.pdf_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-[#581CDC] bg-[#581CDC]/10 hover:bg-[#581CDC]/20 rounded-md transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h14a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
            </svg>
            Muat Turun PDF
          </a>
        )}
      </div>
    </div>
  );
}

function Lightbox({ item, onClose }: { item: InfografikItem; onClose: () => void }) {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handleEsc);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4" onClick={onClose}>
      <button onClick={onClose} className="absolute top-4 right-4 text-white hover:text-gray-300 text-3xl z-10" aria-label="Close">✕</button>
      <div className="max-w-5xl max-h-[90vh] w-auto" onClick={e => e.stopPropagation()}>
        {item.image ? (
          <img src={item.image} alt={item.title} className="max-w-full max-h-[90vh] object-contain" />
        ) : (
          <div className="text-white text-center py-20">Tiada imej tersedia</div>
        )}
        <p className="text-white text-center mt-4 text-sm">{item.caption}</p>
      </div>
    </div>
  );
}

function LoadingGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6">
      {Array.from({ length: 12 }).map((_, i) => (
        <div key={i} className="bg-white rounded-lg overflow-hidden animate-pulse">
          <div className="aspect-[4/3] bg-gray-200" />
          <div className="p-4 space-y-2">
            <div className="h-4 bg-gray-200 rounded w-3/4" />
            <div className="h-4 bg-gray-200 rounded w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="text-center py-20">
      <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
      </svg>
      <p className="text-gray-500">Tiada infografik dalam kategori ini.</p>
    </div>
  );
}
