import type { Product, Collection, Article } from '@/types'
import { REAL_ARTICLES } from './articles-data'

// Static fallback product data — used when the Storefront API token is not yet
// configured. Shapes match the Product type so pages render identically.

function makeProduct(p: {
  handle: string
  title: string
  type: string
  price: string
  compareAt?: string
  img: string
  img2?: string
  description: string
  tags: string[]
}): Product {
  return {
    id: `fallback-${p.handle}`,
    handle: p.handle,
    title: p.title,
    description: p.description,
    descriptionHtml: `<p>${p.description}</p>`,
    productType: p.type,
    tags: p.tags,
    availableForSale: true,
    images: [
      {
        url: `/images/products/${p.img}`,
        altText: p.title,
        width: 1200,
        height: 1500,
      },
      ...(p.img2
        ? [
            {
              url: `/images/products/${p.img2}`,
              altText: `${p.title} — lifestyle`,
              width: 1200,
              height: 1500,
            },
          ]
        : []),
    ],
    variants: [
      {
        id: `fallback-variant-${p.handle}`,
        title: 'Default',
        availableForSale: true,
        price: { amount: p.price, currencyCode: 'GBP' },
        compareAtPrice: p.compareAt
          ? { amount: p.compareAt, currencyCode: 'GBP' }
          : null,
        selectedOptions: [{ name: 'Title', value: 'Default' }],
      },
    ],
    priceRange: {
      minVariantPrice: { amount: p.price, currencyCode: 'GBP' },
      maxVariantPrice: { amount: p.price, currencyCode: 'GBP' },
    },
    compareAtPriceRange: p.compareAt
      ? {
          minVariantPrice: { amount: p.compareAt, currencyCode: 'GBP' },
          maxVariantPrice: { amount: p.compareAt, currencyCode: 'GBP' },
        }
      : undefined,
    seo: { title: p.title, description: p.description },
    metafields: [],
  } as unknown as Product
}

export const FALLBACK_PRODUCTS: Product[] = [
  makeProduct({
    handle: 'overnight-rejuvenation-cream',
    title: 'Overnight Rejuvenation Cream',
    type: 'Night Treatment',
    price: '34.99',
    img: '1_night_cream_HERO.jpg',
    img2: 'alt_overnight-rejuvenation-cream.jpg',
    description:
      'This ultra rich and nourishing cream provides deep hydration to dry skin on the face and neck. Lovingly formulated with washed, organic ghee and infused with a natural blend of Hemp seed oil, Sea Buckthorn, Calendula and Turmeric. Works through the night to soften fine lines, plump and brighten skin, and reduce pigmentation. Gentle, yet miraculously regenerative.',
    tags: ['Night Care', 'Pigmentation', 'Barrier Repair'],
  }),
  makeProduct({
    handle: 'deep-nourishing-cream',
    title: 'Deep Nourishing Cream',
    type: 'Daily Moisturiser',
    price: '24.99',
    img: '2_deep_cream_HERO.jpg',
    img2: 'alt_deep-nourishing-cream.jpg',
    description:
      'Restore your skin’s natural glow with our Deep Nourishing Cream, a luxurious multi-purpose moisturiser crafted in the UK using time-honoured Ayurvedic traditions. Formulated with organic ghee, murumuru butter, coconut oil and aloe vera, this soft creamy blend delivers long-lasting hydration, soothes irritation and promotes radiance from the inside out.',
    tags: ['Face & Body', 'Dry Skin', 'Sensitive Skin'],
  }),
  makeProduct({
    handle: 'radiance-serum',
    title: 'Radiance Serum',
    type: 'Serum',
    price: '24.99',
    img: '5_radiance_serum_HERO.jpg',
    img2: 'alt_radiance-serum.jpg',
    description:
      'A luxurious all-natural overnight treatment designed to restore your glow while you sleep. This natural brightening serum blends turmeric, saffron, liquorice and our signature ghee to deeply hydrate, even out skin tone and smooth skin texture. Wake to visibly nourished, plumper, more radiant skin.',
    tags: ['Brightening', 'Pigmentation', 'Overnight'],
  }),
  makeProduct({
    handle: 'ghee-oat-cleansing-balm',
    title: 'Ghee & Oat Cleansing Balm',
    type: 'Cleanser',
    price: '20.00',
    img: '6_cleansing_balm_HERO.jpg',
    img2: 'alt_ghee-oat-cleansing-balm.jpg',
    description:
      'Melt away the day with our Ghee & Oat Cleansing Balm — a gentle, deeply hydrating cleanser that leaves skin soft, soothed and radiant. Organic ghee replenishes moisture while oat oil calms and comforts. Its buttery texture melts on contact, lifting away makeup, SPF and impurities without stripping your skin barrier.',
    tags: ['Cleanser', 'Sensitive Skin', 'Barrier Repair'],
  }),
  makeProduct({
    handle: 'ultimate-soothing-foot-cream',
    title: 'Ultimate Soothing Foot Cream',
    type: 'Body Care',
    price: '21.00',
    img: '3_foot_cream_HERO.jpg',
    img2: 'alt_ultimate-soothing-foot-cream.jpg',
    description:
      'So much more than a moisturiser for your feet — packed with hardworking ingredients that fight the build-up of dry skin and calluses. A blend of organic washed ghee, rich murumuru butter and jojoba oil, infused with eucalyptus and spearmint to nourish, soothe and relax tired feet.',
    tags: ['Foot Care', 'Dry Skin'],
  }),
  makeProduct({
    handle: 'nourishing-lip-care-set',
    title: 'Nourishing Lip Care Set',
    type: 'Lip Care',
    price: '17.99',
    img: '4_lip_set_HERO.jpg',
    description:
      'Moisturise, hydrate and protect your lips with our signature ghee lip balm and lip scrub set. Gently buff away dull skin with the conditioning scrub, then seal in moisture with the nourishing balm. Soft, smooth, healthy lips all day.',
    tags: ['Lip Care', 'Gift'],
  }),
  makeProduct({
    handle: 'essentials-gift-set',
    title: 'Essentials Gift Set',
    type: 'Gift Set',
    price: '25.00',
    img: '7_essentials_gift_HERO.jpg',
    img2: 'alt_essentials-gift-set.jpg',
    description:
      'This 3-part set includes everything you or your loved one needs to nourish and soothe skin from head to toe. Every product contains washed ghee to penetrate and moisturise through all 7 layers of skin. Includes travel-friendly pots of Deep Nourishing Cream, Soothing Foot Cream and Moisturising Lip Balm.',
    tags: ['Gift', 'Bundle'],
  }),
  makeProduct({
    handle: 'hand-and-foot-cream-bundle',
    title: 'Deep Nourishing Barrier Cream + Ultimate Soothing Foot Cream',
    type: 'Bundle',
    price: '40.00',
    img: '9_hand_foot_bundle_HERO.jpg',
    img2: 'alt_hand-and-foot-cream-bundle.jpg',
    description:
      'A 2-piece ritual for hardworking hands and tired feet. Pairs our Deep Nourishing Cream — organic ghee, murumuru butter, coconut oil and aloe vera for long-lasting hydration — with the Ultimate Soothing Foot Cream, blending washed ghee, murumuru butter and jojoba oil with eucalyptus and spearmint to nourish, soothe and relax.',
    tags: ['Bundle', 'Body Care', 'Dry Skin'],
  }),
  makeProduct({
    handle: 'night-time-bundle',
    title: 'Night Time Bundle',
    type: 'Bundle',
    price: '40.00',
    img: '10_night_time_bundle_HERO.jpg',
    img2: 'alt_night-time-bundle.jpg',
    description:
      'Your evening ritual, complete. Melt away the day with the Ghee & Oat Cleansing Balm, then restore your glow while you sleep with the Radiance Serum — turmeric, saffron, liquorice and our signature ghee working overnight to even tone and smooth texture.',
    tags: ['Bundle', 'Night Care', 'Brightening'],
  }),
]

export function getFallbackProduct(handle: string): Product | null {
  return FALLBACK_PRODUCTS.find((p) => p.handle === handle) ?? null
}

export function getFallbackRelated(handle: string, count = 4): Product[] {
  return FALLBACK_PRODUCTS.filter((p) => p.handle !== handle).slice(0, count)
}

// ─── Fallback Collections ────────────────────────────────────────────────────

function pick(handles: string[]): Product[] {
  return handles
    .map((h) => FALLBACK_PRODUCTS.find((p) => p.handle === h))
    .filter((p): p is Product => Boolean(p))
}

function makeCollection(c: {
  handle: string
  title: string
  description: string
  img: string
  productHandles: string[]
}): Collection {
  return {
    id: `fallback-collection-${c.handle}`,
    handle: c.handle,
    title: c.title,
    description: c.description,
    descriptionHtml: `<p>${c.description}</p>`,
    image: {
      url: `/images/products/${c.img}`,
      altText: c.title,
      width: 1200,
      height: 1200,
    },
    products: pick(c.productHandles),
    seo: { title: c.title, description: c.description },
  }
}

export const FALLBACK_COLLECTIONS: Collection[] = [
  makeCollection({
    handle: 'best-sellers',
    title: 'Best Sellers',
    description:
      'Our most-loved ghee-powered formulas — rated 5.0★ by over 1,800 customers across the UK.',
    img: '_ALL13.jpg',
    productHandles: [
      'overnight-rejuvenation-cream',
      'deep-nourishing-cream',
      'radiance-serum',
      'ghee-oat-cleansing-balm',
      'ultimate-soothing-foot-cream',
      'nourishing-lip-care-set',
    ],
  }),
  makeCollection({
    handle: 'gift-sets',
    title: 'Gift Sets',
    description:
      'Beautifully curated rituals, ready to gift. Every set is wrapped with care and crafted with washed organic ghee.',
    img: '7_essentials_gift.jpg',
    productHandles: [
      'essentials-gift-set',
      'night-time-bundle',
      'nourishing-lip-care-set',
    ],
  }),
  makeCollection({
    handle: 'bundles',
    title: 'Bundles',
    description:
      'Complete head-to-toe rituals at exceptional value — pair our heroes and save on every routine.',
    img: '9_hand_foot_bundle.png',
    productHandles: [
      'hand-and-foot-cream-bundle',
      'night-time-bundle',
      'essentials-gift-set',
      'nourishing-lip-care-set',
    ],
  }),
  makeCollection({
    handle: 'sensitive-skin',
    title: 'Sensitive Skin',
    description:
      'Gentle, fragrance-conscious formulas built around washed ghee and oat — calming care for skin that reacts.',
    img: '6_cleansing_balm.png',
    productHandles: [
      'ghee-oat-cleansing-balm',
      'deep-nourishing-cream',
      'overnight-rejuvenation-cream',
      'nourishing-lip-care-set',
    ],
  }),
  makeCollection({
    handle: 'dry-skin-repair',
    title: 'Dry Skin Repair',
    description:
      'Deep, lasting hydration for dry and depleted skin — rich ghee formulas that rebuild the moisture barrier.',
    img: '2_deep_cream.jpg',
    productHandles: [
      'deep-nourishing-cream',
      'overnight-rejuvenation-cream',
      'ultimate-soothing-foot-cream',
      'nourishing-lip-care-set',
    ],
  }),
  makeCollection({
    handle: 'pigmentation-dull-skin',
    title: 'Dullness & Uneven Tone',
    description:
      'Turmeric, saffron and liquorice meet nourishing ghee — brightening rituals that restore an even, radiant tone.',
    img: '5_radiance_serum.jpg',
    productHandles: [
      'radiance-serum',
      'overnight-rejuvenation-cream',
      'ghee-oat-cleansing-balm',
    ],
  }),
  makeCollection({
    handle: 'face-care',
    title: 'Face Care',
    description:
      'Ghee-powered formulas for radiant, nourished skin — from cleansing balm to overnight treatment.',
    img: '1_night_cream.jpg',
    productHandles: [
      'overnight-rejuvenation-cream',
      'deep-nourishing-cream',
      'radiance-serum',
      'ghee-oat-cleansing-balm',
    ],
  }),
  makeCollection({
    handle: 'body-care',
    title: 'Body Care',
    description:
      'Head-to-toe nourishment for skin that glows — multi-purpose creams and targeted treatments.',
    img: '3_foot_cream.jpg',
    productHandles: [
      'ultimate-soothing-foot-cream',
      'deep-nourishing-cream',
      'nourishing-lip-care-set',
      'hand-and-foot-cream-bundle',
    ],
  }),
  makeCollection({
    handle: 'new-arrivals',
    title: 'New Arrivals',
    description:
      'Fresh additions to the ritual — the latest small-batch formulas from our UK studio.',
    img: '5_radiance_serum.jpg',
    productHandles: [
      'radiance-serum',
      'ghee-oat-cleansing-balm',
      'night-time-bundle',
      'hand-and-foot-cream-bundle',
    ],
  }),
]

export function getFallbackCollection(handle: string): Collection | null {
  return FALLBACK_COLLECTIONS.find((c) => c.handle === handle) ?? null
}

// ─── Fallback Articles ───────────────────────────────────────────────────────

function makeArticle(a: {
  handle: string
  title: string
  excerpt: string
  publishedAt: string
  author: string
  img: string
  paragraphs: string[]
}): Article {
  return {
    id: `fallback-article-${a.handle}`,
    handle: a.handle,
    title: a.title,
    excerpt: a.excerpt,
    contentHtml: a.paragraphs.map((p) => `<p>${p}</p>`).join('\n'),
    publishedAt: a.publishedAt,
    author: { name: a.author },
    image: {
      url: `/images/products/${a.img}`,
      altText: a.title,
      width: 1200,
      height: 800,
    },
    seo: { title: a.title, description: a.excerpt },
    blogHandle: 'news',
  }
}

export const FALLBACK_ARTICLES: Article[] = REAL_ARTICLES

export function getFallbackArticle(handle: string): Article | null {
  return FALLBACK_ARTICLES.find((a) => a.handle === handle) ?? null
}
