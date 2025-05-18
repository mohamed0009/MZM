/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  reactStrictMode: true,
  async rewrites() {
    return [
      // General API route
      {
        source: '/api/:path*',
        destination: 'http://localhost:8081/api/:path*',
      },
      // Specific routes for inventory products with better debugging info
      {
        source: '/api/inventory/products',
        destination: 'http://localhost:8081/api/inventory/products',
      },
      {
        source: '/api/inventory/products/:id',
        destination: 'http://localhost:8081/api/inventory/products/:id',
      },
      // Support direct product paths if needed
      {
        source: '/api/products/:id',
        destination: 'http://localhost:8081/api/inventory/products/:id',
      },
      // Fallback to internal API routes when backend is unavailable
      {
        source: '/api/inventory/products',
        destination: '/api/mock/inventory/products',
        has: [
          {
            type: 'header',
            key: 'x-use-mock',
            value: 'true',
          },
        ],
      },
      {
        source: '/api/inventory/products/:id',
        destination: '/api/mock/inventory/products/:id',
        has: [
          {
            type: 'header',
            key: 'x-use-mock',
            value: 'true',
          },
        ],
      }
    ];
  },
}

export default nextConfig
