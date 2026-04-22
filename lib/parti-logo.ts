import { PARTI_FULL_LIST } from "./parti-data";

const logoMap = new Map<string, string>();
PARTI_FULL_LIST.forEach((p) => {
  logoMap.set(p.singkatan.toUpperCase(), `/images/parti/${p.logo}`);
});

// Ensure coalition names are mapped
logoMap.set("PH", "/images/parti/07_PH_PAKATAN_HARAPAN.png");
logoMap.set("PN", "/images/parti/26_PN_PERIKATAN_NASIONAL.png");
logoMap.set("BN", "/images/parti/01_BN_BARISAN_NASIONAL.png");
logoMap.set("GPS", "/images/parti/36_GPS.png");
logoMap.set("GRS", "/images/parti/66_GRS.png");

export function getPartiLogo(singkatan: string): string | null {
  const key = String(singkatan || "").trim().toUpperCase();
  return logoMap.get(key) || null;
}
