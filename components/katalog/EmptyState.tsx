interface Props {
  message?: string;
}

export default function EmptyState({ message = "Data belum tersedia" }: Props) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="w-16 h-16 rounded-2xl bg-spr-bg-secondary flex items-center justify-center mb-4">
        <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-spr-text-muted" viewBox="0 0 24 24">
          <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M13 2v7h7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      <h3 className="text-lg font-semibold text-spr-navy mb-1">{message}</h3>
      <p className="text-sm text-spr-text-muted">Mohon semak semula dalam masa terdekat.</p>
    </div>
  );
}
