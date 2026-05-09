import bundleAnalyzer from '@next/bundle-analyzer';
import type { NextConfig } from 'next';

function getAllowedDevOrigins(): string[] | undefined {
  if (process.env.NODE_ENV !== 'development') return undefined;
  const raw = process.env.NEXT_ALLOWED_DEV_ORIGINS;
  if (!raw) return undefined;
  const origins = raw
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
  return origins.length ? origins : undefined;
}

const nextConfig: NextConfig = {
  devIndicators: false,
  images: {
    unoptimized: true,
  },
  output: 'export',
  trailingSlash: true,
  allowedDevOrigins: getAllowedDevOrigins(),
};

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

export default withBundleAnalyzer(nextConfig);
