import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  httpAgentOptions: {
    keepAlive: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.nec.go.kr',
      },
      {
        protocol: 'http',
        hostname: 'cdn.nec.go.kr',
      },
    ],
  },
};

export default nextConfig;
