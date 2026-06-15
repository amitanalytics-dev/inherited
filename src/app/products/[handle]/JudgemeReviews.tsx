interface ParsedReview {
  id: number
  title: string
  body: string
  rating: number
  authorName: string
  date: string
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

// Try Judge.me REST API (unauthenticated — works on some shops)
async function tryJudgemeApi(numericId: string): Promise<ParsedReview[]> {
  try {
    const res = await fetch(
      `https://judge.me/api/v1/reviews?shop_domain=leela-skincare.myshopify.com&product_external_id=${numericId}&per_page=10&page=1`,
      { next: { revalidate: 86400 } }
    )
    if (!res.ok) return []
    const data = await res.json()
    if (!Array.isArray(data.reviews) || data.reviews.length === 0) return []
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return data.reviews.map((r: any, i: number) => ({
      id: r.id ?? i,
      title: r.title ?? '',
      body: r.body ?? '',
      rating: Math.round(r.rating ?? 5),
      authorName: r.reviewer?.name ?? 'Customer',
      date: r.created_at ?? '',
      verified: r.verified ?? false,
    }))
  } catch {
    return []
  }
}

// Parse individual reviews from JSON-LD structured data that Judge.me injects for SEO
async function tryHtmlScrape(productHandle: string): Promise<ParsedReview[]> {
  try {
    const res = await fetch(
      `https://www.inheritedskincare.com/products/${productHandle}`,
      {
        next: { revalidate: 86400 },
        headers: { 'User-Agent': 'Mozilla/5.0 (compatible; bot/1.0)', Accept: 'text/html' },
      }
    )
    if (!res.ok) return []
    const html = await res.text()

    // Extract every JSON-LD block
    const pattern = /<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g
    const blocks = [...html.matchAll(pattern)]

    for (const block of blocks) {
      try {
        const raw = JSON.parse(block[1])
        const items: unknown[] = Array.isArray(raw) ? raw : [raw]
        for (const item of items) {
          const obj = item as Record<string, unknown>
          if (obj['@type'] !== 'Product') continue
          const reviewField = obj['review']
          if (!reviewField) continue
          const list = Array.isArray(reviewField) ? reviewField : [reviewField]
          if (list.length === 0) continue
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          return list.map((r: any, i: number) => ({
            id: i,
            title: r.name ?? '',
            body: r.reviewBody ?? '',
            rating: Math.round(parseFloat(r.reviewRating?.ratingValue ?? '5')),
            authorName: r.author?.name ?? 'Customer',
            date: r.datePublished ?? '',
            verified: true,
          }))
        }
      } catch {
        // malformed JSON-LD block — skip
      }
    }
    return []
  } catch {
    return []
  }
}

async function getReviews(productId: string, productHandle: string): Promise<ParsedReview[]> {
  const numericId = productId.replace('gid://shopify/Product/', '')

  const apiReviews = await tryJudgemeApi(numericId)
  if (apiReviews.length > 0) return apiReviews

  return tryHtmlScrape(productHandle)
}

interface Props {
  productId: string
  ratingValue: number | null
  ratingCount: number | null
  productHandle: string
}

export default async function JudgemeReviews({ productId, ratingValue, ratingCount, productHandle }: Props) {
  const reviews = await getReviews(productId, productHandle)

  return (
    <div className="mt-16">
      {/* Header row */}
      <div className="flex items-center justify-between mb-8">
        <h2 className="font-display font-semibold text-2xl md:text-3xl text-brand-dark">
          Customer Reviews
        </h2>
        {ratingValue !== null && ratingCount !== null && ratingCount > 0 && (
          <div className="flex items-center gap-2">
            <Stars rating={Math.round(ratingValue)} size="md" />
            <span className="font-body font-semibold text-brand-dark">{ratingValue.toFixed(1)}</span>
            <span className="font-body text-sm text-brand-muted">({ratingCount} reviews)</span>
          </div>
        )}
      </div>

      {reviews.length > 0 ? (
        <>
          <div className="space-y-6">
            {reviews.map((review) => {
              const dateStr = review.date
                ? new Date(review.date).toLocaleDateString('en-GB', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })
                : ''
              return (
                <div key={review.id} className="border-b border-brand-warm pb-6 last:border-0">
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <div className="space-y-1">
                      <Stars rating={review.rating} />
                      {review.title && (
                        <p className="font-body font-semibold text-brand-dark">{review.title}</p>
                      )}
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="font-body text-sm font-medium text-brand-dark">{review.authorName}</p>
                      {dateStr && (
                        <p className="font-body text-xs text-brand-muted mt-0.5">{dateStr}</p>
                      )}
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
          </div>

          <a
            href={`https://www.inheritedskincare.com/products/${productHandle}#judgeme_product_reviews`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-6 font-body text-sm text-brand-amber underline underline-offset-4 hover:text-brand-dark transition-colors"
          >
            Read all {ratingCount ?? ''} reviews →
          </a>
        </>
      ) : (
        /* No reviews returned — show aggregate + link */
        <div className="py-8 border border-brand-warm text-center space-y-4">
          {ratingValue !== null && ratingCount !== null && ratingCount > 0 ? (
            <>
              <div className="flex justify-center">
                <Stars rating={Math.round(ratingValue)} size="md" />
              </div>
              <p className="font-display text-4xl font-semibold text-brand-dark">
                {ratingValue.toFixed(1)} <span className="text-brand-muted text-2xl">/ 5</span>
              </p>
              <p className="font-body text-brand-muted">Based on {ratingCount} verified reviews</p>
              <a
                href={`https://www.inheritedskincare.com/products/${productHandle}#judgeme_product_reviews`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block font-body text-sm text-brand-amber underline underline-offset-4 hover:text-brand-dark transition-colors"
              >
                Read all reviews on our store →
              </a>
            </>
          ) : (
            <p className="font-body text-brand-muted">No reviews yet — be the first!</p>
          )}
        </div>
      )}
    </div>
  )
}
