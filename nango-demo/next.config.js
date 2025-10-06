/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  env: {
    NANGO_SECRET_KEY: process.env.NANGO_SECRET_KEY,
    NANGO_HOST: process.env.NANGO_HOST || 'https://api.nango.dev',
  },
}

module.exports = nextConfig
