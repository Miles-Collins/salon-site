/** @type {import('next').NextConfig} */
const nextConfig = { 
  reactStrictMode: true,
  experimental: {
    serverMinification: false,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'wrzallpepdujlndykydh.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
};
export default nextConfig;
