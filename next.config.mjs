/** @type {import('next').NextConfig} */
const nextConfig = {
  // Optimize for production deployment
  output: 'standalone',

  // Environment variables configuration
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },

  // Image optimization for production
  images: {
    domains: ['img.clerk.com', 'images.clerk.dev'],
    unoptimized: false,
  },

  // Webpack configuration for production
  webpack: (config, { isServer }) => {
    // Handle PDF parsing in production
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
      };
    }
    return config;
  },

  // Experimental features for better performance
  experimental: {
    serverComponentsExternalPackages: ['pdf-parse'],
  },
};

export default nextConfig;
