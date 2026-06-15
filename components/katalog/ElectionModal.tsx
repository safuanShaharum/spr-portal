"use client";

import { useMemo } from "react";
import useSWR from "swr";
import { PARTI_COLORS } from "@/lib/katalog-data";
import { getPartiLogo } from "@/lib/parti-logo";
import { getCatalogData } from "@/lib/catalog";
import type { CatalogData } from "@/types/catalog";

interface Candidate {
  nama: string;
  parti: string;
  parti_penuh: string;
  undi: number;
  peratusan: number;
  isWinner: boolean;
}

interface Props {
  row: Record<string, unknown>;
  sheetSlug?: string;
  onClose: () => void;
}

// Parent components still pass the legacy /api/katalog sheet keys; map them to
// the catalog JSON slugs published by the build-time converter.
const SLUG_MAP: Record<string, string> = {
  "keputusan-pru": "keputusan-pru",
  "keputusan-dun": "keputusan-pru-dun",
  "keputusan-prk": "keputusan-prk",
};

export default function ElectionModal({ row, sheetSlug, onClose }: Props) {
  // ---- Determine context from sheetSlug ----
  const isPRK = sheetSlug === "keputusan-prk";
  const isDUN = sheetSlug === "keputusan-dun";

  // ---- Build display values from clicked row ----
  const kawasan = isDUN
    ? String(row["DEWAN UNDANGAN NEGERI"] || "")
    : String(row["PARLIMEN"] || "");

  const negeri = String(row["NEGERI"] || "");
  const namaPR = String(row["NamaPR"] || row["NAMA PILIHANRAYA"] || row["PILIHAN RAYA"] || "");
  const tahun = String(row["TAHUN PILIHAN RAYA"] || "");
  const majoriti = Number(row["MAJORITI"]) || 0;

  const jenis = isPRK ? "PRK" : isDUN ? "DUN" : "PARLIMEN";

  // ---- Fetch full sheet via SWR (cached across modal opens for the session) ----
  const catalogSlug = sheetSlug ? SLUG_MAP[sheetSlug] : undefined;
  const { data: allRows, isLoading } = useSWR<CatalogData>(
    catalogSlug ?? null,
    (slug: string) => getCatalogData(slug)
  );

  // ---- Filter to the candidates for this kawasan / event ----
  const { candidates, undiDitolak, pemilihBerdaftar } = useMemo(() => {
    if (!allRows || !kawasan) {
      return { candidates: [] as Candidate[], undiDitolak: 0, pemilihBerdaftar: 0 };
    }

    let rows = allRows.filter((r) => {
      const v = isDUN
        ? String(r["DEWAN UNDANGAN NEGERI"] || "")
        : String(r["PARLIMEN"] || "");
      return v === kawasan;
    });

    if (sheetSlug === "keputusan-pru") {
      rows = rows.filter((r) => String(r["JenisCalon"] || "").toLowerCase() === "parlimen");
    }

    if (tahun) {
      rows = rows.filter((r) => {
        for (const col of ["TAHUN PILIHAN RAYA", "TAHUN", "Tahun", "TahunPilihanraya"]) {
          const val = String(r[col] || "");
          if (val && val.includes(tahun)) return true;
        }
        return false;
      });
    }

    let eventRows = rows;
    if (isPRK && namaPR) {
      const filtered = rows.filter(
        (r) => String(r["NamaPR"] || r["PILIHAN RAYA"] || "") === namaPR
      );
      if (filtered.length > 0) eventRows = filtered;
    }

    eventRows = eventRows.slice(0, 50);

    const winnerRow = eventRows.find((r) => {
      const s = String(r["StatusCalon"] || r["STATUS"] || "").toUpperCase();
      return s === "MNG" || s === "MENANG";
    });

    const pemilih = Number(winnerRow?.["JumlahPemilih"] || 0);
    const ditolak = Number(winnerRow?.["UNDI DITOLAK"] || 0);

    const mapped: Candidate[] = eventRows.map((r) => {
      const status = String(r["StatusCalon"] || r["STATUS"] || "").toUpperCase();
      return {
        nama: String(r["NAMA ATAS KERTAS UNDI"] || r["NAMA KERTAS UNDI"] || r["NAMA PENUH CALON"] || ""),
        parti: String(r["SINGKATAN NAMA PARTI BERTANDING"] || ""),
        parti_penuh: String(r["NAMA PARTI BERTANDING"] || ""),
        undi: Number(r["BILANGAN UNDI"]) || 0,
        peratusan: 0,
        isWinner: status === "MNG" || status === "MENANG",
      };
    });

    const totalVotes = mapped.reduce((s, c) => s + c.undi, 0);
    for (const c of mapped) {
      c.peratusan = totalVotes > 0
        ? parseFloat(((c.undi / totalVotes) * 100).toFixed(1))
        : 0;
    }
    mapped.sort((a, b) => b.undi - a.undi);

    return {
      candidates: mapped,
      undiDitolak: isNaN(ditolak) ? 0 : ditolak,
      pemilihBerdaftar: isNaN(pemilih) ? 0 : pemilih,
    };
  }, [allRows, kawasan, sheetSlug, tahun, isDUN, isPRK, namaPR]);

  const loading = catalogSlug ? isLoading : false;

  // ---- Derived stats ----
  const winner = candidates.find((c) => c.isWinner);
  const totalUndi = candidates.reduce((s, c) => s + c.undi, 0);
  const jumlahMengundi = totalUndi + undiDitolak;
  const peratusanKeluar = pemilihBerdaftar > 0
    ? parseFloat(((jumlahMengundi / pemilihBerdaftar) * 100).toFixed(1))
    : 0;

  const handleDownloadCsv = () => {
    const esc = (v: unknown) => {
      const s = String(v ?? "");
      return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
    };
    const rows: string[] = [];
    rows.push(["Jenis", "Negeri", "Pilihan Raya", "Tahun", "Kawasan"].map(esc).join(","));
    rows.push([jenis, negeri, namaPR, tahun, kawasan].map(esc).join(","));
    rows.push("");
    rows.push(["Pemilih Berdaftar", "Jumlah Mengundi", "Peratusan Keluar (%)", "Undi Ditolak", "Majoriti"].map(esc).join(","));
    rows.push([pemilihBerdaftar, jumlahMengundi, peratusanKeluar, undiDitolak, majoriti].map(esc).join(","));
    rows.push("");
    rows.push(["Kedudukan", "Calon", "Parti", "Nama Parti Penuh", "Undi", "Peratusan (%)", "Status"].map(esc).join(","));
    candidates.forEach((c, i) => {
      rows.push([
        i + 1,
        c.nama,
        c.parti,
        c.parti_penuh,
        c.undi,
        c.peratusan,
        c.isWinner ? "Menang" : "Kalah",
      ].map(esc).join(","));
    });

    const csv = "﻿" + rows.join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const safe = (s: string) => s.replace(/[^a-z0-9]+/gi, "-").replace(/^-|-$/g, "").toLowerCase();
    const filename = `keputusan-${safe(jenis)}-${safe(kawasan)}-${safe(namaPR || tahun) || "data"}.csv`;

    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      <div
        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-[640px] max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute top-4 right-4 p-2 rounded-lg hover:bg-spr-bg-secondary text-spr-text-muted z-10">
          <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 4 4 14M4 4l10 10" strokeLinecap="round" /></svg>
        </button>

        <div className="p-6 sm:p-8">
          {/* Breadcrumb */}
          <div className="text-xs text-spr-text-muted mb-2">
            {jenis} · {negeri} · {namaPR || tahun}
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-spr-navy mb-6 pr-8">{kawasan}</h2>

          {loading ? (
            <div className="py-12 text-center">
              <div className="w-8 h-8 border-2 border-spr-primary border-t-transparent rounded-full animate-spin mx-auto mb-3" />
              <p className="text-spr-text-muted text-sm">Memuatkan data calon...</p>
            </div>
          ) : (
            <>
              {/* Stats row */}
              <div className="grid grid-cols-3 gap-3 mb-6">
                <div className="bg-spr-bg-secondary rounded-xl p-3 text-center">
                  <div className="text-[11px] text-spr-text-muted mb-1">Pemilih Berdaftar</div>
                  <div className="text-lg font-bold text-spr-navy">
                    {pemilihBerdaftar > 0 ? pemilihBerdaftar.toLocaleString() : "—"}
                  </div>
                </div>
                <div className="bg-spr-bg-secondary rounded-xl p-3 text-center">
                  <div className="text-[11px] text-spr-text-muted mb-1">Jumlah Mengundi</div>
                  <div className="text-lg font-bold text-spr-navy">
                    {jumlahMengundi > 0 ? jumlahMengundi.toLocaleString() : "—"}
                  </div>
                </div>
                <div className="bg-spr-bg-secondary rounded-xl p-3 text-center">
                  <div className="text-[11px] text-spr-text-muted mb-1">Peratusan Keluar</div>
                  <div className="text-lg font-bold text-spr-navy">
                    {peratusanKeluar > 0 && peratusanKeluar <= 100 ? `${peratusanKeluar}%` : "—"}
                  </div>
                </div>
              </div>

              {/* Winner card */}
              {winner && (
                <div className="border border-spr-border rounded-xl p-4 mb-6 flex items-center gap-4">
                  {getPartiLogo(winner.parti) ? (
                    <img src={getPartiLogo(winner.parti)!} alt={winner.parti} width={40} height={40} className="object-contain rounded-sm shrink-0" />
                  ) : (
                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0" style={{ backgroundColor: PARTI_COLORS[winner.parti] || "#6B7280" }}>
                      {winner.parti.slice(0, 2)}
                    </div>
                  )}
                  <div className="flex-1">
                    <div className="text-sm font-semibold text-spr-navy">{winner.parti_penuh || winner.parti}</div>
                    <div className="text-xs text-spr-text-secondary">{winner.nama}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-[11px] text-spr-text-muted">Majoriti</div>
                    <div className="text-lg font-bold text-[#059669]">{majoriti > 0 ? majoriti.toLocaleString() : "—"}</div>
                  </div>
                </div>
              )}

              {/* Keputusan Undi */}
              {candidates.length > 0 && (
                <div className="mb-6">
                  <div className="text-xs font-semibold text-spr-text-muted uppercase tracking-wider mb-3">Keputusan Undi</div>
                  <div className="border border-spr-border rounded-xl overflow-hidden">
                    {candidates.map((c, i) => {
                      const color = PARTI_COLORS[c.parti] || "#6B7280";
                      return (
                        <div key={i} className={`p-4 ${i > 0 ? "border-t border-spr-border-light" : ""}`}>
                          <div className="flex items-center gap-3 mb-2">
                            {getPartiLogo(c.parti) ? (
                              <img src={getPartiLogo(c.parti)!} alt={c.parti} width={32} height={32} className="object-contain rounded-sm shrink-0" />
                            ) : (
                              <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-[10px] font-bold shrink-0" style={{ backgroundColor: color }}>
                                {c.parti.slice(0, 2)}
                              </div>
                            )}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-semibold text-spr-navy">{c.nama}</span>
                                {c.isWinner && <span className="text-[#059669] text-sm font-bold">✓</span>}
                              </div>
                              <div className="text-xs text-spr-text-muted">{c.parti_penuh || c.parti}</div>
                            </div>
                            <div className="text-right shrink-0">
                              <div className="text-sm font-bold text-spr-navy">{c.undi.toLocaleString()}</div>
                              <div className="text-xs text-spr-text-muted">{c.peratusan}%</div>
                            </div>
                          </div>
                          <div className="h-2 bg-spr-bg-secondary rounded-full overflow-hidden">
                            <div className="h-full rounded-full" style={{ width: `${Math.min(c.peratusan, 100)}%`, backgroundColor: color }} />
                          </div>
                        </div>
                      );
                    })}
                    {undiDitolak > 0 && (
                      <div className="p-4 border-t border-spr-border-light flex items-center justify-between">
                        <span className="text-sm text-spr-text-muted">Undi Ditolak</span>
                        <span className="text-sm font-semibold text-spr-text-secondary">{undiDitolak.toLocaleString()}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Senarai Calon pills */}
              {candidates.length > 0 && (
                <div className="mb-6">
                  <div className="text-xs font-semibold text-spr-text-muted uppercase tracking-wider mb-3">Senarai Calon</div>
                  <div className="flex flex-wrap gap-2">
                    {candidates.map((c, i) => (
                      <span key={i} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-spr-bg-secondary rounded-full text-xs">
                        {getPartiLogo(c.parti) ? (
                          <img src={getPartiLogo(c.parti)!} alt={c.parti} width={16} height={16} className="object-contain rounded-sm" />
                        ) : (
                          <span className="w-4 h-4 rounded-full text-white text-[8px] font-bold flex items-center justify-center" style={{ backgroundColor: PARTI_COLORS[c.parti] || "#6B7280" }}>
                            {c.parti.slice(0, 1)}
                          </span>
                        )}
                        <span className="text-spr-text-secondary">{c.nama}</span>
                        <span className="font-bold text-spr-text-muted">{c.parti}</span>
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {candidates.length === 0 && (
                <div className="py-8 text-center text-spr-text-muted text-sm">
                  Tiada data calon untuk kawasan ini.
                </div>
              )}
            </>
          )}

          {/* Buttons */}
          <div className="flex items-center gap-3 mt-4">
            <button
              type="button"
              onClick={handleDownloadCsv}
              disabled={loading || candidates.length === 0}
              className="flex-1 py-3 bg-spr-navy text-white rounded-xl text-sm font-semibold hover:bg-spr-navy/90 transition-colors inline-flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Muat Turun CSV
            </button>
            <button onClick={onClose} className="px-6 py-3 border border-spr-border rounded-xl text-sm font-medium text-spr-text-secondary hover:bg-spr-bg-secondary transition-colors">
              Tutup
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
