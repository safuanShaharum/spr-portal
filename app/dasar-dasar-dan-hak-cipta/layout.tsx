import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dasar-Dasar dan Hak Cipta | Portal Data Terbuka SPR",
  description:
    "Dasar privasi, dasar keselamatan, dan notis hak cipta SPR Open Data Portal.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
