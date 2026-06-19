/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'cdn.shopify.com', pathname: '/**' },
      { protocol: 'https', hostname: 'leela-skincare.myshopify.com', pathname: '/**' },
      { protocol: 'https', hostname: '*.myshopify.com', pathname: '/**' },
    ],
  },
  async redirects() {
    return [
      { source: '/blogs/:blog/:article', destination: '/blog/:article', permanent: true },
      { source: '/blogs/:blog', destination: '/blog', permanent: true },
      { source: '/pages/about-us', destination: '/about', permanent: true },
      { source: '/pages/our-story', destination: '/about', permanent: true },
      { source: '/pages/faq', destination: '/faq', permanent: true },
      { source: '/pages/contact', destination: '/contact', permanent: true },
      { source: '/pages/terms-of-service', destination: '/terms', permanent: true },
      { source: '/pages/find-your-ritual', destination: '/quiz', permanent: true },
      { source: '/pages/science-of-ghee', destination: '/about', permanent: true },
      { source: '/pages/ingredients', destination: '/about', permanent: true },
      { source: '/pages/glow-rious-ghee', destination: '/about', permanent: true },
      { source: '/pages/skincare-routine', destination: '/about', permanent: true },
      { source: '/pages/sensitive-skin', destination: '/collections/sensitive-skin', permanent: true },
      { source: '/pages/dry-skin-repair', destination: '/collections/dry-skin-repair', permanent: true },
      { source: '/pages/pigmentation-dull-skin', destination: '/collections/pigmentation-dull-skin', permanent: true },
      { source: '/policies/privacy-policy', destination: '/privacy', permanent: true },
      { source: '/policies/refund-policy', destination: '/shipping', permanent: true },
      { source: '/policies/shipping-policy', destination: '/shipping', permanent: true },
      { source: '/policies/terms-of-service', destination: '/terms', permanent: true },
      { source: '/pages/subscribe-and-save', destination: '/products', permanent: true },
      { source: '/pages/build-your-bundle', destination: '/products', permanent: true },
      { source: '/pages/refer-a-friend', destination: '/', permanent: true },
    ]
  },
}

export default nextConfig
