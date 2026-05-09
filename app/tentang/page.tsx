import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";

export const metadata: Metadata = {
  title: "Tentang Kami | Portal Data Terbuka SPR",
  description:
    "Latar belakang, mandat dan objektif Portal Data Terbuka Suruhanjaya Pilihan Raya Malaysia.",
};

export default function TentangPage() {
  return (
    <div>
      <PageHeader
        breadcrumb={[
          { label: "Utama", href: "/" },
          { label: "Tentang Kami" },
        ]}
        title="Tentang Kami"
        subtitle="Portal Data Terbuka Suruhanjaya Pilihan Raya Malaysia — satu platform rasmi untuk akses data pilihan raya secara telus dan terbuka."
      />

      <article className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-10 py-12 space-y-10 text-spr-ink/85 leading-relaxed">
        <section>
          <h2 className="display-serif text-2xl font-semibold text-spr-ink mb-3">
            Mengenai SPR
          </h2>
          <p>
            Suruhanjaya Pilihan Raya Malaysia (SPR) adalah badan berkanun yang
            ditubuhkan di bawah Perkara 114 Perlembagaan Persekutuan. SPR
            bertanggungjawab mengurus dan menjalankan pilihan raya umum, pilihan
            raya kecil, serta penyelenggaraan daftar pemilih secara bebas, adil
            dan telus di seluruh Malaysia.
          </p>
        </section>

        <section>
          <h2 className="display-serif text-2xl font-semibold text-spr-ink mb-3">
            Tujuan Portal
          </h2>
          <p className="mb-3">
            Portal Data Terbuka SPR diwujudkan untuk:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              Mempertingkatkan <strong>ketelusan</strong> pengurusan pilihan
              raya melalui perkongsian data rasmi secara terbuka.
            </li>
            <li>
              Memudahkan <strong>akses orang awam</strong>, pengkaji, media
              dan NGO kepada dataset pilihan raya yang boleh dipercayai.
            </li>
            <li>
              Menyokong budaya <strong>data-driven</strong> dalam membuat
              keputusan dasar, penyelidikan akademik dan penulisan berita.
            </li>
            <li>
              Memenuhi aspirasi kerajaan terhadap inisiatif Data Terbuka
              Malaysia (data.gov.my).
            </li>
          </ul>
        </section>

        <section>
          <h2 className="display-serif text-2xl font-semibold text-spr-ink mb-3">
            Skop Data
          </h2>
          <p>
            Portal ini mengandungi lapan kategori utama data pilihan raya
            termasuk keputusan PRU/PRK, pendaftaran pemilih, persempadanan
            kawasan, perundangan, pentadbiran, kesalahan pilihan raya, pemerhati
            pilihan raya dan program pendidikan pengundi.
            Rujuk{" "}
            <Link href="/katalog" className="text-spr-purple hover:underline">
              Katalog Data
            </Link>{" "}
            untuk senarai lengkap.
          </p>
        </section>

        <section>
          <h2 className="display-serif text-2xl font-semibold text-spr-ink mb-3">
            Komitmen Kami
          </h2>
          <p>
            SPR komited untuk mengemas kini dataset selepas setiap peristiwa
            pilihan raya, menyediakan data dalam format terbuka (CSV, JSON,
            GeoJSON) dan memastikan setiap maklumat yang diterbitkan telah
            disahkan oleh unit teknikal berkenaan.
          </p>
        </section>

        <section className="border-t border-spr-ink/10 pt-6">
          <p className="text-sm text-spr-ink/60">
            Untuk maklumat rasmi lain mengenai SPR, sila lawati{" "}
            <a
              href="https://www.spr.gov.my"
              className="text-spr-purple hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              www.spr.gov.my
            </a>
            .
          </p>
        </section>
      </article>
    </div>
  );
}
