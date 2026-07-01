import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import type { KawasanEntry } from './search';

// Server-side reader for the build-time constituency index
// (public/data/_kawasan-index.json). Cached per server instance; the file only
// changes on redeploy. Returns [] on any failure so /cari degrades gracefully.
let cache: KawasanEntry[] | null = null;

export async function getKawasanIndex(): Promise<KawasanEntry[]> {
  if (cache) return cache;
  try {
    const raw = await readFile(
      join(process.cwd(), 'public', 'data', '_kawasan-index.json'),
      'utf8',
    );
    const parsed = JSON.parse(raw);
    cache = Array.isArray(parsed) ? (parsed as KawasanEntry[]) : [];
  } catch {
    cache = [];
  }
  return cache;
}
