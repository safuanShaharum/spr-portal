import { FEATURE_FLAGS } from "@/lib/config/featureFlags";

interface Props {
  tarikh: string;
  pm: string;
  kerajaan: string;
  majoriti: string;
  jumlahPemilih?: number;
  peratusanKeluar?: string;
  jumlahCalon?: number;
  undiDitolak?: number;
}

function fmtNum(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + "J";
  if (n >= 1000) return (n / 1000).toFixed(0) + "K";
  return n.toLocaleString();
}

export default function InfoCard({ tarikh, pm, kerajaan, majoriti, jumlahPemilih, peratusanKeluar, jumlahCalon, undiDitolak }: Props) {
  const items = [
    { label: "Tarikh", value: tarikh },
    { label: "Perdana Menteri", value: pm },
    // Amendment R2 #20: hide row temporarily — toggle FEATURE_FLAGS to revert
    ...(FEATURE_FLAGS.SHOW_KERAJAAN_PERPADUAN ? [{ label: "Kerajaan", value: kerajaan }] : []),
    { label: "Majoriti Mudah", value: majoriti },
    ...(jumlahPemilih ? [{ label: "Jumlah Pemilih", value: fmtNum(jumlahPemilih) }] : []),
    ...(peratusanKeluar ? [{ label: "Peratusan Keluar", value: `${peratusanKeluar}%` }] : []),
    ...(jumlahCalon ? [{ label: "Jumlah Calon", value: jumlahCalon.toLocaleString() }] : []),
    ...(undiDitolak != null && undiDitolak > 0 ? [{ label: "Undi Ditolak", value: undiDitolak.toLocaleString() }] : []),
  ];

  return (
    <div className="bg-[#1a2332] rounded-xl p-6 text-white h-full">
      <div className="text-[11px] font-semibold uppercase tracking-wider text-white/50 mb-4">Maklumat PRU</div>
      <div className="space-y-3">
        {items.map((item) => (
          <div key={item.label} className="flex items-start justify-between gap-3">
            <span className="text-xs text-white/50 shrink-0">{item.label}</span>
            <span className="text-sm font-medium text-right">{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
