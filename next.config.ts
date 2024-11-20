import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: "export",
  eslint: {
    //   ignoreDevErrors: true, // Ignore ESLint errors during development
    ignoreDuringBuilds: true, // Ignore ESLint errors during production build
  },
};

export default nextConfig;
