import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  outputFileTracingRoot: "..",
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:3000/app/:path*',
      },
    ];
  },
};

export default nextConfig;
