import './src/env'
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: false,
  },
  experimental: {
    reactCompiler: {
      compilationMode: 'all',
    },
  },
  poweredByHeader: false,
  reactStrictMode: true,
  typescript: {
    ignoreBuildErrors: false,
  },
}

export default nextConfig
