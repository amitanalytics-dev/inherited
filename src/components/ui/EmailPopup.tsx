'use client'

import { useEffect, useState } from 'react'

const KLAVIYO_COMPANY_ID = 'WYzZWr'
const NEWSLETTER_LIST_ID = 'SvpFav'
const STORAGE_KEY = 'is_popup_dismissed'
const DELAY_MS = 6000

export default function EmailPopup() {
  const [visible, setVisible] = useState(false)
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'sending' | 'done' | 'error'>('idle')

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (localStorage.getItem(STORAGE_KEY)) return
    const t = setTimeout(() => setVisible(true), DELAY_MS)
    return () => clearTimeout(t)
  }, [])

  function dismiss() {
    localStorage.setItem(STORAGE_KEY, '1')
    setVisible(false)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email || status === 'sending') return
    setStatus('sending')
    try {
      const res = await fetch(
        `https://a.klaviyo.com/client/subscriptions/?company_id=${KLAVIYO_COMPANY_ID}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', revision: '2024-10-15' },
          body: JSON.stringify({
            data: {
              type: 'subscription',
              attributes: {
                profile: { data: { type: 'profile', attributes: { email } } },
                custom_source: 'popup_10off',
              },
              relationships: {
                list: { data: { type: 'list', id: NEWSLETTER_LIST_ID } },
              },
            },
          }),
        }
      )
      if (!res.ok && res.status !== 202) throw new Error()
      setStatus('done')
      localStorage.setItem(STORAGE_KEY, '1')
    } catch {
      setStatus('error')
    }
  }

  if (!visible) return null

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4"
      style={{ background: 'rgba(20,10,4,0.55)' }}
      onClick={(e) => { if (e.target === e.currentTarget) dismiss() }}
    >
      <div className="relative w-full max-w-md bg-brand-cream shadow-2xl overflow-hidden">
        {/* Top amber strip */}
        <div className="h-1 bg-brand-amber w-full" />

        {/* Close button */}
        <button
          onClick={dismiss}
          aria-label="Close"
          className="absolute top-4 right-4 text-brand-muted hover:text-brand-dark transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="px-8 py-10 text-center">
          {/* Pre-heading */}
          <p className="font-body text-[10px] tracking-[0.35em] uppercase text-brand-amber mb-3">
            Welcome Gift
          </p>

          {/* Heading */}
          <h2 className="font-display font-semibold text-3xl text-brand-dark leading-tight mb-2">
            10% off your<br /><em className="italic">first order</em>
          </h2>

          <p className="font-body text-sm text-brand-muted leading-relaxed mb-6">
            Join the ritual. Subscribe and receive your discount code straight to your inbox.
          </p>

          {status === 'done' ? (
            <div className="py-4">
              <div className="w-10 h-10 rounded-full bg-brand-green/10 flex items-center justify-center mx-auto mb-3">
                <svg className="w-5 h-5 text-brand-green" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <p className="font-body text-sm text-brand-dark font-medium">Check your inbox!</p>
              <p className="font-body text-xs text-brand-muted mt-1">Your 10% discount code is on its way.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                className="w-full px-4 py-3 border border-brand-warm bg-white font-body text-sm text-brand-dark placeholder-brand-muted/50 focus:outline-none focus:border-brand-amber transition-colors"
              />
              <button
                type="submit"
                disabled={status === 'sending'}
                className="w-full px-6 py-3.5 bg-brand-dark text-brand-cream font-body text-xs tracking-widest uppercase hover:bg-brand-amber transition-colors disabled:opacity-60"
              >
                {status === 'sending' ? 'Sending…' : 'Claim My 10% Off'}
              </button>
              {status === 'error' && (
                <p className="font-body text-xs text-red-500">Something went wrong — please try again.</p>
              )}
            </form>
          )}

          <button
            onClick={dismiss}
            className="mt-4 font-body text-[11px] text-brand-muted/60 hover:text-brand-muted underline underline-offset-2 transition-colors"
          >
            No thanks
          </button>
        </div>
      </div>
    </div>
  )
}
