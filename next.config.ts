import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
    ],
  },
  // Allow up to 10 files × 30MB (video) = 300MB body size
  experimental: {
    serverActions: {
      bodySizeLimit: '320mb',
    },
  },
};

export default nextConfig;
