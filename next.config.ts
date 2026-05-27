import { type NetworkInterfaceInfo, networkInterfaces } from 'node:os';
import bundleAnalyzer from '@next/bundle-analyzer';
import type { NextConfig } from 'next';

function getAllowedDevOrigins(): string[] | undefined {
  if (process.env.NODE_ENV !== 'development') return undefined;
  const raw = process.env.NEXT_ALLOWED_DEV_ORIGINS;
  const configuredOrigins = raw
    ? raw
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean)
    : [];
  const localOrigins = Object.values(networkInterfaces())
    .flat()
    .filter(
      (networkInterface): networkInterface is NetworkInterfaceInfo =>
        networkInterface?.family === 'IPv4' && !networkInterface.internal
    )
    .map((networkInterface) => networkInterface.address);
  const origins = [...new Set([...configuredOrigins, ...localOrigins])];

  return origins.length ? origins : undefined;
}

const nextConfig: NextConfig = {
  devIndicators: false,
  images: {
    unoptimized: false,
  },
  output: 'export',
  trailingSlash: process.env.NODE_ENV === 'production',
  allowedDevOrigins: getAllowedDevOrigins(),
};

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

export default withBundleAnalyzer(nextConfig);
