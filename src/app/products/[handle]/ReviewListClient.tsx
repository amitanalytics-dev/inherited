'use client'

import { useState } from 'react'

interface Review {
  id: string | number
  authorName: string
  rating: number
  title: string
  body: string
  verified: boolean
  createdAt?: string
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

const PAGE_SIZE = 6

export default function ReviewListClient({ reviews }: { reviews: Review[] }) {
  const [page, setPage] = useState(1)
  const totalPages = Math.max(1, Math.ceil(reviews.length / PAGE_SIZE))
  const pageReviews = reviews.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  function goTo(p: number) {
    setPage(p)
    document.getElementById('reviews')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-0 md:gap-x-8">
      {pageReviews.map((review) => {
        const date = review.createdAt
          ? new Date(review.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
          : null
        const displayName = /^suruchi\b/i.test(review.authorName.trim()) ? 'Customer' : review.authorName
        return (
          <div key={String(review.id)} className="border-b border-brand-warm py-6 last:border-b-0 md:last:border-b md:[&:nth-last-child(2):nth-child(odd)]:border-b-0">
            <div className="flex items-start justify-between gap-4 mb-2">
              <div>
                <Stars rating={review.rating} />
                {review.title && (
                  <p className="font-body font-semibold text-brand-dark text-sm mt-1.5 leading-snug">
                    {review.title}
                  </p>
                )}
              </div>
              <div className="text-right flex-shrink-0">
                <p className="font-body text-sm font-medium text-brand-dark">{displayName}</p>
                {review.verified && (
                  <div className="flex items-center justify-end gap-1 mt-1">
                    <svg className="w-3.5 h-3.5 text-brand-green" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="font-body text-[10px] tracking-widest uppercase text-brand-green">Verified</span>
                  </div>
                )}
                {date && <p className="font-body text-[11px] text-brand-muted mt-0.5">{date}</p>}
              </div>
            </div>
            {review.body && (
              <p className="font-body text-sm text-brand-muted leading-relaxed">{review.body}</p>
            )}
          </div>
        )
      })}
      </div>

      {totalPages > 1 && (
        <div className="mt-6 flex items-center justify-center gap-2 flex-wrap">
          {page > 1 && (
            <button
              onClick={() => goTo(page - 1)}
              className="px-4 py-2 font-body text-xs tracking-widest uppercase border border-brand-dark text-brand-dark hover:bg-brand-dark hover:text-brand-cream transition-colors"
            >
              ← Prev
            </button>
          )}
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => goTo(p)}
              className={`w-9 h-9 flex items-center justify-center font-body text-xs transition-colors ${
                p === page
                  ? 'bg-brand-dark text-brand-cream'
                  : 'border border-brand-warm text-brand-muted hover:border-brand-dark hover:text-brand-dark'
              }`}
            >
              {p}
            </button>
          ))}
          {page < totalPages && (
            <button
              onClick={() => goTo(page + 1)}
              className="px-4 py-2 font-body text-xs tracking-widest uppercase border border-brand-dark text-brand-dark hover:bg-brand-dark hover:text-brand-cream transition-colors"
            >
              Next →
            </button>
          )}
        </div>
      )}
    </div>
  )
}
