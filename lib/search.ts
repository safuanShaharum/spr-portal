// Shared search helpers used by the /cari page and the homepage popular chips.

// Normalise text for search & grouping: lowercase, "ke-15"/"ke15" -> "15",
// strip punctuation to spaces, collapse whitespace, trim.
export function normalize(s: string): string {
  return s
    .toLowerCase()
    .replace(/\bke-?(\d)/g, '$1')
    // ASCII-only: BM/SPR queries have no diacritics; non-ASCII letters are dropped.
    .replace(/[^a-z0-9]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

// Build the homepage popular-search chips: real backend queries first, then
// top up from the curated fallback, deduped by normalized key, capped at limit.
export function buildPopularChips(
  backend: string[],
  fallback: string[],
  limit = 3,
): string[] {
  const out: string[] = [];
  const seen = new Set<string>();
  for (const q of [...backend, ...fallback]) {
    const key = normalize(q);
    if (!key || seen.has(key)) continue;
    seen.add(key);
    out.push(q);
    if (out.length >= limit) break;
  }
  return out;
}
