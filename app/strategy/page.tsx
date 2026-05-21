'use client'

import { useState } from 'react'
import PageTabs from '../components/PageTabs'

const PRICING = [
  { sku: 'DNC Moisturiser', cogs: 10, current: 24.99, recommended: 34, currentGm: 60, newGm: 70.6, cmGain: 8.76, comp: '£32–£59 (Pai–Oskia)' },
  { sku: 'Night Cream', cogs: 10, current: 34.99, recommended: 42, currentGm: 72, newGm: 76.2, cmGain: 5.26, comp: '£34–£62 (Cowshed–Oskia)' },
  { sku: 'Foot Cream', cogs: 10, current: 21, recommended: 28, currentGm: 52, newGm: 64.3, cmGain: 7.00, comp: '£24–£38 (mid-premium tier)' },
  { sku: 'Radiance Serum', cogs: 8, current: 24.99, recommended: 38, currentGm: 68, newGm: 78.9, cmGain: 11.33, comp: '£49–£97 (Pai–Oskia)' },
  { sku: 'Cleansing Balm', cogs: 5.5, current: 20, recommended: 28, currentGm: 72, newGm: 80.4, cmGain: 6.38, comp: '£40–£59 (Liha–Bamford)' },
  { sku: 'Lip Balm', cogs: 3.5, current: 9.99, recommended: 13, currentGm: 65, newGm: 73.1, cmGain: 2.76, comp: '£13–£16 (Bamford)' },
]

const BUNDLES = [
  { name: 'The Morning Ritual', items: 'DNC + Radiance Serum', rrp: 72, bundle: 65, saving: 7 },
  { name: 'The Heritage Edit', items: 'DNC + Night Cream + Cleansing Balm', rrp: 104, bundle: 95, saving: 9 },
  { name: 'The Starter Gift', items: 'Cleansing Balm + Lip Balm + DNC', rrp: 75, bundle: 68, saving: 7 },
]

const GIFT_CARDS = [
  { value: '£25', occasion: 'Birthday add-on, stocking filler' },
  { value: '£50', occasion: 'Birthday, Diwali, Eid' },
  { value: '£75', occasion: "Mother's Day, anniversary" },
  { value: '£100', occasion: 'Premium gifting, corporate' },
]

const PLAN = [
  {
    day: 1,
    title: 'Shopify — Price update',
    tasks: [
      'Update all 6 SKU prices to new recommended prices',
      'Add a "compare at" price (old price crossed out) to show the repositioning is deliberate',
      'Update product descriptions with heritage/ritual language (see Day 2 copy)',
      'Fix DNC COGS figure in your records — confirm it is £10, not £8 as used in CM calc',
    ],
    platform: 'Shopify',
  },
  {
    day: 2,
    title: 'Website — Heritage homepage copy',
    tasks: [
      'Hero headline: "What your grandmother knew. Now finally formulated."',
      'Founder section: Suruchie\'s story in 3 sentences + headshot',
      'Product section: rewrite each product with ritual language and ingredient provenance',
      'Add "The Ritual" section — how to use each product as a morning/evening routine',
    ],
    platform: 'Shopify / Custom',
  },
  {
    day: 3,
    title: 'Shopify — Gift cards',
    tasks: [
      'Enable Shopify Gift Cards (free, built into Shopify admin)',
      'Set up 4 denominations: £25 / £50 / £75 / £100',
      'Create a /gifts page with headline "Give the gift of ritual"',
      'Add gift card to main nav under "Gifts"',
    ],
    platform: 'Shopify',
  },
  {
    day: 4,
    title: 'Shopify — Bundles',
    tasks: [
      'Create 3 bundles as Shopify products: Morning Ritual (£65), Heritage Edit (£95), Starter Gift (£68)',
      'Use Shopify\'s "Bundle" product type or a free bundling app like Bundler',
      'Add bundle photography placeholder — even a flat lay with 2-3 products works',
      'Add bundles to /gifts page',
    ],
    platform: 'Shopify',
  },
  {
    day: 5,
    title: 'Klaviyo — Flow rewrites',
    tasks: [
      'Welcome flow: Update subject line to "Your ritual starts here" + rewrite email body in heritage voice',
      'Post-purchase flow: Add ingredient story email (send 3 days after purchase)',
      'Abandoned cart: Rewrite to lead with ritual framing, not discount',
      'Fix GLOW10 — confirm it fires only once per email (already working per founder)',
    ],
    platform: 'Klaviyo',
  },
  {
    day: 6,
    title: 'Instagram — 10 captions',
    tasks: [
      '5 product posts: Each SKU with one ritual use + one ingredient fact',
      '3 founder posts: Origin story (3 parts — why she made it, first recipe, first customer)',
      '2 community posts: "This is what your grandmother\'s kitchen smelled like" + gift gifting post',
      'Write all 10 captions in a Google Doc, get approved before scheduling',
    ],
    platform: 'Instagram',
  },
  {
    day: 7,
    title: 'Instagram — Grid plan',
    tasks: [
      'Plan a 9-post grid in alternating format: product / founder / ritual / product / ingredient…',
      'Colour palette for grid: warm cream, deep terracotta, soft gold — no clinical white backgrounds',
      'Create a Canva template for product shots (text overlay, consistent font)',
      'Schedule using Later or Meta Business Suite (free)',
    ],
    platform: 'Instagram',
  },
  {
    day: 8,
    title: 'Blog — Origin story post',
    tasks: [
      'Title: "Why I Started Inherited Skincare (And What My Grandmother Had to Do With It)"',
      'Target keyword: "heritage skincare UK" + "South Asian skincare UK"',
      'Structure: Problem → Grandmother story → Formulation journey → First product → Now',
      '700–900 words. Add founder photo. Add internal links to DNC + Radiance Serum product pages.',
    ],
    platform: 'Shopify Blog',
  },
  {
    day: 9,
    title: 'Blog — Ingredient story post',
    tasks: [
      'Title: "The Ingredient Your Grandmother Used on Everything (And Why It Works)"',
      'Target keyword: "ghee skincare benefits" + "Ayurvedic skincare UK"',
      'Structure: What is it → Why traditional → What modern science says → How we use it → Shop CTA',
      '600–800 words. Link back to DNC and Cleansing Balm pages.',
    ],
    platform: 'Shopify Blog',
  },
  {
    day: 10,
    title: 'Launch — Email to existing list',
    tasks: [
      'Subject: "We\'ve repriced. Here\'s why." — honest, founder-led email explaining the repositioning',
      'Body: 3 short paragraphs — what changed, why it reflects the brand\'s real value, what\'s new (bundles + gift cards)',
      'CTA: "Shop the new prices" + "Explore the gift edit"',
      'Send via Klaviyo to full list. Monitor open rate (target >35%) and click rate (target >4%)',
    ],
    platform: 'Klaviyo',
  },
]

const DETAILED_PLAN = [
  {
    day: 1,
    platform: 'Shopify',
    color: 'emerald',
    title: 'Shopify — Prices, descriptions, navigation',
    steps: [
      { action: 'Update prices', path: 'Shopify Admin → Products → click each product → Pricing section', detail: 'DNC £34 · Night Cream £42 · Foot Cream £28 · Radiance Serum £38 · Cleansing Balm £28 · Lip Balm £13. Add "Compare at" = old price so it shows crossed out.' },
      { action: 'Rewrite product titles', path: 'Products → each product → Title', detail: 'DNC → "Do Not Cook — Daily Face Cream" · Radiance Serum → "Radiance Serum — Brightening Face Oil" · Keep titles under 60 chars for SEO.' },
      { action: 'Rewrite meta descriptions', path: 'Products → each product → scroll to Search engine listing → Edit', detail: 'Write 1 sentence (150–160 chars) with the primary keyword. Example for DNC: "Ancestral ghee face cream handmade in London. Repairs, nourishes and calms — made from a family recipe passed down for generations."' },
      { action: 'Update main navigation', path: 'Online Store → Navigation → Main menu', detail: 'Add: "Gifts" (link to /collections/gifts) · "Our Story" (link to /pages/our-story) · Rename "Shop" to "Products".' },
      { action: 'Set store meta title + description', path: 'Online Store → Preferences → Title and meta description', detail: 'Title: "Inherited Skincare — Heritage Skincare Made in London" · Description: "Small-batch skincare rooted in ancestral Ayurvedic recipes. Handmade in London from ingredients your grandmother knew."' },
    ],
  },
  {
    day: 2,
    platform: 'Shopify',
    color: 'emerald',
    title: 'Shopify — Homepage rebuild',
    steps: [
      { action: 'Edit homepage hero', path: 'Online Store → Themes → Customise → Home page → Hero banner', detail: 'Headline: "What your grandmother knew. Now finally formulated." · Subtext: "Ancestral skincare. Small batches. Made in London." · CTA button 1: "Shop the ritual" · CTA button 2: "Gift someone".' },
      { action: 'Add founder section', path: 'Theme customise → Add section → Image with text', detail: 'Heading: "Made by a founder, for skin that remembers." · Body: Suruchie\'s 3-sentence story. · Add headshot photo. · Link: "Read our story →".' },
      { action: 'Reorder homepage sections', path: 'Theme customise → drag sections', detail: 'Order: Hero → Featured Products → Founder Story → Reviews → Gift Sets → Instagram Feed.' },
      { action: 'Add announcement bar', path: 'Theme customise → Header → Announcement bar', detail: 'Text: "Free UK delivery on orders over £30 · New: Gift sets now available" · Colour: gold on dark.' },
      { action: 'Enable product reviews', path: 'Apps → search "Product Reviews" → install Shopify Product Reviews (free)', detail: 'Import existing reviews manually if you have them. Display on each product page. Minimum 3 reviews per product before enabling publicly.' },
    ],
  },
  {
    day: 3,
    platform: 'Shopify',
    color: 'emerald',
    title: 'Shopify — Gift cards + Gifts collection',
    steps: [
      { action: 'Enable gift cards', path: 'Products → Gift cards → Add gift card product', detail: 'Denominations: £25 / £50 / £75 / £100. Title: "Inherited Gift Card — The Ritual Gift". Description: "Give someone the gift of a skincare ritual rooted in ancestral wisdom."' },
      { action: 'Create Gifts collection', path: 'Products → Collections → Create collection → Manual', detail: 'Title: "Gifts". Add: all 3 bundles + gift card. Set collection image. SEO title: "Heritage Skincare Gifts UK — Inherited Skincare".' },
      { action: 'Create a /gifts page', path: 'Online Store → Pages → Add page', detail: 'Title: "Gift the Ritual". Body: short intro (2 sentences) + link to Gifts collection + gift card. Add page to navigation.' },
      { action: 'Add gifting badge to products', path: 'Products → each product → Tags', detail: 'Add tag "giftable" to all products. Some themes surface this as a badge automatically. Check your theme settings.' },
    ],
  },
  {
    day: 4,
    platform: 'Shopify',
    color: 'emerald',
    title: 'Shopify — Bundles + About page',
    steps: [
      { action: 'Install Bundler app', path: 'Shopify App Store → search "Bundler — Product Bundles" → Install (free plan available)', detail: 'Create 3 bundles: Morning Ritual (DNC + Radiance Serum, £65), Heritage Edit (DNC + Night Cream + Cleansing Balm, £95), Starter Gift (Cleansing Balm + Lip Balm + DNC, £68).' },
      { action: 'Add bundle images', path: 'Each bundle product → Media', detail: 'Use a flat lay photo of the products together on a warm cream or dark surface. Even a phone photo works for now. Update with professional shot later.' },
      { action: 'Create Our Story page', path: 'Online Store → Pages → Add page → Title: "Our Story"', detail: 'Paste the origin story blog post content (Day 8) as the page body. This page serves both SEO and brand storytelling. Add to main nav.' },
      { action: 'Set up local pickup / delivery note', path: 'Settings → Shipping and delivery', detail: 'Confirm Royal Mail Tracked 48 is the default. Add a note: "UK orders dispatched within 1–2 business days."' },
    ],
  },
  {
    day: 5,
    platform: 'Klaviyo',
    color: 'purple',
    title: 'Klaviyo — Rewrite all 3 active flows',
    steps: [
      { action: 'Welcome flow — email 1', path: 'Klaviyo → Flows → Welcome Series → Email 1', detail: 'Subject: "Your ritual starts here." · Preview: "Welcome to Inherited — here\'s what we\'re about." · Body: 3 short paragraphs — brand origin, what makes it different, GLOW10 code prominently. Heritage voice throughout.' },
      { action: 'Welcome flow — email 2 (if exists)', path: 'Klaviyo → Flows → Welcome Series → Email 2 (send Day 3)', detail: 'Subject: "The ingredient behind every product." · Body: Ghee story in 4 sentences. Link to Radiance Serum + DNC product pages.' },
      { action: 'Post-purchase flow — add Day 3 email', path: 'Klaviyo → Flows → Post Purchase → Add email at Day 3', detail: 'Subject: "How to use your Inherited order." · Body: ritual usage guide for the product they bought. CTA: "Complete your ritual" → cross-sell to complementary product.' },
      { action: 'Abandoned cart flow', path: 'Klaviyo → Flows → Abandoned Cart → Email 1', detail: 'Remove any discount offer. New copy: "Your ritual is waiting." · Body: one line about the product, one line about small-batch craft, one line CTA. No urgency language. No countdown timers.' },
      { action: 'Check GLOW10 trigger', path: 'Klaviyo → Coupons → GLOW10', detail: 'Confirm it is set to "unique per recipient" (each subscriber gets it once). If it\'s a static code, switch to unique codes to prevent gaming.' },
    ],
  },
  {
    day: 6,
    platform: 'Instagram',
    color: 'pink',
    title: 'Instagram — Profile overhaul',
    steps: [
      { action: 'Update bio', path: 'Instagram → Edit Profile → Bio (150 chars max)', detail: 'New bio: "Ancestral skincare. Made in London. 🌿\nSmall-batch · Heritage recipes · Handmade\nNew: Gift sets available ↓"' },
      { action: 'Update profile link', path: 'Instagram → Edit Profile → Website', detail: 'Use a Linktree or Shopify\'s link-in-bio. Links to add: Shop All · Gift Sets · Our Story · GLOW10 welcome discount.' },
      { action: 'Update profile photo', path: 'Instagram → Edit Profile → Profile photo', detail: 'Should be the brand logo or a clean product shot on warm cream background — not a personal photo. Consistent with website palette.' },
      { action: 'Create Story Highlights', path: 'Instagram → Profile → New Highlight', detail: 'Create 5 highlights: "Products" (each SKU in Stories), "Reviews" (screenshot DMs + reviews), "Our Story" (founder origin), "Gifting" (bundle + gift card Stories), "Behind the scenes" (packing, ingredients).' },
      { action: 'Set up Instagram Shop', path: 'Instagram → Professional Dashboard → Set up Shop → Connect Shopify', detail: 'Connect your Shopify catalogue to Instagram. Tag products in every future product post. Enables "View Shop" button on profile.' },
      { action: 'Pin 3 posts', path: 'Instagram → tap a post → Pin to profile', detail: 'Pin: (1) best product post, (2) founder story post, (3) most-shared review or customer post. These are the first 3 things new visitors see.' },
    ],
  },
  {
    day: 7,
    platform: 'Instagram',
    color: 'pink',
    title: 'Instagram — Content schedule + grid',
    steps: [
      { action: 'Set up Later (free)', path: 'later.com → Connect Instagram Business account', detail: 'Free plan allows 30 posts/month scheduled. Upload all 10 captions from this brief. Schedule: 1 post every day for 10 days at 7am or 7pm IST / 2:30pm BST (peak UK engagement).' },
      { action: 'Design grid template in Canva', path: 'canva.com → Instagram Post (1080×1080)', detail: 'Create 3 templates: (1) Product on dark background with gold text, (2) Founder quote on cream, (3) Ingredient close-up with text overlay. Save as Canva Brand Kit.' },
      { action: 'Create Reels for top 3 posts', path: 'Instagram → Create → Reel (up to 60 sec)', detail: 'Reel 1: Show product texture (DNC applied to hand — warm lighting). Reel 2: Packing process (behind the scenes). Reel 3: Founder 30-second story. Reels get 3–5× more reach than static posts.' },
      { action: 'Build hashtag list', path: 'Save as a Notes doc, paste into every caption', detail: 'Tier 1 (big): #skincare #cleanbeauty #skincareuk · Tier 2 (mid): #heritageSkincare #ayurvedicbeauty #southasianbeauty · Tier 3 (niche): #inheritedskincare #gheebeauty #londonbeauty. Use 6–8 per post.' },
    ],
  },
  {
    day: 8,
    platform: 'SEO',
    color: 'blue',
    title: 'SEO — Technical foundation',
    steps: [
      { action: 'Submit sitemap to Google', path: 'Google Search Console (search.google.com/search-console) → Add property → Enter your Shopify domain → Verify → Sitemaps → Submit sitemap.xml', detail: 'Shopify auto-generates sitemap.xml. Submit once — Google will keep crawling automatically. Takes 2–4 weeks to see results.' },
      { action: 'Fix all product page SEO titles', path: 'Shopify → each product → Search engine listing → Edit website SEO', detail: 'Format: "[Product Name] — Heritage Skincare | Inherited". Under 60 chars. Example: "Do Not Cook Face Cream — Heritage Skincare | Inherited".' },
      { action: 'Add alt text to all product images', path: 'Products → each product → click image → Edit alt text', detail: 'Format: "Inherited Skincare [product name] — [key ingredient] face [product type] made in London". Alt text is read by Google image search and screen readers.' },
      { action: 'Create a Google Business Profile', path: 'business.google.com → Add business → Category: Skin Care Products', detail: 'Even without a physical store, a Google Business profile improves brand search visibility. Add: website, description, photos, opening hours (online only).' },
      { action: 'Install SEO app', path: 'Shopify App Store → search "SEO" → Install "Plug In SEO" or "SEO Manager" (free tier)', detail: 'Runs an audit of your store. Flags missing meta descriptions, broken links, slow images. Fix everything it flags before going further.' },
    ],
  },
  {
    day: 9,
    platform: 'SEO + Blog',
    color: 'blue',
    title: 'Blog — 2 SEO posts live',
    steps: [
      { action: 'Publish Blog Post 1', path: 'Shopify → Online Store → Blog posts → Add blog post', detail: 'Title: "Why I Started Inherited Skincare (And What My Grandmother Had to Do With It)". SEO title: "Heritage Skincare UK — The Story Behind Inherited Skincare". Meta desc: "How a grandmother\'s kitchen recipes became London\'s most talked-about heritage skincare brand. The founder\'s story." Add 1 internal link to DNC product.' },
      { action: 'Publish Blog Post 2', path: 'Shopify → Blog posts → Add blog post', detail: 'Title: "Ghee For Skin: The Ingredient Your Grandmother Used on Everything". SEO title: "Ghee Skincare Benefits UK — Ayurvedic Face Cream". Meta desc: "Ghee has been used in Ayurvedic skincare for 3,000 years. Here\'s what modern science confirms — and why Inherited uses it in every product." Add links to DNC + Cleansing Balm.' },
      { action: 'Add blog to navigation', path: 'Online Store → Navigation → Add menu item → Blog', detail: 'Call it "Journal" not "Blog" — matches heritage brand language.' },
      { action: 'Add schema markup', path: 'Online Store → Themes → Edit code → product.liquid', detail: 'Shopify auto-adds basic Product schema. Check with Google\'s Rich Results Test (search.google.com/test/rich-results). If missing, add JSON-LD for Product + BreadcrumbList.' },
    ],
  },
  {
    day: 10,
    platform: 'Launch',
    color: 'gold',
    title: 'Launch day — Email + social announcement',
    steps: [
      { action: 'Send launch email via Klaviyo', path: 'Klaviyo → Campaigns → Create Campaign → Email', detail: 'Subject: "We\'ve repriced. Here\'s why." Send to: full list. Send time: 9am BST Tuesday or Thursday (highest open rates). Include: new prices explained, bundle CTAs, gift card CTA.' },
      { action: 'Post launch Instagram Reel', path: 'Instagram → Create → Reel', detail: 'Founder on camera (30 seconds): "I raised our prices today. Here\'s why." Honest, direct, no fluff. This type of transparent content consistently performs 5–8× above average for small brands.' },
      { action: 'Post launch Story sequence', path: 'Instagram → Create → Story × 5 slides', detail: 'Slide 1: "Something changed today." · Slide 2: Old prices → New prices · Slide 3: "Here\'s why" (3 bullet reasons) · Slide 4: Bundle announcement · Slide 5: GLOW10 code reminder + link to shop.' },
      { action: 'Monitor and respond', path: 'Klaviyo → Campaigns → check metrics at 2h, 24h, 48h', detail: 'Target: >35% open rate, >4% click rate. If open rate is below 25%, resend to non-openers with a different subject line at 48h. Reply personally to every customer email you receive today.' },
    ],
  },
]

const COMPETITOR_TABLE = [
  { brand: 'Votary', pos: 'Premium', cream: '£75–£95', serum: '£80–£90', balm: '£40–£55', lip: '—' },
  { brand: 'Oskia', pos: 'Premium', cream: '£62–£97', serum: '£64–£97', balm: '£39–£58', lip: '—' },
  { brand: 'Bamford', pos: 'Luxury', cream: '£76–£98', serum: '£76', balm: '£59', lip: '£16' },
  { brand: 'Forest Essentials', pos: 'Heritage luxury', cream: '£62–£110', serum: '£72', balm: '—', lip: '—' },
  { brand: 'Pai Skincare', pos: 'Mid-premium', cream: '£38–£59', serum: '£49', balm: '£34', lip: '—' },
  { brand: 'Cowshed', pos: 'Mid-premium', cream: '£32–£38', serum: '£38–£42', balm: '—', lip: '—' },
  { brand: 'Liha Beauty', pos: 'Mid-premium', cream: '£22–£42', serum: '—', balm: '£42', lip: '—' },
  { brand: 'Inherited (current)', pos: '— underpriced', cream: '£24.99–£34.99', serum: '£24.99', balm: '£20', lip: '£9.99' },
  { brand: 'Inherited (new)', pos: 'Mid-premium ✓', cream: '£28–£42', serum: '£38', balm: '£28', lip: '£13' },
]

const FOUNDER_SIGNALS = [
  { label: 'Payback period', value: '70–80 days (not 52 as assumed)', flag: true },
  { label: 'Subscription app', value: 'Disabled — Bold caused CS issues from accidental clicks', flag: true },
  { label: 'GLOW10 risk', value: 'Customers reordering with different emails to reuse discount', flag: true },
  { label: 'Packing capacity', value: '10–15 orders/day (founder only). Scalable with cheap resource + Royal Mail pickup', flag: false },
  { label: 'Stock (DNC)', value: '100 units on hand', flag: false },
  { label: 'Night Cream stock', value: '20 units — lowest in range, reorder soon', flag: true },
  { label: 'ESP flows live', value: 'Welcome, post-purchase, cart abandonment — all in Klaviyo', flag: false },
  { label: 'Gerald Mousset', value: 'In contact — potential wholesale/partnership', flag: false },
  { label: 'DNC 100g', value: 'Feasible — consider as "coming soon" SKU', flag: false },
  { label: 'Packaging issue', value: 'Plastic cap cracking — source alternative before scaling', flag: true },
]

export default function StrategyPage() {
  const [isLight, setIsLight] = useState(false)

  return (
    <div className="min-h-screen bg-ink">
      {/* Light mode CSS override — scoped to .sc class */}
      {isLight && (
        <style>{`
          .sc { background-color: #FAF6EF !important; }
          .sc .bg-ink { background-color: #FAF6EF !important; }
          .sc .text-cream { color: #1A1108 !important; }
          .sc .text-cream\\/80 { color: rgba(26,17,8,0.8) !important; }
          .sc .text-cream\\/70 { color: rgba(26,17,8,0.7) !important; }
          .sc .text-cream\\/60 { color: rgba(26,17,8,0.6) !important; }
          .sc .text-cream\\/50 { color: rgba(26,17,8,0.5) !important; }
          .sc .text-cream\\/40 { color: rgba(26,17,8,0.4) !important; }
          .sc .text-cream\\/30 { color: rgba(26,17,8,0.3) !important; }
          .sc .text-cream\\/20 { color: rgba(26,17,8,0.2) !important; }
          .sc .bg-cream\\/5 { background-color: rgba(26,17,8,0.05) !important; }
          .sc .bg-cream\\/10 { background-color: rgba(26,17,8,0.08) !important; }
          .sc .border-cream\\/10 { border-color: rgba(26,17,8,0.12) !important; }
          .sc .border-cream\\/5 { border-color: rgba(26,17,8,0.06) !important; }
          .sc .border-cream\\/20 { border-color: rgba(26,17,8,0.18) !important; }
          .sc .divide-cream\\/5 > * + * { border-color: rgba(26,17,8,0.06) !important; }
          .sc .divide-cream\\/10 > * + * { border-color: rgba(26,17,8,0.1) !important; }
          .sc .hover\\:bg-cream\\/5:hover { background-color: rgba(26,17,8,0.04) !important; }
        `}</style>
      )}

      {/* Header — always dark */}
      <div className="bg-ink border-b border-cream/10 px-6 py-8">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold tracking-[0.2em] text-gold uppercase mb-1">Aletheia AI · Heritage Strategy Brief</p>
              <h1 className="text-2xl font-bold tracking-tight text-cream">INHERITED SKINCARE</h1>
              <p className="text-sm text-cream/50 mt-1">Based on founder responses · Heritage angle selected · May 2026</p>
            </div>
            <button
              onClick={() => setIsLight(l => !l)}
              className="flex-shrink-0 mt-1 flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-cream/20 text-xs text-cream/60 hover:text-cream hover:border-cream/40 transition-all"
            >
              {isLight ? '🌙 Dark' : '☀️ Light'}
            </button>
          </div>
          <PageTabs />
        </div>
      </div>

      {/* Content — theme toggles here */}
      <div className={`sc ${isLight ? 'bg-[#FAF6EF]' : 'bg-ink text-cream'}`}>
      <div className="max-w-5xl mx-auto px-6 py-12 space-y-16">

        {/* Founder signals */}
        <section>
          <h2 className="text-xs font-semibold tracking-[0.2em] text-gold uppercase mb-6">Founder Data — Key Signals</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {FOUNDER_SIGNALS.map(s => (
              <div key={s.label} className={`rounded-lg p-4 border ${s.flag ? 'border-amber-600/40 bg-amber-950/20' : 'border-cream/10 bg-cream/5'}`}>
                <p className="text-xs text-cream/50 mb-1">{s.label}</p>
                <p className="text-sm text-cream leading-snug">{s.value}</p>
                {s.flag && <p className="text-xs text-amber-400 mt-2">⚑ Action required</p>}
              </div>
            ))}
          </div>
        </section>

        {/* Competitor benchmark */}
        <section>
          <h2 className="text-xs font-semibold tracking-[0.2em] text-gold uppercase mb-2">Competitor Price Benchmark</h2>
          <p className="text-sm text-cream/60 mb-6">Inherited currently prices at mass-market levels, 30–65% below comparable heritage brands. The heritage positioning is not credible at current prices.</p>
          <div className="overflow-x-auto rounded-xl border border-cream/10">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-cream/10 bg-cream/5">
                  <th className="text-left px-4 py-3 text-cream/60 font-medium">Brand</th>
                  <th className="text-left px-4 py-3 text-cream/60 font-medium">Positioning</th>
                  <th className="text-left px-4 py-3 text-cream/60 font-medium">Cream</th>
                  <th className="text-left px-4 py-3 text-cream/60 font-medium">Serum</th>
                  <th className="text-left px-4 py-3 text-cream/60 font-medium">Balm</th>
                  <th className="text-left px-4 py-3 text-cream/60 font-medium">Lip</th>
                </tr>
              </thead>
              <tbody>
                {COMPETITOR_TABLE.map((r, i) => (
                  <tr key={r.brand} className={`border-b border-cream/5 ${r.brand.includes('current') ? 'bg-red-950/20' : r.brand.includes('new') ? 'bg-emerald-950/20' : ''}`}>
                    <td className="px-4 py-3 font-medium text-cream">{r.brand}</td>
                    <td className="px-4 py-3 text-cream/60 text-xs">{r.pos}</td>
                    <td className="px-4 py-3 text-cream/80">{r.cream}</td>
                    <td className="px-4 py-3 text-cream/80">{r.serum}</td>
                    <td className="px-4 py-3 text-cream/80">{r.balm}</td>
                    <td className="px-4 py-3 text-cream/80">{r.lip}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-cream/40 mt-3">Sources: Votary, Oskia, Bamford (Daylesford/Harrods), Forest Essentials UK, Pai (John Lewis/Lookfantastic), Cowshed, Liha (Space NK) — May 2026</p>
        </section>

        {/* Pricing recommendations */}
        <section>
          <h2 className="text-xs font-semibold tracking-[0.2em] text-gold uppercase mb-2">Pricing Recommendations</h2>
          <p className="text-sm text-cream/60 mb-6">Price increases below are conservative — still sitting below Pai and well below Votary/Oskia. Each move improves gross margin and contribution margin without touching COGS.</p>
          <div className="overflow-x-auto rounded-xl border border-cream/10">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-cream/10 bg-cream/5">
                  <th className="text-left px-4 py-3 text-cream/60 font-medium">SKU</th>
                  <th className="text-right px-4 py-3 text-cream/60 font-medium">COGS</th>
                  <th className="text-right px-4 py-3 text-cream/60 font-medium">Current</th>
                  <th className="text-right px-4 py-3 text-cream/60 font-medium">Recommended</th>
                  <th className="text-right px-4 py-3 text-cream/60 font-medium">Old GM%</th>
                  <th className="text-right px-4 py-3 text-cream/60 font-medium">New GM%</th>
                  <th className="text-right px-4 py-3 text-gold font-medium">CM gain/unit</th>
                  <th className="text-left px-4 py-3 text-cream/60 font-medium">Comp range</th>
                </tr>
              </thead>
              <tbody>
                {PRICING.map(p => (
                  <tr key={p.sku} className="border-b border-cream/5 hover:bg-cream/5">
                    <td className="px-4 py-3 font-medium text-cream">{p.sku}</td>
                    <td className="px-4 py-3 text-right text-cream/60">£{p.cogs}</td>
                    <td className="px-4 py-3 text-right text-cream/50 line-through">£{p.current}</td>
                    <td className="px-4 py-3 text-right font-semibold text-cream">£{p.recommended}</td>
                    <td className="px-4 py-3 text-right text-cream/50">{p.currentGm}%</td>
                    <td className="px-4 py-3 text-right text-emerald-400">{p.newGm}%</td>
                    <td className="px-4 py-3 text-right text-gold font-semibold">+£{p.cmGain.toFixed(2)}</td>
                    <td className="px-4 py-3 text-xs text-cream/50">{p.comp}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-4 p-4 bg-amber-950/30 border border-amber-600/30 rounded-lg text-sm text-amber-200">
            <strong>Data flag:</strong> Your DNC contribution margin calculation used £8 COGS but your unit economics table states £10 for DNC. Based on the 60% GM figure, £10 is correct. Confirm in your records before updating Shopify.
          </div>
        </section>

        {/* Discount architecture */}
        <section>
          <h2 className="text-xs font-semibold tracking-[0.2em] text-gold uppercase mb-2">Discount Architecture</h2>
          <p className="text-sm text-cream/60 mb-6">Heritage brands do not discount. They bundle and gift. Every discount you run teaches your customer to wait. Every bundle teaches them to spend more.</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="rounded-xl border border-emerald-700/30 bg-emerald-950/20 p-5">
              <p className="text-xs font-semibold tracking-widest text-emerald-400 uppercase mb-3">Keep</p>
              <ul className="space-y-2 text-sm text-cream/80">
                <li>✓ <strong>GLOW10</strong> — reframe as "10% off your first ritual" not "10% off"</li>
                <li>✓ <strong>Klaviyo welcome flow</strong> — keep as primary acquisition driver</li>
                <li>✓ <strong>Jivita wholesale</strong> — 40–45% off new retail prices</li>
              </ul>
            </div>
            <div className="rounded-xl border border-red-700/30 bg-red-950/20 p-5">
              <p className="text-xs font-semibold tracking-widest text-red-400 uppercase mb-3">Avoid</p>
              <ul className="space-y-2 text-sm text-cream/80">
                <li>✗ Site-wide flash sales (trains customers to wait)</li>
                <li>✗ Black Friday discounting (dilutes heritage premium)</li>
                <li>✗ Stacking discounts on bundles with GLOW10</li>
              </ul>
            </div>
          </div>

          <h3 className="text-xs font-semibold tracking-[0.15em] text-cream/60 uppercase mb-4">Bundles</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {BUNDLES.map(b => (
              <div key={b.name} className="rounded-xl border border-cream/10 bg-cream/5 p-5">
                <p className="font-semibold text-cream mb-1">{b.name}</p>
                <p className="text-xs text-cream/50 mb-3">{b.items}</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-xl font-bold text-gold">£{b.bundle}</span>
                  <span className="text-sm text-cream/40 line-through">£{b.rrp}</span>
                </div>
                <p className="text-xs text-emerald-400 mt-1">Saves £{b.saving}</p>
              </div>
            ))}
          </div>

          <h3 className="text-xs font-semibold tracking-[0.15em] text-cream/60 uppercase mb-4">Gift Cards</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {GIFT_CARDS.map(g => (
              <div key={g.value} className="rounded-xl border border-gold/20 bg-gold/5 p-4 text-center">
                <p className="text-2xl font-bold text-gold mb-2">{g.value}</p>
                <p className="text-xs text-cream/50">{g.occasion}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Heritage website mockup */}
        <section>
          <h2 className="text-xs font-semibold tracking-[0.2em] text-gold uppercase mb-2">Heritage Website — Live Mockup</h2>
          <p className="text-sm text-cream/60 mb-6">This is what the heritage site looks like. Dark palette, warm gold, ritual language. Based on the direction chosen by the founder.</p>

          <div className="rounded-2xl border border-cream/10 overflow-hidden shadow-2xl">
            {/* Browser chrome */}
            <div className="bg-[#2a2420] px-4 py-3 flex items-center gap-3 border-b border-cream/10">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500/60" />
                <div className="w-3 h-3 rounded-full bg-amber-500/60" />
                <div className="w-3 h-3 rounded-full bg-emerald-500/60" />
              </div>
              <div className="flex-1 bg-[#1a1108] rounded px-3 py-1 text-xs text-cream/40 text-center">inheritedskincare.com</div>
            </div>

            {/* Mockup site */}
            <div className="bg-[#0f0a06] text-cream">

              {/* Nav */}
              <nav className="px-8 py-5 flex items-center justify-between border-b border-cream/10">
                <span className="text-xs tracking-[0.3em] font-semibold text-gold uppercase">Inherited</span>
                <div className="flex gap-8 text-xs text-cream/60 tracking-wide">
                  <span>Our Story</span>
                  <span>Products</span>
                  <span>Gifts</span>
                  <span>Journal</span>
                </div>
                <span className="text-xs tracking-wide text-cream/60">Bag (0)</span>
              </nav>

              {/* Hero */}
              <div className="px-8 py-16 text-center border-b border-cream/10 bg-gradient-to-b from-[#1a0f07] to-[#0f0a06]">
                <p className="text-xs tracking-[0.4em] text-gold uppercase mb-6">Inherited Skincare · Est. London</p>
                <h2 className="text-3xl md:text-4xl font-light leading-tight text-cream mb-4">
                  What your grandmother knew.<br />
                  <span className="italic text-gold">Now finally formulated.</span>
                </h2>
                <p className="text-sm text-cream/60 max-w-md mx-auto mb-8">
                  Ancestral recipes. Proven ingredients. Made in small batches for skin that remembers where it came from.
                </p>
                <div className="flex items-center justify-center gap-4">
                  <button className="bg-gold text-ink text-xs font-semibold px-6 py-2.5 rounded-full tracking-wide">Shop the Ritual</button>
                  <button className="border border-cream/30 text-cream/70 text-xs px-6 py-2.5 rounded-full tracking-wide">Gift someone</button>
                </div>
              </div>

              {/* Products */}
              <div className="px-8 py-12 border-b border-cream/10">
                <p className="text-xs tracking-[0.3em] text-gold uppercase text-center mb-8">The Collection</p>
                <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
                  {[
                    { name: 'Do Not Cook', price: '£34', tag: 'Bestseller' },
                    { name: 'Radiance Serum', price: '£38', tag: '' },
                    { name: 'Night Cream', price: '£42', tag: '' },
                    { name: 'Cleansing Balm', price: '£28', tag: '' },
                    { name: 'Foot Cream', price: '£28', tag: '' },
                    { name: 'Lip Balm', price: '£13', tag: '' },
                  ].map(p => (
                    <div key={p.name} className="text-center">
                      <div className="aspect-square bg-[#1a1108] rounded-xl mb-3 border border-gold/10 flex items-center justify-center">
                        <span className="text-xs text-gold/30">Photo</span>
                      </div>
                      {p.tag && <p className="text-[10px] text-gold tracking-widest uppercase mb-1">{p.tag}</p>}
                      <p className="text-xs text-cream/80 mb-0.5">{p.name}</p>
                      <p className="text-xs font-semibold text-gold">{p.price}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Founder strip */}
              <div className="px-8 py-12 border-b border-cream/10 bg-[#140e08]">
                <div className="max-w-2xl mx-auto text-center">
                  <p className="text-xs tracking-[0.3em] text-gold uppercase mb-4">The Founder</p>
                  <p className="text-lg font-light italic text-cream/80 mb-4">
                    "I grew up watching my grandmother cook ghee and use it on everything. This brand is that knowledge, written down."
                  </p>
                  <p className="text-xs text-cream/40 tracking-wide">— Suruchie, Founder</p>
                </div>
              </div>

              {/* Gift section */}
              <div className="px-8 py-12 border-b border-cream/10">
                <p className="text-xs tracking-[0.3em] text-gold uppercase text-center mb-8">Gift the Ritual</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {BUNDLES.map(b => (
                    <div key={b.name} className="border border-gold/20 rounded-xl p-5 text-center bg-[#140e08]">
                      <p className="text-xs text-gold tracking-wide uppercase mb-2">{b.name}</p>
                      <p className="text-xs text-cream/50 mb-3">{b.items}</p>
                      <p className="text-xl font-bold text-gold">£{b.bundle}</p>
                      <p className="text-xs text-cream/30 mt-1 line-through">£{b.rrp}</p>
                      <button className="mt-4 w-full border border-gold/30 text-gold text-xs py-2 rounded-lg hover:bg-gold/10">Add to bag</button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Footer */}
              <div className="px-8 py-8 flex items-center justify-between text-xs text-cream/30">
                <span className="tracking-[0.3em] text-gold/50 uppercase">Inherited</span>
                <span>Made in London · Ships UK & International</span>
                <span>© 2026 Inherited Skincare</span>
              </div>

            </div>
          </div>
        </section>

        {/* Detailed 10-day implementation */}
        <section>
          <h2 className="text-xs font-semibold tracking-[0.2em] text-gold uppercase mb-2">10-Day Implementation Checklist</h2>
          <p className="text-sm text-cream/60 mb-6">Exact steps with Shopify admin paths, Instagram actions, Klaviyo flows, and SEO setup. One platform per day. Copy these steps directly.</p>

          <div className="space-y-6">
            {DETAILED_PLAN.map(d => {
              const borderColor = d.color === 'emerald' ? 'border-emerald-700/30' : d.color === 'purple' ? 'border-purple-700/30' : d.color === 'pink' ? 'border-pink-700/30' : d.color === 'blue' ? 'border-blue-700/30' : 'border-gold/30'
              const bgColor = d.color === 'emerald' ? 'bg-emerald-950/20' : d.color === 'purple' ? 'bg-purple-950/20' : d.color === 'pink' ? 'bg-pink-950/20' : d.color === 'blue' ? 'bg-blue-950/20' : 'bg-gold/10'
              const badgeColor = d.color === 'emerald' ? 'text-emerald-400 border-emerald-700/40' : d.color === 'purple' ? 'text-purple-400 border-purple-700/40' : d.color === 'pink' ? 'text-pink-400 border-pink-700/40' : d.color === 'blue' ? 'text-blue-400 border-blue-700/40' : 'text-gold border-gold/40'
              return (
                <div key={d.day} className={`rounded-xl border ${borderColor} ${bgColor} overflow-hidden`}>
                  <div className="flex items-center gap-4 px-5 py-4 border-b border-cream/10">
                    <div className="w-8 h-8 rounded-full bg-cream/10 border border-cream/20 flex items-center justify-center text-xs font-bold text-cream flex-shrink-0">{d.day}</div>
                    <div className="flex-1">
                      <p className="font-semibold text-cream text-sm">{d.title}</p>
                    </div>
                    <span className={`text-xs px-2.5 py-1 rounded-full border ${badgeColor}`}>{d.platform}</span>
                  </div>
                  <div className="divide-y divide-cream/5">
                    {d.steps.map((s, i) => (
                      <div key={i} className="px-5 py-4 grid grid-cols-1 md:grid-cols-3 gap-2">
                        <div>
                          <p className="text-xs font-semibold text-cream mb-1">{s.action}</p>
                          <p className="text-xs text-cream/40 leading-snug font-mono">{s.path}</p>
                        </div>
                        <div className="md:col-span-2">
                          <p className="text-sm text-cream/70 leading-relaxed">{s.detail}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </section>

        {/* 10-day plan */}
        <section>
          <h2 className="text-xs font-semibold tracking-[0.2em] text-gold uppercase mb-2">10-Day Build Plan — Summary</h2>
          <p className="text-sm text-cream/60 mb-6">Shopify + Klaviyo + Instagram + Blog. In order. Each day is one focused block — no multi-tasking.</p>

          <div className="space-y-4">
            {PLAN.map(d => (
              <div key={d.day} className="rounded-xl border border-cream/10 bg-cream/5 overflow-hidden">
                <div className="flex items-center gap-4 px-5 py-4 border-b border-cream/10 bg-cream/5">
                  <div className="w-8 h-8 rounded-full bg-gold/20 border border-gold/40 flex items-center justify-center text-xs font-bold text-gold flex-shrink-0">
                    {d.day}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-cream text-sm">{d.title}</p>
                  </div>
                  <span className="text-xs px-2.5 py-1 rounded-full border border-cream/20 text-cream/50">{d.platform}</span>
                </div>
                <ul className="px-5 py-4 space-y-2">
                  {d.tasks.map((t, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-cream/70">
                      <span className="text-gold/60 mt-0.5 flex-shrink-0">◦</span>
                      <span>{t}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* Social media captions */}
        <section>
          <h2 className="text-xs font-semibold tracking-[0.2em] text-gold uppercase mb-6">Instagram Captions — 10 Posts</h2>
          <div className="space-y-4">
            {[
              { type: 'Product', post: 1, caption: 'The one cream your grandmother would have made if she had an INCI list.\n\nDo Not Cook — our bestselling face cream — named after the instruction that kept ghee from going rancid. The same logic applies to your skin.\n\nClean. Calm. Deeply nourished. £34 · Free UK delivery.\n\n#InheritedSkincare #HeritageSkincare #AyurvedicSkincare #CleanBeautyUK #SkincareRitual' },
              { type: 'Founder', post: 2, caption: 'My grandmother never had a skincare routine. She had ingredients.\n\nGhee on her face at night. Turmeric on Sunday mornings. The water from soaked lentils on her hands after cooking.\n\nInherited exists because those ingredients worked. And because nobody had ever written them down properly.\n\n#FounderStory #InheritedSkincare #HeritageSkincare' },
              { type: 'Product', post: 3, caption: 'Serum, but not as you know it.\n\nRadiance Serum was formulated for skin that needs more than hydration — it needs memory. Ancestral ingredients in a modern formula.\n\n£38 · 10% off your first order with GLOW10\n\n#InheritedSkincare #RadianceSerum #SkincareUK #CleanBeauty' },
              { type: 'Community', post: 4, caption: 'Your ritual, delivered.\n\nWe ship across the UK. And for those of you in New York, Toronto, Dubai, Singapore — we see your DMs. International is coming.\n\nJoin the waitlist in bio.\n\n#InheritedSkincare #GlobalDiaspora #SouthAsianBeauty' },
              { type: 'Product', post: 5, caption: 'A foot cream that doesn\'t smell like a hospital.\n\nFoot Cream was the product nobody asked for and everybody kept buying. Made with the same heritage ingredients as our face range — because your grandmother didn\'t use different ingredients for different body parts.\n\n£28\n\n#InheritedSkincare #FootCare #BodyCare #HeritageSkincare' },
              { type: 'Founder', post: 6, caption: 'I made the first batch in my kitchen.\n\nI didn\'t have a lab. I had recipes that had been in my family for decades, a supplier who sourced from the same places my grandmother\'s ingredients came from, and a very patient first customer.\n\nStill small batches. Still made with the same care.\n\n#SmallBatch #FounderLed #InheritedSkincare' },
              { type: 'Gift', post: 7, caption: 'This Diwali, give the gift of ritual.\n\nThree gift sets now available. The Morning Ritual · The Heritage Edit · The Starter Gift.\n\nGift cards from £25.\n\nIn bio.\n\n#DiwaliGifts #GiftsForHer #InheritedSkincare #LuxuryGifts #HeritageSkincare' },
              { type: 'Product', post: 8, caption: 'Cleansing Balm.\n\nThe formula was designed for one thing: to remove everything without stripping anything.\n\nSkin feels clean but not tight. Ingredients your skin recognises. £28.\n\n#CleansingBalm #DoubleCleanseUK #InheritedSkincare #SkincareRoutine' },
              { type: 'Founder', post: 9, caption: 'Every product is made in small batches. Every batch has my name on it.\n\nWhen you\'re a small brand, that\'s not a limitation — it\'s a guarantee.\n\nInherited Skincare. Made in London.\n\n#SmallBatch #MadeInLondon #InheritedSkincare #FounderLed' },
              { type: 'Ingredient', post: 10, caption: 'Ghee. Yes, the same ghee from your kitchen.\n\nIt\'s clarified butter. It\'s been used in Ayurvedic skincare for 3,000 years. Modern research confirms what traditional knowledge always knew — it\'s a humectant, an emollient, and a barrier repair ingredient simultaneously.\n\nWe just gave it a proper INCI listing.\n\n#Ghee #AyurvedicSkincare #IngredientEducation #InheritedSkincare' },
            ].map(p => (
              <div key={p.post} className="rounded-xl border border-cream/10 bg-cream/5 p-5">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-xs px-2.5 py-1 rounded-full bg-gold/10 border border-gold/20 text-gold">{p.type}</span>
                  <span className="text-xs text-cream/40">Post {p.post}</span>
                </div>
                <p className="text-sm text-cream/80 whitespace-pre-line leading-relaxed">{p.caption}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Blog outlines */}
        <section>
          <h2 className="text-xs font-semibold tracking-[0.2em] text-gold uppercase mb-6">Blog Post Outlines — SEO</h2>
          <div className="space-y-6">
            <div className="rounded-xl border border-cream/10 bg-cream/5 p-6">
              <p className="text-xs text-gold tracking-widest uppercase mb-2">Post 1 · Day 8</p>
              <h3 className="text-lg font-semibold text-cream mb-3">"Why I Started Inherited Skincare (And What My Grandmother Had to Do With It)"</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 text-sm">
                <div>
                  <p className="text-cream/50 text-xs uppercase tracking-wide mb-1">Target keywords</p>
                  <p className="text-cream/80">heritage skincare UK · South Asian skincare UK · Ayurvedic skincare brand UK</p>
                </div>
                <div>
                  <p className="text-cream/50 text-xs uppercase tracking-wide mb-1">Word count</p>
                  <p className="text-cream/80">700–900 words. Add founder photo. Internal links to DNC + Radiance Serum.</p>
                </div>
              </div>
              <div className="text-sm text-cream/70 space-y-1">
                <p>1. The problem — skin that didn't respond to mainstream products</p>
                <p>2. The grandmother — what she used, how it worked</p>
                <p>3. The formulation journey — from kitchen to INCI list</p>
                <p>4. The first product — why DNC came first</p>
                <p>5. CTA — "Try the ritual. First order 10% off with GLOW10."</p>
              </div>
            </div>
            <div className="rounded-xl border border-cream/10 bg-cream/5 p-6">
              <p className="text-xs text-gold tracking-widest uppercase mb-2">Post 2 · Day 9</p>
              <h3 className="text-lg font-semibold text-cream mb-3">"The Ingredient Your Grandmother Used on Everything (And Why It Works)"</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 text-sm">
                <div>
                  <p className="text-cream/50 text-xs uppercase tracking-wide mb-1">Target keywords</p>
                  <p className="text-cream/80">ghee skincare benefits · Ayurvedic skincare UK · ghee for skin UK</p>
                </div>
                <div>
                  <p className="text-cream/50 text-xs uppercase tracking-wide mb-1">Word count</p>
                  <p className="text-cream/80">600–800 words. Link to DNC + Cleansing Balm product pages.</p>
                </div>
              </div>
              <div className="text-sm text-cream/70 space-y-1">
                <p>1. What is ghee (one sentence, no jargon)</p>
                <p>2. 3,000 years of Ayurvedic use — what traditional knowledge says</p>
                <p>3. What modern cosmetic science confirms (humectant, emollient, barrier repair)</p>
                <p>4. How Inherited uses it — formulation approach</p>
                <p>5. CTA — "See it in the DNC and Cleansing Balm."</p>
              </div>
            </div>
          </div>
        </section>

        {/* Launch email */}
        <section>
          <h2 className="text-xs font-semibold tracking-[0.2em] text-gold uppercase mb-6">Day 10 — Launch Email (Draft)</h2>
          <div className="rounded-xl border border-cream/10 bg-cream/5 p-6">
            <div className="mb-4 pb-4 border-b border-cream/10 text-sm">
              <p className="text-cream/50 mb-1">Subject line</p>
              <p className="text-cream font-semibold">"We've repriced. Here's why."</p>
            </div>
            <div className="text-sm text-cream/80 space-y-4 leading-relaxed">
              <p>Hi [first name],</p>
              <p>Starting today, our prices are going up. I wanted to tell you directly — not in small print.</p>
              <p>When I launched Inherited, I priced it the way first-time founders price things: cautiously. I wasn't sure anyone would pay £35 for a face cream from a brand nobody had heard of. So I priced it at £25 and hoped it would sell.</p>
              <p>It sold. And the feedback we've received — the emails, the DMs, the reviews — made one thing clear: the product was worth more than I was charging.</p>
              <p>The new prices reflect what it actually costs to make these products properly, in small batches, with the ingredients I won't compromise on. They also reflect where Inherited belongs — not in the same bracket as mass-market skincare, but alongside the heritage and craft brands it was always meant to sit next to.</p>
              <p>What's new alongside the new prices: gift cards from £25, and three curated gift sets for people who want to give the ritual to someone they love.</p>
              <p>If you've been thinking about trying Inherited, your welcome discount (GLOW10) still works at checkout.</p>
              <p>Thank you for being here from the beginning.</p>
              <p>— Suruchie, Founder</p>
            </div>
            <div className="mt-4 flex gap-3">
              <button className="text-xs bg-gold text-ink font-semibold px-4 py-2 rounded-full">Shop the new prices →</button>
              <button className="text-xs border border-gold/30 text-gold px-4 py-2 rounded-full">Explore the gift edit →</button>
            </div>
          </div>
        </section>

        {/* 100-day forecast */}
        <section>
          <h2 className="text-xs font-semibold tracking-[0.2em] text-gold uppercase mb-2">100-Day Business Forecast</h2>
          <p className="text-sm text-cream/60 mb-2">Three scenarios built on founder-confirmed data. Base case assumes the 10-day plan is executed in full. Conservative assumes partial execution. Optimistic assumes strong Instagram response + SEO pick-up by Day 60.</p>
          <p className="text-xs text-cream/40 mb-8">Assumptions: ~50 orders/month at launch, AOV £27 current. No paid ads budget included. Price increase effective Day 1. Bundles live by Day 4. Klaviyo improved by Day 5.</p>

          {/* Scenario bars */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
            {[
              { label: 'Conservative', color: 'amber', desc: 'Price increase done. No new content. Klaviyo partially updated.', m1Rev: 1485, m2Rev: 1800, m3Rev: 2090, m1Orders: 45, m2Orders: 50, m3Orders: 55, m1AOV: 33, m2AOV: 36, m3AOV: 38, total: 5375 },
              { label: 'Base', color: 'emerald', desc: 'Full 10-day plan executed. Bundles + gift cards live. Klaviyo rewritten. 2 blog posts.', m1Rev: 2035, m2Rev: 2940, m3Rev: 3825, m1Orders: 55, m2Orders: 70, m3Orders: 85, m1AOV: 37, m2AOV: 42, m3AOV: 45, total: 8800 },
              { label: 'Optimistic', color: 'gold', desc: 'Base plan + Instagram Reel gains traction + 1 blog post ranks on page 1 by Day 70.', m1Rev: 2600, m2Rev: 4140, m3Rev: 5760, m1Orders: 65, m2Orders: 90, m3Orders: 120, m1AOV: 40, m2AOV: 46, m3AOV: 48, total: 12500 },
            ].map(s => {
              const borderCol = s.color === 'amber' ? 'border-amber-700/30' : s.color === 'emerald' ? 'border-emerald-700/30' : 'border-gold/30'
              const bgCol = s.color === 'amber' ? 'bg-amber-950/20' : s.color === 'emerald' ? 'bg-emerald-950/20' : 'bg-gold/5'
              const textCol = s.color === 'amber' ? 'text-amber-400' : s.color === 'emerald' ? 'text-emerald-400' : 'text-gold'
              const barCol = s.color === 'amber' ? 'bg-amber-500/40' : s.color === 'emerald' ? 'bg-emerald-500/40' : 'bg-gold/40'
              const maxRev = 5760
              return (
                <div key={s.label} className={`rounded-xl border ${borderCol} ${bgCol} p-5`}>
                  <p className={`text-xs font-semibold tracking-widest uppercase mb-1 ${textCol}`}>{s.label}</p>
                  <p className="text-xs text-cream/50 mb-4 leading-snug">{s.desc}</p>
                  <div className="space-y-3 mb-4">
                    {[
                      { period: 'Days 1–30', rev: s.m1Rev, orders: s.m1Orders, aov: s.m1AOV },
                      { period: 'Days 31–60', rev: s.m2Rev, orders: s.m2Orders, aov: s.m2AOV },
                      { period: 'Days 61–100', rev: s.m3Rev, orders: s.m3Orders, aov: s.m3AOV },
                    ].map(p => (
                      <div key={p.period}>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-cream/50">{p.period}</span>
                          <span className={`font-semibold ${textCol}`}>£{p.rev.toLocaleString()}</span>
                        </div>
                        <div className="h-1.5 bg-cream/5 rounded-full overflow-hidden">
                          <div className={`h-full ${barCol} rounded-full`} style={{ width: `${(p.rev / maxRev) * 100}%` }} />
                        </div>
                        <p className="text-xs text-cream/30 mt-0.5">{p.orders} orders · AOV £{p.aov}</p>
                      </div>
                    ))}
                  </div>
                  <div className={`pt-3 border-t border-cream/10 flex justify-between items-baseline`}>
                    <span className="text-xs text-cream/40">100-day total</span>
                    <span className={`text-xl font-bold ${textCol}`}>£{s.total.toLocaleString()}</span>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Phase milestones */}
          <h3 className="text-xs font-semibold tracking-[0.15em] text-cream/60 uppercase mb-4">Phase Milestones</h3>
          <div className="space-y-4 mb-10">
            {[
              {
                phase: 'Phase 1',
                range: 'Days 1–30 · Foundation',
                color: 'emerald',
                goal: 'Get the fundamentals right. Price, copy, email, first content.',
                milestones: [
                  { day: 1, done: 'All 6 SKU prices updated on Shopify with compare-at' },
                  { day: 2, done: 'Homepage hero rewritten with heritage copy' },
                  { day: 3, done: 'Gift cards live — 4 denominations available' },
                  { day: 4, done: '3 bundles live (Morning Ritual, Heritage Edit, Starter Gift)' },
                  { day: 5, done: 'Klaviyo — all 3 flows rewritten in heritage voice' },
                  { day: 7, done: 'Instagram bio + highlights + Instagram Shop connected' },
                  { day: 10, done: 'Launch email sent to full list. 10 posts scheduled.' },
                  { day: 20, done: 'Both blog posts published and submitted to Google Search Console' },
                  { day: 30, done: 'Review: open rate, click rate, AOV change, new followers' },
                ],
                kpis: ['Email open rate >35%', 'AOV increase ≥£8 from bundles', 'Instagram followers +50', 'Gift card first sale'],
              },
              {
                phase: 'Phase 2',
                range: 'Days 31–60 · Content & Retention',
                color: 'blue',
                goal: 'Build the content engine. Start seeing repeat purchase signals.',
                milestones: [
                  { day: 35, done: 'Blog posts starting to appear in Google (Search Console impressions)' },
                  { day: 40, done: 'Post-purchase flow driving cross-sell (Night Cream → DNC or vice versa)' },
                  { day: 45, done: 'Publish Blog Post 3 — "5 Signs Your Skincare Isn\'t Working (And What To Do)"' },
                  { day: 50, done: 'Instagram hits 1 Reel with 3,000+ views (organic, no ads)' },
                  { day: 55, done: 'Night Cream stock replenished (was only 20 units at start)' },
                  { day: 60, done: 'Review: repeat purchase rate, Klaviyo revenue attribution, blog traffic' },
                ],
                kpis: ['Repeat purchase rate >15%', 'Klaviyo as % of revenue >20%', 'Blog bringing 50+ sessions/month', '1 bundle sold per week'],
              },
              {
                phase: 'Phase 3',
                range: 'Days 61–100 · Growth',
                color: 'gold',
                goal: 'Compound what\'s working. Consider subscription relaunch. Push for first press mention.',
                milestones: [
                  { day: 65, done: 'At least 1 blog post appearing in top 10 Google results for target keyword' },
                  { day: 70, done: 'Reach out to Gerald Mousset formally with updated price sheet + heritage pitch deck' },
                  { day: 75, done: 'Source alternative packaging cap (fix cracking plastic issue before scaling)' },
                  { day: 80, done: 'Subscription app relaunch — with proper UX (pause/cancel prominent). Try Seal Subscriptions (free).' },
                  { day: 85, done: 'Send DNC 100g "coming soon" email to list — gauge interest before ordering stock' },
                  { day: 90, done: 'Pitch 2 UK press: Stylist, The Guardian Weekend — email editor with founder story angle' },
                  { day: 100, done: 'Full 100-day review: revenue per channel, best-performing content, next 100-day plan' },
                ],
                kpis: ['Monthly revenue >£3,000 (base)', 'AOV >£42', 'Subscription relaunch with >10 sign-ups in first week', 'Cap issue resolved before DNC 100g launch'],
              },
            ].map(p => {
              const borderCol = p.color === 'emerald' ? 'border-emerald-700/30' : p.color === 'blue' ? 'border-blue-700/30' : 'border-gold/30'
              const bgCol = p.color === 'emerald' ? 'bg-emerald-950/15' : p.color === 'blue' ? 'bg-blue-950/15' : 'bg-gold/5'
              const textCol = p.color === 'emerald' ? 'text-emerald-400' : p.color === 'blue' ? 'text-blue-400' : 'text-gold'
              return (
                <div key={p.phase} className={`rounded-xl border ${borderCol} ${bgCol} overflow-hidden`}>
                  <div className="px-5 py-4 border-b border-cream/10 flex items-start justify-between gap-4">
                    <div>
                      <p className={`text-xs font-semibold tracking-widest uppercase ${textCol} mb-0.5`}>{p.phase} · {p.range}</p>
                      <p className="text-sm text-cream/70">{p.goal}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-0 divide-y md:divide-y-0 md:divide-x divide-cream/5">
                    <div className="px-5 py-4">
                      <p className="text-xs text-cream/40 uppercase tracking-wide mb-3">Milestones</p>
                      <div className="space-y-2">
                        {p.milestones.map((m, i) => (
                          <div key={i} className="flex items-start gap-3">
                            <span className={`text-xs font-mono ${textCol} flex-shrink-0 w-10`}>D{m.day}</span>
                            <span className="text-sm text-cream/70">{m.done}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="px-5 py-4">
                      <p className="text-xs text-cream/40 uppercase tracking-wide mb-3">KPIs to hit</p>
                      <div className="space-y-2">
                        {p.kpis.map((k, i) => (
                          <div key={i} className="flex items-center gap-2">
                            <span className={`text-xs ${textCol}`}>◦</span>
                            <span className="text-sm text-cream/70">{k}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Revenue model assumptions */}
          <h3 className="text-xs font-semibold tracking-[0.15em] text-cream/60 uppercase mb-4">Model Assumptions</h3>
          <div className="rounded-xl border border-cream/10 bg-cream/5 overflow-hidden mb-10">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-cream/10 bg-cream/5">
                  <th className="text-left px-4 py-3 text-cream/60 font-medium">Assumption</th>
                  <th className="text-left px-4 py-3 text-cream/60 font-medium">Value</th>
                  <th className="text-left px-4 py-3 text-cream/60 font-medium">Basis</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cream/5">
                {[
                  { item: 'Current orders/month', val: '~50', basis: 'Estimated from 10–15/day packing capacity, not at full load' },
                  { item: 'Current AOV', val: '£27', basis: 'Weighted average of current prices across typical mix (DNC + 1 other)' },
                  { item: 'AOV after price increase', val: '£35', basis: 'Same mix at new prices, no bundle upsell yet' },
                  { item: 'AOV with bundles (base)', val: '£42', basis: '~25% of orders include a bundle (£68–£95), rest single SKU' },
                  { item: 'Order growth Month 1→3', val: '+10% → +70% (base)', basis: 'Klaviyo improvement +5%, Instagram organic +15–25%, SEO from Month 2' },
                  { item: 'Gift card revenue', val: '~£150/month by Day 60', basis: 'Conservative — 3 gift cards/month at avg £50' },
                  { item: 'No paid ads', val: '£0 ad spend', basis: 'All growth organic — Klaviyo, SEO, Instagram. Add paid only if base case is hit.' },
                  { item: 'Churn / returns', val: '~3%', basis: 'Heritage skincare brands typically see <5% return rate. Assumed stable.' },
                ].map((r, i) => (
                  <tr key={i} className="hover:bg-cream/5">
                    <td className="px-4 py-3 font-medium text-cream">{r.item}</td>
                    <td className="px-4 py-3 text-gold font-semibold">{r.val}</td>
                    <td className="px-4 py-3 text-cream/50 text-xs">{r.basis}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Risks */}
          <h3 className="text-xs font-semibold tracking-[0.15em] text-cream/60 uppercase mb-4">Forecast Risks</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { risk: 'Price increase kills conversion', level: 'MEDIUM', mitigation: 'Monitor add-to-cart vs purchase rate in the first 7 days. If conversion drops >20%, hold Night Cream and Foot Cream at current prices and increase only DNC + Serum first.' },
              { risk: 'Night Cream stockout (only 20 units)', level: 'HIGH', mitigation: 'Reorder immediately. At 50 orders/month with ~15% buying Night Cream, you have ~3 weeks of stock. Place order before Day 3.' },
              { risk: 'Instagram content stops after Day 10', level: 'HIGH', mitigation: 'Schedule all 10 posts via Later before Day 7. Block 2 hours per week for content creation in your calendar. This is the most common failure mode.' },
              { risk: 'Packaging cap cracking causes returns', level: 'MEDIUM', mitigation: 'Source alternative cap before ordering next production batch. Add a note to packing: check cap seal on every DNC unit before shipping.' },
              { risk: 'SEO takes longer than 60 days', level: 'LOW', mitigation: 'Expected. SEO is a Day 61–100 payoff, not a Day 30 payoff. Do not delay other actions waiting for SEO to show results.' },
              { risk: 'Klaviyo rewrite reduces open rate short-term', level: 'LOW', mitigation: 'A/B test subject lines on welcome email before rolling out to full list. Keep old version running for 2 weeks before switching entirely.' },
            ].map(r => (
              <div key={r.risk} className={`rounded-xl p-4 border ${r.level === 'HIGH' ? 'border-red-700/30 bg-red-950/20' : r.level === 'MEDIUM' ? 'border-amber-700/30 bg-amber-950/20' : 'border-cream/10 bg-cream/5'}`}>
                <div className="flex items-center gap-2 mb-2">
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${r.level === 'HIGH' ? 'bg-red-900/40 text-red-400' : r.level === 'MEDIUM' ? 'bg-amber-900/40 text-amber-400' : 'bg-cream/10 text-cream/50'}`}>{r.level}</span>
                </div>
                <p className="text-sm font-medium text-cream mb-1">{r.risk}</p>
                <p className="text-xs text-cream/60 leading-relaxed">{r.mitigation}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Retention & Engagement Engine */}
        <section>
          <h2 className="text-xs font-semibold tracking-[0.2em] text-gold uppercase mb-2">Retention & Engagement Engine</h2>
          <p className="text-sm text-cream/60 mb-8">Acquiring a new customer costs 5× more than keeping one. Inherited already has Klaviyo, active flows, and overwhelmingly positive reviews. This engine turns that into a compounding retention system.</p>

          {/* Retention levers */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
            {[
              { label: 'Current repeat rate (est.)', value: '~15–20%', sub: 'Typical for small D2C at this stage', color: 'amber' },
              { label: 'Target repeat rate (Day 100)', value: '>30%', sub: 'Achievable with engine below', color: 'emerald' },
              { label: 'Revenue impact at 30% repeat', value: '+£800/mo', sub: 'On base case — no new customers needed', color: 'gold' },
            ].map(s => {
              const bc = s.color === 'amber' ? 'border-amber-700/30 bg-amber-950/20' : s.color === 'emerald' ? 'border-emerald-700/30 bg-emerald-950/20' : 'border-gold/30 bg-gold/5'
              const tc = s.color === 'amber' ? 'text-amber-400' : s.color === 'emerald' ? 'text-emerald-400' : 'text-gold'
              return (
                <div key={s.label} className={`rounded-xl border ${bc} p-5`}>
                  <p className="text-xs text-cream/50 mb-2">{s.label}</p>
                  <p className={`text-2xl font-bold ${tc} mb-1`}>{s.value}</p>
                  <p className="text-xs text-cream/40">{s.sub}</p>
                </div>
              )
            })}
          </div>

          {/* Email flows */}
          <h3 className="text-xs font-semibold tracking-[0.15em] text-cream/60 uppercase mb-4">Klaviyo Flow Architecture</h3>
          <div className="space-y-3 mb-10">
            {[
              {
                flow: 'Welcome Series (Days 0 / 3 / 7)',
                status: 'Live — needs rewrite',
                statusColor: 'amber',
                emails: [
                  { day: 0, subject: '"Your ritual starts here."', body: 'Brand origin in 3 sentences. GLOW10 prominently. One product spotlight (DNC). CTA: "Start your ritual."' },
                  { day: 3, subject: '"The ingredient behind every product."', body: 'Ghee story — 4 sentences. Links to DNC + Cleansing Balm. No selling — pure education.' },
                  { day: 7, subject: '"How to build a ritual with Inherited."', body: 'Morning + evening routine using 2-3 products. Cross-sell (if they bought DNC, suggest Radiance Serum). CTA: "Complete your ritual."' },
                ],
              },
              {
                flow: 'Post-Purchase (Day 1 / 4 / 14 / 60)',
                status: 'Live — needs extension',
                statusColor: 'amber',
                emails: [
                  { day: 1, subject: '"Your order is on its way."', body: 'Confirmation + packing story ("packed by Suruchie herself"). Use guide for their product. Sets expectation of results.' },
                  { day: 4, subject: '"How\'s your skin feeling?"', body: 'Check-in. Invite reply (real founder email, not noreply). "If you have questions, reply here." Builds relationship.' },
                  { day: 14, subject: '"Two weeks in — here\'s what to expect."', body: 'Ingredient timeline (e.g. "ghee takes 2–3 weeks to show full barrier repair"). Manages expectations. Reduces refund requests.' },
                  { day: 60, subject: '"Time to replenish?"', body: 'Replenishment reminder based on product size. DNC 50g lasts ~60 days for once-daily use. Soft CTA. Add bundle cross-sell.' },
                ],
              },
              {
                flow: 'Win-Back (Day 90 since last purchase)',
                status: 'Not built — build this',
                statusColor: 'red',
                emails: [
                  { day: 90, subject: '"We\'ve been thinking about you."', body: 'Personal tone from Suruchie. "You haven\'t ordered in a while — wanted to check in." No discount. Just warmth.' },
                  { day: 97, subject: '"Something new since you last visited."', body: 'Share one update (new bundle, new blog post, or price change context). CTA: "See what\'s changed."' },
                  { day: 104, subject: '"One last thing."', body: 'If still no purchase: offer RITUAL10 (10% one-time win-back code). Different code from GLOW10 — tracks win-back specifically.' },
                ],
              },
              {
                flow: 'VIP / High-LTV (3+ orders)',
                status: 'Not built — build this',
                statusColor: 'red',
                emails: [
                  { day: 0, subject: '"You\'re part of the inner circle."', body: 'Triggered after 3rd purchase. Acknowledge loyalty personally. "You\'ve trusted us 3 times — that means everything."' },
                  { day: 7, subject: '"Early access — before we announce this."', body: 'Give VIPs first look at DNC 100g or new SKU before public launch. Makes them feel special. Drives pre-order.' },
                  { day: 30, subject: '"A note from Suruchie."', body: 'Monthly personal update — what\'s happening in the brand. Ask for feedback. This is the highest-retention email type for founder-led brands.' },
                ],
              },
            ].map(f => {
              const sc = f.statusColor === 'amber' ? 'bg-amber-900/30 text-amber-400' : f.statusColor === 'red' ? 'bg-red-900/30 text-red-400' : 'bg-emerald-900/30 text-emerald-400'
              return (
                <div key={f.flow} className="rounded-xl border border-cream/10 bg-cream/5 overflow-hidden">
                  <div className="flex items-center gap-3 px-5 py-3 border-b border-cream/10">
                    <p className="font-semibold text-cream text-sm flex-1">{f.flow}</p>
                    <span className={`text-xs px-2.5 py-1 rounded-full ${sc}`}>{f.status}</span>
                  </div>
                  <div className="divide-y divide-cream/5">
                    {f.emails.map((e, i) => (
                      <div key={i} className="px-5 py-3 grid grid-cols-1 md:grid-cols-4 gap-2 items-start">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono text-gold w-10">D+{e.day}</span>
                          <p className="text-xs text-cream/80 italic">"{e.subject}"</p>
                        </div>
                        <div className="md:col-span-3">
                          <p className="text-sm text-cream/60">{e.body}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>

          {/* Community & social engagement */}
          <h3 className="text-xs font-semibold tracking-[0.15em] text-cream/60 uppercase mb-4">Community Engagement System</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
            {[
              {
                title: 'DM reply protocol',
                icon: '💬',
                steps: [
                  'Reply to every Instagram DM within 24h personally (founder or VA)',
                  'Save every positive DM as a Story Highlight under "Love"',
                  'When someone shares a review, ask: "Can I feature this?" — almost always yes',
                  'Add regular reviewers to a "VIP" Klaviyo segment — they get early access emails',
                ],
              },
              {
                title: 'UGC (user-generated content) engine',
                icon: '📸',
                steps: [
                  'Insert a card in every order: "Tag us @inheritedskincare — we repost every one"',
                  'Repost UGC to Stories within 48h. Credit the customer by name.',
                  'Monthly: compile 3 customer photos into a carousel post — "Our ritual, your skin"',
                  'Offer RITUAL5 (£5 off next order) to customers who post a review photo',
                ],
              },
              {
                title: 'Referral mechanic',
                icon: '🔗',
                steps: [
                  'After 3rd purchase, send a "share your ritual" email with a unique referral link',
                  'Referee gets 10% off first order. Referrer gets £5 credit on next order.',
                  'Use Shopify\'s built-in referral or Referral Candy (free tier)',
                  'Track referral % monthly — target 10% of new orders from referral by Day 100',
                ],
              },
              {
                title: 'Review generation',
                icon: '⭐',
                steps: [
                  'Day 14 post-purchase email asks for a review (see flow above)',
                  'Reply to every Shopify review within 48h — signals to Google you\'re active',
                  'Screenshot every 5-star review. Add to Klaviyo welcome flow social proof section.',
                  'Target: 3+ reviews per product by Day 30. 10+ by Day 100.',
                ],
              },
            ].map(c => (
              <div key={c.title} className="rounded-xl border border-cream/10 bg-cream/5 p-5">
                <p className="text-sm font-semibold text-cream mb-3">{c.icon} {c.title}</p>
                <ul className="space-y-2">
                  {c.steps.map((s, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-cream/70">
                      <span className="text-gold/60 mt-0.5 flex-shrink-0">◦</span>
                      <span>{s}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Subscription relaunch plan */}
          <h3 className="text-xs font-semibold tracking-[0.15em] text-cream/60 uppercase mb-4">Subscription Relaunch (Day 80)</h3>
          <div className="rounded-xl border border-purple-700/30 bg-purple-950/20 p-6">
            <p className="text-sm text-cream/70 mb-4">The previous Bold Subscriptions attempt failed due to accidental signups and poor UX. The relaunch fixes both with better design and explicit consent.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-xs text-purple-400 uppercase tracking-wide mb-3">What went wrong before</p>
                <ul className="space-y-2 text-sm text-cream/70">
                  <li>◦ "Subscribe" checkbox was too prominent / accidental clicks</li>
                  <li>◦ No clear pause/cancel mechanism visible before signup</li>
                  <li>◦ Customers emailed to cancel → CS burden</li>
                  <li>◦ No ritual framing — sold as "save money" not "build a habit"</li>
                </ul>
              </div>
              <div>
                <p className="text-xs text-purple-400 uppercase tracking-wide mb-3">Relaunch with Seal Subscriptions (free)</p>
                <ul className="space-y-2 text-sm text-cream/70">
                  <li>◦ Separate "Subscribe & Save" button — never pre-checked</li>
                  <li>◦ "Pause anytime · Cancel in 2 clicks" shown before signup</li>
                  <li>◦ Frame as ritual: "Your DNC, delivered every 60 days"</li>
                  <li>◦ 15% discount — not the lead, the footnote</li>
                  <li>◦ VIP email when subscription reaches 3+ months</li>
                </ul>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-cream/10 grid grid-cols-3 gap-4 text-center">
              {[
                { label: 'Target sign-ups (first 7 days)', value: '10+' },
                { label: 'Target by Day 100', value: '25 active subs' },
                { label: 'MRR from subs (est.)', value: '£700+' },
              ].map(s => (
                <div key={s.label}>
                  <p className="text-lg font-bold text-purple-400">{s.value}</p>
                  <p className="text-xs text-cream/40 mt-0.5">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-cream/10 pt-8 text-center">
          <p className="text-xs text-cream/30">Prepared by Aletheia AI · aletheiaai.in · May 2026</p>
          <p className="text-xs text-cream/20 mt-1">This brief is confidential and prepared for Inherited Skincare founder use only.</p>
        </footer>

      </div>
      </div>
    </div>
  )
}
