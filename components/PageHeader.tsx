import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

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
  filterPills?: FilterPill[];
}

export function PageHeader({ breadcrumb, title, subtitle, filterPills }: PageHeaderProps) {
  return (
    <section
      className="relative bg-gradient-to-b from-spr-purple-deep to-spr-purple-dark text-white"
      aria-label="Page header"
    >
      <div className="w-full px-4 sm:px-6 lg:px-10 py-8 sm:py-10">
        <nav
          aria-label="Breadcrumb"
          className="flex items-center gap-1.5 text-xs text-white/70 mb-3"
        >
          {breadcrumb.map((c, i) => {
            const isLast = i === breadcrumb.length - 1;
            return (
              <span key={`${c.label}-${i}`} className="flex items-center gap-1.5">
                {c.href && !isLast ? (
                  <Link
                    href={c.href}
                    className="hover:text-white transition-colors"
                  >
                    {c.label}
                  </Link>
                ) : (
                  <span className={isLast ? 'text-white' : 'text-white/70'}>
                    {c.label}
                  </span>
                )}
                {!isLast && <ChevronRight className="w-3 h-3 opacity-50" strokeWidth={2} />}
              </span>
            );
          })}
        </nav>

        <h1 className="font-display text-2xl sm:text-3xl font-medium text-white leading-tight">
          {title}
        </h1>

        {subtitle && (
          <p className="mt-2 max-w-[560px] text-sm text-white/75 leading-relaxed">
            {subtitle}
          </p>
        )}

        {filterPills && filterPills.length > 0 && (
          <div className="mt-5 flex flex-wrap gap-2">
            {filterPills.map((p) => {
              const cls = `inline-flex items-center px-3.5 py-1.5 rounded-full text-xs font-medium transition-colors ${
                p.active
                  ? 'bg-white/15 text-white'
                  : 'bg-white/5 text-white/70 hover:text-white hover:bg-white/10'
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
