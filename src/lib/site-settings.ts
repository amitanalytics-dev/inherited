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
        { value: 'dry', label: 'Dry & Tight', icon: '🌵', description: 'Rough, flaky, or tight after cleansing.' },
        { value: 'normal', label: 'Normal & balanced', icon: '❤️', description: 'Comfortable most days, no extremes.' },
        { value: 'combination', label: 'Combination', icon: '☯️', description: 'Drier cheeks, T-zone shine.' },
        { value: 'sensitive', label: 'Sensitive', icon: '🌸', description: 'Easily irritated, prone to redness.' },
      ],
    },
    {
      id: 'concern',
      title: "What's your main skin concern?",
      options: [
        { value: 'dullness', label: 'Dullness & Uneven Tone', icon: '🌟', description: 'Skin looks tired, lacks radiance.' },
        { value: 'ageing', label: 'Fine Lines & Ageing', icon: '⏳', description: 'Early signs of ageing, loss of firmness.' },
        { value: 'dryness', label: 'Dryness & Dehydration', icon: '💧', description: 'Skin feels parched, lacks moisture.' },
        { value: 'texture', label: 'Texture & Congestion', icon: '🔬', description: 'Rough texture, blackheads, or congestion.' },
      ],
    },
    {
      id: 'routine',
      title: 'How would you describe your ideal skincare routine?',
      options: [
        { value: 'minimal', label: 'Minimal', icon: '⚡', description: '2–3 steps, quick and effective.' },
        { value: 'balanced', label: 'Balanced', icon: '🎯', description: '4–5 steps, morning and evening.' },
        { value: 'full', label: 'Full Ritual', icon: '🕯️', description: 'A complete, indulgent routine.' },
        { value: 'flexible', label: 'Flexible', icon: '🌊', description: 'Different each day, skin-led.' },
      ],
    },
  ],
  results: [
    {
      key: 'dry',
      title: 'The Deep Nourishment Ritual',
      description:
        'Your skin craves intense moisture and barrier repair. Ghee-rich formulas deliver deep nourishment.',
      productHandles: [
        'overnight-rejuvenation-cream',
        'deep-nourishing-cream',
        'ghee-oat-cleansing-balm',
      ],
    },
    {
      key: 'normal',
      title: 'The Everyday Glow Ritual',
      description:
        'Balanced skin thrives with gentle nourishment and radiance. Ghee keeps your glow going.',
      productHandles: [
        'deep-nourishing-cream',
        'radiance-serum',
        'ghee-oat-cleansing-balm',
      ],
    },
    {
      key: 'combination',
      title: 'The Full Ritual',
      description:
        'The complete Inherited Skincare experience. Our most beloved trio.',
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
        'Gentle, anti-inflammatory ghee and oat formulas. Calming and brightening.',
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
      'Suruchi grew up watching Grandma Leela press ghee into her skin nightly.',
      'A simple ritual. Passed down through generations.',
      'Modern skincare left Suruchi\'s skin reactive. She returned to ghee.',
      'Inherited Skincare was born. Washed ghee. All natural. No shortcuts.',
      'The brand is named in Leela\'s honour.',
    ],
    values: [
      { title: 'Rooted in Ritual', body: 'We remember, refine, and restore timeless Ayurvedic wisdom.' },
      { title: 'Honest Ingredients', body: 'As few ingredients as possible. All natural. CPSR safety tested.' },
      { title: 'Slow Beauty', body: 'Small batches. Careful craft. Real transformation takes time.' },
      { title: 'The Inherited Promise', body: 'Cruelty-free. No fillers. Sustainably sourced packaging.' },
    ],
    ingredients: [
      { name: 'Washed Ghee', origin: 'The Hero', benefit: 'Penetrates all seven skin layers. Vitamins A, D, E, K.' },
      { name: 'Turmeric & Saffron', origin: 'Radiance Serum', benefit: 'Brightening. Evens skin tone.' },
      { name: 'Sea Buckthorn & Calendula', origin: 'Overnight Cream', benefit: 'Overnight repair and nourishment.' },
      { name: 'Murumuru Butter', origin: 'Deep Nourishing & Foot Cream', benefit: 'Rich, lasting hydration.' },
      { name: 'Oat Oil', origin: 'Cleansing Balm', benefit: 'Soothing and calming for sensitive skin.' },
      { name: 'Eucalyptus & Spearmint', origin: 'Foot Cream', benefit: 'Cooling. Refreshes tired feet.' },
    ],
  },
  faq: {
    items: [
      {
        q: 'Is ghee comedogenic? Will it clog my pores?',
        a: 'No. Washed ghee is non-comedogenic. The washing process removes heavy milk solids. What remains absorbs cleanly — suitable even for blemish-prone skin.',
      },
      {
        q: 'Is Inherited Skincare suitable for sensitive skin?',
        a: 'Yes. Built around washed ghee, oat extract, and calendula. No parabens, silicones, or harsh chemicals. Patch test first if your skin is very reactive.',
      },
      {
        q: 'How long does UK shipping take?',
        a: 'Royal Mail Tracked 48, Mon–Fri. Orders before midday aim to ship same day. Free on orders over £55. Tracking emailed on dispatch.',
      },
      {
        q: 'What is your returns policy?',
        a: 'Return unused products in original packaging within 14 days. Email hello@inheritedskincare.com with your order number. Refunds issued within 5–7 working days.',
      },
      {
        q: 'Are your products cruelty-free?',
        a: 'Yes. Never tested on animals. CPSR safety tested for UK and EU markets.',
      },
      {
        q: 'How do I use the Overnight Rejuvenation Cream?',
        a: 'After cleansing, press a small amount into face and neck. Final step of your evening ritual. Works overnight. A little goes a long way.',
      },
      {
        q: 'How do I use the Ghee & Oat Cleansing Balm?',
        a: 'Massage onto dry skin. It melts and lifts makeup and impurities. Remove with a warm damp cloth. Skin feels soft, never tight.',
      },
      {
        q: 'When should I apply the Radiance Serum?',
        a: 'Evening treatment. Apply 2–3 drops to cleansed skin before your night cream. Turmeric and saffron work overnight for radiant, even skin.',
      },
      {
        q: 'Where are your products made?',
        a: 'Handmade in small batches in our UK studio. Washed organic ghee and natural botanicals. Every formula CPSR safety tested.',
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
      { title: 'Free over £55', body: 'Free UK shipping on orders over £55.' },
      { title: 'Ships Mon–Fri', body: 'Orders before midday aim to ship same day.' },
      { title: 'Royal Mail Tracked 48', body: 'Every order tracked. Details emailed on dispatch.' },
      { title: '14-day returns', body: 'Return unused items in original packaging within 14 days.' },
    ],
    returnsBody: [
      'Return any unused product in original packaging within 14 days of delivery.',
      'Email hello@inheritedskincare.com with your order number to start a return.',
      'Returns must be sent tracked. You cover return postage.',
      'Refunds issued to original payment method within 5–7 working days.',
      'Returns from failed delivery are subject to a £3.99 fee.',
    ],
  },
  reviews: {
    items: [
      { img: '/images/reviews/review_trisha.jpg', quote: 'Calmed my eczema redness. Not greasy at all. So grateful!', name: 'Trisha M.', concern: 'Eczema', product: 'Deep Nourishing Cream', handle: 'deep-nourishing-cream' },
      { img: '/images/reviews/review_vandana.jpg', quote: 'The only cream that soothes my daughter\'s eczema. Nothing else works.', name: 'Vandana R.', concern: 'Child Eczema', product: 'Deep Nourishing Cream', handle: 'deep-nourishing-cream' },
      { quote: 'Like magic. Cracks gone. Hands soft and back to normal.', name: 'Pallavi R.C.', concern: 'Dry Hands', product: 'Deep Nourishing Cream', handle: 'deep-nourishing-cream' },
      { quote: 'A foot cream user for life. Love ghee before bed!', name: 'Gaurav G.', concern: 'Dry Feet', product: 'Ultimate Soothing Foot Cream', handle: 'ultimate-soothing-foot-cream' },
      { quote: 'Love the glow. Ghee works its magic overnight!', name: 'Suruchi S.', concern: 'Night Repair', product: 'Overnight Rejuvenation Cream', handle: 'overnight-rejuvenation-cream' },
      { quote: 'Calmer, less irritated skin every morning. My go-to!', name: 'Ashima K.', concern: 'Barrier Repair', product: 'Overnight Rejuvenation Cream', handle: 'overnight-rejuvenation-cream' },
      { img: '/images/reviews/review_priya.jpg', quote: 'I love, love, love this serum! Skin brighter in days!', name: 'Priya S.', concern: 'Brightening', product: 'Radiance Serum', handle: 'radiance-serum' },
      { img: '/images/reviews/review_michelle.jpg', quote: 'So smooth, radiant glow. I look forward to my daily ritual.', name: 'Michelle', concern: 'Radiant Glow', product: 'Radiance Serum', handle: 'radiance-serum' },
      { quote: 'Skin feels soft and hydrated after cleansing. First time in years.', name: 'Rebecca S.', concern: 'Gentle Cleansing', product: 'Ghee & Oat Cleansing Balm', handle: 'ghee-oat-cleansing-balm' },
      { quote: 'Pigmentation lighter. Skin smooth for the first time in years.', name: 'Aisha K.', concern: 'Pigmentation', product: 'Birmingham', handle: 'products' },
    ],
  },
}

export const DEFAULT_SETTINGS: SiteSettings = {
  announcementBar:
    'Free UK shipping over £55 · Handmade in UK · 5.0★ · 1,800+ customers',
  heroHeadline1: 'Glow Like You',
  heroHeadline2: 'Inherited It.',
  heroSubline: 'Ghee-powered Ayurvedic skincare. Handmade in the UK.',
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
