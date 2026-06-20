import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET() {
  const token = process.env.JUDGEME_PUBLIC_TOKEN ?? ''
  const shopDomain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN ?? ''

  if (!token || !shopDomain) {
    return NextResponse.json({ error: 'Missing env vars', token: !!token, shopDomain: !!shopDomain })
  }

  try {
    const url = `https://judge.me/api/v1/reviews?api_token=${token}&shop_domain=${shopDomain}&per_page=100&page=1`
    const res = await fetch(url, { cache: 'no-store' })
    const status = res.status
    if (!res.ok) {
      const text = await res.text()
      return NextResponse.json({ error: 'API error', status, body: text })
    }
    const data = await res.json()
    const reviews = data.reviews ?? []
    const byHandle: Record<string, number> = {}
    for (const r of reviews) {
      byHandle[r.product_handle] = (byHandle[r.product_handle] ?? 0) + 1
    }
    return NextResponse.json({ ok: true, total: reviews.length, byHandle })
  } catch (e) {
    return NextResponse.json({ error: String(e) })
  }
}
