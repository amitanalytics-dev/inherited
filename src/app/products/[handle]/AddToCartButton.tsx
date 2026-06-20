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
  const [buyingNow, setBuyingNow] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleAddToCart() {
    if (!variantId || !available) return

    setAdding(true)
    setError(null)

    try {
      const cartId = localStorage.getItem('cart_id')
      const line = { merchandiseId: variantId, quantity: 1 }

      let newCartId: string | null = null
      let lineCount = 0

      if (cartId) {
        const result = await cartLinesAdd(cartId, [line])
        if (result.cart?.id && result.userErrors.length === 0) {
          newCartId = result.cart.id
          lineCount = result.cart.lines.edges.reduce(
            (sum: number, e: { node: { quantity: number } }) => sum + e.node.quantity,
            0
          )
        }
      }

      if (!newCartId) {
        const result = await cartCreate([line])
        if (result.userErrors.length > 0) {
          throw new Error(result.userErrors[0].message)
        }
        if (!result.cart?.id) {
          throw new Error('Cart could not be created')
        }
        newCartId = result.cart.id
        lineCount = result.cart.lines.edges.reduce(
          (sum: number, e: { node: { quantity: number } }) => sum + e.node.quantity,
          0
        )
      }

      localStorage.setItem('cart_id', newCartId)
      localStorage.setItem('cart_count', String(lineCount))
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
          className="w-full flex items-center justify-center gap-2 py-4 font-body text-sm tracking-wider bg-black text-white hover:bg-neutral-800 active:scale-[0.98] transition-all duration-300 disabled:opacity-60"
        >
          {buyingNow ? (
            <span className="tracking-widest uppercase text-sm">Redirecting...</span>
          ) : (
            <>
              {/* Apple logo */}
              <svg className="w-4 h-4 mb-0.5" viewBox="0 0 814 1000" fill="white" xmlns="http://www.w3.org/2000/svg">
                <path d="M788.1 340.9c-5.8 4.5-108.2 62.2-108.2 190.5 0 148.4 130.3 200.9 134.2 202.2-.6 3.2-20.7 71.9-68.7 141.9-42.8 61.6-87.5 123.1-155.5 123.1s-85.5-39.5-164-39.5c-76 0-103.7 40.8-165.9 40.8s-105-42.4-150.3-109.8c-52.3-75.4-95.1-192.5-95.1-304.1 0-204.9 135.4-313.1 268.6-313.1 71 0 130.1 46.9 175.1 46.9 42.9 0 110.1-49.6 190.1-49.6 30.3 0 108.2 2.6 164.2 98.7zm-234.1-183.4c31.1-36.9 53.1-88.1 53.1-139.3 0-7.1-.6-14.3-1.9-20.1-50.6 1.9-110.8 33.7-147.1 75.8-28.5 32.4-55.1 83.6-55.1 135.5 0 7.8 1.3 15.6 1.9 18.1 3.2.6 8.4 1.3 13.6 1.3 45.4 0 102.5-30.4 135.5-71.3z"/>
              </svg>
              <span>Pay</span>
            </>
          )}
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
