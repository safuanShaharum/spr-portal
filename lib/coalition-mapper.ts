/**
 * Coalition mapping per PRU — coalition Malaysia berubah ikut tahun.
 *
 * PRU12 (2008) & PRU13 (2013): Pakatan Rakyat tak berdaftar dengan ROS, jadi
 *   calon PKR/DAP/PAS guna warna parti masing-masing. Hanya BN component
 *   parties yang dimap ke coalition BN.
 *
 * PRU14 (2018): BN, PH, WARISAN aktif. PAS bertanding solo bawah Gagasan
 *   Sejahtera (treat as solo). GPS belum wujud (ditubuhkan 12 Jun 2018,
 *   selepas PRU14 pada 9 Mei 2018) — parti Sarawak masih bawah BN.
 *
 * PRU15 (2022): BN, PH, PN, GPS, GRS, WARISAN, MUDA — paling kompleks.
 */

import { COALITION_COLORS, PARTI_COLORS_DASHBOARD } from "./parti-colors";

export type PRUKey = "PRU12" | "PRU13" | "PRU14" | "PRU15";

export const YEAR_TO_PRU: Record<string, PRUKey> = {
  "2008": "PRU12",
  "2013": "PRU13",
  "2018": "PRU14",
  "2022": "PRU15",
};

const COALITION_MAP_BY_PRU: Record<PRUKey, Record<string, string>> = {
  PRU12: {
    UMNO: "BN", MCA: "BN", MIC: "BN", GERAKAN: "BN", PPP: "BN",
    PBB: "BN", SUPP: "BN", PRS: "BN", PDP: "BN", SPDP: "BN",
    PBS: "BN", UPKO: "BN", LDP: "BN", PBRS: "BN", SAPP: "BN",
  },
  PRU13: {
    UMNO: "BN", MCA: "BN", MIC: "BN", GERAKAN: "BN", PPP: "BN",
    PBB: "BN", SUPP: "BN", PRS: "BN", PDP: "BN",
    PBS: "BN", UPKO: "BN", LDP: "BN", PBRS: "BN",
  },
  PRU14: {
    UMNO: "BN", MCA: "BN", MIC: "BN", PBRS: "BN",
    PBB: "BN", SUPP: "BN", PRS: "BN", PDP: "BN",
    PKR: "PH", DAP: "PH", AMANAH: "PH", BERSATU: "PH", PPBM: "PH",
    WARISAN: "WARISAN",
  },
  PRU15: {
    PKR: "PH", DAP: "PH", AMANAH: "PH",
    BERSATU: "PN", PAS: "PN", GERAKAN: "PN", PPBM: "PN",
    UMNO: "BN", MCA: "BN", MIC: "BN", PBRS: "BN",
    PBB: "GPS", SUPP: "GPS", PRS: "GPS", PDP: "GPS",
    STARSABAH: "GRS", SAPP: "GRS", PBS: "GRS", LDP: "GRS", STAR: "GRS",
    WARISAN: "WARISAN", MUDA: "MUDA",
  },
};

export interface DisplayColor {
  color: string;
  coalitionAbbr: string | null;
  partyAbbr: string;
  type: "coalition" | "party";
}

/**
 * Pulangkan info warna untuk calon menang atas map.
 *
 * Lookup tables (warna) datang dari sumber luar — fungsi ni tak hardcode warna,
 * cuma decide samada parti tu di-roll-up ke coalition atau guna warna parti sendiri.
 */
export function getDisplayColor(
  pruKey: PRUKey | string | null | undefined,
  partyAbbr: string,
  partiesLookup: Record<string, string> = PARTI_COLORS_DASHBOARD,
  coalitionsLookup: Record<string, string> = COALITION_COLORS,
): DisplayColor {
  const upper = String(partyAbbr || "").trim().toUpperCase();
  const map = (pruKey && COALITION_MAP_BY_PRU[pruKey as PRUKey]) || {};
  const coalitionAbbr = map[upper];

  if (coalitionAbbr && coalitionsLookup[coalitionAbbr]) {
    return {
      color: coalitionsLookup[coalitionAbbr],
      coalitionAbbr,
      partyAbbr: upper,
      type: "coalition",
    };
  }

  return {
    color: partiesLookup[upper] || coalitionsLookup[upper] || coalitionsLookup.LAIN || "#9E9E9E",
    coalitionAbbr: null,
    partyAbbr: upper,
    type: "party",
  };
}

interface LegendItem {
  abbr: string;
  label: string;
}

const LEGEND_BY_PRU: Record<PRUKey, LegendItem[]> = {
  PRU12: [
    { abbr: "BN", label: "BN (Barisan Nasional)" },
    { abbr: "PKR", label: "PKR" },
    { abbr: "DAP", label: "DAP" },
    { abbr: "PAS", label: "PAS" },
    { abbr: "BEBAS", label: "Bebas" },
  ],
  PRU13: [
    { abbr: "BN", label: "BN (Barisan Nasional)" },
    { abbr: "PKR", label: "PKR" },
    { abbr: "DAP", label: "DAP" },
    { abbr: "PAS", label: "PAS" },
    { abbr: "BEBAS", label: "Bebas" },
  ],
  PRU14: [
    { abbr: "BN", label: "BN (Barisan Nasional)" },
    { abbr: "PH", label: "PH (Pakatan Harapan)" },
    { abbr: "PAS", label: "PAS" },
    { abbr: "WARISAN", label: "WARISAN" },
    { abbr: "BEBAS", label: "Bebas" },
  ],
  PRU15: [
    { abbr: "PH", label: "PH (Pakatan Harapan)" },
    { abbr: "PN", label: "PN (Perikatan Nasional)" },
    { abbr: "BN", label: "BN (Barisan Nasional)" },
    { abbr: "GPS", label: "GPS (Gabungan Parti Sarawak)" },
    { abbr: "GRS", label: "GRS (Gabungan Rakyat Sabah)" },
    { abbr: "WARISAN", label: "WARISAN" },
    { abbr: "MUDA", label: "MUDA" },
    { abbr: "BEBAS", label: "Bebas" },
  ],
};

export interface ResolvedLegendItem {
  abbr: string;
  label: string;
  color: string;
}

export function getLegendItems(
  pruKey: PRUKey | string | null | undefined,
  partiesLookup: Record<string, string> = PARTI_COLORS_DASHBOARD,
  coalitionsLookup: Record<string, string> = COALITION_COLORS,
): ResolvedLegendItem[] {
  const key = (pruKey && pruKey in LEGEND_BY_PRU ? pruKey : "PRU15") as PRUKey;
  return LEGEND_BY_PRU[key].map((item) => ({
    abbr: item.abbr,
    label: item.label,
    color:
      coalitionsLookup[item.abbr] ||
      partiesLookup[item.abbr] ||
      coalitionsLookup.LAIN ||
      "#9E9E9E",
  }));
}

export { COALITION_MAP_BY_PRU };
