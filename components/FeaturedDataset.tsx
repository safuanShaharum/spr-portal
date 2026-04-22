import Link from "next/link";

export default function FeaturedDataset() {
  return (
    <section className="py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="bg-spr-card border border-spr-border rounded-3xl overflow-hidden">
          <div className="grid lg:grid-cols-2 gap-0">
            {/* Left: Malaysia map illustration */}
            <div className="relative bg-spr-surface/50 p-8 lg:p-12 flex items-center justify-center min-h-[360px]">
              {/* Grid background */}
              <div className="absolute inset-0 opacity-[0.03]">
                <svg width="100%" height="100%">
                  <defs>
                    <pattern id="featured-grid" width="30" height="30" patternUnits="userSpaceOnUse">
                      <path d="M 30 0 L 0 0 0 30" fill="none" stroke="white" strokeWidth="0.5" />
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#featured-grid)" />
                </svg>
              </div>

              {/* Simplified Malaysia map outline */}
              <div className="relative w-full max-w-md">
                <svg viewBox="0 0 500 300" className="w-full h-auto">
                  {/* Peninsular Malaysia simplified */}
                  <path
                    d="M150,40 L180,35 L200,50 L210,80 L220,100 L215,130 L225,160 L220,190 L210,220 L195,250 L180,265 L165,260 L155,240 L145,210 L140,180 L145,150 L140,120 L142,90 L145,60 Z"
                    fill="none"
                    stroke="rgba(123,79,224,0.3)"
                    strokeWidth="1.5"
                  />
                  {/* Sabah simplified */}
                  <path
                    d="M320,80 L350,70 L380,75 L400,85 L410,100 L405,120 L390,130 L370,125 L350,130 L335,120 L325,100 Z"
                    fill="none"
                    stroke="rgba(123,79,224,0.3)"
                    strokeWidth="1.5"
                  />
                  {/* Sarawak simplified */}
                  <path
                    d="M280,140 L310,130 L335,120 L350,130 L370,125 L365,145 L350,160 L330,165 L305,160 L285,155 Z"
                    fill="none"
                    stroke="rgba(123,79,224,0.3)"
                    strokeWidth="1.5"
                  />

                  {/* Glowing dots for major cities */}
                  {[
                    { cx: 185, cy: 220, label: "KL" },
                    { cx: 165, cy: 140, label: "Ipoh" },
                    { cx: 215, cy: 170, label: "Kuantan" },
                    { cx: 390, cy: 95, label: "KK" },
                    { cx: 310, cy: 150, label: "Kuching" },
                  ].map((city) => (
                    <g key={city.label}>
                      <circle cx={city.cx} cy={city.cy} r="8" fill="rgba(0,212,170,0.15)" />
                      <circle cx={city.cx} cy={city.cy} r="4" fill="rgba(0,212,170,0.4)" />
                      <circle cx={city.cx} cy={city.cy} r="2" fill="#00D4AA" />
                      <text
                        x={city.cx}
                        y={city.cy - 14}
                        textAnchor="middle"
                        fill="rgba(155,151,176,0.6)"
                        fontSize="9"
                        fontFamily="DM Sans, sans-serif"
                      >
                        {city.label}
                      </text>
                    </g>
                  ))}
                </svg>
              </div>
            </div>

            {/* Right: Dataset info */}
            <div className="p-8 lg:p-12 flex flex-col justify-center">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-spr-primary/10 border border-spr-primary/20 w-fit mb-6">
                <span className="text-spr-primary-light text-xs font-semibold uppercase tracking-wider">
                  Featured Dataset
                </span>
              </div>

              <h3 className="font-display text-2xl sm:text-3xl font-bold text-spr-text mb-4 leading-tight">
                Sempadan Parlimen & DUN Malaysia
              </h3>

              <p className="text-spr-text-muted leading-relaxed mb-8">
                Data geospatial lengkap merangkumi sempadan 222 kawasan Parlimen dan
                600 kawasan DUN seluruh Malaysia dalam format KMZ. Sesuai untuk
                analisis geospatial, visualisasi peta dan pembangunan aplikasi.
              </p>

              {/* Mini info cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
                {[
                  { label: "Parlimen", value: "222" },
                  { label: "DUN", value: "600" },
                  { label: "Format", value: "KMZ" },
                  { label: "Saiz", value: "73.5MB" },
                ].map((info) => (
                  <div
                    key={info.label}
                    className="bg-spr-dark/50 border border-spr-border rounded-xl p-3 text-center"
                  >
                    <div className="text-spr-text font-display font-bold text-lg">
                      {info.value}
                    </div>
                    <div className="text-spr-text-dim text-xs mt-0.5">
                      {info.label}
                    </div>
                  </div>
                ))}
              </div>

              {/* Buttons */}
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/peta"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-spr-primary hover:bg-spr-primary-dark text-white rounded-xl font-semibold text-sm transition-colors"
                >
                  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="8" cy="8" r="7" />
                    <path d="M8 5v6M5 8h6" strokeLinecap="round" />
                  </svg>
                  Lihat Peta Interaktif
                </Link>
                <button className="inline-flex items-center gap-2 px-6 py-3 border border-spr-border hover:border-spr-primary/50 text-spr-text-muted hover:text-spr-text rounded-xl font-semibold text-sm transition-all">
                  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  Muat Turun KMZ
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
