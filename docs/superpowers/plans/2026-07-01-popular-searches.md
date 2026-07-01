# Dynamic Popular Searches Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the hardcoded homepage "POPULAR" search chips with the real most-searched queries (counting only searches that returned results), backed by WordPress.

**Architecture:** Next.js `/cari` logs every successful search to a new WordPress REST endpoint that upserts counts into a custom table. The homepage (server component) fetches the top-N from a second endpoint and passes them to the `Hero` client component, which falls back to a curated (working) list when data is missing.

**Tech Stack:** Next.js 14 App Router (React Server + Client Components), WordPress REST API (`spr/v1` namespace, PHP snippet), Vitest for unit tests.

Reference spec: [docs/superpowers/specs/2026-07-01-popular-searches-design.md](../specs/2026-07-01-popular-searches-design.md)

---

## File Structure

- **Create** `lib/search.ts` — shared pure helpers: `normalize(s)` (moved from `app/cari/page.tsx`) and `buildPopularChips(backend, fallback, limit)`.
- **Create** `lib/search.test.ts` — unit tests for the two pure helpers.
- **Create** `lib/popular-searches.ts` — server-side WP helpers: `getPopularSearches(limit)` and `logSearch(q, results)`.
- **Create** `vitest.config.ts` — minimal Vitest config.
- **Create** `wp-snippets/spr-search-tracker.php` — WordPress table + REST endpoints.
- **Modify** `package.json` — add Vitest devDep + `test` script.
- **Modify** `app/cari/page.tsx` — import `normalize` from `lib/search`; log successful searches.
- **Modify** `app/page.tsx` — fetch popular searches, pass to `<Hero>`.
- **Modify** `components/homepage/Hero.tsx` — accept `popular` prop, build chips via `buildPopularChips`, fix curated fallback.

---

## Task 1: Pure helpers + test setup

**Files:**
- Create: `vitest.config.ts`
- Create: `lib/search.ts`
- Test: `lib/search.test.ts`
- Modify: `package.json`

- [ ] **Step 1: Install Vitest**

Run: `npm install -D vitest`
Expected: `vitest` added to `devDependencies`, install completes without error.

- [ ] **Step 2: Add the test script to `package.json`**

In the `"scripts"` block, add:

```json
"test": "vitest run"
```

- [ ] **Step 3: Create `vitest.config.ts`**

```ts
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['lib/**/*.test.ts'],
    environment: 'node',
  },
});
```

- [ ] **Step 4: Write the failing test** — `lib/search.test.ts`

```ts
import { describe, it, expect } from 'vitest';
import { normalize, buildPopularChips } from './search';

describe('normalize', () => {
  it('collapses PRU variants to one key', () => {
    expect(normalize('PRU-15')).toBe('pru 15');
    expect(normalize('PRU Ke-15')).toBe('pru 15');
    expect(normalize('pru 15')).toBe('pru 15');
  });

  it('strips punctuation and collapses whitespace', () => {
    expect(normalize('  Keputusan   PRU!! ')).toBe('keputusan pru');
  });

  it('returns empty string for punctuation-only input', () => {
    expect(normalize('  --- ')).toBe('');
  });
});

describe('buildPopularChips', () => {
  const fallback = ['Keputusan PRU', 'Kadar keluar mengundi', 'Pemerhati Pilihan Raya'];

  it('returns the full fallback when backend is empty', () => {
    expect(buildPopularChips([], fallback, 3)).toEqual(fallback);
  });

  it('puts backend first then tops up from fallback, deduped by normalized key', () => {
    expect(buildPopularChips(['keputusan pru'], fallback, 3)).toEqual([
      'keputusan pru',
      'Kadar keluar mengundi',
      'Pemerhati Pilihan Raya',
    ]);
  });

  it('caps the result at the limit', () => {
    expect(buildPopularChips(['a', 'b', 'c', 'd'], fallback, 3)).toEqual(['a', 'b', 'c']);
  });
});
```

- [ ] **Step 5: Run the test to verify it fails**

Run: `npm test`
Expected: FAIL — `Cannot find module './search'` (file not created yet).

- [ ] **Step 6: Create `lib/search.ts`**

```ts
// Shared search helpers used by the /cari page and the homepage popular chips.

// Normalise text for search & grouping: lowercase, "ke-15"/"ke15" -> "15",
// strip punctuation to spaces, collapse whitespace, trim.
export function normalize(s: string): string {
  return s
    .toLowerCase()
    .replace(/ke-?(\d)/g, '$1')
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
```

- [ ] **Step 7: Run the test to verify it passes**

Run: `npm test`
Expected: PASS — all 6 tests green.

- [ ] **Step 8: Commit**

```bash
git add package.json package-lock.json vitest.config.ts lib/search.ts lib/search.test.ts
git commit -m "feat(search): add shared normalize + popular-chip builder with tests"
```

---

## Task 2: WordPress search-tracker snippet

**Files:**
- Create: `wp-snippets/spr-search-tracker.php`

This snippet is installed manually on cmsodspr (WP Code Snippets). It is committed to the repo for version control only; there is no automated test — verification is manual against the live WP.

- [ ] **Step 1: Create `wp-snippets/spr-search-tracker.php`**

```php
<?php
/**
 * SPR Search Tracker
 *
 * Paste into WP Code Snippets, "Run snippet everywhere", Activate.
 * Install on BOTH local WP and cmsodspr staging.
 *
 * Provides:
 *   - POST /wp-json/spr/v1/search-log      { q, results }  → records a search (results>0 only)
 *   - GET  /wp-json/spr/v1/popular-searches?limit=3        → top-N { data:[{q,hits}] }
 *
 * Stores only the query text + aggregate count in a custom table. No user
 * identity, IP, or session is recorded.
 */

if (!defined('ABSPATH')) exit;

// Normalise a query for grouping. Mirrors normalize() in lib/search.ts.
function spr_search_normalize($s) {
    $s = mb_strtolower(trim($s));
    $s = preg_replace('/ke-?(\d)/', '$1', $s);
    $s = preg_replace('/[^a-z0-9]+/', ' ', $s);
    $s = preg_replace('/\s+/', ' ', $s);
    return trim($s);
}

// Create the log table once (guarded by a version option).
function spr_search_ensure_table() {
    if (get_option('spr_search_log_version') === '1') return;
    global $wpdb;
    $table   = $wpdb->prefix . 'spr_search_log';
    $charset = $wpdb->get_charset_collate();
    $sql = "CREATE TABLE $table (
        query_norm VARCHAR(191) NOT NULL,
        query_display VARCHAR(255) NOT NULL,
        hits INT UNSIGNED NOT NULL DEFAULT 1,
        last_seen DATETIME NOT NULL,
        PRIMARY KEY (query_norm)
    ) $charset;";
    require_once ABSPATH . 'wp-admin/includes/upgrade.php';
    dbDelta($sql);
    update_option('spr_search_log_version', '1');
}

add_action('rest_api_init', function () {
    // POST /spr/v1/search-log
    register_rest_route('spr/v1', '/search-log', [
        'methods'             => 'POST',
        'permission_callback' => '__return_true',
        'callback'            => function (WP_REST_Request $req) {
            global $wpdb;
            $results = (int) $req->get_param('results');
            $q_raw   = (string) $req->get_param('q');

            if ($results <= 0) {
                return new WP_REST_Response(['ok' => false, 'reason' => 'no_results'], 200);
            }
            $norm = spr_search_normalize($q_raw);
            $len  = mb_strlen($norm);
            if ($len < 2 || $len > 100) {
                return new WP_REST_Response(['ok' => false, 'reason' => 'invalid'], 200);
            }

            spr_search_ensure_table();
            $table   = $wpdb->prefix . 'spr_search_log';
            $display = trim(mb_substr($q_raw, 0, 255));
            $now     = current_time('mysql');

            $wpdb->query($wpdb->prepare(
                "INSERT INTO $table (query_norm, query_display, hits, last_seen)
                 VALUES (%s, %s, 1, %s)
                 ON DUPLICATE KEY UPDATE
                    hits = hits + 1,
                    query_display = VALUES(query_display),
                    last_seen = VALUES(last_seen)",
                $norm, $display, $now
            ));

            return new WP_REST_Response(['ok' => true], 200);
        },
    ]);

    // GET /spr/v1/popular-searches
    register_rest_route('spr/v1', '/popular-searches', [
        'methods'             => 'GET',
        'permission_callback' => '__return_true',
        'callback'            => function (WP_REST_Request $req) {
            global $wpdb;
            spr_search_ensure_table();

            $limit = (int) $req->get_param('limit');
            if ($limit <= 0)  $limit = 3;
            if ($limit > 10)  $limit = 10;

            $table = $wpdb->prefix . 'spr_search_log';
            $rows  = $wpdb->get_results($wpdb->prepare(
                "SELECT query_display AS q, hits FROM $table
                 ORDER BY hits DESC, last_seen DESC LIMIT %d",
                $limit
            ), ARRAY_A);

            $data = array_map(function ($r) {
                return ['q' => $r['q'], 'hits' => (int) $r['hits']];
            }, $rows ?: []);

            return new WP_REST_Response(['data' => $data], 200, ['Cache-Control' => 'public, max-age=300']);
        },
    ]);
});
```

- [ ] **Step 2: Commit**

```bash
git add wp-snippets/spr-search-tracker.php
git commit -m "feat(wp): search-tracker endpoints for popular searches"
```

- [ ] **Step 3: Manual install + verify (do after deploy, not blocking code)**

1. Paste the snippet into WP Code Snippets on cmsodspr, "Run everywhere", Activate.
2. Verify empty state:
   Run: `curl -s "https://cmsodspr.sawangville.dev/wp-json/spr/v1/popular-searches?limit=3"`
   Expected: `{"data":[]}`
3. Record two searches:
   Run: `curl -s -X POST "https://cmsodspr.sawangville.dev/wp-json/spr/v1/search-log" -H "Content-Type: application/json" -d '{"q":"Keputusan PRU-15","results":4}'`
   Expected: `{"ok":true}` (run twice)
4. Verify a zero-result search is ignored:
   Run: `curl -s -X POST ".../spr/v1/search-log" -H "Content-Type: application/json" -d '{"q":"zzz","results":0}'`
   Expected: `{"ok":false,"reason":"no_results"}`
5. Verify top-N + grouping:
   Run: `curl -s ".../spr/v1/popular-searches?limit=3"`
   Expected: `{"data":[{"q":"Keputusan PRU-15","hits":2}]}`

---

## Task 3: Server-side WP helpers

**Files:**
- Create: `lib/popular-searches.ts`

No unit test (network I/O); verified via the manual curl checks in Task 2 and the build in Task 6.

- [ ] **Step 1: Create `lib/popular-searches.ts`**

```ts
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
```

- [ ] **Step 2: Commit**

```bash
git add lib/popular-searches.ts
git commit -m "feat(search): server helpers to fetch popular + log searches"
```

---

## Task 4: Log successful searches from /cari

**Files:**
- Modify: `app/cari/page.tsx`

- [ ] **Step 1: Import the shared `normalize` and remove the local copy**

Replace the local `normalize` function definition (the `function normalize(s: string): string { ... }` block) with an import at the top of the file, next to the other imports:

```ts
import { normalize } from "@/lib/search";
```

Delete the now-duplicate local `function normalize(...) { ... }` definition. Leave `withAliases`, `tokenize`, and `scoreOf` in place — they call the imported `normalize`.

- [ ] **Step 2: Import `logSearch`**

Add to the imports:

```ts
import { logSearch } from "@/lib/popular-searches";
```

- [ ] **Step 3: Log after computing `total`**

In `SearchPage`, inside the `if (tokens.length) { ... }` block, after `total` is assigned, add the log call:

```ts
  if (tokens.length) {
    katalogHits = searchKatalog(tokens);
    dashboardHits = searchDashboard(tokens);
    const allInfografik = await fetchInfografik();
    infografikHits = searchInfografik(allInfografik, tokens);
    total = katalogHits.length + dashboardHits.length + infografikHits.length;
    if (total > 0) {
      await logSearch(rawQuery, total);
    }
  }
```

- [ ] **Step 4: Typecheck**

Run: `npx tsc --noEmit -p tsconfig.json`
Expected: exit 0, no errors.

- [ ] **Step 5: Commit**

```bash
git add app/cari/page.tsx
git commit -m "feat(search): log successful searches to WordPress"
```

---

## Task 5: Wire popular chips into the homepage

**Files:**
- Modify: `app/page.tsx`
- Modify: `components/homepage/Hero.tsx`

- [ ] **Step 1: Fetch popular searches in `app/page.tsx` and pass to Hero**

Add the import at the top:

```ts
import { getPopularSearches } from '@/lib/popular-searches';
```

Make the component async and pass the prop. Change:

```ts
export default function HomePage() {
  return (
    <div className="relative">
      <Hero />
```

to:

```ts
export default async function HomePage() {
  const popular = await getPopularSearches(3);
  return (
    <div className="relative">
      <Hero popular={popular} />
```

- [ ] **Step 2: Update `Hero` to accept the prop and build chips**

In `components/homepage/Hero.tsx`:

(a) Add the import near the other imports:

```ts
import { buildPopularChips } from '@/lib/search';
```

(b) Replace the hardcoded constant:

```ts
const POPULAR_QUERIES = ['Keputusan PRU-15', 'Kadar keluar mengundi', 'Infografik PRK 2024'];
```

with a curated fallback of queries verified to return results under the token search:

```ts
const POPULAR_FALLBACK = ['Keputusan PRU', 'Kadar keluar mengundi', 'Pemerhati Pilihan Raya'];
```

(c) Give the component a `popular` prop. Change the component signature (currently `export function Hero() {`) to:

```ts
export function Hero({ popular = [] }: { popular?: string[] }) {
```

(d) Compute the chips just after the existing `useState`/`useRouter` hooks:

```ts
  const popularQueries = buildPopularChips(popular, POPULAR_FALLBACK, 3);
```

(e) Update the chip render loop to iterate `popularQueries` instead of `POPULAR_QUERIES`:

```ts
            {popularQueries.map((q) => (
```

Leave the `onClick={() => go(q)}` and surrounding markup unchanged.

- [ ] **Step 3: Typecheck**

Run: `npx tsc --noEmit -p tsconfig.json`
Expected: exit 0, no errors.

- [ ] **Step 4: Commit**

```bash
git add app/page.tsx components/homepage/Hero.tsx
git commit -m "feat(search): homepage popular chips from real search data with fallback"
```

---

## Task 6: Final verification + build

**Files:** none (verification only)

- [ ] **Step 1: Run the unit tests**

Run: `npm test`
Expected: PASS — all tests green.

- [ ] **Step 2: Typecheck the whole project**

Run: `npx tsc --noEmit -p tsconfig.json`
Expected: exit 0.

- [ ] **Step 3: Production build**

Run: `npm run build`
Expected: build succeeds with no type/lint errors.

- [ ] **Step 4: Manual smoke test (local dev)**

Run: `npm run dev`, open the homepage.
Expected: chips render (fallback list if WP snippet not yet installed). Clicking each chip navigates to `/cari?q=...` and returns results (no "Tiada hasil" for the fallback queries).

- [ ] **Step 5: Push**

```bash
git push origin main
```

- [ ] **Step 6: Post-deploy (after Vercel + WP snippet installed)**

Verify the full loop per Task 2 Step 3, then confirm the homepage chips reflect recorded searches after the 300s cache window.

---

## Notes

- **The WP snippet must be installed on BOTH WordPress instances**, because there are two independent stacks (each frontend calls its own WP):
  - `cmsodspr.sawangville.dev` — WordPress for the Vercel frontend (staging).
  - `10.24.131.103` (via `/wp-admin` → Code Snippets) — WordPress for the SPR production portal (`http://10.24.131.103/`), same box as the Next.js app.
- WP snippets are NOT part of the frontend repo — they live in the WordPress Code Snippets plugin (WP DB). The `wp-snippets/*.php` files in this repo are reference copies only; pulling the frontend into Gitea does not install them. The backup restored from cmsodspr → 10.24.131.103 predates this snippet, so it must be installed on 10.24.131.103 manually.
- Search counts are per-WP-instance (two separate DBs) and do not merge — each portal shows its own users' popular searches.
- Until the snippet is installed on a given WP, its endpoints 404, `getPopularSearches` returns `[]`, and chips show the curated fallback — the homepage stays fully functional.
- Endpoints are public; nothing secret is committed.
