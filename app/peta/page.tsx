import type { Metadata } from "next";
import dynamic from "next/dynamic";

export const metadata: Metadata = {
  title: "Peta Interaktif — Portal Data Terbuka SPR",
  description:
    "Peta interaktif sempadan kawasan Parlimen dan DUN seluruh Malaysia.",
};

const InteractiveMap = dynamic(() => import("@/components/InteractiveMap"), {
  ssr: false,
  loading: () => (
    <div
      className="flex items-center justify-center bg-spr-bg-secondary"
      style={{ height: "calc(100vh - 96px)" }}
    >
      <div className="text-center">
        <div className="w-12 h-12 border-2 border-spr-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-spr-text-muted text-sm">Memuatkan peta...</p>
      </div>
    </div>
  ),
});

export default function PetaPage() {
  return (
    <div style={{ minHeight: "calc(100vh - 96px)" }}>
      <InteractiveMap />
    </div>
  );
}
