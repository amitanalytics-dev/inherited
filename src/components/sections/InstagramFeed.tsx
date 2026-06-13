import Image from 'next/image'
import { Instagram } from 'lucide-react'

const placeholderImages = [
  { src: '/images/lifestyle/life_1.jpg', alt: 'Warm ghee in a marble bowl' },
  { src: '/images/lifestyle/life_2.jpg', alt: 'Open Cleansing Balm with daisies and oats' },
  { src: '/images/lifestyle/life_3.jpg', alt: 'Radiance Serum flatlay with oats and saffron' },
  { src: '/images/lifestyle/life_4.jpg', alt: 'The collection in botanical sleeves' },
  { src: '/images/lifestyle/life_5.jpg', alt: 'Festive gift hamper' },
  { src: '/images/lifestyle/life_6.jpg', alt: 'Cream applied to skin' },
]

export default function InstagramFeed() {
  return (
    <section className="section-pad bg-brand-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-6">
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
        <div className="text-center mt-6">
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
