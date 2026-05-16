'use client'

import { useRef, useState } from 'react'
import PageTabs from './components/PageTabs'

// ─── Types ───────────────────────────────────────────────────────────────────

type Verdict = 'TRUE' | 'PARTIALLY TRUE' | 'FALSE' | ''

interface FormData {
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
  s7q3: string[]; s7q3_notes: string
  s7q4: string; s7q5: string
  s7q6: string; s7q6_notes: string
  s8q1: string
  s8q2: string; s8q2_notes: string
  s8q3: string; s8q4: string
  s8q5: string; s8q5_notes: string
  s8q6: string
}

const INITIAL: FormData = {
  a1: '', a1_notes: '', a2: '', a2_notes: '', a3: '', a3_notes: '',
  a4: '', a4_notes: '', a5: '', a5_notes: '', a6: '', a6_notes: '',
  a7: '', a7_notes: '', a8: '', a8_notes: '', a9: '', a9_notes: '',
  a10: '', a10_notes: '',
  s5q1: '', s5q2: '', s5q3: '', s5q4: '',
  s5q5: '', s5q5_notes: '', s5q6: '', s5q7: '',
  s6q1: '', s6q1_notes: '', s6q2: '', s6q2_notes: '',
  s6q3: '', s6q3_notes: '', s6q4: '', s6q4_notes: '',
  s6q5: '', s6q5_notes: '', s6q6: '',
  s7q1: '', s7q1_notes: '', s7q2: '', s7q2_notes: '',
  s7q3: [], s7q3_notes: '', s7q4: '', s7q5: '',
  s7q6: '', s7q6_notes: '',
  s8q1: '', s8q2: '', s8q2_notes: '',
  s8q3: '', s8q4: '', s8q5: '', s8q5_notes: '', s8q6: '',
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function SectionHeader({ num, title, desc }: { num: string; title: string; desc: string }) {
  return (
    <div className="mb-8">
      <div className="text-xs font-bold tracking-widest text-gold uppercase mb-1">Section {num}</div>
      <h2 className="font-serif text-2xl font-bold text-ink mb-2">{title}</h2>
      <p className="text-sm text-ink/60 leading-relaxed">{desc}</p>
    </div>
  )
}

function AssumptionCard({
  code, statement, impact, value, notes, onVerdict, onNotes,
}: {
  code: string; statement: string; impact: string
  value: Verdict; notes: string
  onVerdict: (v: Verdict) => void; onNotes: (n: string) => void
}) {
  const VERDICTS: Verdict[] = ['TRUE', 'PARTIALLY TRUE', 'FALSE']
  const activeClass: Record<string, string> = {
    'TRUE': 'bg-ink text-cream border-ink',
    'PARTIALLY TRUE': 'bg-gold text-cream border-gold',
    'FALSE': 'bg-red-900 text-cream border-red-900',
  }
  return (
    <div className="bg-white border border-parchment rounded-xl p-5 mb-4 shadow-sm">
      <div className="flex gap-3 items-start mb-3">
        <span className="shrink-0 text-xs font-bold text-gold bg-gold/10 px-2 py-0.5 rounded mt-0.5">{code}</span>
        <p className="text-sm text-ink leading-relaxed">{statement}</p>
      </div>
      <div className="bg-cream rounded-lg p-3 mb-3 text-xs text-ink/60 leading-relaxed">
        <span className="font-semibold text-ink/80">Impact if false: </span>{impact}
      </div>
      <div className="flex flex-wrap gap-2 mb-3">
        {VERDICTS.map(v => (
          <button
            key={v}
            onClick={() => onVerdict(value === v ? '' : v)}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold border transition-all ${
              value === v ? activeClass[v] : 'border-parchment text-ink/50 bg-white hover:border-ink/40'
            }`}
          >
            {v}
          </button>
        ))}
      </div>
      {(value === 'FALSE' || value === 'PARTIALLY TRUE') && (
        <textarea
          value={notes}
          onChange={e => onNotes(e.target.value)}
          placeholder="Correction or additional notes..."
          rows={2}
          className="w-full text-sm text-ink bg-cream border border-parchment rounded-lg p-3 resize-none focus:outline-none focus:border-gold/60 placeholder:text-ink/30"
        />
      )}
    </div>
  )
}

function MCQCard({
  section, n, question, why, options, value, notes, showNotes, onSelect, onNotes,
}: {
  section: string; n: number; question: string; why: string
  options: string[]; value: string
  notes?: string; showNotes?: boolean
  onSelect: (v: string) => void; onNotes?: (v: string) => void
}) {
  return (
    <div className="bg-white border border-parchment rounded-xl p-5 mb-4 shadow-sm">
      <div className="flex gap-2 items-start mb-2">
        <span className="shrink-0 text-xs font-bold text-gold bg-gold/10 px-2 py-0.5 rounded mt-0.5">
          {section} Q{n}
        </span>
        <p className="text-sm font-semibold text-ink leading-relaxed">{question}</p>
      </div>
      <p className="text-xs text-ink/50 ml-8 mb-4 leading-relaxed">
        <span className="font-semibold text-ink/60">Why we ask: </span>{why}
      </p>
      <div className="flex flex-col gap-2 ml-8">
        {options.map(opt => (
          <button
            key={opt}
            onClick={() => onSelect(value === opt ? '' : opt)}
            className={`text-left px-4 py-2.5 rounded-lg text-sm border transition-all ${
              value === opt
                ? 'bg-ink text-cream border-ink'
                : 'border-parchment text-ink bg-white hover:border-ink/30 hover:bg-cream/50'
            }`}
          >
            {value === opt ? '✓  ' : ''}{opt}
          </button>
        ))}
      </div>
      {showNotes && (
        <textarea
          value={notes ?? ''}
          onChange={e => onNotes?.(e.target.value)}
          placeholder="Additional notes..."
          rows={2}
          className="w-full mt-3 ml-0 text-sm text-ink bg-cream border border-parchment rounded-lg p-3 resize-none focus:outline-none focus:border-gold/60 placeholder:text-ink/30"
        />
      )}
    </div>
  )
}

function TextCard({
  section, n, question, why, placeholder, value, onChange,
}: {
  section: string; n: number; question: string; why: string
  placeholder: string; value: string; onChange: (v: string) => void
}) {
  return (
    <div className="bg-white border border-parchment rounded-xl p-5 mb-4 shadow-sm">
      <div className="flex gap-2 items-start mb-2">
        <span className="shrink-0 text-xs font-bold text-gold bg-gold/10 px-2 py-0.5 rounded mt-0.5">
          {section} Q{n}
        </span>
        <p className="text-sm font-semibold text-ink leading-relaxed">{question}</p>
      </div>
      <p className="text-xs text-ink/50 ml-8 mb-4 leading-relaxed">
        <span className="font-semibold text-ink/60">Why we ask: </span>{why}
      </p>
      <textarea
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        rows={6}
        className="w-full text-sm text-ink bg-cream border border-parchment rounded-lg p-3 resize-none focus:outline-none focus:border-gold/60 placeholder:text-ink/30 leading-relaxed"
      />
    </div>
  )
}

function CheckboxCard({
  section, n, question, why, options, value, notes, onToggle, onNotes,
}: {
  section: string; n: number; question: string; why: string
  options: string[]; value: string[]; notes: string
  onToggle: (opt: string) => void; onNotes: (v: string) => void
}) {
  return (
    <div className="bg-white border border-parchment rounded-xl p-5 mb-4 shadow-sm">
      <div className="flex gap-2 items-start mb-2">
        <span className="shrink-0 text-xs font-bold text-gold bg-gold/10 px-2 py-0.5 rounded mt-0.5">
          {section} Q{n}
        </span>
        <p className="text-sm font-semibold text-ink leading-relaxed">{question}</p>
      </div>
      <p className="text-xs text-ink/50 ml-8 mb-4 leading-relaxed">
        <span className="font-semibold text-ink/60">Why we ask: </span>{why}
      </p>
      <p className="text-xs text-ink/40 ml-8 mb-2 italic">Select all that apply.</p>
      <div className="flex flex-col gap-2 ml-8">
        {options.map(opt => (
          <button
            key={opt}
            onClick={() => onToggle(opt)}
            className={`text-left px-4 py-2.5 rounded-lg text-sm border transition-all ${
              value.includes(opt)
                ? 'bg-ink text-cream border-ink'
                : 'border-parchment text-ink bg-white hover:border-ink/30 hover:bg-cream/50'
            }`}
          >
            {value.includes(opt) ? '✓  ' : ''}{opt}
          </button>
        ))}
      </div>
      <textarea
        value={notes}
        onChange={e => onNotes(e.target.value)}
        placeholder="Additional notes (e.g. how many influencer links, whether it's been deactivated before)..."
        rows={2}
        className="w-full mt-3 text-sm text-ink bg-cream border border-parchment rounded-lg p-3 resize-none focus:outline-none focus:border-gold/60 placeholder:text-ink/30"
      />
    </div>
  )
}

function Divider() {
  return <div className="h-px bg-parchment my-10" />
}

// ─── Main Page ───────────────────────────────────────────────────────────────

export default function InheritedForm() {
  const [form, setForm] = useState<FormData>(INITIAL)
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')

  const assumptionsRef = useRef<HTMLDivElement>(null)
  const economicsRef = useRef<HTMLDivElement>(null)
  const operationsRef = useRef<HTMLDivElement>(null)
  const customersRef = useRef<HTMLDivElement>(null)
  const productRef = useRef<HTMLDivElement>(null)

  const set = <K extends keyof FormData>(key: K, val: FormData[K]) =>
    setForm(prev => ({ ...prev, [key]: val }))

  const toggle = (opt: string) =>
    setForm(prev => ({
      ...prev,
      s7q3: prev.s7q3.includes(opt)
        ? prev.s7q3.filter(v => v !== opt)
        : [...prev.s7q3, opt],
    }))

  const scrollTo = (ref: React.RefObject<HTMLDivElement | null>) =>
    ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })

  const handleSubmit = async () => {
    setStatus('submitting')
    try {
      const payload = { ...form, s7q3: form.s7q3.join(', ') }
      const res = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (res.ok) setStatus('success')
      else setStatus('error')
    } catch {
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <main className="min-h-screen bg-cream flex items-center justify-center p-6">
        <div className="max-w-md text-center">
          <div className="w-14 h-14 rounded-full bg-ink/10 flex items-center justify-center mx-auto mb-5">
            <svg className="w-7 h-7 text-ink" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="font-serif text-2xl text-ink font-bold mb-3">Responses saved.</h1>
          <p className="text-sm text-ink/60 leading-relaxed mb-6">
            Thank you. Aletheia AI will process your answers and return an updated growth plan
            within 24 hours — with all projections, email timings, subscription pricing, and
            website recommendation recalculated based on your actual numbers.
          </p>
          <p className="text-xs text-ink/30">You may close this page.</p>
        </div>
      </main>
    )
  }

  const NAV = [
    { label: 'Assumptions', ref: assumptionsRef },
    { label: 'Unit Economics', ref: economicsRef },
    { label: 'Operations', ref: operationsRef },
    { label: 'Customers', ref: customersRef },
    { label: 'Product', ref: productRef },
  ]

  const ASSUMPTIONS = [
    {
      code: 'A1', field: 'a1' as const, notesField: 'a1_notes' as const,
      statement: 'The Deep Nourishing Cream (DNC) is a 50g jar and the average customer uses approximately 0.5g per application once or twice daily, making each jar last roughly 90–100 days.',
      impact: 'The entire replenishment email timing (Day 80–95 trigger) is built on this consumption rate. If the jar lasts 60 days or 150 days, the trigger date changes completely.',
    },
    {
      code: 'A2', field: 'a2' as const, notesField: 'a2_notes' as const,
      statement: 'The gross margin on DNC and Radiance Serum is between 60–70% of retail price (COGS approximately £7.50–£10 per unit at £24.99 RRP).',
      impact: 'All EBITDA improvement estimates assume this margin range. If COGS is higher, subscription discounts may erode margin rather than improve LTV.',
    },
    {
      code: 'A3', field: 'a3' as const, notesField: 'a3_notes' as const,
      statement: 'GLOW10 is embedded in always-on channels — influencer bio links, welcome email, or ad landing pages — reaching new customers before their first purchase.',
      impact: "If GLOW10 is actually a loyalty-only code, removing it doesn't affect new customer conversion. The WELCOME10 replacement strategy would be wrong.",
    },
    {
      code: 'A4', field: 'a4' as const, notesField: 'a4_notes' as const,
      statement: 'The Jivita Ayurveda account is a retail stockist reselling to end customers, not a personal bulk buyer.',
      impact: 'If Jivita is a personal buyer, the 53% discount reflects a loyal high-volume customer. The renegotiation approach would be inappropriate.',
    },
    {
      code: 'A5', field: 'a5' as const, notesField: 'a5_notes' as const,
      statement: 'The 21% of orders with different billing and shipping names represent genuine gifts, not billing address errors or corporate orders.',
      impact: 'The entire gift-to-referral flywheel plan depends on this. If most are address mismatches, the gifting lever is much smaller than modelled.',
    },
    {
      code: 'A6', field: 'a6' as const, notesField: 'a6_notes' as const,
      statement: 'The business handles fulfilment in-house and capacity exists to fulfil a 30–40% volume increase without additional resource.',
      impact: 'If capacity is at its limit, the 10-day sprint (30–50 additional orders quickly) would create a fulfilment crisis.',
    },
    {
      code: 'A7', field: 'a7' as const, notesField: 'a7_notes' as const,
      statement: "Source channel '3890849' is a Shopify app rather than a manual source tag.",
      impact: 'If this is a specific referral partner or influencer, the strategy to scale it changes entirely.',
    },
    {
      code: 'A8', field: 'a8' as const, notesField: 'a8_notes' as const,
      statement: 'Subscription as a purchase model is not yet live on the website — customers repurchase manually.',
      impact: 'If a subscription app is already installed, the Day-2 sprint action is complete. Focus shifts immediately to the email sequence.',
    },
    {
      code: 'A9', field: 'a9' as const, notesField: 'a9_notes' as const,
      statement: 'The 4.98-star review base across 65 reviews is unfiltered — Judge.me sends invitations to all customers.',
      impact: 'If reviews are gated, the NPS signal is inflated and the quality interpretation is less reliable.',
    },
    {
      code: 'A10', field: 'a10' as const, notesField: 'a10_notes' as const,
      statement: 'Black Friday and seasonal discount codes are run once per year and are not currently active outside their window.',
      impact: 'If any seasonal code is currently live, the effective discount rate is higher than 48.7% and EBITDA analysis is understated.',
    },
  ]

  return (
    <main className="min-h-screen bg-cream">

      {/* ── Header ── */}
      <header className="bg-ink text-cream px-6 py-10">
        <div className="max-w-3xl mx-auto">
          <div className="text-xs font-bold tracking-widest text-gold uppercase mb-3">
            Powered by Aletheia AI · aletheiaai.in
          </div>
          <h1 className="font-serif text-3xl md:text-4xl font-bold mb-2 leading-tight">
            INHERITED · LEELA SKINCARE
          </h1>
          <p className="text-cream/70 text-base">Founder Intelligence Brief — Response Form</p>
          <p className="text-cream/40 text-xs mt-4 leading-relaxed max-w-xl">
            35 questions across 5 sections. Fill in what you know — partial answers are fine.
            Your responses update the growth plan, website recommendation, and 10-day sprint.
          </p>
          <PageTabs />
        </div>
      </header>

      {/* ── Sticky Nav ── */}
      <nav className="sticky top-0 z-40 bg-white border-b-2 border-parchment shadow-sm">
        <div className="max-w-3xl mx-auto px-4 overflow-x-auto">
          <div className="flex gap-1 py-2 min-w-max">
            {NAV.map(({ label, ref }) => (
              <button
                key={label}
                onClick={() => scrollTo(ref)}
                className="text-xs font-semibold text-ink/50 hover:text-ink px-3 py-1.5 rounded hover:bg-cream transition-all whitespace-nowrap"
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* ── Body ── */}
      <div className="max-w-3xl mx-auto px-4 py-10">

        {/* Section 1: Assumptions */}
        <div ref={assumptionsRef} className="scroll-mt-14">
          <SectionHeader
            num="1"
            title="Data-Derived Assumptions"
            desc="Every finding rests on assumptions from your order data and customer reviews. Mark each TRUE, FALSE, or PARTIALLY TRUE. Notes appear automatically for anything that needs correction."
          />
          {ASSUMPTIONS.map(a => (
            <AssumptionCard
              key={a.code}
              code={a.code}
              statement={a.statement}
              impact={a.impact}
              value={form[a.field]}
              notes={form[a.notesField]}
              onVerdict={v => set(a.field, v)}
              onNotes={n => set(a.notesField, n)}
            />
          ))}
        </div>

        <Divider />

        {/* Section 5: Unit Economics */}
        <div ref={economicsRef} className="scroll-mt-14">
          <SectionHeader
            num="5"
            title="Founder Questions — Unit Economics"
            desc="These determine the actual margin profile and will directly change the revenue projections, discount reduction strategy, and subscription pricing model."
          />

          <TextCard
            section="5" n={1}
            question="What is the COGS per unit for DNC, Radiance Serum, and Overnight Rejuvenation Cream? Include raw material cost, packaging, and contract manufacturing fees."
            why="The EBITDA model assumes 60–70% gross margin. If COGS is higher, subscription discounts of 15–20% may erode margin rather than improve LTV."
            placeholder={`DNC 50g: £___ per unit
  Raw materials: £___
  Packaging: £___
  Contract manufacturing: £___

Radiance Serum: £___ per unit
  Raw materials: £___
  Packaging: £___
  Contract manufacturing: £___

ORC: £___ per unit
  Raw materials: £___
  Packaging: £___
  Contract manufacturing: £___`}
            value={form.s5q1}
            onChange={v => set('s5q1', v)}
          />

          <TextCard
            section="5" n={2}
            question="What is the current average shipping cost per order — broken down by standard UK, free-shipping over £70, and international?"
            why="Shipping cost is a direct EBITDA drag. The subscription's free shipping at Single tier may create a negative contribution margin at low AOV."
            placeholder={`Standard UK delivery: £___ per order
Free shipping (orders over £70): £___ actual cost to you
International shipping: £___ per order (countries you currently ship to: ___)`}
            value={form.s5q2}
            onChange={v => set('s5q2', v)}
          />

          <MCQCard
            section="5" n={3}
            question="Does the £70 free shipping threshold currently cover actual shipping cost, or is it a partial/full margin subsidy?"
            why="If free shipping over £70 is subsidised, the subscription's free shipping at lower order values increases that subsidy further."
            options={[
              'Covers actual shipping cost fully',
              'Partial subsidy — covers some but not all',
              'Full margin subsidy — we absorb the entire shipping cost',
            ]}
            value={form.s5q3}
            onSelect={v => set('s5q3', v)}
          />

          <TextCard
            section="5" n={4}
            question="What is the contribution margin per order after COGS, packaging, shipping, Shopify payment fees (~1.5–2%), and any fulfilment labour?"
            why="Contribution margin is the number that subscription, discount, and acquisition economics are all built on."
            placeholder={`Typical order value: £___
Less COGS: £___
Less packaging: £___
Less shipping: £___
Less Shopify fees (~1.5–2%): £___
Less fulfilment labour: £___
= Contribution margin: £___ (___% of order value)`}
            value={form.s5q4}
            onChange={v => set('s5q4', v)}
          />

          <MCQCard
            section="5" n={5}
            question="Are there any MOQs from ingredient or packaging suppliers that create constraints when order volume increases 30–50%?"
            why="A demand spike from the sprint without ingredient stock creates a stockout at the worst possible moment — a returning customer."
            options={[
              'No constraints — can easily 2× current volume',
              'Yes — ingredient MOQ is a constraint',
              'Yes — packaging MOQ is a constraint',
              'Both ingredients and packaging have MOQ constraints',
            ]}
            value={form.s5q5}
            notes={form.s5q5_notes}
            showNotes
            onSelect={v => set('s5q5', v)}
            onNotes={v => set('s5q5_notes', v)}
          />

          <TextCard
            section="5" n={6}
            question="What is the current retail price of each SKU and have any prices changed in the last 12 months? If so, why?"
            why="ORC at £34.99 may be underpriced. Price history tells us whether elasticity data already exists."
            placeholder={`DNC 50g: £___ (unchanged / changed from £___ on ___, reason: ___)
Radiance Serum: £___ (unchanged / changed from £___ on ___, reason: ___)
ORC: £___ (unchanged / changed from £___ on ___, reason: ___)
Cleansing Balm: £___ (unchanged / changed from £___ on ___, reason: ___)`}
            value={form.s5q6}
            onChange={v => set('s5q6', v)}
          />

          <MCQCard
            section="5" n={7}
            question="Is Jivita Ayurveda purchasing at a formally agreed wholesale price, or has the discount been negotiated case-by-case?"
            why="Order data shows 53% effective discount. Formal agreement vs informal arrangement changes the renegotiation approach entirely."
            options={[
              'Formal written wholesale agreement',
              'Informal verbal arrangement, negotiated case-by-case',
              'No formal agreement — discount applied manually per order',
              'Not sure / not my area',
            ]}
            value={form.s5q7}
            onSelect={v => set('s5q7', v)}
          />
        </div>

        <Divider />

        {/* Section 6: Operations */}
        <div ref={operationsRef} className="scroll-mt-14">
          <SectionHeader
            num="6"
            title="Founder Questions — Operations & Fulfilment"
            desc="These determine what is feasible in the 10-day sprint and what requires sequencing to avoid operational failure."
          />

          <MCQCard
            section="6" n={1}
            question="Who currently handles picking, packing, and dispatching — and what is the maximum orders per day without additional resource?"
            why="The replenishment email on Day 1 of the sprint could generate 18–30 orders within 48 hours. Below 10/day capacity, the sprint must be staged."
            options={[
              'Founder only',
              'Founder + 1 other person',
              'Small team of 3 or more',
            ]}
            value={form.s6q1}
            notes={form.s6q1_notes}
            showNotes
            onSelect={v => set('s6q1', v)}
            onNotes={v => set('s6q1_notes', v)}
          />

          <MCQCard
            section="6" n={2}
            question="What courier is used for UK standard delivery and what is the average transit time?"
            why="'Dispatched same day' (median 0 days in data) is a genuine competitive advantage. Confirming the courier allows 'same day dispatch, next day delivery' as a verified marketing claim."
            options={[
              'Royal Mail',
              'Evri',
              'DPD',
              'Other courier',
            ]}
            value={form.s6q2}
            notes={form.s6q2_notes}
            showNotes
            onSelect={v => set('s6q2', v)}
            onNotes={v => set('s6q2_notes', v)}
          />

          <MCQCard
            section="6" n={3}
            question="Are products manufactured in batches? If so, what is the typical batch size and lead time?"
            why="A subscription model generating 104 recurring orders every 8 weeks requires a production plan running ahead of demand."
            options={[
              'Yes, manufactured in batches',
              'Made to order / on demand',
            ]}
            value={form.s6q3}
            notes={form.s6q3_notes}
            showNotes
            onSelect={v => set('s6q3', v)}
            onNotes={v => set('s6q3_notes', v)}
          />

          <MCQCard
            section="6" n={4}
            question="Is there an inventory management system in place, or is stock tracked manually? How many units of each SKU are currently in stock?"
            why="Current stock levels determine whether the sprint can run immediately or needs staging around a production cycle."
            options={[
              'Shopify inventory tracking',
              'Separate inventory system (e.g. Linnworks, Brightpearl)',
              'Manual / spreadsheet',
            ]}
            value={form.s6q4}
            notes={form.s6q4_notes}
            showNotes
            onSelect={v => set('s6q4', v)}
            onNotes={v => set('s6q4_notes', v)}
          />

          <MCQCard
            section="6" n={5}
            question="What email service provider (ESP) is connected to Shopify — and are any automated flows currently active?"
            why="The entire retention plan runs through the ESP. If Klaviyo is connected, setup time is 1–2 days. No ESP means selecting one is the first sprint task."
            options={[
              'Klaviyo',
              'Mailchimp',
              'Omnisend',
              'Shopify Email (native)',
              'Other ESP',
              'No ESP connected',
            ]}
            value={form.s6q5}
            notes={form.s6q5_notes}
            showNotes
            onSelect={v => set('s6q5', v)}
            onNotes={v => set('s6q5_notes', v)}
          />

          <MCQCard
            section="6" n={6}
            question="Is there a subscription app currently installed on Shopify? If yes, which one?"
            why="Assumption A8 assumes subscription is not yet live. If already installed, Day-2 sprint action is complete — focus shifts to the email sequence."
            options={[
              'Yes — Recharge',
              'Yes — Bold Subscriptions',
              'Yes — Loop Subscriptions',
              'Yes — Shopify Subscriptions (native)',
              'Yes — other subscription app',
              'No subscription app installed',
            ]}
            value={form.s6q6}
            onSelect={v => set('s6q6', v)}
          />
        </div>

        <Divider />

        {/* Section 7: Customers */}
        <div ref={customersRef} className="scroll-mt-14">
          <SectionHeader
            num="7"
            title="Founder Questions — Customers & Channels"
            desc="These reveal which acquisition sources are intentional versus accidental, and where the highest-quality customers come from."
          />

          <MCQCard
            section="7" n={1}
            question="The Shopify source ID '3890849' appears on 15 orders and produces customers with only 6.7% discount rate vs 48.5% on web. Do you know what this source represents?"
            why="This is the single highest-quality customer channel in the data. Identifying it unlocks intentional scaling."
            options={[
              "Yes — it's a loyalty / rewards app",
              "Yes — it's an influencer or creator",
              "Yes — it's an affiliate platform",
              "Yes — it's a specific Shopify app (name in notes)",
              "I'm not sure what this source is",
            ]}
            value={form.s7q1}
            notes={form.s7q1_notes}
            showNotes
            onSelect={v => set('s7q1', v)}
            onNotes={v => set('s7q1_notes', v)}
          />

          <MCQCard
            section="7" n={2}
            question="What is the primary channel for new customer acquisition — and is it intentional or organic?"
            why="The website strategy (Website A vs Website B) is determined primarily by the answer to this question."
            options={[
              'Google search (intentional SEO or paid)',
              'Instagram organic posts / reels',
              'Word of mouth / personal recommendation',
              'Influencer mentions or gifting',
              'Paid social (Facebook / Instagram ads)',
              'Other channel',
            ]}
            value={form.s7q2}
            notes={form.s7q2_notes}
            showNotes
            onSelect={v => set('s7q2', v)}
            onNotes={v => set('s7q2_notes', v)}
          />

          <CheckboxCard
            section="7" n={3}
            question="GLOW10 has been used 125 times. Where is it currently embedded?"
            why="The replacement strategy only makes sense if GLOW10 is reachable and removable without breaking 50+ influencer links."
            options={[
              'Welcome email (sent to new subscribers)',
              'Influencer bio links',
              'Our own social media bio',
              'Ad landing pages',
              'Other location',
            ]}
            value={form.s7q3}
            notes={form.s7q3_notes}
            onToggle={toggle}
            onNotes={v => set('s7q3_notes', v)}
          />

          <MCQCard
            section="7" n={4}
            question="What percentage of new customers arrive via recommendation from an existing customer versus independently?"
            why="If referral is above 30%, the gift-to-referral flywheel amplifies a strong existing signal. Below 10%, the infrastructure needs building first."
            options={[
              'Under 10%',
              '10–30%',
              '30–50%',
              'Over 50%',
              "I don't track this / not sure",
            ]}
            value={form.s7q4}
            onSelect={v => set('s7q4', v)}
          />

          <MCQCard
            section="7" n={5}
            question="Gerald Mousset (Ayurvedic Facialist, The Life Center, Notting Hill) appears in two reviews two years apart, now on his 3rd bottle. Have you had contact with him?"
            why="If Gerald is already a known relationship, formalising it is a 30-minute conversation. If unknown, the outreach letter needs to be warmer."
            options={[
              "Yes, I know him / we've been in touch",
              'No, but I can reach out — I will contact him',
              "I've seen his reviews but haven't made contact yet",
            ]}
            value={form.s7q5}
            onSelect={v => set('s7q5', v)}
          />

          <MCQCard
            section="7" n={6}
            question="Are there any wholesale or retail stockist relationships beyond Jivita Ayurveda — even informal ones?"
            why="Additional wholesale accounts at similar discount levels means the EBITDA drag is larger than modelled."
            options={[
              'None beyond Jivita',
              '1–2 informal stockists or wholesale accounts',
              '3 or more accounts',
            ]}
            value={form.s7q6}
            notes={form.s7q6_notes}
            showNotes
            onSelect={v => set('s7q6', v)}
            onNotes={v => set('s7q6_notes', v)}
          />
        </div>

        <Divider />

        {/* Section 8: Product */}
        <div ref={productRef} className="scroll-mt-14">
          <SectionHeader
            num="8"
            title="Founder Questions — Product & Roadmap"
            desc="These determine which SKUs to prioritise, what the subscription catalogue should contain, and what product changes would most improve LTV."
          />

          <MCQCard
            section="8" n={1}
            question="For DNC specifically: is 50g the only size available, or is a larger (100g or 150g) economy size feasible? Customer reviews explicitly request larger sizes."
            why="A larger size unlocks the Family subscription tier. At 100g, the reorder interval doubles — reducing operational overhead while maintaining the subscription."
            options={[
              'Yes, a 100g size is feasible',
              'Yes, a 150g size is feasible',
              'Both 100g and 150g are feasible',
              'Not feasible currently (supply or cost constraints)',
              'Already tested a larger size — no customer demand',
            ]}
            value={form.s8q1}
            onSelect={v => set('s8q1', v)}
          />

          <MCQCard
            section="8" n={2}
            question="Are there SKUs currently in development or planned for launch in the next 6 months?"
            why="New SKU launches should be sequenced for maximum cross-sell impact. A Day-30 email introducing a new product to DNC buyers is the highest-ROI launch strategy."
            options={[
              'Yes — launching within 1–3 months',
              'Yes — launching within 3–6 months',
              'No new SKUs planned',
              'Actively developing but no timeline yet',
            ]}
            value={form.s8q2}
            notes={form.s8q2_notes}
            showNotes
            onSelect={v => set('s8q2', v)}
            onNotes={v => set('s8q2_notes', v)}
          />

          <MCQCard
            section="8" n={3}
            question="Is the Ghee & Oat Cleansing Balm positioned as a deliberate entry-level gateway product, or treated equally in marketing spend?"
            why="Order data shows CB consistently cross-sells into DNC and RS. If intentionally a gateway, the two-brand architecture is a deliberate funnel."
            options={[
              'Intentional gateway — leads customers into DNC and RS',
              'Treated equally in marketing spend',
              'Currently given less marketing attention than DNC/RS',
              'No clear strategy — it sells organically',
            ]}
            value={form.s8q3}
            onSelect={v => set('s8q3', v)}
          />

          <MCQCard
            section="8" n={4}
            question="What is the relationship between Inherited Skincare and Leela Skincare? Is there a plan to merge, keep separate, or differentiate further?"
            why="The two-brand structure creates operational overhead and customer confusion. If they will merge, website design converges. If separate, each needs its own strategy."
            options={[
              'Plan to merge into one brand eventually',
              'Keeping permanently separate',
              'Actively differentiating further (distinct audiences)',
              'Undecided — open to strategy input',
            ]}
            value={form.s8q4}
            onSelect={v => set('s8q4', v)}
          />

          <MCQCard
            section="8" n={5}
            question="Have you run any price tests on any SKU — increasing or decreasing — and if so, what was the result?"
            why="ORC at £34.99 may be underpriced. If no test has been run, a £39.99 test at current volumes would generate ~£660 additional annual revenue."
            options={[
              'Yes — tested a price increase',
              'Yes — tested a price decrease',
              'No price tests run',
              'Planning to test pricing soon',
            ]}
            value={form.s8q5}
            notes={form.s8q5_notes}
            showNotes
            onSelect={v => set('s8q5', v)}
            onNotes={v => set('s8q5_notes', v)}
          />

          <TextCard
            section="8" n={6}
            question="Is there customer feedback NOT captured in Judge.me — complaints, packaging feedback, or format requests from DMs or support tickets?"
            why="Silent dissatisfied customers may be a significant portion of the 71% who never repurchase. Direct feedback is the only way to identify issues invisible in order data."
            placeholder={`Common complaints (if any):

Packaging feedback:

Format or size requests:

Other feedback not visible in reviews:`}
            value={form.s8q6}
            onChange={v => set('s8q6', v)}
          />
        </div>

        {/* ── Submit ── */}
        <div className="mt-12 pt-8 border-t-2 border-parchment">
          {status === 'error' && (
            <div className="mb-5 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">
              Something went wrong saving your responses. Please try again.
            </div>
          )}
          <p className="text-xs text-ink/40 mb-5 leading-relaxed max-w-md">
            Your responses are saved securely and used only to update your growth plan.
            Aletheia AI will return an updated plan within 24 hours.
          </p>
          <button
            onClick={handleSubmit}
            disabled={status === 'submitting'}
            className="w-full sm:w-auto bg-ink text-cream px-10 py-3.5 rounded-xl font-semibold text-sm hover:bg-ink/80 disabled:opacity-50 transition-all"
          >
            {status === 'submitting' ? 'Saving responses...' : 'Submit Responses →'}
          </button>
        </div>
      </div>

      {/* ── Footer ── */}
      <footer className="bg-ink text-cream/30 text-xs text-center py-6 px-4 mt-10">
        Prepared by Aletheia AI · aletheiaai.in · Confidential — not for distribution
      </footer>
    </main>
  )
}
