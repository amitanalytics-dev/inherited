'use client'

import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ShoppingBag, Trash2, ArrowRight, Minus, Plus, Loader2 } from 'lucide-react'
import {
  cartGet,
  cartLinesUpdate,
  cartLinesRemove,
  cartDiscountCodesUpdate,
  type CartData,
} from '@/lib/shopify'

function money(amount: string | number, currency = 'GBP') {
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency,
  }).format(typeof amount === 'string' ? parseFloat(amount) : amount)
}

export default function CartPage() {
  const [cart, setCart] = useState<CartData | null>(null)
  const [loading, setLoading] = useState(true)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [promo, setPromo] = useState('')
  const [promoError, setPromoError] = useState<string | null>(null)

  const load = useCallback(async () => {
    const id = localStorage.getItem('cart_id')
    if (!id) {
      setCart(null)
      setLoading(false)
      return
    }
    try {
      const c = await cartGet(id)
      if (!c) {
        // Cart expired or was completed — clear it
        localStorage.removeItem('cart_id')
        setCart(null)
      } else {
        setCart(c)
      }
    } catch {
      setError('We couldn’t load your bag just now. Please refresh.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  async function updateQty(lineId: string, quantity: number) {
    if (!cart || busy) return
    setBusy(true)
    setError(null)
    try {
      const updated =
        quantity <= 0
          ? await cartLinesRemove(cart.id, [lineId])
          : await cartLinesUpdate(cart.id, [{ id: lineId, quantity }])
      if (updated) setCart(updated)
    } catch {
      setError('Could not update your bag — please try again.')
    } finally {
      setBusy(false)
    }
  }

  async function applyPromo(e: React.FormEvent) {
    e.preventDefault()
    if (!cart || busy) return
    const code = promo.trim()
    if (!code) return
    setBusy(true)
    setPromoError(null)
    try {
      const updated = await cartDiscountCodesUpdate(cart.id, [code])
      if (updated) {
        setCart(updated)
        const entry = updated.discountCodes.find(
          (d) => d.code.toLowerCase() === code.toLowerCase()
        )
        if (entry && !entry.applicable) {
          setPromoError("That code isn't valid")
          await cartDiscountCodesUpdate(cart.id, [])
          const cleared = await cartGet(cart.id)
          if (cleared) setCart(cleared)
        } else {
          setPromo('')
        }
      }
    } catch {
      setPromoError("That code isn't valid")
    } finally {
      setBusy(false)
    }
  }

  async function removePromo() {
    if (!cart || busy) return
    setBusy(true)
    setPromoError(null)
    try {
      const updated = await cartDiscountCodesUpdate(cart.id, [])
      if (updated) setCart(updated)
    } catch {
      setError('Could not update your bag — please try again.')
    } finally {
      setBusy(false)
    }
  }

  function checkout() {
    if (cart?.checkoutUrl) window.location.href = cart.checkoutUrl
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-brand-cream pt-24 md:pt-28 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-brand-amber border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="font-body text-sm text-brand-muted">Loading your bag...</p>
        </div>
      </div>
    )
  }

  const lines = cart?.lines.edges.map((e) => e.node) ?? []

  if (!cart || lines.length === 0) {
    return (
      <div className="min-h-screen bg-brand-cream pt-24 md:pt-28">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
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
            className="inline-flex items-center justify-center gap-2 px-10 py-4 bg-brand-amber text-white font-body text-xs tracking-widest uppercase hover:bg-[#b87f43] transition-colors"
          >
            Shop the Collection
            <ArrowRight size={14} />
          </Link>

          <div className="mt-8 bg-brand-warm p-6">
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

  const currency = cart.cost.totalAmount.currencyCode
  const appliedDiscount = cart.discountCodes.find((d) => d.applicable)
  const discountAmount = cart.discountAllocations.reduce(
    (sum, a) => sum + parseFloat(a.discountedAmount.amount),
    0
  )

  // Shipping info: free over £55
  const subtotal = parseFloat(cart.cost.subtotalAmount.amount)
  const freeShippingThreshold = 55
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - subtotal)
  const progress = Math.min(100, (subtotal / freeShippingThreshold) * 100)

  return (
    <div className="min-h-screen bg-brand-cream pt-24 md:pt-28">
      {/* Shipping Progress Bar */}
      {remainingForFreeShipping > 0 && (
        <div className="bg-brand-dark text-white">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between mb-2">
              <span className="font-body text-sm">
                Add £{remainingForFreeShipping.toFixed(2)} more for free UK shipping
              </span>
              <span className="font-body text-xs text-brand-amber">
                {Math.round(progress)}%
              </span>
            </div>
            <div className="w-full h-2 bg-brand-dark/30 rounded overflow-hidden">
              <div
                className="h-full bg-brand-amber transition-all duration-500 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>
      )}

      {remainingForFreeShipping <= 0 && (
        <div className="bg-brand-amber text-white">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-3 text-center">
            <span className="font-body text-sm font-medium">✓ Free UK shipping on this order</span>
          </div>
        </div>
      )}

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
            {lines.map((line) => {
              const img = line.merchandise.product.images.edges[0]?.node
              return (
                <div
                  key={line.id}
                  className="flex gap-5 p-5 bg-white border border-brand-warm"
                >
                  {img && (
                    <Link
                      href={`/products/${line.merchandise.product.handle}`}
                      className="relative w-20 h-20 flex-shrink-0 overflow-hidden bg-brand-warm"
                    >
                      <Image
                        src={img.url}
                        alt={img.altText ?? line.merchandise.product.title}
                        fill
                        sizes="80px"
                        className="object-cover"
                      />
                    </Link>
                  )}
                  <div className="flex-1">
                    <Link
                      href={`/products/${line.merchandise.product.handle}`}
                      className="font-display text-lg text-brand-dark hover:text-brand-amber transition-colors"
                    >
                      {line.merchandise.product.title}
                    </Link>
                    {line.merchandise.title !== 'Default Title' && (
                      <p className="font-body text-xs text-brand-muted mt-0.5">
                        {line.merchandise.title}
                      </p>
                    )}
                    <div className="flex items-center justify-between mt-3">
                      {/* Quantity stepper */}
                      <div className="flex items-center border border-brand-warm">
                        <button
                          aria-label="Decrease quantity"
                          disabled={busy}
                          onClick={() => updateQty(line.id, line.quantity - 1)}
                          className="px-2.5 py-1.5 text-brand-muted hover:text-brand-dark disabled:opacity-40"
                        >
                          <Minus size={13} />
                        </button>
                        <span className="px-3 font-body text-sm text-brand-dark min-w-[2rem] text-center">
                          {line.quantity}
                        </span>
                        <button
                          aria-label="Increase quantity"
                          disabled={busy}
                          onClick={() => updateQty(line.id, line.quantity + 1)}
                          className="px-2.5 py-1.5 text-brand-muted hover:text-brand-dark disabled:opacity-40"
                        >
                          <Plus size={13} />
                        </button>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="font-body text-sm font-medium text-brand-dark">
                          {money(
                            parseFloat(line.merchandise.price.amount) *
                              line.quantity,
                            line.merchandise.price.currencyCode
                          )}
                        </span>
                        <button
                          aria-label="Remove item"
                          disabled={busy}
                          onClick={() => updateQty(line.id, 0)}
                          className="text-brand-muted/60 hover:text-red-600 transition-colors disabled:opacity-40"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
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
                  {money(cart.cost.subtotalAmount.amount, currency)}
                </span>
              </div>
              {appliedDiscount && (
                <div className="flex justify-between font-body text-sm">
                  <span className="text-brand-green">
                    Discount ({appliedDiscount.code})
                  </span>
                  <span className="text-brand-green font-medium">
                    −{money(discountAmount, currency)}
                  </span>
                </div>
              )}
              <div className="flex justify-between font-body text-sm">
                <span className="text-brand-muted">Shipping</span>
                <span className="text-brand-green font-medium">
                  Calculated at checkout
                </span>
              </div>
              {appliedDiscount && (
                <div className="flex justify-between font-body text-sm pt-2">
                  <span className="text-brand-dark font-medium">Total</span>
                  <span className="text-brand-dark font-medium">
                    {money(cart.cost.totalAmount.amount, currency)}
                  </span>
                </div>
              )}
            </div>

            {/* Promo code */}
            <div className="mb-5">
              {appliedDiscount ? (
                <div className="flex items-center justify-between bg-white border border-brand-warm px-3 py-2.5">
                  <span className="font-body text-sm text-brand-dark">
                    Code <span className="font-medium text-brand-amber">{appliedDiscount.code}</span> applied
                  </span>
                  <button
                    type="button"
                    onClick={removePromo}
                    disabled={busy}
                    className="font-body text-xs uppercase tracking-widest text-brand-muted hover:text-red-600 transition-colors disabled:opacity-40"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={applyPromo} className="flex gap-2">
                  <input
                    type="text"
                    value={promo}
                    onChange={(e) => setPromo(e.target.value)}
                    disabled={busy}
                    placeholder="Promo code"
                    className="flex-1 min-w-0 bg-white border border-brand-warm font-body text-sm text-brand-dark px-3 py-2.5 focus:outline-none focus:border-brand-amber transition-colors disabled:opacity-50"
                  />
                  <button
                    type="submit"
                    disabled={busy}
                    className="bg-brand-amber text-white font-body text-xs tracking-widest uppercase px-4 py-2.5 hover:bg-[#b87f43] transition-colors disabled:opacity-60"
                  >
                    Apply
                  </button>
                </form>
              )}
              {promoError && (
                <p className="font-body text-xs text-red-600 mt-2">{promoError}</p>
              )}
            </div>

            <button
              onClick={checkout}
              disabled={busy}
              className="w-full flex items-center justify-center gap-2 py-4 bg-brand-dark text-brand-cream font-body text-xs tracking-widest uppercase hover:bg-brand-amber transition-colors disabled:opacity-60"
            >
              {busy ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <>
                  Checkout Securely
                  <ArrowRight size={14} />
                </>
              )}
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
