'use client'

import { useEffect, useState } from 'react'
import { Loader2, Save, CheckCircle2, Info, Plus, X } from 'lucide-react'
import { clsx } from 'clsx'
import { DEFAULT_PAGES, mergePageSettings, type ValueItem, type IngredientItem } from '@/lib/site-settings'
import ListEditor from '../ListEditor'

const VALUE_FIELDS: { key: keyof ValueItem; label: string; multiline?: boolean }[] = [
  { key: 'title', label: 'Title' },
  { key: 'body', label: 'Body', multiline: true },
]

const INGREDIENT_FIELDS: { key: keyof IngredientItem; label: string; multiline?: boolean; hint?: string }[] = [
  { key: 'name', label: 'Ingredient Name' },
  { key: 'origin', label: 'Product / Source', hint: 'e.g. Radiance Serum' },
  { key: 'benefit', label: 'Benefit', multiline: true },
]

export default function AboutEditor() {
  const [about, setAbout] = useState(DEFAULT_PAGES.about)
  const [configured, setConfigured] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/admin/settings')
      .then((r) => r.json())
      .then((data) => {
        setConfigured(Boolean(data.configured))
        if (data.settings?.pages?.about) {
          setAbout(mergePageSettings(DEFAULT_PAGES, data.settings.pages).about)
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
      const latest = await fetch('/api/admin/settings').then((r) => r.json())
      const payload = {
        ...(latest?.settings ?? {}),
        pages: {
          ...(latest?.settings?.pages ?? {}),
          about,
        },
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
        Loading…
      </div>
    )
  }

  return (
    <div className="bg-white border border-brand-warm rounded-2xl shadow-sm overflow-hidden">
      {readOnly && (
        <div className="bg-brand-warm/50 px-6 py-4 flex items-start gap-3 border-b border-brand-warm">
          <Info size={16} className="text-brand-amber mt-0.5 flex-shrink-0" />
          <p className="font-body text-sm text-brand-dark leading-relaxed">
            <span className="font-semibold">Preview mode.</span> Connect your Shopify Admin token to edit and save.
          </p>
        </div>
      )}

      <div className="p-6 md:p-8 space-y-8">
        <div>
          <h3 className="font-display text-xl text-brand-dark mb-4">Founder Story</h3>
          <div className="space-y-4 mb-6">
            <label className="block">
              <span className="font-body text-xs tracking-widest uppercase text-brand-dark font-semibold">Headline — line 1</span>
              <input
                type="text"
                value={about.founderHeadline1}
                disabled={readOnly}
                onChange={(e) => setAbout((s) => ({ ...s, founderHeadline1: e.target.value }))}
                className="mt-2 w-full rounded-lg border border-brand-warm bg-white px-4 py-3 font-body text-sm text-brand-dark focus:outline-none focus:ring-2 focus:ring-brand-amber/50 disabled:bg-brand-warm/40 disabled:text-brand-muted"
              />
            </label>
            <label className="block">
              <span className="font-body text-xs tracking-widest uppercase text-brand-dark font-semibold">Headline — line 2 (italic)</span>
              <input
                type="text"
                value={about.founderHeadline2}
                disabled={readOnly}
                onChange={(e) => setAbout((s) => ({ ...s, founderHeadline2: e.target.value }))}
                className="mt-2 w-full rounded-lg border border-brand-warm bg-white px-4 py-3 font-body text-sm text-brand-dark focus:outline-none focus:ring-2 focus:ring-brand-amber/50 disabled:bg-brand-warm/40 disabled:text-brand-muted"
              />
            </label>
          </div>

          <div className="space-y-3">
            <p className="font-body text-xs tracking-widest uppercase text-brand-dark font-semibold">Founder paragraphs</p>
            {about.founderParagraphs.map((para, i) => (
              <div key={i} className="flex gap-2 items-start">
                <textarea
                  rows={3}
                  value={para}
                  disabled={readOnly}
                  onChange={(e) =>
                    setAbout((s) => ({
                      ...s,
                      founderParagraphs: s.founderParagraphs.map((p, j) => (j === i ? e.target.value : p)),
                    }))
                  }
                  className="flex-1 rounded-lg border border-brand-warm bg-white px-4 py-3 font-body text-sm text-brand-dark focus:outline-none focus:ring-2 focus:ring-brand-amber/50 disabled:bg-brand-warm/40 disabled:text-brand-muted resize-y"
                  placeholder={`Paragraph ${i + 1}`}
                />
                <button
                  type="button"
                  disabled={readOnly}
                  onClick={() =>
                    setAbout((s) => ({
                      ...s,
                      founderParagraphs: s.founderParagraphs.filter((_, j) => j !== i),
                    }))
                  }
                  className="mt-3 text-brand-muted hover:text-red-500 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  <X size={14} />
                </button>
              </div>
            ))}
            <button
              type="button"
              disabled={readOnly}
              onClick={() =>
                setAbout((s) => ({ ...s, founderParagraphs: [...s.founderParagraphs, ''] }))
              }
              className={clsx(
                'inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border font-body text-xs tracking-widest uppercase transition-colors',
                readOnly
                  ? 'border-brand-warm text-brand-muted cursor-not-allowed'
                  : 'border-brand-amber text-brand-amber hover:bg-brand-amber/10'
              )}
            >
              <Plus size={13} />
              Add paragraph
            </button>
          </div>
        </div>

        <div>
          <h3 className="font-display text-xl text-brand-dark mb-4">Values</h3>
          <ListEditor<ValueItem>
            items={about.values}
            fields={VALUE_FIELDS}
            onChange={(values) => setAbout((s) => ({ ...s, values }))}
            disabled={readOnly}
            defaultItem={{ title: '', body: '' }}
            addLabel="Add value"
            maxItems={8}
          />
        </div>

        <div>
          <h3 className="font-display text-xl text-brand-dark mb-4">Key Ingredients</h3>
          <ListEditor<IngredientItem>
            items={about.ingredients}
            fields={INGREDIENT_FIELDS}
            onChange={(ingredients) => setAbout((s) => ({ ...s, ingredients }))}
            disabled={readOnly}
            defaultItem={{ name: '', origin: '', benefit: '' }}
            addLabel="Add ingredient"
            maxItems={12}
          />
        </div>

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
            {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
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
