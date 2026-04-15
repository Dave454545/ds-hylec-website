import type { NextConfig } from "next";

const withPWA = require("@ducanh2912/next-pwa").default({
  dest: "public",
  // false : ne pas mettre en cache les navigations — évite les réponses
  // périmées sur données mobiles Safari
  cacheOnFrontEndNav: false,
  aggressiveFrontEndNavCaching: false,
  reloadOnOnline: true,
  swcMinify: true,
  disable: process.env.NODE_ENV === "development",
  workboxOptions: {
    disableDevLogs: true,
    // skipWaiting + clientsClaim : le nouveau SW prend le contrôle
    // immédiatement après chaque déploiement, sans attendre la fermeture
    // de tous les onglets. Essentiel pour éviter qu'un vieux SW cassé
    // continue à servir des requêtes sur données mobiles.
    skipWaiting: true,
    clientsClaim: true,
    // Limite la taille des fichiers pré-cachés : évite les échecs
    // d'installation du SW sur connexions lentes (4G instable)
    maximumFileSizeToCacheInBytes: 3 * 1024 * 1024, // 3 Mo max
    runtimeCaching: [
      {
        // API routes → JAMAIS de cache, toujours le réseau
        urlPattern: /^\/api\/.*/i,
        handler: "NetworkOnly",
      },
      {
        // Assets statiques (JS, CSS, fonts, images) → cache-first
        urlPattern: /\.(?:js|css|woff2?|png|jpg|jpeg|svg|ico|mp4|webp)$/i,
        handler: "CacheFirst",
        options: {
          cacheName: "static-assets",
          expiration: {
            maxEntries: 80,
            maxAgeSeconds: 30 * 24 * 60 * 60, // 30 jours
          },
        },
      },
      {
        // Pages → network-first avec timeout généreux pour données mobiles
        // Si le réseau répond dans les 20s → contenu frais
        // Sinon → fallback sur le cache (mode offline basique)
        urlPattern: /^\/(?!api\/).*/i,
        handler: "NetworkFirst",
        options: {
          cacheName: "pages-cache",
          networkTimeoutSeconds: 20,
          expiration: {
            maxEntries: 20,
            maxAgeSeconds: 24 * 60 * 60, // 24h max en cache
          },
        },
      },
    ],
  },
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