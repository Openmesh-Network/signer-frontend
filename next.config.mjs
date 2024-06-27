/** @type {import('next').NextConfig} */
const nextConfig = {
  rewrites: () => [
    {
      source: "/ovc/:call*",
      destination: "https://ovc.plopmenz.com/indexer/:call*",
    },
  ],
  reactStrictMode: true,
  webpack: (webpackConfig) => {
    // For web3modal
    webpackConfig.externals.push("pino-pretty", "lokijs", "encoding")
    return webpackConfig
  },
}

export default nextConfig
