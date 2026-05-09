"use client";

import { useState } from "react";
import Link from "next/link";

interface CategoryData {
  slug: string;
  label: string;
  color: string;
  featured: { title: string; description: string; count: number };
  datasets: string[];
}

const CATEGORIES: CategoryData[] = [
  {
    slug: "perjalanan-pilihan-raya",
    label: "Perjalanan Pilihan Raya",
    color: "#FF8C42",
    featured: {
      title: "Keputusan Pilihan Raya Umum ke-15 (PRU-15)",
      description:
        "Data lengkap keputusan PRU-15 termasuk undi popular, majoriti, pengundi keluar mengundi dan keputusan mengikut kawasan parlimen.",
      count: 9,
    },
    datasets: [
      "Senarai Calon PRU-15 Mengikut Parlimen",
      "Keputusan PRK 2023-2024",
      "Statistik Pengundi Pos & Awal PRU-15",
      "Penyata Belanja Pilihan Raya",
    ],
  },
  {
    slug: "pendaftaran-pemilih",
    label: "Pendaftaran Pemilih",
    color: "#3B82F6",
    featured: {
      title: "Statistik Pemilih Berdaftar 2022",
      description:
        "Data pemilih berdaftar mengikut negeri, parlimen, DUN, jantina dan kumpulan umur untuk tempoh suku tahun terkini.",
      count: 6,
    },
    datasets: [
      "Pemilih Mengikut Negeri dan Jantina",
      "Pemilih Mengikut Kumpulan Umur",
      "Pemilih Baharu Selepas Undi18",
      "Trend Pendaftaran Pemilih 2008-2022",
    ],
  },
  {
    slug: "persempadanan",
    label: "Persempadanan",
    color: "#EF4444",
    featured: {
      title: "Sempadan Parlimen & DUN Malaysia",
      description:
        "Data geospatial lengkap sempadan 222 kawasan parlimen dan 600 DUN seluruh Malaysia dalam format KMZ.",
      count: 4,
    },
    datasets: [
      "Statistik PM/PPC/PPRU Mengikut DUN",
      "Peta Sempadan Parlimen (KMZ)",
      "Statistik KSP Mengikut Negeri",
    ],
  },
  {
    slug: "perundangan",
    label: "Perundangan",
    color: "#22C55E",
    featured: {
      title: "Peraturan Pilihan Raya Malaysia",
      description:
        "Kompilasi undang-undang dan peraturan berkaitan pilihan raya termasuk Akta Pilihan Raya dan Peraturan-Peraturan.",
      count: 3,
    },
    datasets: [
      "Akta Pilihan Raya 1958",
      "Peraturan Pilihan Raya (Penjalanan)",
    ],
  },
  {
    slug: "pentadbiran-pengurusan",
    label: "Pentadbiran & Pengurusan",
    color: "#7B4FE0",
    featured: {
      title: "Bajet Pilihan Raya Mengikut Tahun",
      description:
        "Pecahan bajet dan perbelanjaan SPR mengikut tahun, negeri dan kategori perbelanjaan dari 2008 hingga 2024.",
      count: 3,
    },
    datasets: [
      "Perbelanjaan PRU Mengikut Negeri",
      "Statistik Kakitangan SPR",
    ],
  },
  {
    slug: "pemantauan-operasi",
    label: "Kesalahan Pilihan Raya",
    color: "#00D4AA",
    featured: {
      title: "Laporan Aduan Pilihan Raya",
      description:
        "Bilangan aduan dan laporan kesalahan pilihan raya yang diterima oleh SPR mengikut kawasan dan kategori.",
      count: 2,
    },
    datasets: [
      "Statistik Aduan Mengikut Kategori",
    ],
  },
  {
    slug: "dasar-antarabangsa",
    label: "Dasar Antarabangsa",
    color: "#F59E0B",
    featured: {
      title: "Pemerhati Pilihan Raya Antarabangsa",
      description:
        "Bilangan pemerhati pilihan raya dari organisasi tempatan dan antarabangsa yang memantau PRU sejak 1959.",
      count: 2,
    },
    datasets: [
      "Senarai Organisasi Pemerhati",
    ],
  },
];

export default function TerokaDataset() {
  const [activeIdx, setActiveIdx] = useState(0);
  const active = CATEGORIES[activeIdx];

  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-10">
          <h2 className="font-display text-[32px] font-bold text-spr-text mb-3">
            Terokai Dataset
          </h2>
          <p className="text-base text-spr-text-secondary max-w-lg mx-auto">
            Pilih kategori untuk mula meneroka data pilihan raya Malaysia
          </p>
        </div>

        {/* Category pills */}
        <div className="flex flex-wrap justify-center gap-2.5 mb-12">
          {CATEGORIES.map((cat, i) => (
            <button
              key={cat.slug}
              onClick={() => setActiveIdx(i)}
              className={`flex items-center gap-2.5 px-5 py-2.5 rounded-full text-[14px] font-medium border transition-all duration-200 ${
                activeIdx === i
                  ? "bg-spr-primary text-white border-spr-primary shadow-md shadow-spr-primary/20"
                  : "bg-spr-bg-secondary text-spr-text border-spr-border hover:bg-spr-primary-50 hover:border-spr-primary/30 hover:text-spr-primary"
              }`}
            >
              <span
                className="w-2 h-2 rounded-full shrink-0"
                style={{
                  backgroundColor: activeIdx === i ? "#fff" : cat.color,
                }}
              />
              {cat.label}
            </button>
          ))}
        </div>

        {/* Content area */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Left — Featured card (3/5) */}
          <div className="lg:col-span-3">
            <div className="bg-spr-bg-secondary rounded-2xl p-8 h-full flex flex-col hover:shadow-lg hover:shadow-black/5 transition-all duration-200">
              <span
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold w-fit mb-5"
                style={{
                  backgroundColor: active.color + "18",
                  color: active.color,
                }}
              >
                <span
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ backgroundColor: active.color }}
                />
                {active.label}
              </span>

              <h3 className="text-xl font-semibold text-spr-text mb-3 leading-snug">
                {active.featured.title}
              </h3>
              <p className="text-[14px] text-spr-text-secondary leading-relaxed mb-8 flex-1">
                {active.featured.description}
              </p>

              <div className="flex items-center justify-between">
                <span className="text-sm text-spr-text-muted">
                  {active.featured.count} dataset tersedia
                </span>
                <Link
                  href={`/katalog?category=${active.slug}`}
                  className="text-sm font-medium text-spr-primary hover:underline"
                >
                  Lihat semua →
                </Link>
              </div>
            </div>
          </div>

          {/* Right — Dataset list (2/5) */}
          <div className="lg:col-span-2">
            <div className="space-y-0">
              {active.datasets.map((title, i) => (
                <Link
                  key={i}
                  href={`/katalog?category=${active.slug}`}
                  className="flex items-center gap-3 py-4 group border-b border-spr-border-light last:border-b-0 hover:px-3 hover:bg-spr-bg-secondary hover:rounded-xl transition-all duration-200"
                >
                  <span
                    className="w-2 h-2 rounded-full shrink-0"
                    style={{ backgroundColor: active.color }}
                  />
                  <span className="text-[14px] text-spr-text group-hover:text-spr-primary transition-colors flex-1">
                    {title}
                  </span>
                  <svg
                    width="16"
                    height="16"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="text-spr-text-muted group-hover:text-spr-primary transition-colors shrink-0"
                    viewBox="0 0 24 24"
                  >
                    <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
