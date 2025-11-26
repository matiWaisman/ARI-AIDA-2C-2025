import type { NextConfig } from "next";
import { config } from "dotenv";
import { resolve } from "path";

// Cargar local-sets.env si existe
config({ path: resolve(process.cwd(), "local-sets.env") });

const nextConfig: NextConfig = {
  outputFileTracingRoot: "..",
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://localhost:3000/app/:path*",
      },
    ];
  },
};

export default nextConfig;
