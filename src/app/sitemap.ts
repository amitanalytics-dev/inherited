import type { MetadataRoute } from 'next'
import { FALLBACK_PRODUCTS, FALLBACK_COLLECTIONS, FALLBACK_ARTICLES } from '@/lib/fallback'
import { getProducts, getCollections, getArticles } from '@/lib/queries'
import { SITE_URL } from '@/lib/site-url'

const BASE = SITE_URL

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date()

  // Fetch live data; fall back to static snapshots if API is unavailable
  const [liveProducts, liveCollections, liveArticles] = await Promise.allSettled([
    getProducts(100),
    getCollections(50),
    getArticles(200),
  ])

  const productHandles =
    liveProducts.status === 'fulfilled' && liveProducts.value.length > 0
      ? liveProducts.value.map((p) => p.handle)
      : FALLBACK_PRODUCTS.map((p) => p.handle)

  const collectionHandles =
    liveCollections.status === 'fulfilled' && liveCollections.value.length > 0
      ? liveCollections.value.map((c) => c.handle)
      : FALLBACK_COLLECTIONS.map((c) => c.handle)

  const articleHandles =
    liveArticles.status === 'fulfilled' && liveArticles.value.length > 0
      ? liveArticles.value.map((a) => a.handle)
      : FALLBACK_ARTICLES.map((a) => a.handle)

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE, changeFrequency: 'weekly', priority: 1.0, lastModified: now },
    { url: `${BASE}/products`, changeFrequency: 'daily', priority: 0.9, lastModified: now },
    { url: `${BASE}/collections`, changeFrequency: 'weekly', priority: 0.8, lastModified: now },
    { url: `${BASE}/blog`, changeFrequency: 'daily', priority: 0.8, lastModified: now },
    { url: `${BASE}/quiz`, changeFrequency: 'monthly', priority: 0.7, lastModified: now },
    { url: `${BASE}/about`, changeFrequency: 'monthly', priority: 0.6, lastModified: now },
    { url: `${BASE}/reviews`, changeFrequency: 'weekly', priority: 0.6, lastModified: now },
    { url: `${BASE}/faq`, changeFrequency: 'monthly', priority: 0.6, lastModified: now },
    { url: `${BASE}/shipping`, changeFrequency: 'monthly', priority: 0.5, lastModified: now },
    { url: `${BASE}/contact`, changeFrequency: 'monthly', priority: 0.5, lastModified: now },
    { url: `${BASE}/privacy`, changeFrequency: 'yearly', priority: 0.3, lastModified: now },
    { url: `${BASE}/terms`, changeFrequency: 'yearly', priority: 0.3, lastModified: now },
  ]

  const products: MetadataRoute.Sitemap = productHandles.map((handle) => ({
    url: `${BASE}/products/${handle}`,
    changeFrequency: 'weekly',
    priority: 0.9,
    lastModified: now,
  }))

  const collections: MetadataRoute.Sitemap = collectionHandles.map((handle) => ({
    url: `${BASE}/collections/${handle}`,
    changeFrequency: 'weekly',
    priority: 0.8,
    lastModified: now,
  }))

  const articles: MetadataRoute.Sitemap = articleHandles.map((handle) => ({
    url: `${BASE}/blog/${handle}`,
    changeFrequency: 'monthly',
    priority: 0.6,
    lastModified: now,
  }))

  return [...staticRoutes, ...products, ...collections, ...articles]
}
