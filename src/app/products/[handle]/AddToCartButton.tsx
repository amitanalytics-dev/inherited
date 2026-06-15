'use client'

import { useState } from 'react'
import { ShoppingBag, Zap } from 'lucide-react'
import { cartCreate, cartLinesAdd } from '@/lib/shopify'

interface AddToCartButtonProps {
  variantId: string | undefined
  available: boolean
}

export default function AddToCartButton({ variantId, available }: AddToCartButtonProps) {
  const [adding, setAdding] = useState(false)
  const [added, setAdded] = useState(false)
  const [buyingNow, setBuyingNow] = useState(false)
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

      const prev = parseInt(localStorage.getItem('cart_count') ?? '0', 10)
      localStorage.setItem('cart_count', String((isNaN(prev) ? 0 : prev) + 1))
      window.dispatchEvent(new Event('cart-updated'))

      setAdded(true)
      setTimeout(() => setAdded(false), 3000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add to cart')
    } finally {
      setAdding(false)
    }
  }

  async function handleBuyNow() {
    if (!variantId || !available) return

    setBuyingNow(true)
    setError(null)

    try {
      const result = await cartCreate([{ merchandiseId: variantId, quantity: 1 }])
      if (result.userErrors.length > 0) {
        throw new Error(result.userErrors[0].message)
      }
      const checkoutUrl = result.cart?.checkoutUrl
      if (checkoutUrl) {
        window.location.href = checkoutUrl
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to proceed to checkout')
      setBuyingNow(false)
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

      {available && (
        <button
          onClick={handleBuyNow}
          disabled={buyingNow}
          className="w-full flex items-center justify-center gap-3 py-4 font-body text-sm tracking-widest uppercase bg-brand-amber text-white hover:bg-[#b87f43] active:scale-[0.98] transition-all duration-300 disabled:opacity-60"
        >
          <Zap size={16} strokeWidth={1.5} />
          {buyingNow ? 'Redirecting...' : 'Buy Now'}
        </button>
      )}

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

      {/* Payment methods */}
      <div className="pt-4 mt-1">
        <p className="font-body text-[10px] tracking-widest uppercase text-brand-muted mb-2 text-center">Secure checkout · We accept</p>
        <div className="flex flex-wrap justify-center gap-1.5">
          {['Visa', 'Mastercard', 'Amex', 'Apple Pay', 'Google Pay', 'PayPal', 'Klarna'].map((method) => (
            <span
              key={method}
              className="px-2.5 py-1 border border-brand-warm rounded text-[10px] font-body font-medium text-brand-muted bg-white"
            >
              {method}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
