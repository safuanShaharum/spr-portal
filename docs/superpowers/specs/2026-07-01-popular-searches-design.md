# Dynamic Popular Searches — Design

**Date:** 2026-07-01
**Status:** Approved
**Author:** safuan + Claude

## Problem

The homepage search box ([components/homepage/Hero.tsx:19](../../../components/homepage/Hero.tsx#L19))
shows a hardcoded `POPULAR_QUERIES` list:

```js
const POPULAR_QUERIES = ['Keputusan PRU-15', 'Kadar keluar mengundi', 'Infografik PRK 2024'];
```

These do not reflect what users actually search, and some (e.g. "Infografik PRK 2024")
return poor/zero results when clicked because the word "infografik" is not part of any
indexed content.

## Goal

Make the "POPULAR" chips reflect the **most-searched queries by real users**, counting
**only queries that returned results** (so broken/typo/empty queries never become popular).
Must work across **both** deploy targets (Vercel preview + SPR Ubuntu server) with
consistent data.

## Chosen Approach: Option B — auto-tracking + filter

Track every successful search (results > 0), aggregate counts in the WordPress backend,
and surface the top-N on the homepage. Fall back to a curated (working) list when there is
insufficient data or the backend is unavailable.

### Why WordPress backend for storage

Both environments already call the same `WP_API`
(`https://cmsodspr.sawangville.dev/wp-json`, namespace `spr/v1`). Storing counts there
keeps data consistent across environments. Next.js server-side storage was rejected:
Vercel serverless has no persistent filesystem, and data would diverge between the two
deploys.

### Storage mechanism: custom DB table (Option A)

A custom table with atomic upsert, mirroring the existing `koko_analytics` pattern already
used by [wp-snippets/spr-download-tracker.php](../../../wp-snippets/spr-download-tracker.php).
Rejected the `wp_option` JSON-blob alternative due to read-modify-write race conditions and
unbounded growth.

## Components

### 1. WordPress backend — new snippet `wp-snippets/spr-search-tracker.php`

Install on cmsodspr (WP Code Snippets, "Run snippet everywhere", Activate), same as the
other `spr-*.php` snippets.

**Table** `{prefix}spr_search_log`, created lazily (guarded by a version option so it runs
once):

| Column | Type | Notes |
|---|---|---|
| `query_norm` | VARCHAR(191) | Primary key. Normalised grouping key. |
| `query_display` | VARCHAR(255) | Human-friendly form (latest raw query seen). |
| `hits` | INT UNSIGNED | Incremented per successful search. |
| `last_seen` | DATETIME | Updated on each hit. |

**Normalisation (server side, mirrors the Next.js `normalize()`):** lowercase,
`ke-?<digit>` → `<digit>`, strip punctuation to spaces, collapse whitespace, trim. This
groups "PRU-15", "PRU Ke-15", "pru 15" into one row.

**Endpoints (namespace `spr/v1`, permission `__return_true` like existing routes):**

- `POST /spr/v1/search-log` — body `{ q: string, results: number }`.
  Records **only if** `results > 0` **and** normalised `q` length is 2–100 chars.
  `INSERT ... ON DUPLICATE KEY UPDATE hits = hits + 1, query_display = VALUES(query_display),
  last_seen = NOW()`. Returns `{ ok: true }` (or `{ ok: false }` when skipped). No auth
  needed; length caps + results filter guard against junk/abuse.
- `GET /spr/v1/popular-searches?limit=3` — returns
  `{ data: [{ q: query_display, hits }] }` ordered by `hits DESC`, capped at `limit`
  (default 3, max 10). `Cache-Control: public, max-age=300`.

**Privacy:** stores only the query text + aggregate count. No user identity, IP, session,
or timestamps beyond `last_seen`.

### 2. Next.js — `app/cari/page.tsx`

After `total` is computed, if `total > 0`, fire a **non-blocking** POST to
`${WP_API}/spr/v1/search-log` with `{ q: rawQuery, results: total }`. Not awaited on the
render path; wrapped so a failure never affects the results page. This is what implements
the "only count queries with results" filter.

### 3. Next.js — `app/page.tsx` + `components/homepage/Hero.tsx`

- `app/page.tsx` (server component) fetches `GET /spr/v1/popular-searches?limit=3`
  (`next: { revalidate: 300 }`, try/catch → `[]` on failure) and passes a
  `popular: string[]` prop to `<Hero />`.
- `Hero` accepts an optional `popular` prop. It builds the chip list by taking the backend
  queries first, then topping up from a curated fallback list (deduped) until it has 3.
  If the backend returns nothing, the curated list shows in full. This covers cold-start
  and backend-down cases.

### 4. Fix curated fallback

Replace the broken `POPULAR_QUERIES` entries with queries verified to return results under
the new token search, e.g. `['Keputusan PRU', 'Kadar keluar mengundi', 'Pemerhati Pilihan Raya']`.

## Data Flow

```
User searches → /cari renders → total computed
   └─ if total > 0 → POST /spr/v1/search-log (fire-and-forget) → WP upsert hits++
Homepage load → GET /spr/v1/popular-searches → chips show real top queries
   └─ if empty / < 3 / WP down → curated fallback fills in
```

## Error Handling

All WordPress calls are fire-and-forget or try/catch and must never break a page render.
Backend unavailable → logging silently skipped; chips fall back to the curated list.

## Testing

- **Unit:** `normalize()` grouping (PRU-15 / PRU Ke-15 / pru 15 collapse to one key);
  Hero fallback/top-up logic (backend `[]`, partial, full).
- **Manual:** search a term twice → confirm it appears via `popular-searches`; confirm a
  zero-result query is NOT logged; confirm chips fall back when the endpoint is 404 (before
  the WP snippet is installed).

## Deployment Notes

- There are two independent stacks, each frontend calling its own WordPress:
  - Vercel frontend → `cmsodspr.sawangville.dev` WP (staging).
  - SPR production portal `http://10.24.131.103/` → WP on the same box (`10.24.131.103/wp-json`).
- New WP snippet `spr-search-tracker.php` must be installed **manually on BOTH WP instances**
  (WP Code Snippets, "Run everywhere", Activate). WP snippets are not part of the frontend
  repo; the backup restored to 10.24.131.103 predates this snippet.
- Until installed on a given WP, its endpoints 404 and chips use the curated fallback (still
  functional).
- Search counts are per-WP-instance and do not merge across the two.
- Endpoints are public; no secret/token to commit.

## Out of Scope (YAGNI)

- Full content search over dataset rows (candidate/constituency/party names) — separate task.
- Offensive-term blocklist, rate limiting, per-user dedup — length caps + results filter
  suffice for v1.
