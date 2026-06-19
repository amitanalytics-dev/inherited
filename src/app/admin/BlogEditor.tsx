'use client'

import { useEffect, useState } from 'react'
import { Loader2, Save, CheckCircle2, ChevronDown, ChevronUp, Globe, FileText } from 'lucide-react'
import { clsx } from 'clsx'

type Article = {
  id: string
  blogId: string
  blogTitle: string
  title: string
  handle: string
  publishedAt: string | null
  published: boolean
  bodyHtml: string
  excerptHtml: string
  image: string | null
}

type EditState = {
  title: string
  bodyHtml: string
  excerptHtml: string
  published: boolean
}

function formatDate(iso: string | null) {
  if (!iso) return 'Draft'
  return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

export default function BlogEditor() {
  const [articles, setArticles] = useState<Article[]>([])
  const [configured, setConfigured] = useState(false)
  const [loading, setLoading] = useState(true)
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [edits, setEdits] = useState<Record<string, EditState>>({})
  const [saving, setSaving] = useState<string | null>(null)
  const [toast, setToast] = useState<{ id: string; msg: string; ok: boolean } | null>(null)

  useEffect(() => {
    fetch('/api/admin/blogs')
      .then((r) => r.json())
      .then((data) => {
        setConfigured(Boolean(data.configured))
        setArticles(data.articles ?? [])
      })
      .catch(() => setConfigured(false))
      .finally(() => setLoading(false))
  }, [])

  function startEdit(a: Article) {
    if (expandedId === a.id) {
      setExpandedId(null)
      return
    }
    setExpandedId(a.id)
    if (!edits[a.id]) {
      setEdits((prev) => ({
        ...prev,
        [a.id]: {
          title: a.title,
          bodyHtml: a.bodyHtml,
          excerptHtml: a.excerptHtml,
          published: a.published,
        },
      }))
    }
  }

  function patch(id: string, field: keyof EditState, value: string | boolean) {
    setEdits((prev) => ({ ...prev, [id]: { ...prev[id], [field]: value } }))
  }

  async function save(id: string) {
    const edit = edits[id]
    if (!edit) return
    setSaving(id)
    setToast(null)
    try {
      const res = await fetch('/api/admin/blogs', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id,
          title: edit.title,
          bodyHtml: edit.bodyHtml,
          summaryHtml: edit.excerptHtml,
          published: edit.published,
        }),
      })
      const json = await res.json()
      if (json.success) {
        setArticles((prev) =>
          prev.map((a) =>
            a.id === id
              ? { ...a, title: edit.title, bodyHtml: edit.bodyHtml, excerptHtml: edit.excerptHtml, published: edit.published }
              : a
          )
        )
        setToast({ id, msg: 'Saved — live on the blog within seconds.', ok: true })
      } else {
        setToast({ id, msg: json.error ?? 'Could not save — please try again.', ok: false })
      }
    } catch {
      setToast({ id, msg: 'Could not save — please try again.', ok: false })
    } finally {
      setSaving(null)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center gap-2 py-8 text-brand-muted font-body text-sm">
        <Loader2 size={16} className="animate-spin" /> Loading articles…
      </div>
    )
  }

  if (!configured) {
    return (
      <div className="bg-white border border-brand-warm rounded-2xl p-6 shadow-sm">
        <p className="font-body text-sm text-brand-muted">
          Shopify credentials are not configured — articles cannot be loaded.
        </p>
      </div>
    )
  }

  if (articles.length === 0) {
    return (
      <div className="bg-white border border-brand-warm rounded-2xl p-6 shadow-sm">
        <p className="font-body text-sm text-brand-muted">No articles found in your Shopify blog.</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <p className="font-body text-xs text-brand-muted">
        {articles.length} article{articles.length !== 1 ? 's' : ''} — click any row to edit
      </p>

      {articles.map((a) => {
        const isOpen = expandedId === a.id
        const edit = edits[a.id]
        const isSaving = saving === a.id
        const articleToast = toast?.id === a.id ? toast : null

        return (
          <div
            key={a.id}
            className="bg-white border border-brand-warm rounded-2xl shadow-sm overflow-hidden"
          >
            {/* Row */}
            <button
              onClick={() => startEdit(a)}
              className="w-full flex items-center gap-4 px-5 py-4 text-left hover:bg-brand-cream/50 transition-colors"
            >
              <div className="flex-1 min-w-0">
                <p className="font-body text-sm font-semibold text-brand-dark truncate">
                  {edit?.title ?? a.title}
                </p>
                <p className="font-body text-xs text-brand-muted mt-0.5">
                  {a.blogTitle} · {formatDate(a.publishedAt)}
                </p>
              </div>
              <span
                className={clsx(
                  'inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold font-body flex-shrink-0',
                  a.published
                    ? 'bg-green-100 text-green-700'
                    : 'bg-amber-100 text-amber-700'
                )}
              >
                {a.published ? (
                  <><Globe size={10} /> Published</>
                ) : (
                  <><FileText size={10} /> Draft</>
                )}
              </span>
              {isOpen ? (
                <ChevronUp size={16} className="text-brand-muted flex-shrink-0" />
              ) : (
                <ChevronDown size={16} className="text-brand-muted flex-shrink-0" />
              )}
            </button>

            {/* Editor */}
            {isOpen && edit && (
              <div className="border-t border-brand-warm px-5 pb-6 pt-5 space-y-4">
                {/* Title */}
                <div>
                  <label className="block font-body text-xs font-semibold text-brand-dark mb-1.5 tracking-wide uppercase">
                    Title
                  </label>
                  <input
                    type="text"
                    value={edit.title}
                    onChange={(e) => patch(a.id, 'title', e.target.value)}
                    className="w-full border border-brand-warm rounded-lg px-3 py-2 font-body text-sm text-brand-dark focus:outline-none focus:border-brand-amber"
                  />
                </div>

                {/* Body */}
                <div>
                  <label className="block font-body text-xs font-semibold text-brand-dark mb-1.5 tracking-wide uppercase">
                    Body
                  </label>
                  <p className="font-body text-[11px] text-brand-muted mb-2">
                    Find the sentences you want to change and edit them. The HTML tags keep the formatting intact.
                  </p>
                  <textarea
                    value={edit.bodyHtml}
                    onChange={(e) => patch(a.id, 'bodyHtml', e.target.value)}
                    rows={16}
                    className="w-full border border-brand-warm rounded-lg px-3 py-2 font-mono text-xs text-brand-dark focus:outline-none focus:border-brand-amber resize-y"
                  />
                </div>

                {/* Excerpt */}
                <div>
                  <label className="block font-body text-xs font-semibold text-brand-dark mb-1.5 tracking-wide uppercase">
                    Excerpt / Summary
                  </label>
                  <p className="font-body text-[11px] text-brand-muted mb-2">
                    Short description shown in blog listings and search results. Plain text or simple HTML.
                  </p>
                  <textarea
                    value={edit.excerptHtml}
                    onChange={(e) => patch(a.id, 'excerptHtml', e.target.value)}
                    rows={3}
                    className="w-full border border-brand-warm rounded-lg px-3 py-2 font-body text-sm text-brand-dark focus:outline-none focus:border-brand-amber resize-y"
                  />
                </div>

                {/* Published toggle */}
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    role="switch"
                    aria-checked={edit.published}
                    onClick={() => patch(a.id, 'published', !edit.published)}
                    className={clsx(
                      'relative inline-flex h-6 w-11 flex-shrink-0 rounded-full transition-colors focus:outline-none',
                      edit.published ? 'bg-brand-amber' : 'bg-brand-warm'
                    )}
                  >
                    <span
                      className={clsx(
                        'inline-block h-5 w-5 rounded-full bg-white shadow transform transition-transform mt-0.5',
                        edit.published ? 'translate-x-5' : 'translate-x-0.5'
                      )}
                    />
                  </button>
                  <span className="font-body text-sm text-brand-dark">
                    {edit.published ? 'Published — visible on the blog' : 'Draft — hidden from visitors'}
                  </span>
                </div>

                {/* Toast */}
                {articleToast && (
                  <div
                    className={clsx(
                      'flex items-center gap-2 rounded-lg px-4 py-3 font-body text-sm',
                      articleToast.ok
                        ? 'bg-green-50 text-green-700 border border-green-200'
                        : 'bg-red-50 text-red-700 border border-red-200'
                    )}
                  >
                    {articleToast.ok && <CheckCircle2 size={15} />}
                    {articleToast.msg}
                  </div>
                )}

                {/* Save */}
                <div className="flex gap-3">
                  <button
                    onClick={() => save(a.id)}
                    disabled={isSaving}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-amber text-white font-body text-xs tracking-widest uppercase rounded-lg hover:bg-[#b87f43] transition-colors disabled:opacity-60"
                  >
                    {isSaving ? (
                      <><Loader2 size={13} className="animate-spin" /> Saving…</>
                    ) : (
                      <><Save size={13} /> Save</>
                    )}
                  </button>
                  <button
                    onClick={() => setExpandedId(null)}
                    className="px-5 py-2.5 border border-brand-warm text-brand-dark font-body text-xs tracking-widest uppercase rounded-lg hover:border-brand-amber/60 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
