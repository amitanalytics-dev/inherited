import { NextRequest, NextResponse } from 'next/server'
import { adminConfigured, adminQuery } from '@/lib/admin-shopify'
import { DEFAULT_SETTINGS } from '@/lib/site-settings'

export const dynamic = 'force-dynamic'

export async function GET() {
  if (!adminConfigured()) {
    return NextResponse.json({ configured: false, settings: null })
  }

  try {
    const data = await adminQuery<{
      shop: { metafield: { value: string } | null }
    }>('{ shop { metafield(namespace: "site", key: "settings") { value } } }')

    const raw = data.shop?.metafield?.value
    const settings = raw ? JSON.parse(raw) : DEFAULT_SETTINGS
    return NextResponse.json({ configured: true, settings })
  } catch (e: any) {
    return NextResponse.json(
      { configured: true, settings: null, error: e?.message ?? 'Failed to load settings' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  if (!adminConfigured()) {
    return NextResponse.json(
      { success: false, error: 'Shopify Admin token not configured yet.' },
      { status: 400 }
    )
  }

  try {
    const settings = await request.json()

    // 1. Fetch shop id
    const shopData = await adminQuery<{ shop: { id: string } }>(
      '{ shop { id } }'
    )
    const ownerId = shopData.shop.id

    // 2. Write the metafield
    const result = await adminQuery<{
      metafieldsSet: {
        metafields: { id: string }[] | null
        userErrors: { field: string[] | null; message: string }[]
      }
    }>(
      `mutation SetSiteSettings($metafields: [MetafieldsSetInput!]!) {
        metafieldsSet(metafields: $metafields) {
          metafields { id }
          userErrors { field message }
        }
      }`,
      {
        metafields: [
          {
            ownerId,
            namespace: 'site',
            key: 'settings',
            type: 'json',
            value: JSON.stringify(settings),
          },
        ],
      }
    )

    const userErrors = result.metafieldsSet?.userErrors ?? []
    if (userErrors.length > 0) {
      return NextResponse.json(
        { success: false, errors: userErrors },
        { status: 422 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (e: any) {
    return NextResponse.json(
      { success: false, error: e?.message ?? 'Failed to save settings' },
      { status: 500 }
    )
  }
}
