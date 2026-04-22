export default function Placeholder({ title }: { title: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="w-16 h-16 rounded-2xl bg-spr-bg-secondary flex items-center justify-center mb-4">
        <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-spr-text-muted" viewBox="0 0 24 24">
          <path d="M12 8v4l3 3M3 12a9 9 0 1 0 18 0 9 9 0 0 0-18 0z" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      <h3 className="text-lg font-semibold text-spr-navy mb-1">{title}</h3>
      <p className="text-sm text-spr-text-muted">Dashboard ini akan datang.</p>
    </div>
  );
}
