// ─── Primitive Types ──────────────────────────────────────────────────────────

export interface ShopifyImage {
  url: string
  altText: string | null
  width: number | null
  height: number | null
}

export interface MoneyV2 {
  amount: string
  currencyCode: string
}

export interface PriceRange {
  minVariantPrice: MoneyV2
  maxVariantPrice: MoneyV2
}

export interface SelectedOption {
  name: string
  value: string
}

export interface SEO {
  title: string | null
  description: string | null
}

// ─── Variant ──────────────────────────────────────────────────────────────────

export interface ProductVariant {
  id: string
  title: string
  availableForSale: boolean
  quantityAvailable: number | null
  price: MoneyV2
  compareAtPrice: MoneyV2 | null
  selectedOptions: SelectedOption[]
}

// ─── Metafield ────────────────────────────────────────────────────────────────

export interface Metafield {
  key: string
  value: string
  namespace: string
}

// ─── Product ──────────────────────────────────────────────────────────────────

export interface Product {
  id: string
  title: string
  handle: string
  description: string
  descriptionHtml: string
  tags: string[]
  vendor: string
  productType: string
  availableForSale: boolean
  priceRange: PriceRange
  compareAtPriceRange: {
    minVariantPrice: MoneyV2
  } | null
  images: ShopifyImage[]
  variants: ProductVariant[]
  metafields: (Metafield | null)[]
  seo: SEO
}

// ─── Collection ───────────────────────────────────────────────────────────────

export interface Collection {
  id: string
  title: string
  handle: string
  description: string
  descriptionHtml: string
  image: ShopifyImage | null
  products: Product[]
  seo: SEO
}

// ─── Article ──────────────────────────────────────────────────────────────────

export interface Article {
  id: string
  title: string
  handle: string
  excerpt: string | null
  contentHtml: string
  publishedAt: string
  author: { name: string }
  image: ShopifyImage | null
  seo: SEO
  blogHandle: string
}

// ─── Cart ─────────────────────────────────────────────────────────────────────

export interface CartItem {
  id: string
  quantity: number
  merchandiseId: string
  variantTitle: string
  productTitle: string
  productHandle: string
  price: MoneyV2
  image: ShopifyImage | null
}

export interface Cart {
  id: string
  checkoutUrl: string
  lines: CartItem[]
  totalAmount: MoneyV2
}

// ─── Raw Shopify Node Types (for normalisation in queries.ts) ─────────────────

export interface ShopifyProductNode {
  id: string
  title: string
  handle: string
  description: string
  descriptionHtml: string
  tags: string[]
  vendor: string
  productType: string
  availableForSale: boolean
  priceRange: PriceRange
  compareAtPriceRange: { minVariantPrice: MoneyV2 } | null
  images: { edges: { node: ShopifyImage }[] }
  variants: { edges: { node: ProductVariant }[] }
  metafields?: (Metafield | null)[]
  seo: SEO
}

export interface ShopifyCollectionNode {
  id: string
  title: string
  handle: string
  description: string
  descriptionHtml: string
  image: ShopifyImage | null
  products?: { edges: { node: ShopifyProductNode }[] }
  seo: SEO
}

export interface ShopifyArticleNode {
  id: string
  title: string
  handle: string
  excerpt: string | null
  contentHtml: string
  publishedAt: string
  author: { name: string }
  image: ShopifyImage | null
  seo: SEO
  blog?: { handle: string }
}

// ─── Quiz ─────────────────────────────────────────────────────────────────────

export interface QuizQuestion {
  id: string
  question: string
  options: QuizOption[]
}

export interface QuizOption {
  id: string
  label: string
  value: string
  icon?: string
}

export interface QuizResult {
  skinType: string
  concern: string
  routine: string
  recommendedHandles: string[]
  description: string
}
