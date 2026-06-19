import { NextRequest, NextResponse } from 'next/server'
import { adminConfigured, adminQuery } from '@/lib/admin-shopify'

export const dynamic = 'force-dynamic'
export const maxDuration = 60

const LIST_QUERY = `{
  blogs(first: 10) {
    nodes {
      id
      title
      articles(first: 250, sortKey: PUBLISHED_AT, reverse: true) {
        nodes {
          id
          title
          handle
          publishedAt
          bodyHtml
          excerptHtml
          image { url altText }
        }
      }
    }
  }
}`

type ArticleNode = {
  id: string
  title: string
  handle: string
  publishedAt: string | null
  bodyHtml: string
  excerptHtml: string | null
  image: { url: string; altText: string | null } | null
}

type BlogNode = {
  id: string
  title: string
  articles: { nodes: ArticleNode[] }
}

export async function GET() {
  if (!adminConfigured()) {
    return NextResponse.json({ configured: false, articles: [] })
  }
  try {
    const data = await adminQuery<{ blogs: { nodes: BlogNode[] } }>(LIST_QUERY)
    const articles = (data.blogs?.nodes ?? []).flatMap((blog) =>
      (blog.articles?.nodes ?? []).map((a) => ({
        id: a.id,
        blogId: blog.id,
        blogTitle: blog.title,
        title: a.title,
        handle: a.handle,
        publishedAt: a.publishedAt,
        published: !!a.publishedAt,
        bodyHtml: a.bodyHtml ?? '',
        excerptHtml: a.excerptHtml ?? '',
        image: a.image?.url ?? null,
      }))
    )
    return NextResponse.json({ configured: true, articles })
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : 'Failed to load articles'
    return NextResponse.json({ configured: true, articles: [], error: message }, { status: 500 })
  }
}

const ARTICLE_UPDATE = `mutation articleUpdate($id: ID!, $article: ArticleInput!) {
  articleUpdate(id: $id, article: $article) {
    article { id title publishedAt }
    userErrors { field message }
  }
}`

export async function PATCH(request: NextRequest) {
  if (!adminConfigured()) {
    return NextResponse.json({ success: false, error: 'Shopify not connected.' }, { status: 400 })
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
