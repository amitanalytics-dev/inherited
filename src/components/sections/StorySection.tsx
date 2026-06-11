import Image from 'next/image'
import Link from 'next/link'

export default function StorySection() {
  return (
    <section className="section-pad bg-brand-warm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left: Image */}
          <div className="relative">
            <div className="relative aspect-[4/5] overflow-hidden">
              <Image
                src="/images/products/2_deep_cream_HERO.jpg"
                alt="Inherited Skincare — The Founder Story"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
            {/* Decorative amber line */}
            <div className="absolute -bottom-6 -right-6 w-40 h-40 border border-brand-amber/30 hidden lg:block" />
            <div className="absolute -top-6 -left-6 w-20 h-20 border border-brand-amber/20 hidden lg:block" />
          </div>

          {/* Right: Story */}
          <div className="lg:pl-6">
            <p className="font-body text-[11px] tracking-[0.3em] uppercase text-brand-amber mb-4">
              Our Heritage
            </p>
            <h2 className="font-display font-semibold text-4xl md:text-5xl text-brand-dark leading-tight mb-6">
              Born from a grandmother&rsquo;s recipe.{' '}
              <em className="italic">Perfected for modern skin.</em>
            </h2>

            <div className="space-y-4 font-body text-base text-brand-muted leading-relaxed">
              <p>
                Every jar of Inherited Skincare carries the memory of a kitchen
                filled with the warm scent of clarified butter, turmeric, and
                herbs. It was in that kitchen, watching her grandmother blend
                ingredients with quiet confidence, that our founder discovered
                the quiet power of Ayurvedic beauty rituals.
              </p>
              <p>
                These weren&rsquo;t just skincare recipes — they were acts of
                love passed down through generations of South Asian women who
                knew that true nourishment comes from within the earth. Pure
                ghee. Cold-pressed oils. Botanical extracts. No shortcuts.
              </p>
              <p>
                We took those ancient formulas and worked with modern
                dermatologists to validate what generations of women already
                knew: ghee is one of the most bioavailable, skin-loving
                ingredients on earth. Rich in fatty acids, vitamins A, D, E and
                K — it feeds the skin barrier in a way no synthetic substitute
                can replicate.
              </p>
            </div>

            <div className="mt-8 flex items-center gap-6">
              <Link
                href="/about"
                className="inline-flex items-center justify-center px-8 py-3.5 bg-brand-dark text-brand-cream font-body text-xs tracking-widest uppercase hover:bg-brand-amber transition-colors"
              >
                Our Full Story
              </Link>
              <Link
                href="/about#ingredients"
                className="font-body text-xs tracking-widest uppercase text-brand-amber border-b border-brand-amber/50 pb-0.5 hover:border-brand-amber transition-colors"
              >
                The Ingredients →
              </Link>
            </div>

            {/* Signature */}
            <div className="mt-10 pt-8 border-t border-brand-amber/20">
              <p className="font-display italic text-xl text-brand-dark">
                Suruchi Sethi
              </p>
              <p className="font-body text-xs text-brand-muted tracking-wide mt-0.5">
                Founder, Inherited Skincare
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
