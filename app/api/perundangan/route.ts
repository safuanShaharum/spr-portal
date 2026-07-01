import { NextResponse } from "next/server";
import { WP_API } from "@/lib/wp-api";
import { stripInternalOrigin } from "@/lib/wp-url";

// Amendment R2 #23: proxy SPR Perundangan REST endpoint with edge cache.
// Sources documents from ACF Options page "Peruntukan Undang-undang" via
// /wp-json/spr/v1/perundangan → returns [{title, year, url}, ...].
const PERUNDANGAN_URL = `${WP_API}/spr/v1/perundangan`;

export const runtime = "edge";
export const revalidate = 300;

export async function GET() {
  try {
    const res = await fetch(PERUNDANGAN_URL, { next: { revalidate: 300 } });
    if (!res.ok) throw new Error(`upstream ${res.status}`);
    const data = stripInternalOrigin(await res.json());
    return NextResponse.json(data, {
      headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600" },
    });
  } catch {
    return NextResponse.json([], { status: 200, headers: { "Cache-Control": "no-store" } });
  }
}
