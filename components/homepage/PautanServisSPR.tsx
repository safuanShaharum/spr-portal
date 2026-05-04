import { Search, UserPlus, BarChart3, GraduationCap, MessageCircle, ArrowUpRight, ArrowRight } from 'lucide-react';

export function PautanServisSPR() {
  return (
    <section className="py-24 bg-white relative overflow-hidden">
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle, var(--spr-purple) 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }}
      />

      <div className="relative w-full px-4 sm:px-6 lg:px-10">
        <div className="mb-14">
          <div className="text-xs uppercase tracking-[0.24em] text-spr-purple font-semibold mb-3 flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-spr-gold rounded-full" />
            Ekosistem SPR
          </div>
          <h2 className="display-serif text-5xl md:text-6xl font-normal leading-tight mb-4">
            Perkhidmatan <span className="italic text-spr-purple">pilihan raya</span> untuk rakyat
          </h2>
          <p className="text-spr-ink/65 text-lg">
            Portal ini fokus pada data terbuka. Untuk servis pemilih individu — semakan, pendaftaran atau aduan — gunakan pautan rasmi SPR di bawah.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">

          <a
            href="https://mysprsemak.spr.gov.my/semakan/daftarPemilih"
            target="_blank"
            rel="noopener noreferrer"
            className="lift-card group col-span-1 md:col-span-2 lg:col-span-2 lg:row-span-2 relative overflow-hidden rounded-3xl p-10 bg-gradient-to-br from-spr-purple-deep via-spr-purple-dark to-spr-purple text-white flex flex-col"
          >
            <div className="absolute -right-16 -bottom-16 w-80 h-80 rounded-full bg-white/5" />
            <div className="absolute right-8 top-8 w-32 h-32 rounded-full border border-white/20 opacity-50" />

            <div className="relative flex flex-col flex-1">
              <div className="flex items-start justify-between mb-10">
                <div className="w-14 h-14 bg-spr-gold rounded-2xl flex items-center justify-center">
                  <Search className="w-7 h-7 text-spr-ink" strokeWidth={2.5} />
                </div>
                <span className="text-[10px] uppercase tracking-widest font-bold text-spr-ink bg-spr-gold px-2.5 py-1 rounded-full">
                  Paling Kerap Diguna
                </span>
              </div>

              <div className="text-[11px] uppercase tracking-[0.2em] font-bold text-spr-gold mb-3">
                MySPR Semak
              </div>
              <h3 className="display-serif text-4xl lg:text-5xl font-medium mb-4 leading-tight">
                Semak status daftar pemilih
              </h3>
              <p className="text-white/70 max-w-md leading-relaxed">
                Semak pendaftaran, kawasan pilihan raya, pusat mengundi dan saluran anda dengan nombor kad pengenalan. Data langsung dari SPR.
              </p>

              <div className="flex items-center justify-between mt-auto pt-10">
                <span className="text-sm text-white/60 font-mono">mysprsemak.spr.gov.my</span>
                <div className="w-12 h-12 rounded-full bg-spr-gold text-spr-ink flex items-center justify-center group-hover:translate-x-1 transition">
                  <ArrowRight className="w-5 h-5" strokeWidth={2.5} />
                </div>
              </div>
            </div>
          </a>

          <ServiceCard
            href="https://myspr.spr.gov.my"
            eyebrow="MySPR Daftar"
            title="Daftar / tukar alamat"
            description="Pendaftaran pemilih baharu atau pertukaran bahagian pilihan raya secara atas talian."
            icon={<UserPlus className="w-6 h-6 text-white" />}
            iconBg="bg-spr-purple"
            domain="myspr.spr.gov.my"
            accentColor="text-spr-purple"
            hoverBorder="hover:border-spr-purple/20"
          />

          <ServiceCard
            href="https://spr.gov.my/akademi-pilihan-raya"
            eyebrow="Akademi Pilihan Raya"
            title="Pendidikan pilihan raya"
            description="Modul, bahan rujukan dan kursus tentang proses demokrasi dan pilihan raya Malaysia."
            icon={<GraduationCap className="w-6 h-6 text-white" />}
            iconBg="bg-spr-teal"
            domain="spr.gov.my/akademi"
            accentColor="text-spr-teal"
            hoverBorder="hover:border-spr-teal/30"
          />

          <ServiceCard
            href="https://dashboard.spr.gov.my"
            eyebrow="Dashboard Pilihan Raya"
            title="Visualisasi keputusan"
            description="Papan pemuka rasmi menunjukkan keputusan pilihan raya secara interaktif dan masa nyata."
            icon={<BarChart3 className="w-6 h-6 text-white" />}
            iconBg="bg-spr-coral"
            domain="dashboard.spr.gov.my"
            accentColor="text-spr-coral"
            hoverBorder="hover:border-spr-coral/30"
          />

          <a
            href="https://spr.gov.my/aduan-pertanyaan"
            target="_blank"
            rel="noopener noreferrer"
            className="lift-card group relative overflow-hidden rounded-3xl p-7 bg-spr-ink text-white flex flex-col"
          >
            <div className="w-12 h-12 bg-spr-gold/20 border border-spr-gold/30 rounded-xl flex items-center justify-center mb-5">
              <MessageCircle className="w-6 h-6 text-spr-gold" strokeWidth={2} />
            </div>
            <div className="text-[10px] uppercase tracking-[0.2em] font-bold text-spr-gold mb-1.5">
              Aduan & Maklum Balas
            </div>
            <h3 className="display-serif text-2xl font-semibold mb-2 leading-tight">
              Ada soalan atau aduan?
            </h3>
            <p className="text-white/60 text-sm mb-5 leading-relaxed flex-1">
              Hubungi SPR untuk bantuan rasmi melalui emel, telefon atau borang aduan dalam talian.
            </p>

            <div className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 mb-4">
              <div className="text-[10px] uppercase tracking-wider text-white/40 mb-0.5">Hotline SPR</div>
              <div className="font-mono text-base font-semibold text-spr-gold">03-8892 7200</div>
            </div>

            <div className="flex items-center justify-between text-sm pt-4 border-t border-white/10">
              <span className="text-xs text-white/40 font-mono">spr.gov.my/aduan</span>
              <span className="font-semibold text-spr-gold flex items-center gap-1">
                Buka
                <ArrowUpRight className="w-3.5 h-3.5" strokeWidth={2.5} />
              </span>
            </div>
          </a>
        </div>

        <div className="mt-10 flex items-start gap-3 text-sm text-spr-ink/50">
          <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="leading-relaxed">
            Portal ini adalah saluran data terbuka — tidak menyimpan atau memproses maklumat peribadi pemilih. Semua servis individu dikendalikan oleh sistem rasmi SPR.
          </p>
        </div>
      </div>
    </section>
  );
}

function ServiceCard({
  href,
  eyebrow,
  title,
  description,
  icon,
  iconBg,
  domain,
  accentColor,
  hoverBorder,
}: {
  href: string;
  eyebrow: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  iconBg: string;
  domain: string;
  accentColor: string;
  hoverBorder: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`lift-card group relative overflow-hidden rounded-3xl p-7 bg-spr-cream border-2 border-transparent ${hoverBorder} flex flex-col`}
    >
      <div className={`w-12 h-12 ${iconBg} rounded-xl flex items-center justify-center mb-5`}>
        {icon}
      </div>
      <div className={`text-[10px] uppercase tracking-[0.2em] font-bold ${accentColor} mb-1.5`}>
        {eyebrow}
      </div>
      <h3 className="display-serif text-2xl font-semibold mb-2 leading-tight">{title}</h3>
      <p className="text-spr-ink/65 text-sm mb-5 leading-relaxed flex-1">{description}</p>
      <div className="flex items-center justify-between text-sm pt-4 border-t border-spr-ink/10">
        <span className="text-xs text-spr-ink/50 font-mono">{domain}</span>
        <span className={`font-semibold ${accentColor} flex items-center gap-1`}>
          Buka
          <ArrowUpRight className="w-3.5 h-3.5" strokeWidth={2.5} />
        </span>
      </div>
    </a>
  );
}
