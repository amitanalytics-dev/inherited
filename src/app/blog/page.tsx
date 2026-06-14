import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { getArticles } from '@/lib/queries'
import { FALLBACK_ARTICLES } from '@/lib/fallback'
import type { Article } from '@/types'

export const metadata: Metadata = {
  title: 'Journal',
  description:
    'The Inherited Skincare Journal — Ayurvedic wisdom, skincare rituals, ingredient spotlights, and the science of ghee-based beauty.',
}

const BLOG_PLACEHOLDERS = [
  '/images/lifestyle/life_1.jpg',
  '/images/lifestyle/life_2.jpg',
  '/images/lifestyle/life_3.jpg',
  '/images/lifestyle/life_4.jpg',
  '/images/lifestyle/life_5.jpg',
  '/images/lifestyle/life_6.jpg',
  '/images/brand/hero_lifestyle.jpg',
  '/images/brand/founder_suruchi.jpg',
  '/images/brand/suruchi_leela.jpg',
  '/images/reviews/review_priya.jpg',
  '/images/reviews/review_michelle.jpg',
  '/images/reviews/review_vandana.jpg',
  '/images/reviews/review_trisha.jpg',
  '/images/reviews/ba_1.jpg',
  '/images/reviews/ba_2.jpg',
  '/images/reviews/ba_3.jpg',
  '/images/reviews/ba_4.jpg',
  '/images/reviews/ba_5.jpg',
  '/images/products/1_night_cream_HERO.jpg',
  '/images/products/2_deep_cream_HERO.jpg',
]

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

export default async function BlogPage() {
  let articles: Article[] = []
  try {
    articles = await getArticles(100)
  } catch {
    articles = []
  }

  // Static fallback when the Storefront API is unavailable — every card
  // links to a real fallback article in /blog/[handle]
  const displayArticles = articles.length > 0 ? articles : FALLBACK_ARTICLES

  const featured = displayArticles[0]
  const rest = displayArticles.slice(1)

  return (
    <div className="min-h-screen bg-brand-cream pt-24 md:pt-28">
      {/* Header */}
      <div className="bg-brand-warm border-b border-brand-warm/80 py-10 md:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="font-body text-[11px] tracking-[0.35em] uppercase text-brand-amber mb-3">
            Wisdom & Ritual
          </p>
          <h1 className="font-display font-semibold text-5xl md:text-6xl text-brand-dark">
            The Journal
          </h1>
          <p className="font-body text-base text-brand-muted mt-4 max-w-lg mx-auto">
            Ayurvedic insights, ingredient deep-dives, and the art of the modern ritual.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-12">
        {/* Featured article */}
        {featured && (
          <Link
            href={`/blog/${featured.handle}`}
            className="group block mb-8 md:mb-10"
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
              <div className="relative aspect-[4/5] overflow-hidden bg-brand-warm">
                <Image
                  src={featured.image?.url ?? BLOG_PLACEHOLDERS[0]}
                  alt={featured.image?.altText ?? featured.title}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <div>
                <p className="font-body text-[10px] tracking-widest uppercase text-brand-amber mb-3">
                  Featured Article
                </p>
                <h2 className="font-display font-semibold text-3xl md:text-4xl text-brand-dark group-hover:text-brand-amber transition-colors mb-4 leading-tight">
                  {featured.title}
                </h2>
                {featured.excerpt && (
                  <p className="font-body text-base text-brand-muted leading-relaxed mb-5 line-clamp-3">
                    {featured.excerpt}
                  </p>
                )}
                <div className="flex items-center gap-3 font-body text-xs text-brand-muted">
                  <span>{featured.author.name}</span>
                  <span>·</span>
                  <span>{formatDate(featured.publishedAt)}</span>
                </div>
                <div className="mt-5">
                  <span className="font-body text-xs tracking-widest uppercase text-brand-amber border-b border-brand-amber/40 pb-0.5 group-hover:border-brand-amber transition-colors">
                    Read Article →
                  </span>
                </div>
              </div>
            </div>
          </Link>
        )}

        {/* Divider */}
        <div className="flex items-center gap-4 mb-6">
          <div className="flex-1 h-px bg-brand-warm" />
          <span className="font-body text-xs tracking-widest uppercase text-brand-muted">All Articles</span>
          <div className="flex-1 h-px bg-brand-warm" />
        </div>

        {/* Article grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-6">
          {rest.map((article, i) => (
            <Link key={article.handle} href={`/blog/${article.handle}`} className="group block">
              <div className="relative aspect-[4/5] overflow-hidden bg-brand-warm mb-5">
                <Image
                  src={article.image?.url ?? BLOG_PLACEHOLDERS[(i + 1) % BLOG_PLACEHOLDERS.length]}
                  alt={article.image?.altText ?? article.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <h3 className="font-display font-semibold text-xl text-brand-dark group-hover:text-brand-amber transition-colors mb-2 leading-snug">
                {article.title}
              </h3>
              {article.excerpt && (
                <p className="font-body text-sm text-brand-muted leading-relaxed mb-3 line-clamp-2">
                  {article.excerpt}
                </p>
              )}
              <div className="flex items-center gap-2 font-body text-xs text-brand-muted">
                <span>{article.author.name}</span>
                <span>·</span>
                <span>{formatDate(article.publishedAt)}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
