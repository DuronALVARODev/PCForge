import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/cpus',
        destination: 'https://pcforge-backend.onrender.com/api/cpus',
      },
      {
        source: '/api/auth/:path*',
        destination: 'https://pcforge-backend.onrender.com/api/auth/:path*',
      },
      {
        source: '/api/admin/:path*',
        destination: 'https://pcforge-backend.onrender.com/api/admin/:path*',
      },
      {
        source: '/api/images/:path*',
        destination: 'https://pcforge-backend.onrender.com/images/:path*',
      },
      // Puedes agregar más endpoints aquí si lo necesitas
    ];
  },
};

export default nextConfig;
