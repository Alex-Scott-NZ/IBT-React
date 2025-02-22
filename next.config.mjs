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
    return config;
  },
};

export default nextConfig;