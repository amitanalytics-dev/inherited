import Image from 'next/image'
import Link from 'next/link'
import Reveal from '@/components/ui/Reveal'

function Stars() {
  return (
    <div className="flex items-center gap-0.5" aria-label="5 out of 5 stars">
      {[1, 2, 3, 4, 5].map((i) => (
        <svg
          key={i}
          className="w-3.5 h-3.5 text-brand-amber fill-current"
          viewBox="0 0 20 20"
          aria-hidden="true"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  )
}

const photoReviews = [
  {
    img: '/images/reviews/review_trisha.jpg',
    quote:
      "Calmed my eczema redness. Not greasy at all. So grateful!",
    name: 'Trisha M.',
    concern: 'Eczema',
    product: 'Deep Nourishing Cream',
  },
  {
    img: '/images/reviews/review_vandana.jpg',
    quote:
      "The only cream that soothes my daughter's eczema. Nothing else works.",
    name: 'Vandana R.',
    concern: 'Child Eczema',
    product: 'Deep Nourishing Cream',
  },
  {
    img: '/images/reviews/review_priya.jpg',
    quote:
      'I love, love, love this serum! Made my skin so much brighter in just a few uses!',
    name: 'Priya S.',
    concern: 'Brightening',
    product: 'Radiance Serum',
  },
  {
    img: '/images/reviews/review_michelle.jpg',
    quote:
      'So smooth, radiant glow. I look forward to my daily ritual.',
    name: 'Michelle',
    concern: 'Radiant Glow',
    product: 'Radiance Serum',
  },
]

export default function PressCarousel() {
  return (
    <section className="py-10 md:py-12 bg-brand-cream border-y border-brand-warm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <Reveal>
          <div className="text-center mb-6 md:mb-8">
            <p className="font-body text-[11px] tracking-[0.3em] uppercase text-brand-amber mb-2">
              Customer Stories
            </p>
            <h2 className="font-display font-semibold text-4xl md:text-5xl text-brand-dark">
              Real Skin, <em className="italic">Real Results</em>
            </h2>
            <p className="font-body text-sm text-brand-muted mt-3">
              5.0★ · Loved by 1,800+ customers
            </p>
            <div className="w-16 h-px bg-brand-amber mx-auto mt-4" />
          </div>
        </Reveal>

        {/* Photo review cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
          {photoReviews.map((review, i) => (
            <Reveal key={review.name} delay={i * 0.08}>
              <div className="bg-white ring-1 ring-brand-warm shadow-sm h-full flex flex-col">
                <div className="relative aspect-square overflow-hidden bg-brand-warm">
                  <Image
                    src={review.img}
                    alt={`${review.name} — customer photo`}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover"
                  />
                  <span className="absolute top-3 left-3 font-body text-[10px] tracking-widest uppercase bg-brand-cream/90 text-brand-dark px-2.5 py-1">
                    {review.concern}
                  </span>
                </div>
                <div className="p-4 flex flex-col flex-1">
                  <Stars />
                  <p className="font-body text-sm text-brand-muted leading-relaxed mt-2.5 mb-3 flex-1">
                    &ldquo;{review.quote}&rdquo;
                  </p>
                  <p className="font-body text-xs tracking-[0.15em] uppercase text-brand-dark font-medium">
                    {review.name}
                  </p>
                  <p className="font-body text-[11px] text-brand-muted/70 mt-0.5">
                    Verified Buyer · {review.product}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Link to all reviews */}
        <Reveal>
          <div className="text-center mt-7">
            <Link
              href="/reviews"
              className="inline-block font-body text-xs tracking-widest uppercase text-brand-dark border-b border-brand-amber pb-1 hover:text-brand-amber transition-colors"
            >
              Read All Reviews →
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
