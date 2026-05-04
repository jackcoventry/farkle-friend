import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  images: {
    unoptimized: true,
  },
  output: "export",
  trailingSlash: true,
  allowedDevOrigins: ["192.168.1.176"],
};

export default nextConfig;
