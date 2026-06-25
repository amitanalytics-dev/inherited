import { NextResponse } from 'next/server'
import { adminConfigured, adminQuery } from '@/lib/admin-shopify'

export const dynamic = 'force-dynamic'

export async function GET() {
  if (!adminConfigured()) return NextResponse.json({ media: {} }, { headers: { 'Cache-Control': 'public, s-maxage=60' } })
  try {
    const data = await adminQuery<{ shop: { metafield: { value: string } | null } }>(`
      query { shop { metafield(namespace: "site", key: "review_media") { value } } }
    `)
    const media = JSON.parse(data.shop?.metafield?.value ?? '{}')
    return NextResponse.json({ media }, { headers: { 'Cache-Control': 'public, s-maxage=60' } })
  } catch {
    return NextResponse.json({ media: {} }, { headers: { 'Cache-Control': 'public, s-maxage=60' } })
  }
}
