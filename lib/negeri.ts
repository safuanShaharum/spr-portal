// Canonical list of Malaysian states + federal territories, in the exact format
// used across SPR datasets (uppercase, e.g. "W.P KUALA LUMPUR"). Used so the
// "Negeri" filter always shows the full list, even when a dataset has no rows
// for some states yet.
export const MALAYSIA_NEGERI = [
  "JOHOR",
  "KEDAH",
  "KELANTAN",
  "MELAKA",
  "NEGERI SEMBILAN",
  "PAHANG",
  "PERAK",
  "PERLIS",
  "PULAU PINANG",
  "SABAH",
  "SARAWAK",
  "SELANGOR",
  "TERENGGANU",
  "W.P KUALA LUMPUR",
  "W.P LABUAN",
  "W.P PUTRAJAYA",
];

// Merge the canonical states with any extra values found in the data (deduped by
// uppercase), keeping the canonical order first and appending extras sorted.
export function mergeNegeriOptions(dataValues: string[]): string[] {
  const seen = new Set(MALAYSIA_NEGERI.map((n) => n.toUpperCase()));
  const extra = new Set<string>();
  for (const v of dataValues) {
    const t = v.trim();
    // Keep real names (has a letter) plus the "-" national/PRU marker (shown as
    // "PRU" in the UI). Drops blanks/whitespace-only junk.
    if (t && (/[a-z]/i.test(t) || t === "-") && !seen.has(t.toUpperCase())) extra.add(t);
  }
  return [...MALAYSIA_NEGERI, ...Array.from(extra).sort()];
}
