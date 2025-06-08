// next.config.mjs
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['backend.saggitari.us'],
    formats: ['image/avif', 'image/webp'], // Modern formats
    minimumCacheTTL: 60, // Cache optimization
  },
  productionBrowserSourceMaps: true,
  webpack: (config, options) => {
    config.module.rules.push({
      test: /\.node$/,
      use: 'raw-loader',
    });
    
    // Fix for PDF.js canvas issue on server
    if (!options.isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
      };
    } else {
      config.resolve.alias = {
        ...config.resolve.alias,
        canvas: false,
      };
    }
    
    return config;
  },
};

export default nextConfig;
