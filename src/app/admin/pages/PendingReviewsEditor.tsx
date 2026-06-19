'use client'

import { useState, useEffect } from 'react'
import { CheckCircle2, XCircle, Loader2, Star, Clock, Info } from 'lucide-react'

interface PendingReview {
  id: string
  productHandle: string
  authorName: string
  rating: number
  title: string
  body: string
  createdAt: string
}

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <svg key={s} className="w-3.5 h-3.5" viewBox="0 0 20 20" fill={s <= rating ? '#C8923A' : 'none'} stroke="#C8923A" strokeWidth="1.5">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  )
}

export default function PendingReviewsEditor() {
  const [reviews, setReviews] = useState<PendingReview[]>([])
  const [loading, setLoading] = useState(true)
  const [configured, setConfigured] = useState(true)
  const [busy, setBusy] = useState<string | null>(null)
  const [toast, setToast] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/admin/pending-reviews')
      .then((r) => r.json())
      .then((d) => {
        setReviews(d.reviews ?? [])
        setConfigured(d.configured !== false)
      })
      .finally(() => setLoading(false))
  }, [])

  async function handleAction(id: string, action: 'approve' | 'reject') {
    setBusy(id)
    try {
      const res = await fetch('/api/admin/pending-reviews', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, action }),
      })
      const data = await res.json()
      if (!res.ok || !data.success) throw new Error(data.error ?? 'Failed')
      setReviews((prev) => prev.filter((r) => r.id !== id))
      setToast(action === 'approve' ? 'Review approved and published.' : 'Review rejected and removed.')
      setTimeout(() => setToast(null), 4000)
    } catch {
      setToast('Action failed — please try again.')
      setTimeout(() => setToast(null), 4000)
    } finally {
      setBusy(null)
    }
  }

  if (loading) {
    return (
      <div className="bg-white border border-brand-warm rounded-2xl p-10 shadow-sm flex items-center justify-center gap-3 text-brand-muted font-body text-sm">
        <Loader2 size={18} className="animate-spin text-brand-amber" />
        Loading reviews…
      </div>
    )
  }

  if (!configured) {
    return (
      <div className="bg-white border border-brand-warm rounded-2xl p-6 shadow-sm flex items-start gap-3">
        <Info size={16} className="text-brand-amber mt-0.5 flex-shrink-0" />
        <p className="font-body text-sm text-brand-dark">
          Connect your Shopify Admin token to enable customer review submissions and approvals.
        </p>
      </div>
    )
  }

  return (
    <div className="bg-white border border-brand-warm rounded-2xl shadow-sm overflow-hidden">
      {toast && (
        <div className="bg-green-50 border-b border-green-200 px-6 py-3 flex items-center gap-2">
          <CheckCircle2 size={14} className="text-green-600 flex-shrink-0" />
          <p className="font-body text-sm text-green-800">{toast}</p>
        </div>
      )}

      <div className="p-6 md:p-8">
        {reviews.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Star size={32} strokeWidth={1} className="text-brand-amber/40 mb-3" />
            <p className="font-body text-sm text-brand-dark font-semibold">No pending reviews</p>
            <p className="font-body text-xs text-brand-muted mt-1">New customer reviews will appear here for approval.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {reviews.map((review) => (
              <div key={review.id} className="border border-brand-warm rounded-xl p-5">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Stars rating={review.rating} />
                      <span className="font-body text-xs text-brand-muted">
                        on <span className="font-medium text-brand-dark">{review.productHandle}</span>
                      </span>
                    </div>
                    <p className="font-body text-sm font-semibold text-brand-dark">{review.authorName}</p>
                    {review.title && (
                      <p className="font-body text-sm text-brand-dark italic">&ldquo;{review.title}&rdquo;</p>
                    )}
                  </div>
                  <div className="flex items-center gap-1.5 text-brand-muted flex-shrink-0">
                    <Clock size={12} />
                    <span className="font-body text-[11px]">
                      {new Date(review.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                  </div>
                </div>

                {review.body && (
                  <p className="font-body text-sm text-brand-muted leading-relaxed mb-4">{review.body}</p>
                )}

                <div className="flex gap-2">
                  <button
                    type="button"
                    disabled={busy === review.id}
                    onClick={() => handleAction(review.id, 'approve')}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-brand-green/10 text-brand-green border border-brand-green/30 font-body text-xs tracking-widest uppercase rounded-lg hover:bg-brand-green/20 transition-colors disabled:opacity-50"
                  >
                    {busy === review.id ? <Loader2 size={12} className="animate-spin" /> : <CheckCircle2 size={12} />}
                    Approve
                  </button>
                  <button
                    type="button"
                    disabled={busy === review.id}
                    onClick={() => handleAction(review.id, 'reject')}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-red-50 text-red-600 border border-red-200 font-body text-xs tracking-widest uppercase rounded-lg hover:bg-red-100 transition-colors disabled:opacity-50"
                  >
                    {busy === review.id ? <Loader2 size={12} className="animate-spin" /> : <XCircle size={12} />}
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
