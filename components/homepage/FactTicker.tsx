const FACTS = [
  { color: 'text-spr-gold', label: 'pemilih berdaftar di seluruh Malaysia', value: '21.8 juta', valueClass: 'text-spr-gold' },
  { color: 'text-spr-coral', label: 'kerusi Parlimen dipertandingkan dalam PRU-15', value: '222' },
  { color: 'text-spr-teal', label: 'Kadar keluar mengundi tertinggi dalam sejarah', value: '73.9%' },
  { color: 'text-spr-gold', label: 'infografik interaktif tersedia', value: '62', valueClass: 'text-spr-gold' },
];

export function FactTicker() {
  return (
    <div className="bg-spr-ink text-white py-4 overflow-hidden">
      <div className="marquee-track flex items-center gap-12 whitespace-nowrap">
        {[...Array(2)].map((_, dupIdx) => (
          <div key={dupIdx} className="flex items-center gap-12 px-6" aria-hidden={dupIdx === 1}>
            {FACTS.map((fact, i) => (
              <span key={i} className="flex items-center gap-3 text-sm">
                <span className={fact.color}>●</span>
                {fact.valueClass ? (
                  <span>
                    <strong className={`${fact.valueClass} font-mono`}>{fact.value}</strong>{' '}
                    {fact.label}
                  </span>
                ) : (
                  <span>
                    <strong className="font-mono">{fact.value}</strong> {fact.label}
                  </span>
                )}
                {i < FACTS.length - 1 && <span className="text-white/20 ml-12">✦</span>}
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
