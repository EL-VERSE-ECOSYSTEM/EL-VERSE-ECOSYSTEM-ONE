/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ["@elverse/shared-ui", "@elverse/shared-types", "@elverse/shared-api"]
};

module.exports = nextConfig;
