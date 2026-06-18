'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { clsx } from 'clsx'
import { ShoppingBag } from 'lucide-react'
import type { Product } from '@/types'
import { cartCreate, cartLinesAdd } from '@/lib/shopify'
import reviewsData from '@/data/reviews.json'

interface ProductCardProps {
  product: Product
  className?: string
}

function formatPrice(amount: string, currencyCode: string): string {
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: currencyCode,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(parseFloat(amount))
}

export default function ProductCard({ product, className }: ProductCardProps) {
  const [hovered, setHovered] = useState(false)
  const [adding, setAdding] = useState(false)
  const [added, setAdded] = useState(false)

  const primaryImage = product.images[0]
  const secondaryImage = product.images[1]

  const defaultVariant = product.variants[0]
  const price = defaultVariant?.price ?? product.priceRange.minVariantPrice
  const compareAtPrice =
    defaultVariant?.compareAtPrice ??
    product.compareAtPriceRange?.minVariantPrice

  const hasDiscount =
    compareAtPrice &&
    parseFloat(compareAtPrice.amount) > parseFloat(price.amount)

  const allReviews = reviewsData as Record<string, { rating: number }[]>
  const productReviews = allReviews[product.handle] ?? []
  const avgRating =
    productReviews.length > 0
      ? productReviews.reduce((s, r) => s + r.rating, 0) / productReviews.length
      : null

  async function handleAddToCart(e: React.MouseEvent) {
    e.preventDefault()
    if (!defaultVariant) return

    setAdding(true)
    try {
      const cartId = localStorage.getItem('cart_id')
      const line = { merchandiseId: defaultVariant.id, quantity: 1 }

      if (cartId) {
        await cartLinesAdd(cartId, [line])
      } else {
        const result = await cartCreate([line])
        if (result.cart?.id) {
          localStorage.setItem('cart_id', result.cart.id)
        }
      }

      const prev = parseInt(localStorage.getItem('cart_count') ?? '0', 10)
      localStorage.setItem('cart_count', String((isNaN(prev) ? 0 : prev) + 1))
      window.dispatchEvent(new Event('cart-updated'))

      setAdded(true)
      setTimeout(() => setAdded(false), 2000)
    } catch (err) {
      console.error('Add to cart error:', err)
    } finally {
      setAdding(false)
    }
  }

  return (
    <Link
      href={`/products/${product.handle}`}
      className={clsx('group block', className)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Image container */}
      <div className="relative overflow-hidden bg-brand-warm aspect-[4/5] mb-4">
        {primaryImage && (
          <Image
            src={primaryImage.url}
            alt={primaryImage.altText ?? product.title}
            fill
            quality={85}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className={clsx(
              'object-cover transition-all duration-700',
              hovered && secondaryImage ? 'opacity-0' : 'opacity-100'
            )}
          />
        )}

        {secondaryImage && (
          <Image
            src={secondaryImage.url}
            alt={secondaryImage.altText ?? product.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className={clsx(
              'object-cover transition-all duration-700 absolute inset-0',
              hovered ? 'opacity-100' : 'opacity-0'
            )}
          />
        )}

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {hasDiscount && (
            <span className="bg-brand-amber text-white text-[10px] tracking-widest uppercase px-2.5 py-1 font-body">
              Sale
            </span>
          )}
          {!product.availableForSale && (
            <span className="bg-brand-dark text-brand-cream text-[10px] tracking-widest uppercase px-2.5 py-1 font-body">
              Sold Out
            </span>
          )}
        </div>

        {/* Add to cart overlay */}
        <div
          className={clsx(
            'absolute bottom-0 left-0 right-0 transition-all duration-300',
            hovered ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'
          )}
        >
          <button
            onClick={handleAddToCart}
            disabled={adding || !product.availableForSale}
            className={clsx(
              'w-full py-3.5 text-xs font-body tracking-widest uppercase flex items-center justify-center gap-2 transition-colors',
              added
                ? 'bg-brand-green text-white'
                : product.availableForSale
                ? 'bg-brand-dark text-brand-cream hover:bg-brand-amber'
                : 'bg-brand-muted/60 text-white cursor-not-allowed'
            )}
          >
            <ShoppingBag size={14} strokeWidth={1.5} />
            {adding
              ? 'Adding...'
              : added
              ? 'Added!'
              : product.availableForSale
              ? 'Add to Bag'
              : 'Sold Out'}
          </button>
        </div>
      </div>

      {/* Product info */}
      <div className="space-y-1.5">
        <p className="font-body text-[10px] tracking-widest uppercase text-brand-muted">
          {product.productType || product.vendor}
        </p>
        <h3 className="font-display text-base sm:text-lg font-medium text-brand-dark group-hover:text-brand-amber transition-colors leading-snug line-clamp-2 min-h-[2.8rem] sm:min-h-[3.2rem]">
          {product.title}
        </h3>
        <div className="flex items-center gap-2">
          <span className="font-body text-sm font-medium text-brand-dark">
            {formatPrice(price.amount, price.currencyCode)}
          </span>
          {hasDiscount && compareAtPrice && (
            <span className="font-body text-sm text-brand-muted line-through">
              {formatPrice(compareAtPrice.amount, compareAtPrice.currencyCode)}
            </span>
          )}
        </div>
        {avgRating !== null && (
          <div className="flex items-center gap-1 mt-1">
            {[1, 2, 3, 4, 5].map((s) => (
              <svg key={s} className="w-3 h-3" viewBox="0 0 20 20" fill={s <= Math.round(avgRating) ? '#C8923A' : 'none'} stroke="#C8923A" strokeWidth="1.5">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
            <span className="font-body text-[11px] text-brand-muted ml-0.5">({productReviews.length})</span>
          </div>
        )}
      </div>
    </Link>
  )
}
