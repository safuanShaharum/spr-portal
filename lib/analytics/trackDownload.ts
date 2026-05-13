// Amendment R2 #18 Phase 2: fire-and-forget download event to /api/track
// (proxied to Koko's collect endpoint). Safe to call from any onClick/href.
export function trackDownload(filename: string) {
  if (typeof window === "undefined") return;

  const body = JSON.stringify({ type: "download", filename });

  try {
    if (navigator.sendBeacon) {
      const blob = new Blob([body], { type: "application/json" });
      navigator.sendBeacon("/api/track", blob);
    } else {
      fetch("/api/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body,
        keepalive: true,
      }).catch(() => {});
    }
  } catch {
    // best-effort
  }
}
