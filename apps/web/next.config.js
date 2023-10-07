/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ['mysql2'],
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.discordapp.com',
      },
    ],
  },
  transpilePackages: ['ui'],
}

module.exports = nextConfig
