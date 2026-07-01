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

// PRU number → election year. Used to deep-link search results to the right year.
export const PRU_NUMBER_TO_YEAR: Record<string, string> = {
  '12': '2008',
  '13': '2013',
  '14': '2018',
  '15': '2022',
};

const VALID_PRU_YEARS = new Set(Object.values(PRU_NUMBER_TO_YEAR));

// Detect a target PRU election year from a search query.
// "pru 14" / "pru-14" / "pru ke-14" / "pru14" -> "2018"; explicit "2018" -> "2018".
// Returns null when there is no PRU number or known election year.
export function detectPruYear(query: string): string | null {
  const q = query.toLowerCase();
  const pru = q.match(/pru[\s-]*(?:ke[\s-]*)?(\d{1,2})/);
  if (pru && PRU_NUMBER_TO_YEAR[pru[1]]) return PRU_NUMBER_TO_YEAR[pru[1]];
  const year = q.match(/\b(20\d{2})\b/);
  if (year && VALID_PRU_YEARS.has(year[1])) return year[1];
  return null;
}

// A constituency entry in the build-time kawasan index (public/data/_kawasan-index.json).
export interface KawasanEntry {
  name: string; // exact column value, e.g. "P.004 LANGKAWI" / "N.25 KAJANG"
  type: 'parlimen' | 'dun';
  negeri: string;
}

// Match a search query against the constituency index. Tokens of length >= 2 must
// all be found in the entry's "name negeri" haystack. Ranked by match count, capped.
export function matchKawasan(index: KawasanEntry[], query: string, limit = 20): KawasanEntry[] {
  const tokens = normalize(query).split(' ').filter((t) => t.length >= 2);
  if (!tokens.length) return [];
  const scored: { entry: KawasanEntry; score: number }[] = [];
  for (const entry of index) {
    const hay = normalize(`${entry.name} ${entry.negeri}`);
    let score = 0;
    for (const t of tokens) if (hay.includes(t)) score++;
    if (score === tokens.length) scored.push({ entry, score });
  }
  return scored
    .sort((a, b) => b.score - a.score || a.entry.name.localeCompare(b.entry.name))
    .slice(0, limit)
    .map((s) => s.entry);
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
