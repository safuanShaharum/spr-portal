const UPDATES = [
  {
    category: "Pemilih",
    categoryColor: "#00D4AA",
    categoryBg: "#E6FAF5",
    date: "Mac 2026",
    title: "Statistik pemilih berdaftar PRU-15 dikemaskini",
    description:
      "Data terkini pemilih berdaftar mengikut negeri, parlimen dan DUN telah dikemaskini dengan maklumat suku pertama 2026.",
  },
  {
    category: "Keputusan",
    categoryColor: "#3B82F6",
    categoryBg: "#EFF6FF",
    date: "Feb 2026",
    title: "Keputusan PRK Kuala Kubu Baharu ditambah",
    description:
      "Data penuh keputusan pilihan raya kecil Kuala Kubu Baharu termasuk pengundian pos dan awal.",
  },
  {
    category: "PRK",
    categoryColor: "#FF8C42",
    categoryBg: "#FFF3E8",
    date: "Jan 2026",
    title: "Data peta sempadan kawasan parlimen dikemaskini",
    description:
      "Fail KMZ sempadan 222 kawasan parlimen dan 600 DUN telah dimuat naik dalam format terkini.",
  },
  {
    category: "Pemilih",
    categoryColor: "#00D4AA",
    categoryBg: "#E6FAF5",
    date: "Dis 2025",
    title: "Statistik pengundi mengikut umur dan jantina",
    description:
      "Set data baharu merangkumi pecahan pengundi berdaftar mengikut kumpulan umur dan jantina bagi setiap negeri.",
  },
];

export default function KemaskiniTerkini() {
  return (
    <section className="py-12 bg-spr-bg-secondary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-spr-text">Kemaskini Terkini</h2>
          <span className="text-sm text-spr-text-muted">3 bulan lalu</span>
        </div>

        {/* Timeline */}
        <div className="bg-white border border-spr-border rounded-xl overflow-hidden">
          {UPDATES.map((item, i) => (
            <div
              key={i}
              className={`px-6 py-5 ${
                i < UPDATES.length - 1 ? "border-b border-spr-border-light" : ""
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-start gap-3">
                <div className="flex items-center gap-3 shrink-0">
                  <span
                    className="px-2.5 py-1 rounded-full text-[11px] font-semibold"
                    style={{ backgroundColor: item.categoryBg, color: item.categoryColor }}
                  >
                    {item.category}
                  </span>
                  <span className="text-xs text-spr-text-muted">{item.date}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-[15px] font-semibold text-spr-text mb-1">
                    {item.title}
                  </h4>
                  <p className="text-[13px] text-spr-text-secondary leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
