/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "avatars.slack-edge.com" },
      { protocol: "https", hostname: "**" },
    ],
  },
};

export default nextConfig;
