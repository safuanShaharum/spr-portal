'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Search } from 'lucide-react';

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
  const isOverlay = overlay ?? pathname === '/';
  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname?.startsWith(href);

  function handleSearch(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const q = query.trim();
    if (!q) return;
    router.push(`/cari?q=${encodeURIComponent(q)}`);
  }

  const wrapperClass = isOverlay
    ? 'absolute top-[36px] left-0 right-0 z-50'
    : 'relative z-40 bg-spr-purple-deep';

  return (
    <nav className={wrapperClass}>
      <div className="w-full px-4 sm:px-6 lg:px-10 py-5 grid grid-cols-[1fr_auto_1fr] items-center gap-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group justify-self-start">
          <Image
            src="/images/LOGO_JATA.png"
            alt="Jata Negara"
            width={62}
            height={48}
            priority
            className="h-12 w-auto object-contain group-hover:scale-105 transition-transform"
          />
          <div className="text-white">
            <div className="text-[11px] uppercase tracking-[0.2em] opacity-70 font-medium">Portal Rasmi</div>
            <div className="font-serif text-lg font-semibold leading-tight">Suruhanjaya Pilihan Raya</div>
          </div>
        </Link>

        {/* Nav Items */}
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

        {/* Actions */}
        <div className="flex items-center gap-3 justify-self-end">
          <form
            onSubmit={handleSearch}
            className="hidden md:flex items-center gap-2 glass text-white/90 focus-within:text-white px-4 py-2.5 rounded-full text-sm transition"
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
          <button className="px-4 py-2.5 bg-spr-gold text-spr-ink rounded-full text-sm font-semibold hover:bg-amber-400 transition shadow-lg shadow-amber-500/20">
            MS / EN
          </button>
        </div>
      </div>
    </nav>
  );
}
