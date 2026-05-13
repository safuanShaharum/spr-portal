import { NextResponse } from "next/server";

// Amendment R2 #23: proxy SPR Perundangan REST endpoint with edge cache.
// Sources documents from ACF Options page "Peruntukan Undang-undang" via
// /wp-json/spr/v1/perundangan → returns [{title, year, url}, ...].
const WP_API = (process.env.NEXT_PUBLIC_WP_API_URL || "https://cmsodspr.sawangville.dev/wp-json").replace(/\/+$/, "");
const PERUNDANGAN_URL = `${WP_API}/spr/v1/perundangan`;

export const runtime = "edge";
export const revalidate = 300;

export async function GET() {
  try {
    const res = await fetch(PERUNDANGAN_URL, { next: { revalidate: 300 } });
    if (!res.ok) throw new Error(`upstream ${res.status}`);
    const data = await res.json();
    return NextResponse.json(data, {
      headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600" },
    });
  } catch {
    return NextResponse.json([], { status: 200, headers: { "Cache-Control": "no-store" } });
  }
}
