'use client'

import { useState } from 'react'
import { ShoppingBag } from 'lucide-react'
import { cartCreate, cartLinesAdd } from '@/lib/shopify'

interface AddToCartButtonProps {
  variantId: string | undefined
  available: boolean
}

export default function AddToCartButton({ variantId, available }: AddToCartButtonProps) {
  const [adding, setAdding] = useState(false)
  const [added, setAdded] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleAddToCart() {
    if (!variantId || !available) return

    setAdding(true)
    setError(null)

    try {
      const cartId = localStorage.getItem('cart_id')
      const line = { merchandiseId: variantId, quantity: 1 }

      let added = false
      if (cartId) {
        const result = await cartLinesAdd(cartId, [line])
        // A stale/expired/completed cart returns no cart — fall through to create
        if (result.cart?.id && result.userErrors.length === 0) {
          added = true
        }
      }

      if (!added) {
        const result = await cartCreate([line])
        if (result.userErrors.length > 0) {
          throw new Error(result.userErrors[0].message)
        }
        if (result.cart?.id) {
          localStorage.setItem('cart_id', result.cart.id)
        }
      }

      setAdded(true)
      setTimeout(() => setAdded(false), 3000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add to cart')
    } finally {
      setAdding(false)
    }
  }

  return (
    <div className="space-y-3">
      <button
        onClick={handleAddToCart}
        disabled={adding || !available}
        className={`w-full flex items-center justify-center gap-3 py-4 font-body text-sm tracking-widest uppercase transition-all duration-300 ${
          added
            ? 'bg-brand-green text-white'
            : available
            ? 'bg-brand-dark text-brand-cream hover:bg-brand-amber active:scale-[0.98]'
            : 'bg-brand-muted/40 text-brand-muted cursor-not-allowed'
        }`}
      >
        <ShoppingBag size={16} strokeWidth={1.5} />
        {adding ? 'Adding to Bag...' : added ? 'Added to Bag!' : available ? 'Add to Bag' : 'Sold Out'}
      </button>

      {error && (
        <p className="font-body text-xs text-red-600 text-center">{error}</p>
      )}

      {added && (
        <p className="font-body text-xs text-center text-brand-green">
          Added to your bag.{' '}
          <a href="/cart" className="underline underline-offset-2 hover:text-brand-amber transition-colors">
            View bag →
          </a>
        </p>
      )}
    </div>
  )
}
