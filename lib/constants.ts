export const DESIGN_TOKENS = {
  colors: {
    primary: '#581CDC',
    primaryDark: '#3D0FA0',
    primaryLight: '#7B4FE0',
    accent: '#00D4AA',
    accentDark: '#00B894',
    dark: '#0A0A1A',
    card: '#12122A',
    surface: '#1A1A3A',
    border: 'rgba(88,28,220,0.25)',
    text: '#E8E6F0',
    textMuted: '#9B97B0',
    textDim: '#6B6880',
    gold: '#F0C040',
    danger: '#FF6B6B',
  },
  fonts: {
    display: 'Playfair Display, Georgia, serif',
    body: 'DM Sans, Inter, system-ui, sans-serif',
  },
};

export const NEGERI_LIST = [
  { code: 'JHR', slug: 'johor', name: 'Johor', parlimen: 26 },
  { code: 'KDH', slug: 'kedah', name: 'Kedah', parlimen: 15 },
  { code: 'KTN', slug: 'kelantan', name: 'Kelantan', parlimen: 14 },
  { code: 'MLK', slug: 'melaka', name: 'Melaka', parlimen: 6 },
  { code: 'NSN', slug: 'negeri-sembilan', name: 'Negeri Sembilan', parlimen: 8 },
  { code: 'PHG', slug: 'pahang', name: 'Pahang', parlimen: 14 },
  { code: 'PRK', slug: 'perak', name: 'Perak', parlimen: 24 },
  { code: 'PLS', slug: 'perlis', name: 'Perlis', parlimen: 3 },
  { code: 'PNG', slug: 'pulau-pinang', name: 'Pulau Pinang', parlimen: 13 },
  { code: 'SBH', slug: 'sabah', name: 'Sabah', parlimen: 25 },
  { code: 'SWK', slug: 'sarawak', name: 'Sarawak', parlimen: 31 },
  { code: 'SGR', slug: 'selangor', name: 'Selangor', parlimen: 22 },
  { code: 'TRG', slug: 'terengganu', name: 'Terengganu', parlimen: 8 },
  { code: 'KUL', slug: 'wp-kuala-lumpur', name: 'WP Kuala Lumpur', parlimen: 11 },
  { code: 'PJY', slug: 'wp-putrajaya', name: 'WP Putrajaya', parlimen: 1 },
  { code: 'LBN', slug: 'wp-labuan', name: 'WP Labuan', parlimen: 1 },
];

export const MAP_CONFIG = {
  center: [4.5, 109.0] as [number, number],
  zoom: 6,
  tileUrl: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
  tileAttribution:
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/">CARTO</a>',
};

export const FORMAT_COLORS: Record<string, string> = {
  KMZ: '#7B4FE0',
  XLSX: '#00D4AA',
  CSV: '#F0C040',
  KML: '#7B4FE0',
  PDF: '#FF6B6B',
  JSON: '#4FC3F7',
  GEOJSON: '#4FC3F7',
};

/**
 * Safely extract display name(s) from a negeri field that may be
 * a plain string, a single {id,name,slug} object, or an array of them.
 */
export function getNegeriName(
  negeri: string | { name?: string; slug?: string } | { name?: string; slug?: string }[] | undefined | null
): string {
  if (!negeri) return "";
  if (typeof negeri === "string") return negeri;
  if (Array.isArray(negeri)) return negeri.map((n) => n.name || n.slug || "").filter(Boolean).join(", ");
  return negeri.name || negeri.slug || "";
}

export function getNegeriSlug(
  negeri: string | { name?: string; slug?: string } | { name?: string; slug?: string }[] | undefined | null
): string {
  if (!negeri) return "";
  if (typeof negeri === "string") return negeri;
  if (Array.isArray(negeri)) return negeri.map((n) => n.slug || n.name || "").filter(Boolean).join(",");
  return negeri.slug || negeri.name || "";
}

export const NAV_LINKS = [
  { label: 'Utama', href: '/' },
  { label: 'Katalog Data', href: '/katalog' },
  { label: 'Peta', href: '/peta' },
  { label: 'Dashboard', href: '/dashboard' },
];
