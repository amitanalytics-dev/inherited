'use client'

import reviewsData from '@/data/reviews.json'

interface StaticReview {
  id: number
  authorName: string
  rating: number
  title: string
  body: string
  verified: boolean
}

function Stars({ rating, size = 'sm' }: { rating: number; size?: 'sm' | 'md' }) {
  const dim = size === 'md' ? 'w-5 h-5' : 'w-4 h-4'
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <svg key={s} className={dim} viewBox="0 0 20 20" fill={s <= rating ? '#C8923A' : 'none'} stroke="#C8923A" strokeWidth="1.5">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  )
}

interface Props {
  productHandle: string
  ratingValue: number | null
  ratingCount: number | null
}

export default function JudgemeReviews({ productHandle, ratingValue, ratingCount }: Props) {
  const allReviews = reviewsData as Record<string, StaticReview[]>
  const reviews: StaticReview[] = allReviews[productHandle] ?? []

  // Compute aggregate
  const displayCount = ratingCount ?? reviews.length
  const displayRating =
    ratingValue ??
    (reviews.length > 0
      ? Math.round((reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length) * 10) / 10
      : null)

  return (
    <div className="mt-16" id="reviews">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h2 className="font-display font-semibold text-2xl md:text-3xl text-brand-dark">
          Customer Reviews
        </h2>
        {displayRating !== null && displayCount > 0 && (
          <div className="flex items-center gap-2">
            <Stars rating={Math.round(displayRating)} size="md" />
            <span className="font-body font-semibold text-brand-dark">{displayRating.toFixed(1)}</span>
            <span className="font-body text-sm text-brand-muted">({displayCount} reviews)</span>
          </div>
        )}
      </div>

      {reviews.length > 0 ? (
        <div className="space-y-4">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="bg-white border border-brand-warm p-6 sm:p-8"
            >
              <div className="flex items-start justify-between gap-4 mb-3">
                <div className="space-y-1.5">
                  <Stars rating={review.rating} />
                  {review.title && (
                    <p className="font-body font-semibold text-brand-dark text-base leading-snug">
                      {review.title}
                    </p>
                  )}
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="font-body text-sm font-medium text-brand-dark">{review.authorName}</p>
                  {review.verified && (
                    <span className="inline-block mt-1.5 font-body text-[10px] tracking-widest uppercase text-brand-green bg-brand-green/10 px-2 py-0.5">
                      Verified
                    </span>
                  )}
                </div>
              </div>
              {review.body && (
                <p className="font-body text-sm text-brand-muted leading-relaxed">
                  {review.body}
                </p>
              )}
            </div>
          ))}

          {displayCount > reviews.length && (
            <p className="pt-2 font-body text-sm text-brand-muted">
              Showing {reviews.length} of {displayCount} reviews
            </p>
          )}
        </div>
      ) : (
        <div className="py-8 border border-brand-warm text-center">
          <p className="font-body text-brand-muted">No reviews yet — be the first!</p>
        </div>
      )}
    </div>
  )
}
