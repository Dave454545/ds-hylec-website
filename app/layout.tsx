import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";
import BottomNav from "@/components/BottomNav";

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
  title: "DS HY'LEC — Expert Hybride & Diagnostic Auto à Domicile",
  description: "Expert hybrid, diagnostic électronique et performance moteur. Intervention à domicile ou sur votre lieu de travail.",
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
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Providers>
          {children}
          {/* Bottom navigation — visible on mobile only, hidden md+ */}
          <BottomNav />
        </Providers>
      </body>
    </html>
  );
}
