import { NextResponse } from 'next/server'
import { adminConfigured, adminQuery } from '@/lib/admin-shopify'

export const dynamic = 'force-dynamic'

// In-memory rate limiter: max 3 submissions per IP per 24 hours.
// Resets on server restart (acceptable — this is a soft spam guard, not a hard security control).
const WINDOW_MS = 24 * 60 * 60 * 1000
const MAX_PER_WINDOW = 3
const ipLog = new Map<string, { count: number; windowStart: number }>()

function isRateLimited(ip: string): boolean {
  const now = Date.now()
  const entry = ipLog.get(ip)
  if (!entry || now - entry.windowStart > WINDOW_MS) {
    ipLog.set(ip, { count: 1, windowStart: now })
    return false
  }
  if (entry.count >= MAX_PER_WINDOW) return true
  entry.count++
  return false
}

const GET_PENDING = `
  query getPendingReviews {
    shop {
      id
      metafield(namespace: "site", key: "pending_reviews") {
        value
      }
    }
  }
`

const SET_PENDING = `
  mutation setPendingReviews($metafields: [MetafieldsSetInput!]!) {
    metafieldsSet(metafields: $metafields) {
      metafields { id }
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
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown'
    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: 'Too many submissions. Please try again in 24 hours.' },
        { status: 429 }
      )
    }

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

    const data = await adminQuery<{ shop: { id: string; metafield: { value: string } | null } }>(GET_PENDING)
    const ownerId = data.shop.id
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
      metafields: [{ ownerId, namespace: 'site', key: 'pending_reviews', type: 'json', value: JSON.stringify(updated) }],
    })

    const err = result?.metafieldsSet?.userErrors?.[0]?.message
    if (err) return NextResponse.json({ error: err }, { status: 500 })

    return NextResponse.json({ success: true })
  } catch (e: unknown) {
    return NextResponse.json({ error: e instanceof Error ? e.message : 'Failed to submit review.' }, { status: 500 })
  }
}
