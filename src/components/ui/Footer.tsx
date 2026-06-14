'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { Instagram, Mail } from 'lucide-react'

const KLAVIYO_COMPANY_ID = 'WYzZWr'
const NEWSLETTER_LIST_ID = 'SvpFav'

function NewsletterForm() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'sending' | 'done' | 'error'>('idle')

  async function subscribe(e: React.FormEvent) {
    e.preventDefault()
    if (!email || status === 'sending') return
    setStatus('sending')
    try {
      const res = await fetch(
        `https://a.klaviyo.com/client/subscriptions/?company_id=${KLAVIYO_COMPANY_ID}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            revision: '2024-10-15',
          },
          body: JSON.stringify({
            data: {
              type: 'subscription',
              attributes: {
                profile: {
                  data: { type: 'profile', attributes: { email } },
                },
              },
              relationships: {
                list: { data: { type: 'list', id: NEWSLETTER_LIST_ID } },
              },
            },
          }),
        }
      )
      setStatus(res.ok || res.status === 202 ? 'done' : 'error')
    } catch {
      setStatus('error')
    }
  }

  if (status === 'done') {
    return (
      <p className="font-body text-sm text-brand-amber">
        Welcome to the ritual — check your inbox to confirm. ✨
      </p>
    )
  }

  return (
    <form className="flex gap-2" onSubmit={subscribe}>
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="your@email.com"
        className="flex-1 bg-white/10 border border-white/20 text-brand-cream placeholder:text-brand-cream/30 text-sm px-4 py-2.5 focus:outline-none focus:border-brand-amber transition-colors"
      />
      <button
        type="submit"
        disabled={status === 'sending'}
        className="bg-brand-amber text-white text-xs tracking-widest uppercase px-5 py-2.5 hover:bg-[#b87f43] transition-colors disabled:opacity-60"
      >
        {status === 'sending' ? '...' : 'Join'}
      </button>
      {status === 'error' && (
        <span className="sr-only">Something went wrong — please try again.</span>
      )}
    </form>
  )
}

const shopLinks = [
  { label: 'All Products', href: '/products' },
  { label: 'Sensitive Skin', href: '/collections/sensitive-skin' },
  { label: 'Dry Skin Repair', href: '/collections/dry-skin-repair' },
  { label: 'Pigmentation & Dull Skin', href: '/collections/pigmentation-dull-skin' },
  { label: 'Shop by Concern', href: '/collections/all' },
]

const brandLinks = [
  { label: 'Our Story', href: '/about' },
  { label: 'Skin Quiz', href: '/quiz' },
  { label: 'Reviews', href: '/reviews' },
  { label: 'Journal', href: '/blog' },
  { label: 'Ingredients', href: '/about#ingredients' },
]

const helpLinks = [
  { label: 'FAQ', href: '/faq' },
  { label: 'Shipping & Returns', href: '/shipping' },
  { label: 'Contact Us', href: '/contact' },
  { label: 'Privacy Policy', href: '/privacy' },
  { label: 'Terms of Service', href: '/terms' },
]

export default function Footer() {
  return (
    <footer className="relative bg-brand-dark text-brand-cream overflow-hidden">
      {/* Subtle botanical background — pomegranate illustration, cropped to hide URL strip */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <Image
          src="/images/brand/quote_1.png"
          alt=""
          fill
          sizes="100vw"
          className="object-cover object-top scale-[1.15] opacity-[0.07]"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-brand-dark/60 via-brand-dark/40 to-brand-dark/70" />
      </div>

      {/* Main footer */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-6">
          {/* Brand column */}
          <div className="lg:col-span-2">
            {/* Brand seal */}
            <div className="relative w-[90px] h-[90px] rounded-full overflow-hidden ring-1 ring-brand-amber/40 shadow-md mb-6">
              <Image
                src="/images/brand/badge_white_on_clay.jpg"
                alt="Handmade from glow-rious ghee — Inherited Skincare seal"
                fill
                sizes="90px"
                className="object-cover"
              />
            </div>
            <Link href="/" className="block mb-4">
              <span
                role="img"
                aria-label="Inherited Skincare"
                className="gold-shimmer-logo"
                style={{ width: 150, height: 48 }}
              />
            </Link>
            <p className="font-display italic text-brand-amber text-base mb-4">
              &ldquo;Ancient Wisdom. Modern Skin.&rdquo;
            </p>
            <p className="font-body text-sm text-brand-cream/60 leading-relaxed max-w-xs">
              Inspired by Grandma Leela&rsquo;s evening ghee ritual. Crafted with love in the UK.
            </p>

            {/* Newsletter */}
            <div className="mt-8">
              <p className="font-body text-xs tracking-widest uppercase text-brand-cream/50 mb-3">
                Join the Ritual
              </p>
              <NewsletterForm />
            </div>
          </div>

          {/* Shop links */}
          <div>
            <h3 className="font-body text-xs tracking-widest uppercase text-brand-cream/40 mb-5">
              Shop
            </h3>
            <ul className="space-y-3">
              {shopLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="font-body text-sm text-brand-cream/70 hover:text-brand-amber transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Brand links */}
          <div>
            <h3 className="font-body text-xs tracking-widest uppercase text-brand-cream/40 mb-5">
              Brand
            </h3>
            <ul className="space-y-3">
              {brandLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="font-body text-sm text-brand-cream/70 hover:text-brand-amber transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Help links */}
          <div>
            <h3 className="font-body text-xs tracking-widest uppercase text-brand-cream/40 mb-5">
              Help
            </h3>
            <ul className="space-y-3">
              {helpLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="font-body text-sm text-brand-cream/70 hover:text-brand-amber transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="relative z-10 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="font-body text-xs text-brand-cream/30">
            © {new Date().getFullYear()} Inherited Skincare. Made with ♥ in the UK.
          </p>
          <div className="flex items-center gap-4">
            <a
              href="https://www.instagram.com/inheritedskincare"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="text-brand-cream/40 hover:text-brand-amber transition-colors"
            >
              <Instagram size={18} strokeWidth={1.5} />
            </a>
            <a
              href="mailto:hello@inheritedskincare.com"
              aria-label="Email us"
              className="text-brand-cream/40 hover:text-brand-amber transition-colors"
            >
              <Mail size={18} strokeWidth={1.5} />
            </a>
          </div>
        </div>
      </div>

      {/* Powered by */}
      <div className="relative z-10 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 text-center">
          <p className="font-body text-[11px] tracking-wide text-brand-cream/30">
            Powered by{' '}
            <a
              href="https://www.aletheiaai.in/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand-cream/50 hover:text-brand-amber transition-colors underline underline-offset-2"
            >
              Aletheia AI
            </a>
          </p>
        </div>
      </div>
    </footer>
  )
}
