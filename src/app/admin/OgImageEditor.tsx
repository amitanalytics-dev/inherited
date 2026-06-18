'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { Loader2, Save, CheckCircle2, Upload, Info, ImageIcon } from 'lucide-react'
import { clsx } from 'clsx'
import { DEFAULT_SETTINGS, mergeSettings } from '@/lib/site-settings'

export default function OgImageEditor() {
  const [ogImage, setOgImage] = useState(DEFAULT_SETTINGS.ogImage)
  const [configured, setConfigured] = useState(false)
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState<string | null>(null)
  const [uploadMsg, setUploadMsg] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    fetch('/api/admin/settings')
      .then((r) => r.json())
      .then((data) => {
        setConfigured(Boolean(data.configured))
        if (data.settings?.ogImage) {
          setOgImage(data.settings.ogImage)
        }
      })
      .catch(() => setConfigured(false))
      .finally(() => setLoading(false))
  }, [])

  const readOnly = !configured

  async function uploadImage(file: File) {
    setUploading(true)
    setUploadMsg(null)
    try {
      const body = new FormData()
      body.append('file', file)
      const res = await fetch('/api/admin/upload', { method: 'POST', body })
      const json = await res.json()
      if (json.url) {
        setOgImage(json.url)
        setUploadMsg('Image uploaded — click Save to publish it.')
      } else {
        setUploadMsg(json.error || 'Upload failed — please try again.')
      }
    } catch {
      setUploadMsg('Upload failed — please try again.')
    } finally {
      setUploading(false)
    }
  }

  async function save() {
    setSaving(true)
    setToast(null)
    try {
      // Fetch current full settings so we don't overwrite other fields
      const latest = await fetch('/api/admin/settings').then((r) => r.json())
      const current = latest?.settings
        ? mergeSettings(DEFAULT_SETTINGS, latest.settings)
        : DEFAULT_SETTINGS
      const payload = { ...current, ogImage }
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const json = await res.json()
      if (json.success) {
        setToast('Saved — your social sharing image is now live.')
      } else {
        setToast('Could not save — please try again in a moment.')
      }
    } catch {
      setToast('Could not save — please try again in a moment.')
    } finally {
      setSaving(false)
      setTimeout(() => setToast(null), 6000)
    }
  }

  if (loading) {
    return (
      <div className="bg-white border border-brand-warm rounded-2xl p-10 shadow-sm flex items-center justify-center gap-3 text-brand-muted font-body text-sm">
        <Loader2 size={18} className="animate-spin text-brand-amber" />
        Loading…
      </div>
    )
  }

  const isAbsoluteUrl = ogImage.startsWith('http')

  return (
    <div className="bg-white border border-brand-warm rounded-2xl shadow-sm overflow-hidden">
      {readOnly && (
        <div className="bg-brand-warm/50 px-6 py-4 flex items-start gap-3 border-b border-brand-warm">
          <Info size={16} className="text-brand-amber mt-0.5 flex-shrink-0" />
          <p className="font-body text-sm text-brand-dark leading-relaxed">
            <span className="font-semibold">Preview mode.</span> Connect your Shopify Admin token to upload and save a social sharing image.
          </p>
        </div>
      )}

      <div className="p-6 md:p-8 space-y-6">
        <p className="font-body text-sm text-brand-muted leading-relaxed max-w-2xl">
          This image appears when someone shares your website on WhatsApp, Instagram, Facebook, iMessage, or any social platform. It should be <strong className="text-brand-dark">1200 × 630 px</strong> (landscape). JPG or PNG works best.
        </p>

        {/* Current image preview */}
        <div>
          <p className="font-body text-xs tracking-widest uppercase text-brand-dark font-semibold mb-3">
            Current sharing image
          </p>
          <div className="relative w-full max-w-lg aspect-[1200/630] bg-brand-warm rounded-xl overflow-hidden border border-brand-warm">
            {isAbsoluteUrl ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={ogImage}
                alt="Social sharing preview"
                className="w-full h-full object-cover"
              />
            ) : (
              <Image
                src={ogImage}
                alt="Social sharing preview"
                fill
                sizes="(max-width: 768px) 100vw, 600px"
                className="object-cover"
              />
            )}
            {/* WhatsApp-style overlay badge */}
            <div className="absolute bottom-0 left-0 right-0 bg-black/50 px-3 py-2">
              <p className="font-body text-[11px] text-white/90 truncate">shop.inheritedskincare.com</p>
              <p className="font-body text-[10px] text-white/60 truncate">Inherited Skincare — Ancient Wisdom. Modern Skin.</p>
            </div>
          </div>
          <p className="font-body text-[11px] text-brand-muted mt-2">Preview of how it looks when shared on WhatsApp or social media.</p>
        </div>

        {/* Upload */}
        <div>
          <p className="font-body text-xs tracking-widest uppercase text-brand-dark font-semibold mb-3">
            Change image
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0]
                if (f) uploadImage(f)
                e.target.value = ''
              }}
            />
            <button
              type="button"
              disabled={readOnly || uploading}
              onClick={() => fileInputRef.current?.click()}
              className={clsx(
                'inline-flex items-center gap-2 px-5 py-2.5 rounded-lg font-body text-xs tracking-widest uppercase transition-colors',
                readOnly || uploading
                  ? 'bg-brand-warm text-brand-muted cursor-not-allowed'
                  : 'bg-brand-dark text-brand-cream hover:bg-brand-dark/80'
              )}
            >
              {uploading ? (
                <><Loader2 size={13} className="animate-spin" /> Uploading…</>
              ) : (
                <><Upload size={13} /> Upload image</>
              )}
            </button>

            <span className="font-body text-xs text-brand-muted">or paste a URL below</span>
          </div>

          {uploadMsg && (
            <p className="font-body text-[11px] text-brand-green mt-2">{uploadMsg}</p>
          )}

          {/* URL field */}
          <div className="mt-4">
            <label className="block">
              <span className="font-body text-xs tracking-widest uppercase text-brand-dark font-semibold flex items-center gap-1.5">
                <ImageIcon size={12} /> Image URL
              </span>
              <span className="block font-body text-xs text-brand-muted mt-0.5 mb-2">
                Paste a direct link to a hosted image (must start with https://). The preview above updates when you save.
              </span>
              <input
                type="url"
                value={ogImage}
                disabled={readOnly}
                onChange={(e) => setOgImage(e.target.value)}
                placeholder="https://cdn.shopify.com/..."
                className="w-full rounded-lg border border-brand-warm bg-white px-4 py-3 font-body text-sm text-brand-dark focus:outline-none focus:ring-2 focus:ring-brand-amber/50 disabled:bg-brand-warm/40 disabled:text-brand-muted"
              />
            </label>
          </div>
        </div>

        {/* Save */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 pt-2 border-t border-brand-warm">
          <button
            type="button"
            onClick={save}
            disabled={readOnly || saving}
            className={clsx(
              'inline-flex items-center gap-2 px-8 py-3.5 font-body text-xs tracking-widest uppercase rounded-lg transition-colors shadow-md',
              readOnly || saving
                ? 'bg-brand-warm text-brand-muted cursor-not-allowed'
                : 'bg-brand-amber text-white hover:bg-[#b87f43]'
            )}
          >
            {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
            {saving ? 'Saving…' : 'Save sharing image'}
          </button>
          {toast && (
            <p className="font-body text-sm text-brand-green flex items-center gap-2">
              <CheckCircle2 size={16} /> {toast}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
