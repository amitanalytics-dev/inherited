'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { clsx } from 'clsx'
import { Menu, X, ShoppingBag, Search } from 'lucide-react'

const navLinks = [
  { label: 'Shop', href: '/products' },
  { label: 'Collections', href: '/collections' },
  { label: 'Our Story', href: '/about' },
  { label: 'Ritual Quiz', href: '/quiz' },
  { label: 'Journal', href: '/blog' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

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

  return (
    <>
      <header
        className={clsx(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-500',
          scrolled
            ? 'bg-brand-cream/95 backdrop-blur-md shadow-sm border-b border-brand-warm'
            : 'bg-transparent'
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <Link href="/" className="flex-shrink-0 group">
              <span
                className={clsx(
                  'font-display font-semibold tracking-[0.2em] uppercase text-sm md:text-base transition-colors duration-300',
                  scrolled ? 'text-brand-dark' : 'text-brand-cream'
                )}
              >
                Inherited Skincare
              </span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={clsx(
                    'font-body text-xs tracking-widest uppercase link-hover transition-colors duration-300',
                    scrolled
                      ? 'text-brand-muted hover:text-brand-dark'
                      : 'text-brand-cream/90 hover:text-brand-cream'
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Right icons */}
            <div className="flex items-center gap-4">
              <button
                aria-label="Search"
                className={clsx(
                  'hidden md:flex transition-colors duration-300',
                  scrolled
                    ? 'text-brand-muted hover:text-brand-dark'
                    : 'text-brand-cream/90 hover:text-brand-cream'
                )}
              >
                <Search size={18} strokeWidth={1.5} />
              </button>

              <Link
                href="/cart"
                aria-label="Shopping bag"
                className={clsx(
                  'transition-colors duration-300 relative',
                  scrolled
                    ? 'text-brand-dark hover:text-brand-amber'
                    : 'text-brand-cream hover:text-brand-amber'
                )}
              >
                <ShoppingBag size={20} strokeWidth={1.5} />
              </Link>

              {/* Mobile hamburger */}
              <button
                aria-label="Toggle menu"
                onClick={() => setMobileOpen((o) => !o)}
                className={clsx(
                  'md:hidden transition-colors duration-300',
                  scrolled
                    ? 'text-brand-dark'
                    : 'text-brand-cream'
                )}
              >
                {mobileOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </div>
        </div>
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
            'absolute top-0 right-0 h-full w-72 bg-brand-cream flex flex-col transition-transform duration-500',
            mobileOpen ? 'translate-x-0' : 'translate-x-full'
          )}
        >
          <div className="flex items-center justify-between p-6 border-b border-brand-warm">
            <span className="font-display font-semibold tracking-[0.15em] uppercase text-sm text-brand-dark">
              Inherited Skincare
            </span>
            <button
              onClick={() => setMobileOpen(false)}
              className="text-brand-muted hover:text-brand-dark"
            >
              <X size={20} />
            </button>
          </div>

          <nav className="flex flex-col p-6 gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="font-display text-2xl italic text-brand-dark hover:text-brand-amber transition-colors"
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
