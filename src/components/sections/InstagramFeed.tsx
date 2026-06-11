import Image from 'next/image'
import { Instagram } from 'lucide-react'

const placeholderImages = [
  { src: '/images/products/1_night_cream_HERO.jpg', alt: 'Night Cream ritual' },
  { src: '/images/products/5_radiance_serum_HERO.jpg', alt: 'Radiance Serum glow' },
  { src: '/images/products/_ALL13.jpg', alt: 'Full ritual collection' },
  { src: '/images/products/6_cleansing_balm_HERO.jpg', alt: 'Cleansing ritual' },
  { src: '/images/products/2_deep_cream_HERO.jpg', alt: 'Deep nourishing cream' },
  { src: '/images/products/4_lip_set_HERO.jpg', alt: 'Lip care ritual' },
]

export default function InstagramFeed() {
  return (
    <section className="section-pad bg-brand-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-10">
          <a
            href="https://www.instagram.com/inheritedskincare"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2.5 group"
          >
            <Instagram
              size={18}
              strokeWidth={1.5}
              className="text-brand-amber"
            />
            <span className="font-body text-[11px] tracking-[0.3em] uppercase text-brand-muted group-hover:text-brand-amber transition-colors">
              @inheritedskincare
            </span>
          </a>
          <h2 className="font-display font-semibold text-3xl md:text-4xl text-brand-dark mt-2">
            The Ritual, <em className="italic">In Real Life</em>
          </h2>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-3 md:grid-cols-6 gap-2 md:gap-3">
          {placeholderImages.map((item, i) => (
            <a
              key={i}
              href="https://www.instagram.com/inheritedskincare"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative aspect-square overflow-hidden bg-brand-warm block"
            >
              <Image
                src={item.src}
                alt={item.alt}
                fill
                sizes="(max-width: 768px) 33vw, 16vw"
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
              {/* Hover overlay */}
              <div className="absolute inset-0 bg-brand-dark/0 group-hover:bg-brand-dark/30 transition-colors duration-300 flex items-center justify-center">
                <Instagram
                  size={20}
                  strokeWidth={1.5}
                  className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                />
              </div>
            </a>
          ))}
        </div>

        {/* Follow CTA */}
        <div className="text-center mt-8">
          <a
            href="https://www.instagram.com/inheritedskincare"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-3.5 border border-brand-dark text-brand-dark font-body text-xs tracking-widest uppercase hover:bg-brand-dark hover:text-brand-cream transition-colors"
          >
            <Instagram size={14} strokeWidth={1.5} />
            Follow Us on Instagram
          </a>
        </div>
      </div>
    </section>
  )
}
