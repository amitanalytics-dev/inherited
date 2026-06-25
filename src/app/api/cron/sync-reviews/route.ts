import { NextResponse } from 'next/server'
import { adminConfigured, adminQuery } from '@/lib/admin-shopify'

export const dynamic = 'force-dynamic'
export const maxDuration = 60

const SHOP_DOMAIN = (process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN ?? '').replace(/^﻿/, '').trim()
const JUDGEME_TOKEN = (process.env.JUDGEME_PUBLIC_TOKEN ?? '').replace(/^﻿/, '').trim()

function checkAuth(request: Request): boolean {
  const secret = process.env.CRON_SECRET
  if (!secret) return false
  return request.headers.get('Authorization') === `Bearer ${secret}`
}

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

const GET_PENDING = `
  query { shop { id metafield(namespace: "site", key: "pending_reviews") { value } } }
`
const GET_APPROVED = `
  query { shop { metafield(namespace: "site", key: "customer_reviews") { value } } }
`
const GET_PRODUCT_ID = `
  query getProduct($handle: String!) { product(handle: $handle) { id } }
`
const SET_METAFIELD = `
  mutation setMetafield($metafields: [MetafieldsSetInput!]!) {
    metafieldsSet(metafields: $metafields) {
      metafields { id }
      userErrors { field message }
    }
  }
`

async function submitToJudgeMe(review: PendingReview, shopifyProductId: string | null) {
  if (!JUDGEME_TOKEN || !SHOP_DOMAIN) return false
  try {
    // Extract numeric product ID from GID: gid://shopify/Product/123456
    const numericId = shopifyProductId
      ? parseInt(shopifyProductId.split('/').pop() ?? '0', 10)
      : null
    if (!numericId) return false

    const payload = {
      api_token: JUDGEME_TOKEN,
      shop_domain: SHOP_DOMAIN,
      platform: 'shopify',
      id: numericId,
      email: `review-${review.id}@noreply.inheritedskincare.com`,
      name: review.authorName,
      rating: review.rating,
      title: review.title || '',
      body: review.body,
      created_at: review.createdAt,
    }

    const res = await fetch('https://judge.me/api/v1/reviews', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    return res.ok || res.status === 201
  } catch {
    return false
  }
}

export async function GET(request: Request) {
  if (!checkAuth(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  if (!adminConfigured()) {
    return NextResponse.json({ skipped: true, reason: 'Shopify not configured' })
  }

  try {
    const [pendingData, approvedData] = await Promise.all([
      adminQuery<{ shop: { id: string; metafield: { value: string } | null } }>(GET_PENDING),
      adminQuery<{ shop: { metafield: { value: string } | null } }>(GET_APPROVED),
    ])

    const ownerId = pendingData.shop.id
    const pending: PendingReview[] = JSON.parse(pendingData.shop?.metafield?.value ?? '[]')
    const approvedAll: Record<string, ApprovedReview[]> = JSON.parse(approvedData.shop?.metafield?.value ?? '{}')

    if (pending.length === 0) {
      return NextResponse.json({ synced: 0, message: 'No pending reviews.' })
    }

    // Look up Shopify product IDs for all unique handles in one batch
    const uniqueHandles = Array.from(new Set(pending.map((r) => r.productHandle)))
    const productIds: Record<string, string | null> = {}
    await Promise.all(
      uniqueHandles.map(async (handle) => {
        try {
          const d = await adminQuery<{ product: { id: string } | null }>(GET_PRODUCT_ID, { handle })
          productIds[handle] = d.product?.id ?? null
        } catch {
          productIds[handle] = null
        }
      })
    )

    let synced = 0
    const remainingPending: PendingReview[] = []

    for (const review of pending) {
      const shopifyId = productIds[review.productHandle] ?? null
      const sentToJudgeMe = await submitToJudgeMe(review, shopifyId)

      // Always approve to customer_reviews so it appears on site immediately
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
      // Avoid duplicates
      if (!existing.some((r) => r.id === review.id)) {
        approvedAll[review.productHandle] = [approved, ...existing]
      }

      if (sentToJudgeMe) {
        synced++
      } else {
        // Keep in pending if Judge.me failed (will retry next run)
        remainingPending.push(review)
      }
    }

    // Write updated metafields
    const saves = [
      { ownerId, namespace: 'site', key: 'pending_reviews', type: 'json', value: JSON.stringify(remainingPending) },
      { ownerId, namespace: 'site', key: 'customer_reviews', type: 'json', value: JSON.stringify(approvedAll) },
    ]
    const result = await adminQuery(SET_METAFIELD, { metafields: saves })
    const err = result?.metafieldsSet?.userErrors?.[0]?.message
    if (err) return NextResponse.json({ error: err }, { status: 500 })

    return NextResponse.json({
      synced,
      approvedOnSite: pending.length,
      remainingPending: remainingPending.length,
    })
  } catch (e: unknown) {
    return NextResponse.json({ error: e instanceof Error ? e.message : 'Sync failed.' }, { status: 500 })
  }
}
