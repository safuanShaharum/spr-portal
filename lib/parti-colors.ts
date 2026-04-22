export const PARTI_COLORS_DASHBOARD: Record<string, string> = {
  PH: "#E70024", PN: "#003366", BN: "#000080", GPS: "#FF6600", GRS: "#4CAF50",
  PKR: "#04A0D1", DAP: "#E70024", AMANAH: "#FF9900", PAS: "#6CB332",
  BERSATU: "#cc0000", UMNO: "#ff0000", MCA: "#e6e600", MIC: "#009933",
  GERAKAN: "#fe2514", UPKO: "#2a0e72", PBB: "#f0e98b", SUPP: "#ffff00",
  PDP: "#6abfe6", PRS: "#33cc33", PBS: "#6666ff", PBRS: "#f9f906",
  STARSABAH: "#4d4dff", SAPP: "#fbfd0b", WARISAN: "#99CCFF", MUDA: "#000000",
  PSM: "#c0110d", PEJUANG: "#0066a6", BEBAS: "#999999", KDM: "#EB7389",
  PPBM: "#cc0000", PRM: "#9E9E9E", PUTRA: "#9E9E9E",
};

export const COALITION_MAP: Record<string, string> = {
  // Pakatan Harapan
  PKR: "PH", DAP: "PH", AMANAH: "PH", UPKO: "PH", PH: "PH",
  // Perikatan Nasional
  PAS: "PN", BERSATU: "PN", PPBM: "PN", PN: "PN",
  // Barisan Nasional
  UMNO: "BN", MCA: "BN", MIC: "BN", GERAKAN: "BN", BN: "BN",
  // Gabungan Parti Sarawak
  GPS: "GPS", PBB: "GPS", SUPP: "GPS", PDP: "GPS", PRS: "GPS",
  // Gabungan Rakyat Sabah
  GRS: "GRS", PBS: "GRS", PBRS: "GRS", STARSABAH: "GRS", SAPP: "GRS",
  "GRS/BN": "GRS", STAR: "GRS",
};

export const COALITION_COLORS: Record<string, string> = {
  PH: "#E70024",
  PN: "#003366",
  BN: "#000080",
  GPS: "#FF6600",
  GRS: "#4CAF50",
  LAIN: "#9E9E9E",
};

export const PRU_INFO: Record<string, { label: string; tarikh: string; pm: string; kerajaan: string; majoriti: string }> = {
  "2022": { label: "PRU Ke-15 (2022)", tarikh: "19 November 2022", pm: "YAB Dato' Seri Anwar Ibrahim", kerajaan: "Kerajaan Perpaduan", majoriti: "112 kerusi" },
  "2018": { label: "PRU Ke-14 (2018)", tarikh: "9 Mei 2018", pm: "YAB Tun Dr. Mahathir Mohamad", kerajaan: "Pakatan Harapan", majoriti: "113 kerusi" },
  "2013": { label: "PRU Ke-13 (2013)", tarikh: "5 Mei 2013", pm: "YAB Dato' Sri Mohd Najib", kerajaan: "Barisan Nasional", majoriti: "133 kerusi" },
  "2008": { label: "PRU Ke-12 (2008)", tarikh: "8 Mac 2008", pm: "YAB Dato' Seri Abdullah Ahmad Badawi", kerajaan: "Barisan Nasional", majoriti: "140 kerusi" },
};

export function getCoalition(parti: string): string {
  return COALITION_MAP[parti.trim()] || "LAIN";
}
