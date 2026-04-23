import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";

export const metadata: Metadata = {
  title: "Penafian | Portal Data Terbuka SPR",
  description:
    "Penafian rasmi berkaitan penggunaan Portal Data Terbuka Suruhanjaya Pilihan Raya Malaysia.",
};

export default function PenafianPage() {
  return (
    <div>
      <PageHeader
        breadcrumb={[
          { label: "Utama", href: "/" },
          { label: "Penafian" },
        ]}
        title="Penafian"
        subtitle="Terma penafian bagi maklumat dan data yang disediakan melalui Portal Data Terbuka Suruhanjaya Pilihan Raya Malaysia (SPR)."
      />

      <article className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-10 py-12 space-y-10 text-spr-ink/85 leading-relaxed">
        <section>
          <h2 className="display-serif text-2xl font-semibold text-spr-ink mb-3">
            1. Umum
          </h2>
          <p>
            Maklumat yang disediakan di Portal Data Terbuka SPR ini adalah untuk
            tujuan rujukan umum dan ketelusan pentadbiran pilihan raya. Walaupun
            segala usaha dilaksanakan untuk memastikan kandungan adalah tepat,
            terkini dan lengkap, SPR tidak membuat sebarang jaminan tersurat
            atau tersirat berkenaan ketepatan, kesempurnaan atau kesesuaian
            maklumat bagi sebarang tujuan tertentu.
          </p>
        </section>

        <section>
          <h2 className="display-serif text-2xl font-semibold text-spr-ink mb-3">
            2. Penggunaan Data
          </h2>
          <p className="mb-3">
            Dataset yang diterbitkan di portal ini merangkumi keputusan pilihan
            raya, statistik pemilih, persempadanan bahagian pilihan raya,
            pemantauan dan dokumen berkaitan. Pengguna dinasihatkan untuk:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              Merujuk kepada sumber rasmi SPR sebelum membuat apa-apa keputusan
              penting berasaskan data yang diperolehi.
            </li>
            <li>
              Menyatakan sumber data sebagai{" "}
              <strong>Suruhanjaya Pilihan Raya Malaysia</strong> apabila
              menggunakan semula data dalam penerbitan, penyelidikan atau
              aplikasi pihak ketiga.
            </li>
            <li>
              Tidak mengubah suai data asal dengan cara yang boleh mengelirukan
              orang awam mengenai maksud atau konteks asalnya.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="display-serif text-2xl font-semibold text-spr-ink mb-3">
            3. Had Tanggungjawab
          </h2>
          <p>
            SPR tidak akan bertanggungjawab ke atas sebarang kerugian atau
            kerosakan, sama ada langsung atau tidak langsung, yang mungkin
            timbul akibat daripada penggunaan atau pergantungan kepada maklumat
            yang disediakan di portal ini. Ini termasuk tetapi tidak terhad
            kepada kerugian data, keuntungan atau gangguan perkhidmatan.
          </p>
        </section>

        <section>
          <h2 className="display-serif text-2xl font-semibold text-spr-ink mb-3">
            4. Pautan Luar
          </h2>
          <p>
            Portal ini mungkin mengandungi pautan ke laman web pihak ketiga
            untuk kemudahan pengguna. SPR tidak mengawal dan tidak bertanggungjawab
            ke atas kandungan, dasar privasi atau amalan laman web pihak ketiga
            tersebut. Akses ke pautan luar adalah atas risiko pengguna sendiri.
          </p>
        </section>

        <section>
          <h2 className="display-serif text-2xl font-semibold text-spr-ink mb-3">
            5. Pindaan
          </h2>
          <p>
            SPR berhak untuk meminda, mengemas kini atau menarik balik
            sebarang kandungan di portal ini pada bila-bila masa tanpa notis
            terlebih dahulu. Pengguna digalakkan untuk menyemak halaman ini
            secara berkala bagi sebarang perubahan.
          </p>
        </section>

        <section className="border-t border-spr-ink/10 pt-6">
          <p className="text-sm text-spr-ink/60">
            Sebarang pertanyaan berkaitan penafian ini boleh diajukan kepada
            Unit Komunikasi Korporat SPR melalui saluran rasmi di{" "}
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
