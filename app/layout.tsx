import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";

// Configuration des polices
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Métadonnées de l'application (Pour le SEO de DS Hydrocarbure)
export const metadata: Metadata = {
  title: "DS Hydrocarbure - Expert Décalaminage & Diagnostic",
  description: "Solution professionnelle de décalaminage moteur et diagnostic auto à domicile.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* On enveloppe TOUTE l'app dans Providers pour que l'auth fonctionne partout */}
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}