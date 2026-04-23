'use client';

import { useEffect, useState } from 'react';

const DATE_FMT: Intl.DateTimeFormatOptions = {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
  year: 'numeric',
  timeZone: 'Asia/Kuala_Lumpur',
};

const TIME_FMT: Intl.DateTimeFormatOptions = {
  hour: '2-digit',
  minute: '2-digit',
  timeZone: 'Asia/Kuala_Lumpur',
};

export function TopTicker() {
  const [now, setNow] = useState('');

  useEffect(() => {
    const tick = () => {
      const d = new Date();
      setNow(`${d.toLocaleDateString('ms-MY', DATE_FMT)} • ${d.toLocaleTimeString('ms-MY', TIME_FMT)}`);
    };
    tick();
    const id = setInterval(tick, 60_000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="ticker-bar text-white text-xs py-2 px-4 sm:px-6 lg:px-10 flex items-center justify-between overflow-hidden relative z-[60]">
      <div className="flex items-center gap-4 whitespace-nowrap">
        <span className="opacity-75" suppressHydrationWarning>
          {now || '\u00A0'}
        </span>
      </div>
      <div className="hidden md:flex items-center gap-5 text-[11px] opacity-80">
        <a href="/penafian" className="hover:opacity-100 transition">Penafian</a>
        <a href="/dasar-privasi" className="hover:opacity-100 transition">Dasar Privasi</a>
        <span>Hak Cipta © 2026</span>
      </div>
    </div>
  );
}
