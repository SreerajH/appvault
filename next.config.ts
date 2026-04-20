import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'placehold.co' },
      { protocol: 'https', hostname: '**.placehold.co' },
    ],
    unoptimized: true,
  },
  serverExternalPackages: ['@prisma/client', '@prisma/adapter-libsql', '@libsql/client'],
};

export default nextConfig;
