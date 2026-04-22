import type { FeatureCollection } from "geojson";

/**
 * Sample parliamentary constituency boundaries for development.
 * Simplified polygons around Selangor / KL / Putrajaya area.
 * Replace with real KMZ-parsed data in production.
 */
export const SAMPLE_PARLIMEN: FeatureCollection = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      properties: {
        name: "Gombak",
        kod_parlimen: "P.098",
        nama_parlimen: "Gombak",
        kod_negeri: "SGR",
        nama_negeri: "Selangor",
        luas_km2: 246,
      },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [101.62, 3.30], [101.70, 3.32], [101.75, 3.28],
            [101.76, 3.22], [101.72, 3.18], [101.65, 3.17],
            [101.60, 3.20], [101.58, 3.25], [101.62, 3.30],
          ],
        ],
      },
    },
    {
      type: "Feature",
      properties: {
        name: "Petaling Jaya",
        kod_parlimen: "P.105",
        nama_parlimen: "Petaling Jaya",
        kod_negeri: "SGR",
        nama_negeri: "Selangor",
        luas_km2: 32,
      },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [101.60, 3.12], [101.66, 3.14], [101.68, 3.10],
            [101.67, 3.06], [101.62, 3.04], [101.58, 3.06],
            [101.57, 3.10], [101.60, 3.12],
          ],
        ],
      },
    },
    {
      type: "Feature",
      properties: {
        name: "Subang",
        kod_parlimen: "P.104",
        nama_parlimen: "Subang",
        kod_negeri: "SGR",
        nama_negeri: "Selangor",
        luas_km2: 73,
      },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [101.52, 3.14], [101.58, 3.16], [101.60, 3.12],
            [101.57, 3.08], [101.52, 3.06], [101.48, 3.08],
            [101.47, 3.12], [101.52, 3.14],
          ],
        ],
      },
    },
    {
      type: "Feature",
      properties: {
        name: "Kepong",
        kod_parlimen: "P.100",
        nama_parlimen: "Kepong",
        kod_negeri: "WP",
        nama_negeri: "WP Kuala Lumpur",
        luas_km2: 28,
      },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [101.64, 3.22], [101.70, 3.23], [101.72, 3.18],
            [101.70, 3.15], [101.65, 3.14], [101.62, 3.17],
            [101.64, 3.22],
          ],
        ],
      },
    },
    {
      type: "Feature",
      properties: {
        name: "Lembah Pantai",
        kod_parlimen: "P.103",
        nama_parlimen: "Lembah Pantai",
        kod_negeri: "WP",
        nama_negeri: "WP Kuala Lumpur",
        luas_km2: 19,
      },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [101.66, 3.14], [101.72, 3.15], [101.74, 3.11],
            [101.72, 3.08], [101.68, 3.07], [101.65, 3.09],
            [101.66, 3.14],
          ],
        ],
      },
    },
    {
      type: "Feature",
      properties: {
        name: "Putrajaya",
        kod_parlimen: "P.125",
        nama_parlimen: "Putrajaya",
        kod_negeri: "PJY",
        nama_negeri: "WP Putrajaya",
        luas_km2: 49,
      },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [101.66, 2.96], [101.72, 2.98], [101.74, 2.94],
            [101.72, 2.90], [101.68, 2.88], [101.64, 2.90],
            [101.63, 2.94], [101.66, 2.96],
          ],
        ],
      },
    },
    {
      type: "Feature",
      properties: {
        name: "Shah Alam",
        kod_parlimen: "P.108",
        nama_parlimen: "Shah Alam",
        kod_negeri: "SGR",
        nama_negeri: "Selangor",
        luas_km2: 68,
      },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [101.48, 3.10], [101.55, 3.12], [101.57, 3.08],
            [101.55, 3.03], [101.50, 3.01], [101.45, 3.03],
            [101.44, 3.07], [101.48, 3.10],
          ],
        ],
      },
    },
    {
      type: "Feature",
      properties: {
        name: "Klang",
        kod_parlimen: "P.110",
        nama_parlimen: "Klang",
        kod_negeri: "SGR",
        nama_negeri: "Selangor",
        luas_km2: 56,
      },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [101.42, 3.05], [101.48, 3.06], [101.50, 3.01],
            [101.48, 2.97], [101.43, 2.95], [101.39, 2.97],
            [101.38, 3.01], [101.42, 3.05],
          ],
        ],
      },
    },
  ],
};

export const SAMPLE_DUN: FeatureCollection = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      properties: {
        name: "Kota Damansara",
        kod_dun: "N.30",
        nama_dun: "Kota Damansara",
        kod_parlimen: "P.105",
        nama_parlimen: "Petaling Jaya",
        kod_negeri: "SGR",
        nama_negeri: "Selangor",
        luas_km2: 11,
      },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [101.58, 3.14], [101.63, 3.15], [101.65, 3.12],
            [101.63, 3.09], [101.59, 3.08], [101.57, 3.10],
            [101.58, 3.14],
          ],
        ],
      },
    },
    {
      type: "Feature",
      properties: {
        name: "Bukit Gasing",
        kod_dun: "N.31",
        nama_dun: "Bukit Gasing",
        kod_parlimen: "P.105",
        nama_parlimen: "Petaling Jaya",
        kod_negeri: "SGR",
        nama_negeri: "Selangor",
        luas_km2: 8,
      },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [101.63, 3.12], [101.68, 3.13], [101.69, 3.10],
            [101.67, 3.07], [101.64, 3.06], [101.62, 3.08],
            [101.63, 3.12],
          ],
        ],
      },
    },
    {
      type: "Feature",
      properties: {
        name: "Subang Jaya",
        kod_dun: "N.32",
        nama_dun: "Subang Jaya",
        kod_parlimen: "P.104",
        nama_parlimen: "Subang",
        kod_negeri: "SGR",
        nama_negeri: "Selangor",
        luas_km2: 15,
      },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [101.53, 3.10], [101.58, 3.11], [101.59, 3.08],
            [101.57, 3.05], [101.53, 3.04], [101.50, 3.06],
            [101.50, 3.09], [101.53, 3.10],
          ],
        ],
      },
    },
    {
      type: "Feature",
      properties: {
        name: "Kinrara",
        kod_dun: "N.33",
        nama_dun: "Kinrara",
        kod_parlimen: "P.104",
        nama_parlimen: "Subang",
        kod_negeri: "SGR",
        nama_negeri: "Selangor",
        luas_km2: 12,
      },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [101.50, 3.06], [101.55, 3.07], [101.56, 3.04],
            [101.54, 3.01], [101.50, 3.00], [101.47, 3.02],
            [101.48, 3.05], [101.50, 3.06],
          ],
        ],
      },
    },
    {
      type: "Feature",
      properties: {
        name: "Seri Setia",
        kod_dun: "N.34",
        nama_dun: "Seri Setia",
        kod_parlimen: "P.108",
        nama_parlimen: "Shah Alam",
        kod_negeri: "SGR",
        nama_negeri: "Selangor",
        luas_km2: 14,
      },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [101.47, 3.08], [101.52, 3.09], [101.53, 3.06],
            [101.51, 3.03], [101.47, 3.02], [101.44, 3.04],
            [101.44, 3.07], [101.47, 3.08],
          ],
        ],
      },
    },
  ],
};

/** Quick-zoom presets */
export const REGION_PRESETS = [
  { label: "Semenanjung", center: [4.0, 102.5] as [number, number], zoom: 7 },
  { label: "Sabah", center: [5.5, 117.5] as [number, number], zoom: 8 },
  { label: "Sarawak", center: [2.5, 111.5] as [number, number], zoom: 8 },
];
