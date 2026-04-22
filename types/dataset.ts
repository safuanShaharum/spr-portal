export interface ColumnConfig {
  column_key: string;
  column_label: string;
  column_type: string;
  column_visible: boolean;
  column_filterable: boolean;
  column_sortable: boolean;
}

export interface NegeriTerm {
  id: number;
  name: string;
  slug: string;
}

export interface Dataset {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  format: string;
  file_size: string;
  year: string;
  source: string;
  download_count: number;
  last_updated: string;
  preview_enabled: boolean;
  categories: Category[];
  negeri: string | NegeriTerm | NegeriTerm[];
  featured_image: string;
  date: string;
  file_url: string;
  columns_config: ColumnConfig[];
  description: string;
}

export interface PreviewResponse {
  headers: HeaderConfig[];
  rows: Record<string, string | number>[];
  total_rows: number;
  page: number;
  per_page: number;
  total_pages: number;
}

export interface HeaderConfig {
  key: string;
  label: string;
  type: string;
  sortable: boolean;
  filterable: boolean;
}

export interface PortalStats {
  total_datasets: number;
  total_downloads: number;
  total_categories: number;
  total_negeri: number;
  parlimen_count: number;
  dun_count: number;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  description: string;
  count: number;
  parent: number;
}
