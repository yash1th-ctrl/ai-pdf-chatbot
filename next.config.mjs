/** @type {import('next').NextConfig} */
const nextConfig = {
  // Remove standalone output for Render deployment
  // output: 'standalone',

  // Image optimization for production
  images: {
    domains: ['img.clerk.com', 'images.clerk.dev'],
    unoptimized: process.env.NODE_ENV === 'production', // Disable optimization for Render
  },

  // Webpack configuration for production
  webpack: (config, { isServer }) => {
    // Handle PDF parsing and other Node.js modules
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        crypto: false,
        stream: false,
        util: false,
        buffer: false,
      };
    }
    return config;
  },

  // External packages for server components (Next.js 15 syntax)
  serverExternalPackages: ['pdf-parse'],

  // Disable strict mode to prevent double rendering in development
  reactStrictMode: false,
};

export default nextConfig;
