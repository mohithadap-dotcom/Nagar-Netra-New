import type { Metadata } from "next";
import { Sora, Inter, JetBrains_Mono, Noto_Sans_Devanagari } from "next/font/google";
import "./globals.css";
import { LayoutWrapper } from "@/components/layout/LayoutWrapper";

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-sora",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

const notoDevanagari = Noto_Sans_Devanagari({
  subsets: ["devanagari"],
  variable: "--font-hindi",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "NagarNetra — AI-Powered Civic Accountability Platform",
  description:
    "India's first AI-powered civic infrastructure accountability platform. Report potholes, track repairs, hold contractors accountable.",
  keywords: [
    "NagarNetra",
    "pothole detection",
    "civic accountability",
    "smart city",
    "Nagpur",
    "municipal",
    "infrastructure",
    "AI",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${sora.variable} ${inter.variable} ${jetbrainsMono.variable} ${notoDevanagari.variable}`}
    >
      <body className="font-inter antialiased bg-navy text-white min-h-screen">
        <LayoutWrapper>{children}</LayoutWrapper>
      </body>
    </html>
  );
}
