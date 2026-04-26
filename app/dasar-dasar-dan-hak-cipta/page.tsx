"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";

type SectionId =
  | "dasar-privasi"
  | "dasar-privasi-aplikasi"
  | "dasar-keselamatan"
  | "hak-cipta";

const SECTION_IDS: SectionId[] = [
  "dasar-privasi",
  "dasar-privasi-aplikasi",
  "dasar-keselamatan",
  "hak-cipta",
];

const SECTION_TITLES: Record<SectionId, string> = {
  "dasar-privasi": "Dasar Privasi",
  "dasar-privasi-aplikasi": "Dasar Privasi Aplikasi",
  "dasar-keselamatan": "Dasar Keselamatan",
  "hak-cipta": "Hak Cipta",
};

export default function DasarDasarDanHakCiptaPage() {
  const [openSection, setOpenSection] = useState<SectionId | null>("dasar-privasi");
  const headerRefs = useRef<Record<SectionId, HTMLButtonElement | null>>({
    "dasar-privasi": null,
    "dasar-privasi-aplikasi": null,
    "dasar-keselamatan": null,
    "hak-cipta": null,
  });

  // Deep link: open + scroll to the section that matches the hash on mount.
  useEffect(() => {
    const hash = window.location.hash.replace("#", "");
    if ((SECTION_IDS as string[]).includes(hash)) {
      const id = hash as SectionId;
      setOpenSection(id);
      // Wait one frame so the section can finish expanding before scrolling
      setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 120);
    }
  }, []);

  const toggle = (id: SectionId) => {
    const next = openSection === id ? null : id;
    setOpenSection(next);
    if (next) {
      window.history.replaceState(null, "", `#${next}`);
    } else {
      window.history.replaceState(null, "", window.location.pathname);
    }
  };

  // Roving keyboard navigation between accordion headers.
  const onHeaderKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>, id: SectionId) => {
    const idx = SECTION_IDS.indexOf(id);
    let nextIdx: number | null = null;
    if (e.key === "ArrowDown") nextIdx = (idx + 1) % SECTION_IDS.length;
    else if (e.key === "ArrowUp") nextIdx = (idx - 1 + SECTION_IDS.length) % SECTION_IDS.length;
    else if (e.key === "Home") nextIdx = 0;
    else if (e.key === "End") nextIdx = SECTION_IDS.length - 1;
    if (nextIdx !== null) {
      e.preventDefault();
      headerRefs.current[SECTION_IDS[nextIdx]]?.focus();
    }
  };

  return (
    <div>
      <PageHeader
        breadcrumb={[
          { label: "Utama", href: "/" },
          { label: "Dasar-Dasar dan Hak Cipta" },
        ]}
        title="Dasar-Dasar dan Hak Cipta"
        subtitle="Dasar privasi, dasar keselamatan dan notis hak cipta bagi Portal Data Terbuka Suruhanjaya Pilihan Raya Malaysia."
      />

      <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-10 py-12">
        <div className="space-y-3">
          {SECTION_IDS.map((id) => (
            <AccordionSection
              key={id}
              id={id}
              title={SECTION_TITLES[id]}
              isOpen={openSection === id}
              onToggle={() => toggle(id)}
              onKeyDown={(e) => onHeaderKeyDown(e, id)}
              registerRef={(el) => {
                headerRefs.current[id] = el;
              }}
            >
              {id === "dasar-privasi" && <DasarPrivasiContent />}
              {id === "dasar-privasi-aplikasi" && <DasarPrivasiAplikasiContent />}
              {id === "dasar-keselamatan" && <DasarKeselamatanContent />}
              {id === "hak-cipta" && <HakCiptaContent />}
            </AccordionSection>
          ))}
        </div>
      </div>
    </div>
  );
}

interface AccordionSectionProps {
  id: SectionId;
  title: string;
  isOpen: boolean;
  onToggle: () => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLButtonElement>) => void;
  registerRef: (el: HTMLButtonElement | null) => void;
  children: React.ReactNode;
}

function AccordionSection({
  id,
  title,
  isOpen,
  onToggle,
  onKeyDown,
  registerRef,
  children,
}: AccordionSectionProps) {
  return (
    // scroll-mt offsets the sticky-ish header so deep-link scroll lands cleanly
    <section id={id} className="scroll-mt-28 rounded-2xl border border-spr-ink/10 bg-white overflow-hidden">
      <h2>
        <button
          ref={registerRef}
          type="button"
          onClick={onToggle}
          onKeyDown={onKeyDown}
          aria-expanded={isOpen}
          aria-controls={`panel-${id}`}
          id={`header-${id}`}
          className="w-full min-h-[56px] sm:min-h-[64px] flex items-center justify-between gap-4 px-5 sm:px-7 py-4 text-left transition-colors hover:bg-spr-purple/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-spr-purple focus-visible:ring-inset"
        >
          <span className="display-serif text-lg sm:text-xl font-semibold text-spr-ink">
            {title}
          </span>
          <ChevronDown
            className={`w-5 h-5 text-spr-purple shrink-0 transition-transform duration-300 ${
              isOpen ? "rotate-180" : ""
            }`}
            strokeWidth={2.25}
          />
        </button>
      </h2>
      <div
        id={`panel-${id}`}
        role="region"
        aria-labelledby={`header-${id}`}
        // grid-rows trick: animates between collapsed (0fr) and expanded (1fr)
        // without needing to measure content height. The inner min-h-0 + overflow
        // hidden keeps the collapse clean.
        className={`grid transition-[grid-template-rows] duration-300 ease-in-out ${
          isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}
      >
        <div className="min-h-0 overflow-hidden">
          <div className="px-5 sm:px-7 pb-6 pt-1 text-spr-ink/85 leading-relaxed space-y-6 border-t border-spr-ink/10">
            {children}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- Section content (verbatim dari spr.gov.my) ---------- */

function SubHeading({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="display-serif text-base sm:text-lg font-semibold text-spr-ink mt-2">
      {children}
    </h3>
  );
}

function DasarPrivasiContent() {
  return (
    <>
      <div className="space-y-4">
        <SubHeading>Privasi Anda</SubHeading>
        <p>
          Halaman ini menerangkan dasar privasi yang merangkumi penggunaan dan
          perlindungan maklumat yang dikemukakan oleh pengunjung.
        </p>
        <p>
          Sekiranya anda membuat transaksi atau menghantar e-mel yang
          mengandungi maklumat peribadi, maklumat ini mungkin akan dikongsi
          bersama dengan agensi awam lain untuk membantu penyediaan perkhidmatan
          yang lebih berkesan dan efektif. Contohnya seperti di dalam
          menyelesaikan aduan yang memerlukan maklum balas dari agensi-agensi
          lain.
        </p>
      </div>

      <div className="space-y-3">
        <SubHeading>Maklumat Yang Dikumpul</SubHeading>
        <p>
          Tiada maklumat peribadi akan dikumpul semasa anda melayari laman web
          ini kecuali maklumat yang dikemukakan oleh anda melalui e-mel.
        </p>
      </div>

      <div className="space-y-3">
        <SubHeading>
          Apa yang akan Berlaku jika Saya Membuat Pautan kepada Laman Web yang Lain?
        </SubHeading>
        <p>
          Laman web ini mempunyai pautan ke laman web lain. Dasar privasi ini
          hanya terpakai untuk laman web ini sahaja. Perlu diingatkan bahawa
          laman web yang terdapat dalam pautan mungkin mempunyai dasar privasi
          yang berbeza dan pengunjung dinasihatkan supaya meneliti dan memahami
          dasar privasi bagi setiap laman web yang dilayari.
        </p>
      </div>

      <div className="space-y-3">
        <SubHeading>Pindaan Dasar</SubHeading>
        <p>
          Sekiranya dasar privasi ini dipinda, pindaan akan dikemas kini di
          halaman ini. Dengan sering melayari halaman ini, anda akan dikemas
          kini dengan maklumat yang dikumpul, cara ia digunakan dan dalam
          keadaan tertentu, bagaimana maklumat dikongsi bersama pihak yang lain.
        </p>
      </div>
    </>
  );
}

function DasarPrivasiAplikasiContent() {
  return (
    <>
      <div className="space-y-4">
        <SubHeading>Privasi</SubHeading>
        <p>
          Aplikasi MySPR Semak dan MySPR KTM Mobile adalah dua aplikasi yang
          dibangunkan sebagai, satu platform semakan berpusat iaitu pengguna
          boleh menyemak maklumat berkaitan status daftar pemilih, membuat
          semakan calon-calon yang bertanding bagi sesebuah pilihan raya dan
          juga membuat semakan keputusan bagi setiap pilihan raya yang sedang
          atau pernah dipertandingkan pada tahun-tahun sebelumnya, manakala
          Aplikasi MySPR KTM Mobile pula adalah platform dimana SPR akan membuat
          pengumpulan data bagi merekod dan menganggar jumlah kehadiran
          pengundi hadir bagi sesebuah pilihan raya. Aplikasi ini boleh dimuat
          turun di Google Play Store, Huawei App Gallery, dan Apple App Store.
          Kerajaan memastikan bahawa maklumat peribadi yang dikumpulkan adalah
          selari dengan peruntukan Akta Perlindungan Data Peribadi 2010 (Akta
          709).
        </p>
      </div>

      <div className="space-y-3">
        <SubHeading>Maklumat Peribadi</SubHeading>
        <p>
          Aplikasi ini tidak akan merekodkan data peribadi pengguna kecuali
          dengan kebenaran dan diberikan secara sukarela oleh pengguna. Maklumat
          yang diberikan oleh pengguna digunakan untuk tujuan mentaksir
          kebolehan calon. Maklumat ini tidak dikongsi dengan organisasi lain
          bagi tujuan lain kecuali dinyatakan secara khusus.
        </p>
      </div>

      <div className="space-y-3">
        <SubHeading>Maklumat Yang Dikumpul</SubHeading>
        <ol className="list-decimal pl-6 space-y-3 marker:text-spr-purple marker:font-semibold">
          <li>
            Aplikasi MySPR Semak tidak mengumpul atau menyimpan sebarang data
            peribadi pengguna.
          </li>
          <li>
            <p>
              Aplikasi MySPR KTM Mobile ini mengumpulkan data yang dikemukakan
              atas persetujuan pengguna dan dilakukan secara sukarela melalui
              proses pendaftaran aplikasi untuk capaian ke portal MySPR. Data
              peribadi yang dikumpul adalah seperti berikut:
            </p>
            <ul className="list-disc pl-5 mt-3 space-y-1 text-spr-ink/80">
              <li>Nama Pengguna</li>
              <li>Nombor Kad Pengenalan</li>
              <li>Nombor Telefon</li>
              <li>Alamat</li>
              <li>Jantina</li>
              <li>Agama</li>
              <li>Kaum</li>
              <li>Negeri Kelahiran</li>
              <li>Tarikh Lahir</li>
              <li>Warganegara</li>
              <li>Emel</li>
            </ul>
          </li>
          <li>
            Data peribadi yang dikumpul tidak akan digunakan untuk apa-apa
            tujuan selain daripada yang disebutkan di atas.
          </li>
          <li>
            Data peribadi yang dikumpulkan tidak akan didedahkan kepada
            mana-mana pihak ketiga atau dipindahkan ke tempat di luar Malaysia
            untuk tujuan komersil.
          </li>
        </ol>
      </div>

      <div className="space-y-3">
        <SubHeading>Kesan Jika Data Peribadi Tidak Dibenarkan</SubHeading>
        <p>
          Sekiranya data peribadi yang dibekalkan tidak mencukupi ataupun tidak
          memuaskan, maka permohonan atau permintaan pengguna untuk sebarang
          tujuan di atas tidak diterima atau diambil tindakan atau penggunaan
          perkhidmatan yang ditawarkan oleh aplikasi mungkin ditolak atau
          terjejas.
        </p>
      </div>

      <div className="space-y-3">
        <SubHeading>Kerahsiaan</SubHeading>
        <p>
          Data peribadi yang dikumpul oleh aplikasi akan disimpan dengan sulit
          menurut Dasar Privasi ini selaras dengan sebarang undang-undang yang
          berkenaan yang mungkin berkuat kuasa dari semasa ke semasa.
        </p>
      </div>

      <div className="space-y-3">
        <SubHeading>Keselamatan Data</SubHeading>
        <p>
          Aplikasi ini menerapkan ciri keselamatan yang mematuhi piawaian global
          untuk melindungi kerahsiaan dan keselamatan maklumat pengguna.
        </p>
      </div>

      <div className="space-y-3">
        <SubHeading>Perubahan Kepada Dasar Privasi</SubHeading>
        <p>
          Sekiranya dasar privasi ini dipinda, pindaan tersebut akan dikemas
          kini di halaman ini. Untuk pertanyaan lain, sila e-mel kepada{" "}
          <a
            href="mailto:webmaster@spr.gov.my"
            className="text-spr-purple font-medium hover:underline"
          >
            webmaster@spr.gov.my
          </a>
          .
        </p>
      </div>
    </>
  );
}

function DasarKeselamatanContent() {
  return (
    <>
      <div className="space-y-3">
        <SubHeading>Perlindungan Data</SubHeading>
        <p>
          Teknologi terkini termasuk enkripsi data adalah digunakan untuk
          melindungi data yang dikemukakan dan pematuhan kepada standard
          keselamatan yang ketat adalah terpakai untuk menghalang capaian yang
          tidak dibenarkan.
        </p>
      </div>

      <div className="space-y-3">
        <SubHeading>Keselamatan Data</SubHeading>
        <p>
          Semua storan elektronik dan penghantaran data peribadi akan dilindungi
          dan disimpan dengan menggunakan teknologi keselamatan yang sesuai.
        </p>
      </div>
    </>
  );
}

function HakCiptaContent() {
  return (
    <>
      <div className="space-y-3">
        <SubHeading>Notis Hak Cipta</SubHeading>
        <p>
          Hak cipta Portal Rasmi{" "}
          <strong className="font-semibold text-spr-ink">
            Suruhanjaya Pilihan Raya Malaysia
          </strong>{" "}
          dan segala maklumat, teks, imej, grafik, fail video dan susunannya
          serta bahan-bahannya ialah kepunyaan{" "}
          <strong className="font-semibold text-spr-ink">
            Suruhanjaya Pilihan Raya Malaysia
          </strong>
          . Tidak ada mana-mana bahagian portal ini yang boleh diubah, disalin,
          disiarkan, dipamerkan, diterbitkan, dilesenkan, dipindah, dijual atau
          diuruskan bagi tujuan komersil dalam apa jua bentuk tanpa mendapat
          kebenaran terlebih dahulu daripada{" "}
          <strong className="font-semibold text-spr-ink">
            Suruhanjaya Pilihan Raya Malaysia
          </strong>
          .
        </p>
      </div>

      <div className="space-y-3">
        <SubHeading>Penafian</SubHeading>
        <p>
          Kerajaan Malaysia dan Suruhanjaya Pilihan Raya Malaysia (SPR) adalah
          tidak bertanggungjawab atas kehilangan atau kerugian yang disebabkan
          oleh penggunaan mana-mana maklumat yang diperolehi dari portal ini.
        </p>
      </div>
    </>
  );
}
