import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";

export const metadata: Metadata = {
  title: "Peta Laman | Portal Data Terbuka SPR",
  description:
    "Struktur navigasi penuh Portal Data Terbuka Suruhanjaya Pilihan Raya Malaysia.",
};

const SECTIONS = [
  {
    title: "Navigasi Utama",
    links: [
      { label: "Halaman Utama", href: "/" },
      { label: "Katalog Data", href: "/katalog" },
      { label: "Dashboard", href: "/dashboard" },
      { label: "Peta Interaktif", href: "/peta" },
      { label: "Infografik Pilihan Raya", href: "/infografik-pilihan-raya" },
      { label: "Cari Dataset", href: "/cari" },
    ],
  },
  {
    title: "Kategori Katalog",
    links: [
      { label: "Penjalanan Pilihan Raya", href: "/katalog?bahagian=penjalanan-pilihan-raya" },
      { label: "Pendaftaran Pemilih", href: "/katalog?bahagian=pendaftaran-pemilih" },
      { label: "Persempadanan", href: "/katalog?bahagian=persempadanan" },
      { label: "Perundangan", href: "/katalog?bahagian=perundangan" },
      { label: "Pentadbiran & Pengurusan", href: "/katalog?bahagian=pentadbiran-pengurusan" },
      { label: "Kesalahan Pilihan Raya", href: "/katalog?bahagian=kesalahan-pilihan-raya" },
      { label: "Pemerhati Pilihan Raya", href: "/katalog?bahagian=pemerhati-pilihan-raya" },
      { label: "Pendidikan Pengundi", href: "/katalog?bahagian=pendidikan-pengundi" },
      { label: "Soalan Lazim", href: "/katalog?bahagian=soalan-lazim" },
    ],
  },
  {
    title: "Maklumat",
    links: [
      { label: "Tentang Kami", href: "/tentang" },
      { label: "Hubungi Kami", href: "/hubungi" },
    ],
  },
  {
    title: "Undang-Undang",
    links: [
      { label: "Dasar-Dasar dan Hak Cipta", href: "/dasar-dasar-dan-hak-cipta" },
      { label: "Peta Laman", href: "/peta-laman" },
    ],
  },
];

export default function PetaLamanPage() {
  return (
    <div>
      <PageHeader
        breadcrumb={[
          { label: "Utama", href: "/" },
          { label: "Peta Laman" },
        ]}
        title="Peta Laman"
        subtitle="Senarai lengkap halaman dan bahagian yang boleh diakses melalui Portal Data Terbuka SPR."
      />

      <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-10 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {SECTIONS.map((sec) => (
            <section
              key={sec.title}
              className="rounded-2xl border border-spr-ink/10 bg-white p-6"
            >
              <h2 className="display-serif text-xl font-semibold text-spr-ink mb-4 pb-3 border-b border-spr-ink/10">
                {sec.title}
              </h2>
              <ul className="space-y-2.5">
                {sec.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-spr-ink/75 hover:text-spr-purple transition inline-flex items-center gap-2 group"
                    >
                      <span className="w-1 h-1 rounded-full bg-spr-ink/30 group-hover:bg-spr-purple transition" />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
