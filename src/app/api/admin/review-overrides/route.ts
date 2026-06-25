import { NextResponse } from 'next/server'
import { adminConfigured, adminQuery } from '@/lib/admin-shopify'

export const dynamic = 'force-dynamic'

const GET_OVERRIDES = `
  query getReviewOverrides {
    shop {
      id
      metafield(namespace: "site", key: "review_name_overrides") {
        value
      }
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

function checkAuth(request: Request): boolean {
  const password = process.env.ADMIN_PASSWORD
  if (!password) return false
  const auth = request.headers.get('Authorization') ?? ''
  return auth === `Bearer ${password}`
}

export async function GET(request: Request) {
  if (!checkAuth(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  if (!adminConfigured()) {
    return NextResponse.json({ overrides: {} })
  }
  try {
    const data = await adminQuery<{ shop: { metafield: { value: string } | null } }>(GET_OVERRIDES)
    const overrides: Record<string, string> = JSON.parse(data.shop?.metafield?.value ?? '{}')
    return NextResponse.json({ overrides })
  } catch (e: unknown) {
    return NextResponse.json({ error: e instanceof Error ? e.message : 'Failed' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  if (!checkAuth(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  if (!adminConfigured()) {
    return NextResponse.json({ error: 'Shopify not configured' }, { status: 400 })
  }
  try {
    const { reviewId, displayName } = await request.json() as { reviewId: string | number; displayName: string }
    if (!reviewId || typeof displayName !== 'string') {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
    }

    const data = await adminQuery<{ shop: { id: string; metafield: { value: string } | null } }>(GET_OVERRIDES)
    const ownerId = data.shop.id
    const overrides: Record<string, string> = JSON.parse(data.shop?.metafield?.value ?? '{}')

    if (displayName.trim()) {
      overrides[String(reviewId)] = displayName.trim()
    } else {
      delete overrides[String(reviewId)]
    }

    const result = await adminQuery(SET_METAFIELD, {
      metafields: [{ ownerId, namespace: 'site', key: 'review_name_overrides', type: 'json', value: JSON.stringify(overrides) }],
    })
    const err = result?.metafieldsSet?.userErrors?.[0]?.message
    if (err) return NextResponse.json({ error: err }, { status: 500 })

    return NextResponse.json({ success: true, overrides })
  } catch (e: unknown) {
    return NextResponse.json({ error: e instanceof Error ? e.message : 'Failed' }, { status: 500 })
  }
}
