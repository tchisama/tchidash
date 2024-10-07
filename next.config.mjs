/** @type {import('next').NextConfig} */

const isProd = process.env.NODE_ENV === "production";

const nextConfig = {
  env:{
    NEXTAUTH_URL: isProd
      ? process.env.NEXTAUTH_URL_PRODUCTION
      : process.env.NEXTAUTH_URL_DEVELOPMENT,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
  },
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
