import reviewsData from '@/data/reviews.json'
import { adminConfigured, adminQuery } from '@/lib/admin-shopify'
import { fetchJudgemeReviews } from '@/lib/judgeme'
import ReviewForm from './ReviewForm'
import ReviewListClient from './ReviewListClient'

interface StaticReview {
  id: number
  authorName: string
  rating: number
  title: string
  body: string
  verified: boolean
}

interface CustomerReview {
  id: string
  authorName: string
  rating: number
  title: string
  body: string
  createdAt: string
  verified: boolean
}

type AnyReview = StaticReview | CustomerReview

function Stars({ rating, size = 'sm' }: { rating: number; size?: 'sm' | 'md' | 'lg' }) {
  const dim = size === 'lg' ? 'w-7 h-7' : size === 'md' ? 'w-5 h-5' : 'w-4 h-4'
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

function RatingBar({ star, count, total }: { star: number; count: number; total: number }) {
  const pct = total > 0 ? Math.round((count / total) * 100) : 0
  return (
    <div className="flex items-center gap-2.5">
      <span className="font-body text-xs text-brand-muted w-3 text-right flex-shrink-0">{star}</span>
      <svg className="w-3.5 h-3.5 flex-shrink-0" viewBox="0 0 20 20" fill="#C8923A">
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
      <div className="flex-1 h-2 bg-brand-warm rounded-full overflow-hidden">
        <div
          className="h-full bg-brand-amber rounded-full"
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="font-body text-xs text-brand-muted w-5 text-right flex-shrink-0">{count}</span>
    </div>
  )
}



const GET_CUSTOMER_REVIEWS = `
  query getCustomerReviews {
    shop {
      metafield(namespace: "site", key: "customer_reviews") {
        value
      }
    }
  }
`

async function fetchCustomerReviews(handle: string): Promise<CustomerReview[]> {
  if (!adminConfigured()) return []
  try {
    const data = await adminQuery<{ shop: { metafield: { value: string } | null } }>(GET_CUSTOMER_REVIEWS)
    const value = data.shop?.metafield?.value
    if (!value) return []
    const all: Record<string, CustomerReview[]> = JSON.parse(value)
    return all[handle] ?? []
  } catch {
    return []
  }
}

interface Props {
  productHandle: string
  ratingValue: number | null
  ratingCount: number | null
}

async function fetchReviewOverrides(): Promise<Record<string, string>> {
  if (!adminConfigured()) return {}
  try {
    const data = await adminQuery<{ shop: { metafield: { value: string } | null } }>(`
      query { shop { metafield(namespace: "site", key: "review_name_overrides") { value } } }
    `)
    return JSON.parse(data.shop?.metafield?.value ?? '{}')
  } catch {
    return {}
  }
}

export default async function JudgemeReviews({ productHandle, ratingValue, ratingCount }: Props) {
  const [judgemeReviews, customerReviews, nameOverrides] = await Promise.all([
    fetchJudgemeReviews(productHandle),
    fetchCustomerReviews(productHandle),
    fetchReviewOverrides(),
  ])

  // Use Judge.me reviews if available; fall back to local static data
  const allStaticReviews = reviewsData as Record<string, StaticReview[]>
  const staticReviews: StaticReview[] = judgemeReviews.length === 0 ? (allStaticReviews[productHandle] ?? []) : []

  const allReviews: AnyReview[] = [...customerReviews, ...judgemeReviews, ...staticReviews]
  const totalCount = allReviews.length

  const allRatings = allReviews.map((r) => r.rating)
  const displayCount = totalCount > 0 ? totalCount : (ratingCount ?? 0)
  const displayRating =
    ratingValue ??
    (allRatings.length > 0
      ? Math.round((allRatings.reduce((sum, r) => sum + r, 0) / allRatings.length) * 10) / 10
      : null)

  // Compute per-star distribution from local reviews
  const distribution = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: allReviews.filter((r) => r.rating === star).length,
  }))
  const distributionTotal = distribution.reduce((s, d) => s + d.count, 0)

  return (
    <div className="mt-16" id="reviews">

      {/* Summary card — Judge.me style */}
      {displayRating !== null && displayCount > 0 && (
        <div className="border border-brand-warm p-6 sm:p-8 mb-8">
          {/* Title row */}
          <div className="flex items-start justify-between gap-4 mb-6">
            <h2 className="font-display font-semibold text-2xl md:text-3xl text-brand-dark">
              Customer Reviews
            </h2>
            {/* Judge.me verified badge — inline SVG seal */}
            <a
              href="https://judge.me"
              target="_blank"
              rel="noopener noreferrer"
              className="flex-shrink-0 flex flex-col items-center gap-0.5 group opacity-80 group-hover:opacity-100 transition-opacity"
              title="Verified by Judge.me"
            >
              <svg width="60" height="60" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Outer seal ring */}
                <circle cx="30" cy="30" r="28" fill="#C8923A" />
                <circle cx="30" cy="30" r="24" fill="none" stroke="#fff" strokeWidth="1.5" />
                {/* Star burst points */}
                {[0,30,60,90,120,150,180,210,240,270,300,330].map((deg, i) => {
                  const r1 = 28, r2 = 22
                  const a1 = (deg * Math.PI) / 180
                  const a2 = ((deg + 15) * Math.PI) / 180
                  const x1 = 30 + r1 * Math.sin(a1), y1 = 30 - r1 * Math.cos(a1)
                  const x2 = 30 + r2 * Math.sin(a2), y2 = 30 - r2 * Math.cos(a2)
                  return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#fff" strokeWidth="1" opacity="0.5" />
                })}
                {/* Checkmark */}
                <path d="M19 30.5l7.5 7.5 14.5-15" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                {/* Text */}
                <text x="30" y="52" textAnchor="middle" fill="#fff" fontSize="6" fontFamily="Arial, sans-serif" fontWeight="bold" letterSpacing="0.5">JUDGE.ME</text>
              </svg>
            </a>
          </div>

          {/* Score + bars */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
            {/* Overall score */}
            <div className="flex flex-col items-center text-center">
              <div className="font-display text-5xl sm:text-6xl font-semibold text-brand-dark leading-none mb-3">
                {displayRating.toFixed(2)}
              </div>
              <Stars rating={Math.round(displayRating)} size="md" />
              <p className="font-body text-sm text-brand-muted mt-2">
                {displayRating.toFixed(2)} out of 5
              </p>
              <div className="flex items-center gap-1.5 mt-1">
                <svg className="w-4 h-4 text-brand-green" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="font-body text-xs text-brand-green">
                  Based on {displayCount} review{displayCount !== 1 ? 's' : ''}
                </span>
              </div>
            </div>

            {/* Rating bars */}
            <div className="space-y-2.5">
              {distribution.map(({ star, count }) => (
                <RatingBar
                  key={star}
                  star={star}
                  count={count}
                  total={distributionTotal}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Reviews list header + write button */}
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-display font-semibold text-xl text-brand-dark">
          {totalCount > 0 ? `${totalCount} Review${totalCount !== 1 ? 's' : ''}` : 'Reviews'}
        </h3>
        <a
          href="#review-form"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-dark text-brand-cream font-body text-xs tracking-widest uppercase hover:bg-brand-amber transition-colors"
        >
          Write a Review
        </a>
      </div>

      {/* Paginated review cards */}
      {totalCount > 0 ? (
        <ReviewListClient
          nameOverrides={nameOverrides}
          reviews={allReviews.map((r) => ({
            id: r.id,
            authorName: r.authorName,
            rating: r.rating,
            title: r.title,
            body: r.body,
            verified: r.verified,
            createdAt: 'createdAt' in r ? r.createdAt : undefined,
          }))}
        />
      ) : (
        <div className="py-8 border border-brand-warm text-center">
          <p className="font-body text-brand-muted">No reviews yet — be the first!</p>
        </div>
      )}

      <ReviewForm productHandle={productHandle} />
    </div>
  )
}
