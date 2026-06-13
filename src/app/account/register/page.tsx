'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function RegisterPage() {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await fetch('/api/account/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ firstName, lastName, email, password }),
      })
      const data = await res.json()
      if (data.success) {
        window.location.href = '/account'
        return
      }
      setError(data.error || 'Could not create your account.')
    } catch {
      setError('Something went wrong. Please try again.')
    }
    setLoading(false)
  }

  const inputClass =
    'w-full bg-brand-cream border border-brand-warm px-4 py-3 font-body text-sm text-brand-dark placeholder:text-brand-muted/40 focus:outline-none focus:ring-1 focus:ring-brand-amber focus:border-brand-amber transition-colors'
  const labelClass =
    'block font-body text-xs tracking-widest uppercase text-brand-muted mb-2'

  return (
    <div className="min-h-screen bg-brand-cream pt-24 md:pt-28">
      <div className="max-w-md mx-auto px-4 sm:px-6 py-12 md:py-16">
        <div className="text-center mb-8">
          <p className="font-body text-[11px] tracking-[0.35em] uppercase text-brand-amber mb-3">
            Join the Ritual
          </p>
          <h1 className="font-display font-semibold text-4xl md:text-5xl text-brand-dark">
            Create Account
          </h1>
        </div>

        <form
          onSubmit={submit}
          className="bg-white border border-brand-warm p-6 md:p-8 space-y-5"
        >
          {error && (
            <p className="font-body text-sm text-red-600 bg-red-50 border border-red-200 px-4 py-3">
              {error}
            </p>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label htmlFor="firstName" className={labelClass}>
                First Name
              </label>
              <input
                id="firstName"
                type="text"
                required
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Jane"
                className={inputClass}
              />
            </div>
            <div>
              <label htmlFor="lastName" className={labelClass}>
                Last Name
              </label>
              <input
                id="lastName"
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Smith"
                className={inputClass}
              />
            </div>
          </div>
          <div>
            <label htmlFor="email" className={labelClass}>
              Email Address
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="password" className={labelClass}>
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              minLength={5}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className={inputClass}
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full inline-flex items-center justify-center px-10 py-4 bg-brand-amber text-white font-body text-xs tracking-widest uppercase hover:bg-[#b87f43] transition-colors disabled:opacity-60"
          >
            {loading ? 'Creating…' : 'Create Account'}
          </button>
          <p className="font-body text-xs text-brand-muted text-center pt-1">
            Already have an account?{' '}
            <Link
              href="/account/login"
              className="text-brand-amber underline underline-offset-2"
            >
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </div>
  )
}
