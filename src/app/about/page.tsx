import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { getSiteSettings } from '@/lib/site-settings'

export const metadata: Metadata = {
  title: 'Our Story',
  description:
    'The story behind Inherited Skincare — born from Grandma Leela\'s evening ghee ritual. Discover our Ayurvedic heritage and the power of washed ghee for skin.',
}

export const dynamic = 'force-dynamic'

export default async function AboutPage() {
  const settings = await getSiteSettings()
  const { values, ingredients: keyIngredients, founderHeadline1, founderHeadline2, founderParagraphs } = settings.pages.about
  return (
    <div className="min-h-screen bg-brand-cream pt-24 md:pt-28">
      {/* Hero */}
      <div className="relative h-[60vh] min-h-[400px] overflow-hidden">
        <Image
          src={settings.images.aboutHero}
          alt="Inherited Skincare — Our Story"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/60 via-transparent to-transparent" />
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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div>
              <h2 className="font-display font-semibold text-4xl md:text-5xl text-brand-dark mb-6">
                {founderHeadline1}
                <br />
                <em className="italic text-brand-amber">{founderHeadline2}</em>
              </h2>
              <div className="space-y-5 font-body text-base text-brand-muted leading-relaxed">
                {founderParagraphs.map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
              </div>

              <div className="mt-8 pt-8 border-t border-brand-warm">
                <p className="font-display italic text-2xl text-brand-dark">Suruchi</p>
                <p className="font-body text-xs text-brand-muted tracking-wide mt-0.5">
                  Founder
                </p>
              </div>
            </div>

            <div className="relative">
              <div className="relative aspect-[3/4] overflow-hidden">
                <Image
                  src={settings.images.aboutFounder}
                  alt="Founder Suruchi holding the Inherited Skincare collection"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>
              <p className="mt-3 font-body text-xs italic text-brand-muted">
                Suruchi, founder of Inherited Skincare
              </p>
              <div className="absolute -bottom-6 -right-6 w-40 h-40 border border-brand-amber/30 hidden lg:block" />
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section-pad bg-brand-warm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-6">
            <h2 className="font-display font-semibold text-4xl md:text-5xl text-brand-dark">
              What We Believe
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
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
          <div className="text-center mb-6">
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
              className="inline-flex items-center justify-center px-10 py-4 bg-brand-amber text-white font-body text-xs tracking-widest uppercase hover:bg-[#b87f43] transition-colors"
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
