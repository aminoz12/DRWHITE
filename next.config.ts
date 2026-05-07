import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  distDir: 'dist',
  images: {
    unoptimized: true,
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
  },
};

export default nextConfig;
