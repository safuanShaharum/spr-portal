import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";

export const metadata: Metadata = {
  title: "Dasar Keselamatan | Portal Data Terbuka SPR",
  description:
    "Dasar keselamatan maklumat dan kawalan akses bagi Portal Data Terbuka Suruhanjaya Pilihan Raya Malaysia.",
};

export default function DasarKeselamatanPage() {
  return (
    <div>
      <PageHeader
        breadcrumb={[
          { label: "Utama", href: "/" },
          { label: "Dasar Keselamatan" },
        ]}
        title="Dasar Keselamatan"
        subtitle="Langkah keselamatan maklumat yang dilaksanakan bagi melindungi integriti data dan pengguna Portal Data Terbuka SPR."
      />

      <article className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-10 py-12 space-y-10 text-spr-ink/85 leading-relaxed">
        <section>
          <h2 className="display-serif text-2xl font-semibold text-spr-ink mb-3">
            1. Komitmen Keselamatan
          </h2>
          <p>
            Portal Data Terbuka SPR dilaksanakan berlandaskan Rangka Kerja
            Keselamatan Siber Kerajaan (RAKKSSA) dan Dasar Keselamatan ICT
            Sektor Awam yang ditetapkan oleh NACSA dan Unit Pemodenan Tadbiran
            dan Perancangan Pengurusan Malaysia (MAMPU). SPR komited
            melindungi kerahsiaan, integriti dan ketersediaan data yang
            diuruskan melalui portal ini.
          </p>
        </section>

        <section>
          <h2 className="display-serif text-2xl font-semibold text-spr-ink mb-3">
            2. Kawalan Teknikal
          </h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              Penghantaran data disulitkan menggunakan <strong>TLS 1.2</strong>{" "}
              ke atas atau versi lebih tinggi.
            </li>
            <li>
              Pemantauan lalu lintas berterusan bagi mengesan percubaan akses
              tanpa kebenaran, serangan penafian perkhidmatan (DDoS) dan
              kelemahan aplikasi.
            </li>
            <li>
              Tampalan keselamatan sistem dan kebergantungan perisian dikemas
              kini secara berkala mengikut jadual penyelenggaraan.
            </li>
            <li>
              Sandaran (backup) dataset dilakukan secara automatik dan
              disimpan di infrastruktur berasingan.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="display-serif text-2xl font-semibold text-spr-ink mb-3">
            3. Kawalan Akses
          </h2>
          <p>
            Capaian ke sistem pentadbiran portal dikawal melalui prinsip
            <em> least privilege</em> dan pengesahan dua faktor (2FA).
            Semua aktiviti pentadbir direkodkan dalam log audit yang tidak
            boleh diubah suai bagi tujuan siasatan sekiranya berlaku insiden.
          </p>
        </section>

        <section>
          <h2 className="display-serif text-2xl font-semibold text-spr-ink mb-3">
            4. Tanggungjawab Pengguna
          </h2>
          <p className="mb-3">
            Pengguna portal bertanggungjawab untuk:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              Tidak cuba menembusi, mengganggu atau memintas sistem
              keselamatan portal.
            </li>
            <li>
              Tidak menggunakan skrip automatik (scraper) yang membebankan
              pelayan tanpa kebenaran. Akses program disarankan melalui
              endpoint JSON rasmi dengan kadar yang munasabah.
            </li>
            <li>
              Melaporkan sebarang kelemahan keselamatan yang ditemui melalui
              saluran rasmi, dan tidak mendedahkan kelemahan tersebut kepada
              umum sebelum ia dibaiki.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="display-serif text-2xl font-semibold text-spr-ink mb-3">
            5. Pelaporan Insiden
          </h2>
          <p>
            Sebarang insiden keselamatan siber yang disyaki atau dikesan hendaklah
            dilaporkan dengan segera kepada{" "}
            <a
              href="mailto:keselamatan@spr.gov.my"
              className="text-spr-purple hover:underline"
            >
              keselamatan@spr.gov.my
            </a>{" "}
            atau Pusat Respons Keselamatan Siber Kebangsaan (MyCERT) di{" "}
            <a
              href="https://www.mycert.org.my"
              target="_blank"
              rel="noopener noreferrer"
              className="text-spr-purple hover:underline"
            >
              www.mycert.org.my
            </a>
            . Laporan akan diuruskan secara sulit.
          </p>
        </section>

        <section>
          <h2 className="display-serif text-2xl font-semibold text-spr-ink mb-3">
            6. Penambahbaikan Berterusan
          </h2>
          <p>
            SPR menjalankan penilaian risiko, ujian penembusan (penetration
            testing) dan audit keselamatan secara berkala bagi memastikan
            kawalan kekal berkesan selari dengan ancaman terkini.
          </p>
        </section>

        <section className="border-t border-spr-ink/10 pt-6">
          <p className="text-sm text-spr-ink/60">
            Dasar ini dibaca bersama dengan{" "}
            <a href="/dasar-privasi" className="text-spr-purple hover:underline">
              Dasar Privasi
            </a>{" "}
            dan{" "}
            <a href="/penafian" className="text-spr-purple hover:underline">
              Penafian
            </a>{" "}
            portal ini.
          </p>
        </section>
      </article>
    </div>
  );
}
