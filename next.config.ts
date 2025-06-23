import { env } from '@/env';
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  async rewrites() {
    return [
      {
        source: '/relay-ph/static/:path*',
        destination: `https://us-assets.i.posthog.com/static/:path*`,
      },
      {
        source: '/relay-ph/:path*',
        destination: `${env.NEXT_PUBLIC_POSTHOG_HOST}/:path*`,
      },
      {
        source: '/relay-ph/flags/:path*',
        destination: `${env.NEXT_PUBLIC_POSTHOG_HOST}/flags/:path*`,
      },
    ];
  },
  skipTrailingSlashRedirect: true,
};

export default nextConfig;
