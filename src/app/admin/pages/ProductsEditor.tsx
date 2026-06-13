'use client'

import { useEffect, useRef, useState } from 'react'
import {
  Loader2,
  Save,
  CheckCircle2,
  Info,
  ChevronDown,
  ExternalLink,
  Upload,
} from 'lucide-react'
import { clsx } from 'clsx'

type Product = {
  id: string
  title: string
  handle: string
  status: string
  descriptionHtml: string
  inventory: number
  featuredImage: string | null
  images: { id: string; url: string }[]
  variantId: string | null
  price: string
}

const STORE_PRODUCTS = 'https://admin.shopify.com/store/leela-skincare/products'

function ProductRow({
  product,
  readOnly,
}: {
  product: Product
  readOnly: boolean
}) {
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState(product.title)
  const [price, setPrice] = useState(product.price)
  const [description, setDescription] = useState(product.descriptionHtml)
  const [status, setStatus] = useState(product.status)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [msg, setMsg] = useState<string | null>(null)
  const [extraImage, setExtraImage] = useState<string | null>(null)
  const fileRef = useRef<HTMLInputElement | null>(null)

  async function save() {
    setSaving(true)
    setMsg(null)
    try {
      const res = await fetch('/api/admin/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: product.id,
          title,
          descriptionHtml: description,
          status,
          price,
          variantId: product.variantId,
          newImageUrl: extraImage,
        }),
      })
      const json = await res.json()
      if (json.success) {
        setMsg('Saved to Shopify — live within a minute.')
        setExtraImage(null)
      } else {
        setMsg(json.error || 'Could not save — please try again.')
      }
    } catch {
      setMsg('Could not save — please try again.')
    } finally {
      setSaving(false)
      setTimeout(() => setMsg(null), 6000)
    }
  }

  async function uploadImage(file: File) {
    setUploading(true)
    setMsg(null)
    try {
      const body = new FormData()
      body.append('file', file)
      const res = await fetch('/api/admin/upload', { method: 'POST', body })
      const json = await res.json()
      if (json.url) {
        setExtraImage(json.url)
        setMsg('Photo ready — click Save to attach it to this product.')
      } else {
        setMsg(json.error || 'Upload failed — please try again.')
      }
    } catch {
      setMsg('Upload failed — please try again.')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="rounded-lg border border-brand-warm bg-white">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center gap-4 px-4 py-3 text-left"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={product.featuredImage || '/images/products/placeholder.jpg'}
          alt={product.title}
          className="w-14 h-14 rounded-md object-cover bg-brand-warm flex-shrink-0"
        />
        <div className="flex-1 min-w-0">
          <p className="font-body text-sm text-brand-dark font-medium truncate">
            {title}
          </p>
          <p className="font-body text-xs text-brand-muted">
            £{parseFloat(price || '0').toFixed(2)} ·{' '}
            <span
              className={clsx(
                status === 'ACTIVE' ? 'text-brand-green' : 'text-brand-muted'
              )}
            >
              {status === 'ACTIVE' ? 'Live' : 'Draft'}
            </span>{' '}
            · {product.inventory} in stock
          </p>
        </div>
        <ChevronDown
          size={18}
          className={clsx(
            'text-brand-muted flex-shrink-0 transition-transform',
            open && 'rotate-180'
          )}
        />
      </button>

      {open && (
        <div className="border-t border-brand-warm p-4 space-y-4 bg-brand-cream/40">
          {/* Title */}
          <label className="block">
            <span className="font-body text-xs tracking-widest uppercase text-brand-dark font-semibold">
              Product name
            </span>
            <input
              type="text"
              value={title}
              disabled={readOnly}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-2 w-full rounded-lg border border-brand-warm bg-white px-4 py-2.5 font-body text-sm text-brand-dark focus:outline-none focus:ring-2 focus:ring-brand-amber/50 disabled:bg-brand-warm/40"
            />
          </label>

          {/* Price + status */}
          <div className="grid grid-cols-2 gap-4">
            <label className="block">
              <span className="font-body text-xs tracking-widest uppercase text-brand-dark font-semibold">
                Price (£)
              </span>
              <input
                type="number"
                step="0.01"
                min="0"
                value={price}
                disabled={readOnly}
                onChange={(e) => setPrice(e.target.value)}
                className="mt-2 w-full rounded-lg border border-brand-warm bg-white px-4 py-2.5 font-body text-sm text-brand-dark focus:outline-none focus:ring-2 focus:ring-brand-amber/50 disabled:bg-brand-warm/40"
              />
            </label>
            <label className="block">
              <span className="font-body text-xs tracking-widest uppercase text-brand-dark font-semibold">
                Visibility
              </span>
              <select
                value={status}
                disabled={readOnly}
                onChange={(e) => setStatus(e.target.value)}
                className="mt-2 w-full rounded-lg border border-brand-warm bg-white px-4 py-2.5 font-body text-sm text-brand-dark focus:outline-none focus:ring-2 focus:ring-brand-amber/50 disabled:bg-brand-warm/40"
              >
                <option value="ACTIVE">Live (visible to customers)</option>
                <option value="DRAFT">Draft (hidden)</option>
              </select>
            </label>
          </div>

          {/* Description */}
          <label className="block">
            <span className="font-body text-xs tracking-widest uppercase text-brand-dark font-semibold">
              Description
            </span>
            <span className="block font-body text-xs text-brand-muted mt-0.5">
              Basic HTML is allowed (e.g. &lt;p&gt;, &lt;strong&gt;). Plain text is fine too.
            </span>
            <textarea
              value={description}
              disabled={readOnly}
              rows={5}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-2 w-full rounded-lg border border-brand-warm bg-white px-4 py-3 font-body text-sm text-brand-dark focus:outline-none focus:ring-2 focus:ring-brand-amber/50 disabled:bg-brand-warm/40 resize-y"
            />
          </label>

          {/* Photos */}
          <div>
            <span className="font-body text-xs tracking-widest uppercase text-brand-dark font-semibold">
              Photos
            </span>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              {product.images.map((img) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={img.id}
                  src={img.url}
                  alt=""
                  className="w-14 h-14 rounded-md object-cover bg-brand-warm"
                />
              ))}
              {extraImage && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={extraImage}
                  alt="New photo"
                  className="w-14 h-14 rounded-md object-cover ring-2 ring-brand-amber"
                />
              )}
            </div>
            <input
              ref={fileRef}
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
              onClick={() => fileRef.current?.click()}
              className={clsx(
                'mt-3 inline-flex items-center gap-2 px-4 py-2 rounded-lg font-body text-xs tracking-widest uppercase transition-colors',
                readOnly || uploading
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
                  <Upload size={13} /> Add a photo
                </>
              )}
            </button>
            <p className="font-body text-[11px] text-brand-muted mt-1.5">
              To reorder or delete photos, use the &ldquo;Edit in Shopify&rdquo; link below.
            </p>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap items-center gap-4 pt-2 border-t border-brand-warm">
            <button
              type="button"
              onClick={save}
              disabled={readOnly || saving}
              className={clsx(
                'inline-flex items-center gap-2 px-6 py-2.5 mt-3 font-body text-xs tracking-widest uppercase rounded-lg transition-colors shadow-sm',
                readOnly || saving
                  ? 'bg-brand-warm text-brand-muted cursor-not-allowed'
                  : 'bg-brand-amber text-white hover:bg-[#b87f43]'
              )}
            >
              {saving ? (
                <Loader2 size={13} className="animate-spin" />
              ) : (
                <Save size={13} />
              )}
              {saving ? 'Saving…' : 'Save changes'}
            </button>
            <a
              href={`/products/${product.handle}`}
              target="_blank"
              rel="noopener noreferrer"
              className="font-body text-xs tracking-widest uppercase text-brand-amber hover:underline inline-flex items-center gap-1 mt-3"
            >
              View page <ExternalLink size={11} />
            </a>
            <a
              href={STORE_PRODUCTS}
              target="_blank"
              rel="noopener noreferrer"
              className="font-body text-xs tracking-widest uppercase text-brand-muted hover:text-brand-dark inline-flex items-center gap-1 mt-3"
            >
              Edit in Shopify <ExternalLink size={11} />
            </a>
            {msg && (
              <p className="font-body text-xs text-brand-green flex items-center gap-1.5 mt-3 w-full sm:w-auto">
                <CheckCircle2 size={14} /> {msg}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default function ProductsEditor() {
  const [products, setProducts] = useState<Product[]>([])
  const [configured, setConfigured] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/admin/products')
      .then((r) => r.json())
      .then((data) => {
        setConfigured(Boolean(data.configured))
        setProducts(data.products ?? [])
        setError(data.error ?? null)
      })
      .catch(() => setConfigured(false))
      .finally(() => setLoading(false))
  }, [])

  const readOnly = !configured
  const needsScope =
    error && /access denied|scope|access_denied/i.test(error)

  if (loading) {
    return (
      <div className="bg-white border border-brand-warm rounded-2xl p-10 shadow-sm flex items-center justify-center gap-3 text-brand-muted font-body text-sm">
        <Loader2 size={18} className="animate-spin text-brand-amber" />
        Loading your products…
      </div>
    )
  }

  if (needsScope) {
    return (
      <div className="bg-white border border-brand-warm rounded-2xl p-6 md:p-8 shadow-sm">
        <div className="flex items-start gap-4">
          <div className="w-11 h-11 rounded-full bg-brand-amber/15 flex items-center justify-center flex-shrink-0">
            <Info size={20} className="text-brand-amber" />
          </div>
          <div>
            <h3 className="font-display text-2xl text-brand-dark mb-2">
              One quick permission to edit products
            </h3>
            <p className="font-body text-sm text-brand-muted leading-relaxed mb-5 max-w-xl">
              To edit products from here, the app needs permission to read and
              write products. This takes about a minute and only needs doing once.
            </p>
            <ol className="font-body text-sm text-brand-dark space-y-2.5 mb-6 list-none">
              {[
                'Open the Shopify Apps & Sales channels settings (button below)',
                'Open the “Next.js Headless” app → Click “Update” / “Update data access” if prompted',
                'When Shopify asks to approve new permissions (read & write products), click Approve',
                'Come back and refresh this page',
              ].map((step, i) => (
                <li key={i} className="flex gap-3">
                  <span className="w-6 h-6 rounded-full bg-brand-warm text-brand-dark text-xs font-semibold flex items-center justify-center flex-shrink-0 mt-0.5">
                    {i + 1}
                  </span>
                  <span className="leading-relaxed">{step}</span>
                </li>
              ))}
            </ol>
            <a
              href="https://admin.shopify.com/store/leela-skincare/settings/apps"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-brand-amber text-white font-body text-xs tracking-widest uppercase hover:bg-[#b87f43] transition-colors rounded-lg shadow-md"
            >
              Open Shopify Apps <ExternalLink size={14} />
            </a>
            <p className="font-body text-xs text-brand-muted mt-4">
              In the meantime, you can still edit products directly in{' '}
              <a
                href={STORE_PRODUCTS}
                target="_blank"
                rel="noopener noreferrer"
                className="text-brand-amber underline"
              >
                Shopify Products
              </a>
              .
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white border border-brand-warm rounded-2xl shadow-sm overflow-hidden">
      {readOnly && (
        <div className="bg-brand-warm/50 px-6 py-4 flex items-start gap-3 border-b border-brand-warm">
          <Info size={16} className="text-brand-amber mt-0.5 flex-shrink-0" />
          <p className="font-body text-sm text-brand-dark leading-relaxed">
            <span className="font-semibold">Preview mode.</span> Connect Shopify
            to edit products here.
          </p>
        </div>
      )}
      <div className="p-4 md:p-6 space-y-3">
        <p className="font-body text-xs text-brand-muted mb-1">
          Edit the name, price, description, visibility and photos of any product.
          Changes save straight to Shopify. {products.length} products.
        </p>
        {products.map((p) => (
          <ProductRow key={p.id} product={p} readOnly={readOnly} />
        ))}
      </div>
    </div>
  )
}
