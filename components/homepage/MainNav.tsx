'use client';

import { startTransition, useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { ArrowRight, Menu, Search, X } from 'lucide-react';

const NAV_ITEMS = [
  { label: 'Utama', href: '/' },
  { label: 'Katalog Data', href: '/katalog', hasDropdown: true },
  { label: 'Dashboard', href: '/dashboard', hasDropdown: true },
  { label: 'Infografik', href: '/infografik-pilihan-raya' },
];

interface MainNavProps {
  /**
   * When true (homepage), the nav is absolutely positioned over the hero.
   * When false (subpages), it occupies its own row with a solid background.
   * Defaults to true for "/" and false for everything else.
   */
  overlay?: boolean;
}

export function MainNav({ overlay }: MainNavProps = {}) {
  const pathname = usePathname();
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const isOverlay = overlay ?? pathname === '/';
  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname?.startsWith(href);

  // Close the drawer whenever the route changes.
  useEffect(() => {
    setDrawerOpen(false);
  }, [pathname]);

  // Lock body scroll while drawer is open.
  useEffect(() => {
    if (!drawerOpen) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = original; };
  }, [drawerOpen]);

  // Close drawer on Escape.
  useEffect(() => {
    if (!drawerOpen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setDrawerOpen(false); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [drawerOpen]);

  function handleSearch(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const q = query.trim();
    if (!q) return;
    setDrawerOpen(false);
    router.push(`/cari?q=${encodeURIComponent(q)}`);
  }

  const wrapperClass = isOverlay
    ? 'absolute top-[36px] left-0 right-0 z-50'
    : 'relative z-40 bg-spr-purple-deep';

  return (
    <>
      <nav className={wrapperClass}>
        <div className="w-full px-4 sm:px-6 lg:px-10 py-5 flex items-center justify-between gap-4 lg:grid lg:grid-cols-[1fr_auto_1fr]">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group lg:justify-self-start">
            <Image
              src="/images/logo-spr.png"
              alt="Suruhanjaya Pilihan Raya"
              width={62}
              height={48}
              priority
              className="h-10 sm:h-12 w-auto object-contain group-hover:scale-105 transition-transform"
            />
            <div className="text-white min-w-0">
              <div className="text-[10px] sm:text-[11px] uppercase tracking-[0.2em] opacity-70 font-medium">Portal Data Terbuka</div>
              <div className="font-serif text-sm sm:text-lg font-semibold leading-tight">Suruhanjaya Pilihan Raya</div>
            </div>
          </Link>

          {/* Nav Items — desktop only */}
          <div className="hidden lg:flex items-center gap-1 glass rounded-full px-2 py-1.5 justify-self-center">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className={`px-5 py-2 text-sm font-medium transition flex items-center gap-1 rounded-full ${
                  isActive(item.href)
                    ? 'text-white bg-white/15'
                    : 'text-white/80 hover:text-white'
                }`}
              >
                {item.label}
                {item.hasDropdown && (
                  <svg className="w-3 h-3 opacity-60" viewBox="0 0 12 12" fill="currentColor">
                    <path d="M3 4.5l3 3 3-3" />
                  </svg>
                )}
              </Link>
            ))}
          </div>

          {/* Desktop actions — CTA on homepage, search on subpages */}
          <div className="hidden lg:flex items-center gap-3 lg:justify-self-end">
            {isOverlay ? (
              <Link
                href="/katalog"
                className="inline-flex items-center gap-2 bg-spr-gold text-spr-ink hover:bg-spr-gold/90 px-5 py-2.5 rounded-full text-sm font-semibold transition group"
              >
                Mula meneroka
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" strokeWidth={2.5} />
              </Link>
            ) : (
              <form
                onSubmit={handleSearch}
                className="flex items-center gap-2 glass text-white/90 focus-within:text-white px-4 py-2.5 rounded-full text-sm transition"
                role="search"
              >
                <Search className="w-4 h-4 shrink-0" />
                <input
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Cari dataset..."
                  aria-label="Cari dataset"
                  className="bg-transparent outline-none placeholder:text-white/60 w-44 lg:w-56"
                />
              </form>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            type="button"
            onClick={() => setDrawerOpen(true)}
            aria-label="Buka menu"
            aria-expanded={drawerOpen}
            aria-controls="mobile-drawer"
            className="lg:hidden flex items-center justify-center w-10 h-10 rounded-full bg-white/10 text-white hover:bg-white/20 transition"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </nav>

      {/* Mobile drawer */}
      <div
        className={`fixed inset-0 z-[100] lg:hidden ${drawerOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}
        aria-hidden={!drawerOpen}
      >
        {/* Backdrop */}
        <div
          onClick={() => setDrawerOpen(false)}
          className={`absolute inset-0 bg-black/50 transition-opacity ${drawerOpen ? 'opacity-100' : 'opacity-0'}`}
        />

        {/* Drawer panel */}
        <aside
          id="mobile-drawer"
          role="dialog"
          aria-modal="true"
          aria-label="Menu navigasi"
          className={`absolute inset-y-0 left-0 w-[80%] max-w-sm bg-spr-purple-deep text-white flex flex-col shadow-2xl transition-transform duration-300 ${drawerOpen ? 'translate-x-0' : '-translate-x-full'}`}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-5 border-b border-white/10">
            <Link href="/" onClick={() => startTransition(() => setDrawerOpen(false))} className="flex items-center gap-3">
              <Image
                src="/images/logo-spr.png"
                alt="Suruhanjaya Pilihan Raya"
                width={52}
                height={40}
                className="h-10 w-auto object-contain"
              />
              <div>
                <div className="text-[10px] uppercase tracking-[0.2em] opacity-70 font-medium">Portal Data Terbuka</div>
                <div className="font-serif text-base font-semibold leading-tight">Suruhanjaya Pilihan Raya</div>
              </div>
            </Link>
            <button
              type="button"
              onClick={() => setDrawerOpen(false)}
              aria-label="Tutup menu"
              className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Search */}
          <div className="px-5 pt-5">
            <form
              onSubmit={handleSearch}
              role="search"
              className="flex items-center gap-2 bg-white/10 focus-within:bg-white/15 rounded-full px-4 py-3 text-sm transition"
            >
              <Search className="w-4 h-4 shrink-0 opacity-70" />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Cari dataset..."
                aria-label="Cari dataset"
                className="bg-transparent outline-none placeholder:text-white/60 w-full"
              />
            </form>
          </div>

          {/* Nav items */}
          <nav className="flex-1 overflow-y-auto px-3 py-5">
            <ul className="space-y-1">
              {NAV_ITEMS.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    prefetch
                    onClick={() => startTransition(() => setDrawerOpen(false))}
                    className={`block px-4 py-3 rounded-xl text-base font-medium transition ${
                      isActive(item.href)
                        ? 'bg-white/15 text-white'
                        : 'text-white/85 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </aside>
      </div>
    </>
  );
}
