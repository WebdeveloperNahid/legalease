/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**", // এটি যেকোনো ওয়েবসাইটের ডোমেনকে অ্যালাউ করবে
      },
      
    ],
  },
};

export default nextConfig;
