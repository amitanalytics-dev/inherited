'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ShoppingBag, Trash2, ArrowRight } from 'lucide-react'
import { cartCreate } from '@/lib/shopify'

interface CartLineItem {
  lineId: string
  variantId: string
  quantity: number
  productTitle: string
  variantTitle: string
  productHandle: string
  price: string
  currencyCode: string
  imageUrl?: string
}

export default function CartPage() {
  const [cartId, setCartId] = useState<string | null>(null)
  const [checkoutUrl, setCheckoutUrl] = useState<string | null>(null)
  const [items, setItems] = useState<CartLineItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const id = localStorage.getItem('cart_id')
    setCartId(id)

    // In a real implementation, you'd fetch cart details from Shopify
    // For now, we render a clean empty-or-redirect cart
    setLoading(false)
  }, [])

  async function handleCheckout() {
    if (checkoutUrl) {
      window.location.href = checkoutUrl
      return
    }

    if (!cartId) {
      // Create a new cart and go to checkout
      setError('Your cart is empty. Add some products first.')
      return
    }

    // If we have a cartId but no checkoutUrl cached, redirect to Shopify
    // In production you'd fetch the cart's checkoutUrl via the Storefront API
    const storefrontDomain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN
    window.location.href = `https://${storefrontDomain}/cart`
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-brand-cream pt-20 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-brand-amber border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="font-body text-sm text-brand-muted">Loading your bag...</p>
        </div>
      </div>
    )
  }

  if (!cartId || items.length === 0) {
    return (
      <div className="min-h-screen bg-brand-cream pt-20">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <ShoppingBag
            size={48}
            strokeWidth={1}
            className="text-brand-muted/40 mx-auto mb-6"
          />
          <h1 className="font-display font-semibold text-3xl text-brand-dark mb-3">
            Your Bag is Empty
          </h1>
          <p className="font-body text-base text-brand-muted mb-8">
            Add products to your bag to begin your ritual.
          </p>
          <Link
            href="/products"
            className="inline-flex items-center justify-center gap-2 px-10 py-4 bg-brand-amber text-white font-body text-xs tracking-widest uppercase hover:bg-[#a0693a] transition-colors"
          >
            Shop the Collection
            <ArrowRight size={14} />
          </Link>

          {/* Quiz suggestion */}
          <div className="mt-12 bg-brand-warm p-8">
            <p className="font-display italic text-xl text-brand-dark mb-2">
              Not sure where to start?
            </p>
            <p className="font-body text-sm text-brand-muted mb-5">
              Take our 3-question skin quiz for personalised recommendations.
            </p>
            <Link
              href="/quiz"
              className="inline-flex items-center justify-center px-8 py-3.5 border border-brand-dark text-brand-dark font-body text-xs tracking-widest uppercase hover:bg-brand-dark hover:text-brand-cream transition-colors"
            >
              Take the Skin Quiz
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-brand-cream pt-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <h1 className="font-display font-semibold text-4xl text-brand-dark mb-10">
          Your Bag
        </h1>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 font-body text-sm">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div
                key={item.lineId}
                className="flex gap-5 p-5 bg-white border border-brand-warm"
              >
                {item.imageUrl && (
                  <div className="relative w-20 h-20 flex-shrink-0 overflow-hidden bg-brand-warm">
                    <Image
                      src={item.imageUrl}
                      alt={item.productTitle}
                      fill
                      sizes="80px"
                      className="object-cover"
                    />
                  </div>
                )}
                <div className="flex-1">
                  <h3 className="font-display text-lg text-brand-dark">
                    {item.productTitle}
                  </h3>
                  {item.variantTitle !== 'Default Title' && (
                    <p className="font-body text-xs text-brand-muted mt-0.5">
                      {item.variantTitle}
                    </p>
                  )}
                  <div className="flex items-center justify-between mt-3">
                    <span className="font-body text-sm text-brand-dark">
                      Qty: {item.quantity}
                    </span>
                    <span className="font-body text-sm font-medium text-brand-dark">
                      {new Intl.NumberFormat('en-GB', {
                        style: 'currency',
                        currency: item.currencyCode,
                      }).format(parseFloat(item.price) * item.quantity)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="bg-brand-warm p-6 h-fit">
            <h2 className="font-display font-semibold text-xl text-brand-dark mb-5">
              Order Summary
            </h2>
            <div className="space-y-3 pb-5 border-b border-brand-warm/60 mb-5">
              <div className="flex justify-between font-body text-sm">
                <span className="text-brand-muted">Subtotal</span>
                <span className="text-brand-dark">
                  {new Intl.NumberFormat('en-GB', {
                    style: 'currency',
                    currency: 'GBP',
                  }).format(
                    items.reduce(
                      (sum, item) =>
                        sum + parseFloat(item.price) * item.quantity,
                      0
                    )
                  )}
                </span>
              </div>
              <div className="flex justify-between font-body text-sm">
                <span className="text-brand-muted">Shipping</span>
                <span className="text-brand-green font-medium">Free over £40</span>
              </div>
            </div>
            <button
              onClick={handleCheckout}
              className="w-full flex items-center justify-center gap-2 py-4 bg-brand-dark text-brand-cream font-body text-xs tracking-widest uppercase hover:bg-brand-amber transition-colors"
            >
              Checkout Securely
              <ArrowRight size={14} />
            </button>
            <p className="font-body text-xs text-brand-muted text-center mt-3">
              Secure checkout via Shopify
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
