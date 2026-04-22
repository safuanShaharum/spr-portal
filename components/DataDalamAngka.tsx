const SEATS = [
  { name: "PH", seats: 82, color: "#FF6B35" },
  { name: "PN", seats: 73, color: "#2196F3" },
  { name: "BN", seats: 30, color: "#1A237E" },
  { name: "GPS", seats: 23, color: "#4CAF50" },
  { name: "GRS", seats: 6, color: "#FF9800" },
  { name: "Lain", seats: 8, color: "#9E9E9E" },
];

const TOTAL_SEATS = 222;

const STATS = [
  {
    number: "222",
    label: "Kerusi Parlimen",
    color: "#7B4FE0",
    description:
      "Kawasan parlimen di seluruh Malaysia yang dipertandingkan dalam PRU-15",
  },
  {
    number: "21.8 Juta",
    label: "Pemilih Berdaftar",
    color: "#00D4AA",
    description:
      "Jumlah warganegara yang layak mengundi setakat tahun 2022",
  },
  {
    number: "73.9%",
    label: "Kadar Keluar Mengundi",
    color: "#3B82F6",
    description:
      "Peratusan kehadiran pengundi pada PRU-15 (2022)",
  },
];

export default function DataDalamAngka() {
  return (
    <section className="py-20 bg-spr-bg-secondary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="font-display text-[32px] font-bold text-spr-text mb-3">
            Data Dalam Angka
          </h2>
          <p className="text-base text-spr-text-secondary max-w-lg mx-auto">
            Ringkasan statistik utama pilihan raya Malaysia
          </p>
        </div>

        {/* 3 Stat cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {STATS.map((stat) => (
            <div
              key={stat.label}
              className="bg-white rounded-2xl border border-spr-border p-8 text-center hover:shadow-lg hover:shadow-black/5 transition-all duration-200"
            >
              <div className="font-display text-[48px] font-bold text-spr-navy leading-none mb-2">
                {stat.number}
              </div>
              <div className="text-base font-medium text-spr-text-secondary mb-3">
                {stat.label}
              </div>
              <div
                className="w-10 h-[3px] rounded-full mx-auto mb-4"
                style={{ backgroundColor: stat.color }}
              />
              <p className="text-[13px] text-spr-text-muted leading-relaxed max-w-[240px] mx-auto">
                {stat.description}
              </p>
            </div>
          ))}
        </div>

        {/* Wide party seats card */}
        <div className="bg-white rounded-2xl border border-spr-border p-8 hover:shadow-lg hover:shadow-black/5 transition-all duration-200">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-center">
            {/* Left — Chart */}
            <div className="lg:col-span-3">
              <h3 className="text-lg font-semibold text-spr-text mb-6">
                Agihan Kerusi PRU-15 (2022)
              </h3>

              {/* Stacked bar */}
              <div className="flex h-8 rounded-lg overflow-hidden mb-5">
                {SEATS.map((s) => (
                  <div
                    key={s.name}
                    className="relative group"
                    style={{
                      width: `${(s.seats / TOTAL_SEATS) * 100}%`,
                      backgroundColor: s.color,
                    }}
                  >
                    <div className="absolute inset-0 flex items-center justify-center">
                      {s.seats >= 20 && (
                        <span className="text-white text-[11px] font-bold">
                          {s.seats}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Legend */}
              <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
                {SEATS.map((s) => (
                  <div key={s.name} className="flex items-center gap-2">
                    <span
                      className="w-3 h-3 rounded-full shrink-0"
                      style={{ backgroundColor: s.color }}
                    />
                    <span className="text-sm text-spr-text-secondary">
                      {s.name}
                    </span>
                    <span className="text-sm font-semibold text-spr-text">
                      {s.seats}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right — Summary */}
            <div className="lg:col-span-2">
              <h4 className="text-lg font-semibold text-spr-text mb-2">
                Kerajaan Perpaduan
              </h4>
              <p className="text-[14px] text-spr-text-secondary leading-relaxed mb-4">
                Gabungan PH-BN membentuk kerajaan dengan majoriti mudah 112
                kerusi daripada 222 kerusi parlimen.
              </p>
              <span className="inline-flex items-center px-3 py-1.5 bg-spr-primary-50 text-spr-primary text-xs font-medium rounded-lg">
                Perdana Menteri: YAB Dato&apos; Seri Anwar Ibrahim
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
