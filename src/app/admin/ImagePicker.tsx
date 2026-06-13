'use client'

import { useRef, useState } from 'react'
import { clsx } from 'clsx'
import { Check, ImageIcon, Link2, Upload, Loader2 } from 'lucide-react'
import { IMAGE_LIBRARY } from '@/lib/image-library'
import type { SiteImages } from '@/lib/site-settings'

const SLOTS: { key: keyof SiteImages; label: string; hint: string }[] = [
  {
    key: 'hero',
    label: 'Homepage hero photo',
    hint: 'The big full-screen photo at the top of the homepage.',
  },
  {
    key: 'story',
    label: 'Our Story photo',
    hint: 'The framed photo in the grandmother ritual story block.',
  },
  {
    key: 'aboutHero',
    label: 'About page — hero banner',
    hint: 'The wide banner image at the top of the Our Story page.',
  },
  {
    key: 'aboutFounder',
    label: 'About page — founder portrait',
    hint: 'The portrait of Suruchi on the Our Story page.',
  },
  {
    key: 'gheeImage',
    label: 'Power of Ghee — section photo',
    hint: 'The photo in the Power of Ghee section on the homepage.',
  },
  {
    key: 'concernSensitive',
    label: 'Find Your Fix — Sensitive Skin',
    hint: 'First tile in the shop-by-concern section.',
  },
  {
    key: 'concernDry',
    label: 'Find Your Fix — Dry Skin Repair',
    hint: 'Second tile in the shop-by-concern section.',
  },
  {
    key: 'concernDullness',
    label: 'Find Your Fix — Dullness & Uneven Tone',
    hint: 'Third tile in the shop-by-concern section.',
  },
]

function isAllowedUrl(v: string): boolean {
  return v.startsWith('/') || v.startsWith('https://')
}

export default function ImagePicker({
  images,
  disabled,
  onChange,
}: {
  images: SiteImages
  disabled?: boolean
  onChange: (key: keyof SiteImages, src: string) => void
}) {
  const [openSlot, setOpenSlot] = useState<keyof SiteImages | null>(null)
  const [urlDraft, setUrlDraft] = useState('')
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  function toggleSlot(key: keyof SiteImages) {
    setUrlDraft('')
    setUploadError(null)
    setOpenSlot((s) => (s === key ? null : key))
  }

  async function uploadFile(key: keyof SiteImages, file: File) {
    setUploading(true)
    setUploadError(null)
    try {
      const body = new FormData()
      body.append('file', file)
      const res = await fetch('/api/admin/upload', { method: 'POST', body })
      const json = await res.json()
      if (json.url) {
        pick(key, json.url)
      } else {
        setUploadError(json.error || 'Upload failed — please try again.')
      }
    } catch {
      setUploadError('Upload failed — please try again.')
    } finally {
      setUploading(false)
    }
  }

  function pick(key: keyof SiteImages, src: string) {
    onChange(key, src)
    setOpenSlot(null)
    setUrlDraft('')
  }

  return (
    <div className="space-y-3">
      {SLOTS.map(({ key, label, hint }) => {
        const current = images[key]
        const isOpen = openSlot === key
        const libraryMatch = IMAGE_LIBRARY.find((img) => img.src === current)
        return (
          <div key={key} className="rounded-lg border border-brand-warm">
            <div className="flex items-center gap-4 px-4 py-3">
              {/* Thumbnail */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={current}
                alt={label}
                className="w-20 h-20 rounded-md object-cover bg-brand-warm flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <p className="font-body text-sm text-brand-dark font-medium">
                  {label}
                </p>
                <p className="font-body text-xs text-brand-muted">{hint}</p>
                <p className="font-body text-[11px] text-brand-muted/80 mt-1 truncate">
                  {libraryMatch ? libraryMatch.label : current}
                </p>
              </div>
              <button
                type="button"
                disabled={disabled}
                onClick={() => toggleSlot(key)}
                className={clsx(
                  'flex-shrink-0 inline-flex items-center gap-1.5 px-4 py-2 rounded-lg font-body text-xs tracking-widest uppercase transition-colors',
                  disabled
                    ? 'bg-brand-warm text-brand-muted cursor-not-allowed'
                    : isOpen
                      ? 'bg-brand-dark text-brand-cream'
                      : 'bg-brand-amber/15 text-brand-amber hover:bg-brand-amber hover:text-white'
                )}
              >
                <ImageIcon size={13} />
                {isOpen ? 'Close' : 'Change'}
              </button>
            </div>

            {/* Inline picker */}
            {isOpen && !disabled && (
              <div className="border-t border-brand-warm bg-brand-cream/60 p-4">
                <p className="font-body text-xs text-brand-muted mb-3">
                  Click a photo to use it for this spot.
                </p>
                <div className="max-h-64 overflow-y-auto pr-1">
                  <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-6 gap-2.5">
                    {IMAGE_LIBRARY.map((img) => {
                      const selected = img.src === current
                      return (
                        <button
                          key={img.src}
                          type="button"
                          title={img.label}
                          onClick={() => pick(key, img.src)}
                          className={clsx(
                            'relative group rounded-md overflow-hidden border-2 transition-colors text-left',
                            selected
                              ? 'border-brand-amber ring-2 ring-brand-amber/40'
                              : 'border-transparent hover:border-brand-amber/60'
                          )}
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={img.src}
                            alt={img.label}
                            loading="lazy"
                            className="w-full aspect-square object-cover bg-brand-warm"
                          />
                          {selected && (
                            <span className="absolute top-1 right-1 w-5 h-5 rounded-full bg-brand-amber text-white flex items-center justify-center">
                              <Check size={12} />
                            </span>
                          )}
                          <span className="block px-1.5 py-1 font-body text-[10px] text-brand-muted truncate bg-white">
                            {img.label}
                          </span>
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* Upload from computer */}
                <div className="mt-4 pt-4 border-t border-brand-warm">
                  <label className="block font-body text-xs tracking-widest uppercase text-brand-dark font-semibold mb-2">
                    …or upload from your computer
                  </label>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const f = e.target.files?.[0]
                      if (f) uploadFile(key, f)
                      e.target.value = ''
                    }}
                  />
                  <button
                    type="button"
                    disabled={uploading}
                    onClick={() => fileInputRef.current?.click()}
                    className={clsx(
                      'inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg font-body text-xs tracking-widest uppercase transition-colors',
                      uploading
                        ? 'bg-brand-warm text-brand-muted cursor-not-allowed'
                        : 'bg-brand-dark text-brand-cream hover:bg-brand-dark/80'
                    )}
                  >
                    {uploading ? (
                      <>
                        <Loader2 size={13} className="animate-spin" /> Uploading…
                      </>
                    ) : (
                      <>
                        <Upload size={13} /> Choose a photo
                      </>
                    )}
                  </button>
                  <p className="font-body text-[11px] text-brand-muted mt-1.5">
                    Pick any photo from your phone or computer — it&apos;s saved
                    to your Shopify files automatically.
                  </p>
                  {uploadError && (
                    <p className="font-body text-[11px] text-red-600 mt-1.5">
                      {uploadError}
                    </p>
                  )}
                </div>

                {/* Paste a URL */}
                <div className="mt-4 pt-4 border-t border-brand-warm">
                  <label className="block font-body text-xs tracking-widest uppercase text-brand-dark font-semibold mb-2">
                    …or paste an image URL
                  </label>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <input
                      type="text"
                      value={urlDraft}
                      onChange={(e) => setUrlDraft(e.target.value)}
                      placeholder="https://…"
                      className="flex-1 rounded-lg border border-brand-warm bg-white px-4 py-2.5 font-body text-sm text-brand-dark focus:outline-none focus:ring-2 focus:ring-brand-amber/50"
                    />
                    <button
                      type="button"
                      disabled={!isAllowedUrl(urlDraft.trim())}
                      onClick={() => pick(key, urlDraft.trim())}
                      className={clsx(
                        'inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-lg font-body text-xs tracking-widest uppercase transition-colors',
                        isAllowedUrl(urlDraft.trim())
                          ? 'bg-brand-amber text-white hover:bg-[#b87f43]'
                          : 'bg-brand-warm text-brand-muted cursor-not-allowed'
                      )}
                    >
                      <Link2 size={13} /> Use URL
                    </button>
                  </div>
                  <p className="font-body text-[11px] text-brand-muted mt-1.5">
                    Must start with https:// — for example an image hosted on
                    your Shopify files page.
                  </p>
                </div>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
