import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";

export const metadata: Metadata = {
  title: "Dasar Privasi | Portal Data Terbuka SPR",
  description:
    "Dasar privasi dan perlindungan data peribadi bagi pengguna Portal Data Terbuka Suruhanjaya Pilihan Raya Malaysia.",
};

export default function DasarPrivasiPage() {
  return (
    <div>
      <PageHeader
        breadcrumb={[
          { label: "Utama", href: "/" },
          { label: "Dasar Privasi" },
        ]}
        title="Dasar Privasi"
        subtitle="Komitmen Suruhanjaya Pilihan Raya Malaysia (SPR) dalam melindungi privasi dan data peribadi pengguna Portal Data Terbuka."
      />

      <article className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-10 py-12 space-y-10 text-spr-ink/85 leading-relaxed">
        <section>
          <h2 className="display-serif text-2xl font-semibold text-spr-ink mb-3">
            1. Pengenalan
          </h2>
          <p>
            Dasar Privasi ini menerangkan bagaimana SPR mengumpul, menggunakan,
            menyimpan dan melindungi maklumat pengguna semasa anda melayari
            Portal Data Terbuka SPR. Dengan menggunakan portal ini, anda
            bersetuju dengan amalan yang digariskan dalam dasar ini, selaras
            dengan peruntukan Akta Perlindungan Data Peribadi 2010 (Akta 709).
          </p>
        </section>

        <section>
          <h2 className="display-serif text-2xl font-semibold text-spr-ink mb-3">
            2. Maklumat Yang Dikumpul
          </h2>
          <p className="mb-3">
            Portal ini boleh mengumpul jenis maklumat berikut:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              <strong>Data teknikal tanpa nama</strong> — alamat IP, jenis
              pelayar, sistem pengendalian dan halaman yang dilawati, bagi
              tujuan analitik dan penambahbaikan perkhidmatan.
            </li>
            <li>
              <strong>Kuki (cookies)</strong> — digunakan untuk menyimpan
              keutamaan paparan dan memperbaiki pengalaman pengguna. Anda
              boleh melumpuhkan kuki menerusi tetapan pelayar.
            </li>
            <li>
              <strong>Maklumat sukarela</strong> — seperti nama dan emel,
              hanya apabila anda menghantar pertanyaan, maklum balas atau
              melanggan kemas kini melalui borang rasmi.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="display-serif text-2xl font-semibold text-spr-ink mb-3">
            3. Tujuan Penggunaan
          </h2>
          <p className="mb-3">
            Maklumat yang dikumpul digunakan untuk tujuan berikut sahaja:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Memastikan kelancaran dan keselamatan operasi portal.</li>
            <li>
              Menambah baik kandungan, fungsi dan pengalaman pengguna
              berdasarkan corak penggunaan agregat.
            </li>
            <li>
              Menjawab pertanyaan atau permintaan data yang dihantar secara
              sukarela oleh pengguna.
            </li>
            <li>
              Memenuhi keperluan perundangan dan tatacara yang dikenakan ke
              atas agensi kerajaan.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="display-serif text-2xl font-semibold text-spr-ink mb-3">
            4. Perkongsian Maklumat
          </h2>
          <p>
            SPR tidak akan menjual, menyewa atau mendedahkan maklumat peribadi
            pengguna kepada pihak ketiga untuk tujuan komersial. Perkongsian
            hanya berlaku dengan agensi kerajaan yang sah atau apabila
            diperlukan oleh undang-undang, perintah mahkamah atau arahan pihak
            berkuasa yang berwenang.
          </p>
        </section>

        <section>
          <h2 className="display-serif text-2xl font-semibold text-spr-ink mb-3">
            5. Keselamatan Data
          </h2>
          <p>
            Langkah keselamatan teknikal dan pentadbiran yang wajar dilaksanakan
            untuk melindungi maklumat daripada akses, penggunaan atau
            pendedahan yang tidak dibenarkan. Walau bagaimanapun, tiada
            penghantaran data melalui Internet yang benar-benar selamat; SPR
            tidak boleh menjamin keselamatan mutlak maklumat yang dihantar ke
            portal ini.
          </p>
        </section>

        <section>
          <h2 className="display-serif text-2xl font-semibold text-spr-ink mb-3">
            6. Hak Pengguna
          </h2>
          <p>
            Selaras dengan Akta 709, anda berhak untuk mengakses, membetulkan
            atau memohon pembatalan data peribadi anda yang disimpan oleh SPR.
            Permintaan sedemikian boleh dikemukakan secara bertulis kepada Unit
            Komunikasi Korporat SPR.
          </p>
        </section>

        <section>
          <h2 className="display-serif text-2xl font-semibold text-spr-ink mb-3">
            7. Pindaan Dasar
          </h2>
          <p>
            SPR berhak untuk meminda Dasar Privasi ini pada bila-bila masa.
            Sebarang perubahan akan dikemas kini di halaman ini dan berkuat
            kuasa serta-merta selepas diterbitkan.
          </p>
        </section>

        <section className="border-t border-spr-ink/10 pt-6">
          <p className="text-sm text-spr-ink/60">
            Pertanyaan berkaitan dasar privasi boleh dihantar kepada Unit
            Komunikasi Korporat SPR melalui saluran rasmi di{" "}
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
