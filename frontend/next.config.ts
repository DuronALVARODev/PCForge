import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/cpus',
        destination: 'http://localhost:4000/api/cpus',
      },
      {
        source: '/api/auth/:path*',
        destination: 'http://localhost:4000/api/auth/:path*',
      },
      {
        source: '/api/admin/:path*',
        destination: 'http://localhost:4000/api/admin/:path*',
      },
      {
        source: '/api/images/:path*',
        destination: 'http://localhost:4000/images/:path*',
      },
      // Puedes agregar más endpoints aquí si lo necesitas
    ];
  },
};

export default nextConfig;
