'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Search } from 'lucide-react';

const NAV_ITEMS = [
  { label: 'Utama', href: '/', active: true },
  { label: 'Katalog Data', href: '/katalog', hasDropdown: true },
  { label: 'Dashboard', href: '/dashboard', hasDropdown: true },
  { label: 'Infografik', href: '/infografik-pilihan-raya' },
];

export function MainNav() {
  return (
    <nav className="absolute top-[36px] left-0 right-0 z-50">
      <div className="w-full px-4 sm:px-6 lg:px-10 py-5 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
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
        <div className="hidden lg:flex items-center gap-1 glass rounded-full px-2 py-1.5">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className={`px-5 py-2 text-sm font-medium transition flex items-center gap-1 rounded-full ${
                item.active
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
        <div className="flex items-center gap-3">
          <button className="hidden md:flex items-center gap-2 glass text-white/90 hover:text-white px-4 py-2.5 rounded-full text-sm transition">
            <Search className="w-4 h-4" />
            <span>Cari</span>
            <span className="text-[10px] bg-white/15 px-1.5 py-0.5 rounded ml-1 font-mono">⌘K</span>
          </button>
          <button className="px-4 py-2.5 bg-spr-gold text-spr-ink rounded-full text-sm font-semibold hover:bg-amber-400 transition shadow-lg shadow-amber-500/20">
            MS / EN
          </button>
        </div>
      </div>
    </nav>
  );
}
