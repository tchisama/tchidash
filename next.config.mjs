/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },

  // add images
  images: {
    domains: ["localhost", "lh3.googleusercontent.com"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "firebasestorage.googleapis.com",
        port: "",
        pathname: "/v0/b/tchidash-fd7aa.appspot.com/**",
      },
    ],
  },
};

export default nextConfig;
