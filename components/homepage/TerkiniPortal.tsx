import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { getKemaskini, KemaskiniItem } from '@/lib/kemaskini-data';

const categoryStyles: Record<string, string> = {
  teal: 'text-spr-teal bg-spr-teal/10',
  coral: 'text-spr-coral bg-spr-coral/10',
  purple: 'text-spr-purple bg-spr-purple/10',
  gold: 'text-amber-600 bg-amber-100',
  ink: 'text-spr-ink/60 bg-spr-ink/5',
};

export async function TerkiniPortal() {
  const updates = await getKemaskini(4);

  return (
    <section className="py-24 bg-spr-page-bg">
      <div className="w-full px-4 sm:px-6 lg:px-10">

        <div className="flex items-end justify-between mb-12 flex-wrap gap-4">
          <div>
            <div className="text-xs uppercase tracking-[0.24em] text-spr-purple font-semibold mb-3">
              Terkini di Portal
            </div>
            <h2 className="display-serif text-5xl md:text-6xl font-normal leading-tight">
              Kemaskini <span className="italic text-spr-purple">terbaru</span>
            </h2>
          </div>
          <Link
            href="/kemaskini"
            className="hidden md:inline-flex items-center gap-2 text-spr-purple hover:text-spr-purple-dark font-semibold group"
          >
            <span>Lihat semua kemaskini</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" strokeWidth={2.5} />
          </Link>
        </div>

        {updates.length === 0 ? (
          <p className="text-spr-ink/50">Tiada kemaskini untuk dipapar.</p>
        ) : (
          <div className="relative">
            <div className="absolute left-[72px] top-4 bottom-4 w-px bg-gradient-to-b from-spr-purple/30 via-spr-purple/15 to-transparent pointer-events-none" />
            <div className="space-y-4">
              {updates.map((item, idx) => (
                <TimelineItem key={idx} item={item} />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

function TimelineItem({ item }: { item: KemaskiniItem }) {
  return (
    <div className="flex items-start gap-8 group">
      <div className="flex-shrink-0 w-36 text-right">
        <div className="display-serif text-3xl font-semibold text-spr-ink">{item.day}</div>
        <div className="text-xs text-spr-ink/60 uppercase tracking-wider">
          {item.month} {item.year}
        </div>
      </div>
      <div
        className={`w-3 h-3 rounded-full mt-3 flex-shrink-0 ring-4 group-hover:ring-8 transition-all ${
          item.latest ? 'bg-spr-purple ring-spr-purple/10' : 'bg-spr-ink/30 ring-spr-ink/5'
        }`}
      />
      <div className="flex-1 bg-white rounded-2xl p-6 border border-spr-ink/5 hover:border-spr-purple/20 transition">
        <div className="flex items-start justify-between gap-4 mb-2 flex-wrap">
          <span
            className={`text-[10px] uppercase tracking-wider font-bold px-2.5 py-1 rounded-full ${
              categoryStyles[item.category_color] ?? categoryStyles.purple
            }`}
          >
            {item.category}
          </span>
          <span className="text-xs text-spr-ink/50">{item.age_label}</span>
        </div>
        <h4 className="font-semibold text-spr-ink mb-1 text-lg">{item.title}</h4>
        {item.description && <p className="text-sm text-spr-ink/60">{item.description}</p>}
      </div>
    </div>
  );
}
