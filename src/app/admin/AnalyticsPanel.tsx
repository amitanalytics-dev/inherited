'use client'

import { useEffect, useState } from 'react'
import {
  TrendingUp,
  ShoppingCart,
  PoundSterling,
  ExternalLink,
  Loader2,
  BarChart2,
  ArrowRight,
} from 'lucide-react'

type Stats = {
  configured: boolean
  ordersToday?: number
  ordersLast7Days?: number
  revenueLast7Days?: number
  currency?: string
  recentOrders?: { createdAt: string; total: string; currency: string }[]
}

function currencySymbol(code?: string) {
  if (code === 'GBP') return '£'
  if (code === 'USD') return '$'
  if (code === 'EUR') return '€'
  return code ? `${code} ` : '£'
}

export default function AnalyticsPanel() {
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
        Loading analytics…
      </div>
    )
  }

  const sym = currencySymbol(stats?.currency)

  // Compute this-month metrics from recentOrders
  const now = new Date()
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).getTime()
  const ordersThisMonth = stats?.recentOrders?.filter(
    (o) => new Date(o.createdAt).getTime() >= startOfMonth
  ) ?? []
  const revenueThisMonth = ordersThisMonth.reduce(
    (acc, o) => acc + parseFloat(o.total || '0'),
    0
  )
  const avgOrderValue =
    ordersThisMonth.length > 0 ? revenueThisMonth / ordersThisMonth.length : 0

  return (
    <div className="space-y-6">
      {/* This month KPIs */}
      {stats?.configured && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            {
              icon: ShoppingCart,
              label: 'Orders this month',
              value: String(ordersThisMonth.length),
            },
            {
              icon: PoundSterling,
              label: 'Revenue this month',
              value: `${sym}${revenueThisMonth.toFixed(2)}`,
            },
            {
              icon: TrendingUp,
              label: 'Avg order value',
              value: `${sym}${avgOrderValue.toFixed(2)}`,
            },
            {
              icon: BarChart2,
              label: 'Orders last 7 days',
              value: String(stats.ordersLast7Days ?? 0),
            },
          ].map((kpi) => (
            <div
              key={kpi.label}
              className="bg-white border border-brand-warm rounded-2xl p-5 shadow-sm"
            >
              <div className="flex items-center gap-2 mb-2">
                <kpi.icon size={14} className="text-brand-amber" />
                <p className="font-body text-[10px] tracking-widest uppercase text-brand-muted">
                  {kpi.label}
                </p>
              </div>
              <p className="font-display text-3xl text-brand-dark">{kpi.value}</p>
            </div>
          ))}
        </div>
      )}

      {/* Funnel card */}
      <div className="bg-white border border-brand-warm rounded-2xl p-6 shadow-sm">
        <div className="flex items-start justify-between mb-5">
          <div>
            <h3 className="font-display text-xl text-brand-dark">
              Sales Funnel
            </h3>
            <p className="font-body text-xs text-brand-muted mt-1">
              Sessions and add-to-carts come from Google Analytics. Purchases
              are live from Shopify.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          {/* Sessions — GA only */}
          <div className="rounded-xl bg-brand-cream/60 border border-brand-warm p-4 flex flex-col gap-2">
            <p className="font-body text-[10px] tracking-widest uppercase text-brand-muted">
              Sessions (Traffic)
            </p>
            <p className="font-display text-2xl text-brand-dark">—</p>
            <a
              href="https://analytics.google.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 font-body text-[11px] text-brand-amber hover:underline mt-auto"
            >
              View in GA <ExternalLink size={10} />
            </a>
          </div>

          {/* Add to carts — GA only */}
          <div className="rounded-xl bg-brand-cream/60 border border-brand-warm p-4 flex flex-col gap-2">
            <p className="font-body text-[10px] tracking-widest uppercase text-brand-muted">
              Add to Carts
            </p>
            <p className="font-display text-2xl text-brand-dark">—</p>
            <a
              href="https://analytics.google.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 font-body text-[11px] text-brand-amber hover:underline mt-auto"
            >
              View in GA <ExternalLink size={10} />
            </a>
          </div>

          {/* Purchases — live Shopify data */}
          <div className="rounded-xl bg-brand-green/10 border border-brand-green/30 p-4 flex flex-col gap-2">
            <p className="font-body text-[10px] tracking-widest uppercase text-brand-muted">
              Purchases (this month)
            </p>
            <p className="font-display text-2xl text-brand-dark">
              {stats?.configured ? ordersThisMonth.length : '—'}
            </p>
            <p className="font-body text-[11px] text-brand-green mt-auto">
              Live from Shopify
            </p>
          </div>
        </div>

        {/* Funnel arrow */}
        <div className="flex items-center justify-center gap-2 text-brand-muted font-body text-xs mb-6">
          <span>Sessions</span>
          <ArrowRight size={12} />
          <span>Add to cart</span>
          <ArrowRight size={12} />
          <span className="text-brand-green font-semibold">Purchase</span>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-brand-warm">
          <a
            href="https://analytics.google.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-brand-dark text-brand-cream font-body text-xs tracking-widest uppercase rounded-lg hover:bg-brand-dark/80 transition-colors"
          >
            Open Google Analytics <ExternalLink size={13} />
          </a>
          <a
            href="https://admin.shopify.com/store/leela-skincare/analytics"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-5 py-3 border border-brand-warm text-brand-dark font-body text-xs tracking-widest uppercase rounded-lg hover:border-brand-amber/60 transition-colors"
          >
            Shopify Analytics <ExternalLink size={13} />
          </a>
        </div>
      </div>
    </div>
  )
}
