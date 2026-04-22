import Link from "next/link";

const UPDATES = [
  {
    month: "Mac",
    day: "15",
    category: "Pemilih",
    categoryColor: "#00D4AA",
    categoryBg: "#E6FAF5",
    title: "Statistik pemilih berdaftar PRU-15 dikemaskini",
    description:
      "Data terkini pemilih berdaftar mengikut negeri, parlimen dan DUN telah dikemaskini.",
  },
  {
    month: "Feb",
    day: "28",
    category: "Keputusan",
    categoryColor: "#3B82F6",
    categoryBg: "#EFF6FF",
    title: "Keputusan PRK Kuala Kubu Baharu ditambah",
    description:
      "Data penuh keputusan pilihan raya kecil termasuk pengundian pos dan awal.",
  },
  {
    month: "Jan",
    day: "12",
    category: "Peta",
    categoryColor: "#7B4FE0",
    categoryBg: "#F3EFFE",
    title: "Data peta sempadan kawasan parlimen dikemaskini",
    description:
      "Fail KMZ sempadan 222 kawasan parlimen dan 600 DUN dalam format terkini.",
  },
  {
    month: "Dis",
    day: "05",
    category: "Pemilih",
    categoryColor: "#00D4AA",
    categoryBg: "#E6FAF5",
    title: "Statistik pengundi mengikut umur dan jantina",
    description:
      "Set data baharu pecahan pengundi mengikut komposisi umur dan jantina.",
  },
];

export default function TerkiniPortal() {
  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-spr-text">
            Terkini di Portal
          </h2>
          <Link
            href="/katalog"
            className="text-sm font-medium text-spr-primary hover:underline hidden sm:inline"
          >
            Lihat semua →
          </Link>
        </div>

        {/* Timeline list */}
        <div className="space-y-0">
          {UPDATES.map((item, i) => (
            <div
              key={i}
              className={`flex items-start gap-5 py-5 group hover:bg-spr-bg-secondary hover:px-5 hover:rounded-xl transition-all duration-200 ${
                i < UPDATES.length - 1 ? "border-b border-spr-border-light" : ""
              }`}
            >
              {/* Date block */}
              <div className="w-16 h-16 rounded-xl bg-spr-primary-50 flex flex-col items-center justify-center shrink-0">
                <span className="text-[13px] font-semibold text-spr-primary leading-none">
                  {item.month}
                </span>
                <span className="text-[22px] font-bold text-spr-navy leading-tight">
                  {item.day}
                </span>
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0 pt-0.5">
                <div className="flex items-center gap-2 mb-1.5">
                  <span
                    className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold"
                    style={{
                      backgroundColor: item.categoryBg,
                      color: item.categoryColor,
                    }}
                  >
                    {item.category}
                  </span>
                </div>
                <h4 className="text-[15px] font-semibold text-spr-navy mb-1 group-hover:text-spr-primary transition-colors">
                  {item.title}
                </h4>
                <p className="text-[13px] text-spr-text-secondary leading-relaxed">
                  {item.description}
                </p>
              </div>

              {/* Arrow */}
              <div className="pt-5 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                <svg
                  width="18"
                  height="18"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="text-spr-primary"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M9 18l6-6-6-6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
