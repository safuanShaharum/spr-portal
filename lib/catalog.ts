import type { CatalogIndex, CatalogData } from '@/types/catalog';

export async function getCatalogIndex(): Promise<CatalogIndex[]> {
  const res = await fetch('/data/_index.json');
  if (!res.ok) throw new Error('Failed to load catalog index');
  return res.json();
}

export async function getCatalogData(slug: string): Promise<CatalogData> {
  const res = await fetch(`/data/${slug}.json`);
  if (!res.ok) throw new Error(`Failed to load dataset: ${slug}`);
  return res.json();
}
