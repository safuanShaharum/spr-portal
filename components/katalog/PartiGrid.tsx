import Image from "next/image";
import { PARTI_FULL_LIST, BEBAS_FULL_LIST } from "@/lib/parti-data";

export default function PartiGrid() {
  return (
    <div className="space-y-10">
      {/* Parti Berdaftar */}
      <div>
        <h3 className="text-lg font-semibold text-spr-navy mb-4">
          Parti Politik Berdaftar ({PARTI_FULL_LIST.length})
        </h3>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">
          {PARTI_FULL_LIST.map((p) => (
            <div
              key={p.id}
              title={p.nama}
              className="flex flex-col items-center gap-2 bg-white border border-spr-border rounded-lg p-3 hover:shadow-sm hover:border-spr-primary/30 transition-all"
            >
              <div className="w-16 h-16 flex items-center justify-center">
                <Image
                  src={`/images/parti-new-2026/${p.logo}`}
                  alt={p.singkatan}
                  width={64}
                  height={64}
                  className="object-contain max-w-full max-h-full"
                />
              </div>
              <span className="text-xs font-medium text-spr-navy text-center truncate w-full">
                {p.singkatan}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Simbol Calon Bebas */}
      <div>
        <h3 className="text-lg font-semibold text-spr-navy mb-4">
          Simbol Calon Bebas ({BEBAS_FULL_LIST.length})
        </h3>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">
          {BEBAS_FULL_LIST.map((b) => (
            <div
              key={b.id}
              title={b.nama}
              className="flex flex-col items-center gap-2 bg-white border border-spr-border rounded-lg p-3 hover:shadow-sm hover:border-spr-primary/30 transition-all"
            >
              <div className="w-16 h-16 flex items-center justify-center">
                <Image
                  src={`/images/calon-bebas/${b.logo}`}
                  alt={b.nama}
                  width={64}
                  height={64}
                  className="object-contain max-w-full max-h-full"
                />
              </div>
              <span className="text-xs font-medium text-spr-navy text-center truncate w-full">
                {b.nama}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
