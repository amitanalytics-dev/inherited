import type { ReactNode } from 'react'

interface JudgemeReview {
  id: number
  title: string
  body: string
  rating: number
  reviewer: { name: string }
  created_at: string
  verified: boolean
}

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <svg key={s} className="w-4 h-4" viewBox="0 0 20 20" fill={s <= rating ? '#C8923A' : 'none'} stroke="#C8923A" strokeWidth="1.5">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  )
}

async function getReviews(productId: string): Promise<JudgemeReview[] | null> {
  const numericId = productId.replace('gid://shopify/Product/', '')
  try {
    const res = await fetch(
      `https://judge.me/api/v1/reviews?shop_domain=leela-skincare.myshopify.com&product_external_id=${numericId}&per_page=8&page=1`,
      { next: { revalidate: 3600 } }
    )
    if (!res.ok) return null
    const data = await res.json()
    return (data.reviews ?? []) as JudgemeReview[]
  } catch {
    return null
  }
}

interface Props {
  productId: string
  ratingValue: number | null
  ratingCount: number | null
  productHandle: string
}

export default async function JudgemeReviews({ productId, ratingValue, ratingCount, productHandle }: Props) {
  const reviews = await getReviews(productId)
  const hasReviews = reviews && reviews.length > 0

  return (
    <div className="mt-16">
      <div className="flex items-center justify-between mb-8">
        <h2 className="font-display font-semibold text-2xl md:text-3xl text-brand-dark">
          Customer Reviews
        </h2>
        {ratingValue !== null && ratingCount !== null && ratingCount > 0 && (
          <div className="flex items-center gap-2">
            <Stars rating={Math.round(ratingValue)} />
            <span className="font-body text-sm text-brand-dark font-medium">{ratingValue.toFixed(1)}</span>
            <span className="font-body text-sm text-brand-muted">({ratingCount})</span>
          </div>
        )}
      </div>

      {hasReviews ? (
        <div className="space-y-6">
          {reviews.map((review) => {
            const date = new Date(review.created_at).toLocaleDateString('en-GB', {
              day: 'numeric', month: 'long', year: 'numeric',
            })
            return (
              <div key={review.id} className="border-b border-brand-warm pb-6">
                <div className="flex items-start justify-between gap-4 mb-2">
                  <div>
                    <Stars rating={review.rating} />
                    {review.title && (
                      <p className="font-body font-semibold text-brand-dark mt-1">{review.title}</p>
                    )}
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="font-body text-sm font-medium text-brand-dark">{review.reviewer.name}</p>
                    <p className="font-body text-xs text-brand-muted">{date}</p>
                    {review.verified && (
                      <span className="inline-block mt-1 font-body text-[10px] tracking-widest uppercase text-brand-green bg-brand-green/10 px-2 py-0.5">
                        Verified
                      </span>
                    )}
                  </div>
                </div>
                {review.body && (
                  <p className="font-body text-base text-brand-muted leading-relaxed">{review.body}</p>
                )}
              </div>
            )
          })}
          <a
            href={`https://www.inheritedskincare.com/products/${productHandle}#judgeme_product_reviews`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block font-body text-sm text-brand-amber underline underline-offset-4 hover:text-brand-dark transition-colors mt-2"
          >
            Read all {ratingCount} reviews →
          </a>
        </div>
      ) : (
        /* Fallback — aggregate only */
        <div className="border border-brand-warm p-6 text-center space-y-3">
          {ratingValue !== null && ratingCount !== null && ratingCount > 0 ? (
            <>
              <Stars rating={Math.round(ratingValue)} />
              <p className="font-display text-3xl font-semibold text-brand-dark">{ratingValue.toFixed(1)} / 5</p>
              <p className="font-body text-brand-muted">Based on {ratingCount} reviews</p>
              <a
                href={`https://www.inheritedskincare.com/products/${productHandle}#judgeme_product_reviews`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block font-body text-sm text-brand-amber underline underline-offset-4 hover:text-brand-dark transition-colors"
              >
                Read all reviews →
              </a>
            </>
          ) : (
            <p className="font-body text-brand-muted">No reviews yet. Be the first!</p>
          )}
        </div>
      )}
    </div>
  )
}
