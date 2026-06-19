import { NextResponse } from 'next/server'
import { adminConfigured, adminQuery } from '@/lib/admin-shopify'

export const dynamic = 'force-dynamic'

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

const GET_APPROVED = `
  query getApprovedReviews {
    shop {
      metafield(namespace: "site", key: "customer_reviews") {
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

interface PendingReview {
  id: string
  productHandle: string
  authorName: string
  rating: number
  title: string
  body: string
  createdAt: string
  status: 'pending'
}

interface ApprovedReview {
  id: string
  authorName: string
  rating: number
  title: string
  body: string
  createdAt: string
  verified: boolean
}

export async function GET() {
  if (!adminConfigured()) {
    return NextResponse.json({ reviews: [], configured: false })
  }
  try {
    const data = await adminQuery<{ shop: { id: string; metafield: { value: string } | null } }>(GET_PENDING)
    const reviews: PendingReview[] = JSON.parse(data.shop?.metafield?.value ?? '[]')
    return NextResponse.json({ reviews, configured: true })
  } catch (e: unknown) {
    return NextResponse.json({ error: e instanceof Error ? e.message : 'Failed to load.' }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  if (!adminConfigured()) {
    return NextResponse.json({ error: 'Shopify not configured.' }, { status: 400 })
  }
  try {
    const { id, action } = await request.json() as { id: string; action: 'approve' | 'reject' }
    if (!id || !['approve', 'reject'].includes(action)) {
      return NextResponse.json({ error: 'Invalid request.' }, { status: 400 })
    }

    // Load shop ID + both metafields in parallel
    const [pendingData, approvedData] = await Promise.all([
      adminQuery<{ shop: { id: string; metafield: { value: string } | null } }>(GET_PENDING),
      adminQuery<{ shop: { metafield: { value: string } | null } }>(GET_APPROVED),
    ])
    const ownerId = pendingData.shop.id

    const pending: PendingReview[] = JSON.parse(pendingData.shop?.metafield?.value ?? '[]')
    const approvedAll: Record<string, ApprovedReview[]> = JSON.parse(approvedData.shop?.metafield?.value ?? '{}')

    const review = pending.find((r) => r.id === id)
    if (!review) return NextResponse.json({ error: 'Review not found.' }, { status: 404 })

    const updatedPending = pending.filter((r) => r.id !== id)
    const saves: Array<{ ownerId: string; namespace: string; key: string; type: string; value: string }> = [
      { ownerId, namespace: 'site', key: 'pending_reviews', type: 'json', value: JSON.stringify(updatedPending) },
    ]

    if (action === 'approve') {
      const approved: ApprovedReview = {
        id: review.id,
        authorName: review.authorName,
        rating: review.rating,
        title: review.title,
        body: review.body,
        createdAt: review.createdAt,
        verified: true,
      }
      const existing = approvedAll[review.productHandle] ?? []
      approvedAll[review.productHandle] = [approved, ...existing]
      saves.push({ ownerId, namespace: 'site', key: 'customer_reviews', type: 'json', value: JSON.stringify(approvedAll) })
    }

    const result = await adminQuery(SET_METAFIELD, { metafields: saves })
    const err = result?.metafieldsSet?.userErrors?.[0]?.message
    if (err) return NextResponse.json({ error: err }, { status: 500 })

    return NextResponse.json({ success: true })
  } catch (e: unknown) {
    return NextResponse.json({ error: e instanceof Error ? e.message : 'Failed to update.' }, { status: 500 })
  }
}
