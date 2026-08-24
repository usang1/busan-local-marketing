import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  distDir: ".next-build",
  experimental: {
    webpackBuildWorker: false,
  },
};

export default nextConfig;
