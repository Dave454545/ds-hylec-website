import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";
import BottomNav from "@/components/BottomNav";
import PWAInstallBanner from "@/components/PWAInstallBanner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Viewport: viewport-fit=cover enables safe-area-inset-* CSS env vars
// userScalable: false prevents pinch-zoom (native app behaviour)
export const viewport: Viewport = {
  themeColor: "#E30613",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

export const metadata: Metadata = {
  title: "DS HY'LEC — Diagnostic Auto & Expert Hybride à Domicile",
  description: "DS HY'LEC, expert en diagnostic électronique et véhicules hybrides. Intervention à domicile en Île-de-France. Diagnostic, FAP, batterie hybride. On détecte, on répare, vous roulez.",
  keywords: "diagnostic automobile, expert hybride, intervention domicile, FAP, batterie hybride, diagnostic électronique, Paris, Île-de-France",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    // black-translucent: status bar becomes transparent, content goes edge-to-edge
    statusBarStyle: "black-translucent",
    title: "DS HY'LEC",
  },
  formatDetection: {
    telephone: false,
  },
  icons: {
    icon: '/logo-ds_hylec_neuf.ico',
    apple: '/logo-ds_hylec_neuf.webp',
  },
  openGraph: {
    title: "DS HY'LEC — Expert Diagnostic & Hybride",
    description: "Intervention à domicile. Diagnostic électronique, FAP, hybride. On détecte, on répare, vous roulez.",
    url: "https://dshylec.fr",
    siteName: "DS HY'LEC",
    locale: "fr_FR",
    type: "website",
    images: [{ url: "/logo-ds_hylec_neuf.webp", width: 400, height: 200 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "DS HY'LEC — Expert Diagnostic & Hybride",
    description: "Intervention à domicile. Diagnostic, FAP, hybride.",
  },
  alternates: {
    canonical: "https://dshylec.fr",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
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
        <link rel="apple-touch-icon" href="/ds_hylec_logo.png" />
        {/* Preconnect to Unsplash CDN used for service card images */}
        <link rel="preconnect" href="https://images.unsplash.com" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "LocalBusiness",
            "name": "DS HY'LEC",
            "description": "Expert en diagnostic automobile et véhicules hybrides. Intervention à domicile.",
            "url": "https://dshylec.fr",
            "telephone": "0753290244",
            "email": "contact@dshylec.fr",
            "address": {
              "@type": "PostalAddress",
              "addressLocality": "Paris",
              "addressRegion": "Île-de-France",
              "addressCountry": "FR"
            },
            "serviceArea": {
              "@type": "GeoCircle",
              "geoMidpoint": {
                "@type": "GeoCoordinates",
                "latitude": 48.8566,
                "longitude": 2.3522
              },
              "geoRadius": "50000"
            },
            "priceRange": "€€",
            "openingHours": "Mo-Sa 08:00-19:00"
          }) }}
        />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Providers>
          {children}
          {/* Bottom navigation — visible on mobile only, hidden md+ */}
          <BottomNav />
          {/* PWA install prompt — iOS Safari instructions / Android native prompt */}
          <PWAInstallBanner />
        </Providers>
      </body>
    </html>
  );
}
