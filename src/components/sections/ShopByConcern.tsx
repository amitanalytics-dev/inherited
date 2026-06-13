import Image from 'next/image'
import Link from 'next/link'
import Reveal from '@/components/ui/Reveal'

type ConcernImages = { sensitive: string; dry: string; dullness: string }

const DEFAULT_IMAGES: ConcernImages = {
  sensitive: '/images/products/6_cleansing_balm.png',
  dry: '/images/products/2_deep_cream.jpg',
  dullness: '/images/products/5_radiance_serum.jpg',
}

export default function ShopByConcern({
  images = DEFAULT_IMAGES,
}: {
  images?: ConcernImages
}) {
  const concerns = [
    {
      title: 'Sensitive Skin',
      line: 'Calming ghee & oat formulas for skin that reacts.',
      img: images.sensitive,
      href: '/collections/sensitive-skin',
    },
    {
      title: 'Dry Skin Repair',
      line: 'Deep, lasting hydration that rebuilds the barrier.',
      img: images.dry,
      href: '/collections/dry-skin-repair',
    },
    {
      title: 'Dullness & Uneven Tone',
      line: 'Turmeric & saffron rituals for an even, radiant tone.',
      img: images.dullness,
      href: '/collections/pigmentation-dull-skin',
    },
  ]

  return (
    <section className="py-10 md:py-12 bg-brand-cream border-t border-brand-warm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <Reveal>
          <div className="text-center mb-6 md:mb-8">
            <p className="font-body text-[11px] tracking-[0.3em] uppercase text-brand-amber mb-2">
              Shop by Concern
            </p>
            <h2 className="font-display font-semibold text-4xl md:text-5xl text-brand-dark">
              Find Your <em className="italic">Fix</em>
            </h2>
            <p className="font-body text-sm text-brand-muted mt-3 max-w-md mx-auto">
              Whatever your skin is asking for — start here.
            </p>
            <div className="w-16 h-px bg-brand-amber mx-auto mt-4" />
          </div>
        </Reveal>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6">
          {concerns.map((concern, i) => (
            <Reveal key={concern.href} delay={i * 0.1}>
              <Link href={concern.href} className="group block">
                <div className="relative aspect-square overflow-hidden bg-brand-warm">
                  <Image
                    src={concern.img}
                    alt={concern.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/70 via-brand-dark/10 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-5">
                    <h3 className="font-display font-semibold text-2xl text-brand-cream mb-1">
                      {concern.title}
                    </h3>
                    <p className="font-body text-xs text-brand-cream/80 mb-2.5">
                      {concern.line}
                    </p>
                    <span className="inline-block font-body text-[10px] tracking-widest uppercase text-brand-amber border-b border-brand-amber/50 pb-0.5 group-hover:border-brand-amber transition-colors">
                      Shop the Edit →
                    </span>
                  </div>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
