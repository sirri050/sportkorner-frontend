import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  serverExternalPackages: ['@swc/helpers'],
  
  // 1. ADD THIS: Natively redirect root traffic to the default locale
  async redirects() {
    return [
      {
        source: '/',
        destination: '/en', 
        permanent: false, // Keep false while debugging so browsers don't cache it forever
      },
    ];
  },

  images: {
    dangerouslyAllowLocalIP: true,
    formats: ["image/avif", "image/webp"],
    loader: 'custom',
    loaderFile: './lib/loader.ts',
    remotePatterns: [
      {
        protocol: "http",
        hostname: "127.0.0.1",
        port: "1337",
        pathname: "/uploads/**",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "1337",
        pathname: "/uploads/**",
      },
      {
        protocol: "https",
        hostname: "cms.sportkorner.com",
        pathname: "/uploads/**",
      },
      {
        protocol: "https",
        hostname: "sportkorner.com",
      },
    ],
  },
};

const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);