import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { getArticles } from '@/lib/queries'
import type { Article } from '@/types'

export const metadata: Metadata = {
  title: 'Journal',
  description:
    'The Inherited Skincare Journal — Ayurvedic wisdom, skincare rituals, ingredient spotlights, and the science of ghee-based beauty.',
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

const fallbackArticles = [
  {
    handle: 'the-power-of-ghee-for-skin',
    blogHandle: 'news',
    title: 'The Power of Ghee: Why This Ancient Ingredient Is the Future of Skincare',
    excerpt: 'For over 5,000 years, Ayurvedic healers have known what modern dermatology is only just beginning to confirm: ghee is one of the most bioavailable, skin-loving substances on earth.',
    publishedAt: '2024-03-15',
    author: { name: 'Suruchi Sethi' },
    image: { url: '/images/products/1_night_cream_HERO.jpg', altText: 'Ghee skincare', width: 800, height: 600 },
  },
  {
    handle: 'your-morning-ritual-guide',
    blogHandle: 'news',
    title: 'The Perfect Ayurvedic Morning Ritual: 5 Minutes to Radiant Skin',
    excerpt: 'In Ayurveda, how you begin your morning sets the tone for your entire day — and your skin\'s appearance. Here\'s how to build a morning ritual that works.',
    publishedAt: '2024-02-28',
    author: { name: 'Suruchi Sethi' },
    image: { url: '/images/products/5_radiance_serum_HERO.jpg', altText: 'Morning ritual', width: 800, height: 600 },
  },
  {
    handle: 'understanding-your-skin-type',
    blogHandle: 'news',
    title: 'Understanding Your Skin Type Through the Ayurvedic Lens (Doshas)',
    excerpt: 'Western skincare categorises skin as dry, oily, or combination. Ayurveda goes deeper — your skin type is an expression of your unique constitution, or Prakriti.',
    publishedAt: '2024-02-10',
    author: { name: 'Dr. Priya Mehta' },
    image: { url: '/images/products/2_deep_cream_HERO.jpg', altText: 'Skin types', width: 800, height: 600 },
  },
  {
    handle: 'the-art-of-face-massage',
    blogHandle: 'news',
    title: 'The Ancient Art of Abhyanga: Why Face Massage Is the Missing Step in Your Routine',
    excerpt: 'Abhyanga, the Ayurvedic practice of warm oil massage, has been used for centuries to promote circulation, lymphatic drainage, and a lasting glow.',
    publishedAt: '2024-01-25',
    author: { name: 'Suruchi Sethi' },
    image: { url: '/images/products/6_cleansing_balm_HERO.jpg', altText: 'Face massage', width: 800, height: 600 },
  },
  {
    handle: 'turmeric-for-skin',
    blogHandle: 'news',
    title: 'Turmeric for Skin: The Golden Spice That Transforms Complexion',
    excerpt: 'Long before it became a wellness trend, turmeric was the cornerstone of Ayurvedic beauty rituals. Here\'s the science behind its skin-transforming power.',
    publishedAt: '2024-01-08',
    author: { name: 'Dr. Priya Mehta' },
    image: { url: '/images/products/_ALL13.jpg', altText: 'Turmeric skincare', width: 800, height: 600 },
  },
  {
    handle: 'winter-skincare-routine',
    blogHandle: 'news',
    title: 'Winter Ritual: How to Protect and Nourish Your Skin Through the Cold Months',
    excerpt: 'Winter in the UK is particularly harsh on skin. Ayurvedic tradition has always adapted rituals to the seasons — here\'s your cold-weather protocol.',
    publishedAt: '2023-11-20',
    author: { name: 'Suruchi Sethi' },
    image: { url: '/images/products/3_foot_cream_HERO.jpg', altText: 'Winter skincare', width: 800, height: 600 },
  },
]

export default async function BlogPage() {
  let articles: Article[] = []
  try {
    articles = await getArticles(12)
  } catch {
    articles = []
  }

  const displayArticles = articles.length > 0 ? articles : fallbackArticles

  const featured = displayArticles[0]
  const rest = displayArticles.slice(1)

  return (
    <div className="min-h-screen bg-brand-cream pt-20">
      {/* Header */}
      <div className="bg-brand-warm border-b border-brand-warm/80 py-16 md:py-20">
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 md:py-20">
        {/* Featured article */}
        {featured && (
          <Link
            href={`/blog/${featured.handle}`}
            className="group block mb-14 md:mb-20"
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
              <div className="relative aspect-[16/10] overflow-hidden bg-brand-warm">
                {featured.image ? (
                  <Image
                    src={featured.image.url}
                    alt={featured.image.altText ?? featured.title}
                    fill
                    priority
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full bg-brand-warm" />
                )}
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
        <div className="flex items-center gap-4 mb-10">
          <div className="flex-1 h-px bg-brand-warm" />
          <span className="font-body text-xs tracking-widest uppercase text-brand-muted">All Articles</span>
          <div className="flex-1 h-px bg-brand-warm" />
        </div>

        {/* Article grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
          {rest.map((article) => (
            <Link key={article.handle} href={`/blog/${article.handle}`} className="group block">
              <div className="relative aspect-[16/10] overflow-hidden bg-brand-warm mb-5">
                {article.image ? (
                  <Image
                    src={article.image.url}
                    alt={article.image.altText ?? article.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full bg-brand-warm" />
                )}
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
