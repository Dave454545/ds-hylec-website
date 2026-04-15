import type { NextConfig } from "next";

const withPWA = require("@ducanh2912/next-pwa").default({
  dest: "public",
  cacheOnFrontEndNav: true,
  aggressiveFrontEndNavCaching: true,
  reloadOnOnline: true,
  swcMinify: true,
  disable: process.env.NODE_ENV === "development",
  workboxOptions: {
    disableDevLogs: true,
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