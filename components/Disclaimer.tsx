import { AlertTriangle } from 'lucide-react';

interface Props {
  variant?: 'light' | 'dark';
  className?: string;
}

export function Disclaimer({ variant = 'light', className = '' }: Props) {
  const isDark = variant === 'dark';
  return (
    <div
      role="note"
      aria-label="Penafian"
      className={`flex gap-3 rounded-lg border px-4 py-3 ${
        isDark
          ? 'border-white/15 bg-white/[0.06] text-white/80'
          : 'border-spr-ink/10 bg-spr-ink/[0.03] text-spr-ink/70'
      } ${className}`}
    >
      <AlertTriangle
        className={`shrink-0 w-4 h-4 mt-0.5 ${isDark ? 'text-spr-gold' : 'text-spr-purple'}`}
        strokeWidth={2}
      />
      <div className="text-xs leading-relaxed">
        <span className={`font-semibold ${isDark ? 'text-white' : 'text-spr-ink'}`}>Penafian: </span>
        Segala bahan atau fail yang dimuat turun melalui portal ini adalah atas tanggungjawab pengguna sendiri. Pengguna bertanggungjawab sepenuhnya terhadap penggunaan, penyimpanan dan perkongsian kandungan yang dimuat turun. Pihak pengurusan portal tidak bertanggungjawab atas sebarang penyalahgunaan atau implikasi daripada penggunaan bahan tersebut.
      </div>
    </div>
  );
}
