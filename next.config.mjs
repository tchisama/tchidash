/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript:{
    ignoreBuildErrors: true
  },

  // add images 
  images: {
      domains: ['localhost','lh3.googleusercontent.com'],
  },
};

export default nextConfig;
