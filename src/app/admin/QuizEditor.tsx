'use client'

import { useEffect, useState } from 'react'
import {
  Loader2,
  Save,
  CheckCircle2,
  Info,
  ChevronDown,
  Plus,
  Trash2,
  Lightbulb,
} from 'lucide-react'
import { clsx } from 'clsx'
import {
  DEFAULT_QUIZ,
  mergeQuiz,
  type QuizConfig,
  type QuizQuestion,
  type QuizResult,
} from '@/lib/site-settings'

// The nine products the founder can recommend on a result screen.
const PRODUCT_CHOICES: { handle: string; name: string }[] = [
  { handle: 'overnight-rejuvenation-cream', name: 'Overnight Rejuvenation Cream' },
  { handle: 'deep-nourishing-cream', name: 'Deep Nourishing Cream' },
  { handle: 'radiance-serum', name: 'Radiance Serum' },
  { handle: 'ghee-oat-cleansing-balm', name: 'Ghee & Oat Cleansing Balm' },
  { handle: 'ultimate-soothing-foot-cream', name: 'Ultimate Soothing Foot Cream' },
  { handle: 'nourishing-lip-care-set', name: 'Nourishing Lip Care Set' },
  { handle: 'essentials-gift-set', name: 'Essentials Gift Set' },
  { handle: 'hand-and-foot-cream-bundle', name: 'Hand & Foot Bundle' },
  { handle: 'night-time-bundle', name: 'Night Time Bundle' },
]

function SmallField({
  label,
  value,
  onChange,
  disabled,
  textarea,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  disabled?: boolean
  textarea?: boolean
}) {
  return (
    <label className="block">
      <span className="font-body text-xs tracking-widest uppercase text-brand-dark font-semibold">
        {label}
      </span>
      {textarea ? (
        <textarea
          value={value}
          disabled={disabled}
          rows={3}
          onChange={(e) => onChange(e.target.value)}
          className="mt-1.5 w-full rounded-lg border border-brand-warm bg-white px-4 py-2.5 font-body text-sm text-brand-dark focus:outline-none focus:ring-2 focus:ring-brand-amber/50 disabled:bg-brand-warm/40 disabled:text-brand-muted"
        />
      ) : (
        <input
          type="text"
          value={value}
          disabled={disabled}
          onChange={(e) => onChange(e.target.value)}
          className="mt-1.5 w-full rounded-lg border border-brand-warm bg-white px-4 py-2.5 font-body text-sm text-brand-dark focus:outline-none focus:ring-2 focus:ring-brand-amber/50 disabled:bg-brand-warm/40 disabled:text-brand-muted"
        />
      )}
    </label>
  )
}

function newOptionValue(existing: string[]): string {
  let n = existing.length + 1
  let value = `option-${n}`
  while (existing.includes(value)) {
    n += 1
    value = `option-${n}`
  }
  return value
}

export default function QuizEditor() {
  const [quiz, setQuiz] = useState<QuizConfig>(DEFAULT_QUIZ)
  const [configured, setConfigured] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState<string | null>(null)
  const [openQuestion, setOpenQuestion] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/admin/settings')
      .then((r) => r.json())
      .then((data) => {
        setConfigured(Boolean(data.configured))
        if (data.settings?.quiz) {
          setQuiz(mergeQuiz(DEFAULT_QUIZ, data.settings.quiz))
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
      // Fetch the latest settings first so we never clobber other edits
      // (photos, headlines, toggles) saved from the main editor.
      const latest = await fetch('/api/admin/settings').then((r) => r.json())
      const merged = { ...(latest.settings ?? {}), quiz }
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(merged),
      })
      const json = await res.json()
      setToast(
        json.success
          ? 'Saved — the quiz updates on the site within a minute.'
          : 'Could not save just now — please try again in a moment.'
      )
    } catch {
      setToast('Could not save just now — please try again in a moment.')
    } finally {
      setSaving(false)
      setTimeout(() => setToast(null), 6000)
    }
  }

  // ── Question helpers ────────────────────────────────────────────────────
  function updateQuestion(qi: number, patch: Partial<QuizQuestion>) {
    setQuiz((q) => ({
      ...q,
      questions: q.questions.map((qq, i) => (i === qi ? { ...qq, ...patch } : qq)),
    }))
  }

  function updateOption(qi: number, oi: number, field: 'label' | 'description', v: string) {
    setQuiz((q) => ({
      ...q,
      questions: q.questions.map((qq, i) =>
        i === qi
          ? {
              ...qq,
              options: qq.options.map((o, j) =>
                j === oi ? { ...o, [field]: v } : o
              ),
            }
          : qq
      ),
    }))
  }

  function addOption(qi: number) {
    setQuiz((q) => {
      const question = q.questions[qi]
      const value = newOptionValue(question.options.map((o) => o.value))
      const questions = q.questions.map((qq, i) =>
        i === qi
          ? {
              ...qq,
              options: [...qq.options, { value, label: 'New answer', description: '' }],
            }
          : qq
      )
      // Adding an answer to Question 1 creates a matching result stub.
      const results =
        qi === 0
          ? [
              ...q.results,
              {
                key: value,
                title: 'New ritual recommendation',
                description: 'Describe the routine you recommend for this answer.',
                productHandles: [],
              },
            ]
          : q.results
      return { ...q, questions, results }
    })
  }

  function removeOption(qi: number, oi: number) {
    const question = quiz.questions[qi]
    if (question.options.length <= 2) return
    const option = question.options[oi]
    if (qi === 0) {
      const ok = window.confirm(
        `Removing "${option.label}" also removes its result branch ("${
          quiz.results.find((r) => r.key === option.value)?.title ?? 'no result'
        }"). Continue?`
      )
      if (!ok) return
    }
    setQuiz((q) => ({
      ...q,
      questions: q.questions.map((qq, i) =>
        i === qi
          ? { ...qq, options: qq.options.filter((_, j) => j !== oi) }
          : qq
      ),
      results:
        qi === 0 ? q.results.filter((r) => r.key !== option.value) : q.results,
    }))
  }

  function updateResult(key: string, patch: Partial<QuizResult>) {
    setQuiz((q) => ({
      ...q,
      results: q.results.map((r) => (r.key === key ? { ...r, ...patch } : r)),
    }))
  }

  function toggleProduct(key: string, handle: string) {
    setQuiz((q) => ({
      ...q,
      results: q.results.map((r) =>
        r.key === key
          ? {
              ...r,
              productHandles: r.productHandles.includes(handle)
                ? r.productHandles.filter((h) => h !== handle)
                : [...r.productHandles, handle],
            }
          : r
      ),
    }))
  }

  if (loading) {
    return (
      <div className="bg-white border border-brand-warm rounded-2xl p-10 shadow-sm flex items-center justify-center gap-3 text-brand-muted font-body text-sm">
        <Loader2 size={18} className="animate-spin text-brand-amber" />
        Loading your quiz settings…
      </div>
    )
  }

  const firstQuestion = quiz.questions[0]

  return (
    <div className="bg-white border border-brand-warm rounded-2xl shadow-sm overflow-hidden">
      {readOnly && (
        <div className="bg-brand-warm/50 px-6 py-4 flex items-start gap-3 border-b border-brand-warm">
          <Info size={16} className="text-brand-amber mt-0.5 flex-shrink-0" />
          <p className="font-body text-sm text-brand-dark leading-relaxed">
            <span className="font-semibold">Preview mode.</span> Connect your
            Shopify Admin token and you&apos;ll be able to edit the quiz below
            and save it straight to the live site.
          </p>
        </div>
      )}

      <div className="p-6 md:p-8 space-y-8">
        {/* How the logic works */}
        <div className="bg-brand-amber/10 border border-brand-amber/30 rounded-xl p-5 flex items-start gap-3">
          <Lightbulb size={18} className="text-brand-amber mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-body text-sm text-brand-dark font-semibold mb-1">
              How the logic works
            </p>
            <p className="font-body text-sm text-brand-dark leading-relaxed">
              The customer&apos;s answer to Question 1 picks the result below.
              Questions 2–3 personalise the journey.
            </p>
            <p className="font-body text-xs text-brand-muted mt-1.5">
              {quiz.resultLogic}
            </p>
          </div>
        </div>

        {/* Intro */}
        <div>
          <h3 className="font-display text-xl text-brand-dark mb-4">
            Quiz intro
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <SmallField
              label="Small overline"
              value={quiz.intro.overline}
              disabled={readOnly}
              onChange={(v) =>
                setQuiz((q) => ({ ...q, intro: { ...q.intro, overline: v } }))
              }
            />
            <SmallField
              label="Title"
              value={quiz.intro.title}
              disabled={readOnly}
              onChange={(v) =>
                setQuiz((q) => ({ ...q, intro: { ...q.intro, title: v } }))
              }
            />
            <SmallField
              label="Subtitle"
              value={quiz.intro.subtitle}
              disabled={readOnly}
              onChange={(v) =>
                setQuiz((q) => ({ ...q, intro: { ...q.intro, subtitle: v } }))
              }
            />
            <SmallField
              label="Result button label"
              value={quiz.intro.buttonLabel}
              disabled={readOnly}
              onChange={(v) =>
                setQuiz((q) => ({ ...q, intro: { ...q.intro, buttonLabel: v } }))
              }
            />
          </div>
        </div>

        {/* Questions accordion */}
        <div>
          <h3 className="font-display text-xl text-brand-dark mb-1">Questions</h3>
          <p className="font-body text-xs text-brand-muted mb-4">
            Tap a question to edit its wording and answers. Each question needs
            at least two answers.
          </p>
          <div className="space-y-3">
            {quiz.questions.map((question, qi) => {
              const isOpen = openQuestion === question.id
              return (
                <div key={question.id} className="rounded-lg border border-brand-warm overflow-hidden">
                  <button
                    type="button"
                    onClick={() =>
                      setOpenQuestion(isOpen ? null : question.id)
                    }
                    className="w-full flex items-center justify-between gap-3 px-4 py-3.5 bg-brand-cream/60 hover:bg-brand-cream transition-colors text-left"
                  >
                    <span className="font-body text-sm text-brand-dark font-medium">
                      <span className="text-brand-amber font-semibold mr-2">
                        Q{qi + 1}
                      </span>
                      {question.title}
                      {qi === 0 && (
                        <span className="ml-2 font-body text-[10px] tracking-widest uppercase text-brand-amber bg-brand-amber/15 px-2 py-0.5 rounded-full">
                          Decides the result
                        </span>
                      )}
                    </span>
                    <ChevronDown
                      size={16}
                      className={clsx(
                        'text-brand-muted flex-shrink-0 transition-transform',
                        isOpen && 'rotate-180'
                      )}
                    />
                  </button>
                  {isOpen && (
                    <div className="p-4 space-y-4 border-t border-brand-warm">
                      <SmallField
                        label="Question title"
                        value={question.title}
                        disabled={readOnly}
                        onChange={(v) => updateQuestion(qi, { title: v })}
                      />
                      <SmallField
                        label="Subtitle (optional)"
                        value={question.subtitle ?? ''}
                        disabled={readOnly}
                        onChange={(v) => updateQuestion(qi, { subtitle: v })}
                      />
                      <div>
                        <p className="font-body text-xs tracking-widest uppercase text-brand-dark font-semibold mb-2">
                          Answers
                        </p>
                        <div className="space-y-3">
                          {question.options.map((option, oi) => (
                            <div
                              key={option.value}
                              className="rounded-lg border border-brand-warm p-3 bg-brand-cream/40"
                            >
                              <div className="flex items-start gap-2">
                                <div className="flex-1 space-y-2">
                                  <input
                                    type="text"
                                    value={option.label}
                                    disabled={readOnly}
                                    onChange={(e) =>
                                      updateOption(qi, oi, 'label', e.target.value)
                                    }
                                    placeholder="Answer label"
                                    className="w-full rounded-lg border border-brand-warm bg-white px-3 py-2 font-body text-sm text-brand-dark focus:outline-none focus:ring-2 focus:ring-brand-amber/50 disabled:bg-brand-warm/40"
                                  />
                                  <input
                                    type="text"
                                    value={option.description ?? ''}
                                    disabled={readOnly}
                                    onChange={(e) =>
                                      updateOption(qi, oi, 'description', e.target.value)
                                    }
                                    placeholder="Short description (optional)"
                                    className="w-full rounded-lg border border-brand-warm bg-white px-3 py-2 font-body text-xs text-brand-muted focus:outline-none focus:ring-2 focus:ring-brand-amber/50 disabled:bg-brand-warm/40"
                                  />
                                </div>
                                <button
                                  type="button"
                                  disabled={readOnly || question.options.length <= 2}
                                  onClick={() => removeOption(qi, oi)}
                                  title={
                                    question.options.length <= 2
                                      ? 'A question needs at least two answers'
                                      : 'Remove this answer'
                                  }
                                  className={clsx(
                                    'p-2 rounded-lg transition-colors flex-shrink-0',
                                    readOnly || question.options.length <= 2
                                      ? 'text-brand-muted/50 cursor-not-allowed'
                                      : 'text-brand-muted hover:text-red-600 hover:bg-red-50'
                                  )}
                                >
                                  <Trash2 size={15} />
                                </button>
                              </div>
                              {qi === 0 && (
                                <p className="font-body text-[11px] text-brand-muted mt-2">
                                  Result branch: {' '}
                                  <span className="text-brand-amber">
                                    {quiz.results.find((r) => r.key === option.value)
                                      ?.title ?? '— none yet —'}
                                  </span>
                                </p>
                              )}
                            </div>
                          ))}
                        </div>
                        <button
                          type="button"
                          disabled={readOnly}
                          onClick={() => addOption(qi)}
                          className={clsx(
                            'mt-3 inline-flex items-center gap-1.5 px-4 py-2 rounded-lg font-body text-xs tracking-widest uppercase transition-colors',
                            readOnly
                              ? 'bg-brand-warm text-brand-muted cursor-not-allowed'
                              : 'bg-brand-amber/15 text-brand-amber hover:bg-brand-amber hover:text-white'
                          )}
                        >
                          <Plus size={13} /> Add answer
                          {qi === 0 && ' (creates a result too)'}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Results */}
        <div>
          <h3 className="font-display text-xl text-brand-dark mb-1">Results</h3>
          <p className="font-body text-xs text-brand-muted mb-4">
            One result for each Question 1 answer. Tick the products you want
            to recommend on that result screen.
          </p>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {quiz.results.map((result) => {
              const optionLabel =
                firstQuestion?.options.find((o) => o.value === result.key)
                  ?.label ?? result.key
              return (
                <div
                  key={result.key}
                  className="rounded-lg border border-brand-warm p-4 space-y-3"
                >
                  <p className="font-body text-[11px] tracking-widest uppercase text-brand-amber font-semibold">
                    When Q1 answer is: {optionLabel}
                  </p>
                  <SmallField
                    label="Result title"
                    value={result.title}
                    disabled={readOnly}
                    onChange={(v) => updateResult(result.key, { title: v })}
                  />
                  <SmallField
                    label="Result description"
                    value={result.description}
                    disabled={readOnly}
                    textarea
                    onChange={(v) => updateResult(result.key, { description: v })}
                  />
                  <div>
                    <p className="font-body text-xs tracking-widest uppercase text-brand-dark font-semibold mb-2">
                      Recommended products
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                      {PRODUCT_CHOICES.map((p) => {
                        const checked = result.productHandles.includes(p.handle)
                        return (
                          <label
                            key={p.handle}
                            className={clsx(
                              'flex items-center gap-2 rounded-lg border px-3 py-2 cursor-pointer transition-colors',
                              checked
                                ? 'border-brand-amber bg-brand-amber/10'
                                : 'border-brand-warm hover:border-brand-amber/50',
                              readOnly && 'cursor-not-allowed opacity-70'
                            )}
                          >
                            <input
                              type="checkbox"
                              checked={checked}
                              disabled={readOnly}
                              onChange={() => toggleProduct(result.key, p.handle)}
                              className="accent-[#c98e54]"
                            />
                            <span className="font-body text-xs text-brand-dark">
                              {p.name}
                            </span>
                          </label>
                        )
                      })}
                    </div>
                  </div>
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
            {saving ? 'Saving…' : 'Save quiz'}
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
