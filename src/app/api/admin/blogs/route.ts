import { NextRequest, NextResponse } from 'next/server'
import { storefront } from '@/lib/shopify'
import { adminConfigured, adminQuery } from '@/lib/admin-shopify'

export const dynamic = 'force-dynamic'
export const maxDuration = 60

// Read via Storefront API — same source as the website, no extra scopes needed.
// Fetches up to 250 articles across all blogs sorted newest-first.
const LIST_QUERY = `
  query listArticles($first: Int!) {
    articles(first: $first, sortKey: PUBLISHED_AT, reverse: true) {
      edges {
        node {
          id
          title
          handle
          publishedAt
          contentHtml
          excerpt
          image { url altText }
          blog { handle title }
          seo { title description }
        }
      }
    }
  }
`

type StorefrontArticle = {
  id: string
  title: string
  handle: string
  publishedAt: string
  contentHtml: string
  excerpt: string | null
  image: { url: string; altText: string | null } | null
  blog: { handle: string; title: string }
  seo: { title: string | null; description: string | null } | null
}

export async function GET() {
  try {
    const data = await storefront<{
      articles: { edges: { node: StorefrontArticle }[] }
    }>(LIST_QUERY, { first: 250 }, { noStore: true })

    const articles = (data.articles?.edges ?? []).map(({ node: a }) => ({
      id: a.id,
      title: a.title,
      handle: a.handle,
      publishedAt: a.publishedAt,
      published: true, // Storefront only returns published articles
      bodyHtml: a.contentHtml ?? '',
      excerptHtml: a.excerpt ?? '',
      image: a.image?.url ?? null,
      blogHandle: a.blog?.handle ?? '',
      blogTitle: a.blog?.title ?? '',
    }))

    return NextResponse.json({ configured: true, articles })
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : 'Failed to load articles'
    return NextResponse.json({ configured: true, articles: [], error: message }, { status: 500 })
  }
}

// Write via Admin API — requires write_content scope on the Shopify app.
const ARTICLE_UPDATE = `mutation articleUpdate($id: ID!, $article: ArticleInput!) {
  articleUpdate(id: $id, article: $article) {
    article { id title publishedAt }
    userErrors { field message }
  }
}`

export async function PATCH(request: NextRequest) {
  if (!adminConfigured()) {
    return NextResponse.json({ success: false, error: 'Shopify admin credentials not configured.' }, { status: 400 })
  }
  try {
    const body = await request.json()
    const { id, title, bodyHtml, summaryHtml, published } = body

    if (!id) {
      return NextResponse.json({ success: false, error: 'Missing article id.' }, { status: 400 })
    }

    const input: Record<string, unknown> = {}
    if (typeof title === 'string') input.title = title
    if (typeof bodyHtml === 'string') input.bodyHtml = bodyHtml
    if (typeof summaryHtml === 'string') input.summaryHtml = summaryHtml
    if (typeof published === 'boolean') input.published = published

    const result = await adminQuery<{
      articleUpdate: { userErrors: { message: string }[] }
    }>(ARTICLE_UPDATE, { id, article: input })

    const err = result.articleUpdate.userErrors?.[0]?.message
    if (err) return NextResponse.json({ success: false, error: err }, { status: 422 })

    return NextResponse.json({ success: true })
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : 'Failed to save article'
    return NextResponse.json({ success: false, error: message }, { status: 500 })
  }
}
