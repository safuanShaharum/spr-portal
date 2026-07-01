import { WP_API } from '@/lib/wp-api';

// Fetch the top popular search queries from WordPress. Returns [] on any
// failure so the caller can fall back to a curated list.
export async function getPopularSearches(limit = 3): Promise<string[]> {
  try {
    const res = await fetch(`${WP_API}/spr/v1/popular-searches?limit=${limit}`, {
      next: { revalidate: 300 },
    });
    if (!res.ok) return [];
    const json = await res.json();
    return ((json.data as { q: string }[]) || []).map((d) => d.q).filter(Boolean);
  } catch {
    return [];
  }
}

// Record a successful search. Awaited (reliable on serverless) but wrapped so
// it can never break the search page; bounded by a 2s timeout.
export async function logSearch(q: string, results: number): Promise<void> {
  if (results <= 0) return;
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 2000);
    await fetch(`${WP_API}/spr/v1/search-log`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ q, results }),
      signal: controller.signal,
      cache: 'no-store',
    });
    clearTimeout(timer);
  } catch {
    // logging must never break search
  }
}
