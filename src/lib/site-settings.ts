// Site settings — editable by the founder from /admin, stored as a Shopify
// shop metafield (namespace "site", key "settings", type json).
// Falls back to defaults whenever Shopify is unreachable or unconfigured.

export type SiteImages = {
  hero: string
  story: string
  aboutFounder: string
  aboutHero: string
  gheeImage: string
  concernSensitive: string
  concernDry: string
  concernDullness: string
}

export type QuizOption = {
  value: string
  label: string
  description?: string
  icon?: string
}

export type QuizQuestion = {
  id: string
  title: string
  subtitle?: string
  options: QuizOption[]
}

export type QuizResult = {
  key: string // matches a question-1 option value
  title: string
  description: string
  productHandles: string[]
}

export type QuizConfig = {
  intro: {
    overline: string
    title: string
    subtitle: string
    buttonLabel: string
  }
  questions: QuizQuestion[]
  results: QuizResult[]
  resultLogic: string
}

export type FaqItem = { q: string; a: string }
export type ValueItem = { title: string; body: string }
export type IngredientItem = { name: string; origin: string; benefit: string }
export type ReviewItem = { quote: string; name: string; concern: string; product: string; img?: string; handle?: string }
export type ShippingHighlight = { title: string; body: string }

export type PageSettings = {
  about: {
    founderHeadline1: string
    founderHeadline2: string
    founderParagraphs: string[]
    values: ValueItem[]
    ingredients: IngredientItem[]
  }
  faq: { items: FaqItem[] }
  contact: { email: string; phone: string; instagram: string; address: string; responseTime: string }
  shipping: { highlights: ShippingHighlight[]; returnsBody: string[] }
  reviews: { items: ReviewItem[] }
}

export type SiteSettings = {
  announcementBar: string
  heroHeadline1: string
  heroHeadline2: string
  heroSubline: string
  heroVideo: string
  uspItems: string[]
  sectionOrder: string[]
  showSections: {
    marquee: boolean
    trustRow: boolean
    bestsellers: boolean
    shopByConcern: boolean
    story: boolean
    scienceRitual: boolean
    ghee: boolean
    reviews: boolean
    ingredients: boolean
    quizCta: boolean
    instagram: boolean
  }
  images: SiteImages
  quiz: QuizConfig
  pages: PageSettings
}

export const DEFAULT_SECTION_ORDER = [
  'marquee', 'trustRow', 'bestsellers', 'shopByConcern',
  'story', 'scienceRitual', 'reviews', 'ingredients', 'quizCta', 'instagram',
]

export const DEFAULT_QUIZ: QuizConfig = {
  intro: {
    overline: 'Personalised Ritual',
    title: 'Find Your Perfect Ritual',
    subtitle: '3 quick questions. Instant personalised results.',
    buttonLabel: 'Shop All Products',
  },
  questions: [
    {
      id: 'skin_type',
      title: 'How would you describe your skin type?',
      options: [
        { value: 'dry', label: 'Dry & Tight', icon: '🌵', description: 'Feels rough, flaky, or tight after cleansing' },
        { value: 'oily', label: 'Oily & Shiny', icon: '✨', description: 'Gets shiny throughout the day, enlarged pores' },
        { value: 'combination', label: 'Combination', icon: '🌗', description: 'Oily T-zone, dry or normal cheeks' },
        { value: 'sensitive', label: 'Sensitive', icon: '🌸', description: 'Easily irritated, prone to redness or reactions' },
      ],
    },
    {
      id: 'concern',
      title: "What's your main skin concern?",
      options: [
        { value: 'dullness', label: 'Dullness & Uneven Tone', icon: '🌟', description: 'Skin looks tired, lacks radiance' },
        { value: 'ageing', label: 'Fine Lines & Ageing', icon: '⏳', description: 'Early signs of ageing, loss of firmness' },
        { value: 'dryness', label: 'Dryness & Dehydration', icon: '💧', description: 'Skin feels parched, lacks moisture' },
        { value: 'texture', label: 'Texture & Congestion', icon: '🔬', description: 'Rough texture, blackheads, or congestion' },
      ],
    },
    {
      id: 'routine',
      title: 'How would you describe your ideal skincare routine?',
      options: [
        { value: 'minimal', label: 'Minimal', icon: '⚡', description: '2-3 steps, quick and effective' },
        { value: 'balanced', label: 'Balanced', icon: '🎯', description: '4-5 steps, morning and evening' },
        { value: 'full', label: 'Full Ritual', icon: '🕯️', description: 'I love a complete, indulgent routine' },
        { value: 'flexible', label: 'Flexible', icon: '🌊', description: 'Different each day depending on my skin' },
      ],
    },
  ],
  results: [
    {
      key: 'dry',
      title: 'The Deep Nourishment Ritual',
      description:
        'Your skin craves intense moisture and barrier repair. Our ghee-rich formulas deliver exactly that — deep nourishment from within the skin barrier.',
      productHandles: [
        'overnight-rejuvenation-cream',
        'deep-nourishing-cream',
        'ghee-oat-cleansing-balm',
      ],
    },
    {
      key: 'oily',
      title: 'The Balancing Clarity Ritual',
      description:
        "Contrary to myth, the right oils balance oily skin. Our ghee formulas work with your skin's sebum, not against it.",
      productHandles: [
        'ghee-oat-cleansing-balm',
        'radiance-serum',
        'deep-nourishing-cream',
      ],
    },
    {
      key: 'combination',
      title: 'The Full Ritual',
      description:
        'Your skin deserves the complete Inherited Skincare experience. Start with our most beloved trio.',
      productHandles: [
        'radiance-serum',
        'overnight-rejuvenation-cream',
        'ghee-oat-cleansing-balm',
      ],
    },
    {
      key: 'sensitive',
      title: 'The Calm & Radiance Ritual',
      description:
        'Sensitive skin needs gentle, anti-inflammatory nourishment. Our oat and ghee formulas calm while brightening.',
      productHandles: [
        'ghee-oat-cleansing-balm',
        'radiance-serum',
        'deep-nourishing-cream',
      ],
    },
  ],
  resultLogic:
    "The customer's answer to Question 1 (skin type) picks the result shown at the end. Questions 2–3 personalise the journey and the skin-profile summary.",
}

export const DEFAULT_PAGES: PageSettings = {
  about: {
    founderHeadline1: 'Born in a kitchen.',
    founderHeadline2: 'Raised by a dream.',
    founderParagraphs: [
      'Our founder, Suruchi, grew up watching her Indian grandmother, Leela. Every evening, Grandma Leela would press warm ghee — clarified butter — into her face and hands. A simple ritual, passed down through generations.',
      'Years later, modern skincare — parabens, synthetic fragrance, harsh actives — left Suruchi’s skin reactive. Nothing that promised so much seemed to carry the wisdom she had inherited. So she returned to ghee.',
      'Inherited Skincare was born from that return. At its heart is washed ghee — clarified butter washed, traditionally one hundred times in Ayurvedic practice, into a light whipped texture that penetrates all seven layers of the skin.',
      'The brand is literally named in Leela’s honour — and for everything we carry forward from the women who came before us.',
    ],
    values: [
      { title: 'Rooted in Ritual', body: 'Every formula begins with an ancient practice. We don’t invent — we remember, refine, and restore timeless skincare wisdom to modern life.' },
      { title: 'Honest Ingredients', body: 'As few ingredients as possible, all natural. Free from parabens, sulphates, synthetic fragrance, petroleum derivatives, and silicones — and every formula is CPSR safety tested.' },
      { title: 'Slow Beauty', body: 'We believe in small batches, careful craftsmanship, and the quiet power of consistency. Real skin transformation happens over time, not overnight.' },
      { title: 'The Inherited Promise', body: 'We never take more than we need, or put in anything we don’t need. Not tested on animals, with sustainably sourced packaging.' },
    ],
    ingredients: [
      { name: 'Washed Ghee', origin: 'The Hero', benefit: 'Penetrates all seven layers of skin — rich in butyric acid and vitamins A, D, E, K' },
      { name: 'Turmeric & Saffron', origin: 'Radiance Serum', benefit: 'Brightening, evens skin tone' },
      { name: 'Sea Buckthorn & Calendula', origin: 'Overnight Cream', benefit: 'Overnight repair and nourishment' },
      { name: 'Murumuru Butter', origin: 'Deep Nourishing & Foot Cream', benefit: 'Rich, lasting hydration' },
      { name: 'Oat Oil', origin: 'Cleansing Balm', benefit: 'Soothing, calming for sensitive skin' },
      { name: 'Eucalyptus & Spearmint', origin: 'Foot Cream', benefit: 'Cooling, refreshes tired feet' },
    ],
  },
  faq: {
    items: [
      {
        q: 'Is ghee comedogenic? Will it clog my pores?',
        a: 'No — washed ghee is non-comedogenic. The traditional washing process (rinsing the ghee repeatedly with purified water) removes the milk solids and impurities that make raw ghee heavy. What remains is a light, silky balm that absorbs into the skin rather than sitting on top of it, making it suitable even for combination and blemish-prone skin.',
      },
      {
        q: 'Is Inherited Skincare suitable for sensitive skin?',
        a: 'Yes. Our formulas are built around washed organic ghee and calming botanicals like oat extract and calendula, with no parabens, silicones, or harsh chemicals. Washed ghee has been used in Ayurveda for centuries to soothe reactive and irritated skin. As with any new skincare, we recommend a small patch test first if your skin is very reactive.',
      },
      {
        q: 'How long does UK shipping take?',
        a: 'We ship Monday–Friday with Royal Mail Tracked 48, and orders placed before midday aim to ship the same day (during busy periods please allow 2–3 working days for dispatch). Shipping is FREE on all UK orders over £55, and your tracking details are emailed on dispatch.',
      },
      {
        q: 'What is your returns policy?',
        a: 'You can return unused products in as-new condition, in their original packaging, within 14 calendar days of delivery — receipt required. Email hello@inheritedskincare.com with your order number to arrange it. Returns must be sent tracked (proof of delivery required) and you cover the return postage. Once your return is received and inspected, your refund is issued to the original payment method within 5–7 working days. Returns from a failed delivery are subject to a £3.99 fee.',
      },
      {
        q: 'Are your products cruelty-free?',
        a: 'Yes — we are proudly cruelty-free. We never test on animals, and neither do our suppliers. Every formula is also CPSR safety tested and assessed for the UK and EU markets.',
      },
      {
        q: 'How do I use the Overnight Rejuvenation Cream?',
        a: 'After cleansing in the evening, warm a small amount between your fingertips and press gently into the face and neck using upward strokes. Use it as the final step of your evening ritual — it works through the night to soften fine lines, plump the skin, and reduce pigmentation. A little goes a long way.',
      },
      {
        q: 'How do I use the Ghee & Oat Cleansing Balm?',
        a: 'Massage a small scoop onto dry skin in circular motions — it melts on contact, lifting away makeup, SPF, and impurities. Remove with a warm, damp cloth. It cleanses without stripping, so skin feels soft and comfortable, never tight. Suitable for morning and evening use.',
      },
      {
        q: 'When should I apply the Radiance Serum?',
        a: 'The Radiance Serum is an overnight treatment. Apply 2–3 drops to cleansed skin in the evening, before or instead of your night cream. Its blend of turmeric, saffron, and liquorice works while you sleep to even tone and smooth texture — you should wake to visibly nourished, more radiant skin.',
      },
      {
        q: 'Where are your products made?',
        a: 'Every product is handmade in small batches in our UK studio, using washed organic ghee and natural botanicals. The brand was inspired by our founder Suruchi’s grandmother, Leela, and her evening ghee ritual, and every formula is CPSR safety tested for modern standards.',
      },
    ],
  },
  contact: {
    email: 'hello@inheritedskincare.com',
    phone: '+44 77581 29042',
    instagram: '@inheritedskincare',
    address: 'Leigh Gardens, London NW10 5HN, United Kingdom.',
    responseTime: 'Within 1 working day, Monday–Friday.',
  },
  shipping: {
    highlights: [
      { title: 'Free over £55', body: 'Free UK shipping on all orders over £55.' },
      { title: 'Ships Mon–Fri', body: 'Orders placed before midday aim to ship the same day.' },
      { title: 'Royal Mail Tracked 48', body: 'Every order is sent tracked — tracking details emailed on dispatch.' },
      { title: '14-day returns', body: 'Unused products in original packaging can be returned within 14 days of delivery.' },
    ],
    returnsBody: [
      'We want you to love your ritual. If you change your mind, you can return any unused product in as-new condition, in its original packaging, within 14 calendar days of delivery. Please keep your receipt — it’s required for all returns.',
      'To start a return, email hello@inheritedskincare.com with your order number and the products you’d like to return. Returns must be sent with a tracking number, and proof of delivery is required. You are responsible for the cost of return shipping, and original shipping costs are non-refundable.',
      'Once your return arrives and has been inspected, your refund is issued to your original payment method within 5–7 working days. Returns resulting from a failed delivery are subject to a £3.99 fee.',
    ],
  },
  reviews: {
    items: [
      { img: '/images/reviews/review_trisha.jpg', quote: 'Omg I am obsessed. I’ve been suffering from eczema for years and nothing has helped. It’s really helped calm the redness. Also it’s not greasy like topical eczema creams. So grateful I found this!', name: 'Trisha M.', concern: 'Eczema', product: 'Deep Nourishing Cream', handle: 'deep-nourishing-cream' },
      { img: '/images/reviews/review_vandana.jpg', quote: 'Since we discovered Inherited Deep Nourishing Cream, this is the only cream that calms and soothes my daughter’s eczema. We’ve tried so many over the years.', name: 'Vandana R.', concern: 'Child Eczema', product: 'Deep Nourishing Cream', handle: 'deep-nourishing-cream' },
      { quote: 'It just worked like magic. My hands are all back to what they used to be. All my cracks are gone and my hands feel very soft.', name: 'Pallavi R.C.', concern: 'Dry Hands', product: 'Deep Nourishing Cream', handle: 'deep-nourishing-cream' },
      { quote: 'I have used the foot cream and become a user for life. Who knew ghee had so many benefits! I just love it before slipping into bed.', name: 'Gaurav G.', concern: 'Dry Feet', product: 'Ultimate Soothing Foot Cream', handle: 'ultimate-soothing-foot-cream' },
      { quote: 'Night routine sorted with the night cream. I love the glow right after I’ve put it on and I look forward to ghee working its magic overnight!', name: 'Suruchi S.', concern: 'Night Repair', product: 'Overnight Rejuvenation Cream', handle: 'overnight-rejuvenation-cream' },
      { quote: 'Whenever I’ve applied the cream at night, I’ve seen much calmer, less irritated skin the next morning. This is my go-to cream right now!', name: 'Ashima K.', concern: 'Barrier Repair', product: 'Overnight Rejuvenation Cream', handle: 'overnight-rejuvenation-cream' },
      { img: '/images/reviews/review_priya.jpg', quote: 'I love, love, love this serum! Made my skin so much brighter in just a few uses!', name: 'Priya S.', concern: 'Brightening', product: 'Radiance Serum', handle: 'radiance-serum' },
      { img: '/images/reviews/review_michelle.jpg', quote: 'Rich and nourishing, leaves my skin so smooth with a radiant glow. I genuinely look forward to my daily ritual with this serum.', name: 'Michelle', concern: 'Radiant Glow', product: 'Radiance Serum', handle: 'radiance-serum' },
      { quote: 'I’ve never had a cleansing ritual that actually improved my skin. Most cleansers leave me tight and dry. This one... my skin feels soft and hydrated after cleansing. First time in years.', name: 'Rebecca S.', concern: 'Gentle Cleansing', product: 'Ghee & Oat Cleansing Balm', handle: 'ghee-oat-cleansing-balm' },
      { quote: 'I bought the full set because I was tired of random products. Four weeks in, my skin is genuinely transformed. The pigmentation on my cheeks is noticeably lighter, and my skin texture is smooth for the first time in years. Worth every penny.', name: 'Aisha K.', concern: 'Pigmentation', product: 'Birmingham', handle: 'products' },
    ],
  },
}

export const DEFAULT_SETTINGS: SiteSettings = {
  announcementBar:
    'Free UK shipping over £55 · Handmade in the UK · 5.0★ from 1,800+ customers',
  heroHeadline1: 'Glow Like You',
  heroHeadline2: 'Inherited It.',
  heroSubline: 'Ghee-powered Ayurvedic skincare, handmade in the UK.',
  heroVideo: '',
  uspItems: [
    'Natural ingredients',
    'CPSR Safety Tested',
    'Cruelty Free',
    'Made in the UK',
    'Loved by 1,800+ Customers',
  ],
  sectionOrder: DEFAULT_SECTION_ORDER,
  showSections: {
    marquee: true,
    trustRow: true,
    bestsellers: true,
    shopByConcern: true,
    story: true,
    scienceRitual: true,
    ghee: true,
    reviews: true,
    ingredients: true,
    quizCta: true,
    instagram: true,
  },
  images: {
    hero: '/images/brand/hero_lifestyle.jpg',
    story: '/images/brand/suruchi_leela.jpg',
    aboutFounder: '/images/brand/founder_suruchi.jpg',
    aboutHero: '/images/products/_ALL13.jpg',
    gheeImage: '/images/products/5_radiance_serum_HERO.jpg',
    concernSensitive: '/images/products/6_cleansing_balm.png',
    concernDry: '/images/products/2_deep_cream.jpg',
    concernDullness: '/images/products/5_radiance_serum.jpg',
  },
  quiz: DEFAULT_QUIZ,
  pages: DEFAULT_PAGES,
}

// ─── Merge helpers ───────────────────────────────────────────────────────────
// Arrays are always replaced whole (never index-merged), and any invalid or
// missing nested value falls back to the default.

function str(v: any, fallback: string): string {
  return typeof v === 'string' && v.trim() ? v : fallback
}

function isValidOption(o: any): boolean {
  return (
    o &&
    typeof o === 'object' &&
    typeof o.value === 'string' &&
    o.value.trim() !== '' &&
    typeof o.label === 'string'
  )
}

function normalizeOption(o: any): QuizOption {
  const out: QuizOption = { value: o.value, label: o.label }
  if (typeof o.description === 'string') out.description = o.description
  if (typeof o.icon === 'string') out.icon = o.icon
  return out
}

function isValidQuestion(q: any): boolean {
  return (
    q &&
    typeof q === 'object' &&
    typeof q.id === 'string' &&
    q.id.trim() !== '' &&
    typeof q.title === 'string' &&
    Array.isArray(q.options) &&
    q.options.filter(isValidOption).length >= 2
  )
}

function normalizeQuestion(q: any): QuizQuestion {
  const out: QuizQuestion = {
    id: q.id,
    title: q.title,
    options: q.options.filter(isValidOption).map(normalizeOption),
  }
  if (typeof q.subtitle === 'string' && q.subtitle.trim()) out.subtitle = q.subtitle
  return out
}

function isValidResult(r: any): boolean {
  return (
    r &&
    typeof r === 'object' &&
    typeof r.key === 'string' &&
    r.key.trim() !== '' &&
    typeof r.title === 'string' &&
    typeof r.description === 'string' &&
    Array.isArray(r.productHandles)
  )
}

function normalizeResult(r: any): QuizResult {
  return {
    key: r.key,
    title: r.title,
    description: r.description,
    productHandles: r.productHandles.filter(
      (h: any) => typeof h === 'string' && h.trim() !== ''
    ),
  }
}

export function mergePageSettings(base: PageSettings, partial: any): PageSettings {
  if (!partial || typeof partial !== 'object') return base

  const pa = partial.about && typeof partial.about === 'object' ? partial.about : {}
  const about = {
    founderHeadline1: str(pa.founderHeadline1, base.about.founderHeadline1),
    founderHeadline2: str(pa.founderHeadline2, base.about.founderHeadline2),
    founderParagraphs:
      Array.isArray(pa.founderParagraphs) && pa.founderParagraphs.length > 0
        ? pa.founderParagraphs.filter((p: any) => typeof p === 'string')
        : base.about.founderParagraphs,
    values:
      Array.isArray(pa.values) && pa.values.length > 0
        ? pa.values.filter(
            (v: any) => v && typeof v.title === 'string' && typeof v.body === 'string'
          )
        : base.about.values,
    ingredients:
      Array.isArray(pa.ingredients) && pa.ingredients.length > 0
        ? pa.ingredients.filter(
            (i: any) =>
              i &&
              typeof i.name === 'string' &&
              typeof i.origin === 'string' &&
              typeof i.benefit === 'string'
          )
        : base.about.ingredients,
  }

  const pf = partial.faq && typeof partial.faq === 'object' ? partial.faq : {}
  const faq = {
    items:
      Array.isArray(pf.items) && pf.items.length > 0
        ? pf.items.filter((i: any) => i && typeof i.q === 'string' && typeof i.a === 'string')
        : base.faq.items,
  }

  const pc = partial.contact && typeof partial.contact === 'object' ? partial.contact : {}
  const contact = {
    email: str(pc.email, base.contact.email),
    phone: str(pc.phone, base.contact.phone),
    instagram: str(pc.instagram, base.contact.instagram),
    address: str(pc.address, base.contact.address),
    responseTime: str(pc.responseTime, base.contact.responseTime),
  }

  const ps = partial.shipping && typeof partial.shipping === 'object' ? partial.shipping : {}
  const shipping = {
    highlights:
      Array.isArray(ps.highlights) && ps.highlights.length > 0
        ? ps.highlights.filter(
            (h: any) => h && typeof h.title === 'string' && typeof h.body === 'string'
          )
        : base.shipping.highlights,
    returnsBody:
      Array.isArray(ps.returnsBody) && ps.returnsBody.length > 0
        ? ps.returnsBody.filter((p: any) => typeof p === 'string')
        : base.shipping.returnsBody,
  }

  const pr = partial.reviews && typeof partial.reviews === 'object' ? partial.reviews : {}
  const reviews = {
    items:
      Array.isArray(pr.items) && pr.items.length > 0
        ? pr.items.filter(
            (r: any) =>
              r &&
              typeof r.quote === 'string' &&
              typeof r.name === 'string' &&
              typeof r.concern === 'string' &&
              typeof r.product === 'string'
          )
        : base.reviews.items,
  }

  return { about, faq, contact, shipping, reviews }
}

export function mergeQuiz(base: QuizConfig, partial: any): QuizConfig {
  if (!partial || typeof partial !== 'object') return base

  const intro =
    partial.intro && typeof partial.intro === 'object'
      ? {
          overline: str(partial.intro.overline, base.intro.overline),
          title: str(partial.intro.title, base.intro.title),
          subtitle: str(partial.intro.subtitle, base.intro.subtitle),
          buttonLabel: str(partial.intro.buttonLabel, base.intro.buttonLabel),
        }
      : base.intro

  // Arrays replaced whole — only when every needed piece is structurally valid.
  let questions = base.questions
  if (Array.isArray(partial.questions)) {
    const valid = partial.questions.filter(isValidQuestion).map(normalizeQuestion)
    if (valid.length > 0) questions = valid
  }

  let results = base.results
  if (Array.isArray(partial.results)) {
    const valid = partial.results.filter(isValidResult).map(normalizeResult)
    if (valid.length > 0) results = valid
  }

  return {
    intro,
    questions,
    results,
    resultLogic: str(partial.resultLogic, base.resultLogic),
  }
}

export function mergeSettings(base: SiteSettings, partial: any): SiteSettings {
  if (!partial || typeof partial !== 'object') return base
  return {
    announcementBar: str(partial.announcementBar, base.announcementBar),
    heroHeadline1: str(partial.heroHeadline1, base.heroHeadline1),
    heroHeadline2: str(partial.heroHeadline2, base.heroHeadline2),
    heroSubline: str(partial.heroSubline, base.heroSubline),
    heroVideo: typeof partial.heroVideo === 'string' ? partial.heroVideo : base.heroVideo,
    uspItems: Array.isArray(partial.uspItems)
      ? base.uspItems.map((d, i) =>
          typeof partial.uspItems[i] === 'string' && partial.uspItems[i].trim()
            ? partial.uspItems[i]
            : d
        )
      : base.uspItems,
    sectionOrder:
      Array.isArray(partial.sectionOrder) && partial.sectionOrder.length > 0
        ? partial.sectionOrder.filter((k: any) => typeof k === 'string')
        : base.sectionOrder,
    showSections: {
      ...base.showSections,
      ...(partial.showSections && typeof partial.showSections === 'object'
        ? Object.fromEntries(
            Object.entries(partial.showSections).filter(
              ([k, v]) => k in base.showSections && typeof v === 'boolean'
            )
          )
        : {}),
    },
    images: {
      hero: str(partial.images?.hero, base.images.hero),
      story: str(partial.images?.story, base.images.story),
      aboutFounder: str(partial.images?.aboutFounder, base.images.aboutFounder),
      aboutHero: str(partial.images?.aboutHero, base.images.aboutHero),
      gheeImage: str(partial.images?.gheeImage, base.images.gheeImage),
      concernSensitive: str(
        partial.images?.concernSensitive,
        base.images.concernSensitive
      ),
      concernDry: str(partial.images?.concernDry, base.images.concernDry),
      concernDullness: str(
        partial.images?.concernDullness,
        base.images.concernDullness
      ),
    },
    quiz: mergeQuiz(base.quiz, partial.quiz),
    pages: mergePageSettings(base.pages, partial.pages),
  }
}

// 60s in-module cache so public pages don't hit the Admin API on every render
let settingsCache: { value: SiteSettings; fetchedAt: number } | null = null

export async function getSiteSettings(): Promise<SiteSettings> {
  const { adminConfigured, adminQuery } = await import('./admin-shopify')
  if (!adminConfigured()) return DEFAULT_SETTINGS

  if (settingsCache && Date.now() - settingsCache.fetchedAt < 60_000) {
    return settingsCache.value
  }

  try {
    const data = await adminQuery<{
      shop: { metafield: { value: string } | null }
    }>('{ shop { metafield(namespace: "site", key: "settings") { value } } }')
    const raw = data?.shop?.metafield?.value
    const merged = raw
      ? mergeSettings(DEFAULT_SETTINGS, JSON.parse(raw))
      : DEFAULT_SETTINGS
    settingsCache = { value: merged, fetchedAt: Date.now() }
    return merged
  } catch {
    return DEFAULT_SETTINGS
  }
}
