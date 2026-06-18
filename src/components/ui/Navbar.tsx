'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { clsx } from 'clsx'
import { Menu, X, ShoppingBag, User, Search } from 'lucide-react'
import { motion, useScroll } from 'framer-motion'

const navLinksAfterConcern = [
  { label: 'Skin Quiz', href: '/quiz' },
  { label: 'Our Story', href: '/about' },
  { label: 'Journal', href: '/blog' },
  { label: 'Reviews', href: '/reviews' },
]

const concernLinks = [
  { label: 'Sensitive Skin', href: '/collections/sensitive-skin' },
  { label: 'Dry Skin Repair', href: '/collections/dry-skin-repair' },
  { label: 'Dullness & Uneven Tone', href: '/collections/pigmentation-dull-skin' },
]

const DEFAULT_ANNOUNCEMENT =
  'Free UK shipping over £55 · Handmade in UK · 5.0★ · 1,800+ customers'

export default function Navbar({
  announcement = DEFAULT_ANNOUNCEMENT,
}: {
  announcement?: string
}) {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [concernOpen, setConcernOpen] = useState(false)
  const [cartCount, setCartCount] = useState(0)
  const { scrollYProgress } = useScroll()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close mobile menu on route change / resize
  useEffect(() => {
    const close = () => setMobileOpen(false)
    window.addEventListener('resize', close)
    return () => window.removeEventListener('resize', close)
  }, [])

  // Cart count — reads from localStorage, updates on cart-updated event
  useEffect(() => {
    const update = () => {
      const n = parseInt(localStorage.getItem('cart_count') ?? '0', 10)
      setCartCount(isNaN(n) ? 0 : n)
    }
    update()
    window.addEventListener('cart-updated', update)
    return () => window.removeEventListener('cart-updated', update)
  }, [])

  return (
    <>
      {/* Scroll progress bar */}
      <motion.div
        aria-hidden="true"
        className="fixed top-0 left-0 right-0 h-[2px] bg-brand-amber origin-left z-[60] will-change-transform"
        style={{ scaleX: scrollYProgress }}
      />
      <header
        className={clsx(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-500 bg-brand-cream/95 backdrop-blur-md',
          scrolled && 'shadow-sm'
        )}
      >
        {/* Announcement bar */}
        <div className="bg-brand-dark text-brand-cream">
          <p className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-8 flex items-center justify-center font-body text-[10px] sm:text-[11px] tracking-[0.15em] uppercase text-center">
            {announcement.split(/(\S*★\S*)/g).map((part, i) =>
              part.includes('★') ? (
                <span key={i} className="text-brand-amber">
                  {part}
                </span>
              ) : (
                <span key={i}>{part}</span>
              )
            )}
          </p>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <Link href="/" className="flex-shrink-0 group flex items-center gap-3">
              <span
                role="img"
                aria-label="Inherited Skincare"
                className="gold-shimmer-logo"
                style={{ width: 'clamp(120px, 35vw, 176px)', height: 'clamp(38px, 11vw, 56px)' }}
              />
            </Link>

            {/* Desktop Nav + Icons — Right aligned */}
            <div className="hidden md:flex items-center gap-8 ml-auto">
              {/* Desktop Nav */}
              <nav className="flex items-center gap-8">
                {/* Shop */}
                <Link
                  href="/products"
                  className="font-body text-xs tracking-widest uppercase link-hover transition-colors duration-300 text-brand-dark/80 hover:text-brand-dark"
                >
                  Shop
                </Link>

                {/* Shop by Concern Dropdown — right after Shop */}
                <div className="relative group">
                  <button
                    onClick={() => setConcernOpen(!concernOpen)}
                    className="font-body text-xs tracking-widest uppercase link-hover transition-colors duration-300 text-brand-dark/80 hover:text-brand-dark"
                  >
                    Shop by Concern
                  </button>

                  {concernOpen && (
                    <div className="absolute top-full left-0 mt-2 w-48 bg-white border border-brand-warm shadow-lg z-50">
                      {concernLinks.map((link) => (
                        <Link
                          key={link.href}
                          href={link.href}
                          onClick={() => setConcernOpen(false)}
                          className="block px-4 py-3 font-body text-xs tracking-widest uppercase text-brand-dark hover:bg-brand-warm transition-colors border-b border-brand-warm last:border-b-0"
                        >
                          {link.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>

                {/* Remaining nav links */}
                {navLinksAfterConcern.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="font-body text-xs tracking-widest uppercase link-hover transition-colors duration-300 text-brand-dark/80 hover:text-brand-dark"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>

              {/* Icons */}
              <div className="flex items-center gap-0.5">
                <Link
                  href="/search"
                  aria-label="Search"
                  className="p-3 transition-colors duration-300 relative text-brand-dark hover:text-brand-amber"
                >
                  <Search size={20} strokeWidth={1.5} />
                </Link>
                <Link
                  href="/account"
                  aria-label="Account"
                  className="p-3 transition-colors duration-300 relative text-brand-dark hover:text-brand-amber"
                >
                  <User size={20} strokeWidth={1.5} />
                </Link>
                <Link
                  href="/cart"
                  aria-label="Shopping bag"
                  className="p-3 transition-colors duration-300 relative text-brand-dark hover:text-brand-amber"
                >
                  <ShoppingBag size={20} strokeWidth={1.5} />
                  {cartCount > 0 && (
                    <span className="absolute top-0.5 right-0.5 min-w-[16px] h-4 flex items-center justify-center rounded-full bg-brand-amber text-white text-[9px] font-body font-semibold leading-none px-1">
                      {cartCount > 99 ? '99+' : cartCount}
                    </span>
                  )}
                </Link>
              </div>
            </div>

            {/* Mobile icons + menu button */}
            <div className="md:hidden flex items-center gap-0.5 ml-auto">
              <Link
                href="/search"
                aria-label="Search"
                className="p-2.5 min-h-[44px] min-w-[44px] flex items-center justify-center transition-colors duration-300 text-brand-dark hover:text-brand-amber"
              >
                <Search size={20} strokeWidth={1.5} />
              </Link>
              <Link
                href="/cart"
                aria-label="Shopping bag"
                className="p-2.5 min-h-[44px] min-w-[44px] flex items-center justify-center transition-colors duration-300 text-brand-dark hover:text-brand-amber relative"
              >
                <ShoppingBag size={20} strokeWidth={1.5} />
                {cartCount > 0 && (
                  <span className="absolute top-1 right-1 min-w-[16px] h-4 flex items-center justify-center rounded-full bg-brand-amber text-white text-[9px] font-body font-semibold leading-none px-1">
                    {cartCount > 99 ? '99+' : cartCount}
                  </span>
                )}
              </Link>
              <button
                aria-label="Toggle menu"
                onClick={() => setMobileOpen((o) => !o)}
                className="p-2.5 min-h-[44px] min-w-[44px] flex items-center justify-center transition-colors duration-300 text-brand-dark"
              >
                {mobileOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </div>
        </div>

        {/* Golden shimmering line across the bottom of the header */}
        <div aria-hidden="true" className="h-[2px] w-full gold-shimmer-line" />
      </header>

      {/* Mobile Menu Overlay */}
      <div
        className={clsx(
          'fixed inset-0 z-40 md:hidden transition-all duration-500',
          mobileOpen ? 'visible opacity-100' : 'invisible opacity-0'
        )}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-brand-dark/60 backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
        />

        {/* Drawer */}
        <div
          className={clsx(
            'absolute top-0 right-0 h-full w-[min(18rem,90vw)] bg-brand-cream flex flex-col transition-transform duration-500',
            mobileOpen ? 'translate-x-0' : 'translate-x-full'
          )}
        >
          <div className="flex items-center justify-between p-6 border-b border-brand-warm">
            <span className="font-display font-semibold tracking-[0.15em] uppercase text-sm text-brand-dark">
              Inherited Skincare
            </span>
            <button
              onClick={() => setMobileOpen(false)}
              className="text-brand-muted hover:text-brand-dark p-2 -mr-2 min-h-[44px] min-w-[44px] flex items-center justify-center"
            >
              <X size={20} />
            </button>
          </div>

          <nav className="flex flex-col p-6 gap-4">
            {/* Shop */}
            <Link
              href="/products"
              onClick={() => setMobileOpen(false)}
              className="font-display text-lg sm:text-xl italic text-brand-dark hover:text-brand-amber transition-colors py-1"
            >
              Shop
            </Link>

            {/* Mobile Shop by Concern — right after Shop */}
            <div>
              <button
                onClick={() => setConcernOpen(!concernOpen)}
                className="font-display text-lg sm:text-xl italic text-brand-dark hover:text-brand-amber transition-colors w-full text-left py-1"
              >
                Shop by Concern
              </button>
              {concernOpen && (
                <div className="flex flex-col gap-2 mt-3 pl-4 border-l border-brand-warm">
                  {concernLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => {
                        setMobileOpen(false)
                        setConcernOpen(false)
                      }}
                      className="font-body text-sm text-brand-dark hover:text-brand-amber transition-colors"
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Remaining links */}
            {navLinksAfterConcern.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="font-display text-lg sm:text-xl italic text-brand-dark hover:text-brand-amber transition-colors py-1"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="mt-auto p-6 border-t border-brand-warm">
            <p className="font-body text-xs text-brand-muted tracking-widest uppercase">
              Ancient Wisdom. Modern Skin.
            </p>
          </div>
        </div>
      </div>
    </>
  )
}
