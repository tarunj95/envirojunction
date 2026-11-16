import type { NextConfig } from 'next';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rawApiBase = process.env.NEXT_PUBLIC_API_BASE_URL;
const apiBase =
  !rawApiBase || rawApiBase.includes('52.64.114.139')
    ? 'https://api.envirojunction.com'
    : rawApiBase.replace(/\/+$/, '');

const nextConfig: NextConfig = {
  /* config options here */
  outputFileTracingRoot: __dirname,
  env: {
    NEXT_PUBLIC_API_BASE_URL: apiBase,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  async rewrites() {
    return [
      {
        source: '/backend-news',
        destination: `${apiBase}/news`,
      },
      {
        source: '/api-backend/:path*',
        destination: `${apiBase}/:path*`,
      },
    ];
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        crypto: false,
      };
    }
    return config;
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'upload.wikimedia.org',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.pexels.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'imgix-prod.sgs.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
