import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: process.env.VERCEL ? undefined : 'standalone',
   async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination:
          "https://ai-service-desk-j9k9.onrender.com/api/:path*",
      },
    ];
  },
};

export default nextConfig;
