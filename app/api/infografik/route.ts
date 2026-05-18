import { NextRequest, NextResponse } from 'next/server';
import { WP_API } from '@/lib/wp-api';

export const runtime = 'edge';
export const revalidate = 300;

// Whitelisted query params forwarded to /spr/v1/infografik.
const FORWARD_KEYS = ['kategori', 'tahun', 'negeri', 'lokasi', 'pru_number', 'search', 'per_page', 'page'];

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
    const data = await res.json();
    return NextResponse.json(data, {
      headers: { 'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600' },
    });
  } catch {
    return NextResponse.json({ data: [] }, { status: 200, headers: { 'Cache-Control': 'no-store' } });
  }
}
