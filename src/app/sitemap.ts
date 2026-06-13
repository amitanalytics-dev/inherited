import type { MetadataRoute } from 'next'
import { FALLBACK_PRODUCTS, FALLBACK_COLLECTIONS, FALLBACK_ARTICLES } from '@/lib/fallback'
import { getArticles } from '@/lib/queries'
import { SITE_URL } from '@/lib/site-url'

const BASE = SITE_URL

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Pull every live article so all blog posts are discoverable; fall back to
  // the static snapshot if the Storefront API is unavailable.
  let articleHandles: string[] = []
  try {
    const live = await getArticles(100)
    articleHandles = live.map((a) => a.handle)
  } catch {
    articleHandles = []
  }
  if (articleHandles.length === 0) {
    articleHandles = FALLBACK_ARTICLES.map((a) => a.handle)
  }
  const staticRoutes = [
    '',
    '/products',
    '/collections',
    '/blog',
    '/quiz',
    '/about',
    '/reviews',
    '/faq',
    '/shipping',
    '/contact',
    '/privacy',
    '/terms',
  ].map((path) => ({
    url: `${BASE}${path}`,
    changeFrequency: 'weekly' as const,
    priority: path === '' ? 1 : 0.7,
  }))

  const products = FALLBACK_PRODUCTS.map((p) => ({
    url: `${BASE}/products/${p.handle}`,
    changeFrequency: 'weekly' as const,
    priority: 0.9,
  }))

  const collections = FALLBACK_COLLECTIONS.map((c) => ({
    url: `${BASE}/collections/${c.handle}`,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  const articles = articleHandles.map((handle) => ({
    url: `${BASE}/blog/${handle}`,
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }))

  return [...staticRoutes, ...products, ...collections, ...articles]
}
