'use client'

import { useState, useEffect } from 'react'
import { clsx } from 'clsx'

const pressQuotes = [
  {
    quote:
      'A revelation in a jar. Inherited Skincare\'s Overnight Cream has transformed my dry, dull complexion into something radiant. The ghee formula melts into skin like nothing I\'ve tried before.',
    publication: 'Vogue UK',
    author: 'Beauty Director',
  },
  {
    quote:
      'The most luxurious cleanser in my routine. The Ghee & Oat Balm dissolves every trace of makeup while leaving skin impossibly soft — an Ayurvedic gem for modern skincare obsessives.',
    publication: 'Elle',
    author: 'Beauty Editor',
  },
  {
    quote:
      'Inherited Skincare bridges the gap between ancient ritual and modern efficacy. The Radiance Serum is proof that sometimes the oldest ingredients are still the most revolutionary.',
    publication: 'Grazia',
    author: 'Wellness Writer',
  },
  {
    quote:
      'We\'ve tested hundreds of natural skincare brands, but nothing quite compares to the potency and elegance of Inherited Skincare. A true heritage brand for the modern age.',
    publication: 'Tatler',
    author: 'Contributing Editor',
  },
  {
    quote:
      'Finally, Ayurvedic beauty elevated to the standard it deserves. The Deep Nourishing Cream is a daily ritual I\'ve happily surrendered to — skin has never felt more alive.',
    publication: 'Harper\'s Bazaar',
    author: 'Beauty & Wellness Editor',
  },
]

export default function PressCarousel() {
  const [current, setCurrent] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setIsTransitioning(true)
      setTimeout(() => {
        setCurrent((c) => (c + 1) % pressQuotes.length)
        setIsTransitioning(false)
      }, 400)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  function goTo(index: number) {
    if (index === current) return
    setIsTransitioning(true)
    setTimeout(() => {
      setCurrent(index)
      setIsTransitioning(false)
    }, 300)
  }

  const quote = pressQuotes[current]

  return (
    <section className="section-pad bg-brand-cream border-y border-brand-warm">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Header */}
        <p className="font-body text-[11px] tracking-[0.3em] uppercase text-brand-amber mb-10">
          As Seen In
        </p>

        {/* Quote */}
        <div
          className={clsx(
            'transition-all duration-400',
            isTransitioning ? 'opacity-0 translate-y-2' : 'opacity-100 translate-y-0'
          )}
          style={{ minHeight: '160px' }}
        >
          <svg
            className="w-8 h-8 text-brand-amber/40 mx-auto mb-5"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
          </svg>

          <blockquote className="font-display italic text-xl md:text-2xl lg:text-3xl text-brand-dark leading-relaxed mb-6">
            &ldquo;{quote.quote}&rdquo;
          </blockquote>

          <div className="flex items-center justify-center gap-3">
            <span className="font-body text-xs tracking-[0.2em] uppercase text-brand-amber font-medium">
              {quote.publication}
            </span>
            <span className="w-1 h-1 rounded-full bg-brand-muted/40" />
            <span className="font-body text-xs text-brand-muted">
              {quote.author}
            </span>
          </div>
        </div>

        {/* Dots */}
        <div className="flex items-center justify-center gap-2.5 mt-10">
          {pressQuotes.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              aria-label={`Go to quote ${i + 1}`}
              className={clsx(
                'rounded-full transition-all duration-300',
                i === current
                  ? 'bg-brand-amber w-6 h-1.5'
                  : 'bg-brand-muted/30 w-1.5 h-1.5 hover:bg-brand-amber/50'
              )}
            />
          ))}
        </div>

        {/* Publications list */}
        <div className="mt-14 flex items-center justify-center gap-8 flex-wrap">
          {['Vogue', 'Elle', 'Grazia', 'Tatler', "Harper's Bazaar"].map(
            (pub) => (
              <span
                key={pub}
                className="font-display italic text-lg md:text-xl text-brand-muted/40 tracking-wide"
              >
                {pub}
              </span>
            )
          )}
        </div>
      </div>
    </section>
  )
}
