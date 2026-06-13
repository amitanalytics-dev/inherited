'use client'

import { useEffect, useRef, useState } from 'react'
import { Loader2, Save, CheckCircle2, Info, ChevronUp, ChevronDown, Upload } from 'lucide-react'
import { clsx } from 'clsx'
import {
  DEFAULT_SETTINGS,
  DEFAULT_SECTION_ORDER,
  mergeSettings,
  type SiteSettings,
} from '@/lib/site-settings'
import ImagePicker from './ImagePicker'

const ALL_SECTION_META: Record<string, { label: string; hint: string }> = {
  marquee: { label: 'Scrolling banner', hint: 'The moving text band under the hero' },
  trustRow: { label: 'Trust badges', hint: 'The five little badges (Natural, CPSR, etc.)' },
  bestsellers: { label: 'Bestsellers', hint: 'Your product grid' },
  shopByConcern: { label: 'Find Your Fix', hint: 'Shop by skin concern tiles' },
  story: { label: 'Our Story', hint: 'The grandmother ritual story block' },
  scienceRitual: { label: 'Science & Ritual', hint: 'Why ghee works section' },
  reviews: { label: 'Customer Reviews', hint: 'Happy customer quotes' },
  ingredients: { label: 'Power of Ghee', hint: 'The Power of Ghee section with the editable photo' },
  quizCta: { label: 'Quiz banner', hint: 'The "Find your ritual" quiz invite' },
  instagram: { label: 'Instagram', hint: 'The Instagram photo strip' },
}

function Toggle({
  checked,
  onChange,
  disabled,
}: {
  checked: boolean
  onChange: (v: boolean) => void
  disabled?: boolean
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={clsx(
        'relative inline-flex h-6 w-11 flex-shrink-0 items-center rounded-full transition-colors duration-300',
        checked ? 'bg-brand-green' : 'bg-brand-warm',
        disabled && 'opacity-50 cursor-not-allowed'
      )}
    >
      <span
        className={clsx(
          'inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform duration-300',
          checked ? 'translate-x-6' : 'translate-x-1'
        )}
      />
    </button>
  )
}

function Field({
  label,
  hint,
  value,
  onChange,
  disabled,
}: {
  label: string
  hint?: string
  value: string
  onChange: (v: string) => void
  disabled?: boolean
}) {
  return (
    <label className="block">
      <span className="font-body text-xs tracking-widest uppercase text-brand-dark font-semibold">
        {label}
      </span>
      {hint && (
        <span className="block font-body text-xs text-brand-muted mt-0.5">{hint}</span>
      )}
      <input
        type="text"
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
        className="mt-2 w-full rounded-lg border border-brand-warm bg-white px-4 py-3 font-body text-sm text-brand-dark focus:outline-none focus:ring-2 focus:ring-brand-amber/50 disabled:bg-brand-warm/40 disabled:text-brand-muted"
      />
    </label>
  )
}

export default function EditorPanel() {
  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SETTINGS)
  const [configured, setConfigured] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState<string | null>(null)
  const [videoUploading, setVideoUploading] = useState(false)
  const [videoMsg, setVideoMsg] = useState<string | null>(null)
  const videoInputRef = useRef<HTMLInputElement | null>(null)

  async function uploadVideo(file: File) {
    setVideoUploading(true)
    setVideoMsg(null)
    try {
      const body = new FormData()
      body.append('file', file)
      const res = await fetch('/api/admin/upload', { method: 'POST', body })
      const json = await res.json()
      if (json.url) {
        setSettings((s) => ({ ...s, heroVideo: json.url }))
        setVideoMsg('Video added — remember to click Save changes below.')
      } else {
        setVideoMsg(json.error || 'Upload failed — please try again.')
      }
    } catch {
      setVideoMsg('Upload failed — please try again.')
    } finally {
      setVideoUploading(false)
    }
  }

  useEffect(() => {
    fetch('/api/admin/settings')
      .then((r) => r.json())
      .then((data) => {
        setConfigured(Boolean(data.configured))
        if (data.settings) {
          setSettings(mergeSettings(DEFAULT_SETTINGS, data.settings))
        }
      })
      .catch(() => setConfigured(false))
      .finally(() => setLoading(false))
  }, [])

  const readOnly = !configured

  const save = async () => {
    setSaving(true)
    setToast(null)
    try {
      // Preserve the latest saved quiz config (edited in its own card below)
      // so saving here never clobbers it.
      let payload: any = settings
      try {
        const latest = await fetch('/api/admin/settings').then((r) => r.json())
        if (latest?.settings?.quiz) {
          payload = { ...settings, quiz: latest.settings.quiz }
        }
      } catch {
        // fall back to local state
      }
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const json = await res.json()
      if (json.success) {
        setToast('Saved — changes appear on the site within a minute.')
      } else {
        setToast('Could not save just now — please try again in a moment.')
      }
    } catch {
      setToast('Could not save just now — please try again in a moment.')
    } finally {
      setSaving(false)
      setTimeout(() => setToast(null), 6000)
    }
  }

  if (loading) {
    return (
      <div className="bg-white border border-brand-warm rounded-2xl p-10 shadow-sm flex items-center justify-center gap-3 text-brand-muted font-body text-sm">
        <Loader2 size={18} className="animate-spin text-brand-amber" />
        Loading your website settings…
      </div>
    )
  }

  return (
    <div className="bg-white border border-brand-warm rounded-2xl shadow-sm overflow-hidden">
      {readOnly && (
        <div className="bg-brand-warm/50 px-6 py-4 flex items-start gap-3 border-b border-brand-warm">
          <Info size={16} className="text-brand-amber mt-0.5 flex-shrink-0" />
          <p className="font-body text-sm text-brand-dark leading-relaxed">
            <span className="font-semibold">Preview mode.</span> Connect your
            Shopify Admin token (see the note at the top of this page) and
            you&apos;ll be able to edit everything below and save it straight
            to the live site.
          </p>
        </div>
      )}

      <div className="p-6 md:p-8 space-y-8">
        {/* Announcement bar */}
        <div>
          <h3 className="font-display text-xl text-brand-dark mb-4">
            Announcement bar
          </h3>
          <Field
            label="Top banner text"
            hint="The thin dark strip at the very top of every page. Use · to separate messages."
            value={settings.announcementBar}
            disabled={readOnly}
            onChange={(v) => setSettings((s) => ({ ...s, announcementBar: v }))}
          />
        </div>

        {/* Hero */}
        <div>
          <h3 className="font-display text-xl text-brand-dark mb-4">
            Homepage hero
          </h3>
          <div className="space-y-4">
            <Field
              label="Headline — line 1"
              value={settings.heroHeadline1}
              disabled={readOnly}
              onChange={(v) => setSettings((s) => ({ ...s, heroHeadline1: v }))}
            />
            <Field
              label="Headline — line 2 (italic)"
              value={settings.heroHeadline2}
              disabled={readOnly}
              onChange={(v) => setSettings((s) => ({ ...s, heroHeadline2: v }))}
            />
            <Field
              label="Subline"
              hint="The small sentence under the big headline."
              value={settings.heroSubline}
              disabled={readOnly}
              onChange={(v) => setSettings((s) => ({ ...s, heroSubline: v }))}
            />
          </div>
        </div>

        {/* USP items */}
        <div>
          <h3 className="font-display text-xl text-brand-dark mb-1">
            Trust badges
          </h3>
          <p className="font-body text-xs text-brand-muted mb-4">
            The five short phrases shown under the hero. Keep them short and
            punchy.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {settings.uspItems.map((item, i) => (
              <Field
                key={i}
                label={`Badge ${i + 1}`}
                value={item}
                disabled={readOnly}
                onChange={(v) =>
                  setSettings((s) => ({
                    ...s,
                    uspItems: s.uspItems.map((u, j) => (j === i ? v : u)),
                  }))
                }
              />
            ))}
          </div>
        </div>

        {/* Photos */}
        <div>
          <h3 className="font-display text-xl text-brand-dark mb-1">Photos</h3>
          <p className="font-body text-xs text-brand-muted mb-4">
            Swap the big photos on your site. Pick from your photo library or
            paste a link to any image online.
          </p>
          <ImagePicker
            images={settings.images}
            disabled={readOnly}
            onChange={(key, src) =>
              setSettings((s) => ({
                ...s,
                images: { ...s.images, [key]: src },
              }))
            }
          />
        </div>

        {/* Hero video */}
        <div>
          <h3 className="font-display text-xl text-brand-dark mb-4">
            Hero video (optional)
          </h3>
          <Field
            label="Video URL"
            hint="A silent looping video that plays behind the homepage headline. Leave blank to use the photo instead. Google Drive / YouTube links do NOT work — upload your file with the button below."
            value={settings.heroVideo ?? ''}
            disabled={readOnly}
            onChange={(v) => setSettings((s) => ({ ...s, heroVideo: v }))}
          />
          <div className="mt-3">
            <input
              ref={videoInputRef}
              type="file"
              accept="video/*"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0]
                if (f) uploadVideo(f)
                e.target.value = ''
              }}
            />
            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                disabled={readOnly || videoUploading}
                onClick={() => videoInputRef.current?.click()}
                className={clsx(
                  'inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg font-body text-xs tracking-widest uppercase transition-colors',
                  readOnly || videoUploading
                    ? 'bg-brand-warm text-brand-muted cursor-not-allowed'
                    : 'bg-brand-dark text-brand-cream hover:bg-brand-dark/80'
                )}
              >
                {videoUploading ? (
                  <>
                    <Loader2 size={13} className="animate-spin" /> Uploading…
                  </>
                ) : (
                  <>
                    <Upload size={13} /> Upload a video
                  </>
                )}
              </button>
              {settings.heroVideo && (
                <button
                  type="button"
                  disabled={readOnly}
                  onClick={() => setSettings((s) => ({ ...s, heroVideo: '' }))}
                  className="font-body text-xs tracking-widest uppercase text-brand-muted hover:text-red-600 transition-colors"
                >
                  Remove video
                </button>
              )}
            </div>
            <p className="font-body text-[11px] text-brand-muted mt-2">
              Big videos can take up to a minute to process. MP4 works best.
            </p>
            {videoMsg && (
              <p className="font-body text-[11px] text-brand-green mt-1.5">
                {videoMsg}
              </p>
            )}
          </div>
        </div>

        {/* Section toggles + ordering */}
        <div>
          <h3 className="font-display text-xl text-brand-dark mb-1">
            Sections on homepage
          </h3>
          <p className="font-body text-xs text-brand-muted mb-4">
            Toggle sections on/off and drag the arrows to reorder them. Changes are saved when you click Save.
          </p>
          <div className="space-y-2">
            {(settings.sectionOrder ?? DEFAULT_SECTION_ORDER).map((key, idx) => {
              const meta = ALL_SECTION_META[key]
              if (!meta) return null
              const sectionKey = key as keyof SiteSettings['showSections']
              const order = settings.sectionOrder ?? DEFAULT_SECTION_ORDER
              return (
                <div
                  key={key}
                  className="flex items-center gap-3 rounded-lg border border-brand-warm px-4 py-3 bg-white"
                >
                  {/* Reorder buttons */}
                  <div className="flex flex-col gap-0.5 flex-shrink-0">
                    <button
                      type="button"
                      disabled={readOnly || idx === 0}
                      onClick={() => {
                        if (idx === 0) return
                        const next = [...order]
                        ;[next[idx - 1], next[idx]] = [next[idx], next[idx - 1]]
                        setSettings((s) => ({ ...s, sectionOrder: next }))
                      }}
                      className="text-brand-muted hover:text-brand-amber disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                      title="Move up"
                    >
                      <ChevronUp size={14} />
                    </button>
                    <button
                      type="button"
                      disabled={readOnly || idx === order.length - 1}
                      onClick={() => {
                        if (idx === order.length - 1) return
                        const next = [...order]
                        ;[next[idx], next[idx + 1]] = [next[idx + 1], next[idx]]
                        setSettings((s) => ({ ...s, sectionOrder: next }))
                      }}
                      className="text-brand-muted hover:text-brand-amber disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                      title="Move down"
                    >
                      <ChevronDown size={14} />
                    </button>
                  </div>

                  {/* Index pill */}
                  <span className="w-5 h-5 rounded-full bg-brand-warm text-brand-muted font-body text-[10px] font-semibold flex items-center justify-center flex-shrink-0">
                    {idx + 1}
                  </span>

                  <div className="flex-1 min-w-0">
                    <p className="font-body text-sm text-brand-dark font-medium">
                      {meta.label}
                    </p>
                    <p className="font-body text-xs text-brand-muted">{meta.hint}</p>
                  </div>

                  <Toggle
                    checked={settings.showSections[sectionKey]}
                    disabled={readOnly}
                    onChange={(v) =>
                      setSettings((s) => ({
                        ...s,
                        showSections: { ...s.showSections, [sectionKey]: v },
                      }))
                    }
                  />
                </div>
              )
            })}
          </div>
        </div>

        {/* Save */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 pt-2 border-t border-brand-warm">
          <button
            type="button"
            onClick={save}
            disabled={readOnly || saving}
            className={clsx(
              'inline-flex items-center gap-2 px-8 py-3.5 mt-4 font-body text-xs tracking-widest uppercase rounded-lg transition-colors shadow-md',
              readOnly || saving
                ? 'bg-brand-warm text-brand-muted cursor-not-allowed'
                : 'bg-brand-amber text-white hover:bg-[#b87f43]'
            )}
          >
            {saving ? (
              <Loader2 size={14} className="animate-spin" />
            ) : (
              <Save size={14} />
            )}
            {saving ? 'Saving…' : 'Save changes'}
          </button>
          {toast && (
            <p className="font-body text-sm text-brand-green flex items-center gap-2 mt-4">
              <CheckCircle2 size={16} /> {toast}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
