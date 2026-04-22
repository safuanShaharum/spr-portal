import Link from "next/link";

export default function MalaysiaOverview() {
  return (
    <section className="py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-spr-text">
            Malaysia Pilihan Raya Sekilas Pandang
          </h2>
          <Link
            href="/katalog"
            className="text-spr-primary text-sm font-medium hover:underline hidden sm:inline"
          >
            Lihat semua →
          </Link>
        </div>

        {/* Main card */}
        <div
          className="relative rounded-2xl overflow-hidden min-h-[320px]"
          style={{
            background: "linear-gradient(135deg, #1A1A2E 0%, #2D1B69 50%, #3D0FA0 100%)",
          }}
        >
          {/* Bottom-left overlay content */}
          <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 bg-gradient-to-t from-black/60 to-transparent">
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-white/20 text-white/80 text-xs font-medium mb-3">
              PEMILIH · 2022
            </div>
            <h3 className="text-white text-2xl sm:text-3xl font-bold max-w-lg leading-snug">
              21.8 juta pemilih berdaftar di seluruh Malaysia
            </h3>
          </div>

          {/* Stats card overlay (top-right) */}
          <div className="absolute top-4 right-4 sm:top-6 sm:right-6 bg-white rounded-xl shadow-lg p-5 w-[220px]">
            <div className="text-[11px] font-semibold text-spr-text-muted uppercase tracking-wider mb-3">
              RINGKASAN PRU-15
            </div>
            <div className="space-y-0">
              {[
                { label: "Kerusi Parlimen", value: "222" },
                { label: "Kerusi DUN (Semenanjung)", value: "447" },
                { label: "Negeri & WP", value: "13" },
                { label: "Parti Bertanding", value: "20+" },
              ].map((item, i) => (
                <div
                  key={item.label}
                  className={`flex items-center justify-between py-2.5 ${
                    i < 3 ? "border-b border-spr-border-light" : ""
                  }`}
                >
                  <span className="text-spr-text-secondary text-xs">{item.label}</span>
                  <span className="text-spr-navy font-semibold text-sm">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
