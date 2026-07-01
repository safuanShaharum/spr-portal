import { NextRequest, NextResponse } from 'next/server';
import { WP_API } from '@/lib/wp-api';

export const runtime = 'edge';
export const revalidate = 300;

// Whitelisted query params forwarded to /spr/v1/infografik.
const FORWARD_KEYS = ['kategori', 'tahun', 'negeri', 'lokasi', 'pru_number', 'search', 'per_page', 'page'];

// WP on the SPR server emits media URLs as https://<internal-host>/wp-content/...
// (self-signed cert / wrong host) which the browser cannot load. Make any WP
// media/API URL root-relative so it loads from the portal's own origin (nginx
// routes /wp-content to WP). Generic: strips scheme+host from any /wp-* URL.
function stripInternalOrigin(value: unknown): unknown {
  if (typeof value === 'string') {
    return value.replace(/^https?:\/\/[^/]+(\/wp-)/, '$1');
  }
  if (Array.isArray(value)) return value.map(stripInternalOrigin);
  if (value && typeof value === 'object') {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value)) out[k] = stripInternalOrigin(v);
    return out;
  }
  return value;
}

export async function GET(req: NextRequest) {
  const incoming = req.nextUrl.searchParams;
  const upstream = new URLSearchParams();
  for (const key of FORWARD_KEYS) {
    const v = incoming.get(key);
    if (v != null && v !== '') upstream.set(key, v);
  }
  const qs = upstream.toString();
  const url = `${WP_API}/spr/v1/infografik${qs ? `?${qs}` : ''}`;

  try {
    const res = await fetch(url, { next: { revalidate: 300 } });
    if (!res.ok) throw new Error(`upstream ${res.status}`);
    const data = stripInternalOrigin(await res.json());
    return NextResponse.json(data, {
      headers: { 'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600' },
    });
  } catch {
    return NextResponse.json({ data: [] }, { status: 200, headers: { 'Cache-Control': 'no-store' } });
  }
}
