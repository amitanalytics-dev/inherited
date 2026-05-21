'use client'

import PageTabs from '../components/PageTabs'

// ─── Mock data ────────────────────────────────────────────────────────────────

const METRICS = [
  { label: 'Revenue (last 12m)', value: '£24,180', delta: '+£8,200 projected', up: true },
  { label: 'Total Orders', value: '483', delta: '+147 from sprint', up: true },
  { label: 'Avg. Order Value', value: '£42.10', delta: '→ £58 after repricing', up: true },
  { label: 'Gross Margin', value: '61%', delta: '→ 72% after repricing', up: true },
  { label: 'Repeat Purchase Rate', value: '29%', delta: 'Target: 45% (email)', up: true },
  { label: 'Discount Rate (avg)', value: '48.7%', delta: 'Target: <20% (90 days)', up: false },
]

const REPRICING = [
  { sku: 'DNC Moisturiser', old: 24.99, rec: 34, gmOld: 60, gmNew: 70.6, annualUnits: 210, uplift: 1892 },
  { sku: 'Radiance Serum', old: 24.99, rec: 38, gmOld: 68, gmNew: 78.9, annualUnits: 95, uplift: 1238 },
  { sku: 'Night Cream', old: 34.99, rec: 42, gmOld: 72, gmNew: 76.2, annualUnits: 82, uplift: 574 },
  { sku: 'Cleansing Balm', old: 20, rec: 28, gmOld: 72, gmNew: 80.4, annualUnits: 68, uplift: 544 },
  { sku: 'Foot Cream', old: 21, rec: 28, gmOld: 52, gmNew: 64.3, annualUnits: 48, uplift: 336 },
  { sku: 'Lip Balm', old: 9.99, rec: 13, gmOld: 65, gmNew: 73.1, annualUnits: 40, uplift: 120 },
]

const SPRINT = [
  { day: 1, title: 'Shopify — Prices, descriptions, nav', platform: 'Shopify', status: 'done' },
  { day: 2, title: 'Shopify — Homepage rebuild', platform: 'Shopify', status: 'done' },
  { day: 3, title: 'Shopify — Gift cards + Gifts collection', platform: 'Shopify', status: 'done' },
  { day: 4, title: 'Shopify — Bundles', platform: 'Shopify', status: 'done' },
  { day: 5, title: 'Klaviyo — Flow rewrites', platform: 'Klaviyo', status: 'active' },
  { day: 6, title: 'Instagram — 10 captions', platform: 'Instagram', status: 'todo' },
  { day: 7, title: 'Instagram — Grid plan', platform: 'Instagram', status: 'todo' },
  { day: 8, title: 'Blog — Origin story post', platform: 'Shopify Blog', status: 'todo' },
  { day: 9, title: 'Blog — Ingredient story post', platform: 'Shopify Blog', status: 'todo' },
  { day: 10, title: 'Launch — Email to existing list', platform: 'Klaviyo', status: 'todo' },
]

const EMAIL_FLOWS = [
  { name: 'Welcome flow', openRate: 47, clickRate: 3.8, status: 'live', lastSent: '2 days ago' },
  { name: 'Post-purchase (ingredient story)', openRate: 52, clickRate: 4.7, status: 'live', lastSent: '5 days ago' },
  { name: 'Abandoned cart', openRate: 38, clickRate: 6.2, status: 'live', lastSent: '1 day ago' },
  { name: 'Replenishment (Day 80)', openRate: 0, clickRate: 0, status: 'building', lastSent: '—' },
  { name: 'Subscription invite (Day 100)', openRate: 0, clickRate: 0, status: 'todo', lastSent: '—' },
]

const CHANNELS = [
  { name: 'Shopify web (direct)', orders: 214, discountRate: 18, quality: 'high' },
  { name: 'Instagram / social', orders: 187, discountRate: 52, quality: 'low' },
  { name: 'Source 3890849', orders: 15, discountRate: 6.7, quality: 'excellent' },
  { name: 'Jivita Ayurveda (wholesale)', orders: 31, discountRate: 53, quality: 'review' },
  { name: 'Google / organic', orders: 36, discountRate: 22, quality: 'high' },
]

const ACTIONS_TODAY = [
  { priority: 1, action: 'Klaviyo — Rewrite welcome flow subject line to "Your ritual starts here"', platform: 'Klaviyo', time: '30 min' },
  { priority: 2, action: 'Klaviyo — Build Day 80 replenishment trigger (DNC buyers only)', platform: 'Klaviyo', time: '45 min' },
  { priority: 3, action: 'Instagram — Draft 5 product caption posts for scheduled grid', platform: 'Instagram', time: '60 min' },
]

// ─── Helpers ─────────────────────────────────────────────────────────────────

function Bar({ pct, color = 'bg-ink' }: { pct: number; color?: string }) {
  return (
    <div className="w-full bg-parchment rounded-full h-1.5 mt-1">
      <div className={`${color} h-1.5 rounded-full`} style={{ width: `${Math.min(pct, 100)}%` }} />
    </div>
  )
}

const PLATFORM_COLORS: Record<string, string> = {
  Shopify: 'bg-emerald-100 text-emerald-800',
  Klaviyo: 'bg-blue-100 text-blue-800',
  Instagram: 'bg-pink-100 text-pink-800',
  'Shopify Blog': 'bg-amber-100 text-amber-800',
}

const SPRINT_STATUS: Record<string, { label: string; cls: string }> = {
  done: { label: 'DONE', cls: 'bg-ink text-cream' },
  active: { label: 'IN PROGRESS', cls: 'bg-gold text-cream' },
  todo: { label: 'TO DO', cls: 'bg-parchment text-ink/40' },
}

const QUALITY_CONFIG: Record<string, { label: string; cls: string }> = {
  excellent: { label: 'EXCELLENT', cls: 'text-emerald-700 bg-emerald-50' },
  high: { label: 'HIGH', cls: 'text-ink bg-ink/5' },
  low: { label: 'LOW', cls: 'text-orange-700 bg-orange-50' },
  review: { label: 'REVIEW', cls: 'text-red-700 bg-red-50' },
}

const EMAIL_STATUS: Record<string, { label: string; cls: string }> = {
  live: { label: 'LIVE', cls: 'text-emerald-700 bg-emerald-50' },
  building: { label: 'BUILDING', cls: 'text-gold bg-gold/10' },
  todo: { label: 'TO DO', cls: 'text-ink/40 bg-parchment' },
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function CommandCentre() {
  const totalUplift = REPRICING.reduce((sum, r) => sum + r.uplift, 0)
  const sprintDone = SPRINT.filter(s => s.status === 'done').length

  return (
    <main className="min-h-screen bg-cream">

      {/* Header */}
      <header className="bg-ink text-cream px-6 py-10">
        <div className="max-w-5xl mx-auto">
          <div className="text-xs font-bold tracking-widest text-gold uppercase mb-3">
            Powered by Aletheia AI · aletheiaai.in
          </div>
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div>
              <h1 className="font-serif text-3xl md:text-4xl font-bold mb-1">INHERITED SKINCARE</h1>
              <p className="text-cream/70 text-base">Command Centre — Live Demo</p>
            </div>
            <div className="bg-white/10 rounded-xl px-5 py-3 text-right">
              <p className="text-xs text-cream/40 mb-1">Sprint progress</p>
              <p className="text-2xl font-bold text-cream">{sprintDone}<span className="text-cream/40 text-base font-normal">/10</span></p>
              <p className="text-xs text-gold mt-0.5">Day 5 — active</p>
            </div>
          </div>
          <PageTabs />
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 py-10 space-y-10">

        {/* Key metrics */}
        <section>
          <div className="text-xs font-bold tracking-widest text-gold uppercase mb-4">Overview</div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {METRICS.map((m, i) => (
              <div key={i} className="bg-white border border-parchment rounded-xl p-4 shadow-sm">
                <p className="text-xs text-ink/40 mb-1">{m.label}</p>
                <p className="font-serif text-2xl font-bold text-ink mb-1">{m.value}</p>
                <p className={`text-xs font-semibold ${m.up ? 'text-emerald-700' : 'text-red-700'}`}>{m.delta}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Today's actions */}
        <section>
          <div className="text-xs font-bold tracking-widest text-gold uppercase mb-4">Today's Actions</div>
          <div className="space-y-3">
            {ACTIONS_TODAY.map((a, i) => (
              <div key={i} className="bg-white border border-parchment rounded-xl p-4 shadow-sm flex items-start gap-4">
                <div className="w-7 h-7 rounded-full bg-ink text-cream text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                  {a.priority}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-ink leading-relaxed">{a.action}</p>
                  <div className="flex items-center gap-2 mt-1.5">
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded ${PLATFORM_COLORS[a.platform] ?? 'bg-parchment text-ink/50'}`}>{a.platform}</span>
                    <span className="text-xs text-ink/40">{a.time}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <div className="grid md:grid-cols-2 gap-6">

          {/* Sprint tracker */}
          <section>
            <div className="text-xs font-bold tracking-widest text-gold uppercase mb-4">10-Day Sprint</div>
            <div className="bg-white border border-parchment rounded-xl shadow-sm overflow-hidden">
              {SPRINT.map((s, i) => {
                const cfg = SPRINT_STATUS[s.status]
                const pColor = PLATFORM_COLORS[s.platform] ?? 'bg-parchment text-ink/50'
                return (
                  <div key={i} className={`flex items-center gap-3 px-4 py-3 ${i < SPRINT.length - 1 ? 'border-b border-parchment' : ''} ${s.status === 'active' ? 'bg-gold/5' : ''}`}>
                    <span className="text-xs text-ink/30 w-6 shrink-0">D{s.day}</span>
                    <p className="text-xs text-ink flex-1 leading-tight">{s.title}</p>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded shrink-0 ${pColor}`}>{s.platform}</span>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded shrink-0 ${cfg.cls}`}>{cfg.label}</span>
                  </div>
                )
              })}
            </div>
          </section>

          {/* Channel quality */}
          <section>
            <div className="text-xs font-bold tracking-widest text-gold uppercase mb-4">Channel Quality</div>
            <div className="bg-white border border-parchment rounded-xl shadow-sm overflow-hidden">
              {CHANNELS.map((c, i) => {
                const qCfg = QUALITY_CONFIG[c.quality]
                return (
                  <div key={i} className={`px-4 py-3 ${i < CHANNELS.length - 1 ? 'border-b border-parchment' : ''}`}>
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-xs font-semibold text-ink">{c.name}</p>
                      <span className={`text-xs font-bold px-2 py-0.5 rounded ${qCfg.cls}`}>{qCfg.label}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <p className="text-xs text-ink/40">{c.orders} orders</p>
                      <p className="text-xs text-ink/40">·</p>
                      <p className="text-xs text-ink/40">{c.discountRate}% avg discount</p>
                    </div>
                    <Bar pct={100 - c.discountRate} color={c.quality === 'excellent' ? 'bg-emerald-600' : c.quality === 'high' ? 'bg-ink' : 'bg-orange-400'} />
                  </div>
                )
              })}
            </div>
          </section>
        </div>

        {/* Repricing impact */}
        <section>
          <div className="flex items-baseline gap-3 mb-4">
            <div className="text-xs font-bold tracking-widest text-gold uppercase">Repricing Impact</div>
            <div className="bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-1">
              <span className="text-xs font-bold text-emerald-800">+£{totalUplift.toLocaleString()} projected annual uplift</span>
            </div>
          </div>
          <div className="bg-white border border-parchment rounded-xl shadow-sm overflow-hidden">
            <div className="grid grid-cols-5 gap-0 text-xs font-semibold text-ink/40 px-4 py-2 border-b border-parchment bg-cream">
              <span className="col-span-2">SKU</span>
              <span className="text-right">Old price</span>
              <span className="text-right">New price</span>
              <span className="text-right">Annual uplift</span>
            </div>
            {REPRICING.map((r, i) => (
              <div key={i} className={`grid grid-cols-5 gap-0 px-4 py-3 text-sm ${i < REPRICING.length - 1 ? 'border-b border-parchment' : ''}`}>
                <span className="col-span-2 font-semibold text-ink text-xs">{r.sku}</span>
                <span className="text-right text-xs text-ink/50 line-through">£{r.old}</span>
                <span className="text-right text-xs font-semibold text-ink">£{r.rec}</span>
                <span className="text-right text-xs font-semibold text-emerald-700">+£{r.uplift.toLocaleString()}</span>
              </div>
            ))}
            <div className="grid grid-cols-5 gap-0 px-4 py-3 bg-ink text-cream">
              <span className="col-span-4 text-xs font-semibold">Total projected annual revenue uplift</span>
              <span className="text-right text-sm font-bold">+£{totalUplift.toLocaleString()}</span>
            </div>
          </div>
        </section>

        {/* Email performance */}
        <section>
          <div className="text-xs font-bold tracking-widest text-gold uppercase mb-4">Klaviyo Email Flows</div>
          <div className="bg-white border border-parchment rounded-xl shadow-sm overflow-hidden">
            <div className="grid grid-cols-5 gap-0 text-xs font-semibold text-ink/40 px-4 py-2 border-b border-parchment bg-cream">
              <span className="col-span-2">Flow</span>
              <span className="text-right">Open rate</span>
              <span className="text-right">Click rate</span>
              <span className="text-right">Status</span>
            </div>
            {EMAIL_FLOWS.map((f, i) => {
              const sCfg = EMAIL_STATUS[f.status]
              return (
                <div key={i} className={`grid grid-cols-5 gap-0 px-4 py-3 ${i < EMAIL_FLOWS.length - 1 ? 'border-b border-parchment' : ''}`}>
                  <span className="col-span-2 text-xs font-semibold text-ink">{f.name}</span>
                  <span className="text-right text-xs text-ink/70">{f.openRate ? `${f.openRate}%` : '—'}</span>
                  <span className="text-right text-xs text-ink/70">{f.clickRate ? `${f.clickRate}%` : '—'}</span>
                  <span className="text-right">
                    <span className={`text-xs font-bold px-2 py-0.5 rounded ${sCfg.cls}`}>{sCfg.label}</span>
                  </span>
                </div>
              )
            })}
          </div>
        </section>

      </div>

      <footer className="bg-ink text-cream/30 text-xs text-center py-6 px-4 mt-10">
        Prepared by Aletheia AI · aletheiaai.in · Demo view — data is illustrative
      </footer>
    </main>
  )
}
