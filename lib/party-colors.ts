/**
 * Official SPR party colors — extracted dari warna_parti_aktif.xlsx
 * Total: 72 parties
 * Source: Suruhanjaya Pilihan Raya Malaysia
 */

export interface PartyInfo {
  color: string;
  name: string;
}

export const PARTY_COLORS: Record<string, PartyInfo> = {
  'PUTRA': { color: '#4b4b4b', name: 'PARTI BUMIPUTERA PERKASA MALAYSIA' },
  'PSB': { color: '#FF9900', name: 'PARTI SARAWAK BERSATU' },
  'PBK': { color: '#ffaa00', name: 'PARTI BUMI KENYALANG' },
  'PPM': { color: '#cc9900', name: 'PARTI PUNJABI MALAYSIA' },
  'PUR': { color: '#C66E29', name: 'PARTI UTAMA RAKYAT' },
  'AMIPF': { color: '#e30300', name: 'BARISAN KEMAJUAN INDIA SE-MALAYSIA' },
  'PKR': { color: '#04A0D1', name: 'PARTI KEADILAN RAKYAT' },
  'PIS': { color: '#05d1fa', name: 'PARTI IMPIAN SABAH' },
  'BERSAMA': { color: '#ff66ff', name: 'PARTI BERSATU SASA MALAYSIA' },
  'GPS': { color: '#ff794d', name: 'GABUNGAN PARTI SARAWAK' },
  'PAS': { color: '#6CB332', name: 'PARTI ISLAM SE MALAYSIA' },
  'UPKO': { color: '#2a0e72', name: 'PERTUBUHAN KINABALU PROGRESIF BERSATU' },
  'PCS': { color: '#802000', name: 'PARTI CINTA SABAH' },
  'BERJASA': { color: '#730947', name: 'BARISAN JAMAAH ISLAMIAH SE MALAYSIA' },
  'PKS': { color: '#0069cc', name: 'PARTI KEBANGSAAN SABAH' },
  'HARAPAN RAKYAT': { color: '#9999ff', name: 'PARTI HARAPAN RAKYAT SABAH' },
  'IKATAN': { color: '#e60000', name: 'PARTI IKATAN BANGSA MALAYSIA' },
  'PEJUANG': { color: '#0066a6', name: 'PARTI PEJUANG TANAHAIR' },
  'PAP': { color: '#000d1a', name: 'PARTI ALTERNATIF RAKYAT' },
  'MCA': { color: '#e6e600', name: 'MALAYSIAN CHINESE ASSOCIATION' },
  'PBB': { color: '#f0e98b', name: 'PARTI PESAKA BUMIPUTERA BERSATU SARAWAK' },
  'MU': { color: '#800000', name: 'PARTI BERSAMA MALAYSIA' },
  'PRS': { color: '#33cc33', name: 'PARTI RAKYAT SARAWAK' },
  'PBM': { color: '#fcf9a8', name: 'PARTI BANGSA MALAYSIA' },
  'RUMPUN': { color: '#0cfd08', name: 'PARTI RUMPUN SABAH' },
  'PCM': { color: '#F4E50E', name: 'PARTI CINTA MALAYSIA' },
  'IMAN': { color: '#BD2828', name: 'PARTI PERIKATAN INDIA MUSLIM NASIONAL' },
  'PRM': { color: '#ca2126', name: 'PARTI RAKYAT MALAYSIA' },
  'MCC': { color: '#e65c00', name: 'MALAYSIAN CEYLONESE CONGRESS' },
  'PERPADUAN': { color: '#ffff4d', name: 'PERTUBUHAN PERPADUAN RAKYAT KEBANGSAAN SABAH' },
  'MUDA': { color: '#000000', name: 'IKATAN DEMOKRATIK MALAYSIA' },
  'SUPP': { color: '#ffff00', name: 'PARTI RAKYAT BERSATU SARAWAK' },
  'LDP': { color: '#ab3d1a', name: 'PARTI LIBERAL DEMOKRATIK' },
  'STARSABAH': { color: '#4d4dff', name: 'PARTI SOLIDARITI TANAH AIRKU' },
  'BEBAS': { color: '#999999', name: 'BEBAS' },
  'KIMMA': { color: '#de8801', name: 'KONGRES INDIAN MUSLIM MALAYSIA' },
  'PPP': { color: '#0941ec', name: 'MALAYSIAN PEOPLE\'S PROGRESSIVE PARTY' },
  'WARISAN': { color: '#99CCFF', name: 'PARTI WARISAN SABAH' },
  'SPP': { color: '#006600', name: 'PARTI DAMAI SABAH' },
  'PSM': { color: '#c0110d', name: 'PARTI SOSIALIS MALAYSIA' },
  'TERAS': { color: '#001A33', name: 'PARTI TENAGA RAKYAT SARAWAK' },
  'GERAKAN': { color: '#fe2514', name: 'PARTI GERAKAN RAKYAT MALAYSIA' },
  'USNO': { color: '#003300', name: 'PERTUBUHAN KEBANGSAAN SABAH BERSATU' },
  'SAPP': { color: '#fbfd0b', name: 'PARTI MAJU SABAH' },
  'PR': { color: '#fbf309', name: 'PERJUANGAN RAKYAT' },
  'PFP': { color: '#ff3333', name: 'PENANG FRONT PARTY' },
  'PPRS': { color: '#0000ff', name: 'PARTI PERPADUAN RAKYAT SABAH' },
  'GRS': { color: '#6285a8', name: 'PARTI GABUNGAN RAKYAT SABAH' },
  'MIC': { color: '#009933', name: 'THE MALAYSIAN INDIAN CONGRESS' },
  'DAP': { color: '#E70024', name: 'DEMOCRATIC ACTION PARTY, MALAYSIA' },
  'PBS': { color: '#6666ff', name: 'PARTI BERSATU SABAH' },
  'AMANAH': { color: '#FF9900', name: 'PARTI AMANAH NEGARA' },
  'SAPU': { color: '#FF4000', name: 'PARTI SEJAHTERA ANGKATAN PERPADUAN SABAH' },
  'BERSATU': { color: '#cc0000', name: 'PARTI PRIBUMI BERSATU MALAYSIA' },
  'UMNO': { color: '#ff0000', name: 'PERTUBUHAN KEBANGSAAN MELAYU BERSATU' },
  'PGRS': { color: '#88B5CC', name: 'PARTI GAGASAN RAKYAT SABAH' },
  'SEDAR': { color: '#ffff1a', name: 'PARTI SEDAR RAKYAT SARAWAK' },
  'PRIM': { color: '#FB6463', name: 'PARTI RAKYAT INDIA MALAYSIA' },
  'ANAK NEGERI': { color: '#000000', name: 'PARTI KERJASAMA ANAK NEGERI' },
  'KDM': { color: '#EB7389', name: 'PARTI KESEJAHTERAAN DEMOKRATIK MASYARAKAT' },
  'PN': { color: '#002e4d', name: 'PERIKATAN NASIONAL' },
  'PH': { color: '#d7282f', name: 'PAKATAN HARAPAN' },
  'GAS': { color: '#f95d5d', name: 'PERTUBUHAN PARTI GEMILANG ANAK SABAH' },
  'PBDS': { color: '#e0f810', name: 'PARTI BANSA DAYAK SARAWAK' },
  'PBRS': { color: '#f9f906', name: 'PARTI BERSATU RAKYAT SABAH' },
  'MAP': { color: '#ffdd00', name: 'PARTI KEMAJUAN MALAYSIA' },
  'PDP': { color: '#6abfe6', name: 'PARTI DEMOKRATIK PROGRESIF SARAWAK' },
  'ASPIRASI': { color: '#e63900', name: 'PARTI ASPIRASI RAKYAT SARAWAK' },
  'BN': { color: '#004080', name: 'BARISAN NASIONAL OF MALAYSIA' },
  'ASLI': { color: '#815e22', name: 'PARTI ORANG ASLI MALAYSIA' },
  'OTHER': { color: '#999999', name: 'Lain-lain' },
};

export function getPartyColor(code: string): string {
  return PARTY_COLORS[code]?.color || '#999999';
}

export function getPartyName(code: string): string {
  return PARTY_COLORS[code]?.name || code;
}
