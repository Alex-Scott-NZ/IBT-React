// next.config.mjs
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['backend.saggitari.us'],
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