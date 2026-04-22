"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const KATALOG_ITEMS = [
  { label: "Penjalanan Pilihan Raya", count: 9, href: "/katalog?bahagian=penjalanan-pilihan-raya" },
  { label: "Pendaftaran Pemilih", count: 1, href: "/katalog?bahagian=pendaftaran-pemilih" },
  { label: "Persempadanan", count: 5, href: "/katalog?bahagian=persempadanan" },
  { label: "Perundangan", count: 2, href: "/katalog?bahagian=perundangan" },
  { label: "Pentadbiran & Pengurusan", count: 1, href: "/katalog?bahagian=pentadbiran-pengurusan" },
  { label: "Pemantauan & Operasi", count: 2, href: "/katalog?bahagian=pemantauan-operasi" },
  { label: "Penilaian Pemerhati", count: 1, href: "/katalog?bahagian=penilaian-pemerhati" },
  { label: "Akademi Pilihan Raya", count: 1, href: "/katalog?bahagian=akademi-pilihan-raya" },
];

const DASHBOARD_ITEMS = [
  { label: "Keputusan PRU", href: "/dashboard" },
  { label: "Statistik Pemilih", href: "/dashboard" },
  { label: "Peta Persempadanan", href: "/peta" },
  { label: "Parti Politik", href: "/dashboard" },
  { label: "Pemerhati", href: "/dashboard" },
  { label: "Akademi Pilihan Raya", href: "/dashboard" },
  { label: "Persempadanan", href: "/dashboard" },
  { label: "Perundangan", href: "/dashboard" },
  { label: "Pemantauan & Operasi", href: "/dashboard" },
];

function formatMalayDate(): string {
  const days = ["Ahad", "Isnin", "Selasa", "Rabu", "Khamis", "Jumaat", "Sabtu"];
  const months = ["Jan", "Feb", "Mac", "Apr", "Mei", "Jun", "Jul", "Ogo", "Sep", "Okt", "Nov", "Dis"];
  const d = new Date();
  return `${days[d.getDay()]}, ${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
}

function isActive(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname.startsWith(href);
}

export default function NavbarLight() {
  const pathname = usePathname();
  const [katalogHover, setKatalogHover] = useState(false);
  const [dashboardHover, setDashboardHover] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [katalogExpand, setKatalogExpand] = useState(false);
  const [dashboardExpand, setDashboardExpand] = useState(false);

  // Close offcanvas on route change
  useEffect(() => { setMobileOpen(false); }, [pathname]);

  // Prevent body scroll when offcanvas open
  useEffect(() => {
    if (typeof document !== "undefined") {
      document.body.style.overflow = mobileOpen ? "hidden" : "";
    }
    return () => {
      if (typeof document !== "undefined") document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const close = () => setMobileOpen(false);

  if (pathname === "/") return null;

  return (
    <header className="w-full">
      {/* Tier 1 — Utility bar */}
      <div className="w-full bg-spr-primary-dark">
        <div className="px-4 sm:px-6 lg:px-10 h-8 flex items-center justify-between text-[12px]">
          <span className="text-white/70">{formatMalayDate()}</span>
          <div className="hidden sm:flex items-center gap-3 text-white/70">
            <Link href="/penafian" className="hover:text-white transition-colors">Penafian</Link>
            <span className="text-white/30">·</span>
            <Link href="/privasi" className="hover:text-white transition-colors">Dasar Privasi</Link>
            <span className="text-white/30">·</span>
            <span>Hak cipta ©2026</span>
          </div>
        </div>
      </div>

      {/* Tier 2 — Main nav */}
      <div className="w-full sticky top-0 z-50 bg-white border-b border-spr-border">
        <div className="px-4 sm:px-6 lg:px-10 h-16 flex items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 shrink-0">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-spr-primary to-spr-primary-dark flex items-center justify-center text-white font-bold text-sm shadow-md shadow-spr-primary/20">
              SPR
            </div>
            <div className="hidden sm:block">
              <div className="text-[15px] font-semibold text-spr-text leading-tight">Suruhanjaya Pilihan Raya Malaysia</div>
              <div className="text-[12px] text-spr-text-muted">Portal Data Terbuka SPR</div>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-1">
            <Link href="/" className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors relative ${pathname === "/" ? "text-spr-primary" : "text-spr-text-secondary hover:text-spr-text hover:bg-spr-bg-secondary"}`}>
              Utama
              {pathname === "/" && <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-[3px] bg-spr-primary rounded-full" />}
            </Link>

            <div className="relative" onMouseEnter={() => setKatalogHover(true)} onMouseLeave={() => setKatalogHover(false)}>
              <Link href="/katalog" className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors flex items-center gap-1 relative ${isActive(pathname, "/katalog") ? "text-spr-primary" : "text-spr-text-secondary hover:text-spr-text hover:bg-spr-bg-secondary"}`}>
                Katalog Data
                <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" /></svg>
                {isActive(pathname, "/katalog") && <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-[3px] bg-spr-primary rounded-full" />}
              </Link>
              {katalogHover && (
                <div className="absolute top-full left-0 pt-1 z-50">
                  <div className="bg-white border border-spr-border rounded-xl shadow-xl shadow-black/8 p-2 w-[280px]">
                    {KATALOG_ITEMS.map((item) => (
                      <Link key={item.label} href={item.href} className="flex items-center justify-between px-3 py-2.5 rounded-lg hover:bg-spr-bg-secondary transition-colors">
                        <span className="text-sm text-spr-text">{item.label}</span>
                        <span className="text-xs text-spr-text-muted bg-spr-bg-secondary px-2 py-0.5 rounded-full">{item.count}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="relative" onMouseEnter={() => setDashboardHover(true)} onMouseLeave={() => setDashboardHover(false)}>
              <Link href="/dashboard" className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors flex items-center gap-1 relative ${isActive(pathname, "/dashboard") ? "text-spr-primary" : "text-spr-text-secondary hover:text-spr-text hover:bg-spr-bg-secondary"}`}>
                Dashboard
                <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" /></svg>
                {isActive(pathname, "/dashboard") && <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-[3px] bg-spr-primary rounded-full" />}
              </Link>
              {dashboardHover && (
                <div className="absolute top-full left-0 pt-1 z-50">
                  <div className="bg-white border border-spr-border rounded-xl shadow-xl shadow-black/8 p-2 w-[260px]">
                    {DASHBOARD_ITEMS.map((item) => (
                      <Link key={item.label} href={item.href} className="block px-3 py-2.5 rounded-lg hover:bg-spr-bg-secondary transition-colors text-sm text-spr-text">{item.label}</Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <Link href="/infografik-pilihan-raya" className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors relative ${isActive(pathname, "/infografik-pilihan-raya") ? "text-spr-primary" : "text-spr-text-secondary hover:text-spr-text hover:bg-spr-bg-secondary"}`}>
              Infografik
              {isActive(pathname, "/infografik-pilihan-raya") && <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-[3px] bg-spr-primary rounded-full" />}
            </Link>
          </nav>

          {/* Desktop search */}
          <div className="hidden md:block w-[220px]">
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-spr-text-muted">
                <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="6.5" cy="6.5" r="4.5" /><path d="m10 10 3.5 3.5" strokeLinecap="round" /></svg>
              </div>
              <input type="text" placeholder="Cari dataset..." className="w-full bg-spr-bg-secondary border border-spr-border rounded-lg pl-9 pr-3 py-2 text-sm text-spr-text placeholder:text-spr-text-muted outline-none focus:border-spr-primary/40 transition-all" />
            </div>
          </div>

          {/* Mobile hamburger */}
          <button onClick={() => setMobileOpen(true)} className="lg:hidden p-2 rounded-lg text-spr-text-secondary hover:bg-spr-bg-secondary transition-colors">
            <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 12h18M3 6h18M3 18h18" strokeLinecap="round" /></svg>
          </button>
        </div>
      </div>

      {/* ====== Offcanvas mobile menu ====== */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[100] lg:hidden">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={close} />

          {/* Panel */}
          <div className="absolute left-0 top-0 bottom-0 w-[280px] bg-white flex flex-col shadow-2xl animate-slide-in">
            {/* Header */}
            <div className="bg-gradient-to-br from-spr-primary to-spr-primary-dark p-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center text-white font-bold text-xs">SPR</div>
                <div>
                  <div className="text-white text-sm font-semibold leading-tight">Suruhanjaya Pilihan Raya</div>
                  <div className="text-white/60 text-[11px]">Portal Data Terbuka</div>
                </div>
              </div>
              <button onClick={close} className="p-1.5 rounded-lg hover:bg-white/10 text-white/70">
                <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 5 5 15M5 5l10 10" strokeLinecap="round" /></svg>
              </button>
            </div>

            {/* Search */}
            <div className="p-4 border-b border-spr-border-light">
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-spr-text-muted">
                  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="6" cy="6" r="4" /><path d="m9 9 3 3" strokeLinecap="round" /></svg>
                </div>
                <input type="text" placeholder="Cari dataset..." className="w-full bg-spr-bg-secondary border border-spr-border rounded-lg pl-9 pr-3 py-2.5 text-sm outline-none" />
              </div>
            </div>

            {/* Menu items */}
            <nav className="flex-1 overflow-y-auto py-2">
              {/* Utama */}
              <Link href="/" onClick={close} className={`flex items-center px-5 py-3 text-sm font-medium transition-colors ${isActive(pathname, "/") && pathname === "/" ? "text-spr-primary bg-spr-primary-50 border-l-[3px] border-spr-primary" : "text-spr-text hover:bg-spr-bg-secondary"}`}>
                Utama
              </Link>

              {/* Katalog Data — expandable */}
              <div>
                <button onClick={() => setKatalogExpand(!katalogExpand)} className={`w-full flex items-center justify-between px-5 py-3 text-sm font-medium transition-colors ${isActive(pathname, "/katalog") ? "text-spr-primary" : "text-spr-text hover:bg-spr-bg-secondary"}`}>
                  Katalog Data
                  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" className={`transition-transform ${katalogExpand ? "rotate-180" : ""}`} viewBox="0 0 24 24"><path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </button>
                {katalogExpand && (
                  <div className="bg-spr-bg-secondary/50">
                    {KATALOG_ITEMS.map((item) => (
                      <Link key={item.label} href={item.href} onClick={close} className="flex items-center justify-between pl-10 pr-5 py-2.5 text-[13px] text-spr-text-secondary hover:text-spr-primary hover:bg-spr-bg-secondary transition-colors">
                        <span>{item.label}</span>
                        <span className="text-[11px] text-spr-text-muted">{item.count}</span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* Dashboard — expandable */}
              <div>
                <button onClick={() => setDashboardExpand(!dashboardExpand)} className={`w-full flex items-center justify-between px-5 py-3 text-sm font-medium transition-colors ${isActive(pathname, "/dashboard") ? "text-spr-primary" : "text-spr-text hover:bg-spr-bg-secondary"}`}>
                  Dashboard
                  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" className={`transition-transform ${dashboardExpand ? "rotate-180" : ""}`} viewBox="0 0 24 24"><path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </button>
                {dashboardExpand && (
                  <div className="bg-spr-bg-secondary/50">
                    {DASHBOARD_ITEMS.map((item) => (
                      <Link key={item.label} href={item.href} onClick={close} className="block pl-10 pr-5 py-2.5 text-[13px] text-spr-text-secondary hover:text-spr-primary hover:bg-spr-bg-secondary transition-colors">{item.label}</Link>
                    ))}
                  </div>
                )}
              </div>

              {/* Infografik */}
              <Link href="/infografik-pilihan-raya" onClick={close} className={`flex items-center px-5 py-3 text-sm font-medium transition-colors ${isActive(pathname, "/infografik-pilihan-raya") ? "text-spr-primary bg-spr-primary-50" : "text-spr-text hover:bg-spr-bg-secondary"}`}>
                Infografik
              </Link>
            </nav>

            {/* Bottom links */}
            <div className="border-t border-spr-border-light p-4 space-y-1">
              {[
                { label: "Penafian", href: "/penafian" },
                { label: "Dasar Privasi", href: "/privasi" },
              ].map((link) => (
                <Link key={link.label} href={link.href} onClick={close} className="block px-2 py-1.5 text-xs text-spr-text-muted hover:text-spr-text transition-colors">{link.label}</Link>
              ))}
              <div className="px-2 py-1.5 text-xs text-spr-text-muted">Hak cipta ©2026 SPR</div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
