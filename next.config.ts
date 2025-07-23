import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    turbo: {
      resolveAlias: {
        buffer: 'buffer',
      },
    },
  },
  webpack: (config: any) => {
    // Only apply webpack config when not using turbopack
    if (!config.name?.includes('turbo')) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        crypto: false,
        stream: false,
        util: false,
        buffer: require.resolve('buffer'),
      };
      
      config.resolve.alias = {
        ...config.resolve.alias,
        buffer: require.resolve('buffer'),
      };
    }
    
    return config;
  },
};

export default nextConfig;
