import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    /**
     * remotePatterns whitelists the external hostnames that next/image
     * is allowed to download, optimise and cache.
     *
     * Add the exact hostname your mock API serves images from.
     * The patterns below cover common cases:
     *   - *.mockapi.io   → MockAPI
     *   - placehold.co   → placeholder images
     *   - *.blob.vercel-storage.com → Vercel Blob Storage
     *
     * Never use { hostname: '**' } — that disables the security benefit.
     */
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.mockapi.io",
      },
      {
        protocol: "https",
        hostname: "placehold.co",
      },
      {
        protocol: "https",
        hostname: "*.blob.vercel-storage.com",
      },
    ],
  },
};

export default nextConfig;
