import { NextResponse } from 'next/server'
import { adminConfigured, adminQuery } from '@/lib/admin-shopify'

export const dynamic = 'force-dynamic'

function checkAuth(request: Request): boolean {
  const password = process.env.ADMIN_PASSWORD
  if (!password) return false
  return request.headers.get('Authorization') === `Bearer ${password}`
}

const GET_MEDIA = `
  query getReviewMedia {
    shop {
      id
      metafield(namespace: "site", key: "review_media") { value }
    }
  }
`

const SET_METAFIELD = `
  mutation setMetafield($metafields: [MetafieldsSetInput!]!) {
    metafieldsSet(metafields: $metafields) {
      metafields { id }
      userErrors { field message }
    }
  }
`

export async function GET(request: Request) {
  if (!checkAuth(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  if (!adminConfigured()) return NextResponse.json({ media: {} })
  try {
    const data = await adminQuery<{ shop: { metafield: { value: string } | null } }>(GET_MEDIA)
    const media = JSON.parse(data.shop?.metafield?.value ?? '{}')
    return NextResponse.json({ media })
  } catch (e: unknown) {
    return NextResponse.json({ error: e instanceof Error ? e.message : 'Failed' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  if (!checkAuth(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  if (!adminConfigured()) return NextResponse.json({ error: 'Shopify not configured' }, { status: 400 })
  try {
    const { reviewId, mediaUrls } = await request.json() as { reviewId: string | number; mediaUrls: string[] }
    if (!reviewId) return NextResponse.json({ error: 'Invalid request' }, { status: 400 })

    const data = await adminQuery<{ shop: { id: string; metafield: { value: string } | null } }>(GET_MEDIA)
    const ownerId = data.shop.id
    const media: Record<string, string[]> = JSON.parse(data.shop?.metafield?.value ?? '{}')
    const key = String(reviewId)

    if (!mediaUrls || mediaUrls.length === 0) {
      delete media[key]
    } else {
      media[key] = mediaUrls
    }

    const result = await adminQuery(SET_METAFIELD, {
      metafields: [{ ownerId, namespace: 'site', key: 'review_media', type: 'json', value: JSON.stringify(media) }],
    })
    const err = result?.metafieldsSet?.userErrors?.[0]?.message
    if (err) return NextResponse.json({ error: err }, { status: 500 })

    return NextResponse.json({ success: true, media })
  } catch (e: unknown) {
    return NextResponse.json({ error: e instanceof Error ? e.message : 'Failed' }, { status: 500 })
  }
}
