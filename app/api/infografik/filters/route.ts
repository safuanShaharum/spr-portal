import { NextRequest, NextResponse } from 'next/server';
import { WP_API } from '@/lib/wp-api';

export const runtime = 'edge';
export const revalidate = 300;

export async function GET(req: NextRequest) {
  const kategori = req.nextUrl.searchParams.get('kategori');
  const url = `${WP_API}/spr/v1/infografik/filters${kategori ? `?kategori=${encodeURIComponent(kategori)}` : ''}`;

  try {
    const res = await fetch(url, { next: { revalidate: 300 } });
    if (!res.ok) throw new Error(`upstream ${res.status}`);
    const data = await res.json();
    return NextResponse.json(data, {
      headers: { 'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600' },
    });
  } catch {
    return NextResponse.json({ years: [], pru_numbers: [] }, { status: 200, headers: { 'Cache-Control': 'no-store' } });
  }
}
