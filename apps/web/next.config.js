/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
    serverComponentsExternalPackages: ['mysql2'],
  },
  transpilePackages: ['ui'],
}

module.exports = nextConfig
