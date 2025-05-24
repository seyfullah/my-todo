import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  async redirects() {
    return [
      {
        source: '/',
        destination: '/index.html',
        permanent: false,
      },
    ];
  },
};

export default nextConfig;