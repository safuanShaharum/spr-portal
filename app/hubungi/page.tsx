import type { Metadata } from "next";
import { Mail, Phone, MapPin, Clock, Globe } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";

export const metadata: Metadata = {
  title: "Hubungi Kami | Portal Data Terbuka SPR",
  description:
    "Maklumat perhubungan rasmi Suruhanjaya Pilihan Raya Malaysia bagi pertanyaan berkaitan Portal Data Terbuka.",
};

const CONTACT_ITEMS = [
  {
    icon: MapPin,
    label: "Alamat",
    value: (
      <>
        Suruhanjaya Pilihan Raya Malaysia
        <br />
        Aras 4 &amp; 5, Blok C7, Kompleks C
        <br />
        Pusat Pentadbiran Kerajaan Persekutuan
        <br />
        62690 Putrajaya, Malaysia
      </>
    ),
  },
  {
    icon: Phone,
    label: "Talian Am",
    value: "+603-8892 7018",
  },
  {
    icon: Mail,
    label: "Emel Pertanyaan Data",
    value: "data@spr.gov.my",
  },
  {
    icon: Clock,
    label: "Waktu Operasi",
    value: "Isnin – Jumaat, 8:30 pagi – 5:30 petang (kecuali cuti umum)",
  },
  {
    icon: Globe,
    label: "Laman Rasmi",
    value: "www.spr.gov.my",
  },
];

export default function HubungiPage() {
  return (
    <div>
      <PageHeader
        breadcrumb={[
          { label: "Utama", href: "/" },
          { label: "Hubungi Kami" },
        ]}
        title="Hubungi Kami"
        subtitle="Salurkan pertanyaan, permohonan data atau cadangan anda melalui saluran rasmi Suruhanjaya Pilihan Raya Malaysia."
      />

      <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-10 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {CONTACT_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.label}
                className="rounded-2xl border border-spr-ink/10 bg-white p-6 hover:border-spr-purple/30 transition"
              >
                <div className="w-10 h-10 rounded-xl bg-spr-purple/10 flex items-center justify-center mb-4">
                  <Icon className="w-5 h-5 text-spr-purple" strokeWidth={1.75} />
                </div>
                <div className="text-[11px] uppercase tracking-[0.18em] font-semibold text-spr-ink/50 mb-1.5">
                  {item.label}
                </div>
                <div className="text-spr-ink text-sm leading-relaxed">
                  {item.value}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
