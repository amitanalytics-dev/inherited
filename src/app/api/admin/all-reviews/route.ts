import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

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

  const token = (process.env.JUDGEME_PUBLIC_TOKEN ?? '').replace(/^﻿/, '').trim()
  const shopDomain = (process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN ?? '').replace(/^﻿/, '').trim()
  if (!token || !shopDomain) {
    return NextResponse.json({ reviews: [] })
  }

  const reviews: Array<{
    id: number
    authorName: string
    rating: number
    title: string
    body: string
    createdAt: string
    productHandle: string
    verified: boolean
  }> = []

  let page = 1
  const perPage = 100

  try {
    while (true) {
      const url = `https://judge.me/api/v1/reviews?api_token=${token}&shop_domain=${shopDomain}&per_page=${perPage}&page=${page}`
      const res = await fetch(url, { cache: 'no-store' })
      if (!res.ok) break
      const data = await res.json()
      const batch = (data.reviews ?? []) as Array<{
        id: number
        title: string
        body: string
        rating: number
        reviewer: { name: string; verified_buyer: boolean }
        created_at: string
        product_handle: string
      }>
      for (const r of batch) {
        reviews.push({
          id: r.id,
          authorName: r.reviewer?.name ?? 'Customer',
          rating: r.rating,
          title: r.title ?? '',
          body: r.body ?? '',
          createdAt: r.created_at,
          productHandle: r.product_handle,
          verified: r.reviewer?.verified_buyer ?? false,
        })
      }
      if (batch.length < perPage) break
      page++
    }
  } catch {
    // return what we have
  }

  return NextResponse.json({ reviews })
}
