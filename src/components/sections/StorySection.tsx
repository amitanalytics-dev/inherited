import Image from 'next/image'
import Link from 'next/link'
import Reveal from '@/components/ui/Reveal'

export default function StorySection({
  image = '/images/brand/suruchi_leela.jpg',
}: {
  image?: string
}) {
  return (
    <section className="section-pad bg-brand-warm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left: Image */}
          <Reveal>
          <div className="relative">
            <div className="relative aspect-[3/2] overflow-hidden border-8 border-brand-cream shadow-lg">
              <Image
                src={image}
                alt="Founder Suruchi as a child with her grandmother Leela"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
            {/* Decorative amber line */}
            <div className="absolute -bottom-6 -right-6 w-40 h-40 border border-brand-amber/30 hidden lg:block" />
            <div className="absolute -top-6 -left-6 w-20 h-20 border border-brand-amber/20 hidden lg:block" />
            {/* Brand seal */}
            <div className="absolute -bottom-7 -left-4 lg:-left-7 z-10">
              <div className="relative w-[110px] h-[110px] rounded-full overflow-hidden shadow-lg ring-1 ring-brand-amber/30">
                <Image
                  src="/images/brand/badge_cream.jpg"
                  alt="Handmade from glow-rious ghee — Inherited Skincare seal"
                  fill
                  sizes="110px"
                  className="object-cover"
                />
              </div>
            </div>
          </div>
          </Reveal>

          {/* Right: Story */}
          <Reveal delay={0.15}>
          <div className="lg:pl-6">
            <p className="font-body text-[11px] tracking-[0.3em] uppercase text-brand-amber mb-4">
              Our Heritage
            </p>
            <h2 className="font-display font-semibold text-4xl md:text-5xl text-brand-dark leading-tight mb-6">
              Born from a grandmother&rsquo;s recipe.{' '}
              <em className="italic">Refined for modern skin.</em>
            </h2>

            <div className="space-y-4 font-body text-base text-brand-muted leading-relaxed">
              <p>
                In our home, ghee was never only for cooking. My grandmother Leela used it on her skin too, a little massaged in before bed, the way she&rsquo;d always done. To her it wasn&rsquo;t skincare. It was just ghee, and it worked. Every jar carries the memory of her ritual.
              </p>
              <p>
                I came back to it years later. After a lot of modern products that left my skin reactive, I went back to the simple thing she trusted.
              </p>
              <p>
                The brand is named in her honour and for the wisdom I inherited from her.
              </p>
              <p>
                Every formula is built around ghee, washed until it turns light, creamy and silky and naturally rich in butyric acid and vitamins A, D, E and K. Nothing complicated. Just what she used, made for skin today.
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
                Suruchi
              </p>
              <p className="font-body text-xs text-brand-muted tracking-wide mt-0.5">
                Founder, Inherited Skincare
              </p>
            </div>
          </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
