import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { Disclaimer } from './Disclaimer';

export interface BreadcrumbCrumb {
  label: string;
  href?: string;
}

export interface FilterPill {
  label: string;
  active?: boolean;
  href?: string;
  onClick?: () => void;
}

interface PageHeaderProps {
  breadcrumb: BreadcrumbCrumb[];
  title: string;
  subtitle?: string;
  datasetLabel?: string;
  datasetDescription?: string;
  filterPills?: FilterPill[];
  showDisclaimer?: boolean;
}

export function PageHeader({ breadcrumb, title, subtitle, datasetLabel, datasetDescription, filterPills, showDisclaimer = true }: PageHeaderProps) {
  return (
    <section
      className="relative bg-spr-purple/5 text-spr-ink border-b border-spr-ink/10"
      aria-label="Page header"
    >
      <div className="w-full px-4 sm:px-6 lg:px-10 py-8 sm:py-10">
        <nav
          aria-label="Breadcrumb"
          className="flex items-center gap-1.5 text-xs text-spr-ink/55 mb-3"
        >
          {breadcrumb.map((c, i) => {
            const isLast = i === breadcrumb.length - 1;
            return (
              <span key={`${c.label}-${i}`} className="flex items-center gap-1.5">
                {c.href && !isLast ? (
                  <Link
                    href={c.href}
                    className="hover:text-spr-purple transition-colors"
                  >
                    {c.label}
                  </Link>
                ) : (
                  <span className={isLast ? 'text-spr-ink font-medium' : 'text-spr-ink/55'}>
                    {c.label}
                  </span>
                )}
                {!isLast && <ChevronRight className="w-3 h-3 opacity-50" strokeWidth={2} />}
              </span>
            );
          })}
        </nav>

        <h1 className="display-serif text-2xl sm:text-3xl text-spr-ink leading-tight">
          {title}
        </h1>

        {datasetDescription && (
          <p className="mt-2 text-sm text-spr-ink/70 leading-relaxed">
            {datasetLabel && <span className="font-semibold text-spr-ink">{datasetLabel}: </span>}
            {datasetDescription}
          </p>
        )}

        {subtitle && (
          <p className="mt-1.5 text-xs text-spr-ink/55 leading-relaxed">{subtitle}</p>
        )}

        {showDisclaimer && <Disclaimer className="mt-4" />}

        {filterPills && filterPills.length > 0 && (
          <div className="mt-5 flex flex-wrap gap-2">
            {filterPills.map((p) => {
              const cls = `inline-flex items-center px-3.5 py-1.5 rounded-full text-xs font-medium transition-colors ${
                p.active
                  ? 'bg-spr-purple text-white'
                  : 'bg-spr-ink/5 text-spr-ink/70 hover:text-spr-ink hover:bg-spr-ink/10'
              }`;
              if (p.href) {
                return (
                  <Link key={p.label} href={p.href} className={cls}>
                    {p.label}
                  </Link>
                );
              }
              return (
                <button key={p.label} type="button" onClick={p.onClick} className={cls}>
                  {p.label}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
