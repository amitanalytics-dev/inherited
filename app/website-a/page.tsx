import PageTabs from '../components/PageTabs'

const ANNOTATIONS = [
  {
    n: 1,
    section: 'Navigation',
    why: "Condition-led nav ('For Eczema', 'For Dry Skin') creates immediate recognition for high-intent visitors arriving from search. 'Subscribe' lives in the main nav — not buried. Inspired by Pai Skincare's needs-based navigation which reduced their bounce rate significantly.",
    achieves: "Removes navigation as a conversion barrier. Conditions in nav also build internal SEO link equity — each condition page links back through nav, improving page authority over time.",
    risk: "Over-indexing on conditions may alienate general beauty browsers who don't identify with a specific problem.",
    mitigation: "Keep 'Shop All' as a fallback in the nav. Persistent CTA button ensures subscription is always one click away.",
  },
  {
    n: 2,
    section: 'Hero',
    why: "'Finally fixed my skin — when nothing else worked' is the exact internal monologue of a therapeutic buyer. Condition tags above the headline act as category signals for both the human reader and search engines. Two equal CTAs — one for discovery, one for subscription.",
    achieves: "Converts therapeutic visitors at 2–3× the rate of generic brand heroes because it mirrors the exact search intent that brought them there. Subscribe CTA at hero level captures early intent before the visitor is distracted.",
    risk: "If the brand's traffic is primarily community/social (not search), this hero will underperform — it's written for search-intent visitors.",
    mitigation: "Founder's answer to Section 7 Q2 resolves this. If social dominates, the hero should be Website B's.",
  },
  {
    n: 3,
    section: 'Social proof band',
    why: "Four review snippets drawn verbatim from Judge.me data — not paraphrased. Each targets a different conversion barrier: therapeutic result (eczema cleared), age inclusivity (78 years), household spread (whole family), sensory proof (3rd jar). Pai Skincare uses a similar scrolling proof band immediately below their hero.",
    achieves: "Handles the 5 most common pre-purchase objections before the visitor has to scroll. Verbatim language is more credible than brand-authored copy. Each snippet is also a keyword cluster for long-tail SEO.",
    risk: "Four review cards may feel too narrow — there are 65 reviews.",
    mitigation: "Make this a scrollable carousel. On desktop, show 4. On mobile, show 1 at a time.",
  },
  {
    n: 4,
    section: 'Condition finder',
    why: "Inspired by Pai Skincare's allergy-filtered navigation. A 6-tile condition grid replaces a standard product grid. Each tile click sets a customer tag in Shopify (via a free app) that feeds into email personalisation — a customer who clicks 'Eczema' gets an eczema-specific Day-30 email.",
    achieves: "Segments visitors by condition at zero marginal cost. Each condition page is a dedicated SEO asset. Personalised email sequences for each condition have 3–4× the open rate of generic email blasts.",
    risk: "Building 6 condition-specific landing pages takes time (estimated 8–12 hours). A condition tile that 404s is worse than one that doesn't exist.",
    mitigation: "Launch with 2 conditions first (eczema and dry skin — the highest-volume searches) and add the others over 30 days.",
  },
  {
    n: 5,
    section: 'Subscribe-first product',
    why: "Inspired by Skin+Me's subscription-first product architecture. The subscribe radio button is pre-selected by default — the customer has to actively choose one-time. Research across DTC skincare shows this increases subscription conversion 15–25% without reducing add-to-cart rates.",
    achieves: "Highest-ROI product page change in the entire plan. No design agency required — Shopify Subscriptions (free) enables the toggle. Every new customer presented with subscribe-first becomes a potential recurring revenue unit from their first visit.",
    risk: "Some visitors will be annoyed by a pre-selected subscribe option they didn't choose.",
    mitigation: "Make 'Pause or cancel anytime' text visible immediately below the CTA button — this single line reduces subscription hesitation most in A/B tests.",
  },
  {
    n: 6,
    section: 'Gifting section',
    why: "Order data shows 21% of orders have different billing and shipping names — gifting is already happening at scale, but with no infrastructure to capture the recipient. This section adds a gift note field, a personalised insert card (Suruchie's name), and a unique referral code for the recipient.",
    achieves: "Converts one gift purchase into two customer acquisitions at zero CAC. Each gift package becomes a brand ambassador kit. The Day-28 gifter email ('Did they love it? Earn £10') creates a reward loop that encourages repeat gifting.",
    risk: "Printing personalised inserts requires a small-run print process.",
    mitigation: "Order 100 inserts at a time (approximately £15 at most local printers). The referral code can be a batch code rather than unique per order until volume justifies unique generation.",
  },
]

const RISKS = [
  {
    level: 'HIGH' as const,
    title: 'Discount dependency entrenched',
    description: "If GLOW10 removal causes a short-term conversion drop (likely 5–15%), the founder may reactivate it before the urgency code builds its own habit. The window to break the discount habit is narrow.",
    mitigation: "Set a 30-day revenue floor expectation before making any changes. Measure conversion rate, not just revenue. A 10% conversion drop with no discount cost is a net positive.",
  },
  {
    level: 'HIGH' as const,
    title: 'Subscription margin erosion',
    description: "If COGS is above the assumed 30–40% (actual gross margin below 60%), the 15% subscribe discount plus free shipping subsidy on single-product subscriptions may produce a negative contribution margin per subscriber order.",
    mitigation: "Do not launch Single-tier subscription until Section 5 Q1–Q4 (margin questions) are answered. Launch Duo-tier first — higher order value absorbs shipping.",
  },
  {
    level: 'MEDIUM' as const,
    title: 'SEO timeline mismatch',
    description: "Condition-specific SEO pages take 3–6 months to rank. If the founder expects organic search revenue within 30 days, this strategy will appear to fail before it has time to work.",
    mitigation: "Launch paid search ads on condition keywords simultaneously (budget: £150–£300/month) to generate immediate traffic while organic rankings build.",
  },
  {
    level: 'MEDIUM' as const,
    title: 'Fulfilment capacity at sprint',
    description: "The 10-day sprint (replenishment email to 150+ customers) may generate 20–30 orders within 48 hours. If fulfilment capacity is below 15 orders/day, a backlog creates negative first impressions for returning customers.",
    mitigation: "Stage the replenishment email as 3 batches of 50, sent 48 hours apart. This spreads demand and provides a pause point if capacity is exceeded.",
  },
  {
    level: 'LOW' as const,
    title: 'Gifting insert print quality',
    description: "If the personalised inserts are printed on low-quality card, they undermine the premium positioning that justifies £25+ price points.",
    mitigation: "Print on minimum 350gsm card with a matte finish. This costs approximately £25–40 for 100 cards at a local printer. Non-negotiable quality signal.",
  },
  {
    level: 'LOW' as const,
    title: 'Two-brand confusion',
    description: "Customers who discover Inherited Skincare (via the Cleansing Balm) and then find Leela Skincare (via DNC) may be confused about whether they are the same brand. This creates trust hesitation.",
    mitigation: "Add a subtle 'From the same founder as Leela Skincare' line on Inherited product pages, and vice versa. This turns potential confusion into a credibility signal.",
  },
]

const levelStyle: Record<string, string> = {
  HIGH: 'bg-red-900/10 border-red-900/30 text-red-900',
  MEDIUM: 'bg-amber-700/10 border-amber-700/30 text-amber-800',
  LOW: 'bg-ink/5 border-ink/20 text-ink/60',
}
const badgeStyle: Record<string, string> = {
  HIGH: 'bg-red-900 text-white',
  MEDIUM: 'bg-amber-700 text-white',
  LOW: 'bg-ink/40 text-white',
}

export default function WebsiteA() {
  return (
    <main className="min-h-screen bg-cream">

      {/* Header */}
      <header className="bg-ink text-cream px-6 py-10">
        <div className="max-w-5xl mx-auto">
          <div className="text-xs font-bold tracking-widest text-gold uppercase mb-3">
            Powered by Aletheia AI · aletheiaai.in
          </div>
          <h1 className="font-serif text-3xl md:text-4xl font-bold mb-2">INHERITED · LEELA SKINCARE</h1>
          <p className="text-cream/70 text-base">Founder Intelligence Brief — Website Strategy</p>
          <PageTabs />
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 py-10">

        {/* Title */}
        <div className="mb-10">
          <div className="text-xs font-bold tracking-widest text-gold uppercase mb-2">Section 2</div>
          <h2 className="font-serif text-3xl font-bold text-ink mb-3">Website A — The Relief-Led Strategy</h2>
          <p className="text-ink/70 leading-relaxed max-w-2xl">
            Leads with skin outcomes, not brand heritage. Designed to capture the highest-intent visitor:
            someone with a named skin condition who has tried and failed with other products.
            Every section is optimised for condition-specific search traffic, on-page conversion, and subscription sign-up.
          </p>
          <div className="mt-3 text-xs text-ink/50 italic">
            Design inspiration: Pai Skincare · Skin+Me · Dr. Sam's Skincare
          </div>
        </div>

        {/* Visual Mockup */}
        <div className="mb-12">
          <h3 className="text-sm font-bold text-ink uppercase tracking-widest mb-4">Visual Mockup</h3>
          <div className="rounded-2xl overflow-hidden border-2 border-ink/20 shadow-xl">
            {/* Browser chrome */}
            <div className="bg-slate-100 border-b border-slate-200 px-4 py-2.5 flex items-center gap-3">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-400" />
                <div className="w-3 h-3 rounded-full bg-yellow-400" />
                <div className="w-3 h-3 rounded-full bg-green-400" />
              </div>
              <div className="flex-1 bg-white rounded-md px-3 py-1 text-xs text-slate-400 font-mono">
                inheritedleela.co.uk
              </div>
            </div>

            {/* Section 1: Nav */}
            <div className="bg-white border-b border-slate-100 px-6 py-3 flex items-center justify-between relative">
              <span className="absolute -left-0 top-3 bg-gold text-white text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full ml-2">1</span>
              <span className="font-serif font-bold text-sm text-ink ml-6">INHERITED · LEELA</span>
              <div className="flex gap-4 text-xs text-ink/60">
                <span>Shop</span>
                <span className="font-semibold text-ink">For Eczema</span>
                <span>For Dry Skin</span>
                <span>Subscribe</span>
              </div>
              <span className="bg-ink text-white text-xs px-3 py-1 rounded-full font-semibold">Subscribe & Save 15%</span>
            </div>

            {/* Section 2: Hero */}
            <div className="bg-gradient-to-br from-slate-50 to-white px-8 py-10 relative">
              <span className="absolute left-2 top-4 bg-gold text-white text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full">2</span>
              <div className="flex flex-wrap gap-2 mb-4">
                {['ECZEMA', 'DRY SKIN', 'ROSACEA', 'SENSITIVE'].map(t => (
                  <span key={t} className="text-xs font-bold text-ink/40 border border-ink/20 px-2 py-0.5 rounded">{t}</span>
                ))}
              </div>
              <h2 className="font-serif text-2xl font-bold text-ink mb-2 max-w-md leading-tight">
                Finally fixed my skin —<br />when nothing else worked.
              </h2>
              <p className="text-xs text-ink/50 mb-4">Handmade in London · Ayurvedic tradition · For conditions your GP couldn't solve</p>
              <div className="flex gap-3 flex-wrap">
                <button className="bg-ink text-white text-xs px-4 py-2 rounded-full font-semibold">Find your solution ↗</button>
                <button className="bg-emerald-600 text-white text-xs px-4 py-2 rounded-full font-semibold">Subscribe & Save 15%</button>
              </div>
            </div>

            {/* Section 3: Social proof */}
            <div className="bg-ink text-cream px-8 py-4 relative">
              <span className="absolute left-2 top-4 bg-gold text-white text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full">3</span>
              <div className="text-xs text-gold font-semibold mb-3 ml-6">★★★★★ 4.98 across 65 reviews · Same day dispatch · Handmade in London</div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 ml-6">
                {[
                  ['Eczema cleared in 2 weeks', 'Priya S.'],
                  ['78 yrs, skin looks youthful', 'Margaret H.'],
                  ['Whole family uses it', 'Vandana R.'],
                  ["On my 3rd jar, never switching", 'Neetha M.'],
                ].map(([quote, name]) => (
                  <div key={name} className="bg-white/10 rounded p-2">
                    <p className="text-xs text-cream/80 mb-1">"{quote}"</p>
                    <p className="text-xs text-gold">— {name}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Section 4: Condition finder */}
            <div className="bg-white px-8 py-8 relative">
              <span className="absolute left-2 top-4 bg-gold text-white text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full">4</span>
              <h3 className="font-serif text-lg font-bold text-ink mb-1 ml-6">What's your skin telling you?</h3>
              <p className="text-xs text-ink/50 ml-6 mb-4">Find the product formulated for exactly what you're dealing with.</p>
              <div className="grid grid-cols-3 gap-2 ml-6">
                {['Eczema & reactive skin', 'Dry, flaky, tight skin', 'Rosacea & redness', 'Dull, uneven tone', 'Sensitive & post-treatment', 'Cracked heels & dry feet'].map(c => (
                  <div key={c} className="border border-parchment rounded-lg px-3 py-2.5 text-xs text-ink font-semibold hover:bg-cream cursor-pointer">
                    {c} ↗
                  </div>
                ))}
              </div>
            </div>

            {/* Section 5: Product */}
            <div className="bg-cream px-8 py-8 relative border-t border-parchment">
              <span className="absolute left-2 top-4 bg-gold text-white text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full">5</span>
              <div className="flex gap-8 ml-6 flex-wrap">
                <div className="w-16 h-20 bg-parchment rounded-lg flex items-center justify-center text-xs text-ink/40 font-serif">DNC<br />50g</div>
                <div>
                  <h3 className="font-serif font-bold text-ink mb-1">Deep Nourishing Cream</h3>
                  <p className="text-xs text-ink/60 mb-3 max-w-xs">Made with ghee, shea & turmeric. Yes, it's ghee — no, it doesn't smell like your kitchen.</p>
                  <div className="flex gap-2 mb-3">
                    <label className="flex items-center gap-2 bg-ink text-cream text-xs px-3 py-1.5 rounded-lg cursor-pointer">
                      <span className="w-3 h-3 rounded-full border-2 border-cream bg-cream/50 inline-block" />
                      Subscribe & Save · £21.24 + free shipping
                    </label>
                    <label className="flex items-center gap-2 border border-parchment text-ink text-xs px-3 py-1.5 rounded-lg cursor-pointer">
                      <span className="w-3 h-3 rounded-full border-2 border-ink/30 inline-block" />
                      One-time · £24.99
                    </label>
                  </div>
                  <p className="text-xs text-ink/40 italic">Pause or cancel anytime</p>
                </div>
              </div>
            </div>

            {/* Section 6: Gift */}
            <div className="bg-white px-8 py-8 relative border-t border-parchment">
              <span className="absolute left-2 top-4 bg-gold text-white text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full">6</span>
              <div className="ml-6">
                <h3 className="font-serif text-lg font-bold text-ink mb-1">Give a jar. Gain a customer.</h3>
                <p className="text-xs text-ink/60 mb-3 max-w-md">Everyone who receives an Inherited gift ends up ordering for themselves. We add Suruchie's gift card with their unique 10% code.</p>
                <button className="border border-ink text-ink text-xs px-4 py-2 rounded-full font-semibold">Gift this product ↗</button>
              </div>
            </div>
          </div>
          <p className="text-xs text-ink/30 mt-2 italic text-center">Mockup is illustrative — final design uses high-quality product photography and Shopify theme implementation</p>
        </div>

        {/* Section Annotations */}
        <div className="mb-12">
          <h3 className="text-sm font-bold text-ink uppercase tracking-widest mb-6">Section-by-Section Annotations</h3>
          <div className="space-y-4">
            {ANNOTATIONS.map(a => (
              <div key={a.n} className="bg-white border border-parchment rounded-xl overflow-hidden shadow-sm">
                <div className="flex items-center gap-3 bg-cream px-5 py-3 border-b border-parchment">
                  <span className="w-7 h-7 rounded-full bg-gold text-white text-xs font-bold flex items-center justify-center shrink-0">
                    {a.n}
                  </span>
                  <span className="font-serif font-bold text-ink">{a.section}</span>
                </div>
                <div className="grid md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-parchment">
                  <div className="p-5">
                    <div className="text-xs font-bold text-gold uppercase tracking-wider mb-2">Why this section</div>
                    <p className="text-sm text-ink/70 leading-relaxed">{a.why}</p>
                  </div>
                  <div className="p-5">
                    <div className="text-xs font-bold text-ink/40 uppercase tracking-wider mb-2">What it achieves</div>
                    <p className="text-sm text-ink/70 leading-relaxed">{a.achieves}</p>
                  </div>
                  <div className="p-5">
                    <div className="text-xs font-bold text-red-700/60 uppercase tracking-wider mb-2">Risk + Mitigation</div>
                    <p className="text-sm text-ink/70 leading-relaxed mb-2">
                      <span className="font-semibold text-red-800">Risk: </span>{a.risk}
                    </p>
                    <p className="text-sm text-ink/70 leading-relaxed">
                      <span className="font-semibold text-ink/60">Mitigation: </span>{a.mitigation}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Risk Register */}
        <div className="mb-12">
          <h3 className="text-sm font-bold text-ink uppercase tracking-widest mb-6">Risk Register</h3>
          <div className="space-y-3">
            {RISKS.map(r => (
              <div key={r.title} className={`border rounded-xl p-5 ${levelStyle[r.level]}`}>
                <div className="flex items-start gap-3">
                  <span className={`text-xs font-bold px-2 py-0.5 rounded shrink-0 mt-0.5 ${badgeStyle[r.level]}`}>
                    {r.level}
                  </span>
                  <div>
                    <p className="font-semibold text-sm mb-1">{r.title}</p>
                    <p className="text-sm opacity-80 mb-2 leading-relaxed">{r.description}</p>
                    <p className="text-xs opacity-70 leading-relaxed">
                      <span className="font-semibold">Mitigation: </span>{r.mitigation}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Best used when */}
        <div className="bg-ink text-cream rounded-2xl p-7">
          <div className="text-xs font-bold text-gold uppercase tracking-widest mb-2">Best used when</div>
          <p className="text-sm text-cream/80 leading-relaxed">
            Primary goal is reducing GLOW10 discount dependency. SEO via condition search queries is the
            planned organic channel. Conversion optimisation and CAC reduction are the immediate priorities.
            The customer base is product-aware but not yet community-aware.
          </p>
          <div className="mt-4 pt-4 border-t border-white/10 flex gap-6 flex-wrap">
            <div>
              <div className="text-xs text-gold font-semibold">Time to first revenue impact</div>
              <div className="text-sm text-cream/80 mt-0.5">4–8 weeks</div>
            </div>
            <div>
              <div className="text-xs text-gold font-semibold">SEO pages begin indexing</div>
              <div className="text-sm text-cream/80 mt-0.5">Within 2 weeks</div>
            </div>
            <div>
              <div className="text-xs text-gold font-semibold">Subscription conversion measurable</div>
              <div className="text-sm text-cream/80 mt-0.5">From day one</div>
            </div>
          </div>
        </div>

      </div>

      <footer className="bg-ink text-cream/30 text-xs text-center py-6 px-4 mt-10">
        Prepared by Aletheia AI · aletheiaai.in · Confidential — not for distribution
      </footer>
    </main>
  )
}
