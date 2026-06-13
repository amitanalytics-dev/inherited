import Link from 'next/link'
import ProductCard from '@/components/ui/ProductCard'
import Reveal from '@/components/ui/Reveal'
import type { Product } from '@/types'

interface BestsellerGridProps {
  products: Product[]
}

export default function BestsellerGrid({ products }: BestsellerGridProps) {
  const display = products.slice(0, 4)

  return (
    <section className="section-pad bg-brand-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <Reveal>
          <div className="text-center mb-6 md:mb-8">
            <p className="font-body text-[11px] tracking-[0.3em] uppercase text-brand-amber mb-3">
              Loved by 1,800+ Customers
            </p>
            <h2 className="font-display font-semibold text-4xl md:text-5xl lg:text-6xl text-brand-dark">
              Our Bestsellers
            </h2>
            <div className="w-16 h-px bg-brand-amber mx-auto mt-5" />
          </div>
        </Reveal>

        {/* Grid */}
        {display.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5 md:gap-6">
            {display.map((product, i) => (
              <Reveal key={product.id} delay={i * 0.1}>
                <ProductCard product={product} />
              </Reveal>
            ))}
          </div>
        ) : (
          // Fallback skeleton / placeholder
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5 md:gap-6">
            {[
              {
                img: '/images/products/1_night_cream_HERO.jpg',
                title: 'Overnight Rejuvenation Cream',
                price: '£34.99',
                type: 'Night Treatment',
                handle: 'overnight-rejuvenation-cream',
              },
              {
                img: '/images/products/2_deep_cream_HERO.jpg',
                title: 'Deep Nourishing Cream',
                price: '£24.99',
                type: 'Daily Moisturiser',
                handle: 'deep-nourishing-cream',
              },
              {
                img: '/images/products/5_radiance_serum_HERO.jpg',
                title: 'Radiance Serum',
                price: '£24.99',
                type: 'Serum',
                handle: 'radiance-serum',
              },
              {
                img: '/images/products/6_cleansing_balm_HERO.jpg',
                title: 'Ghee & Oat Cleansing Balm',
                price: '£20.00',
                type: 'Cleanser',
                handle: 'ghee-oat-cleansing-balm',
              },
            ].map((item) => (
              <Link
                key={item.handle}
                href={`/products/${item.handle}`}
                className="group block"
              >
                <div className="relative aspect-[4/5] bg-brand-warm overflow-hidden mb-4">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.img}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <p className="font-body text-[10px] tracking-widest uppercase text-brand-muted mb-1">
                  {item.type}
                </p>
                <h3 className="font-display text-lg text-brand-dark group-hover:text-brand-amber transition-colors">
                  {item.title}
                </h3>
                <p className="font-body text-sm font-medium text-brand-dark mt-1">
                  {item.price}
                </p>
              </Link>
            ))}
          </div>
        )}

        {/* CTA */}
        <Reveal delay={0.15}>
          <div className="text-center mt-8">
            <Link
              href="/products"
              className="inline-flex items-center justify-center px-10 py-4 border border-brand-dark text-brand-dark font-body text-xs tracking-widest uppercase hover:bg-brand-dark hover:text-brand-cream transition-colors"
            >
              View All Products
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
