import type { NextConfig } from "next";

const withPWA = require("@ducanh2912/next-pwa").default({
  dest: "public",
  // Le service worker est DÉSACTIVÉ partout.
  //
  // Pourquoi : sur iOS Safari en données mobiles, le SW intercepte toutes
  // les requêtes réseau. Quand il échoue (réseau cellulaire plus lent,
  // précache interrompu, timeout), iOS affiche "Your iPhone is not connected
  // to the internet" au lieu de laisser passer la requête vers le réseau.
  // C'est un comportement connu d'iOS avec les SW défaillants.
  //
  // Sans SW, le site fonctionne normalement sur WiFi ET données mobiles.
  // L'app reste installable comme PWA grâce au manifest.json (iOS 16.4+).
  disable: true,
});

const securityHeaders = [
  { key: "X-Frame-Options",           value: "SAMEORIGIN" },
  { key: "X-Content-Type-Options",    value: "nosniff" },
  { key: "Referrer-Policy",           value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy",        value: "camera=(), microphone=(), geolocation=()" },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      // Next.js inline scripts + PWA service worker
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
      // Tailwind inline styles + glassmorphism backdrop-filter
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      // Google Fonts, Unsplash images, local assets
      "img-src 'self' data: blob: https://images.unsplash.com",
      // Google Fonts
      "font-src 'self' https://fonts.gstatic.com",
      // API calls: Resend (email) + French address API + own origin
      "connect-src 'self' https://api-adresse.data.gouv.fr",
      // Videos served from /public
      "media-src 'self'",
      // Service worker scope
      "worker-src 'self'",
    ].join("; "),
  },
];

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  turbopack: {},
  async headers() {
    return [
      {
        // Apply security headers to all routes
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
};

export default withPWA(nextConfig);