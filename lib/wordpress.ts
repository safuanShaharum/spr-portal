import { Dataset, PortalStats, Category } from "@/types/dataset";

const API_URL = process.env.NEXT_PUBLIC_WP_API_URL || "http://spr-open-data.local/wp-json";

export interface DatasetsResponse {
  data: Dataset[];
  total: number;
  totalPages: number;
}

/**
 * Parse datasets response — handles both:
 *   - WP-style: flat array + X-WP-Total/X-WP-TotalPages headers
 *   - Wrapped: { data: [...], total, totalPages }
 */
function parseDatasetsResponse(res: Response, json: unknown): DatasetsResponse {
  let data: Dataset[];

  if (Array.isArray(json)) {
    data = json;
  } else if (json && typeof json === "object" && "data" in json && Array.isArray((json as Record<string, unknown>).data)) {
    const obj = json as Record<string, unknown>;
    data = obj.data as Dataset[];
    if (typeof obj.total === "number" && typeof obj.totalPages === "number") {
      return { data, total: obj.total as number, totalPages: obj.totalPages as number };
    }
  } else {
    data = [];
  }

  const total = parseInt(res.headers.get("X-WP-Total") || "0", 10) || data.length;
  const totalPages = parseInt(res.headers.get("X-WP-TotalPages") || "1", 10);

  return { data, total, totalPages };
}

export async function getDatasets(
  params?: Record<string, string | number>
): Promise<DatasetsResponse> {
  try {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        searchParams.set(key, String(value));
      });
    }
    const query = searchParams.toString();
    const url = `${API_URL}/spr/v1/datasets${query ? `?${query}` : ""}`;

    const res = await fetch(url, { next: { revalidate: 300 } });
    if (!res.ok) throw new Error(`Failed to fetch datasets: ${res.status}`);
    const json = await res.json();
    return parseDatasetsResponse(res, json);
  } catch (error) {
    console.error("Error fetching datasets:", error);
    return { data: [], total: 0, totalPages: 0 };
  }
}

export async function getDataset(id: number): Promise<Dataset | null> {
  try {
    const res = await fetch(`${API_URL}/spr/v1/datasets/${id}`, {
      next: { revalidate: 300 },
    });
    if (!res.ok) throw new Error(`Failed to fetch dataset: ${res.status}`);
    return await res.json();
  } catch (error) {
    console.error("Error fetching dataset:", error);
    return null;
  }
}

export async function getStats(): Promise<PortalStats> {
  try {
    const res = await fetch(`${API_URL}/spr/v1/stats`, {
      next: { revalidate: 300 },
    });
    if (!res.ok) throw new Error(`Failed to fetch stats: ${res.status}`);
    return await res.json();
  } catch (error) {
    console.error("Error fetching stats:", error);
    return {
      total_datasets: 0,
      total_downloads: 0,
      total_categories: 0,
      total_negeri: 0,
      parlimen_count: 222,
      dun_count: 600,
    };
  }
}

export async function getCategories(): Promise<Category[]> {
  try {
    const res = await fetch(`${API_URL}/spr/v1/categories`, {
      next: { revalidate: 300 },
    });
    if (!res.ok) throw new Error(`Failed to fetch categories: ${res.status}`);
    const json = await res.json();
    return Array.isArray(json) ? json : [];
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
}

export async function getDatasetBySlug(slug: string): Promise<Dataset | null> {
  try {
    const { data } = await getDatasets({ per_page: 100, search: slug });
    const match = data.find((d) => d.slug === slug);
    if (!match) return null;
    return await getDataset(match.id);
  } catch (error) {
    console.error("Error fetching dataset by slug:", error);
    return null;
  }
}

export async function getRelatedDatasets(
  categorySlug: string,
  excludeId: number,
  limit = 4
): Promise<Dataset[]> {
  try {
    const res = await fetch(
      `${API_URL}/spr/v1/datasets?category=${encodeURIComponent(categorySlug)}&per_page=${limit + 1}`,
      { next: { revalidate: 300 } }
    );
    if (!res.ok) throw new Error(`Failed to fetch related: ${res.status}`);
    const json = await res.json();
    const data: Dataset[] = Array.isArray(json) ? json : (Array.isArray(json.data) ? json.data : []);
    return data.filter((d) => d.id !== excludeId).slice(0, limit);
  } catch (error) {
    console.error("Error fetching related datasets:", error);
    return [];
  }
}

export async function incrementDownload(id: number): Promise<void> {
  try {
    await fetch(`${API_URL}/spr/v1/datasets/${id}/download`);
  } catch (error) {
    console.error("Error incrementing download:", error);
  }
}
