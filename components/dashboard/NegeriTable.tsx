import { COALITION_COLORS } from "@/lib/parti-colors";
import { getPartiLogo } from "@/lib/parti-logo";

export interface NegeriRow {
  negeri: string;
  jumlahKerusi: number;
  ph: number;
  pn: number;
  bn: number;
  gps_grs: number;
  lain: number;
  pemenang: string;
  pemilih: number;
  peratusKeluar: number;
}

interface Props {
  rows: NegeriRow[];
}

function fmtPemilih(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(2)}J`;
  if (n >= 1000) return `${(n / 1000).toFixed(0)}K`;
  return String(n);
}

export default function NegeriTable({ rows }: Props) {
  const downloadCsv = () => {
    const header = "NEGERI,JUMLAH KERUSI,PH,PN,BN,GPS/GRS,LAIN,PEMENANG,PEMILIH,% KELUAR";
    const csv = rows.map((r) =>
      `"${r.negeri}",${r.jumlahKerusi},${r.ph},${r.pn},${r.bn},${r.gps_grs},${r.lain},"${r.pemenang}",${r.pemilih},${r.peratusKeluar}`
    );
    const blob = new Blob([header + "\n" + csv.join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "keputusan-negeri.csv"; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-white border border-spr-border rounded-xl overflow-hidden">
      <div className="flex items-center justify-between px-6 py-4 border-b border-spr-border-light">
        <div>
          <h3 className="text-lg font-semibold text-spr-navy">Keputusan Mengikut Negeri</h3>
          <span className="text-xs text-spr-text-muted">{rows.length} negeri</span>
        </div>
        <button onClick={downloadCsv}
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#1a2332] text-white rounded-lg text-sm font-medium hover:bg-[#1a2332]/90">
          <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Muat Turun CSV
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-[#1a2332]">
              {["NEGERI","JUMLAH KERUSI","PH","PN","BN","GPS/GRS","LAIN","PEMENANG","PEMILIH","% KELUAR"].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-[11px] font-semibold text-white uppercase tracking-wider whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={r.negeri} className={`border-t border-spr-border-light hover:bg-spr-primary-50 transition-colors ${i % 2 === 0 ? "bg-white" : "bg-[#F8FAFC]"}`}>
                <td className="px-4 py-2.5 font-medium text-spr-navy whitespace-nowrap">{r.negeri}</td>
                <td className="px-4 py-2.5 text-center font-semibold">{r.jumlahKerusi}</td>
                <td className="px-4 py-2.5 text-center">{r.ph || "—"}</td>
                <td className="px-4 py-2.5 text-center">{r.pn || "—"}</td>
                <td className="px-4 py-2.5 text-center">{r.bn || "—"}</td>
                <td className="px-4 py-2.5 text-center">{r.gps_grs || "—"}</td>
                <td className="px-4 py-2.5 text-center">{r.lain || "—"}</td>
                <td className="px-4 py-2.5">
                  {getPartiLogo(r.pemenang) ? (
                    <img src={getPartiLogo(r.pemenang)!} alt={r.pemenang} width={80} height={80} className="object-contain rounded-sm max-w-[60px] sm:max-w-[80px]" title={r.pemenang} />
                  ) : (
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold text-white"
                      style={{ backgroundColor: COALITION_COLORS[r.pemenang] || "#999" }}>
                      {r.pemenang}
                    </span>
                  )}
                </td>
                <td className="px-4 py-2.5 text-spr-text-muted whitespace-nowrap">{fmtPemilih(r.pemilih)}</td>
                <td className="px-4 py-2.5 text-spr-text-muted">{r.peratusKeluar > 0 ? `${r.peratusKeluar}%` : "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
