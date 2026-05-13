import { NextResponse } from "next/server";

// Amendment R2 #24: proxy SPR FAQ REST endpoint with edge cache.
// Sources documents from ACF Options page "Soalan Lazim" via
// /wp-json/spr/v1/faq → returns [{title, url}, ...].
const WP_API = (process.env.NEXT_PUBLIC_WP_API_URL || "https://cmsodspr.sawangville.dev/wp-json").replace(/\/+$/, "");
const FAQ_URL = `${WP_API}/spr/v1/faq`;

export const runtime = "edge";
export const revalidate = 300; // 5 minutes

export async function GET() {
  try {
    const res = await fetch(FAQ_URL, { next: { revalidate: 300 } });
    if (!res.ok) throw new Error(`upstream ${res.status}`);
    const data = await res.json();
    return NextResponse.json(data, {
      headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600" },
    });
  } catch {
    return NextResponse.json([], { status: 200, headers: { "Cache-Control": "no-store" } });
  }
}
