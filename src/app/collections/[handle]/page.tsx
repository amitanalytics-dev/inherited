import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getCollection } from '@/lib/queries'
import ProductCard from '@/components/ui/ProductCard'

interface PageProps {
  params: { handle: string }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  try {
    const collection = await getCollection(params.handle)
    if (!collection) return { title: 'Collection Not Found' }
    return {
      title: collection.seo.title ?? collection.title,
      description: collection.seo.description ?? collection.description,
    }
  } catch {
    return { title: 'Collection' }
  }
}

export default async function CollectionPage({ params }: PageProps) {
  let collection = null

  try {
    collection = await getCollection(params.handle, 24)
  } catch {
    // fallback
  }

  if (!collection) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-brand-cream pt-20">
      {/* Header */}
      <div className="bg-brand-warm border-b border-brand-warm/80 py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="font-body text-[11px] tracking-[0.35em] uppercase text-brand-amber mb-3">
            Collection
          </p>
          <h1 className="font-display font-semibold text-5xl md:text-6xl text-brand-dark">
            {collection.title}
          </h1>
          {collection.description && (
            <p className="font-body text-base text-brand-muted mt-4 max-w-xl mx-auto">
              {collection.description}
            </p>
          )}
        </div>
      </div>

      {/* Products */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 md:py-20">
        {collection.products.length > 0 ? (
          <>
            <p className="font-body text-xs text-brand-muted mb-8">
              {collection.products.length} product{collection.products.length !== 1 ? 's' : ''}
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 md:gap-8">
              {collection.products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-20">
            <p className="font-display italic text-2xl text-brand-muted">
              This collection is coming soon.
            </p>
            <a
              href="/products"
              className="mt-6 inline-flex items-center justify-center px-8 py-3.5 bg-brand-amber text-white font-body text-xs tracking-widest uppercase hover:bg-[#a0693a] transition-colors"
            >
              Shop All Products
            </a>
          </div>
        )}
      </div>
    </div>
  )
}
