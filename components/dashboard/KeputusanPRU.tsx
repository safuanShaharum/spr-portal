"use client";

import { useEffect, useMemo, useState } from "react";
import { getCatalogData } from "@/lib/catalog";
import { COALITION_COLORS, PRU_INFO } from "@/lib/parti-colors";
import InfoCard from "./InfoCard";
import NegeriTable, { NegeriRow } from "./NegeriTable";
import DonutChart from "./DonutChart";
import HBarChart from "./HBarChart";

type Row = Record<string, unknown>;

// Local coalition map — covers both coalition names AND individual party names
const COALITION_MAP: Record<string, string> = {
  PH: "PH", PKR: "PH", DAP: "PH", AMANAH: "PH", UPKO: "PH",
  PN: "PN", PAS: "PN", BERSATU: "PN", PPBM: "PN",
  BN: "BN", UMNO: "BN", MCA: "BN", MIC: "BN", GERAKAN: "BN",
  GPS: "GPS", PBB: "GPS", SUPP: "GPS", PDP: "GPS", PRS: "GPS",
  GRS: "GRS", PBS: "GRS", PBRS: "GRS", STARSABAH: "GRS", STAR: "GRS", LDP: "GRS", SAPP: "GRS",
};

function getCoalition(parti: string): string {
  return COALITION_MAP[String(parti).trim()] || "LAIN";
}

export default function KeputusanPRU() {
  const [allData, setAllData] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState("2022");

  // Fetch ALL keputusan-pru data at once (no server-side tahun filter)
  useEffect(() => {
    getCatalogData("keputusan-pru")
      .then((rows) => {
        const data = rows as Row[];
        setAllData(data);
        console.log("[Dashboard] Total rows fetched:", data.length);
      })
      .catch(() => setAllData([]))
      .finally(() => setLoading(false));
  }, []);

  // Extract unique years from data
  const years = useMemo(() => {
    const yrs = Array.from(new Set(allData.map((r) => String(r["TAHUN PILIHAN RAYA"] || "").trim())))
      .filter((y) => ["2022", "2018", "2013", "2008"].includes(y))
      .sort()
      .reverse();
    return yrs;
  }, [allData]);

  // Filter: selected year → Parlimen → MNG winners
  const winners = useMemo(() => {
    const yearRows = allData.filter((r) =>
      String(r["TAHUN PILIHAN RAYA"] || "").trim() === selectedYear
    );
    const w = yearRows.filter((r) =>
      String(r["JenisCalon"] || "").trim() === "Parlimen" &&
      String(r["StatusCalon"] || "").trim() === "MNG"
    );
    console.log(`[Dashboard] Year ${selectedYear}: ${yearRows.length} total, ${w.length} Parlimen winners`);
    return w;
  }, [allData, selectedYear]);

  // All parlimen candidates for selected year (for stats)
  const allParlimenYear = useMemo(() =>
    allData.filter((r) =>
      String(r["TAHUN PILIHAN RAYA"] || "").trim() === selectedYear &&
      String(r["JenisCalon"] || "").trim() === "Parlimen"
    ),
    [allData, selectedYear]
  );

  // Extended stats
  const extendedStats = useMemo(() => {
    const jumlahPemilih = winners.reduce((s, r) => s + (parseInt(String(r["JumlahPemilih"] || "0"), 10) || 0), 0);
    const pctSum = winners.reduce((s, r) => s + (parseFloat(String(r["PERATUS UNDI"] || "0")) || 0), 0);
    const pctCount = winners.filter((r) => parseFloat(String(r["PERATUS UNDI"] || "0")) > 0).length;
    const undiDitolak = winners.reduce((s, r) => s + (parseInt(String(r["UNDI DITOLAK"] || "0"), 10) || 0), 0);
    return {
      jumlahPemilih,
      peratusanKeluar: pctCount > 0 ? (pctSum / pctCount).toFixed(1) : "0",
      jumlahCalon: allParlimenYear.length,
      undiDitolak,
    };
  }, [winners, allParlimenYear]);

  // Coalition seat counts
  const coalitionSeats = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const row of winners) {
      const parti = String(row["SINGKATAN NAMA PARTI BERTANDING"] || "").trim();
      const coal = getCoalition(parti);
      counts[coal] = (counts[coal] || 0) + 1;
    }
    console.log("[Dashboard] Seats by coalition:", counts);

    const order = ["PH", "PN", "BN", "GPS", "GRS", "LAIN"];
    return order
      .map((c) => ({ label: c, value: counts[c] || 0, color: COALITION_COLORS[c] || "#9E9E9E" }))
      .filter((s) => s.value > 0);
  }, [winners]);

  const totalSeats = winners.length;

  // Bar chart
  const barItems = useMemo(() =>
    [...coalitionSeats]
      .sort((a, b) => b.value - a.value)
      .map((s) => ({
        ...s,
        pct: totalSeats > 0 ? `${((s.value / totalSeats) * 100).toFixed(1)}%` : "0%",
      })),
    [coalitionSeats, totalSeats]
  );

  // Negeri table
  const negeriRows: NegeriRow[] = useMemo(() => {
    const map = new Map<string, { total: number; ph: number; pn: number; bn: number; gps_grs: number; lain: number; pemilih: number; pctSum: number; pctCount: number }>();

    for (const row of winners) {
      const negeri = String(row["NEGERI"] || "").trim();
      if (!negeri) continue;

      let e = map.get(negeri);
      if (!e) {
        e = { total: 0, ph: 0, pn: 0, bn: 0, gps_grs: 0, lain: 0, pemilih: 0, pctSum: 0, pctCount: 0 };
        map.set(negeri, e);
      }

      e.total++;
      const coal = getCoalition(String(row["SINGKATAN NAMA PARTI BERTANDING"] || "").trim());
      if (coal === "PH") e.ph++;
      else if (coal === "PN") e.pn++;
      else if (coal === "BN") e.bn++;
      else if (coal === "GPS" || coal === "GRS") e.gps_grs++;
      else e.lain++;

      const pemilih = parseInt(String(row["JumlahPemilih"] || "0"), 10);
      if (!isNaN(pemilih)) e.pemilih += pemilih;

      const pct = parseFloat(String(row["PERATUS UNDI"] || "0"));
      if (!isNaN(pct) && pct > 0) { e.pctSum += pct; e.pctCount++; }
    }

    console.log("[Dashboard] Negeri count:", map.size);

    return Array.from(map.entries())
      .map(([negeri, e]) => {
        const groups: Record<string, number> = { PH: e.ph, PN: e.pn, BN: e.bn, "GPS/GRS": e.gps_grs, LAIN: e.lain };
        const pemenang = Object.entries(groups).sort((a, b) => b[1] - a[1])[0]?.[0] || "—";
        return {
          negeri,
          jumlahKerusi: e.total,
          ph: e.ph, pn: e.pn, bn: e.bn, gps_grs: e.gps_grs, lain: e.lain,
          pemenang: pemenang === "GPS/GRS" ? "GPS" : pemenang,
          pemilih: e.pemilih,
          peratusKeluar: e.pctCount > 0 ? parseFloat((e.pctSum / e.pctCount).toFixed(1)) : 0,
        };
      })
      .sort((a, b) => b.jumlahKerusi - a.jumlahKerusi);
  }, [winners]);

  const info = PRU_INFO[selectedYear] || PRU_INFO["2022"];

  if (loading) {
    return (
      <div className="py-20 text-center">
        <div className="w-10 h-10 border-2 border-spr-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-spr-text-muted text-sm">Memuatkan data keputusan PRU...</p>
      </div>
    );
  }

  return (
    <div>
      {/* Year tabs */}
      <div className="flex items-center gap-2 mb-8 overflow-x-auto">
        {years.map((yr) => (
          <button key={yr} onClick={() => setSelectedYear(yr)}
            className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium border transition-all ${
              selectedYear === yr
                ? "bg-[#E8740C] text-white border-[#E8740C]"
                : "bg-white text-spr-text-secondary border-spr-border hover:border-[#E8740C]/40"
            }`}>
            {PRU_INFO[yr]?.label || `PRU (${yr})`}
          </button>
        ))}
      </div>

      {winners.length === 0 ? (
        <div className="py-16 text-center text-spr-text-muted">
          <p>Tiada data untuk tahun ini.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <DonutChart
              segments={coalitionSeats}
              centerLabel={String(totalSeats)}
              centerSub="kerusi parlimen"
              title="Agihan Kerusi Parlimen"
              subtitle={`${info?.label || selectedYear} — ${totalSeats} kerusi`}
            />
            <HBarChart items={barItems} title="Agihan Kerusi Mengikut Parti" />
            <InfoCard
              tarikh={info.tarikh} pm={info.pm} kerajaan={info.kerajaan} majoriti={info.majoriti}
              jumlahPemilih={extendedStats.jumlahPemilih}
              peratusanKeluar={extendedStats.peratusanKeluar}
              jumlahCalon={extendedStats.jumlahCalon}
              undiDitolak={extendedStats.undiDitolak}
            />
          </div>
          <NegeriTable rows={negeriRows} />
        </>
      )}
    </div>
  );
}
