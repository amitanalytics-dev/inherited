'use client'

import { useState, useCallback, useRef } from 'react'

interface Review {
  id: number
  authorName: string
  rating: number
  title: string
  body: string
  createdAt: string
  productHandle: string
  verified: boolean
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

export default function AdminReviewsPage() {
  const [password, setPassword] = useState('')
  const [authed, setAuthed] = useState(false)
  const [authError, setAuthError] = useState('')
  const [loading, setLoading] = useState(false)

  const [reviews, setReviews] = useState<Review[]>([])
  const [overrides, setOverrides] = useState<Record<string, string>>({})
  const [mediaOverrides, setMediaOverrides] = useState<Record<string, string[]>>({})
  const [editValues, setEditValues] = useState<Record<string, string>>({})
  const [savingId, setSavingId] = useState<string | null>(null)
  const [savedId, setSavedId] = useState<string | null>(null)
  const [filterCustomer, setFilterCustomer] = useState(true)

  // media upload state per review
  const [uploadingId, setUploadingId] = useState<string | null>(null)
  const [uploadError, setUploadError] = useState<Record<string, string>>({})
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({})

  const authHeaders = useCallback(() => ({
    Authorization: `Bearer ${password}`,
  }), [password])

  const jsonHeaders = useCallback(() => ({
    'Content-Type': 'application/json',
    Authorization: `Bearer ${password}`,
  }), [password])

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setAuthError('')
    try {
      const [reviewsRes, overridesRes, mediaRes] = await Promise.all([
        fetch('/api/admin/all-reviews', { headers: authHeaders() }),
        fetch('/api/admin/review-overrides', { headers: authHeaders() }),
        fetch('/api/admin/review-media', { headers: authHeaders() }),
      ])
      if (reviewsRes.status === 401 || overridesRes.status === 401) {
        setAuthError('Wrong password.')
        setLoading(false)
        return
      }
      const reviewsData = await reviewsRes.json()
      const overridesData = await overridesRes.json()
      const mediaData = mediaRes.ok ? await mediaRes.json() : { media: {} }
      setReviews(reviewsData.reviews ?? [])
      setOverrides(overridesData.overrides ?? {})
      setMediaOverrides(mediaData.media ?? {})
      const initEdit: Record<string, string> = {}
      for (const r of (reviewsData.reviews ?? []) as Review[]) {
        initEdit[String(r.id)] = overridesData.overrides?.[String(r.id)] ?? ''
      }
      setEditValues(initEdit)
      setAuthed(true)
    } catch {
      setAuthError('Failed to connect. Check console.')
    }
    setLoading(false)
  }

  async function handleSave(reviewId: number) {
    const key = String(reviewId)
    setSavingId(key)
    try {
      const res = await fetch('/api/admin/review-overrides', {
        method: 'POST',
        headers: jsonHeaders(),
        body: JSON.stringify({ reviewId, displayName: editValues[key] ?? '' }),
      })
      const data = await res.json()
      if (data.success) {
        setOverrides(data.overrides ?? {})
        setSavedId(key)
        setTimeout(() => setSavedId(null), 2000)
      }
    } catch {
      // ignore
    }
    setSavingId(null)
  }

  async function handleClear(reviewId: number) {
    const key = String(reviewId)
    setEditValues((prev) => ({ ...prev, [key]: '' }))
    setSavingId(key)
    try {
      const res = await fetch('/api/admin/review-overrides', {
        method: 'POST',
        headers: jsonHeaders(),
        body: JSON.stringify({ reviewId, displayName: '' }),
      })
      const data = await res.json()
      if (data.success) {
        setOverrides(data.overrides ?? {})
        setSavedId(key)
        setTimeout(() => setSavedId(null), 2000)
      }
    } catch {
      // ignore
    }
    setSavingId(null)
  }

  async function saveMedia(reviewId: number, urls: string[]) {
    await fetch('/api/admin/review-media', {
      method: 'POST',
      headers: jsonHeaders(),
      body: JSON.stringify({ reviewId, mediaUrls: urls }),
    })
  }

  async function handleFileChange(reviewId: number, e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const key = String(reviewId)
    setUploadingId(key)
    setUploadError((prev) => ({ ...prev, [key]: '' }))

    try {
      const form = new FormData()
      form.append('file', file)
      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        headers: authHeaders(),
        body: form,
      })
      const data = await res.json()
      if (!res.ok || data.error) {
        setUploadError((prev) => ({ ...prev, [key]: data.error ?? 'Upload failed.' }))
      } else if (data.url) {
        const newUrls = [...(mediaOverrides[key] ?? []), data.url]
        setMediaOverrides((prev) => ({ ...prev, [key]: newUrls }))
        await saveMedia(reviewId, newUrls)
      }
    } catch {
      setUploadError((prev) => ({ ...prev, [key]: 'Network error during upload.' }))
    }

    setUploadingId(null)
    // reset input so same file can be re-selected
    if (fileInputRefs.current[key]) fileInputRefs.current[key]!.value = ''
  }

  async function handleRemoveMedia(reviewId: number, idx: number) {
    const key = String(reviewId)
    const current = mediaOverrides[key] ?? []
    const newUrls = current.filter((_, i) => i !== idx)
    setMediaOverrides((prev) => ({ ...prev, [key]: newUrls }))
    await saveMedia(reviewId, newUrls)
  }

  const displayedReviews = filterCustomer
    ? reviews.filter((r) => r.authorName === 'Customer')
    : reviews

  if (!authed) {
    return (
      <div className="min-h-screen bg-brand-cream flex items-center justify-center px-4 pt-24">
        <div className="w-full max-w-sm">
          <h1 className="font-display font-semibold text-2xl text-brand-dark mb-2">Admin Portal</h1>
          <p className="font-body text-sm text-brand-muted mb-8">Enter your admin password to manage reviews.</p>
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Admin password"
              className="w-full border border-brand-warm bg-white px-4 py-3 font-body text-sm text-brand-dark placeholder:text-brand-muted/50 focus:outline-none focus:border-brand-dark"
              autoFocus
            />
            {authError && <p className="font-body text-sm text-red-600">{authError}</p>}
            <button
              type="submit"
              disabled={loading || !password}
              className="w-full bg-brand-dark text-brand-cream font-body text-xs tracking-widest uppercase py-3 hover:bg-brand-amber transition-colors disabled:opacity-50"
            >
              {loading ? 'Loading…' : 'Sign In'}
            </button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-brand-cream pt-24 pb-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display font-semibold text-3xl text-brand-dark">Review Manager</h1>
            <p className="font-body text-sm text-brand-muted mt-1">
              Edit reviewer names and add photos/videos to any review.
            </p>
          </div>
          <span className="font-body text-xs text-brand-muted">{reviews.length} total reviews</span>
        </div>

        {/* Filter toggle */}
        <div className="flex gap-3 mb-6">
          <button
            onClick={() => setFilterCustomer(true)}
            className={`font-body text-xs tracking-widest uppercase px-4 py-2 border transition-colors ${
              filterCustomer ? 'bg-brand-dark text-brand-cream border-brand-dark' : 'border-brand-warm text-brand-muted hover:border-brand-dark hover:text-brand-dark'
            }`}
          >
            &ldquo;Customer&rdquo; only ({reviews.filter((r) => r.authorName === 'Customer').length})
          </button>
          <button
            onClick={() => setFilterCustomer(false)}
            className={`font-body text-xs tracking-widest uppercase px-4 py-2 border transition-colors ${
              !filterCustomer ? 'bg-brand-dark text-brand-cream border-brand-dark' : 'border-brand-warm text-brand-muted hover:border-brand-dark hover:text-brand-dark'
            }`}
          >
            All reviews
          </button>
        </div>

        {displayedReviews.length === 0 && (
          <p className="font-body text-brand-muted py-8">No reviews found.</p>
        )}

        <div className="space-y-4">
          {displayedReviews.map((review) => {
            const key = String(review.id)
            const currentOverride = overrides[key]
            const isEdited = editValues[key] !== (currentOverride ?? '')
            const isSaving = savingId === key
            const isSaved = savedId === key
            const isUploading = uploadingId === key
            const reviewMedia = mediaOverrides[key] ?? []
            const date = new Date(review.createdAt).toLocaleDateString('en-GB', {
              day: 'numeric', month: 'short', year: 'numeric',
            })
            return (
              <div key={key} className="bg-white border border-brand-warm p-5">
                {/* Meta row */}
                <div className="flex items-center gap-3 mb-2 flex-wrap">
                  <Stars rating={review.rating} />
                  <span className="font-body text-xs text-brand-muted">{date}</span>
                  <span className="font-body text-[10px] tracking-widest uppercase text-brand-muted/60 bg-brand-warm px-2 py-0.5">
                    {review.productHandle}
                  </span>
                  {currentOverride && (
                    <span className="font-body text-[10px] tracking-widest uppercase text-brand-green bg-brand-green/10 px-2 py-0.5">
                      name override
                    </span>
                  )}
                  {reviewMedia.length > 0 && (
                    <span className="font-body text-[10px] tracking-widest uppercase text-brand-amber bg-brand-amber/10 px-2 py-0.5">
                      {reviewMedia.length} media
                    </span>
                  )}
                </div>

                {/* Review text */}
                {review.title && (
                  <p className="font-body text-sm font-semibold text-brand-dark mb-1">{review.title}</p>
                )}
                {review.body && (
                  <p className="font-body text-sm text-brand-muted leading-relaxed mb-3">{review.body}</p>
                )}

                {/* ── Name control ── */}
                <div className="border-t border-brand-warm pt-3 mt-3">
                  <p className="font-body text-[10px] uppercase tracking-widest text-brand-muted mb-2">Reviewer Name</p>
                  <div className="flex items-center gap-2 text-sm font-body text-brand-muted mb-2 flex-wrap">
                    <span className="font-medium text-brand-dark">{review.authorName}</span>
                    {currentOverride && (
                      <>
                        <span>→</span>
                        <span className="text-brand-amber font-medium">{currentOverride}</span>
                      </>
                    )}
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <input
                      type="text"
                      value={editValues[key] ?? ''}
                      onChange={(e) => setEditValues((prev) => ({ ...prev, [key]: e.target.value }))}
                      placeholder="Enter display name…"
                      className="border border-brand-warm bg-brand-cream px-3 py-2 font-body text-sm text-brand-dark placeholder:text-brand-muted/50 focus:outline-none focus:border-brand-dark w-48"
                    />
                    <button
                      onClick={() => handleSave(review.id)}
                      disabled={isSaving || !isEdited}
                      className="px-4 py-2 bg-brand-dark text-brand-cream font-body text-xs tracking-widest uppercase hover:bg-brand-amber transition-colors disabled:opacity-40"
                    >
                      {isSaving ? '…' : isSaved ? 'Saved ✓' : 'Save'}
                    </button>
                    {currentOverride && (
                      <button
                        onClick={() => handleClear(review.id)}
                        disabled={isSaving}
                        className="px-3 py-2 border border-brand-warm text-brand-muted font-body text-xs hover:border-red-300 hover:text-red-500 transition-colors"
                      >
                        Clear
                      </button>
                    )}
                  </div>
                </div>

                {/* ── Media control ── */}
                <div className="border-t border-brand-warm pt-3 mt-3">
                  <p className="font-body text-[10px] uppercase tracking-widest text-brand-muted mb-2">Photos / Videos</p>

                  {/* Existing media thumbnails */}
                  {reviewMedia.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-3">
                      {reviewMedia.map((url, idx) => (
                        <div key={idx} className="relative group">
                          {url.match(/\.(mp4|mov|webm|ogg)(\?|$)/i) ? (
                            <video
                              src={url}
                              className="w-20 h-20 object-cover border border-brand-warm bg-brand-cream rounded"
                              muted
                              playsInline
                            />
                          ) : (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={url}
                              alt={`Media ${idx + 1}`}
                              className="w-20 h-20 object-cover border border-brand-warm rounded"
                            />
                          )}
                          <button
                            onClick={() => handleRemoveMedia(review.id, idx)}
                            className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white rounded-full text-xs leading-none flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                            title="Remove"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Upload button */}
                  <div className="flex items-center gap-3 flex-wrap">
                    <input
                      ref={(el) => { fileInputRefs.current[key] = el }}
                      type="file"
                      accept="image/*,video/*"
                      className="hidden"
                      onChange={(e) => handleFileChange(review.id, e)}
                    />
                    <button
                      onClick={() => fileInputRefs.current[key]?.click()}
                      disabled={isUploading}
                      className="inline-flex items-center gap-2 px-4 py-2 border border-brand-warm text-brand-dark font-body text-xs tracking-widest uppercase hover:border-brand-dark transition-colors disabled:opacity-50"
                    >
                      {isUploading ? (
                        <>
                          <svg className="w-3.5 h-3.5 animate-spin" viewBox="0 0 24 24" fill="none">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                          </svg>
                          Uploading…
                        </>
                      ) : (
                        <>
                          <svg className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4-4 4 4m0 0l4-4M8 12V4" />
                          </svg>
                          Add Photo / Video
                        </>
                      )}
                    </button>
                    {uploadError[key] && (
                      <p className="font-body text-xs text-red-500">{uploadError[key]}</p>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
