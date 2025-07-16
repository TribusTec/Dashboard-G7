/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export', // <- aqui está a chave

  experimental: {
    esmExternals: 'loose',
  },
  
  typescript: {
    ignoreBuildErrors: true
  },

  eslint: {
    ignoreDuringBuilds: true,
  },

  images: {
    unoptimized: true,
    domains: [],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },

  generateBuildId: async () => {
    return `build-${Date.now()}`
  },

  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=0, must-revalidate',
          },
        ],
      },
    ]
  },
}

export default nextConfig
