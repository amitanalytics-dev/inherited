import type { Metadata } from 'next'
import Link from 'next/link'
import { Search } from 'lucide-react'
import { searchProducts } from '@/lib/queries'
import ProductCard from '@/components/ui/ProductCard'
import type { Product } from '@/types'

export const metadata: Metadata = {
  title: 'Search',
  description: 'Search our Ayurvedic ghee-based skincare collection.',
}

export const dynamic = 'force-dynamic'

export default async function SearchPage({
  searchParams,
}: {
  searchParams: { q?: string }
}) {
  const q = (searchParams.q ?? '').trim()

  let products: Product[] = []
  if (q) {
    try {
      products = await searchProducts(q, 24)
    } catch {
      products = []
    }
  }

  return (
    <div className="min-h-screen bg-brand-cream pt-24 md:pt-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14">
        <form method="get" className="max-w-xl mx-auto mb-10">
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search
                size={18}
                strokeWidth={1.5}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-muted pointer-events-none"
              />
              <input
                type="text"
                name="q"
                defaultValue={q}
                placeholder="Search products..."
                autoFocus
                className="w-full bg-white border border-brand-warm font-body text-sm text-brand-dark pl-10 pr-3 py-3 focus:outline-none focus:border-brand-amber transition-colors"
              />
            </div>
            <button
              type="submit"
              className="bg-brand-dark text-brand-cream font-body text-xs tracking-widest uppercase px-6 py-3 hover:bg-brand-amber transition-colors"
            >
              Search
            </button>
          </div>
        </form>

        {!q ? (
          <div className="text-center py-10">
            <p className="font-display italic text-2xl text-brand-dark mb-2">
              What are you looking for?
            </p>
            <p className="font-body text-sm text-brand-muted">
              Search our Ayurvedic ghee skincare collection.
            </p>
          </div>
        ) : products.length > 0 ? (
          <>
            <h1 className="font-display font-semibold text-2xl md:text-3xl text-brand-dark mb-8">
              {products.length} result{products.length === 1 ? '' : 's'} for &ldquo;{q}&rdquo;
            </h1>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 md:gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-10">
            <Search
              size={40}
              strokeWidth={1}
              className="text-brand-muted/40 mx-auto mb-5"
            />
            <h1 className="font-display font-semibold text-2xl text-brand-dark mb-3">
              No results for &ldquo;{q}&rdquo;
            </h1>
            <p className="font-body text-sm text-brand-muted mb-7">
              No match found. Try a different term or browse all.
            </p>
            <Link
              href="/products"
              className="inline-flex items-center justify-center px-8 py-3.5 bg-brand-amber text-white font-body text-xs tracking-widest uppercase hover:bg-[#b87f43] transition-colors"
            >
              Shop All Products
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
