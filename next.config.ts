import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true, // Игнорировать ошибки ESLint при сборке
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
