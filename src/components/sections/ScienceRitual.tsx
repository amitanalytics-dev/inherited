import Image from 'next/image'
import Reveal from '@/components/ui/Reveal'

const pillars = [
  {
    icon: (
      <svg
        viewBox="0 0 48 48"
        className="w-10 h-10"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      >
        <path d="M24 6C24 6 12 14 12 26a12 12 0 0024 0C36 14 24 6 24 6z" />
        <path d="M24 20v12M18 26h12" />
        <circle cx="24" cy="38" r="2" fill="currentColor" stroke="none" />
      </svg>
    ),
    title: 'Ancient Ayurvedic Ingredients',
    body:
      'Rooted in Ayurveda. Washed ghee, turmeric, saffron, calendula, oat. All natural. Minimal.',
  },
  {
    icon: (
      <svg
        viewBox="0 0 48 48"
        className="w-10 h-10"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      >
        <rect x="10" y="8" width="28" height="32" rx="2" />
        <path d="M17 18h14M17 24h10M17 30h7" />
        <circle cx="34" cy="36" r="6" fill="none" />
        <path d="M31 36l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    title: 'CPSR Safety Tested',
    body:
      'Independently certified for the UK market. Modern standards. Ancient wisdom.',
  },
  {
    icon: (
      <svg
        viewBox="0 0 48 48"
        className="w-10 h-10"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      >
        <path d="M24 8l3 6h6l-5 4 2 6-6-4-6 4 2-6-5-4h6z" />
        <path d="M24 30v10M18 36h12" />
        <circle cx="24" cy="40" r="1.5" fill="currentColor" stroke="none" />
      </svg>
    ),
    title: 'Handcrafted in the UK',
    body:
      'Small-batch, slow-made. Crafted with a grandmother\'s care. No shortcuts.',
  },
]

export default function ScienceRitual() {
  return (
    <section className="relative section-pad bg-brand-dark overflow-hidden">
      {/* Botanical background — eucalyptus illustration, cropped to hide URL strip */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <Image
          src="/images/brand/quote_2.png"
          alt=""
          fill
          sizes="100vw"
          className="object-cover object-top scale-[1.15] opacity-[0.12]"
        />
        {/* Dark overlay to keep text contrast strong */}
        <div className="absolute inset-0 bg-gradient-to-b from-brand-dark/70 via-brand-dark/40 to-brand-dark/70" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <Reveal>
          <div className="text-center mb-6 md:mb-8">
            <p className="font-body text-[11px] tracking-[0.3em] uppercase text-brand-amber mb-3">
              Our Philosophy
            </p>
            <h2 className="font-display font-semibold text-4xl md:text-5xl lg:text-6xl text-brand-cream">
              Science <em className="italic">Meets</em> Ritual
            </h2>
            <div className="w-16 h-px bg-brand-amber mx-auto mt-5" />
          </div>
        </Reveal>

        {/* Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6 lg:gap-10">
          {pillars.map((pillar, i) => (
            <Reveal key={pillar.title} delay={i * 0.12}>
              <div className="flex flex-col items-center text-center md:items-start md:text-left">
                <div className="text-brand-amber mb-5">{pillar.icon}</div>
                <h3 className="font-display font-semibold text-2xl text-brand-cream mb-3">
                  {pillar.title}
                </h3>
                <p className="font-body text-sm text-brand-cream/60 leading-relaxed">
                  {pillar.body}
                </p>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Bottom stats */}
        <Reveal delay={0.1}>
        <div className="mt-10 md:mt-12 pt-8 border-t border-white/10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { stat: '5.0★', label: 'Average Rating' },
              { stat: '1,800+', label: 'Happy Customers' },
              { stat: '100%', label: 'Natural Ingredients' },
              { stat: '0', label: 'Harsh Chemicals' },
            ].map((item) => (
              <div key={item.label}>
                <p className="font-display font-semibold text-4xl md:text-5xl text-brand-amber">
                  {item.stat}
                </p>
                <p className="font-body text-xs tracking-widest uppercase text-brand-cream/40 mt-1">
                  {item.label}
                </p>
              </div>
            ))}
          </div>
        </div>
        </Reveal>
      </div>
    </section>
  )
}
