import { PARTI_FULL_LIST } from "./parti-data";

const logoMap = new Map<string, string>();
PARTI_FULL_LIST.forEach((p) => {
  logoMap.set(p.singkatan.toUpperCase(), `/images/parti-new-2026/${p.logo}`);
});

// Ensure coalition names are mapped
logoMap.set("PH", "/images/parti-new-2026/07_PH.png");
logoMap.set("PN", "/images/parti-new-2026/26_PN.png");
logoMap.set("BN", "/images/parti-new-2026/01_BN.png");
logoMap.set("GPS", "/images/parti-new-2026/36_GPS.png");
logoMap.set("GRS", "/images/parti-new-2026/66_GRS.png");

export function getPartiLogo(singkatan: string): string | null {
  const key = String(singkatan || "").trim().toUpperCase();
  return logoMap.get(key) || null;
}
