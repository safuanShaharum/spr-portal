import { getLatestPRU } from '@/lib/pru-data';
import { getPartyColor, getPartyName } from '@/lib/party-colors';

export async function DataDalamAngka() {
  const pru = await getLatestPRU();
  const maxSeats = Math.max(...pru.seat_distribution.map((p) => p.seats));

  return (
    <section className="py-28 bg-spr-ink text-white relative overflow-hidden">
      {/* Decorative background */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }}
      />
      <div className="absolute top-0 left-0 w-[800px] h-[800px] rounded-full bg-spr-purple/10 blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] rounded-full bg-spr-gold/5 blur-3xl translate-x-1/3 translate-y-1/3 pointer-events-none" />

      <div className="w-full px-4 sm:px-6 lg:px-10 relative">
        {/* Header */}
        <div className="mb-20">
          <div className="text-xs uppercase tracking-[0.24em] text-spr-gold font-semibold mb-3 flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-spr-gold rounded-full" />
            Data Dalam Angka
          </div>
          <h2 className="display-serif text-5xl md:text-7xl font-normal leading-[1.02] mb-5">
            Angka yang <span className="italic text-spr-gold">membentuk negara</span>.
          </h2>
          <p className="text-white/60 text-lg">
            Tiga nombor untuk memahami skop Pilihan Raya Umum Ke-{pru.number} — dan siapa sebenarnya yang menentukan masa depan Malaysia.
          </p>
        </div>

        {/* Asymmetric grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-16">

          {/* Card 1: Kerusi Parlimen */}
          <div className="lg:col-span-5 bg-gradient-to-br from-spr-purple-dark to-spr-purple-deep rounded-3xl p-10 relative overflow-hidden">
            <div className="absolute top-4 right-4 text-[11px] uppercase tracking-widest opacity-50 font-mono">01 / 03</div>
            <div className="relative z-10">
              <div className="text-[11px] uppercase tracking-[0.24em] font-bold text-spr-gold mb-4">Kerusi Parlimen</div>
              <div
                className="text-7xl md:text-8xl lg:text-[140px] leading-none display-serif font-black mb-5"
                style={{
                  background: 'linear-gradient(180deg, #F5B84A 0%, #E8A845 100%)',
                  WebkitBackgroundClip: 'text',
                  backgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                {pru.total_parlimen}
              </div>
              <div className="display-serif text-2xl italic mb-3 text-white">kawasan di seluruh Malaysia</div>
              <p className="text-white/60 max-w-xs leading-relaxed text-sm">
                Dipertandingkan dalam Pilihan Raya Umum Ke-{pru.number} pada {pru.date}.
              </p>
            </div>
            <div className="mt-8 grid grid-cols-37 gap-[2px]">
              {pru.seat_distribution.flatMap((row) => {
                const partyLabel = row.party === 'OTHER' ? 'Lain-lain' : `${row.party} — ${getPartyName(row.party)}`;
                return Array.from({ length: row.seats }).map((_, idx) => (
                  <div
                    key={`${row.party}-${idx}`}
                    className="relative group/seat h-3 rounded-sm hover:brightness-125 transition"
                    style={{
                      backgroundColor: getPartyColor(row.party),
                      border:
                        getPartyColor(row.party).toLowerCase() === '#002e4d'
                          ? '1px solid rgba(255,255,255,0.2)'
                          : 'none',
                    }}
                  >
                    <div className="pointer-events-none absolute bottom-[calc(100%+6px)] left-1/2 -translate-x-1/2 opacity-0 group-hover/seat:opacity-100 transition-opacity bg-spr-ink text-white text-[10px] font-mono px-2 py-1 rounded-md whitespace-nowrap shadow-xl z-20 border border-white/10">
                      {partyLabel} <span className="text-spr-gold">#{idx + 1}</span>
                    </div>
                  </div>
                ));
              })}
            </div>
          </div>

          {/* Card 2: Pemilih Berdaftar */}
          <div className="lg:col-span-7 bg-gradient-to-br from-spr-purple to-spr-purple-dark rounded-3xl p-10 relative overflow-hidden">
            <div className="absolute top-4 right-4 text-[11px] uppercase tracking-widest opacity-50 font-mono">02 / 03</div>
            <div className="relative z-10 h-full flex flex-col">
              <div className="text-[11px] uppercase tracking-[0.24em] font-bold text-spr-coral mb-4">Pemilih Berdaftar</div>

              <div className="flex items-baseline gap-3 mb-5">
                <div
                  className="text-7xl md:text-8xl lg:text-[128px] leading-none display-serif font-bold"
                  style={{
                    background: 'linear-gradient(180deg, #fff 0%, #F56E7D 100%)',
                    WebkitBackgroundClip: 'text',
                    backgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  {pru.pemilih_berdaftar_label.split(' ')[0]}
                </div>
                <div className="display-serif font-medium text-3xl md:text-4xl italic text-spr-coral">
                  {pru.pemilih_berdaftar_label.split(' ')[1]}
                </div>
              </div>

              <div className="display-serif text-2xl italic mb-3 text-white">rakyat Malaysia yang layak</div>
              <p className="text-white/60 max-w-md leading-relaxed text-sm mb-6">
                Peningkatan 40% dari PRU-14 berikutan Undi18 yang menurunkan umur kelayakan dari 21 ke 18 tahun.
              </p>

              <div className="mt-auto">
                <PeopleGrid turnoutPercentage={pru.turnout_percentage} />
                <div className="flex items-center gap-3 text-xs text-white/60 mt-3">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 bg-spr-gold rounded-sm" />
                    Mengundi ({pru.turnout_percentage}%)
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 bg-white/20 rounded-sm" />
                    Tidak mengundi ({(100 - pru.turnout_percentage).toFixed(1)}%)
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Card 3: Kerajaan Perpaduan + Bar Chart */}
          <div className="lg:col-span-12 bg-gradient-to-r from-white/5 to-white/[0.02] border border-white/10 rounded-3xl p-10 relative overflow-hidden">
            <div className="absolute top-4 right-4 text-[11px] uppercase tracking-widest opacity-50 font-mono">03 / 03</div>
            <div className="grid lg:grid-cols-[auto_1fr] gap-10 items-center">

              <div className="flex items-center gap-6">
                <RadialProgress percentage={pru.turnout_percentage} />
                <div>
                  <div className="text-[11px] uppercase tracking-[0.24em] font-bold text-spr-gold mb-2">
                    {pru.government.coalition_name}
                  </div>
                  <div className="display-serif text-2xl md:text-3xl font-medium mb-2 leading-tight">
                    {pru.government.parties.join(' + ')}
                  </div>
                  <div className="text-white/60 text-sm">
                    Majoriti <span className="font-mono font-semibold text-white">{pru.government.seats}</span> daripada {pru.total_parlimen} kerusi
                  </div>
                </div>
              </div>

              <div>
                <div className="text-[11px] uppercase tracking-[0.24em] text-white/50 font-semibold mb-8">
                  Agihan Kerusi PRU-{pru.number} ({pru.year})
                </div>
                <div className="flex items-end h-20 gap-1 mb-3 pt-6">
                  {pru.seat_distribution.map((row) => {
                    const heightPercent = (row.seats / maxSeats) * 100;
                    const color = getPartyColor(row.party);
                    const isDark = color.toLowerCase() === '#002e4d' || color.toLowerCase() === '#001a33';
                    return (
                      <div
                        key={row.party}
                        className="flex-1 rounded-t relative"
                        style={{
                          height: `${heightPercent}%`,
                          backgroundColor: color,
                          border: isDark ? '1px solid rgba(255,255,255,0.2)' : 'none',
                        }}
                      >
                        <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-bold">
                          {row.seats}
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="flex items-center gap-4 flex-wrap text-xs">
                  {pru.seat_distribution.map((row) => (
                    <span key={row.party} className="flex items-center gap-1.5">
                      <span
                        className="w-2.5 h-2.5 rounded-sm"
                        style={{
                          backgroundColor: getPartyColor(row.party),
                          border: row.party === 'PN' ? '1px solid rgba(255,255,255,0.3)' : 'none',
                        }}
                      />
                      {row.party === 'OTHER' ? 'Lain' : row.party} {row.seats}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function PeopleGrid({ turnoutPercentage }: { turnoutPercentage: number }) {
  const TOTAL = 100;
  const votedCount = Math.round(turnoutPercentage);

  return (
    <div className="grid grid-cols-25 gap-[3px] max-w-xl">
      {Array.from({ length: TOTAL }).map((_, i) => (
        <svg
          key={i}
          viewBox="0 0 20 20"
          className={`w-full h-auto ${i < votedCount ? 'text-spr-gold' : 'text-white/20'}`}
          fill="currentColor"
        >
          <circle cx="10" cy="6" r="3" />
          <path d="M4 17c0-3.3 2.7-6 6-6s6 2.7 6 6" />
        </svg>
      ))}
    </div>
  );
}

function RadialProgress({ percentage }: { percentage: number }) {
  const radius = 52;
  const circumference = 2 * Math.PI * radius;
  const strokeDash = (percentage / 100) * circumference;

  return (
    <div className="relative w-36 h-36 flex-shrink-0">
      <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
        <circle cx="60" cy="60" r={radius} fill="none" stroke="rgba(88, 28, 220, 0.2)" strokeWidth="10" />
        <circle
          cx="60"
          cy="60"
          r={radius}
          fill="none"
          stroke="#F5B84A"
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={`${strokeDash} ${circumference}`}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <div className="display-serif text-3xl font-bold text-white leading-none">
          {percentage}<span className="text-xl">%</span>
        </div>
        <div className="text-[9px] uppercase tracking-wider text-white/60 mt-1">Keluar Mengundi</div>
      </div>
    </div>
  );
}
