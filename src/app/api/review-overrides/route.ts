import { NextResponse } from 'next/server'
import { adminConfigured, adminQuery } from '@/lib/admin-shopify'

export const dynamic = 'force-dynamic'

const GET_OVERRIDES = `
  query getReviewOverrides {
    shop {
      metafield(namespace: "site", key: "review_name_overrides") {
        value
      }
    }
  }
`

export async function GET() {
  if (!adminConfigured()) {
    return NextResponse.json({ overrides: {} })
  }
  try {
    const data = await adminQuery<{ shop: { metafield: { value: string } | null } }>(GET_OVERRIDES)
    const overrides: Record<string, string> = JSON.parse(data.shop?.metafield?.value ?? '{}')
    return NextResponse.json({ overrides }, {
      headers: { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300' },
    })
  } catch {
    return NextResponse.json({ overrides: {} })
  }
}
