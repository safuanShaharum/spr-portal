import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-spr-border bg-spr-card/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Branding */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-spr-primary to-spr-accent flex items-center justify-center">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-white">
                  <path
                    d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <div>
                <div className="text-spr-text font-bold">SPR Open Data</div>
                <div className="text-spr-text-dim text-xs">Portal Data Terbuka</div>
              </div>
            </div>
            <p className="text-spr-text-dim text-sm leading-relaxed max-w-sm">
              Portal data terbuka rasmi Suruhanjaya Pilihan Raya Malaysia untuk
              akses data pilihan raya secara telus.
            </p>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="text-spr-text font-semibold text-sm mb-4">Pautan</h4>
            <ul className="space-y-2.5">
              {[
                { label: "Katalog Data", href: "/katalog" },
                { label: "Peta Interaktif", href: "/peta" },
                { label: "Dashboard", href: "/dashboard" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-spr-text-muted hover:text-spr-accent text-sm transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Info */}
          <div>
            <h4 className="text-spr-text font-semibold text-sm mb-4">Maklumat</h4>
            <ul className="space-y-2.5">
              {[
                { label: "Tentang Portal", href: "/tentang" },
                { label: "Terma Penggunaan", href: "/terma" },
                { label: "Dasar Privasi", href: "/dasar-privasi" },
                { label: "Hubungi Kami", href: "/hubungi" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-spr-text-muted hover:text-spr-accent text-sm transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 pt-6 border-t border-spr-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-spr-text-dim text-xs">
            &copy; 2024 Suruhanjaya Pilihan Raya Malaysia. Hak cipta terpelihara.
          </p>
          <p className="text-spr-text-dim text-xs">
            Dibina dengan data terbuka untuk rakyat Malaysia.
          </p>
        </div>
      </div>
    </footer>
  );
}
