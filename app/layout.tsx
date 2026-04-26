import type { Metadata } from "next";
import { Playfair_Display, DM_Sans, Fraunces, Inter_Tight, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { TopTicker } from "@/components/homepage/TopTicker";
import { MainNav } from "@/components/homepage/MainNav";
import Footer from "@/components/Footer";

const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  weight: ["700"],
  variable: "--font-display",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-body",
  display: "swap",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
  weight: ["400", "500", "600", "700", "900"],
});

const interTight = Inter_Tight({
  subsets: ["latin"],
  variable: "--font-inter-tight",
  display: "swap",
  weight: ["400", "500", "600", "700", "800", "900"],
  style: ["normal", "italic"],
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "Portal Data Terbuka SPR",
  description:
    "Portal Data Terbuka Suruhanjaya Pilihan Raya Malaysia — Akses data pilihan raya, sempadan, statistik pengundi dan keputusan PRU secara terbuka.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ms">
      <body
        className={`${playfairDisplay.variable} ${dmSans.variable} ${fraunces.variable} ${interTight.variable} ${jetbrainsMono.variable} font-body antialiased bg-white text-spr-text`}
      >
        <TopTicker />
        <MainNav />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
