import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { getSiteSettings } from '@/lib/site-settings'
import { adminConfigured, adminQuery } from '@/lib/admin-shopify'
import reviewsData from '@/data/reviews.json'
import { storefront } from '@/lib/shopify'
import { fetchJudgemeReviews } from '@/lib/judgeme'

export const metadata: Metadata = {
  title: 'Reviews',
  description:
    'Real reviews from real Inherited Skincare customers — 5.0★ rated, loved by 1,800+ customers across the UK.',
}

export const dynamic = 'force-dynamic'

function Stars({ size = 'w-4 h-4', rating = 5 }: { size?: string; rating?: number }) {
  return (
    <div className="flex items-center gap-0.5" aria-label={`${rating} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <svg
          key={i}
          className={`${size}`}
          viewBox="0 0 20 20"
          fill={i <= rating ? '#C8923A' : 'none'}
          stroke="#C8923A"
          strokeWidth="1.5"
          aria-hidden="true"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  )
}

const GET_PRODUCT_TITLE = `
  query getProductTitle($handle: String!) {
    productByHandle(handle: $handle) {
      title
    }
  }
`

const GET_CUSTOMER_REVIEWS = `
  query getCustomerReviews {
    shop {
      metafield(namespace: "site", key: "customer_reviews") {
        value
      }
    }
  }
`

interface CustomerReview {
  id: string
  authorName: string
  rating: number
  title: string
  body: string
  createdAt: string
  verified: boolean
}

interface StaticReview {
  id: number
  authorName: string
  rating: number
  title: string
  body: string
  verified: boolean
}

async function fetchProductReviews(handle: string): Promise<{
  productTitle: string
  reviews: (StaticReview | CustomerReview)[]
}> {
  // Fetch from Judge.me (real reviews), local static, and admin-submitted — in parallel
  const [judgemeReviews, customerReviews] = await Promise.all([
    fetchJudgemeReviews(handle),
    adminConfigured()
      ? adminQuery<{ shop: { metafield: { value: string } | null } }>(GET_CUSTOMER_REVIEWS)
          .then((data) => {
            const all: Record<string, CustomerReview[]> = JSON.parse(data.shop?.metafield?.value ?? '{}')
            return all[handle] ?? []
          })
          .catch(() => [] as CustomerReview[])
      : Promise.resolve([] as CustomerReview[]),
  ])

  // If Judge.me returned reviews, use them as the source of truth (skip local static)
  const allStatic = reviewsData as Record<string, StaticReview[]>
  const staticReviews: StaticReview[] = judgemeReviews.length === 0 ? (allStatic[handle] ?? []) : []

  let productTitle = handle.replace(/-/g, ' ')
  try {
    const data = await storefront<{ productByHandle: { title: string } | null }>(
      GET_PRODUCT_TITLE,
      { handle }
    )
    if (data.productByHandle?.title) productTitle = data.productByHandle.title
  } catch {
    // silently fall back
  }

  return {
    productTitle,
    reviews: [...customerReviews, ...judgemeReviews, ...staticReviews],
  }
}

const PAGE_SIZE = 5

export default async function ReviewsPage({
  searchParams,
}: {
  searchParams: { product?: string; page?: string }
}) {
  const productHandle = searchParams.product ?? null

  if (productHandle) {
    const { productTitle, reviews } = await fetchProductReviews(productHandle)

    const totalCount = reviews.length
    const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE))
    const currentPage = Math.min(Math.max(1, parseInt(searchParams.page ?? '1', 10)), totalPages)
    const pageReviews = reviews.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)
    const showingFrom = totalCount === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1
    const showingTo = Math.min(currentPage * PAGE_SIZE, totalCount)

    const pageUrl = (p: number) => `/reviews?product=${productHandle}&page=${p}`

    return (
      <div className="min-h-screen bg-brand-cream pt-24 md:pt-28">
        <div className="bg-brand-warm border-b border-brand-warm/80 py-10 md:py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <Link
              href="/reviews"
              className="inline-block font-body text-[11px] tracking-[0.3em] uppercase text-brand-amber mb-4 hover:underline underline-offset-2"
            >
              ← All Reviews
            </Link>
            <p className="font-body text-[11px] tracking-[0.35em] uppercase text-brand-muted mb-2">
              Customer Reviews
            </p>
            <h1 className="font-display font-semibold text-4xl md:text-5xl text-brand-dark">
              {productTitle}
            </h1>
            {totalCount > 0 && (
              <div className="flex items-center justify-center gap-3 mt-4">
                <Stars />
                <p className="font-body text-sm text-brand-muted">
                  {totalCount} review{totalCount !== 1 ? 's' : ''}
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-12">
          {totalCount === 0 ? (
            <div className="text-center py-16 border border-brand-warm">
              <p className="font-body text-brand-muted">No reviews yet for this product.</p>
              <Link
                href={`/products/${productHandle}`}
                className="inline-block mt-4 font-body text-sm text-brand-amber hover:underline underline-offset-2"
              >
                View product →
              </Link>
            </div>
          ) : (
            <>
              {/* Showing X–Y of Z */}
              <p className="font-body text-xs text-brand-muted mb-6 text-center tracking-wide">
                Showing {showingFrom}–{showingTo} of {totalCount} reviews
              </p>

              <div className="space-y-4">
                {pageReviews.map((review) => (
                  <div
                    key={review.id}
                    className="bg-white border border-brand-warm p-6 sm:p-8"
                  >
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div className="space-y-1.5">
                        <Stars rating={review.rating} size="w-4 h-4" />
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
                        {'createdAt' in review && review.createdAt && (
                          <p className="font-body text-[11px] text-brand-muted mt-1">
                            {new Date(review.createdAt as string).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                          </p>
                        )}
                      </div>
                    </div>
                    {review.body && (
                      <p className="font-body text-sm text-brand-muted leading-relaxed">{review.body}</p>
                    )}
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-10 flex items-center justify-center gap-2 flex-wrap">
                  {currentPage > 1 && (
                    <Link
                      href={pageUrl(currentPage - 1)}
                      className="px-4 py-2 font-body text-xs tracking-widest uppercase border border-brand-dark text-brand-dark hover:bg-brand-dark hover:text-brand-cream transition-colors"
                    >
                      ← Prev
                    </Link>
                  )}
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                    <Link
                      key={p}
                      href={pageUrl(p)}
                      className={`w-9 h-9 flex items-center justify-center font-body text-xs transition-colors ${
                        p === currentPage
                          ? 'bg-brand-dark text-brand-cream'
                          : 'border border-brand-warm text-brand-muted hover:border-brand-dark hover:text-brand-dark'
                      }`}
                    >
                      {p}
                    </Link>
                  ))}
                  {currentPage < totalPages && (
                    <Link
                      href={pageUrl(currentPage + 1)}
                      className="px-4 py-2 font-body text-xs tracking-widest uppercase border border-brand-dark text-brand-dark hover:bg-brand-dark hover:text-brand-cream transition-colors"
                    >
                      Next →
                    </Link>
                  )}
                </div>
              )}
            </>
          )}

          <div className="mt-10 text-center">
            <Link
              href={`/products/${productHandle}`}
              className="inline-flex items-center justify-center px-8 py-4 bg-brand-dark text-brand-cream font-body text-xs tracking-widest uppercase hover:bg-brand-amber transition-colors"
            >
              Back to Product
            </Link>
          </div>
        </div>
      </div>
    )
  }

  // — Default: all reviews page —
  const settings = await getSiteSettings()
  const reviews = settings.pages.reviews.items

  return (
    <div className="min-h-screen bg-brand-cream pt-24 md:pt-28">
      {/* Header */}
      <div className="bg-brand-warm border-b border-brand-warm/80 py-10 md:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="font-body text-[11px] tracking-[0.35em] uppercase text-brand-amber mb-3">
            Customer Stories
          </p>
          <h1 className="font-display font-semibold text-5xl md:text-6xl text-brand-dark">
            Real Skin, <em className="italic">Real Results</em>
          </h1>
          <div className="flex items-center justify-center gap-3 mt-4">
            <Stars />
            <p className="font-body text-sm text-brand-muted">
              5.0★ · Loved by 1,800+ customers
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-12">
        {/* Featured before / after */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10 items-center mb-10 md:mb-12">
          <div className="relative aspect-[4/3] overflow-hidden bg-brand-warm">
            <Image
              src="/images/reviews/before_after.jpg"
              alt="Customer before and after results with Inherited Skincare"
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
          <div>
            <p className="font-body text-[11px] tracking-[0.3em] uppercase text-brand-amber mb-3">
              Real Results
            </p>
            <h2 className="font-display font-semibold text-3xl md:text-4xl text-brand-dark leading-tight mb-4">
              Real results you can <em className="italic">see.</em>
            </h2>
            <p className="font-body text-base text-brand-muted leading-relaxed mb-6">
              From eczema to dullness — ghee rituals that work. Their words, unedited.
            </p>
            <Link
              href="/products"
              className="inline-flex items-center justify-center px-8 py-4 bg-brand-dark text-brand-cream font-body text-xs tracking-widest uppercase hover:bg-brand-amber transition-colors"
            >
              Shop the Ritual
            </Link>
          </div>
        </div>

        {/* Real customer before & after gallery */}
        <div className="mb-10 md:mb-12">
          <div className="text-center mb-6">
            <p className="font-body text-[11px] tracking-[0.3em] uppercase text-brand-amber mb-2">
              Before &amp; After
            </p>
            <h2 className="font-display font-semibold text-3xl md:text-4xl text-brand-dark">
              Real Customer <em className="italic">Transformations</em>
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 md:gap-4">
            {[1, 2, 3, 4, 5].map((n) => (
              <div
                key={n}
                className="relative aspect-square overflow-hidden bg-brand-warm ring-1 ring-brand-warm"
              >
                <Image
                  src={`/images/reviews/ba_${n}.jpg`}
                  alt={`Customer before and after result ${n}`}
                  fill
                  sizes="(max-width: 768px) 50vw, 20vw"
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        </div>

        {/* All reviews grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
          {reviews.map((review) => (
            <div
              key={review.name}
              className="bg-white ring-1 ring-brand-warm shadow-sm flex flex-col"
            >
              {review.img && (
                <div className="relative aspect-square overflow-hidden bg-brand-warm">
                  <Image
                    src={review.img}
                    alt={`${review.name} — customer photo`}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover"
                  />
                </div>
              )}
              <div className="p-5 flex flex-col flex-1">
                <div className="flex items-center justify-between mb-2.5">
                  <Stars size="w-3.5 h-3.5" />
                  <span className="font-body text-[10px] tracking-widest uppercase bg-brand-warm text-brand-dark px-2 py-0.5">
                    {review.concern}
                  </span>
                </div>
                <p className="font-body text-sm text-brand-muted leading-relaxed mb-4 flex-1">
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
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-10 md:mt-12">
          <p className="font-display italic text-xl text-brand-muted mb-5">
            Ready to write your own?
          </p>
          <Link
            href="/quiz"
            className="inline-flex items-center justify-center px-8 py-4 border border-brand-dark text-brand-dark font-body text-xs tracking-widest uppercase hover:bg-brand-dark hover:text-brand-cream transition-colors"
          >
            Find Your Ritual
          </Link>
        </div>
      </div>
    </div>
  )
}
