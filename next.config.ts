import type { NextConfig } from "next";

// No `output: 'export'` — the site deploys on Vercel, where the full Next.js
// runtime gives us automatic image optimization (AVIF/WebP), real redirects,
// and ISR so Shopify price/catalog changes go live without a redeploy.
const nextConfig: NextConfig = {
  images: {
    qualities: [75, 100],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.shopify.com',
      },
    ],
  },
  env: {
    NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN: process.env.SHOPIFY_STORE_DOMAIN,
    NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN: process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN,
  },
};

export default nextConfig;
