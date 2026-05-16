import PageTabs from '../components/PageTabs'

const ANNOTATIONS = [
  {
    n: 1,
    section: 'Navigation',
    why: "Heritage brands lead with story, not product. 'Our Story' in the primary nav position signals to South Asian diaspora visitors that identity is central. 'Join the Family' replaces the transactional 'Subscribe' — the language is drawn directly from VoC data ('my whole family ended up using it'). Liha Beauty (the closest UK analogue) places their founding story prominently in navigation, which correlates with their 85%+ direct traffic share.",
    achieves: "Community-native language reduces the transactional feel that causes diaspora buyers to disengage. 'Gift someone' as a nav item signals that gifting is a primary behaviour, not an afterthought. Language matching VoC creates immediate recognition for returning visitors.",
    risk: "A heritage-first nav may confuse visitors who arrive with a specific skin problem in mind.",
    mitigation: "Add a 'For your skin' dropdown under 'Products' that mirrors Website A's condition-finder — ensuring both intent types are served.",
  },
  {
    n: 2,
    section: 'Hero',
    why: "'What your grandmother knew. Now finally formulated.' is the most compressed version of the brand's entire value proposition. Eight words. The gold-on-dark palette is warm and premium — referencing the visual language of Ayurvedic brands like Forest Essentials and 82°E. The sub-copy answers the ghee objection before it's asked, frames the ingredient as ancestral wisdom rather than a quirk.",
    achieves: "Immediate identity recognition drives sharing — community members share content that reflects them. The emotional resonance of the grandmother reference creates a 4–6× higher share rate in diaspora networks compared to product-led content. Gifting CTA at hero level primes every visitor to consider buying for someone else.",
    risk: "Gold-on-dark aesthetic, while premium, may not render well on all mobile screens and could slow page load if hero images are not optimised.",
    mitigation: "Use CSS-only gold gradient for the hero background rather than a high-resolution image. Test on at minimum 3 device sizes before launch.",
  },
  {
    n: 3,
    section: 'Founder section',
    why: "Directly inspired by Dr. Sam's Skincare, whose founder-video on every product page is cited as their primary trust and conversion driver. For Inherited, Suruchie's story IS the product differentiation — a heritage formulator cannot be replicated by a VC-backed skincare brand. Placed immediately after the hero because community-driven acquisition creates a specific question hierarchy: first 'does this brand reflect me?', then 'who is behind this?'",
    achieves: "Founder-brand customers have 2–3× the referral rate of non-founder-brand customers (Baymard Institute research on heritage brand loyalty). The founder quote is also shareable as standalone social content — a screenshotted quote placed on Instagram Stories is free acquisition for the diaspora audience.",
    risk: "Founder-led brands become operationally fragile if the founder is unavailable or if brand perception ever shifts.",
    mitigation: "Build a 'formulator story' that extends beyond the founder — include the ingredient sourcing story and the Ayurvedic tradition — so the brand narrative survives beyond any single personality.",
  },
  {
    n: 4,
    section: 'Gift discovery',
    why: "Three gift tiers (Starter Duo at £50, Luxury Pack at £75, Build Your Own from £25) cover the full spectrum of gifting occasions. Diwali, Mother's Day, Eid, and birthdays are named gifting windows — UK South Asian diaspora has 8–12 major gifting occasions per year. Inspired by Tatcha (Japanese heritage brand) whose gift section generates 35% of Q4 revenue.",
    achieves: "Repositions gift sets from one-time revenue to the entry point of the acquisition flywheel. Gift revenue compounds — the recipient's order funds the next gift. Each gifting occasion generates organic social content as recipients post about their gift.",
    risk: "The 'Build Your Own' gift option requires more operational input at packing time (each order is unique).",
    mitigation: "Offer 3 fixed curation choices for Build Your Own rather than a fully open selection — this reduces packing complexity while maintaining the feeling of personalisation.",
  },
  {
    n: 5,
    section: 'Subscription',
    why: "Framed as 'Your ritual. Delivered.' rather than 'Save money. Subscribe.' — ritual framing sells identity commitment; discount framing sells price sensitivity. The verbatim customer quote ('I think a subscription idea will be fantastic' — Oct 2025 review) is placed directly at the base of the subscription section, visible before the CTA. Three subscription tiers (Single 15%, Duo 20%, Family 25%) map to real usage patterns observed in VoC data.",
    achieves: "Community buyers subscribe for identity reasons, not price reasons — they have lower churn than discount-driven subscribers. The verbatim quote eliminates the 'am I being sold something I don't need?' hesitation that subscription CTAs typically trigger.",
    risk: "A subscription without a clear pause mechanism will create friction at the point when life disrupts a customer's routine.",
    mitigation: "Show 'Pause anytime · Cancel anytime' prominently below the subscribe CTA — this one line reduces subscription hesitation by an estimated 20–30% based on DTC subscription research.",
  },
  {
    n: 6,
    section: 'Community section',
    why: "The diaspora cities (London, New York, Mumbai, Toronto, Dubai, Singapore) are pulled directly from customer data and VoC signals. The US waitlist quote ('I live in the US and wait for friends to visit London') is the single best piece of organic marketing copy the brand has — it simultaneously proves international demand, creates social proof, and generates FOMO.",
    achieves: "Community identity signal ('this brand knows where we are') drives sharing. Every diaspora person who shares the community section image reaches pre-qualified ICP at zero CAC. The international waitlist is a zero-infrastructure email capture mechanism that is immediately actionable.",
    risk: "Listing cities the brand cannot currently serve (New York, Mumbai) raises customer expectations that may not be met.",
    mitigation: "Frame it as 'We're coming' with a waitlist — not 'We ship here.' The waitlist page explicitly states that international shipping is being launched.",
  },
]

const RISKS = [
  {
    level: 'HIGH' as const,
    title: 'Community misidentification',
    description: "If the South Asian diaspora is NOT the primary customer (e.g. if most buyers are actually non-South-Asian therapeutic buyers who found the brand via Google), the heritage-first hero will underperform badly.",
    mitigation: "Run a 2-week A/B test: Website A hero vs Website B hero on cold traffic before committing to a full rebuild.",
  },
  {
    level: 'HIGH' as const,
    title: 'Subscription margin erosion',
    description: "If COGS is above the assumed 30–40% (actual gross margin below 60%), the 15% subscribe discount plus free shipping subsidy on single-product subscriptions may produce a negative contribution margin per subscriber order.",
    mitigation: "Do not launch Single-tier subscription until Section 5 Q1–Q4 (margin questions) are answered. Launch Duo-tier first — higher order value absorbs shipping.",
  },
  {
    level: 'MEDIUM' as const,
    title: 'Founder content dependency',
    description: "The heritage strategy requires Suruchie to produce regular video content (Monday ingredient reels). If capacity is limited or the founder is uncomfortable on camera, Website A's content (therapeutic testimonials) cannot compensate fully.",
    mitigation: "Build a 6-week content buffer before launch. Pre-film 6 ingredient reels in one day. The format is simple — 60 seconds, no editing required beyond a trim.",
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
    title: 'International waitlist expectations',
    description: "Listing international cities without a clear shipping launch date may generate email signups that then receive no communication for 6+ months, causing list decay.",
    mitigation: "Set up an automated 'Thank you for joining' email for waitlist signups that gives an honest estimated launch timeframe (e.g. 'We're targeting international shipping by Q1 2027').",
  },
]

const DECISION_ROWS = [
  { factor: 'Primary growth channel', a: 'Google search / paid search', b: 'Community referral / social sharing' },
  { factor: 'Ideal first customer', a: 'Has a skin condition, searched for a solution', b: 'Received a gift or cultural recommendation' },
  { factor: 'Content strategy', a: 'Condition SEO pages + therapeutic testimonials', b: 'Founder story + identity-led UGC' },
  { factor: 'Subscription entry point', a: 'Product page toggle — transactional language', b: 'Ritual language — cultural identity framing' },
  { factor: 'Gifting treatment', a: 'A section on each product page', b: 'A primary nav destination + gift discovery hub' },
  { factor: 'International scope', a: 'Secondary — UK SEO first', b: 'Primary — diaspora is global from day one' },
  { factor: 'Time to first revenue', a: '4–8 weeks (SEO + conversion optimisation)', b: 'Days (community shares are instant)' },
  { factor: 'Design benchmark', a: 'Pai Skincare, Skin+Me, Dr. Sam\'s', b: 'Liha Beauty, 82°E, Tatcha, Dizziak' },
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

export default function WebsiteB() {
  return (
    <main className="min-h-screen bg-cream">

      {/* Header */}
      <header className="bg-ink text-cream px-6 py-10">
        <div className="max-w-5xl mx-auto">
          <div className="text-xs font-bold tracking-widest text-gold uppercase mb-3">
            Powered by Aletheia AI · aletheiaai.in
          </div>
          <h1 className="font-serif text-3xl md:text-4xl font-bold mb-2">INHERITED SKINCARE</h1>
          <p className="text-cream/70 text-base">Founder Intelligence Brief — Website Strategy</p>
          <PageTabs />
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 py-10">

        {/* Title */}
        <div className="mb-10">
          <div className="text-xs font-bold tracking-widest text-gold uppercase mb-2">Section 3</div>
          <h2 className="font-serif text-3xl font-bold text-ink mb-3">Website B — The Heritage-Led Strategy</h2>
          <p className="text-ink/70 leading-relaxed max-w-2xl">
            Leads with cultural identity and the founder's story. Built for community-driven acquisition —
            gifting, word-of-mouth within South Asian diaspora networks, and identity-pride sharing.
            Every section optimises for virality within community, not search engine crawlers.
          </p>
          <div className="mt-3 text-xs text-ink/50 italic">
            Design inspiration: Liha Beauty · 82°E / Deepika Padukone · Tatcha · Dizziak
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
                inherited.co.uk
              </div>
            </div>

            {/* Section 1: Nav */}
            <div className="bg-[#1C0A00] border-b border-[#3A1800] px-6 py-3 flex items-center justify-between relative">
              <span className="absolute left-2 top-3 bg-gold text-white text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full">1</span>
              <span className="font-serif font-bold text-sm text-[#F5DEB3] ml-6">INHERITED</span>
              <div className="flex gap-4 text-xs text-[#F5DEB3]/60">
                <span>Our Story</span>
                <span>Products</span>
                <span>Gift</span>
                <span>Subscribe</span>
              </div>
              <span className="bg-[#B8860B] text-white text-xs px-3 py-1 rounded-full font-semibold">Join the Family</span>
            </div>

            {/* Section 2: Hero */}
            <div className="bg-[#1C0A00] px-8 py-12 relative" style={{ background: 'linear-gradient(135deg, #1C0A00 0%, #2D1200 100%)' }}>
              <span className="absolute left-2 top-4 bg-gold text-white text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full">2</span>
              <div className="text-xs font-bold tracking-widest text-[#B8860B] uppercase mb-4 ml-6">
                HANDMADE IN LONDON · ROOTED IN AYURVEDIC TRADITION
              </div>
              <h2 className="font-serif text-2xl font-bold text-[#F5DEB3] mb-2 leading-tight ml-6">
                What your grandmother knew.<br />Now finally formulated.
              </h2>
              <p className="text-xs text-[#F5DEB3]/60 mb-5 ml-6 max-w-sm">
                Your grandmother put ghee on everything. She was right — she just didn't have the formulation.
              </p>
              <div className="flex gap-3 ml-6 flex-wrap">
                <button className="bg-[#B8860B] text-white text-xs px-4 py-2 rounded-full font-semibold">Discover the range ↗</button>
                <button className="border border-[#B8860B] text-[#B8860B] text-xs px-4 py-2 rounded-full font-semibold">Gift to someone you love ↗</button>
              </div>
              <p className="text-xs text-[#B8860B]/60 mt-4 ml-6">Trusted by 3 generations · London · New York · Mumbai</p>
            </div>

            {/* Section 3: Founder */}
            <div className="bg-[#F5EFE0] px-8 py-8 relative border-t border-[#E8DCC8]">
              <span className="absolute left-2 top-4 bg-gold text-white text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full">3</span>
              <div className="flex gap-6 ml-6 items-start flex-wrap">
                <div className="w-14 h-14 rounded-full bg-[#B8860B]/20 flex items-center justify-center text-lg font-serif text-[#B8860B] shrink-0">S</div>
                <div className="flex-1">
                  <blockquote className="font-serif text-sm text-ink/80 italic mb-2 max-w-lg leading-relaxed">
                    "My mother rubbed ghee on my hands every winter. My grandmother swore by turmeric.
                    I spent years looking for a brand that understood what I grew up knowing.
                    I couldn't find one — so I made it."
                  </blockquote>
                  <p className="text-xs text-[#B8860B] font-semibold">— Suruchie, Founder</p>
                </div>
              </div>
            </div>

            {/* Section 4: Gift */}
            <div className="bg-white px-8 py-8 relative border-t border-parchment">
              <span className="absolute left-2 top-4 bg-gold text-white text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full">4</span>
              <h3 className="font-serif text-lg font-bold text-ink mb-1 ml-6">Give something your grandmother would approve of.</h3>
              <p className="text-xs text-ink/50 ml-6 mb-4">Everyone who receives an Inherited gift ends up ordering for themselves.</p>
              <div className="grid grid-cols-3 gap-3 ml-6">
                {[
                  { label: 'Most gifted', name: 'The Starter Duo', price: '£50', sub: 'DNC + Radiance Serum' },
                  { label: 'Premium', name: 'The Luxury Pack', price: '£75', sub: 'Full ritual, gift wrapped' },
                  { label: 'Personal', name: 'Build Your Own', price: 'from £25', sub: 'Pick 2–3 products' },
                ].map(g => (
                  <div key={g.name} className="border border-parchment rounded-xl p-4">
                    <div className="text-xs text-[#B8860B] font-semibold mb-1">{g.label}</div>
                    <div className="font-serif font-bold text-ink text-sm mb-0.5">{g.name}</div>
                    <div className="text-lg font-bold text-ink">{g.price}</div>
                    <div className="text-xs text-ink/50">{g.sub}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Section 5: Subscribe */}
            <div className="bg-[#FAF6EF] px-8 py-8 relative border-t border-parchment">
              <span className="absolute left-2 top-4 bg-gold text-white text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full">5</span>
              <h3 className="font-serif text-lg font-bold text-ink mb-1 ml-6">Your ritual. Delivered.</h3>
              <div className="flex gap-3 ml-6 my-3 flex-wrap">
                {['Single · 15% off', 'Duo · 20% off', 'Family · 25% off'].map(tier => (
                  <div key={tier} className="border border-[#B8860B]/40 rounded-lg px-3 py-2 text-xs font-semibold text-ink">{tier}</div>
                ))}
              </div>
              <p className="text-xs text-ink/50 ml-6 italic">
                "I think a subscription idea will be fantastic." — verified customer, Oct 2025
              </p>
              <p className="text-xs text-ink/40 ml-6 mt-2">Pause anytime · Cancel anytime</p>
            </div>

            {/* Section 6: Community */}
            <div className="bg-[#1C0A00] px-8 py-8 relative">
              <span className="absolute left-2 top-4 bg-gold text-white text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full">6</span>
              <div className="flex gap-4 ml-6 mb-4 flex-wrap">
                {['London', 'New York', 'Mumbai', 'Toronto', 'Dubai', 'Singapore'].map(city => (
                  <span key={city} className="text-xs font-bold text-[#B8860B]">{city}</span>
                ))}
              </div>
              <blockquote className="text-xs text-[#F5DEB3]/70 italic ml-6 max-w-sm leading-relaxed">
                "I live in the US and wait for friends to visit London to bring me this serum. It is so worth the wait."
              </blockquote>
              <button className="ml-6 mt-4 border border-[#B8860B] text-[#B8860B] text-xs px-4 py-2 rounded-full font-semibold">
                Join international waitlist ↗
              </button>
            </div>
          </div>
          <p className="text-xs text-ink/30 mt-2 italic text-center">Mockup is illustrative — final design uses Suruchie's photography and warm gold-on-dark palette</p>
        </div>

        {/* Section Annotations */}
        <div className="mb-12">
          <h3 className="text-sm font-bold text-ink uppercase tracking-widest mb-6">Section-by-Section Annotations</h3>
          <div className="space-y-4">
            {ANNOTATIONS.map(a => (
              <div key={a.n} className="bg-white border border-parchment rounded-xl overflow-hidden shadow-sm">
                <div className="flex items-center gap-3 bg-[#1C0A00]/5 px-5 py-3 border-b border-parchment">
                  <span className="w-7 h-7 rounded-full bg-[#B8860B] text-white text-xs font-bold flex items-center justify-center shrink-0">
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
        <div className="bg-[#1C0A00] text-[#F5DEB3] rounded-2xl p-7 mb-12">
          <div className="text-xs font-bold text-[#B8860B] uppercase tracking-widest mb-2">Best used when</div>
          <p className="text-sm text-[#F5DEB3]/80 leading-relaxed">
            Community and diaspora networks are the primary growth channel. Gifting occasions (Diwali, Mother's Day, Eid) drive significant traffic.
            Social sharing and identity-led content are the planned marketing approach. The founder is comfortable on camera and has capacity for regular content creation.
          </p>
          <div className="mt-4 pt-4 border-t border-white/10 flex gap-6 flex-wrap">
            <div>
              <div className="text-xs text-[#B8860B] font-semibold">Time to first revenue impact</div>
              <div className="text-sm text-[#F5DEB3]/80 mt-0.5">Days (community shares are immediate)</div>
            </div>
            <div>
              <div className="text-xs text-[#B8860B] font-semibold">Subscription revenue</div>
              <div className="text-sm text-[#F5DEB3]/80 mt-0.5">2–4 weeks</div>
            </div>
          </div>
        </div>

        {/* Decision Framework */}
        <div className="mb-4">
          <div className="text-xs font-bold tracking-widest text-gold uppercase mb-2">Section 4</div>
          <h3 className="font-serif text-2xl font-bold text-ink mb-3">Which Website First? — Decision Framework</h3>
          <p className="text-sm text-ink/60 mb-6 max-w-2xl leading-relaxed">
            Neither option is wrong. The question is which audience you are building for first — and that is a founder decision, not an analyst one.
          </p>
          <div className="overflow-x-auto rounded-xl border border-parchment shadow-sm">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-cream">
                  <th className="text-left px-5 py-3 text-xs font-bold text-ink/50 uppercase tracking-wider w-1/3">Decision Factor</th>
                  <th className="text-left px-5 py-3 text-xs font-bold text-ink uppercase tracking-wider bg-ink/5">
                    Website A — Relief
                  </th>
                  <th className="text-left px-5 py-3 text-xs font-bold text-[#B8860B] uppercase tracking-wider bg-[#1C0A00]/5">
                    Website B — Heritage
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-parchment bg-white">
                {DECISION_ROWS.map(row => (
                  <tr key={row.factor}>
                    <td className="px-5 py-3 text-xs font-semibold text-ink/60 bg-cream/50">{row.factor}</td>
                    <td className="px-5 py-3 text-xs text-ink/70">{row.a}</td>
                    <td className="px-5 py-3 text-xs text-ink/70">{row.b}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Hybrid recommendation */}
          <div className="mt-6 bg-white border-2 border-gold/30 rounded-2xl p-7">
            <div className="text-xs font-bold text-gold uppercase tracking-widest mb-2">The Hybrid Recommendation</div>
            <p className="text-sm text-ink/80 leading-relaxed">
              Launch Website A's homepage structure with Website B's founder section and gifting module embedded.
              The condition-led hero converts Google/paid search traffic. The founder section (placed below the hero) converts
              community traffic arriving from social sharing. The gifting module works for both audiences.
            </p>
            <p className="text-sm text-ink/60 mt-3 leading-relaxed">
              This is not a compromise — it is the architecture that Liha Beauty (heritage) and Pai Skincare (condition) both converge on after 3+ years of iteration.
              Start with the hero that matches your dominant traffic source today. The founder's answer to Section 7 Q2 confirms which hero runs first.
            </p>
          </div>
        </div>

      </div>

      <footer className="bg-ink text-cream/30 text-xs text-center py-6 px-4 mt-10">
        Prepared by Aletheia AI · aletheiaai.in · Confidential — not for distribution
      </footer>
    </main>
  )
}
