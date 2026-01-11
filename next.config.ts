import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'export',
  basePath: '/slearning',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
