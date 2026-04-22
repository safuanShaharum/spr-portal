import Link from "next/link";
import { Search, Database, BarChart3, Image as ImageIcon } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { BAHAGIAN_LIST } from "@/lib/katalog-data";
import { DASHBOARD_TABS } from "@/lib/dashboard-tabs";

export const dynamic = "force-dynamic";

const WP_API = (process.env.NEXT_PUBLIC_WP_API_URL || "http://spr-open-data.local/wp-json").replace(/\/$/, "");

const INFOGRAFIK_KATEGORI = ["pru", "dun_dn_du", "prk", "pemerhati", "kesalahan"] as const;

interface InfografikItem {
  id: number;
  title: string;
  caption: string;
  kategori: string;
  pru_number: number | null;
  tahun: number | null;
}

interface KatalogHit {
  bahaganLabel: string;
  bahagianSlug: string;
  tabLabel?: string;
  tabIndex?: number;
}

interface DashboardHit {
  slug: string;
  label: string;
}

interface InfografikHit {
  title: string;
  caption: string;
  kategori: string;
}

function matches(haystack: string, needle: string) {
  return haystack.toLowerCase().includes(needle);
}

async function fetchInfografik(): Promise<InfografikItem[]> {
  try {
    const results = await Promise.all(
      INFOGRAFIK_KATEGORI.map((k) =>
        fetch(`${WP_API}/spr/v1/infografik?kategori=${k}`, { next: { revalidate: 600 } })
          .then((r) => (r.ok ? r.json() : { data: [] }))
          .then((j) => (j.data || []) as InfografikItem[])
          .catch(() => [] as InfografikItem[])
      )
    );
    return results.flat();
  } catch {
    return [];
  }
}

function searchKatalog(q: string): KatalogHit[] {
  const hits: KatalogHit[] = [];
  for (const b of BAHAGIAN_LIST) {
    if (matches(b.label, q)) {
      hits.push({ bahaganLabel: b.label, bahagianSlug: b.slug });
    }
    b.tabs.forEach((t, i) => {
      if (matches(t.label, q)) {
        hits.push({
          bahaganLabel: b.label,
          bahagianSlug: b.slug,
          tabLabel: t.label,
          tabIndex: i,
        });
      }
    });
  }
  return hits;
}

function searchDashboard(q: string): DashboardHit[] {
  return DASHBOARD_TABS.filter((t) => matches(t.label, q));
}

function searchInfografik(items: InfografikItem[], q: string): InfografikHit[] {
  return items
    .filter((i) => matches(i.title || "", q) || matches(i.caption || "", q))
    .slice(0, 50)
    .map((i) => ({ title: i.title, caption: i.caption, kategori: i.kategori }));
}

interface SearchPageProps {
  searchParams: { q?: string };
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const rawQuery = searchParams.q?.trim() ?? "";
  const q = rawQuery.toLowerCase();

  let katalogHits: KatalogHit[] = [];
  let dashboardHits: DashboardHit[] = [];
  let infografikHits: InfografikHit[] = [];
  let total = 0;

  if (q) {
    katalogHits = searchKatalog(q);
    dashboardHits = searchDashboard(q);
    const allInfografik = await fetchInfografik();
    infografikHits = searchInfografik(allInfografik, q);
    total = katalogHits.length + dashboardHits.length + infografikHits.length;
  }

  return (
    <div>
      <PageHeader
        breadcrumb={[
          { label: "Utama", href: "/" },
          { label: "Cari" },
        ]}
        title={rawQuery ? `Hasil carian untuk "${rawQuery}"` : "Cari"}
        subtitle={
          rawQuery
            ? `${total} hasil dijumpai dalam Katalog Data, Dashboard dan Infografik.`
            : "Masukkan kata kunci di bar carian untuk mencari dataset, dashboard dan infografik."
        }
      />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-10 py-10 space-y-12">
        {!rawQuery && (
          <EmptyHint />
        )}

        {rawQuery && total === 0 && (
          <NoResults query={rawQuery} />
        )}

        {katalogHits.length > 0 && (
          <ResultGroup
            icon={<Database className="w-5 h-5" />}
            title="Katalog Data"
            count={katalogHits.length}
          >
            {katalogHits.map((h, i) => {
              const href = h.tabLabel
                ? `/katalog?bahagian=${encodeURIComponent(h.bahagianSlug)}&tab=${h.tabIndex}`
                : `/katalog?bahagian=${encodeURIComponent(h.bahagianSlug)}`;
              return (
                <ResultRow
                  key={`k-${i}`}
                  href={href}
                  title={h.tabLabel ?? h.bahaganLabel}
                  subtitle={h.tabLabel ? `dalam ${h.bahaganLabel}` : "Bahagian Katalog"}
                />
              );
            })}
          </ResultGroup>
        )}

        {dashboardHits.length > 0 && (
          <ResultGroup
            icon={<BarChart3 className="w-5 h-5" />}
            title="Dashboard"
            count={dashboardHits.length}
          >
            {dashboardHits.map((h) => (
              <ResultRow
                key={`d-${h.slug}`}
                href={`/dashboard?tab=${h.slug}`}
                title={h.label}
                subtitle="Visualisasi interaktif"
              />
            ))}
          </ResultGroup>
        )}

        {infografikHits.length > 0 && (
          <ResultGroup
            icon={<ImageIcon className="w-5 h-5" />}
            title="Infografik"
            count={infografikHits.length}
          >
            {infografikHits.map((h, i) => (
              <ResultRow
                key={`i-${i}`}
                href={`/infografik-pilihan-raya?kategori=${h.kategori}`}
                title={h.title}
                subtitle={h.caption}
              />
            ))}
          </ResultGroup>
        )}
      </div>
    </div>
  );
}

function ResultGroup({
  icon,
  title,
  count,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  count: number;
  children: React.ReactNode;
}) {
  return (
    <section>
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-spr-primary-50 text-spr-primary flex items-center justify-center">
          {icon}
        </div>
        <div>
          <h2 className="font-display text-xl font-semibold text-spr-navy">{title}</h2>
          <p className="text-xs text-spr-text-muted">{count} hasil</p>
        </div>
      </div>
      <div className="border border-spr-border rounded-2xl overflow-hidden bg-white">
        {children}
      </div>
    </section>
  );
}

function ResultRow({ href, title, subtitle }: { href: string; title: string; subtitle?: string }) {
  return (
    <Link
      href={href}
      className="block px-5 py-4 border-b border-spr-border-light last:border-b-0 hover:bg-spr-bg-secondary transition-colors group"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <div className="text-sm font-semibold text-spr-navy group-hover:text-spr-primary transition-colors truncate">
            {title}
          </div>
          {subtitle && (
            <div className="text-xs text-spr-text-muted mt-0.5 line-clamp-2">{subtitle}</div>
          )}
        </div>
        <span className="text-spr-text-muted group-hover:text-spr-primary transition-colors shrink-0">→</span>
      </div>
    </Link>
  );
}

function EmptyHint() {
  return (
    <div className="text-center py-16">
      <div className="w-14 h-14 mx-auto rounded-2xl bg-spr-bg-secondary text-spr-text-muted flex items-center justify-center mb-4">
        <Search className="w-6 h-6" />
      </div>
      <p className="text-spr-text-muted text-sm">
        Cuba cari sesuatu seperti{" "}
        <span className="font-medium text-spr-navy">&ldquo;Keputusan PRU&rdquo;</span>{" "}
        atau <span className="font-medium text-spr-navy">&ldquo;Pemerhati&rdquo;</span>.
      </p>
    </div>
  );
}

function NoResults({ query }: { query: string }) {
  return (
    <div className="text-center py-16">
      <div className="w-14 h-14 mx-auto rounded-2xl bg-spr-bg-secondary text-spr-text-muted flex items-center justify-center mb-4">
        <Search className="w-6 h-6" />
      </div>
      <h3 className="text-spr-navy font-semibold mb-1">Tiada hasil dijumpai</h3>
      <p className="text-spr-text-muted text-sm">
        Tiada padanan untuk <span className="font-medium text-spr-navy">&ldquo;{query}&rdquo;</span>{" "}
        dalam Katalog Data, Dashboard atau Infografik.
      </p>
    </div>
  );
}
