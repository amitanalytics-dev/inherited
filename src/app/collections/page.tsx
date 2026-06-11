import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { getCollections } from '@/lib/queries'
import type { Collection } from '@/types'

export const metadata: Metadata = {
  title: 'Collections',
  description: 'Browse our Ayurvedic skincare collections — curated rituals for every skin type and concern.',
}

export default async function CollectionsPage() {
  let collections: Collection[] = []
  try {
    collections = await getCollections(12)
  } catch {
    collections = []
  }

  const fallbackCollections = [
    { handle: 'face-care', title: 'Face Care', description: 'Ghee-powered formulas for radiant, nourished skin.', img: '/images/products/1_night_cream_HERO.jpg' },
    { handle: 'body-care', title: 'Body Care', description: 'Head-to-toe nourishment for skin that glows.', img: '/images/products/3_foot_cream_HERO.jpg' },
    { handle: 'gift-sets', title: 'Gift Sets', description: 'Beautifully curated rituals, ready to gift.', img: '/images/products/7_essentials_gift_HERO.jpg' },
    { handle: 'bundles', title: 'Bundles', description: 'Complete rituals at exceptional value.', img: '/images/products/8_luxury_pack_HERO.jpg' },
    { handle: 'best-sellers', title: 'Best Sellers', description: 'Our most-loved formulas, beloved by thousands.', img: '/images/products/_ALL13.jpg' },
    { handle: 'new-arrivals', title: 'New Arrivals', description: 'Fresh additions to the ritual.', img: '/images/products/5_radiance_serum_HERO.jpg' },
  ]

  return (
    <div className="min-h-screen bg-brand-cream pt-20">
      {/* Header */}
      <div className="bg-brand-warm border-b border-brand-warm/80 py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="font-body text-[11px] tracking-[0.35em] uppercase text-brand-amber mb-3">Curated Rituals</p>
          <h1 className="font-display font-semibold text-5xl md:text-6xl text-brand-dark">Collections</h1>
          <p className="font-body text-base text-brand-muted mt-4 max-w-lg mx-auto">
            Every collection tells the story of an ancient ritual, reborn for modern skin.
          </p>
        </div>
      </div>

      {/* Collections Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 md:py-20">
        {collections.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {collections.map((col) => (
              <Link key={col.id} href={`/collections/${col.handle}`} className="group block">
                <div className="relative aspect-[4/3] overflow-hidden bg-brand-warm mb-4">
                  {col.image ? (
                    <Image
                      src={col.image.url}
                      alt={col.image.altText ?? col.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full bg-brand-warm flex items-center justify-center">
                      <span className="font-display italic text-2xl text-brand-muted/40">{col.title}</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-brand-dark/0 group-hover:bg-brand-dark/10 transition-colors duration-300" />
                </div>
                <h2 className="font-display font-semibold text-2xl text-brand-dark group-hover:text-brand-amber transition-colors mb-1">
                  {col.title}
                </h2>
                {col.description && (
                  <p className="font-body text-sm text-brand-muted line-clamp-2">{col.description}</p>
                )}
                <span className="mt-2 inline-block font-body text-xs tracking-widest uppercase text-brand-amber border-b border-brand-amber/40 pb-0.5 hover:border-brand-amber transition-colors">
                  Shop Collection →
                </span>
              </Link>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {fallbackCollections.map((col) => (
              <Link key={col.handle} href={`/collections/${col.handle}`} className="group block">
                <div className="relative aspect-[4/3] overflow-hidden bg-brand-warm mb-4">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={col.img}
                    alt={col.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-brand-dark/0 group-hover:bg-brand-dark/10 transition-colors duration-300" />
                </div>
                <h2 className="font-display font-semibold text-2xl text-brand-dark group-hover:text-brand-amber transition-colors mb-1">
                  {col.title}
                </h2>
                <p className="font-body text-sm text-brand-muted">{col.description}</p>
                <span className="mt-2 inline-block font-body text-xs tracking-widest uppercase text-brand-amber border-b border-brand-amber/40 pb-0.5">
                  Shop Collection →
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
