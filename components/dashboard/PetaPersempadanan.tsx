"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { MapContainer, TileLayer, GeoJSON, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import JSZip from "jszip";
import { kml } from "@mapbox/togeojson";
import { SlidersHorizontal, X } from "lucide-react";
import { NEGERI_LIST } from "@/lib/constants";
import { COALITION_COLORS, PARTI_COLORS_DASHBOARD } from "@/lib/parti-colors";
import { getDisplayColor, getLegendItems, YEAR_TO_PRU, type PRUKey } from "@/lib/coalition-mapper";
import { getPartiLogo } from "@/lib/parti-logo";
import { getCatalogData } from "@/lib/catalog";
import type { Feature, FeatureCollection } from "geojson";

const EMPTY_FC: FeatureCollection = { type: "FeatureCollection", features: [] };

function normalize(s: string): string { return s.toUpperCase().replace(/\./g, "").replace(/\s+/g, " ").trim(); }

type WinnerInfo = { color: string; calon: string; parti: string; coalitionAbbr: string | null; undi: number; majoriti: number; negeri: string; kawasan: string; isPRK?: boolean; prkLabel?: string };
type Row = Record<string, unknown>;

const PRU_YEARS = [
  { value: "2022", label: "PRU-15 (2022)" },
  { value: "2018", label: "PRU-14 (2018)" },
  { value: "2013", label: "PRU-13 (2013)" },
  { value: "2008", label: "PRU-12 (2008)" },
];

const DUN_YEARS = [
  { value: "latest", label: "Terkini" },
  { value: "2018", label: "PRU 2018" },
  { value: "2013", label: "PRU 2013" },
  { value: "2008", label: "PRU 2008" },
];

// Mobile devices get a tighter view focused on Peninsular Malaysia at first
// load — fitting the full country including Borneo on a narrow viewport zooms
// out too far and makes individual kawasan boundaries unreadable. Users can
// pan/zoom to East Malaysia from there.
const FULL_BOUNDS: L.LatLngBoundsLiteral = [[0.8, 99.5], [7.5, 119.5]];
const PENINSULAR_BOUNDS: L.LatLngBoundsLiteral = [[1.0, 99.4], [6.8, 105.0]];

function FitMalaysia({ onReady }: { onReady: (map: L.Map) => void }) {
  const map = useMap();
  useEffect(() => {
    onReady(map);
    const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
    const bounds = isMobile ? PENINSULAR_BOUNDS : FULL_BOUNDS;
    map.fitBounds(bounds, { padding: [20, 20] });
  }, [map, onReady]);
  return null;
}

export default function PetaPersempadanan() {
  const [parlimenData, setParlimenData] = useState<FeatureCollection>(EMPTY_FC);
  const [dunData, setDunData] = useState<FeatureCollection>(EMPTY_FC);
  const [pruRows, setPruRows] = useState<Row[]>([]);
  const [dunRows, setDunRows] = useState<Row[]>([]);
  const [prkRows, setPrkRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [layer, setLayer] = useState<"parlimen" | "dun">("parlimen");
  const [selectedYear, setSelectedYear] = useState("2022");
  const [selectedNegeri, setSelectedNegeri] = useState("");
  const [controlsOpen, setControlsOpen] = useState(false);
  const mapRef = useRef<L.Map | null>(null);

  // Load KMZ + all data once
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        const [kmzRes, pruRowsRes, dunRowsRes, prkRowsRes] = await Promise.all([
          fetch("/api/proxy-file?dataset_id=11"),
          getCatalogData("keputusan-pru"),
          getCatalogData("keputusan-pru-dun"),
          getCatalogData("keputusan-prk"),
        ]);
        if (!kmzRes.ok) throw new Error("Gagal memuat turun KMZ");

        const buffer = await kmzRes.arrayBuffer();
        const zip = await JSZip.loadAsync(buffer);
        const kmlFile = zip.file("doc.kml") || zip.file(/\.kml$/i)[0];
        if (!kmlFile) throw new Error("KML tidak dijumpai");
        const xmlDoc = new DOMParser().parseFromString(await kmlFile.async("string"), "text/xml");
        const allGeoJson = kml(xmlDoc) as FeatureCollection;
        if (cancelled) return;

        const parlimen: Feature[] = [], dun: Feature[] = [];
        for (const f of allGeoJson.features) {
          const name = (f.properties?.name || "").trim();
          if (/^P\.\s*\d+/i.test(name)) parlimen.push(f);
          else if (/^N\.\s*\d+/i.test(name)) dun.push(f);
          else parlimen.push(f);
        }
        setParlimenData({ type: "FeatureCollection", features: parlimen });
        setDunData({ type: "FeatureCollection", features: dun });

        setPruRows(pruRowsRes as Row[]);
        setDunRows(dunRowsRes as Row[]);
        setPrkRows(prkRowsRes as Row[]);
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : "Gagal");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  // Rebuild winner map synchronously with year/layer — useMemo (not useEffect+setState)
  // ensures the map and its colors are always in sync with selectedYear in the
  // same render. Otherwise the GeoJSON remounts with stale style closures and
  // first-load shows wrong coalition colors until the user hovers.
  const winnerMap = useMemo<Map<string, WinnerInfo>>(() => {
    const wMap = new Map<string, WinnerInfo>();
    // DUN "latest" treated as PRU15 for coalition mapping (latest state polls 2022+)
    const pruKey: PRUKey | undefined = YEAR_TO_PRU[selectedYear] || (selectedYear === "latest" ? "PRU15" : undefined);

    const addWinner = (row: Row, kawasanField: string, opts?: { isPRK?: boolean; prkLabel?: string }) => {
      const status = String(row["StatusCalon"] || row["STATUS"] || "").trim().toUpperCase();
      if (status !== "MNG" && status !== "MENANG") return;
      const kawasan = String(row[kawasanField] || "").trim();
      if (!kawasan || kawasan === "-") return;
      // Don't overwrite existing entries (PRU takes priority over PRK)
      if (opts?.isPRK && (wMap.has(kawasan) || wMap.has(normalize(kawasan)))) return;

      const parti = String(row["SINGKATAN NAMA PARTI BERTANDING"] || "").trim();
      const display = getDisplayColor(pruKey, parti, PARTI_COLORS_DASHBOARD, COALITION_COLORS);
      const info: WinnerInfo = {
        color: display.color,
        calon: String(row["NAMA ATAS KERTAS UNDI"] || row["NAMA KERTAS UNDI"] || ""),
        parti,
        coalitionAbbr: display.coalitionAbbr,
        undi: parseInt(String(row["BILANGAN UNDI"] || "0"), 10) || 0,
        majoriti: parseInt(String(row["MAJORITI"] || "0"), 10) || 0,
        negeri: String(row["NEGERI"] || ""), kawasan,
        isPRK: opts?.isPRK, prkLabel: opts?.prkLabel,
      };
      wMap.set(kawasan, info);
      wMap.set(normalize(kawasan), info);
      const nameOnly = kawasan.replace(/^[PN]\.\s*\d+\s+/i, "").trim().toUpperCase();
      if (nameOnly) wMap.set(nameOnly, info);
    };

    if (layer === "parlimen") {
      // PRU Parlimen by selected year
      for (const row of pruRows) {
        if (String(row["TAHUN PILIHAN RAYA"] || "").trim() !== selectedYear) continue;
        if (String(row["JenisCalon"] || "").trim() !== "Parlimen") continue;
        addWinner(row, "PARLIMEN");
      }
    } else {
      // DUN mode
      if (selectedYear === "latest") {
        // Latest: use all DUN data from keputusan-dun (latest per negeri)
        for (const row of dunRows) { addWinner(row, "DEWAN UNDANGAN NEGERI"); }
        // Also PRU sheet DUN rows (Pahang/Perak/Perlis 2022)
        for (const row of pruRows) {
          if (String(row["JenisCalon"] || "").trim() !== "DUN") continue;
          addWinner(row, "DEWAN UNDANGAN NEGERI");
        }
      } else {
        // Specific year from PRU sheet
        for (const row of pruRows) {
          if (String(row["TAHUN PILIHAN RAYA"] || "").trim() !== selectedYear) continue;
          if (String(row["JenisCalon"] || "").trim() !== "DUN") continue;
          addWinner(row, "DEWAN UNDANGAN NEGERI");
        }
      }
    }

    // PRK fallback for gaps
    for (const row of prkRows) {
      const kawasan = String(row["PARLIMEN"] || "").trim();
      const dunKawasan = String(row["DEWAN UNDANGAN NEGERI"] || "").trim();
      const namaPR = String(row["NamaPR"] || row["PILIHAN RAYA"] || "").trim();
      const tahun = String(row["TAHUN PILIHAN RAYA"] || "").trim();
      if (layer === "parlimen" && kawasan) {
        addWinner(row, "PARLIMEN", { isPRK: true, prkLabel: namaPR || `PRK ${tahun}` });
      }
      if (layer === "dun" && dunKawasan && dunKawasan !== "-") {
        addWinner(row, "DEWAN UNDANGAN NEGERI", { isPRK: true, prkLabel: namaPR || `PRK ${tahun}` });
      }
    }

    return wMap;
  }, [layer, selectedYear, pruRows, dunRows, prkRows]);

  // Keep selected year when switching layer if it exists in the target layer's options.
  // Bridge "latest" (DUN-only) ↔ "2022" (PRU-only) since both represent the most recent cycle.
  const handleLayerChange = (l: "parlimen" | "dun") => {
    setLayer(l);
    const targetOptions = l === "parlimen" ? PRU_YEARS : DUN_YEARS;
    if (targetOptions.some((y) => y.value === selectedYear)) return;
    if (l === "parlimen" && selectedYear === "latest") setSelectedYear("2022");
    else if (l === "dun" && selectedYear === "2022") setSelectedYear("latest");
    else setSelectedYear(l === "parlimen" ? "2022" : "latest");
  };

  const geojsonData = layer === "parlimen" ? parlimenData : dunData;
  const yearOptions = layer === "parlimen" ? PRU_YEARS : DUN_YEARS;
  const yearLabel = yearOptions.find((y) => y.value === selectedYear)?.label || selectedYear;

  const findWinner = useCallback((feature: Feature): WinnerInfo | undefined => {
    const name = String(feature.properties?.name || "").trim();
    return winnerMap.get(name) || winnerMap.get(normalize(name)) ||
      winnerMap.get(name.replace(/^[PN]\.\s*\d+\s+/i, "").trim().toUpperCase());
  }, [winnerMap]);

  const getStyle = useCallback((feature?: Feature): L.PathOptions => {
    if (!feature) return { fillColor: "#D1D5DB", fillOpacity: 0.3, color: "#fff", weight: 1, opacity: 0.5, dashArray: "5 3" };
    const winner = findWinner(feature);
    if (!winner) return { fillColor: "#D1D5DB", fillOpacity: 0.3, color: "#9CA3AF", weight: 1.5, opacity: 0.6, dashArray: "5 3" };
    if (selectedNegeri) {
      const match = NEGERI_LIST.find((n) => n.slug === selectedNegeri);
      if (match && winner.negeri.toUpperCase() !== match.name.toUpperCase())
        return { fillColor: winner.color, fillOpacity: 0.08, color: "#fff", weight: 0.5, opacity: 0.3 };
    }
    return { fillColor: winner.color, fillOpacity: 0.6, color: "#FFFFFF", weight: 1, opacity: 0.8 };
  }, [findWinner, selectedNegeri]);

  const onEachFeature = useCallback((feature: Feature, leafletLayer: L.Layer) => {
    const path = leafletLayer as L.Path;
    const winner = findWinner(feature);
    const name = String(feature.properties?.name || "");
    const partyLabel = winner ? (winner.coalitionAbbr ? `${winner.coalitionAbbr} (${winner.parti})` : winner.parti) : "";
    const badgeLabel = winner ? (winner.coalitionAbbr || winner.parti) : "";
    // Prefer coalition logo (cleaner branding); fallback to party logo
    const logoSrc = winner ? (getPartiLogo(winner.coalitionAbbr || "") || getPartiLogo(winner.parti)) : null;
    const logoImg = logoSrc ? `<div style="display:flex;justify-content:center;margin-bottom:6px"><img src="${logoSrc}" alt="${badgeLabel}" style="width:40px;height:40px;object-fit:contain"/></div>` : "";
    const popupLogoImg = logoSrc ? `<div style="display:flex;justify-content:center;margin-bottom:8px"><img src="${logoSrc}" alt="${badgeLabel}" style="width:56px;height:56px;object-fit:contain"/></div>` : "";
    path.on({
      mouseover: () => {
        path.setStyle({ fillOpacity: 0.85, weight: 2.5, color: "#FFFFFF" });
        let tip: string;
        if (winner?.isPRK) tip = `${logoImg}<strong>${name}</strong><br/>${winner.calon}<br/><span style="color:${winner.color};font-weight:bold">${partyLabel}</span> — PRK`;
        else if (winner) tip = `${logoImg}<strong>${name}</strong><br/>${winner.calon}<br/><span style="color:${winner.color};font-weight:bold">${partyLabel}</span> — ${winner.undi.toLocaleString()} undi`;
        else tip = `<strong>${name}</strong><br/><em style="color:#9CA3AF">Ditangguhkan / Tiada data</em>`;
        path.bindTooltip(tip, { sticky: true, className: "peta-tooltip", direction: "top" }).openTooltip();
      },
      mouseout: () => { path.setStyle(getStyle(feature)); path.closeTooltip(); },
      click: () => {
        let html: string;
        if (winner?.isPRK) html = `<div style="font-family:DM Sans,sans-serif;min-width:220px">${popupLogoImg}<div style="font-weight:700;font-size:14px;margin-bottom:4px;text-align:center">${name}</div><div style="font-size:12px;color:#666;margin-bottom:8px;text-align:center">${winner.negeri}</div><div style="display:flex;align-items:center;justify-content:center;gap:8px;margin-bottom:6px"><span style="background:${winner.color};color:#fff;padding:2px 8px;border-radius:4px;font-size:11px;font-weight:700">${badgeLabel}</span><span style="font-size:13px;font-weight:600">${winner.calon}</span></div><div style="font-size:12px;color:#444;text-align:center">Parti: <b>${winner.parti}</b> · Undi: <b>${winner.undi.toLocaleString()}</b> · Majoriti: <b>${winner.majoriti.toLocaleString()}</b></div><div style="font-size:11px;color:#F97316;margin-top:6px;font-weight:600;text-align:center">Keputusan melalui ${winner.prkLabel}</div></div>`;
        else if (winner) html = `<div style="font-family:DM Sans,sans-serif;min-width:220px">${popupLogoImg}<div style="font-weight:700;font-size:14px;margin-bottom:4px;text-align:center">${name}</div><div style="font-size:12px;color:#666;margin-bottom:8px;text-align:center">${winner.negeri}</div><div style="display:flex;align-items:center;justify-content:center;gap:8px;margin-bottom:6px"><span style="background:${winner.color};color:#fff;padding:2px 8px;border-radius:4px;font-size:11px;font-weight:700">${badgeLabel}</span><span style="font-size:13px;font-weight:600">${winner.calon}</span></div><div style="font-size:12px;color:#444;text-align:center">Parti: <b>${winner.parti}</b> · Undi: <b>${winner.undi.toLocaleString()}</b> · Majoriti: <b>${winner.majoriti.toLocaleString()}</b></div></div>`;
        else html = `<div style="font-family:DM Sans,sans-serif;min-width:180px"><div style="font-weight:700;font-size:14px;margin-bottom:4px">${name}</div><div style="font-size:12px;color:#9CA3AF;font-style:italic">Kawasan ini ditangguhkan — keputusan melalui PRK</div></div>`;
        (leafletLayer as L.Polygon).bindPopup(html, { className: "peta-popup", maxWidth: 300 }).openPopup();
      },
    });
  }, [findWinner, getStyle]);

  useEffect(() => {
    if (!selectedNegeri || !mapRef.current) return;
    const match = NEGERI_LIST.find((n) => n.slug === selectedNegeri);
    if (!match) return;
    const matching = geojsonData.features.filter((f) => {
      const w = findWinner(f);
      return w && w.negeri.toUpperCase() === match.name.toUpperCase();
    });
    if (matching.length > 0) {
      const fc: FeatureCollection = { type: "FeatureCollection", features: matching };
      const bounds = L.geoJSON(fc).getBounds();
      if (bounds.isValid()) mapRef.current.flyToBounds(bounds, { padding: [40, 40], duration: 0.8 });
    }
  }, [selectedNegeri, geojsonData, findWinner]);

  const geoKey = `${layer}-${selectedYear}-${selectedNegeri}-${winnerMap.size}`;

  // --- Reusable control cards (rendered in desktop sidebar AND mobile bottom sheet) ---
  const renderLayerCard = () => (
    <div className="bg-white border border-spr-border rounded-xl p-3 shadow-lg">
      <div className="text-[10px] font-semibold text-spr-text-muted uppercase tracking-wider mb-2">Paparan Layer</div>
      <div className="flex gap-1">
        {(["parlimen", "dun"] as const).map((l) => (
          <button key={l} onClick={() => handleLayerChange(l)}
            className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all ${layer === l ? "bg-spr-primary text-white" : "bg-spr-bg-secondary text-spr-text-secondary"}`}>
            {l === "parlimen" ? "Parlimen" : "DUN"}
          </button>
        ))}
      </div>
    </div>
  );

  const renderNegeriCard = () => (
    <div className="bg-white border border-spr-border rounded-xl p-3 shadow-lg">
      <div className="text-[10px] font-semibold text-spr-text-muted uppercase tracking-wider mb-2">Tapis Negeri</div>
      <select value={selectedNegeri} onChange={(e) => setSelectedNegeri(e.target.value)}
        className="w-full bg-spr-bg-secondary border border-spr-border rounded-lg px-2.5 py-2 text-xs text-spr-text outline-none cursor-pointer">
        <option value="">Semua Negeri</option>
        {NEGERI_LIST.map((n) => <option key={n.slug} value={n.slug}>{n.name}</option>)}
      </select>
    </div>
  );

  const legendItems = getLegendItems(
    YEAR_TO_PRU[selectedYear] || (selectedYear === "latest" ? "PRU15" : undefined),
    PARTI_COLORS_DASHBOARD,
    COALITION_COLORS,
  );

  const renderLegendCard = () => (
    <div className="bg-white border border-spr-border rounded-xl p-3 shadow-lg">
      <div className="text-[10px] font-semibold text-spr-text-muted uppercase tracking-wider mb-2">Legenda</div>
      <div className="space-y-1.5">
        {legendItems.map((item) => {
          const logo = getPartiLogo(item.abbr);
          return (
            <div key={item.abbr} className="flex items-center gap-2">
              {logo ? (
                <img src={logo} alt={item.abbr} width={16} height={16} className="object-contain rounded-sm shrink-0" />
              ) : (
                <div className="w-3 h-3 rounded-sm shrink-0" style={{ backgroundColor: item.color }} />
              )}
              <span className="text-[11px] text-spr-text-secondary">{item.label}</span>
            </div>
          );
        })}
        <div className="flex items-center gap-2">
          <div
            className="w-3 h-3 rounded-sm shrink-0"
            style={{
              border: "1.5px dashed #9CA3AF",
              backgroundColor: "transparent",
              backgroundImage: "repeating-linear-gradient(45deg, #D1D5DB 0, #D1D5DB 1px, transparent 1px, transparent 3px)",
            }}
          />
          <span className="text-[11px] text-spr-text-secondary">Ditangguhkan / PRK</span>
        </div>
      </div>
    </div>
  );

  if (loading) return (
    <div className="flex items-center justify-center bg-spr-bg-secondary rounded-xl" style={{ height: "calc(100vh - 300px)" }}>
      <div className="text-center">
        <div className="w-12 h-12 border-2 border-spr-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-spr-navy font-semibold mb-1">Memuatkan peta sempadan...</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="flex items-center justify-center bg-spr-bg-secondary rounded-xl py-20">
      <p className="text-spr-navy font-semibold">{error}</p>
    </div>
  );

  return (
    <div className="relative rounded-xl overflow-hidden border border-spr-border" style={{ height: "calc(100vh - 300px)" }}>
      <MapContainer center={[4.5, 108.0]} zoom={7} minZoom={6} maxZoom={14}
        maxBounds={[[0.0, 95.0], [9.0, 122.0]]} maxBoundsViscosity={1.0}
        className="h-full w-full" style={{ background: "#0A0A1A" }} zoomControl={false}>
        <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://carto.com/">CARTO</a> | Data: SPR Malaysia' />
        {geojsonData.features.length > 0 && (
          <GeoJSON key={geoKey} data={geojsonData} style={getStyle} onEachFeature={onEachFeature} />
        )}
        <FitMalaysia onReady={(m) => { mapRef.current = m; }} />
      </MapContainer>

      {/* Year pills — top center (horizontal scroll on mobile) */}
      <div className="absolute top-4 left-4 right-16 sm:left-1/2 sm:right-auto sm:-translate-x-1/2 z-[1000]">
        <div className="flex items-center gap-1.5 bg-white/95 backdrop-blur-sm border border-spr-border rounded-full px-2 py-1.5 shadow-lg overflow-x-auto no-scrollbar">
          {yearOptions.map((y) => (
            <button key={y.value} onClick={() => setSelectedYear(y.value)}
              className={`shrink-0 px-3 py-1.5 rounded-full text-[11px] font-medium transition-all whitespace-nowrap ${
                selectedYear === y.value
                  ? "bg-[#E8740C] text-white"
                  : "text-spr-text-secondary hover:text-[#E8740C]"
              }`}>
              {y.label}
            </button>
          ))}
        </div>
      </div>

      {/* Mobile: open-controls FAB (top-right) */}
      <button
        type="button"
        onClick={() => setControlsOpen(true)}
        aria-label="Buka tetapan peta"
        className="md:hidden absolute top-4 right-4 z-[1000] w-11 h-11 rounded-full bg-white shadow-lg border border-spr-border flex items-center justify-center text-spr-primary"
      >
        <SlidersHorizontal className="w-5 h-5" />
      </button>

      {/* Desktop sidebar controls — top left, hidden on mobile */}
      <div className="hidden md:block absolute top-16 left-4 z-[1000] w-[220px] space-y-3">
        {renderLayerCard()}
        {renderNegeriCard()}
        {renderLegendCard()}
      </div>

      {/* Footer label */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-[1000] bg-white/90 backdrop-blur-sm border border-spr-border rounded-full px-4 py-1.5 shadow">
        <span className="text-xs text-spr-text-muted">
          Layer: {layer === "parlimen" ? "Parlimen" : "DUN"} — {yearLabel}
        </span>
      </div>

      {/* Mobile bottom sheet with all controls */}
      <div
        className={`md:hidden fixed inset-0 z-[1100] ${controlsOpen ? "pointer-events-auto" : "pointer-events-none"}`}
        aria-hidden={!controlsOpen}
      >
        <div
          onClick={() => setControlsOpen(false)}
          className={`absolute inset-0 bg-black/50 transition-opacity duration-200 ${controlsOpen ? "opacity-100" : "opacity-0"}`}
        />
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Tetapan peta"
          className={`absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl shadow-2xl max-h-[85vh] overflow-y-auto transform transition-transform duration-300 ${controlsOpen ? "translate-y-0" : "translate-y-full"}`}
        >
          {/* Drag handle */}
          <div className="flex justify-center pt-3 pb-1">
            <div className="w-10 h-1 rounded-full bg-spr-border" />
          </div>
          <div className="flex items-center justify-between px-5 pb-3">
            <h3 className="font-display text-base font-semibold text-spr-navy">Tetapan Peta</h3>
            <button
              type="button"
              onClick={() => setControlsOpen(false)}
              aria-label="Tutup tetapan"
              className="w-8 h-8 rounded-full bg-spr-bg-secondary flex items-center justify-center text-spr-text-muted hover:text-spr-text"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="px-5 pb-6 space-y-3">
            {renderLayerCard()}
            {renderNegeriCard()}
            {renderLegendCard()}
          </div>
        </div>
      </div>

      <style jsx global>{`
        .peta-tooltip { background:#fff !important; border:1px solid #E2E2EA !important; color:#1A1A2E !important; border-radius:8px !important; font-family:DM Sans,sans-serif !important; font-size:12px !important; padding:6px 12px !important; box-shadow:0 4px 16px rgba(0,0,0,0.15) !important; }
        .peta-tooltip::before { border-top-color:#fff !important; }
        .peta-popup .leaflet-popup-content-wrapper { background:#fff; border:1px solid #E2E2EA; border-radius:12px; box-shadow:0 8px 24px rgba(0,0,0,0.15); }
        .peta-popup .leaflet-popup-tip { background:#fff; }
        .peta-popup .leaflet-popup-close-button { color:#8A8AA0 !important; }
      `}</style>
    </div>
  );
}
