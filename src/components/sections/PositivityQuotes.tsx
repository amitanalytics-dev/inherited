import Image from 'next/image'
import Reveal from '@/components/ui/Reveal'

const ingredients = [
  {
    name: 'Washed Ghee',
    line: 'Penetrates all seven layers of skin. Rich in butyric acid and vitamins A, D, E & K. Comedogenic rating: 1/5.',
    img: '/images/brand/quote_1.png',
  },
  {
    name: 'Turmeric',
    line: 'Brightening and anti-inflammatory. Targets uneven pigmentation at the source.',
    img: '/images/brand/quote_3.png',
  },
  {
    name: 'Saffron & Liquorice',
    line: 'Traditional radiance botanicals — for even tone and a calm, healthy glow.',
    img: '/images/brand/quote_2.png',
  },
  {
    name: 'Sea Buckthorn & Calendula',
    line: 'Antioxidant protection and soothing repair for stressed, sensitive skin.',
    img: '/images/brand/quote_5.png',
  },
]

export default function PositivityQuotes() {
  return (
    <section className="py-10 md:py-12 bg-brand-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <Reveal>
          <div className="text-center mb-6 md:mb-8">
            <p className="font-body text-[11px] tracking-[0.3em] uppercase text-brand-amber mb-2">
              Inside Every Jar
            </p>
            <h2 className="font-display font-semibold text-4xl md:text-5xl text-brand-dark">
              The Ingredients That <em className="italic">Do The Work</em>
            </h2>
            <div className="w-16 h-px bg-brand-amber mx-auto mt-4" />
          </div>
        </Reveal>

        {/* Ingredient cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
          {ingredients.map((ing, i) => (
            <Reveal key={ing.name} delay={i * 0.08}>
              <div className="relative overflow-hidden bg-white ring-1 ring-brand-warm shadow-sm h-full">
                {/* Botanical backdrop, cropped to hide baked-in URL strip */}
                <div
                  className="absolute inset-0 pointer-events-none"
                  aria-hidden="true"
                >
                  <Image
                    src={ing.img}
                    alt=""
                    fill
                    sizes="(max-width: 640px) 100vw, 25vw"
                    className="object-cover object-top scale-[1.15] opacity-[0.12]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-white/70 via-white/50 to-white/80" />
                </div>
                <div className="relative z-10 p-6 flex flex-col h-full">
                  <span className="font-display italic text-3xl text-brand-amber/60 mb-3">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <h3 className="font-display font-semibold text-2xl text-brand-dark mb-2.5">
                    {ing.name}
                  </h3>
                  <p className="font-body text-sm text-brand-muted leading-relaxed">
                    {ing.line}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
