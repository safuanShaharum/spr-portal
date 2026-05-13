import { NextRequest, NextResponse } from "next/server";

// Amendment R2 #18: proxy Koko Analytics collect requests from headless frontend.
// Koko v3 optimized endpoint sits at WP root (/koko-analytics-collect.php) and
// expects params `pa` (path), `po` (post_id), optionally `r` (referrer URL).
// Server-to-server avoids CORS + lets us forward real client UA so Koko's bot
// filter doesn't trip.
const WP_BASE = (process.env.NEXT_PUBLIC_KOKO_WP_BASE || "https://cmsodspr.sawangville.dev").replace(/\/+$/, "");
const KOKO_URL = `${WP_BASE}/koko-analytics-collect.php`;

export const runtime = "edge";

export async function POST(req: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "bad-body" }, { status: 400 });
  }

  const ua = req.headers.get("user-agent") || "Mozilla/5.0";

  try {
    if (body.type === "download") {
      // Tracked as synthetic pageview in Koko: /muat-turun/<filename>.
      // Footer counter sums all pageviews on these paths from Koko's data.
      const filename = typeof body.filename === "string" ? body.filename : "unknown";
      const kokoForm = new URLSearchParams({ pa: `/muat-turun/${filename}`, po: "0" });
      await fetch(KOKO_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Referer: `${WP_BASE}/`,
          "User-Agent": ua,
        },
        body: kokoForm.toString(),
      });
    } else {
      // Pageview → Koko optimized endpoint
      const path = typeof body.path === "string" ? body.path : "/";
      const referrer = typeof body.referrer === "string" ? body.referrer : "";
      const form = new URLSearchParams({ pa: path, po: "0" });
      if (referrer) form.set("r", referrer);
      await fetch(KOKO_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Referer: `${WP_BASE}/`,
          "User-Agent": ua,
        },
        body: form.toString(),
      });
    }
  } catch {
    // Best-effort — never bubble errors to client
  }

  return new NextResponse(null, { status: 204 });
}
