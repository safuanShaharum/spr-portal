"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useRef, Suspense } from "react";

// Amendment R2 #18: Koko Analytics tracker for headless Next.js.
// Beacons POST to our /api/track proxy, which forwards to Koko with proper
// Referer header (Koko rejects requests whose Referer hostname is not the WP
// site itself — see app/api/track/route.ts).
const ENDPOINT = "/api/track";

function track(path: string) {
  if (typeof window === "undefined") return;

  const referrer = document.referrer || "";
  const body = JSON.stringify({ path, referrer });

  if (navigator.sendBeacon) {
    const blob = new Blob([body], { type: "application/json" });
    navigator.sendBeacon(ENDPOINT, blob);
  } else {
    fetch(ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
      keepalive: true,
    }).catch(() => {});
  }
}

function Inner() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  // Dedup guard: React Strict Mode + dev fast-refresh can re-run this effect
  // multiple times per real navigation. Track the last fired path and skip
  // duplicates.
  const lastFiredRef = useRef<string>("");

  useEffect(() => {
    if (!pathname) return;
    const qs = searchParams?.toString();
    const fullPath = qs ? `${pathname}?${qs}` : pathname;
    if (lastFiredRef.current === fullPath) return;
    lastFiredRef.current = fullPath;
    track(fullPath);
  }, [pathname, searchParams]);

  return null;
}

export default function KokoTracker() {
  return (
    <Suspense fallback={null}>
      <Inner />
    </Suspense>
  );
}
