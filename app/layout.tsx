import type { Metadata, Viewport } from "next"; // Ajout de Viewport
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

// 1. Configuration de l'affichage mobile (Viewport)
export const viewport: Viewport = {
  themeColor: "#EAB308", // La couleur jaune DSHylec pour la barre du téléphone
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

// 2. Métadonnées de l'application (SEO + PWA)
export const metadata: Metadata = {
  title: "DS Hydrocarbure - Expert Décalaminage & Diagnostic",
  description: "Solution professionnelle de décalaminage moteur et diagnostic auto à domicile.",
  manifest: "/manifest.json", // Lien vers ton fichier manifest
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "DS HY'LEC",
  },
  formatDetection: {
    telephone: false,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <head>
        {/* On force l'icône pour les iPhone */}
        <link rel="apple-touch-icon" href="/ds_hylec_logo.png" />
      </head>
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