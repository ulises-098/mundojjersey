import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { siteConfig } from "@/lib/config";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const description = `Catálogo de remeras retro y de jugador — ${siteConfig.name}. Consultá directo por WhatsApp.`;

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.siteUrl),
  title: siteConfig.name,
  description,
  openGraph: {
    title: siteConfig.name,
    description,
    images: ["/brand/logo.jpg"],
    type: "website",
  },
  twitter: {
    card: "summary",
    title: siteConfig.name,
    description,
    images: ["/brand/logo.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-[#0b1220] text-neutral-100">
        <Header />
        {children}
      </body>
    </html>
  );
}
