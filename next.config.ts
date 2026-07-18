import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "*.public.blob.vercel-storage.com" },
    ],
  },
  async redirects() {
    return [
      {
        source: "/he-sinh-thai",
        destination: "/linh-vuc-hoat-dong",
        permanent: true,
      },
      {
        source: "/he-sinh-thai/:slug",
        destination: "/linh-vuc-hoat-dong/:slug",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
