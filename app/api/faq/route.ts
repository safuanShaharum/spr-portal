import { NextResponse } from "next/server";
import { WP_API } from "@/lib/wp-api";
import { stripInternalOrigin } from "@/lib/wp-url";

// Amendment R2 #24: proxy SPR FAQ REST endpoint with edge cache.
// Sources documents from ACF Options page "Soalan Lazim" via
// /wp-json/spr/v1/faq → returns [{title, url}, ...].
const FAQ_URL = `${WP_API}/spr/v1/faq`;

export const runtime = "edge";
export const revalidate = 300; // 5 minutes

export async function GET() {
  try {
    const res = await fetch(FAQ_URL, { next: { revalidate: 300 } });
    if (!res.ok) throw new Error(`upstream ${res.status}`);
    const data = stripInternalOrigin(await res.json());
    return NextResponse.json(data, {
      headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600" },
    });
  } catch {
    return NextResponse.json([], { status: 200, headers: { "Cache-Control": "no-store" } });
  }
}
