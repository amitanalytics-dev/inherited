// Canonical public base URL for SEO (sitemap, robots, metadata, og).
// When the headless storefront goes live it runs on www, while Shopify's
// checkout stays on the apex (inheritedskincare.com). Override per-env with
// NEXT_PUBLIC_SITE_URL if needed.
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || 'https://shop.inheritedskincare.com'
).replace(/\/$/, '')
