/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'cdn.shopify.com', pathname: '/**' },
      { protocol: 'https', hostname: 'leela-skincare.myshopify.com', pathname: '/**' },
    ],
  },
}

export default nextConfig
