'use client'

import { useState } from 'react'
import { Send, Clock, Users, AlertCircle, CheckCircle2, Loader2, Mail } from 'lucide-react'

const THROTTLE_OPTIONS = [
  { label: '10% per hour  (~100/hr for 1,000 subscribers)', value: 10 },
  { label: '20% per hour  (~200/hr for 1,000 subscribers)', value: 20 },
  { label: '25% per hour  (~250/hr for 1,000 subscribers)', value: 25 },
  { label: '33% per hour  (~330/hr for 1,000 subscribers)', value: 33 },
  { label: '50% per hour  (~500/hr for 1,000 subscribers)', value: 50 },
]

function todayISO() {
  return new Date().toISOString().slice(0, 10)
}

export default function AnnouncementEmailEditor() {
  const [subject, setSubject]               = useState('')
  const [preheader, setPreheader]           = useState('')
  const [body, setBody]                     = useState('')
  const [scheduleDate, setScheduleDate]     = useState(todayISO)
  const [throttlePercent, setThrottlePercent] = useState(10)
  const [status, setStatus]                 = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [resultMsg, setResultMsg]           = useState('')
  const [emailSent, setEmailSent]           = useState(true)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!subject.trim() || !body.trim()) return

    setStatus('loading')
    setResultMsg('')

    try {
      const res = await fetch('/api/admin/email-drafts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject: subject.trim(),
          preheader: preheader.trim(),
          htmlBody: body.trim(),
          scheduleDate,
          throttlePercent,
        }),
      })

      const data = await res.json()
      if (!res.ok || !data.success) throw new Error(data.error ?? `HTTP ${res.status}`)

      setEmailSent(data.emailSent ?? true)
      setResultMsg(data.emailSent
        ? 'Approval email sent to suruchi@inheritedskincare.com — the email will only go to subscribers once she clicks Approve.'
        : `Draft saved but the approval email could not be sent (${data.emailError ?? 'unknown error'}). Please check RESEND_API_KEY in Vercel env vars.`
      )
      setStatus('success')
    } catch (err: unknown) {
      setStatus('error')
      setResultMsg(err instanceof Error ? err.message : 'Something went wrong')
    }
  }

  function handleReset() {
    setStatus('idle')
    setResultMsg('')
    setSubject('')
    setPreheader('')
    setBody('')
    setScheduleDate(todayISO())
    setThrottlePercent(10)
    setEmailSent(true)
  }

  return (
    <div className="bg-white border border-brand-warm rounded-2xl p-6 md:p-8 shadow-sm">
      {/* Approval notice */}
      <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
        <Mail size={16} className="text-amber-600 mt-0.5 flex-shrink-0" />
        <div>
          <p className="font-body text-sm font-semibold text-amber-800">
            Approval required before sending
          </p>
          <p className="font-body text-xs text-amber-700 mt-0.5">
            Submitting this form sends an approval request to <strong>suruchi@inheritedskincare.com</strong>. The email will only go to subscribers after she clicks Approve.
          </p>
        </div>
      </div>

      {/* Audience */}
      <div className="flex items-start gap-3 bg-brand-warm/50 border border-brand-amber/20 rounded-xl p-4 mb-6">
        <Users size={16} className="text-brand-amber mt-0.5 flex-shrink-0" />
        <div>
          <p className="font-body text-sm font-semibold text-brand-dark">
            Audience: Newsletter list (all subscribers)
          </p>
          <p className="font-body text-xs text-brand-muted mt-0.5">
            Sends to every subscriber on your Klaviyo Newsletter list at the throttle rate below.
          </p>
        </div>
      </div>

      {status === 'success' ? (
        <div className="space-y-5">
          <div className={`flex items-start gap-3 rounded-xl p-5 border ${emailSent ? 'bg-green-50 border-green-200' : 'bg-amber-50 border-amber-200'}`}>
            {emailSent
              ? <CheckCircle2 size={20} className="text-green-600 mt-0.5 flex-shrink-0" />
              : <AlertCircle size={20} className="text-amber-600 mt-0.5 flex-shrink-0" />
            }
            <div>
              <p className={`font-body text-sm font-semibold mb-1 ${emailSent ? 'text-green-800' : 'text-amber-800'}`}>
                {emailSent ? 'Approval request sent!' : 'Draft saved — approval email failed'}
              </p>
              <p className={`font-body text-sm leading-relaxed ${emailSent ? 'text-green-700' : 'text-amber-700'}`}>
                {resultMsg}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center gap-2 px-6 py-3 border border-brand-warm text-brand-dark font-body text-xs tracking-widest uppercase rounded-lg hover:border-brand-amber/60 transition-colors"
          >
            Compose another email
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Subject */}
          <div>
            <label className="block font-body text-xs tracking-widest uppercase text-brand-dark mb-1.5">
              Subject line <span className="text-brand-amber">*</span>
            </label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="e.g. Our new website is live — come have a look"
              required
              maxLength={200}
              disabled={status === 'loading'}
              className="w-full border border-brand-warm bg-brand-cream/50 rounded-lg px-4 py-3 font-body text-sm text-brand-dark focus:outline-none focus:border-brand-amber transition-colors disabled:opacity-50"
            />
          </div>

          {/* Preheader */}
          <div>
            <label className="block font-body text-xs tracking-widest uppercase text-brand-dark mb-1.5">
              Preview text <span className="text-brand-muted">(optional)</span>
            </label>
            <input
              type="text"
              value={preheader}
              onChange={(e) => setPreheader(e.target.value)}
              placeholder="Short line shown in inbox before they open — keep under 90 characters"
              maxLength={150}
              disabled={status === 'loading'}
              className="w-full border border-brand-warm bg-brand-cream/50 rounded-lg px-4 py-3 font-body text-sm text-brand-dark focus:outline-none focus:border-brand-amber transition-colors disabled:opacity-50"
            />
          </div>

          {/* Body */}
          <div>
            <label className="block font-body text-xs tracking-widest uppercase text-brand-dark mb-1.5">
              Email body <span className="text-brand-amber">*</span>
            </label>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder={`Write your email here. Leave a blank line between paragraphs.\n\nFor example:\n\nDear {{ first_name|friend }},\n\nOur new website is live! ...\n\nWith love,\nSuruchi`}
              required
              rows={12}
              disabled={status === 'loading'}
              className="w-full border border-brand-warm bg-brand-cream/50 rounded-lg px-4 py-3 font-body text-sm text-brand-dark focus:outline-none focus:border-brand-amber transition-colors resize-y disabled:opacity-50"
            />
            <p className="font-body text-[11px] text-brand-muted mt-1.5">
              Plain text only — blank lines become paragraph breaks. Use <code className="bg-brand-warm px-1 rounded text-[10px]">&#123;&#123; first_name|friend &#125;&#125;</code> for personalisation.
            </p>
          </div>

          {/* Schedule + throttle */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-body text-xs tracking-widest uppercase text-brand-dark mb-1.5">
                Send date
              </label>
              <input
                type="date"
                value={scheduleDate}
                onChange={(e) => setScheduleDate(e.target.value)}
                disabled={status === 'loading'}
                className="w-full border border-brand-warm bg-brand-cream/50 rounded-lg px-4 py-3 font-body text-sm text-brand-dark focus:outline-none focus:border-brand-amber transition-colors disabled:opacity-50"
              />
              <p className="font-body text-[11px] text-brand-muted mt-1.5">
                Sends at <strong>6pm BST</strong> on this date, after approval.
              </p>
            </div>
            <div>
              <label className="block font-body text-xs tracking-widest uppercase text-brand-dark mb-1.5">
                Send rate
              </label>
              <select
                value={throttlePercent}
                onChange={(e) => setThrottlePercent(Number(e.target.value))}
                disabled={status === 'loading'}
                className="w-full border border-brand-warm bg-brand-cream/50 rounded-lg px-4 py-3 font-body text-sm text-brand-dark focus:outline-none focus:border-brand-amber transition-colors disabled:opacity-50"
              >
                {THROTTLE_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Error */}
          {status === 'error' && (
            <div className="flex items-start gap-3 bg-red-50 border border-red-200 rounded-xl p-4">
              <AlertCircle size={16} className="text-red-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-body text-sm font-semibold text-red-800">Could not submit for approval</p>
                <p className="font-body text-xs text-red-700 mt-0.5">{resultMsg}</p>
              </div>
            </div>
          )}

          {/* Submit */}
          <div className="flex items-center gap-4 pt-2">
            <button
              type="submit"
              disabled={status === 'loading' || !subject.trim() || !body.trim()}
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-brand-amber text-white font-body text-xs tracking-widest uppercase rounded-lg hover:bg-[#b87f43] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {status === 'loading' ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <Send size={14} />
              )}
              {status === 'loading' ? 'Submitting…' : 'Submit for Suruchi\'s Approval'}
            </button>
            <span className="flex items-center gap-1.5 font-body text-xs text-brand-muted">
              <Clock size={13} />
              {throttlePercent}% / hr · 6pm BST
            </span>
          </div>
        </form>
      )}
    </div>
  )
}
