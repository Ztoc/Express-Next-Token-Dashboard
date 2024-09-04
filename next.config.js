/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    dirs: ["."],
  },
  images: {
    domains: [
      "raw.githubusercontent.com",
      "statics.gloryfinance.io",
      "s2.coinmarketcap.com",
      "tokens.pancakeswap.finance",
    ],
  },
  poweredByHeader: false,
  trailingSlash: false,
  basePath: "",
  transpilePackages: ["@pancakeswap/token-lists", "@pancakeswap/smart-router"],
  // The starter code load resources from `public` folder with `router.basePath` in React components.
  // So, the source code is "basePath-ready".
  // You can remove `basePath` if you don't need it.
  reactStrictMode: false,
}

module.exports = nextConfig
