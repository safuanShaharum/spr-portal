import { NextResponse } from "next/server";

// Amendment R2 #18 Phase 2: aggregate counters for footer.
// Fetches from custom SPR REST endpoint that joins Koko site_stats + own
// wp_spr_downloads table. Cached for 5 min at the edge.
const WP_API = (process.env.NEXT_PUBLIC_WP_API_URL || "https://cmsodspr.sawangville.dev/wp-json").replace(/\/+$/, "");
const STATS_URL = `${WP_API}/spr/v1/stats`;

export const runtime = "edge";
export const revalidate = 30;

export async function GET() {
  try {
    const res = await fetch(STATS_URL, { next: { revalidate: 30 } });
    if (!res.ok) throw new Error(`upstream ${res.status}`);
    const data = await res.json();
    return NextResponse.json(data, {
      headers: { "Cache-Control": "public, s-maxage=30, stale-while-revalidate=120" },
    });
  } catch {
    return NextResponse.json(
      { today: 0, month: 0, year: 0, downloads: 0 },
      { status: 200, headers: { "Cache-Control": "no-store" } }
    );
  }
}
