import { storefront } from './shopify'
import type {
  Product,
  Collection,
  Article,
  ShopifyProductNode,
  ShopifyCollectionNode,
  ShopifyArticleNode,
} from '@/types'

// ─── Fragments ────────────────────────────────────────────────────────────────

const PRODUCT_FRAGMENT = `
  fragment ProductFields on Product {
    id
    title
    handle
    description
    descriptionHtml
    tags
    vendor
    productType
    availableForSale
    priceRange {
      minVariantPrice {
        amount
        currencyCode
      }
      maxVariantPrice {
        amount
        currencyCode
      }
    }
    compareAtPriceRange {
      minVariantPrice {
        amount
        currencyCode
      }
    }
    images(first: 6) {
      edges {
        node {
          url
          altText
          width
          height
        }
      }
    }
    variants(first: 10) {
      edges {
        node {
          id
          title
          availableForSale
          quantityAvailable
          price {
            amount
            currencyCode
          }
          compareAtPrice {
            amount
            currencyCode
          }
          selectedOptions {
            name
            value
          }
        }
      }
    }
    metafields(identifiers: [
      { namespace: "custom", key: "ingredients" },
      { namespace: "custom", key: "how_to_use" },
      { namespace: "custom", key: "skin_type" },
      { namespace: "custom", key: "benefit_icons" },
      { namespace: "custom", key: "product_details" },
      { namespace: "custom", key: "why_you_will_love_it" },
      { namespace: "custom", key: "who_good_for" },
      { namespace: "custom", key: "key_ingredients" },
      { namespace: "custom", key: "the_experience" },
      { namespace: "custom", key: "delivery_shipping" },
      { namespace: "reviews", key: "rating" },
      { namespace: "reviews", key: "rating_count" }
    ]) {
      key
      value
      namespace
    }
    seo {
      title
      description
    }
  }
`

const COLLECTION_FRAGMENT = `
  fragment CollectionFields on Collection {
    id
    title
    handle
    description
    descriptionHtml
    image {
      url
      altText
      width
      height
    }
    seo {
      title
      description
    }
  }
`

const ARTICLE_FRAGMENT = `
  fragment ArticleFields on Article {
    id
    title
    handle
    excerpt
    contentHtml
    publishedAt
    author {
      name
    }
    image {
      url
      altText
      width
      height
    }
    seo {
      title
      description
    }
    blog {
      handle
    }
  }
`

// ─── Helpers ──────────────────────────────────────────────────────────────────

function normalizeProduct(node: ShopifyProductNode): Product {
  return {
    id: node.id,
    title: node.title,
    handle: node.handle,
    description: node.description,
    descriptionHtml: node.descriptionHtml,
    tags: node.tags,
    vendor: node.vendor,
    productType: node.productType,
    availableForSale: node.availableForSale,
    priceRange: node.priceRange,
    compareAtPriceRange: node.compareAtPriceRange,
    images: node.images.edges.map((e) => e.node),
    variants: node.variants.edges.map((e) => e.node),
    metafields: node.metafields ?? [],
    seo: node.seo,
  }
}

function normalizeCollection(node: ShopifyCollectionNode): Collection {
  return {
    id: node.id,
    title: node.title,
    handle: node.handle,
    description: node.description,
    descriptionHtml: node.descriptionHtml,
    image: node.image ?? null,
    products: node.products
      ? node.products.edges.map((e) => normalizeProduct(e.node))
      : [],
    seo: node.seo,
  }
}

function normalizeArticle(node: ShopifyArticleNode): Article {
  return {
    id: node.id,
    title: node.title,
    handle: node.handle,
    excerpt: node.excerpt,
    contentHtml: node.contentHtml,
    publishedAt: node.publishedAt,
    author: node.author,
    image: node.image ?? null,
    seo: node.seo,
    blogHandle: node.blog?.handle ?? 'news',
  }
}

// ─── Queries ──────────────────────────────────────────────────────────────────

export async function getProducts(first = 20): Promise<Product[]> {
  const query = `
    ${PRODUCT_FRAGMENT}
    query getProducts($first: Int!) {
      products(first: $first, sortKey: BEST_SELLING) {
        edges {
          node {
            ...ProductFields
          }
        }
      }
    }
  `

  interface Data {
    products: { edges: { node: ShopifyProductNode }[] }
  }

  const data = await storefront<Data>(query, { first })
  return data.products.edges.map((e) => normalizeProduct(e.node))
}

export async function searchProducts(q: string, first = 24): Promise<Product[]> {
  const query = `
    ${PRODUCT_FRAGMENT}
    query searchProducts($q: String!, $first: Int!) {
      products(first: $first, query: $q) {
        edges {
          node {
            ...ProductFields
          }
        }
      }
    }
  `

  interface Data {
    products: { edges: { node: ShopifyProductNode }[] }
  }

  const data = await storefront<Data>(query, { q, first })
  return data.products.edges.map((e) => normalizeProduct(e.node))
}

export async function getProduct(handle: string): Promise<Product | null> {
  const query = `
    ${PRODUCT_FRAGMENT}
    query getProduct($handle: String!) {
      productByHandle(handle: $handle) {
        ...ProductFields
      }
    }
  `

  interface Data {
    productByHandle: ShopifyProductNode | null
  }

  const data = await storefront<Data>(query, { handle })
  if (!data.productByHandle) return null
  return normalizeProduct(data.productByHandle)
}

export async function getCollections(first = 20): Promise<Collection[]> {
  const query = `
    ${COLLECTION_FRAGMENT}
    query getCollections($first: Int!) {
      collections(first: $first) {
        edges {
          node {
            ...CollectionFields
          }
        }
      }
    }
  `

  interface Data {
    collections: { edges: { node: ShopifyCollectionNode }[] }
  }

  const data = await storefront<Data>(query, { first })
  return data.collections.edges.map((e) => normalizeCollection(e.node))
}

export async function getCollection(
  handle: string,
  productsFirst = 20
): Promise<Collection | null> {
  const query = `
    ${COLLECTION_FRAGMENT}
    ${PRODUCT_FRAGMENT}
    query getCollection($handle: String!, $productsFirst: Int!) {
      collectionByHandle(handle: $handle) {
        ...CollectionFields
        products(first: $productsFirst, sortKey: BEST_SELLING) {
          edges {
            node {
              ...ProductFields
            }
          }
        }
      }
    }
  `

  interface Data {
    collectionByHandle: ShopifyCollectionNode | null
  }

  const data = await storefront<Data>(query, { handle, productsFirst })
  if (!data.collectionByHandle) return null
  return normalizeCollection(data.collectionByHandle)
}

export async function getArticles(first = 20): Promise<Article[]> {
  const query = `
    ${ARTICLE_FRAGMENT}
    query getArticles($first: Int!) {
      articles(first: $first, sortKey: PUBLISHED_AT, reverse: true) {
        edges {
          node {
            ...ArticleFields
          }
        }
      }
    }
  `

  interface Data {
    articles: { edges: { node: ShopifyArticleNode }[] }
  }

  const data = await storefront<Data>(query, { first })
  return data.articles.edges.map((e) => normalizeArticle(e.node))
}

export async function getArticle(
  blogHandle: string,
  articleHandle: string
): Promise<Article | null> {
  const query = `
    query getArticle($blogHandle: String!, $articleHandle: String!) {
      blogByHandle(handle: $blogHandle) {
        articleByHandle(handle: $articleHandle) {
          id
          title
          handle
          excerpt
          contentHtml
          publishedAt
          author {
            name
          }
          image {
            url
            altText
            width
            height
          }
          seo {
            title
            description
          }
          blog {
            handle
          }
        }
      }
    }
  `

  interface Data {
    blogByHandle: {
      articleByHandle: ShopifyArticleNode | null
    } | null
  }

  const data = await storefront<Data>(query, { blogHandle, articleHandle })
  if (!data.blogByHandle?.articleByHandle) return null
  return normalizeArticle(data.blogByHandle.articleByHandle)
}

export async function getRelatedProducts(
  productId: string,
  first = 4
): Promise<Product[]> {
  const query = `
    ${PRODUCT_FRAGMENT}
    query getRelatedProducts($productId: ID!, $first: Int!) {
      productRecommendations(productId: $productId) {
        ...ProductFields
      }
      products(first: $first, sortKey: BEST_SELLING) {
        edges {
          node {
            ...ProductFields
          }
        }
      }
    }
  `

  interface Data {
    productRecommendations: ShopifyProductNode[]
    products: { edges: { node: ShopifyProductNode }[] }
  }

  const data = await storefront<Data>(query, { productId, first })
  const recommended = data.productRecommendations.slice(0, first)
  if (recommended.length >= first) {
    return recommended.map(normalizeProduct)
  }
  return data.products.edges
    .map((e) => normalizeProduct(e.node))
    .filter((p) => p.id !== productId)
    .slice(0, first)
}
