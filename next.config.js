/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@emotion/react', '@emotion/styled'],
  compiler: {
    emotion: true,
  },
}

module.exports = nextConfig

