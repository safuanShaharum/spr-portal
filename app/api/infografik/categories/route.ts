import { NextResponse } from 'next/server';
import { WP_API } from '@/lib/wp-api';

export const runtime = 'edge';
export const revalidate = 300;

export async function GET() {
  try {
    const res = await fetch(`${WP_API}/spr/v1/infografik/categories`, { next: { revalidate: 300 } });
    if (!res.ok) throw new Error(`upstream ${res.status}`);
    const data = await res.json();
    return NextResponse.json(data, {
      headers: { 'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600' },
    });
  } catch {
    return NextResponse.json([], { status: 200, headers: { 'Cache-Control': 'no-store' } });
  }
}
