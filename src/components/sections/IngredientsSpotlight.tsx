import Image from 'next/image'
import Link from 'next/link'
import Reveal from '@/components/ui/Reveal'

const benefits = [
  {
    title: 'Deep Nourishment',
    body: 'Rich in short-chain fatty acids, ghee penetrates the skin barrier to nourish from within — not just on the surface.',
  },
  {
    title: 'Anti-Inflammatory',
    body: 'Butyric acid and omega-3s in ghee calm redness, sensitivity, and reactive skin with every application.',
  },
  {
    title: 'Vitamin-Dense',
    body: 'A natural source of vitamins A, D, E and K — essential nutrients that brighten, firm, and protect skin daily.',
  },
  {
    title: 'Microbiome Friendly',
    body: 'Unlike synthetic emollients, ghee works with your skin\'s natural microbiome rather than against it.',
  },
]

export default function IngredientsSpotlight({
  image = '/images/products/5_radiance_serum_HERO.jpg',
}: {
  image?: string
}) {
  return (
    <section className="relative section-pad bg-brand-warm overflow-hidden">
      {/* Botanical background — sea buckthorn illustration, cropped to hide URL strip */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <Image
          src="/images/brand/quote_3.png"
          alt=""
          fill
          sizes="100vw"
          className="object-cover object-top scale-[1.15] opacity-[0.12]"
        />
        {/* Cream overlay to keep readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-brand-warm/80 via-brand-warm/55 to-brand-warm/80" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left: Content */}
          <Reveal>
          <div>
            <p className="font-body text-[11px] tracking-[0.3em] uppercase text-brand-amber mb-4">
              The Hero Ingredient
            </p>
            <h2 className="font-display font-semibold text-4xl md:text-5xl lg:text-6xl text-brand-dark leading-tight mb-6">
              The Power of{' '}
              <em className="italic text-brand-amber">Ghee</em>
            </h2>
            <p className="font-body text-base text-brand-muted leading-relaxed mb-8">
              In Ayurveda, ghee — clarified butter — has been revered for over
              5,000 years as a substance that nourishes the body at a cellular
              level. Applied topically, its unique molecular structure allows it
              to penetrate deeply, delivering nutrients where skin needs them most.
            </p>

            {/* Benefits */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {benefits.map((benefit) => (
                <div
                  key={benefit.title}
                  className="bg-brand-cream/60 p-5 border-l-2 border-brand-amber"
                >
                  <h4 className="font-display font-semibold text-lg text-brand-dark mb-1.5">
                    {benefit.title}
                  </h4>
                  <p className="font-body text-sm text-brand-muted leading-relaxed">
                    {benefit.body}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-8">
              <Link
                href="/about#ingredients"
                className="inline-flex items-center justify-center px-8 py-3.5 bg-brand-amber text-white font-body text-xs tracking-widest uppercase hover:bg-[#b87f43] transition-colors"
              >
                Explore All Ingredients
              </Link>
            </div>
          </div>
          </Reveal>

          {/* Right: Image */}
          <Reveal delay={0.15} className="order-first lg:order-last">
          <div className="relative">
            <div className="relative aspect-[4/5] overflow-hidden">
              <Image
                src={image}
                alt="Radiance Serum — Ghee-powered formula"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
            {/* Decorative */}
            <div className="absolute -bottom-4 -left-4 w-32 h-32 border border-brand-amber/25 hidden lg:block" />
          </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
