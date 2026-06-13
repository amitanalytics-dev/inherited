'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function RecoverPage() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      await fetch('/api/account/recover', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
    } catch {
      // intentionally ignore — response is always the same
    }
    setSent(true)
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-brand-cream pt-24 md:pt-28">
      <div className="max-w-md mx-auto px-4 sm:px-6 py-12 md:py-16">
        <div className="text-center mb-8">
          <p className="font-body text-[11px] tracking-[0.35em] uppercase text-brand-amber mb-3">
            Account Recovery
          </p>
          <h1 className="font-display font-semibold text-4xl md:text-5xl text-brand-dark">
            Reset Password
          </h1>
        </div>

        <div className="bg-white border border-brand-warm p-6 md:p-8">
          {sent ? (
            <div className="space-y-5 text-center">
              <p className="font-body text-sm text-brand-dark">
                If that email exists, we&rsquo;ve sent a reset link.
              </p>
              <Link
                href="/account/login"
                className="inline-flex items-center justify-center px-10 py-4 bg-brand-amber text-white font-body text-xs tracking-widest uppercase hover:bg-[#b87f43] transition-colors"
              >
                Back to Sign In
              </Link>
            </div>
          ) : (
            <form onSubmit={submit} className="space-y-5">
              <div>
                <label
                  htmlFor="email"
                  className="block font-body text-xs tracking-widest uppercase text-brand-muted mb-2"
                >
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="w-full bg-brand-cream border border-brand-warm px-4 py-3 font-body text-sm text-brand-dark placeholder:text-brand-muted/40 focus:outline-none focus:ring-1 focus:ring-brand-amber focus:border-brand-amber transition-colors"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full inline-flex items-center justify-center px-10 py-4 bg-brand-amber text-white font-body text-xs tracking-widest uppercase hover:bg-[#b87f43] transition-colors disabled:opacity-60"
              >
                {loading ? 'Sending…' : 'Send Reset Link'}
              </button>
              <p className="font-body text-xs text-brand-muted text-center pt-1">
                <Link
                  href="/account/login"
                  className="text-brand-amber underline underline-offset-2"
                >
                  Back to sign in
                </Link>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
