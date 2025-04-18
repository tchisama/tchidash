/** @type {import('next').NextConfig} */

const isProd = process.env.NODE_ENV === "production";

const nextConfig = {
  env: {
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
  // avoid wornings
  eslint: {
    ignoreDuringBuilds: true,
  },
  webpack: (config) => {
    config.externals = [...config.externals, { canvas: "canvas" }];
    return config;
  },
  experimental: {
    esmExternals: "loose",
  },
  // crossOrigin set to "anonymous" to avoid CORS issues
  crossOrigin: "anonymous",
  // add images
  images: {
    domains: ["localhost", "lh3.googleusercontent.com"],
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "firebasestorage.googleapis.com",
        port: "",
        pathname: "/v0/b/tchidash-fd7aa.appspot.com/**",
      },
    ],
  },
  async headers() {
    return [
      {
        // matching all API routes
        source: "/api/:path*",
        headers: [
          { key: "Access-Control-Allow-Credentials", value: "true" },
          { key: "Access-Control-Allow-Origin", value: "*" }, // replace this your actual origin
          {
            key: "Access-Control-Allow-Methods",
            value: "GET,DELETE,PATCH,POST,PUT",
          },
          {
            key: "Access-Control-Allow-Headers",
            value:
              "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
