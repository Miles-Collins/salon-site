/** @type {import('next').NextConfig} */
const nextConfig = { 
  reactStrictMode: true,
  experimental: {
    serverMinification: false,
  },
  webpack: (config, { isServer }) => {
    // Help with Clerk during build
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
      };
    }
    return config;
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'wrzallpepdujlndykydh.supabase.co',
      },
    ],
  },
};
export default nextConfig;
