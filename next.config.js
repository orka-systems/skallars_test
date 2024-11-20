/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: {
    unoptimized: true,
  },
  env: {
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  },
  webpack: (config, { isServer }) => {
    // Handle JavaScript modules
    config.module.rules.push({
      test: /\.js$/,
      use: ['babel-loader'],
      exclude: /node_modules/,
    });

    return config;
  }
}

module.exports = nextConfig
