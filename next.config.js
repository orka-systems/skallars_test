/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: {
    unoptimized: true,
  },
  env: {
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  },
  reactStrictMode: true,
  swcMinify: true,
  poweredByHeader: false,
  compress: true,
  generateEtags: true,
  optimizeFonts: true,
  experimental: {
    optimizeCss: true,
    scrollRestoration: true
  }
}

module.exports = nextConfig
