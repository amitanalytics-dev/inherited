import { NextResponse } from 'next/server'
import { adminConfigured, adminQuery } from '@/lib/admin-shopify'

export const dynamic = 'force-dynamic'

const GET_PENDING = `
  query getPendingReviews {
    shop {
      metafield(namespace: "site", key: "pending_reviews") {
        value
      }
    }
  }
`

const SET_PENDING = `
  mutation setPendingReviews($metafields: [MetafieldsSetInput!]!) {
    shopMetafieldsSet(metafields: $metafields) {
      userErrors { field message }
    }
  }
`

export interface PendingReview {
  id: string
  productHandle: string
  authorName: string
  rating: number
  title: string
  body: string
  createdAt: string
  status: 'pending'
}

export async function POST(request: Request) {
  try {
    const { productHandle, authorName, rating, title, body } = await request.json()

    if (!productHandle || !authorName?.trim() || !body?.trim()) {
      return NextResponse.json({ error: 'Missing required fields.' }, { status: 400 })
    }
    if (typeof rating !== 'number' || rating < 1 || rating > 5) {
      return NextResponse.json({ error: 'Rating must be 1–5.' }, { status: 400 })
    }

    if (!adminConfigured()) {
      return NextResponse.json({ error: 'Reviews are not enabled (Shopify admin not configured).' }, { status: 503 })
    }

    const data = await adminQuery<{ shop: { metafield: { value: string } | null } }>(GET_PENDING)
    const existing: PendingReview[] = JSON.parse(data.shop?.metafield?.value ?? '[]')

    const review: PendingReview = {
      id: crypto.randomUUID(),
      productHandle: productHandle.slice(0, 100),
      authorName: authorName.trim().slice(0, 80),
      rating,
      title: (title ?? '').trim().slice(0, 150),
      body: body.trim().slice(0, 2000),
      createdAt: new Date().toISOString(),
      status: 'pending',
    }

    // Keep last 200 pending reviews
    const updated = [review, ...existing].slice(0, 200)

    const result = await adminQuery(SET_PENDING, {
      metafields: [{ namespace: 'site', key: 'pending_reviews', type: 'json', value: JSON.stringify(updated), ownerId: null }],
    })

    const err = result?.shopMetafieldsSet?.userErrors?.[0]?.message
    if (err) return NextResponse.json({ error: err }, { status: 500 })

    return NextResponse.json({ success: true })
  } catch (e: unknown) {
    return NextResponse.json({ error: e instanceof Error ? e.message : 'Failed to submit review.' }, { status: 500 })
  }
}
