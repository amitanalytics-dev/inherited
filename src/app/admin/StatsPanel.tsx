'use client'

import { useEffect, useState } from 'react'
import {
  ShoppingBag,
  CalendarDays,
  PoundSterling,
  ExternalLink,
  Plug,
  Loader2,
} from 'lucide-react'

type RecentOrder = {
  id: string
  name: string
  createdAt: string
  customer: string
  total: string
  currency: string
  financialStatus: string
  fulfillmentStatus: string
}

type Stats = {
  configured: boolean
  ordersToday?: number
  ordersLast7Days?: number
  revenueLast7Days?: number
  currency?: string
  recentOrders?: RecentOrder[]
  error?: string
}

function timeAgo(iso: string): string {
  const seconds = Math.floor((Date.now() - new Date(iso).getTime()) / 1000)
  if (seconds < 60) return 'just now'
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes} min ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours} hour${hours === 1 ? '' : 's'} ago`
  const days = Math.floor(hours / 24)
  if (days < 7) return `${days} day${days === 1 ? '' : 's'} ago`
  return new Date(iso).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
  })
}

function currencySymbol(code?: string) {
  if (code === 'GBP') return '£'
  if (code === 'USD') return '$'
  if (code === 'EUR') return '€'
  return code ? `${code} ` : '£'
}

function badgeStyle(status: string) {
  const s = status.toUpperCase()
  if (s.includes('PAID') || s.includes('FULFILLED'))
    return 'bg-brand-green/10 text-brand-green'
  if (s.includes('PENDING') || s.includes('UNFULFILLED') || s.includes('PARTIAL'))
    return 'bg-brand-amber/15 text-[#9a6a32]'
  return 'bg-brand-warm text-brand-muted'
}

function prettyStatus(s: string) {
  return s
    .toLowerCase()
    .replace(/_/g, ' ')
    .replace(/^\w/, (c) => c.toUpperCase())
}

export function ConnectShopifyCard() {
  return (
    <div className="bg-white border border-brand-warm rounded-2xl p-6 md:p-8 shadow-sm">
      <div className="flex items-start gap-4">
        <div className="w-11 h-11 rounded-full bg-brand-amber/15 flex items-center justify-center flex-shrink-0">
          <Plug size={20} className="text-brand-amber" />
        </div>
        <div>
          <h3 className="font-display text-2xl text-brand-dark mb-2">
            Connect your Shopify Admin token to see live orders here
          </h3>
          <p className="font-body text-sm text-brand-muted leading-relaxed mb-5 max-w-xl">
            This takes about two minutes and only needs doing once. Once
            connected, this page will show today&apos;s orders, weekly revenue
            and your latest customers — automatically.
          </p>
          <ol className="font-body text-sm text-brand-dark space-y-2.5 mb-6 list-none">
            {[
              'Open Shopify Admin and go to Settings → Apps and sales channels',
              'Click "Develop apps" → "Create an app" (call it "Inherited Admin")',
              'Under API credentials, enable read_orders + read_products + write_metafields, then install and copy the Admin API access token',
              'In Vercel, add an environment variable named SHOPIFY_ADMIN_TOKEN with that token and redeploy',
            ].map((step, i) => (
              <li key={i} className="flex gap-3">
                <span className="w-6 h-6 rounded-full bg-brand-warm text-brand-dark text-xs font-semibold flex items-center justify-center flex-shrink-0 mt-0.5">
                  {i + 1}
                </span>
                <span className="leading-relaxed">{step}</span>
              </li>
            ))}
          </ol>
          <div className="flex flex-col sm:flex-row gap-3">
            <a
              href="https://admin.shopify.com/store/leela-skincare/settings/apps/development"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-brand-amber text-white font-body text-xs tracking-widest uppercase hover:bg-[#b87f43] transition-colors rounded-lg shadow-md"
            >
              Open Shopify App Settings <ExternalLink size={14} />
            </a>
            <a
              href="https://vercel.com/dashboard"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 border border-brand-dark/30 text-brand-dark font-body text-xs tracking-widest uppercase hover:bg-brand-dark hover:text-brand-cream transition-colors rounded-lg"
            >
              Open Vercel <ExternalLink size={14} />
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function StatsPanel() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/admin/stats')
      .then((r) => r.json())
      .then(setStats)
      .catch(() => setStats({ configured: false }))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="bg-white border border-brand-warm rounded-2xl p-10 shadow-sm flex items-center justify-center gap-3 text-brand-muted font-body text-sm">
        <Loader2 size={18} className="animate-spin text-brand-amber" />
        Checking today&apos;s numbers…
      </div>
    )
  }

  if (!stats || !stats.configured) {
    return <ConnectShopifyCard />
  }

  if (stats.error) {
    return (
      <div className="bg-white border border-brand-warm rounded-2xl p-6 shadow-sm">
        <p className="font-body text-sm text-brand-muted">
          Hmm — Shopify didn&apos;t answer just now. Refresh the page in a
          minute and it should come back.
        </p>
      </div>
    )
  }

  const sym = currencySymbol(stats.currency)
  const kpis = [
    {
      icon: ShoppingBag,
      label: 'Orders today',
      value: String(stats.ordersToday ?? 0),
    },
    {
      icon: CalendarDays,
      label: 'Orders — last 7 days',
      value: String(stats.ordersLast7Days ?? 0),
    },
    {
      icon: PoundSterling,
      label: 'Revenue — last 7 days',
      value: `${sym}${(stats.revenueLast7Days ?? 0).toLocaleString('en-GB', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`,
    },
  ]

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {kpis.map((kpi) => (
          <div
            key={kpi.label}
            className="bg-white border border-brand-warm rounded-2xl p-6 shadow-sm"
          >
            <div className="flex items-center gap-2.5 mb-3">
              <kpi.icon size={16} className="text-brand-amber" />
              <p className="font-body text-[11px] tracking-widest uppercase text-brand-muted">
                {kpi.label}
              </p>
            </div>
            <p className="font-display text-4xl text-brand-dark">{kpi.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-white border border-brand-warm rounded-2xl shadow-sm overflow-hidden">
        <div className="px-6 pt-5 pb-3 border-b border-brand-warm">
          <h3 className="font-display text-xl text-brand-dark">Recent Orders</h3>
          <p className="font-body text-xs text-brand-muted mt-1">
            Your latest orders, newest first.
          </p>
        </div>
        {stats.recentOrders && stats.recentOrders.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full font-body text-sm">
              <thead>
                <tr className="text-left text-[11px] tracking-widest uppercase text-brand-muted">
                  <th className="px-6 py-3 font-medium">Order</th>
                  <th className="px-4 py-3 font-medium">Customer</th>
                  <th className="px-4 py-3 font-medium">Total</th>
                  <th className="px-4 py-3 font-medium">Payment</th>
                  <th className="px-4 py-3 font-medium">Fulfilment</th>
                  <th className="px-6 py-3 font-medium text-right">When</th>
                </tr>
              </thead>
              <tbody>
                {stats.recentOrders.map((o) => (
                  <tr key={o.id} className="border-t border-brand-warm/60">
                    <td className="px-6 py-3.5 font-semibold text-brand-dark">
                      {o.name}
                    </td>
                    <td className="px-4 py-3.5 text-brand-dark">{o.customer}</td>
                    <td className="px-4 py-3.5 text-brand-dark">
                      {currencySymbol(o.currency)}
                      {parseFloat(o.total).toFixed(2)}
                    </td>
                    <td className="px-4 py-3.5">
                      <span
                        className={`inline-block px-2.5 py-1 rounded-full text-[11px] font-medium ${badgeStyle(o.financialStatus)}`}
                      >
                        {prettyStatus(o.financialStatus)}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <span
                        className={`inline-block px-2.5 py-1 rounded-full text-[11px] font-medium ${badgeStyle(o.fulfillmentStatus)}`}
                      >
                        {prettyStatus(o.fulfillmentStatus)}
                      </span>
                    </td>
                    <td className="px-6 py-3.5 text-right text-brand-muted whitespace-nowrap">
                      {timeAgo(o.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="px-6 py-8 font-body text-sm text-brand-muted">
            No orders yet — they&apos;ll appear here the moment one comes in.
          </p>
        )}
      </div>
    </div>
  )
}
