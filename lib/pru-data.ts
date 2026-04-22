/**
 * Latest PRU results data — dynamic-ready
 * Ganti data ni bila PRU baru. Future: fetch dari WordPress CPT API.
 */

export interface SeatDistribution {
  party: string;
  seats: number;
}

export interface PRUData {
  number: number;
  year: number;
  date: string;
  total_parlimen: number;
  total_dun_semenanjung: number;
  pemilih_berdaftar: number;
  pemilih_berdaftar_label: string;
  turnout_percentage: number;
  government: {
    coalition_name: string;
    parties: string[];
    seats: number;
  };
  seat_distribution: SeatDistribution[];
}

export const LATEST_PRU: PRUData = {
  number: 15,
  year: 2022,
  date: '19 November 2022',
  total_parlimen: 222,
  total_dun_semenanjung: 447,
  pemilih_berdaftar: 21800000,
  pemilih_berdaftar_label: '21.8 juta',
  turnout_percentage: 73.9,
  government: {
    coalition_name: 'Kerajaan Perpaduan',
    parties: ['PH', 'BN', 'GPS', 'GRS'],
    seats: 112,
  },
  seat_distribution: [
    { party: 'PH', seats: 82 },
    { party: 'PN', seats: 73 },
    { party: 'BN', seats: 30 },
    { party: 'GPS', seats: 23 },
    { party: 'GRS', seats: 6 },
    { party: 'OTHER', seats: 8 },
  ],
};

const WP_API = (process.env.NEXT_PUBLIC_WP_API_URL || 'http://spr-open-data.local/wp-json').replace(/\/$/, '');

export async function getLatestPRU(): Promise<PRUData> {
  try {
    const res = await fetch(`${WP_API}/spr/v1/pru-latest`, {
      next: { revalidate: 300 },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (!data?.number) throw new Error('Empty PRU data');
    return data as PRUData;
  } catch (err) {
    console.warn('[pru-latest] falling back to hardcoded:', err);
    return LATEST_PRU;
  }
}
