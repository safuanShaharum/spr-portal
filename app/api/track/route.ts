import { NextRequest, NextResponse } from "next/server";
import { WP_API } from "@/lib/wp-api";

// Amendment R2 #18: proxy Koko Analytics collect requests from headless frontend.
// Koko v3 optimized endpoint sits at WP root (/koko-analytics-collect.php) and
// expects params `pa` (path), `po` (post_id), optionally `r` (referrer URL).
// Server-to-server avoids CORS + lets us forward real client UA so Koko's bot
// filter doesn't trip.
// Force https: WP redirects http->https with a 301, which turns the POST beacon
// into a bodyless GET (301 drops the body) so Koko records nothing. Hitting https
// directly avoids the redirect. Node runtime + NODE_TLS_REJECT_UNAUTHORIZED=0
// (ecosystem.config.js) lets the server accept the self-signed cert.
const WP_BASE = WP_API.replace(/\/wp-json$/, "").replace(/^http:\/\//, "https://");
const KOKO_URL = `${WP_BASE}/koko-analytics-collect.php`;

// Node runtime (not edge): the server fetches Koko at https://127.0.0.1 which
// has a self-signed cert. Only the Node runtime honours NODE_TLS_REJECT_UNAUTHORIZED
// (set in ecosystem.config.js), so the edge runtime silently drops the beacon.
export const runtime = "nodejs";

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
      // Slugify: Koko's collect.php runs filter_var(...FILTER_VALIDATE_URL)
      // which rejects paths containing whitespace or special chars.
      const rawName = typeof body.filename === "string" ? body.filename : "unknown";
      const filename = rawName
        .toLowerCase()
        .replace(/[\s_]+/g, "-")
        .replace(/[^a-z0-9.\-]/g, "")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, "") || "unknown";
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
