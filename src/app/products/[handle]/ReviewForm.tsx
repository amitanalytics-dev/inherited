'use client'

import { useState } from 'react'
import { CheckCircle2, Loader2 } from 'lucide-react'

function StarSelector({ value, onChange }: { value: number; onChange: (n: number) => void }) {
  const [hovered, setHovered] = useState(0)
  return (
    <div className="flex gap-1" role="group" aria-label="Rating">
      {[1, 2, 3, 4, 5].map((s) => (
        <button
          key={s}
          type="button"
          aria-label={`${s} star${s !== 1 ? 's' : ''}`}
          onClick={() => onChange(s)}
          onMouseEnter={() => setHovered(s)}
          onMouseLeave={() => setHovered(0)}
          className="p-0.5 transition-transform hover:scale-110"
        >
          <svg className="w-7 h-7" viewBox="0 0 20 20" fill={s <= (hovered || value) ? '#C8923A' : 'none'} stroke="#C8923A" strokeWidth="1.5">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        </button>
      ))}
    </div>
  )
}

export default function ReviewForm({ productHandle }: { productHandle: string }) {
  const [rating, setRating] = useState(0)
  const [name, setName] = useState('')
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!rating || !name.trim() || !body.trim()) return
    setStatus('loading')
    setErrorMsg('')
    try {
      const res = await fetch('/api/submit-review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productHandle, authorName: name, rating, title, body }),
      })
      const data = await res.json()
      if (!res.ok || !data.success) throw new Error(data.error ?? 'Submission failed.')
      setStatus('success')
    } catch (err: unknown) {
      setStatus('error')
      setErrorMsg(err instanceof Error ? err.message : 'Something went wrong.')
    }
  }

  if (status === 'success') {
    return (
      <div className="flex items-start gap-3 bg-green-50 border border-green-200 rounded-xl p-5 mt-10">
        <CheckCircle2 size={20} className="text-green-600 mt-0.5 flex-shrink-0" />
        <div>
          <p className="font-body font-semibold text-sm text-green-800">Thank you for your review!</p>
          <p className="font-body text-sm text-green-700 mt-0.5">
            Your review is pending approval and will appear here once it&apos;s been verified.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="mt-10 pt-10 border-t border-brand-warm">
      <h3 className="font-display font-semibold text-xl text-brand-dark mb-6">Write a Review</h3>
      <form onSubmit={handleSubmit} className="space-y-4 max-w-xl">
        {/* Rating */}
        <div>
          <label className="block font-body text-xs tracking-widest uppercase text-brand-dark mb-2">
            Your Rating <span className="text-brand-amber">*</span>
          </label>
          <StarSelector value={rating} onChange={setRating} />
        </div>

        {/* Name */}
        <div>
          <label className="block font-body text-xs tracking-widest uppercase text-brand-dark mb-1.5">
            Your Name <span className="text-brand-amber">*</span>
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Sarah M."
            maxLength={80}
            required
            disabled={status === 'loading'}
            className="w-full border border-brand-warm bg-brand-cream/50 rounded-lg px-4 py-3 font-body text-sm text-brand-dark focus:outline-none focus:border-brand-amber transition-colors disabled:opacity-50"
          />
        </div>

        {/* Title */}
        <div>
          <label className="block font-body text-xs tracking-widest uppercase text-brand-dark mb-1.5">
            Review Title <span className="text-brand-muted">(optional)</span>
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Best moisturiser I've tried"
            maxLength={150}
            disabled={status === 'loading'}
            className="w-full border border-brand-warm bg-brand-cream/50 rounded-lg px-4 py-3 font-body text-sm text-brand-dark focus:outline-none focus:border-brand-amber transition-colors disabled:opacity-50"
          />
        </div>

        {/* Body */}
        <div>
          <label className="block font-body text-xs tracking-widest uppercase text-brand-dark mb-1.5">
            Your Review <span className="text-brand-amber">*</span>
          </label>
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="What did you think of this product? How has it helped your skin?"
            rows={5}
            maxLength={2000}
            required
            disabled={status === 'loading'}
            className="w-full border border-brand-warm bg-brand-cream/50 rounded-lg px-4 py-3 font-body text-sm text-brand-dark focus:outline-none focus:border-brand-amber transition-colors resize-y disabled:opacity-50"
          />
        </div>

        {status === 'error' && (
          <p className="font-body text-xs text-red-600">{errorMsg}</p>
        )}

        <button
          type="submit"
          disabled={status === 'loading' || !rating || !name.trim() || !body.trim()}
          className="inline-flex items-center gap-2 px-8 py-3.5 bg-brand-dark text-brand-cream font-body text-xs tracking-widest uppercase hover:bg-brand-amber transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {status === 'loading' ? <Loader2 size={13} className="animate-spin" /> : null}
          {status === 'loading' ? 'Submitting…' : 'Submit Review'}
        </button>
      </form>
    </div>
  )
}
