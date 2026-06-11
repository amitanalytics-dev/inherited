import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Our Story',
  description:
    'The story behind Inherited Skincare — born from a grandmother\'s kitchen, perfected by modern science. Discover our Ayurvedic heritage and the power of ghee for skin.',
}

const values = [
  {
    title: 'Rooted in Ritual',
    body: 'Every formula begins with an ancient practice. We don\'t invent — we remember, refine, and restore timeless skincare wisdom to modern life.',
  },
  {
    title: 'Honest Ingredients',
    body: 'No fillers, no parabens, no silicones. Every ingredient earns its place — ethically sourced, clinically validated, and present in meaningful concentrations.',
  },
  {
    title: 'Slow Beauty',
    body: 'We believe in small batches, careful craftsmanship, and the quiet power of consistency. Real skin transformation happens over time, not overnight.',
  },
  {
    title: 'Community First',
    body: 'A portion of every purchase supports South Asian women artisans who cultivate the herbs and botanicals at the heart of our formulas.',
  },
]

const keyIngredients = [
  { name: 'Pure Ghee', origin: 'India', benefit: 'Deeply nourishing, repairs barrier' },
  { name: 'Turmeric', origin: 'India / Sri Lanka', benefit: 'Brightening, anti-inflammatory' },
  { name: 'Ashwagandha', origin: 'India', benefit: 'Adaptogenic, anti-stress for skin' },
  { name: 'Neem', origin: 'India', benefit: 'Antibacterial, clears congestion' },
  { name: 'Rosehip Oil', origin: 'Chile', benefit: 'Vitamin C, anti-ageing' },
  { name: 'Oat Extract', origin: 'UK', benefit: 'Soothing, anti-itch, calming' },
]

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-brand-cream pt-20">
      {/* Hero */}
      <div className="relative h-[60vh] min-h-[400px] overflow-hidden">
        <Image
          src="/images/products/_ALL13.jpg"
          alt="Inherited Skincare — Our Story"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-brand-dark/75 via-brand-dark/40 to-transparent" />
        <div className="relative z-10 h-full flex items-end">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-14">
            <p className="font-body text-[11px] tracking-[0.35em] uppercase text-brand-amber mb-3">
              Our Heritage
            </p>
            <h1 className="font-display font-semibold text-5xl md:text-7xl text-brand-cream leading-tight">
              Our Story
            </h1>
          </div>
        </div>
      </div>

      {/* Founder story */}
      <section className="section-pad">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div>
              <h2 className="font-display font-semibold text-4xl md:text-5xl text-brand-dark mb-6">
                Born in a kitchen.
                <br />
                <em className="italic text-brand-amber">Raised by a dream.</em>
              </h2>
              <div className="space-y-5 font-body text-base text-brand-muted leading-relaxed">
                <p>
                  Suruchi Sethi grew up watching her grandmother in a warm kitchen in
                  Punjab, India. Every evening, before bed, her grandmother would
                  apply a small amount of clarified butter — ghee — to her face and
                  hands. Her skin, even in her eighties, was soft, luminous, and
                  seemingly ageless.
                </p>
                <p>
                  When Suruchi moved to London in her twenties, she struggled to find
                  products that respected her skin&rsquo;s heritage. Synthetic emollients that
                  promised hydration but left her skin dull. &ldquo;Luxury&rdquo; creams packed
                  with fillers. Nothing that carried the wisdom she had inherited.
                </p>
                <p>
                  So she went back to the recipes — and brought them forward. Working
                  with Ayurvedic formulators in India and dermatologists in the UK,
                  she spent three years developing formulas that honoured ancient
                  knowledge without compromising on modern safety and efficacy.
                </p>
                <p>
                  In 2020, Inherited Skincare was born. Named for everything we carry
                  forward from the women who came before us.
                </p>
              </div>

              <div className="mt-8 pt-8 border-t border-brand-warm">
                <p className="font-display italic text-2xl text-brand-dark">Suruchi Sethi</p>
                <p className="font-body text-xs text-brand-muted tracking-wide mt-0.5">
                  Founder & Formulator
                </p>
              </div>
            </div>

            <div className="relative">
              <div className="relative aspect-[4/5] overflow-hidden">
                <Image
                  src="/images/products/2_deep_cream_HERO.jpg"
                  alt="The Founder"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 w-40 h-40 border border-brand-amber/30 hidden lg:block" />
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section-pad bg-brand-warm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-display font-semibold text-4xl md:text-5xl text-brand-dark">
              What We Believe
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            {values.map((value) => (
              <div key={value.title} className="bg-brand-cream p-8">
                <h3 className="font-display font-semibold text-2xl text-brand-dark mb-3">
                  {value.title}
                </h3>
                <p className="font-body text-sm text-brand-muted leading-relaxed">
                  {value.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Key ingredients */}
      <section id="ingredients" className="section-pad bg-brand-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="font-body text-[11px] tracking-[0.3em] uppercase text-brand-amber mb-3">
              The Pantry
            </p>
            <h2 className="font-display font-semibold text-4xl md:text-5xl text-brand-cream">
              Key Ingredients
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {keyIngredients.map((ingredient) => (
              <div
                key={ingredient.name}
                className="border border-white/10 p-6 hover:border-brand-amber/40 transition-colors"
              >
                <h3 className="font-display font-semibold text-xl text-brand-cream mb-1">
                  {ingredient.name}
                </h3>
                <p className="font-body text-xs tracking-widest uppercase text-brand-amber mb-3">
                  {ingredient.origin}
                </p>
                <p className="font-body text-sm text-brand-cream/60">
                  {ingredient.benefit}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-pad bg-brand-cream text-center">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-display font-semibold text-4xl md:text-5xl text-brand-dark mb-4">
            Ready to Begin Your Ritual?
          </h2>
          <p className="font-body text-base text-brand-muted mb-8">
            Find the perfect formula for your skin with our 3-question ritual quiz.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/quiz"
              className="inline-flex items-center justify-center px-10 py-4 bg-brand-amber text-white font-body text-xs tracking-widest uppercase hover:bg-[#a0693a] transition-colors"
            >
              Take the Skin Quiz
            </Link>
            <Link
              href="/products"
              className="inline-flex items-center justify-center px-8 py-4 border border-brand-dark text-brand-dark font-body text-xs tracking-widest uppercase hover:bg-brand-dark hover:text-brand-cream transition-colors"
            >
              Shop All Products
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
