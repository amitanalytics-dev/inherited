import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getProduct, getRelatedProducts } from '@/lib/queries'
import { getFallbackProduct, getFallbackRelated } from '@/lib/fallback'
import ProductCard from '@/components/ui/ProductCard'
import AddToCartButton from './AddToCartButton'
import type { Product } from '@/types'

interface PageProps {
  params: { handle: string }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  try {
    const product = (await getProduct(params.handle)) ?? getFallbackProduct(params.handle)
    if (!product) return { title: 'Product Not Found' }
    return {
      title: product.seo.title ?? product.title,
      description: product.seo.description ?? product.description,
      openGraph: {
        images: product.images[0] ? [{ url: product.images[0].url }] : [],
      },
    }
  } catch {
    return { title: 'Product' }
  }
}

export default async function ProductPage({ params }: PageProps) {
  let product: Product | null = null
  let related: Product[] = []

  try {
    product = await getProduct(params.handle)
    if (product) {
      related = await getRelatedProducts(product.id, 4)
    }
  } catch {
    // Fallback handled below
  }

  // Static fallback when the Storefront API is unavailable
  if (!product) {
    product = getFallbackProduct(params.handle)
    if (product) {
      related = getFallbackRelated(params.handle, 4)
    }
  }

  if (!product) {
    notFound()
  }

  const primaryImage = product.images[0]
  const price = product.variants[0]?.price ?? product.priceRange.minVariantPrice
  const compareAtPrice =
    product.variants[0]?.compareAtPrice ?? product.compareAtPriceRange?.minVariantPrice

  const formattedPrice = new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: price.currencyCode,
    minimumFractionDigits: 0,
  }).format(parseFloat(price.amount))

  const hasDiscount =
    compareAtPrice &&
    parseFloat(compareAtPrice.amount) > parseFloat(price.amount)

  const formattedCompare = hasDiscount
    ? new Intl.NumberFormat('en-GB', {
        style: 'currency',
        currency: compareAtPrice!.currencyCode,
        minimumFractionDigits: 0,
      }).format(parseFloat(compareAtPrice!.amount))
    : null

  const ingredients = product.metafields?.find((m) => m?.key === 'ingredients')
  const howToUse = product.metafields?.find((m) => m?.key === 'how_to_use')

  return (
    <div className="min-h-screen bg-brand-cream pt-24 md:pt-28">
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <nav className="flex items-center gap-2 font-body text-xs text-brand-muted">
          <Link href="/" className="hover:text-brand-amber transition-colors">Home</Link>
          <span>/</span>
          <Link href="/products" className="hover:text-brand-amber transition-colors">Products</Link>
          <span>/</span>
          <span className="text-brand-dark">{product.title}</span>
        </nav>
      </div>

      {/* Product main */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Images */}
          <div className="space-y-3">
            <div className="relative aspect-[4/5] overflow-hidden bg-brand-warm">
              {primaryImage && (
                <Image
                  src={primaryImage.url}
                  alt={primaryImage.altText ?? product.title}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
              )}
            </div>
            {product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {product.images.slice(1, 5).map((img, i) => (
                  <div key={i} className="relative aspect-square overflow-hidden bg-brand-warm">
                    <Image
                      src={img.url}
                      alt={img.altText ?? `${product.title} view ${i + 2}`}
                      fill
                      sizes="25vw"
                      className="object-contain"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div className="lg:pt-4">
            {/* Tags */}
            {product.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-4">
                {product.tags.slice(0, 3).map((tag) => (
                  <span key={tag} className="font-body text-[10px] tracking-widest uppercase text-brand-amber bg-brand-amber/10 px-2.5 py-1">
                    {tag}
                  </span>
                ))}
              </div>
            )}

            <h1 className="font-display font-semibold text-4xl md:text-5xl text-brand-dark leading-tight mb-4">
              {product.title}
            </h1>

            {/* Price */}
            <div className="flex items-center gap-3 mb-6">
              <span className="font-body text-2xl font-medium text-brand-dark">
                {formattedPrice}
              </span>
              {formattedCompare && (
                <span className="font-body text-lg text-brand-muted line-through">
                  {formattedCompare}
                </span>
              )}
              {!product.availableForSale && (
                <span className="font-body text-xs tracking-widest uppercase text-white bg-brand-muted px-3 py-1">
                  Sold Out
                </span>
              )}
            </div>

            {/* Description */}
            <div className="font-body text-base text-brand-muted leading-relaxed mb-8 space-y-3">
              <p>{product.description}</p>
            </div>

            {/* Variant selector */}
            {product.variants.length > 1 && (
              <div className="mb-6">
                <p className="font-body text-xs tracking-widest uppercase text-brand-muted mb-2">
                  {product.variants[0].selectedOptions[0]?.name ?? 'Option'}
                </p>
                <div className="flex flex-wrap gap-2">
                  {product.variants.map((variant) => (
                    <button
                      key={variant.id}
                      disabled={!variant.availableForSale}
                      className="px-4 py-2 border border-brand-dark/20 font-body text-sm hover:border-brand-amber hover:text-brand-amber transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      {variant.title}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Add to Cart */}
            <AddToCartButton
              variantId={product.variants[0]?.id}
              available={product.availableForSale}
            />

            {/* Trust badges */}
            <div className="mt-6 grid grid-cols-3 gap-3 py-5 border-t border-b border-brand-warm">
              {[
                { icon: '🌿', label: 'Natural ingredients' },
                { icon: '🐇', label: 'Cruelty Free' },
                { icon: '🇬🇧', label: 'Made in UK' },
              ].map((badge) => (
                <div key={badge.label} className="flex flex-col items-center text-center gap-1">
                  <span className="text-xl">{badge.icon}</span>
                  <span className="font-body text-[10px] tracking-widest uppercase text-brand-muted">
                    {badge.label}
                  </span>
                </div>
              ))}
            </div>

            {/* How to use */}
            {howToUse?.value && (
              <div className="mt-6">
                <h3 className="font-display font-semibold text-xl text-brand-dark mb-2">
                  How to Use
                </h3>
                <p className="font-body text-sm text-brand-muted leading-relaxed">
                  {howToUse.value}
                </p>
              </div>
            )}

            {/* Ingredients */}
            {ingredients?.value && (
              <div className="mt-5">
                <h3 className="font-display font-semibold text-xl text-brand-dark mb-2">
                  Ingredients
                </h3>
                <p className="font-body text-xs text-brand-muted/70 leading-relaxed">
                  {ingredients.value}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Related products */}
      {related.length > 0 && (
        <div className="bg-brand-warm py-10 md:py-12 mt-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="font-display font-semibold text-3xl md:text-4xl text-brand-dark text-center mb-6">
              Complete the Ritual
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-5 md:gap-6">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
