'use client'

import { Suspense, useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { useQuery } from 'convex/react'
import { api } from '../../convex/_generated/api'
import PageTabs from '../components/PageTabs'

// ─── Types ───────────────────────────────────────────────────────────────────

type Verdict = 'TRUE' | 'PARTIALLY TRUE' | 'FALSE' | ''

interface FD {
  a1: Verdict; a1_notes: string
  a2: Verdict; a2_notes: string
  a3: Verdict; a3_notes: string
  a4: Verdict; a4_notes: string
  a5: Verdict; a5_notes: string
  a6: Verdict; a6_notes: string
  a7: Verdict; a7_notes: string
  a8: Verdict; a8_notes: string
  a9: Verdict; a9_notes: string
  a10: Verdict; a10_notes: string
  s5q1: string; s5q2: string; s5q3: string; s5q4: string
  s5q5: string; s5q5_notes: string; s5q6: string; s5q7: string
  s6q1: string; s6q1_notes: string
  s6q2: string; s6q2_notes: string
  s6q3: string; s6q3_notes: string
  s6q4: string; s6q4_notes: string
  s6q5: string; s6q5_notes: string
  s6q6: string
  s7q1: string; s7q1_notes: string
  s7q2: string; s7q2_notes: string
  s7q3: string; s7q3_notes: string
  s7q4: string; s7q5: string
  s7q6: string; s7q6_notes: string
  s8q1: string
  s8q2: string; s8q2_notes: string
  s8q3: string
  s8q5: string; s8q5_notes: string
  s8q6: string
}

type UpdateStatus = 'confirmed' | 'revised' | 'modified' | 'pending'
type SprintStatus = 'do-this' | 'done' | 'modified' | 'skip' | 'verify-first'

interface StrategyUpdate {
  topic: string
  original: string
  updated: string
  status: UpdateStatus
}

interface SprintItem {
  day: number
  title: string
  status: SprintStatus
  detail: string
  flag?: 'blocker' | 'urgent' | null
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

const isTrue = (d: FD, k: keyof FD) => d[k] === 'TRUE'
const isFalse = (d: FD, k: keyof FD) => d[k] === 'FALSE'
const isPartial = (d: FD, k: keyof FD) => d[k] === 'PARTIALLY TRUE'

function getWebsiteRec(channel: string): { version: string; detail: string } {
  if (!channel)
    return {
      version: 'Shopify theme — Website B layout',
      detail: 'Acquisition channel not confirmed. Default to Website B in Shopify: Customise theme → hero with single CTA, reviews section above fold. Use Shopify Online Store → Themes → Customise.',
    }
  if (channel.includes('Google'))
    return {
      version: 'Shopify theme — Website A (SEO-first)',
      detail: 'Primary channel is Google. In Shopify: enable Shopify Blog, write 2 SEO posts (see strategy Day 8–9), set store meta title + description in Online Store → Preferences, add ingredient FAQ sections to product pages.',
    }
  if (channel.includes('Word of mouth') || channel.includes('recommendation'))
    return {
      version: 'Shopify theme — Website B (trust-first)',
      detail: 'Primary channel is word of mouth. In Shopify: surface the 4.98★ review count in hero, add Gerald Mousset testimonial as a featured review, enable referral app (ReferralCandy or UpPromote from Shopify App Store).',
    }
  return {
    version: 'Shopify theme — Website B (conversion-first)',
    detail: `Primary channel: ${channel.split('(')[0].trim()}. In Shopify Customise: hero product above fold, review count badge, single "Shop now" CTA. Social/influencer traffic decides in 5 seconds — no scroll required.`,
  }
}

function getSourceAction(answer: string, notes: string): string {
  if (answer.includes('loyalty'))
    return 'Loyalty/rewards app customers pay near full price. Increase loyalty point earning rates. Run a "double points" campaign this month to drive more orders through this channel.'
  if (answer.includes('influencer') || answer.includes('creator'))
    return `Confirmed influencer/creator source.${notes ? ' ' + notes + '.' : ''} Move from gifting to affiliate structure: 10% commission per sale. Recruit 2–3 creators in the same Ayurvedic/clean beauty space.`
  if (answer.includes('affiliate'))
    return 'Affiliate platform. Increase commission to 12–15% to attract higher-quality affiliates. Set a minimum audience threshold (10k+) for new approvals.'
  return `${notes ? notes + '. ' : ''}Understand why this source produces full-price customers, then replicate those conditions across other channels.`
}

// ─── Build Sprint ─────────────────────────────────────────────────────────────

function buildSprint(d: FD): SprintItem[] {
  const items: SprintItem[] = []
  const esp = d.s6q5 || ''
  const noEsp = !esp || esp === 'No ESP connected'
  const subInstalled = d.s6q6 && d.s6q6 !== 'No subscription app installed'
  const founderOnly = d.s6q1 === 'Founder only'
  const sourceKnown = d.s7q1 && !d.s7q1.includes('not sure')
  const largerFeasible = d.s8q1 && !d.s8q1.includes('Not feasible') && !d.s8q1.includes('no customer demand')

  // D1a: Replenishment email
  items.push({
    day: 1,
    title: 'Replenishment email — Day 80 trigger',
    status: noEsp ? 'verify-first' : 'do-this',
    detail: noEsp
      ? 'No ESP confirmed. First: choose Klaviyo (recommended). Then build the Day 80 post-purchase trigger, segmented by DNC purchasers only.'
      : `Build the Day 80 trigger in ${esp}. Segment: DNC purchasers. Subject: "Your jar is running low." Offer 10% off the reorder for first 3 months.`,
    flag: noEsp ? 'blocker' : null,
  })

  // D1b: GLOW10 → WELCOME10
  if (!isFalse(d, 'a3')) {
    items.push({
      day: 1,
      title: isTrue(d, 'a3') ? 'Replace GLOW10 with WELCOME10' : 'GLOW10 — verify placement, then replace',
      status: isTrue(d, 'a3') ? 'do-this' : 'verify-first',
      detail: isTrue(d, 'a3')
        ? 'GLOW10 confirmed in always-on channels. Create WELCOME10 (10%, new customers only). Update influencer links and ad landing pages. Do NOT deactivate GLOW10 until every link is updated — takes 3–5 days.'
        : 'GLOW10 placement not confirmed. Check influencer bios, ad landing pages, welcome email. If in always-on channels, replace with WELCOME10.',
    })
  }

  // D2: Subscription
  items.push({
    day: 2,
    title: subInstalled ? 'Configure subscription pricing tiers' : 'Install subscription app',
    status: subInstalled ? 'modified' : 'do-this',
    detail: subInstalled
      ? `${d.s6q6} already installed — assumption A8 was wrong, which is good. Skip installation. Configure three tiers: Single (15% off, 8-week interval), Duo (18% off, 2 products), Family (20% off, 100g DNC).`
      : 'Install Recharge or Loop Subscriptions from Shopify App Store. Configure: Single (15% off, 8-week), Duo (18% off, 2 products), Family (20% off, 100g DNC if feasible).',
  })

  // D3: Jivita
  if (isFalse(d, 'a4')) {
    items.push({
      day: 3,
      title: 'Jivita — VIP loyalty (not renegotiation)',
      status: 'modified',
      detail: 'Jivita is a personal buyer, not a stockist. Renegotiating would lose a loyal customer. Revised action: design a VIP loyalty tier — 15% permanent discount, quarterly gifting, named "founding customer" in brand story.',
    })
  } else {
    const informal = d.s5q7?.includes('Informal') || d.s5q7?.includes('case-by-case') || d.s5q7?.includes('manually')
    items.push({
      day: 3,
      title: 'Renegotiate Jivita wholesale terms',
      status: isTrue(d, 'a4') ? 'do-this' : 'verify-first',
      detail: isTrue(d, 'a4')
        ? `Jivita confirmed as stockist. Current: 53% effective discount. Target: 30–35% formal wholesale. ${informal ? 'Currently informal — draft a written agreement with minimum order quantities first.' : 'Frame as formalising the existing arrangement with volume commitments.'}`
        : 'Confirm Jivita relationship type before approaching. The conversation is entirely different for a stockist vs a personal buyer.',
    })
  }

  // D4: Gift flywheel
  items.push({
    day: 4,
    title: isFalse(d, 'a5') ? 'Add gift option at checkout (build flywheel from scratch)' : 'Launch gift-to-referral flywheel',
    status: isFalse(d, 'a5') ? 'modified' : 'do-this',
    detail: isFalse(d, 'a5')
      ? "21% different-name orders are billing mismatches, not gifts. Flywheel is smaller than modelled. Action: add a 'Gift this order' toggle at checkout with gift message. Add referral card inside all flagged gift orders going forward."
      : isPartial(d, 'a5')
        ? 'Some different-name orders confirmed as genuine gifts. Launch at 50% scale: referral card in all different-name orders. Monitor conversion for 30 days before scaling campaign.'
        : "21% of orders confirmed as genuine gifts. Launch immediately: personalised referral card inside every gift order. Card copy: 'Your friend thought of you. 15% off your first order: [code]'. Review weekly.",
  })

  // D5: Source 3890849
  items.push({
    day: 5,
    title: sourceKnown ? 'Scale your highest-quality channel' : 'Identify source 3890849 — urgent',
    status: sourceKnown ? 'do-this' : 'verify-first',
    detail: sourceKnown
      ? getSourceAction(d.s7q1, d.s7q1_notes)
      : 'Source 3890849 = 15 orders, 6.7% average discount rate vs 48.5% sitewide. Best customer channel in your data. Go to Shopify Admin → Settings → Apps and integrations → find the app matching this ID.',
    flag: sourceKnown ? null : 'urgent',
  })

  // D6: Gerald Mousset
  items.push({
    day: 6,
    title: 'Gerald Mousset — practitioner partnership',
    status: 'do-this',
    detail: !d.s7q5 || d.s7q5.includes('not sure')
      ? "Reach out via The Life Center Notting Hill contact page. Reference his two public reviews as the warm intro. Offer: complimentary DNC supply for his treatment room in exchange for one monthly recommendation post."
      : d.s7q5.includes('know him')
        ? "You already know Gerald. Formalise now: propose exclusive partnership. Supply DNC for his treatment rooms. Ask for a monthly recommendation to clients. Offer a co-branded 'facial-grade skincare' campaign."
        : "You've seen his reviews but haven't reached out. Warm intro: 'I noticed your two reviews of our cream two years apart — it means the world.' Goal: treatment room supply + referral structure.",
  })

  // D7: Website
  const webRec = getWebsiteRec(d.s7q2)
  items.push({
    day: 7,
    title: `Build ${webRec.version}`,
    status: 'do-this',
    detail: webRec.detail,
  })

  // D8: DNC size
  items.push({
    day: 8,
    title: largerFeasible ? 'Commission 100g DNC — Family subscription tier' : 'DNC 100g — not feasible now',
    status: largerFeasible ? 'do-this' : 'modified',
    detail: largerFeasible
      ? `You confirmed a larger size is feasible. Commission a 100g batch. Price: £44.99 (vs £49.98 for two separate 50g jars). Exclusively for the Family subscription tier. Launch with the subscription app on Day 30.`
      : 'Larger size not feasible. Family tier uses 2× 50g DNC instead. Price at £44.99 (saves £5 vs buying separately). Revisit 100g batch after confirming subscription demand over first 60 days.',
  })

  // D9: Full email sequence
  const espName = esp && esp !== 'No ESP connected' ? esp : 'your ESP'
  items.push({
    day: 9,
    title: 'Complete full 5-email retention sequence',
    status: noEsp ? 'verify-first' : 'do-this',
    detail: `Build five emails in ${espName}: (1) Day 1 — welcome + usage ritual. (2) Day 14 — ingredient story (why Ayurvedic). (3) Day 30 — new SKU introduction. (4) Day 80 — replenishment offer (10% reorder). (5) Day 100 — subscription invitation. Referral code in every footer.`,
    flag: noEsp ? 'blocker' : null,
  })

  // D10: Sprint review
  items.push({
    day: 10,
    title: 'Sprint review + Day 11–30 plan',
    status: 'do-this',
    detail: founderOnly
      ? 'Capacity: founder-only fulfilment. Before reviewing: confirm no backlog. Measure: email open rates (target >40%), subscription sign-ups (target 5+), referral codes used, Jivita status. >20 orders in 48h = consider part-time help.'
      : 'Measure: replenishment email open rate (target >40%), subscription conversions (target 5+), referral code redemptions, Jivita renegotiation status. Set Day 11–30 targets based on results.',
  })

  return items
}

// ─── Build Strategy Updates ───────────────────────────────────────────────────

function buildUpdates(d: FD): StrategyUpdate[] {
  return [
    {
      topic: 'Replenishment email timing',
      original: 'Day 80 trigger (assumed 90–100 day jar life)',
      updated: isTrue(d, 'a1')
        ? 'Confirmed. Day 80 trigger stands.'
        : isFalse(d, 'a1')
          ? `REVISED. Jar life differs from assumed. Adjust trigger date.${d.a1_notes ? ' Notes: ' + d.a1_notes.slice(0, 100) : ''}`
          : isPartial(d, 'a1')
            ? 'A/B test Day 70 vs Day 90 trigger. Use whichever gets higher open rate.'
            : 'Pending — confirm actual DNC consumption rate.',
      status: isTrue(d, 'a1') ? 'confirmed' : isFalse(d, 'a1') ? 'revised' : isPartial(d, 'a1') ? 'modified' : 'pending',
    },
    {
      topic: 'Discount code strategy',
      original: 'Replace GLOW10 with WELCOME10 to cap new-customer discounts',
      updated: isFalse(d, 'a3')
        ? 'REVISED. GLOW10 is a loyalty code — not in always-on channels. No replacement needed. New-customer discount strategy is unchanged.'
        : isTrue(d, 'a3')
          ? 'Confirmed. Proceed with GLOW10 → WELCOME10 replacement across all channels.'
          : 'Pending — verify GLOW10 placement before acting.',
      status: isFalse(d, 'a3') ? 'revised' : isTrue(d, 'a3') ? 'confirmed' : 'pending',
    },
    {
      topic: 'Subscription launch',
      original: 'Install app on Day 2, configure 3 pricing tiers',
      updated: d.s6q6 && d.s6q6 !== 'No subscription app installed'
        ? `REVISED. ${d.s6q6} already installed. Skip to pricing configuration — saves 1 day.`
        : 'Confirmed. Install subscription app on Day 2 and configure tiers.',
      status: d.s6q6 && d.s6q6 !== 'No subscription app installed' ? 'revised' : 'confirmed',
    },
    {
      topic: 'Jivita wholesale approach',
      original: 'Renegotiate 53% effective discount to 30–35% formal wholesale',
      updated: isFalse(d, 'a4')
        ? 'REVISED. Jivita is a personal buyer. Do not renegotiate — design a VIP loyalty tier instead.'
        : isTrue(d, 'a4')
          ? 'Confirmed. Jivita is a stockist. Renegotiate to formal wholesale agreement.'
          : 'Pending — confirm Jivita relationship type before approaching.',
      status: isFalse(d, 'a4') ? 'revised' : isTrue(d, 'a4') ? 'confirmed' : 'pending',
    },
    {
      topic: 'Gift-to-referral flywheel scale',
      original: '21% different-name orders = genuine gifts → immediate referral opportunity',
      updated: isFalse(d, 'a5')
        ? 'REVISED. Different-name orders are billing mismatches, not gifts. Build gift tracking at checkout first, then launch flywheel in 30 days.'
        : isTrue(d, 'a5')
          ? 'Confirmed. 21% are genuine gifts. Launch full flywheel immediately with Day 4 action.'
          : 'Partially confirmed. Launch at 50% scale, monitor conversion for 30 days.',
      status: isFalse(d, 'a5') ? 'revised' : isTrue(d, 'a5') ? 'confirmed' : 'modified',
    },
    {
      topic: 'Sprint capacity',
      original: 'Run all 10 sprint actions at full pace simultaneously',
      updated: d.s6q1 === 'Founder only'
        ? 'REVISED. Founder-only fulfilment. Stage the sprint — cap at 10 orders/day. Sequence email sends to avoid fulfilment crunch.'
        : d.s6q1
          ? 'Confirmed. Team capacity supports the full sprint at pace.'
          : 'Pending — confirm fulfilment team size.',
      status: d.s6q1 === 'Founder only' ? 'revised' : d.s6q1 ? 'confirmed' : 'pending',
    },
    {
      topic: 'Website recommendation',
      original: 'Website A or B — pending acquisition channel confirmation',
      updated: getWebsiteRec(d.s7q2).version + (d.s7q2 ? ` — based on ${d.s7q2.split('(')[0].trim().toLowerCase()} as primary channel.` : '.'),
      status: d.s7q2 ? 'confirmed' : 'pending',
    },
  ]
}

// ─── Sub-components ───────────────────────────────────────────────────────────

const STATUS_STYLES: Record<UpdateStatus, { label: string; cls: string }> = {
  confirmed: { label: 'CONFIRMED', cls: 'bg-ink text-cream' },
  revised: { label: 'REVISED', cls: 'bg-red-900 text-cream' },
  modified: { label: 'MODIFIED', cls: 'bg-gold text-cream' },
  pending: { label: 'PENDING', cls: 'bg-parchment text-ink/50' },
}

const SPRINT_STYLES: Record<SprintStatus, { label: string; cls: string }> = {
  'do-this': { label: 'DO THIS', cls: 'bg-ink text-cream' },
  'done': { label: 'ALREADY DONE', cls: 'bg-emerald-800 text-cream' },
  'modified': { label: 'MODIFIED', cls: 'bg-gold text-cream' },
  'skip': { label: 'SKIP', cls: 'bg-parchment text-ink/40' },
  'verify-first': { label: 'VERIFY FIRST', cls: 'bg-orange-100 text-orange-800' },
}

function StrategyCard({ u }: { u: StrategyUpdate }) {
  const cfg = STATUS_STYLES[u.status]
  return (
    <div className="bg-white border border-parchment rounded-xl p-5 mb-3 shadow-sm">
      <div className="flex items-center gap-2 flex-wrap mb-2">
        <span className={`text-xs font-bold px-2 py-0.5 rounded ${cfg.cls}`}>{cfg.label}</span>
        <span className="text-sm font-semibold text-ink">{u.topic}</span>
      </div>
      <p className="text-xs text-ink/40 mb-2">
        <span className="font-semibold">Was: </span><span className="italic">{u.original}</span>
      </p>
      <p className="text-sm text-ink/80 leading-relaxed">{u.updated}</p>
    </div>
  )
}

function SprintCard({ item }: { item: SprintItem }) {
  const cfg = SPRINT_STYLES[item.status]
  return (
    <div className={`bg-white border rounded-xl p-5 mb-4 shadow-sm ${
      item.flag ? 'border-red-200' : 'border-parchment'
    }`}>
      <div className="flex items-start gap-3 mb-3">
        <span className="shrink-0 text-xs font-bold text-gold bg-gold/10 px-2 py-0.5 rounded mt-0.5 whitespace-nowrap">
          DAY {item.day}
        </span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-0.5">
            <p className="text-sm font-semibold text-ink">{item.title}</p>
            <span className={`text-xs font-bold px-2 py-0.5 rounded ${cfg.cls}`}>{cfg.label}</span>
            {item.flag === 'blocker' && (
              <span className="text-xs font-bold text-red-700 bg-red-50 border border-red-200 px-2 py-0.5 rounded">BLOCKER</span>
            )}
            {item.flag === 'urgent' && (
              <span className="text-xs font-bold text-red-700 bg-red-50 border border-red-200 px-2 py-0.5 rounded">URGENT</span>
            )}
          </div>
        </div>
      </div>
      <p className="text-sm text-ink/70 leading-relaxed ml-16">{item.detail}</p>
    </div>
  )
}

// ─── Plan View ────────────────────────────────────────────────────────────────

function Plan({ data }: { data: FD }) {
  const sprint = buildSprint(data)
  const updates = buildUpdates(data)

  const blockers = sprint.filter(i => i.flag === 'blocker')
  const urgents = sprint.filter(i => i.flag === 'urgent')

  return (
    <main className="min-h-screen bg-cream">
      <header className="bg-ink text-cream px-6 py-10">
        <div className="max-w-3xl mx-auto">
          <div className="text-xs font-bold tracking-widest text-gold uppercase mb-3">
            Powered by Aletheia AI · aletheiaai.in
          </div>
          <h1 className="font-serif text-3xl md:text-4xl font-bold mb-2 leading-tight">
            INHERITED SKINCARE
          </h1>
          <p className="text-cream/70 text-base">Updated Growth Plan — Based On Founder Responses</p>
          <p className="text-cream/40 text-xs mt-2 max-w-lg leading-relaxed">
            Every item below has been adjusted based on what you told us. Items marked REVISED have changed from the original plan.
          </p>
          <PageTabs />
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 py-10">

        {/* Priority flags */}
        {(blockers.length > 0 || urgents.length > 0) && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-5 mb-10">
            <p className="text-xs font-bold text-red-700 uppercase tracking-widest mb-3">Needs attention first</p>
            {blockers.map((b, i) => (
              <div key={i} className="flex gap-2 mb-2">
                <span className="text-xs font-bold text-red-700 bg-red-100 px-2 py-0.5 rounded h-fit">BLOCKER</span>
                <p className="text-sm text-red-800">{b.title} — resolve before the sprint can run</p>
              </div>
            ))}
            {urgents.map((u, i) => (
              <div key={i} className="flex gap-2 mb-1">
                <span className="text-xs font-bold text-red-700 bg-red-100 px-2 py-0.5 rounded h-fit">URGENT</span>
                <p className="text-sm text-red-800">{u.title}</p>
              </div>
            ))}
          </div>
        )}

        {/* Strategy updates */}
        <div className="mb-12">
          <div className="text-xs font-bold tracking-widest text-gold uppercase mb-1">What Changed</div>
          <h2 className="font-serif text-2xl font-bold text-ink mb-2">Updated Strategy</h2>
          <p className="text-sm text-ink/60 mb-6 leading-relaxed">
            Original plan vs founder-confirmed reality. CONFIRMED = proceed as planned. REVISED = different action. PENDING = still needs verification.
          </p>
          {updates.map((u, i) => <StrategyCard key={i} u={u} />)}
        </div>

        <div className="h-px bg-parchment my-10" />

        {/* Sprint checklist */}
        <div>
          <div className="text-xs font-bold tracking-widest text-gold uppercase mb-1">Action Plan</div>
          <h2 className="font-serif text-2xl font-bold text-ink mb-2">10-Day Sprint</h2>
          <p className="text-sm text-ink/60 mb-6 leading-relaxed">
            Personalised to your answers. DO THIS = proceed. MODIFIED = action changed from original. VERIFY FIRST = confirm assumption before acting.
          </p>
          {sprint.map((item, i) => <SprintCard key={i} item={item} />)}
        </div>

        {/* Print note */}
        <div className="mt-12 pt-8 border-t-2 border-parchment">
          <button
            onClick={() => window.print()}
            className="text-xs text-ink/40 hover:text-ink/70 underline transition-colors"
          >
            Save as PDF — use browser Print → Save as PDF
          </button>
        </div>
      </div>

      <footer className="bg-ink text-cream/30 text-xs text-center py-6 px-4 mt-10">
        Prepared by Aletheia AI · aletheiaai.in · Confidential — not for distribution
      </footer>
    </main>
  )
}

// ─── Empty State ──────────────────────────────────────────────────────────────

function EmptyState() {
  return (
    <main className="min-h-screen bg-cream flex items-center justify-center p-6">
      <div className="max-w-md text-center">
        <div className="w-12 h-12 rounded-full bg-parchment flex items-center justify-center mx-auto mb-5">
          <svg className="w-6 h-6 text-ink/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        </div>
        <h1 className="font-serif text-2xl text-ink font-bold mb-3">Awaiting founder responses.</h1>
        <p className="text-sm text-ink/60 leading-relaxed mb-6">
          This page generates the personalised growth plan once the founder completes the strategy form. The plan appears here immediately after submission.
        </p>
        <a
          href="/strategy"
          className="inline-block bg-ink text-cream px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-ink/80 transition-all"
        >
          Go to founder form →
        </a>
      </div>
    </main>
  )
}

// ─── Main (with Suspense for useSearchParams) ─────────────────────────────────

function TodoContent() {
  const params = useSearchParams()
  const [data, setData] = useState<FD | null>(null)
  const [ready, setReady] = useState(false)
  const latest = useQuery(api.responses.getLatest)

  useEffect(() => {
    // 1. URL param (immediate post-submit redirect)
    const encoded = params.get('d')
    if (encoded) {
      try {
        const decoded: FD = JSON.parse(decodeURIComponent(escape(atob(encoded))))
        setData(decoded)
        setReady(true)
        localStorage.setItem('ihf_responses', JSON.stringify(decoded))
        return
      } catch { /* fall through */ }
    }
    // 2. localStorage (same device, later visit)
    const stored = localStorage.getItem('ihf_responses')
    if (stored) {
      try {
        setData(JSON.parse(stored))
        setReady(true)
        return
      } catch { /* fall through */ }
    }
    // 3. Convex (cross-device — waits for query to resolve)
    if (latest !== undefined) {
      if (latest?.responses) {
        setData(latest.responses as FD)
      }
      setReady(true)
    }
  }, [params, latest])

  if (!ready) return <div className="min-h-screen bg-cream" />
  if (!data) return <EmptyState />
  return <Plan data={data} />
}

export default function TodoPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-cream" />}>
      <TodoContent />
    </Suspense>
  )
}
