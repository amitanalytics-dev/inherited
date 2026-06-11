'use client'

import Link from 'next/link'
import { Instagram, Mail } from 'lucide-react'

const shopLinks = [
  { label: 'All Products', href: '/products' },
  { label: 'Collections', href: '/collections' },
  { label: 'Best Sellers', href: '/collections/best-sellers' },
  { label: 'Gift Sets', href: '/collections/gift-sets' },
  { label: 'Bundles', href: '/collections/bundles' },
]

const brandLinks = [
  { label: 'Our Story', href: '/about' },
  { label: 'Ritual Quiz', href: '/quiz' },
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
    <footer className="bg-brand-dark text-brand-cream">
      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8">
          {/* Brand column */}
          <div className="lg:col-span-2">
            <Link href="/" className="block mb-4">
              <span className="font-display font-semibold tracking-[0.2em] uppercase text-lg text-brand-cream">
                Inherited Skincare
              </span>
            </Link>
            <p className="font-display italic text-brand-amber text-base mb-4">
              &ldquo;Ancient Wisdom. Modern Skin.&rdquo;
            </p>
            <p className="font-body text-sm text-brand-cream/60 leading-relaxed max-w-xs">
              Ayurvedic ghee-based skincare born from a grandmother&rsquo;s recipe.
              Crafted with love in the UK, for skin that deserves the best of
              both worlds.
            </p>

            {/* Newsletter */}
            <div className="mt-8">
              <p className="font-body text-xs tracking-widest uppercase text-brand-cream/50 mb-3">
                Join the Ritual
              </p>
              <form
                className="flex gap-2"
                onSubmit={(e) => e.preventDefault()}
              >
                <input
                  type="email"
                  placeholder="your@email.com"
                  className="flex-1 bg-white/10 border border-white/20 text-brand-cream placeholder:text-brand-cream/30 text-sm px-4 py-2.5 focus:outline-none focus:border-brand-amber transition-colors"
                />
                <button
                  type="submit"
                  className="bg-brand-amber text-white text-xs tracking-widest uppercase px-5 py-2.5 hover:bg-[#a0693a] transition-colors"
                >
                  Join
                </button>
              </form>
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
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="font-body text-xs text-brand-cream/30">
            © {new Date().getFullYear()} Inherited Skincare. All rights reserved.
            Made with ♥ in the UK.
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
    </footer>
  )
}
