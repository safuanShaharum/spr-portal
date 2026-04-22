export interface CatalogIndex {
  slug: string;
  name: string;
  rows: number;
  columns: string[];
  size_kb: number;
}

export type CatalogRow = Record<string, string | number>;
export type CatalogData = CatalogRow[];
