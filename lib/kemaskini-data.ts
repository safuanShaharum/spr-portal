import { WP_API } from '@/lib/wp-api';

export interface KemaskiniItem {
  day: string;
  month: string;
  year: number;
  category: string;
  category_color: 'teal' | 'coral' | 'purple' | 'gold' | 'ink';
  title: string;
  description: string;
  age_label: string;
  latest: boolean;
}

const FALLBACK: KemaskiniItem[] = [
  {
    day: '15', month: 'Mac', year: 2026,
    category: 'Pemilih', category_color: 'teal',
    title: 'Statistik pemilih berdaftar PRU-15 dikemaskini',
    description: '21.8 juta pemilih — pecahan mengikut negeri, jantina dan umur tersedia untuk muat turun dalam format XLSX dan CSV.',
    age_label: 'Baharu sahaja', latest: true,
  },
];

export async function getKemaskini(perPage = 4): Promise<KemaskiniItem[]> {
  try {
    const res = await fetch(`${WP_API}/spr/v1/kemaskini?per_page=${perPage}`, {
      next: { revalidate: 300 },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (!Array.isArray(data) || data.length === 0) throw new Error('Empty');
    return data as KemaskiniItem[];
  } catch (err) {
    console.warn('[kemaskini] fallback:', err);
    return FALLBACK;
  }
}
