export function TopTicker() {
  const today = new Date().toLocaleDateString('ms-MY', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
  const time = new Date().toLocaleTimeString('ms-MY', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="ticker-bar text-white text-xs py-2 px-4 sm:px-6 lg:px-10 flex items-center justify-between overflow-hidden relative z-[60]">
      <div className="flex items-center gap-4 whitespace-nowrap">
        <span className="opacity-75">{today} • {time}</span>
        <span className="hidden md:inline-flex items-center gap-1.5 px-2 py-0.5 bg-white/10 rounded-full">
          <span className="w-1.5 h-1.5 bg-spr-gold rounded-full" />
          <span className="text-[11px] font-medium">3 dataset dikemaskini</span>
        </span>
      </div>
      <div className="hidden md:flex items-center gap-5 text-[11px] opacity-80">
        <a href="/penafian" className="hover:opacity-100 transition">Penafian</a>
        <a href="/dasar-privasi" className="hover:opacity-100 transition">Dasar Privasi</a>
        <a href="/hak-cipta" className="hover:opacity-100 transition">Hak Cipta © 2026</a>
      </div>
    </div>
  );
}
