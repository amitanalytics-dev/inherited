import type { Metadata } from 'next'
import { getProducts } from '@/lib/queries'
import ProductCard from '@/components/ui/ProductCard'
import type { Product } from '@/types'

export const metadata: Metadata = {
  title: 'All Products',
  description:
    'Shop our complete collection of Ayurvedic ghee-based skincare — from overnight creams to radiance serums, every formula crafted with ancient wisdom.',
}

export default async function ProductsPage() {
  let products: Product[] = []

  try {
    products = await getProducts(20)
  } catch {
    products = []
  }

  return (
    <div className="min-h-screen bg-brand-cream pt-24 md:pt-28">
      {/* Hero header */}
      <div className="bg-brand-warm border-b border-brand-warm/80 py-10 md:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="font-body text-[11px] tracking-[0.35em] uppercase text-brand-amber mb-3">
            The Collection
          </p>
          <h1 className="font-display font-semibold text-5xl md:text-6xl text-brand-dark">
            All Products
          </h1>
          <p className="font-body text-base text-brand-muted mt-4 max-w-lg mx-auto">
            Every formula rooted in Ayurvedic tradition, CPSR safety tested for
            modern skin.
          </p>
        </div>
      </div>

      {/* Products grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-12">
        {products.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 md:gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          /* Static fallback — token not yet configured */
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 md:gap-6">
            {[
              { img: '1_night_cream_HERO.jpg', title: 'Overnight Rejuvenation Cream', price: '£34.99', type: 'Night Treatment', handle: 'overnight-rejuvenation-cream' },
              { img: '2_deep_cream_HERO.jpg', title: 'Deep Nourishing Cream', price: '£24.99', type: 'Daily Moisturiser', handle: 'deep-nourishing-cream' },
              { img: '5_radiance_serum_HERO.jpg', title: 'Radiance Serum', price: '£24.99', type: 'Serum', handle: 'radiance-serum' },
              { img: '6_cleansing_balm_HERO.jpg', title: 'Ghee & Oat Cleansing Balm', price: '£20.00', type: 'Cleanser', handle: 'ghee-oat-cleansing-balm' },
              { img: '3_foot_cream_HERO.jpg', title: 'Ultimate Soothing Foot Cream', price: '£21.00', type: 'Body Care', handle: 'ultimate-soothing-foot-cream' },
              { img: '4_lip_set_HERO.jpg', title: 'Nourishing Lip Care Set', price: '£17.99', type: 'Lip Care', handle: 'nourishing-lip-care-set' },
              { img: '7_essentials_gift_HERO.jpg', title: 'Essentials Gift Set', price: '£25.00', type: 'Gift Set', handle: 'essentials-gift-set' },
              { img: '9_hand_foot_bundle_HERO.jpg', title: 'Hand & Foot Cream Bundle', price: '£40.00', type: 'Bundle', handle: 'hand-and-foot-cream-bundle' },
              { img: '10_night_time_bundle_HERO.jpg', title: 'Night Time Bundle', price: '£40.00', type: 'Bundle', handle: 'night-time-bundle' },
            ].map((item) => (
              <a key={item.handle} href={`/products/${item.handle}`} className="group block">
                <div className="relative aspect-[4/5] bg-brand-warm overflow-hidden mb-4">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={`/images/products/${item.img}`}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <p className="font-body text-[10px] tracking-widest uppercase text-brand-muted mb-1">{item.type}</p>
                <h3 className="font-display text-lg text-brand-dark group-hover:text-brand-amber transition-colors">{item.title}</h3>
                <p className="font-body text-sm font-medium mt-1">{item.price}</p>
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
