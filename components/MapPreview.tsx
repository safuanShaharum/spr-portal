"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, GeoJSON, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import JSZip from "jszip";
import { kml } from "@mapbox/togeojson";
import { MAP_CONFIG } from "@/lib/constants";
import type { Feature, FeatureCollection } from "geojson";

interface MapPreviewProps {
  fileUrl: string;
  format: string;
}

function FitBounds({ geojson }: { geojson: FeatureCollection }) {
  const map = useMap();
  useEffect(() => {
    if (geojson.features.length > 0) {
      const layer = L.geoJSON(geojson);
      const bounds = layer.getBounds();
      if (bounds.isValid()) {
        map.fitBounds(bounds, { padding: [30, 30] });
      }
    }
  }, [geojson, map]);
  return null;
}

export default function MapPreview({ fileUrl, format }: MapPreviewProps) {
  const [geojson, setGeojson] = useState<FeatureCollection | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function parseGeoData() {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch(fileUrl);
        if (!res.ok) throw new Error("Gagal memuat turun fail");
        const buffer = await res.arrayBuffer();

        let kmlString: string;

        if (format.toUpperCase() === "KMZ") {
          const zip = await JSZip.loadAsync(buffer);
          const kmlFile =
            zip.file("doc.kml") ||
            zip.file(/\.kml$/i)[0];
          if (!kmlFile) throw new Error("Fail KML tidak dijumpai dalam KMZ");
          kmlString = await kmlFile.async("string");
        } else {
          kmlString = new TextDecoder().decode(buffer);
        }

        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(kmlString, "text/xml");
        const converted = kml(xmlDoc) as FeatureCollection;

        if (!cancelled) {
          setGeojson(converted);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Fail tidak dapat dibaca");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    parseGeoData();
    return () => { cancelled = true; };
  }, [fileUrl, format]);

  const onEachFeature = (feature: Feature, layer: L.Layer) => {
    const props = feature.properties || {};
    const name = props.name || props.Name || props.NAME || "—";
    const kod = props.kod || props.code || props.CODE || "";
    const negeri = props.negeri || props.state || props.STATE || "";
    const luas = props.luas || props.area || "";

    (layer as L.Path).on({
      mouseover: (e) => {
        const target = e.target as L.Path;
        target.setStyle({
          fillColor: "#00D4AA",
          fillOpacity: 0.35,
          weight: 2.5,
          color: "#00D4AA",
        });
        target.bindTooltip(name, {
          sticky: true,
          className: "map-tooltip",
        }).openTooltip();
      },
      mouseout: (e) => {
        const target = e.target as L.Path;
        target.setStyle({
          fillColor: "#581CDC",
          fillOpacity: 0.2,
          weight: 1.5,
          color: "#7B4FE0",
        });
        target.closeTooltip();
      },
    });

    const popupHtml = `
      <div style="font-family:DM Sans,sans-serif;color:#E8E6F0;min-width:160px">
        <div style="font-weight:700;font-size:14px;margin-bottom:6px">${name}</div>
        ${kod ? `<div style="font-size:12px;color:#9B97B0">Kod: <span style="color:#E8E6F0">${kod}</span></div>` : ""}
        ${negeri ? `<div style="font-size:12px;color:#9B97B0">Negeri: <span style="color:#E8E6F0">${negeri}</span></div>` : ""}
        ${luas ? `<div style="font-size:12px;color:#9B97B0">Luas: <span style="color:#E8E6F0">${luas} km²</span></div>` : ""}
      </div>
    `;
    (layer as L.Path).bindPopup(popupHtml, {
      className: "dark-popup",
      closeButton: true,
    });
  };

  const geoStyle: L.PathOptions = {
    fillColor: "#581CDC",
    fillOpacity: 0.2,
    color: "#7B4FE0",
    weight: 1.5,
  };

  if (loading) {
    return (
      <div className="h-[400px] bg-spr-surface rounded-xl animate-pulse flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-2 border-spr-primary border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-spr-text-muted text-sm">Memproses fail {format.toUpperCase()}...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-[400px] bg-spr-surface rounded-xl flex items-center justify-center">
        <div className="text-center">
          <div className="w-14 h-14 rounded-2xl bg-spr-danger/10 flex items-center justify-center mx-auto mb-3">
            <svg width="24" height="24" fill="none" stroke="#FF6B6B" strokeWidth="1.5" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" />
              <path d="M15 9l-6 6M9 9l6 6" strokeLinecap="round" />
            </svg>
          </div>
          <h3 className="text-spr-text font-semibold mb-1">Peta tidak dapat dimuatkan</h3>
          <p className="text-spr-text-muted text-sm">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="h-[400px] rounded-xl overflow-hidden border border-spr-border">
        <MapContainer
          center={MAP_CONFIG.center}
          zoom={MAP_CONFIG.zoom}
          className="h-full w-full"
          style={{ background: "#0A0A1A" }}
        >
          <TileLayer
            url={MAP_CONFIG.tileUrl}
            attribution={MAP_CONFIG.tileAttribution}
          />
          {geojson && (
            <>
              <GeoJSON
                data={geojson}
                style={geoStyle}
                onEachFeature={onEachFeature}
              />
              <FitBounds geojson={geojson} />
            </>
          )}
        </MapContainer>
      </div>
      <style jsx global>{`
        .dark-popup .leaflet-popup-content-wrapper {
          background: #12122A;
          border: 1px solid rgba(88,28,220,0.25);
          border-radius: 12px;
          box-shadow: 0 8px 24px rgba(0,0,0,0.4);
        }
        .dark-popup .leaflet-popup-tip {
          background: #12122A;
          border: 1px solid rgba(88,28,220,0.25);
        }
        .dark-popup .leaflet-popup-close-button {
          color: #9B97B0 !important;
        }
        .map-tooltip {
          background: #12122A !important;
          border: 1px solid rgba(88,28,220,0.25) !important;
          color: #E8E6F0 !important;
          border-radius: 8px !important;
          font-family: DM Sans, sans-serif !important;
          font-size: 12px !important;
          padding: 4px 10px !important;
          box-shadow: 0 4px 12px rgba(0,0,0,0.3) !important;
        }
        .map-tooltip::before {
          border-top-color: #12122A !important;
        }
      `}</style>
    </div>
  );
}
