import Image from 'next/image'
import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-brand-cream pt-20 flex items-center">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div>
            <p className="font-body text-[11px] tracking-[0.35em] uppercase text-brand-amber mb-4">
              404 — Page Not Found
            </p>
            <h1 className="font-display font-semibold text-5xl md:text-6xl text-brand-dark leading-tight mb-5">
              This page has
              <br />
              <em className="italic text-brand-amber">gone offline.</em>
            </h1>
            <p className="font-body text-base text-brand-muted leading-relaxed mb-8">
              Like a ritual without intention, something has gone astray. The
              page you&rsquo;re looking for doesn&rsquo;t exist — but your skincare ritual
              awaits.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/"
                className="inline-flex items-center justify-center px-8 py-4 bg-brand-dark text-brand-cream font-body text-xs tracking-widest uppercase hover:bg-brand-amber transition-colors"
              >
                Return Home
              </Link>
              <Link
                href="/products"
                className="inline-flex items-center justify-center px-8 py-4 border border-brand-dark text-brand-dark font-body text-xs tracking-widest uppercase hover:bg-brand-dark hover:text-brand-cream transition-colors"
              >
                Shop All Products
              </Link>
            </div>
          </div>

          {/* Decorative image */}
          <div className="relative hidden md:block">
            <div className="relative aspect-square overflow-hidden">
              <Image
                src="/images/products/5_radiance_serum_HERO.jpg"
                alt="Inherited Skincare"
                fill
                sizes="50vw"
                className="object-cover"
              />
            </div>
            <div className="absolute -bottom-4 -left-4 w-24 h-24 border border-brand-amber/30" />
          </div>
        </div>
      </div>
    </div>
  )
}
