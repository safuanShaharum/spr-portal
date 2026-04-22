"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { MapContainer, TileLayer, GeoJSON, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import JSZip from "jszip";
import { kml } from "@mapbox/togeojson";
import Link from "next/link";
import { MAP_CONFIG, NEGERI_LIST } from "@/lib/constants";
import { REGION_PRESETS } from "@/lib/sample-geojson";
import type { Feature, FeatureCollection } from "geojson";

const KMZ_DATASET_ID = 11;

const EMPTY_FC: FeatureCollection = { type: "FeatureCollection", features: [] };

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface ConstituencyProps {
  name?: string;
  kod_parlimen?: string;
  nama_parlimen?: string;
  kod_dun?: string;
  nama_dun?: string;
  kod_negeri?: string;
  nama_negeri?: string;
  luas_km2?: number;
  [key: string]: unknown;
}

type LayerType = "parlimen" | "dun";

/* ------------------------------------------------------------------ */
/*  Styles                                                             */
/* ------------------------------------------------------------------ */

const PARLIMEN_STYLE: L.PathOptions = {
  fillColor: "#581CDC",
  fillOpacity: 0.2,
  color: "#7B4FE0",
  weight: 1,
  opacity: 0.8,
};

const DUN_STYLE: L.PathOptions = {
  fillColor: "#00D4AA",
  fillOpacity: 0.2,
  color: "#00B894",
  weight: 1,
  opacity: 0.8,
};

const hoverStyle: L.PathOptions = {
  fillOpacity: 0.4,
  weight: 2.5,
  color: "#FFFFFF",
};

const selectedStyle: L.PathOptions = {
  fillOpacity: 0.5,
  weight: 3,
  color: "#FFFFFF",
};

const PARLIMEN_DIM: L.PathOptions = {
  fillColor: "#581CDC",
  fillOpacity: 0.03,
  color: "#7B4FE0",
  weight: 0.5,
  opacity: 0.2,
};

const DUN_DIM: L.PathOptions = {
  fillColor: "#00D4AA",
  fillOpacity: 0.03,
  color: "#00B894",
  weight: 0.5,
  opacity: 0.2,
};

/* ------------------------------------------------------------------ */
/*  KML description HTML parser                                        */
/* ------------------------------------------------------------------ */

function parseDescriptionHtml(html: string): Record<string, string> {
  const result: Record<string, string> = {};
  if (!html) return result;
  // Match <td>KEY</td><td>VALUE</td> pairs (various whitespace)
  const regex = /<td[^>]*>\s*(.*?)\s*<\/td>\s*<td[^>]*>\s*(.*?)\s*<\/td>/gi;
  let match;
  while ((match = regex.exec(html)) !== null) {
    const key = match[1].replace(/<[^>]*>/g, "").trim();
    const val = match[2].replace(/<[^>]*>/g, "").trim();
    if (key && val) result[key] = val;
  }
  return result;
}

function enrichFeature(feature: Feature): Feature {
  const props = feature.properties || {};
  const name: string = props.name || "";
  const desc = parseDescriptionHtml(props.description || "");

  // Determine if PARLIMEN or DUN from name pattern
  const isParlimen = /^P\.\s*\d+/i.test(name);
  const isDun = /^N\.\s*\d+/i.test(name);

  // Extract code and clean name: "P.054 GERIK" → kod="P.054", nama="GERIK"
  const codeParts = name.match(/^([PN]\.\s*\d+)\s+(.+)/i);
  const code = codeParts ? codeParts[1].replace(/\s/g, "") : "";
  const cleanName = codeParts ? codeParts[2].trim() : name;

  // Try to get negeri and luas from description table or direct props
  const negeri =
    desc["NAMA_NEGERI"] || desc["Nama Negeri"] || desc["nama_negeri"] ||
    desc["NEGERI"] || desc["Negeri"] || props.nama_negeri || "";
  const luasStr =
    desc["LUAS_KM2"] || desc["Luas"] || desc["LUAS"] || desc["luas_km2"] ||
    desc["Shape_Area"] || props.luas_km2 || "";
  const luas = luasStr ? parseFloat(String(luasStr)) : undefined;

  const enriched: ConstituencyProps = {
    ...props,
    name: cleanName || name,
  };

  if (isParlimen) {
    enriched.kod_parlimen = code;
    enriched.nama_parlimen = cleanName || name;
  } else if (isDun) {
    enriched.kod_dun = code;
    enriched.nama_dun = cleanName || name;
    // Try to find parlimen parent from description
    const parCode = desc["KOD_PARLIMEN"] || desc["Kod Parlimen"] || "";
    const parName = desc["NAMA_PARLIMEN"] || desc["Nama Parlimen"] || "";
    if (parCode) enriched.kod_parlimen = parCode;
    if (parName) enriched.nama_parlimen = parName;
  }

  if (negeri) enriched.nama_negeri = negeri;
  if (luas && !isNaN(luas)) enriched.luas_km2 = Math.round(luas * 100) / 100;

  return { ...feature, properties: enriched };
}

/* ------------------------------------------------------------------ */
/*  Map controller                                                     */
/* ------------------------------------------------------------------ */

function MapController({
  flyTo,
  onMapReady,
}: {
  flyTo: { center: [number, number]; zoom: number } | null;
  onMapReady: (map: L.Map) => void;
}) {
  const map = useMap();

  useEffect(() => {
    onMapReady(map);
    map.fitBounds(
      [[0.8, 99.5], [7.5, 119.5]],
      { padding: [20, 20] }
    );
  }, [map, onMapReady]);

  useEffect(() => {
    if (flyTo) {
      map.flyTo(flyTo.center, flyTo.zoom, { duration: 1.2 });
    }
  }, [flyTo, map]);

  return null;
}

/* ------------------------------------------------------------------ */
/*  Main Component                                                     */
/* ------------------------------------------------------------------ */

export default function InteractiveMap() {
  const [activeLayer, setActiveLayer] = useState<LayerType>("parlimen");
  const [selectedFeature, setSelectedFeature] = useState<ConstituencyProps | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [selectedNegeri, setSelectedNegeri] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [flyTo, setFlyTo] = useState<{ center: [number, number]; zoom: number } | null>(null);

  // Data state
  const [parlimenData, setParlimenData] = useState<FeatureCollection>(EMPTY_FC);
  const [dunData, setDunData] = useState<FeatureCollection>(EMPTY_FC);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const mapRef = useRef<L.Map | null>(null);
  const geoJsonRef = useRef<L.GeoJSON | null>(null);
  const selectedLayerRef = useRef<L.Path | null>(null);

  /* ---- Fetch & parse KMZ on mount ---- */
  useEffect(() => {
    let cancelled = false;

    async function loadKmz() {
      try {
        setLoading(true);
        setError(null);

        // Fetch KMZ via Next.js proxy to avoid CORS
        const kmzRes = await fetch(`/api/proxy-file?dataset_id=${KMZ_DATASET_ID}`);
        if (!kmzRes.ok) throw new Error("Gagal memuat turun fail KMZ");
        const buffer = await kmzRes.arrayBuffer();

        // Step 3: Extract KML from KMZ (ZIP)
        const zip = await JSZip.loadAsync(buffer);
        const kmlFile = zip.file("doc.kml") || zip.file(/\.kml$/i)[0];
        if (!kmlFile) throw new Error("Fail KML tidak dijumpai dalam KMZ");
        const kmlString = await kmlFile.async("string");

        // Step 4: Parse KML → GeoJSON
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(kmlString, "text/xml");
        const allGeoJson = kml(xmlDoc) as FeatureCollection;

        if (cancelled) return;

        // Step 5: Enrich features and separate into Parlimen / DUN
        const parlimen: Feature[] = [];
        const dun: Feature[] = [];

        for (const feature of allGeoJson.features) {
          const enriched = enrichFeature(feature);
          const name: string = (feature.properties?.name || "").trim();

          if (/^P\.\s*\d+/i.test(name)) {
            parlimen.push(enriched);
          } else if (/^N\.\s*\d+/i.test(name)) {
            dun.push(enriched);
          } else {
            // Default to parlimen if pattern unclear
            parlimen.push(enriched);
          }
        }

        setParlimenData({ type: "FeatureCollection", features: parlimen });
        setDunData({ type: "FeatureCollection", features: dun });
      } catch (err) {
        if (!cancelled) {
          console.error("KMZ load error:", err);
          setError(err instanceof Error ? err.message : "Gagal memuatkan data");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadKmz();
    return () => { cancelled = true; };
  }, []);

  const geojsonData = activeLayer === "parlimen" ? parlimenData : dunData;

  /* ---- Search results ---- */
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase();
    return geojsonData.features
      .filter((f) => {
        const p = f.properties as ConstituencyProps;
        const name = (p.nama_parlimen || p.nama_dun || p.name || "").toLowerCase();
        const code = (p.kod_parlimen || p.kod_dun || "").toLowerCase();
        return name.includes(q) || code.includes(q);
      })
      .slice(0, 8);
  }, [searchQuery, geojsonData]);

  /* ---- Layer-specific styles ---- */
  const baseStyle = activeLayer === "parlimen" ? PARLIMEN_STYLE : DUN_STYLE;
  const dimStyleForLayer = activeLayer === "parlimen" ? PARLIMEN_DIM : DUN_DIM;

  /* ---- Helpers ---- */
  const clearSelection = useCallback(() => {
    if (selectedLayerRef.current) {
      selectedLayerRef.current.setStyle(baseStyle);
      selectedLayerRef.current = null;
    }
    setSelectedFeature(null);
    setSidebarOpen(false);
  }, [baseStyle]);

  const selectFeature = useCallback(
    (feature: Feature, layer: L.Path) => {
      if (selectedLayerRef.current) {
        selectedLayerRef.current.setStyle(baseStyle);
      }
      layer.setStyle(selectedStyle);
      selectedLayerRef.current = layer;

      const props = feature.properties as ConstituencyProps;
      setSelectedFeature(props);
      setSidebarOpen(true);

      if (mapRef.current) {
        const bounds = (layer as L.Polygon).getBounds();
        if (bounds.isValid()) {
          mapRef.current.flyToBounds(bounds, {
            padding: [80, 80],
            maxZoom: 12,
            duration: 0.8,
          });
        }
      }
    },
    [baseStyle]
  );

  const handleSearchSelect = useCallback(
    (feature: Feature) => {
      setSearchQuery("");
      setSearchOpen(false);
      if (geoJsonRef.current) {
        geoJsonRef.current.eachLayer((layer) => {
          const f = (layer as unknown as { feature: Feature }).feature;
          if (f === feature) {
            selectFeature(feature, layer as L.Path);
          }
        });
      }
    },
    [selectFeature]
  );

  /* ---- GeoJSON handlers ---- */
  const getStyle = useCallback(
    (feature?: Feature) => {
      if (!selectedNegeri || !feature) return baseStyle;
      const negeri = (feature.properties as ConstituencyProps).nama_negeri || "";
      const negeriEntry = NEGERI_LIST.find((n) => n.slug === selectedNegeri);
      if (negeriEntry && negeri !== negeriEntry.name) {
        return dimStyleForLayer;
      }
      return baseStyle;
    },
    [selectedNegeri, baseStyle, dimStyleForLayer]
  );

  const onEachFeature = useCallback(
    (feature: Feature, layer: L.Layer) => {
      const path = layer as L.Path;
      const props = feature.properties as ConstituencyProps;
      const displayName = props.nama_parlimen || props.nama_dun || props.name || "—";
      const code = props.kod_parlimen || props.kod_dun || "";

      path.on({
        mouseover: () => {
          if (selectedLayerRef.current !== path) {
            path.setStyle(hoverStyle);
          }
          path
            .bindTooltip(
              `<strong>${displayName}</strong>${code ? `<br/><span style="opacity:0.7">${code}</span>` : ""}`,
              { sticky: true, className: "map-tooltip", direction: "top" }
            )
            .openTooltip();
        },
        mouseout: () => {
          if (selectedLayerRef.current !== path) {
            path.setStyle(getStyle(feature));
          }
          path.closeTooltip();
        },
        click: () => {
          selectFeature(feature, path);
        },
      });
    },
    [getStyle, selectFeature]
  );

  /* ---- Handle negeri change ---- */
  useEffect(() => {
    if (!selectedNegeri) return;
    const negeriEntry = NEGERI_LIST.find((n) => n.slug === selectedNegeri);
    if (!negeriEntry) return;

    const matching = geojsonData.features.filter(
      (f) => (f.properties as ConstituencyProps).nama_negeri === negeriEntry.name
    );
    if (matching.length > 0) {
      const fc: FeatureCollection = { type: "FeatureCollection", features: matching };
      const layer = L.geoJSON(fc);
      const bounds = layer.getBounds();
      if (bounds.isValid() && mapRef.current) {
        mapRef.current.flyToBounds(bounds, { padding: [60, 60], duration: 1 });
      }
    }
  }, [selectedNegeri, geojsonData]);

  /* ---- Reset selection on layer change ---- */
  useEffect(() => {
    clearSelection();
  }, [activeLayer, clearSelection]);

  const geoKey = `${activeLayer}-${selectedNegeri}-${geojsonData.features.length}`;

  /* ---- Loading overlay ---- */
  if (loading) {
    return (
      <div
        className="relative w-full flex items-center justify-center bg-white/80 backdrop-blur-sm"
        style={{ height: "calc(100vh - 64px)" }}
      >
        <div className="text-center">
          <div className="w-14 h-14 border-2 border-spr-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-spr-navy font-semibold mb-1">Memuatkan data sempadan...</p>
          <p className="text-spr-navy-muted text-sm">
            Memproses 222 Parlimen & 600 DUN boundaries
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="relative w-full flex items-center justify-center bg-white/80 backdrop-blur-sm"
        style={{ height: "calc(100vh - 64px)" }}
      >
        <div className="text-center max-w-sm">
          <div className="w-14 h-14 rounded-2xl bg-spr-danger/10 flex items-center justify-center mx-auto mb-4">
            <svg width="28" height="28" fill="none" stroke="#FF6B6B" strokeWidth="1.5" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" />
              <path d="M15 9l-6 6M9 9l6 6" strokeLinecap="round" />
            </svg>
          </div>
          <p className="text-spr-navy font-semibold mb-1">Gagal memuatkan peta</p>
          <p className="text-spr-navy-muted text-sm">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full" style={{ height: "calc(100vh - 64px)" }}>
      <MapContainer
        center={[4.5, 108.0]}
        zoom={7}
        minZoom={7}
        maxZoom={14}
        maxBounds={[
          [0.0, 95.0],
          [9.0, 122.0],
        ]}
        maxBoundsViscosity={1.0}
        className="h-full w-full"
        style={{ background: "#0A0A1A" }}
        zoomControl={false}
      >
        <TileLayer
          url={MAP_CONFIG.tileUrl}
          attribution='&copy; <a href="https://carto.com/">CARTO</a> | Data: SPR Malaysia'
        />
        {geojsonData.features.length > 0 && (
          <GeoJSON
            key={geoKey}
            data={geojsonData}
            style={getStyle}
            onEachFeature={onEachFeature}
            ref={(ref) => {
              geoJsonRef.current = ref ?? null;
            }}
          />
        )}
        <MapController
          flyTo={flyTo}
          onMapReady={(m) => {
            mapRef.current = m;
          }}
        />
      </MapContainer>

      {/* ========== Feature count badge ========== */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[1000]">
        <div className="bg-white border border-spr-border rounded-full px-4 py-1.5 shadow-xl shadow-black/30">
          <span className="text-spr-navy-muted text-xs">
            <span className="text-spr-navy font-semibold">
              {geojsonData.features.length}
            </span>{" "}
            {activeLayer === "parlimen" ? "kawasan parlimen" : "kawasan DUN"} dimuatkan
          </span>
        </div>
      </div>

      {/* ========== Search Panel (top-left) ========== */}
      <div className="absolute top-14 left-4 z-[1000] w-[280px] sm:w-[320px]">
        <div className="relative">
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-spr-navy-muted">
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="7" cy="7" r="5" />
              <path d="m11 11 3.5 3.5" strokeLinecap="round" />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Cari kawasan..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setSearchOpen(true);
            }}
            onFocus={() => setSearchOpen(true)}
            className="w-full bg-white border border-spr-border rounded-xl pl-10 pr-4 py-3 text-sm text-spr-navy placeholder:text-spr-navy-muted outline-none focus:border-spr-primary/50 transition-colors shadow-xl shadow-black/30"
          />
        </div>

        {searchOpen && searchResults.length > 0 && (
          <div className="mt-1 bg-white border border-spr-border rounded-xl overflow-hidden shadow-xl shadow-black/30 max-h-72 overflow-y-auto">
            {searchResults.map((f, i) => {
              const p = f.properties as ConstituencyProps;
              const name = p.nama_parlimen || p.nama_dun || p.name || "";
              const code = p.kod_parlimen || p.kod_dun || "";
              return (
                <button
                  key={i}
                  onClick={() => handleSearchSelect(f)}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-left hover:bg-spr-bg-secondary transition-colors"
                >
                  <span className="text-spr-navy text-sm font-medium">{name}</span>
                  {code && (
                    <span className="text-spr-navy-muted text-xs ml-auto">{code}</span>
                  )}
                </button>
              );
            })}
          </div>
        )}

        <div className="mt-2">
          <select
            value={selectedNegeri}
            onChange={(e) => setSelectedNegeri(e.target.value)}
            className="w-full bg-white border border-spr-border rounded-xl px-4 py-2.5 text-sm text-spr-navy-muted outline-none focus:border-spr-primary/50 transition-colors cursor-pointer shadow-xl shadow-black/30 appearance-none"
          >
            <option value="">Semua Negeri</option>
            {NEGERI_LIST.map((n) => (
              <option key={n.slug} value={n.slug}>
                {n.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* ========== Layer Control (top-right) ========== */}
      <div className="absolute top-14 right-4 z-[1000]">
        <div className="bg-white border border-spr-border rounded-xl p-3 shadow-xl shadow-black/30">
          <div className="flex items-center gap-1 bg-spr-bg-secondary rounded-lg p-0.5 mb-3">
            <button
              onClick={() => setActiveLayer("parlimen")}
              className={`px-4 py-2 rounded-md text-xs font-semibold transition-all ${
                activeLayer === "parlimen"
                  ? "bg-spr-primary text-spr-navy"
                  : "text-spr-navy-muted hover:text-spr-navy"
              }`}
            >
              Parlimen
            </button>
            <button
              onClick={() => setActiveLayer("dun")}
              className={`px-4 py-2 rounded-md text-xs font-semibold transition-all ${
                activeLayer === "dun"
                  ? "bg-spr-primary text-spr-navy"
                  : "text-spr-navy-muted hover:text-spr-navy"
              }`}
            >
              DUN
            </button>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <div
                className="w-5 h-2 rounded"
                style={{
                  backgroundColor:
                    activeLayer === "parlimen"
                      ? "rgba(88,28,220,0.4)"
                      : "rgba(0,212,170,0.35)",
                  border: `1px solid ${activeLayer === "parlimen" ? "#7B4FE0" : "#00B894"}`,
                }}
              />
              <span className="text-[10px] text-spr-navy-muted">
                {activeLayer === "parlimen" ? "Parlimen" : "DUN"}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-5 h-2 rounded bg-white/30 border border-white" />
              <span className="text-[10px] text-spr-navy-muted">Hover / Dipilih</span>
            </div>
          </div>
        </div>
      </div>

      {/* ========== Quick Zoom (bottom-left) ========== */}
      <div className="absolute bottom-6 left-4 z-[1000]">
        <div className="flex items-center gap-1.5">
          {REGION_PRESETS.map((r) => (
            <button
              key={r.label}
              onClick={() => setFlyTo({ center: r.center, zoom: r.zoom })}
              className="px-3 py-2 bg-white border border-spr-border rounded-lg text-xs font-medium text-spr-navy-muted hover:text-spr-navy hover:border-spr-primary/50 transition-all shadow-lg shadow-black/30"
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      {/* ========== Info Sidebar / Bottom Sheet ========== */}
      {sidebarOpen && selectedFeature && (
        <>
          <div className="hidden sm:block absolute top-0 right-0 bottom-0 w-[360px] z-[1000] bg-white border-l border-spr-border shadow-xl overflow-y-auto animate-slide-in-right">
            <SidebarContent feature={selectedFeature} onClose={clearSelection} />
          </div>
          <div className="sm:hidden absolute bottom-0 left-0 right-0 z-[1000] max-h-[50vh] bg-white border-t border-spr-border shadow-xl rounded-t-2xl overflow-y-auto animate-slide-in-up">
            <SidebarContent feature={selectedFeature} onClose={clearSelection} />
          </div>
        </>
      )}

      <style jsx global>{`
        .map-tooltip {
          background: #fff !important;
          border: 1px solid #E2E2EA !important;
          color: #1A1A2E !important;
          border-radius: 8px !important;
          font-family: DM Sans, sans-serif !important;
          font-size: 12px !important;
          padding: 6px 12px !important;
          box-shadow: 0 4px 16px rgba(0,0,0,0.4) !important;
        }
        .map-tooltip::before {
          border-top-color: #fff !important;
        }
        .leaflet-control-attribution {
          background: rgba(10,10,26,0.8) !important;
          color: #6B6880 !important;
          font-size: 10px !important;
        }
        .leaflet-control-attribution a {
          color: #7B4FE0 !important;
        }
        @keyframes slideInRight {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
        @keyframes slideInUp {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
        .animate-slide-in-right {
          animation: slideInRight 0.3s ease-out forwards;
        }
        .animate-slide-in-up {
          animation: slideInUp 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Sidebar Content                                                    */
/* ------------------------------------------------------------------ */

function SidebarContent({
  feature,
  onClose,
}: {
  feature: ConstituencyProps;
  onClose: () => void;
}) {
  const displayName =
    feature.nama_parlimen || feature.nama_dun || feature.name || "—";
  const code = feature.kod_parlimen || feature.kod_dun || "";
  const negeri = feature.nama_negeri || "";
  const luas = feature.luas_km2;

  return (
    <div className="p-6">
      <button
        onClick={onClose}
        className="absolute top-4 right-4 p-2 rounded-lg hover:bg-spr-bg-secondary text-spr-navy-muted hover:text-spr-navy transition-colors"
      >
        <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M14 4 4 14M4 4l10 10" strokeLinecap="round" />
        </svg>
      </button>

      <h2 className="font-display text-2xl font-bold text-spr-navy pr-10 mb-3">
        {displayName}
      </h2>

      {code && (
        <span className="inline-flex items-center px-3 py-1 rounded-full bg-spr-primary-50 text-spr-primary text-xs font-bold mb-4">
          {code}
        </span>
      )}

      <div className="space-y-3 mb-6">
        {negeri && (
          <div className="flex items-center gap-3">
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-spr-navy-muted shrink-0" viewBox="0 0 24 24">
              <path d="M9 20l-5.447-2.724A1 1 0 0 1 3 16.382V5.618a1 1 0 0 1 1.447-.894L9 7m0 13l6-3m-6 3V7m6 10l5.447 2.724A1 1 0 0 0 21 18.382V7.618a1 1 0 0 0-.553-.894L15 4m0 13V4m0 0L9 7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <div>
              <div className="text-[11px] text-spr-navy-muted uppercase tracking-wider">Negeri</div>
              <div className="text-sm text-spr-navy font-medium">{negeri}</div>
            </div>
          </div>
        )}
        {luas != null && (
          <div className="flex items-center gap-3">
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-spr-navy-muted shrink-0" viewBox="0 0 24 24">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
            </svg>
            <div>
              <div className="text-[11px] text-spr-navy-muted uppercase tracking-wider">Keluasan</div>
              <div className="text-sm text-spr-navy font-medium">
                {typeof luas === "number" ? luas.toLocaleString() : luas} km²
              </div>
            </div>
          </div>
        )}
        {feature.nama_parlimen && feature.kod_dun && (
          <div className="flex items-center gap-3">
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-spr-navy-muted shrink-0" viewBox="0 0 24 24">
              <path d="M3 21h18M3 7v1a3 3 0 0 0 6 0V7m0 1a3 3 0 0 0 6 0V7m0 1a3 3 0 0 0 6 0V7H3l2-4h14l2 4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <div>
              <div className="text-[11px] text-spr-navy-muted uppercase tracking-wider">Parlimen</div>
              <div className="text-sm text-spr-navy font-medium">
                {feature.nama_parlimen} ({feature.kod_parlimen})
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="h-px bg-spr-border mb-6" />

      <div className="mb-6">
        <h3 className="text-sm font-semibold text-spr-navy mb-3">Dataset Berkaitan</h3>
        <div className="space-y-2">
          <div className="p-3 bg-spr-bg-secondary border border-spr-border rounded-lg">
            <div className="text-xs text-spr-navy-muted">Sempadan {displayName}</div>
            <div className="text-[11px] text-spr-navy-muted mt-1">KMZ · Geospatial</div>
          </div>
          <div className="p-3 bg-spr-bg-secondary border border-spr-border rounded-lg">
            <div className="text-xs text-spr-navy-muted">
              Statistik Pengundi {displayName}
            </div>
            <div className="text-[11px] text-spr-navy-muted mt-1">XLSX · Statistik</div>
          </div>
        </div>
      </div>

      <Link
        href={`/katalog?negeri=${encodeURIComponent(
          NEGERI_LIST.find((n) => n.name === negeri)?.slug || negeri
        )}`}
        className="flex items-center justify-center gap-2 w-full py-3 bg-spr-primary hover:bg-spr-primary-dark text-spr-navy rounded-xl font-semibold text-sm transition-colors"
      >
        <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M13 2v7h7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        Lihat Data
      </Link>
    </div>
  );
}
