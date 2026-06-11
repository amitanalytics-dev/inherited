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
      'Every formula is rooted in Ayurvedic wisdom — pure ghee, turmeric, ashwagandha, neem, and cold-pressed oils sourced from ethical growers across South Asia.',
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
    title: 'Clinically Tested Formulas',
    body:
      'Our formulations are independently tested by UK dermatologists for safety, efficacy, and skin barrier improvement. Science validates what ancestry perfected.',
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
      'Small-batch, slow-made. Every product is crafted in our UK studio with the care and intention of a grandmother\'s kitchen. No mass-production shortcuts.',
  },
]

export default function ScienceRitual() {
  return (
    <section className="section-pad bg-brand-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-14 md:mb-18">
          <p className="font-body text-[11px] tracking-[0.3em] uppercase text-brand-amber mb-3">
            Our Philosophy
          </p>
          <h2 className="font-display font-semibold text-4xl md:text-5xl lg:text-6xl text-brand-cream">
            Science <em className="italic">Meets</em> Ritual
          </h2>
          <div className="w-16 h-px bg-brand-amber mx-auto mt-5" />
        </div>

        {/* Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8 lg:gap-16">
          {pillars.map((pillar) => (
            <div
              key={pillar.title}
              className="flex flex-col items-center text-center md:items-start md:text-left"
            >
              <div className="text-brand-amber mb-5">{pillar.icon}</div>
              <h3 className="font-display font-semibold text-2xl text-brand-cream mb-3">
                {pillar.title}
              </h3>
              <p className="font-body text-sm text-brand-cream/60 leading-relaxed">
                {pillar.body}
              </p>
            </div>
          ))}
        </div>

        {/* Bottom stats */}
        <div className="mt-16 md:mt-20 pt-12 border-t border-white/10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { stat: '100%', label: 'Natural Ingredients' },
              { stat: '0', label: 'Harsh Chemicals' },
              { stat: '2000+', label: 'Happy Customers' },
              { stat: '5★', label: 'Average Rating' },
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
      </div>
    </section>
  )
}
