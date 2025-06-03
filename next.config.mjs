/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // Ignore TypeScript build errors
    ignoreBuildErrors: true,
  },
  images: {
    domains: [
      "localhost",
      "scontent.cdninstagram.com",
      "www.instagram.com",
      "dubblinapi.aarvytechnologies.in",
      "api.dubblin.co.in",
      "lh3.googleusercontent.com",
    ],
  },
};

export default nextConfig;
