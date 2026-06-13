'use client'

import { useEffect, useState } from 'react'
import { Loader2, Save, CheckCircle2, Info } from 'lucide-react'
import { clsx } from 'clsx'
import { DEFAULT_PAGES, mergePageSettings } from '@/lib/site-settings'

export default function ContactEditor() {
  const [contact, setContact] = useState(DEFAULT_PAGES.contact)
  const [configured, setConfigured] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/admin/settings')
      .then((r) => r.json())
      .then((data) => {
        setConfigured(Boolean(data.configured))
        if (data.settings?.pages?.contact) {
          setContact(mergePageSettings(DEFAULT_PAGES, data.settings.pages).contact)
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
          contact,
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

  const inputClass =
    'mt-2 w-full rounded-lg border border-brand-warm bg-white px-4 py-3 font-body text-sm text-brand-dark focus:outline-none focus:ring-2 focus:ring-brand-amber/50 disabled:bg-brand-warm/40 disabled:text-brand-muted'
  const labelClass =
    'font-body text-xs tracking-widest uppercase text-brand-dark font-semibold'

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

      <div className="p-6 md:p-8 space-y-5">
        <label className="block">
          <span className={labelClass}>Email</span>
          <input
            type="text"
            value={contact.email}
            disabled={readOnly}
            onChange={(e) => setContact((s) => ({ ...s, email: e.target.value }))}
            className={inputClass}
          />
        </label>
        <label className="block">
          <span className={labelClass}>Phone</span>
          <input
            type="text"
            value={contact.phone}
            disabled={readOnly}
            onChange={(e) => setContact((s) => ({ ...s, phone: e.target.value }))}
            className={inputClass}
          />
        </label>
        <label className="block">
          <span className={labelClass}>Instagram handle</span>
          <input
            type="text"
            value={contact.instagram}
            disabled={readOnly}
            onChange={(e) => setContact((s) => ({ ...s, instagram: e.target.value }))}
            className={inputClass}
          />
        </label>
        <label className="block">
          <span className={labelClass}>Address</span>
          <textarea
            rows={2}
            value={contact.address}
            disabled={readOnly}
            onChange={(e) => setContact((s) => ({ ...s, address: e.target.value }))}
            className={inputClass + ' resize-y'}
          />
        </label>
        <label className="block">
          <span className={labelClass}>Response time</span>
          <input
            type="text"
            value={contact.responseTime}
            disabled={readOnly}
            onChange={(e) => setContact((s) => ({ ...s, responseTime: e.target.value }))}
            className={inputClass}
          />
        </label>

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
