import { NextRequest, NextResponse } from 'next/server'
import { adminConfigured, adminQuery } from '@/lib/admin-shopify'

export const dynamic = 'force-dynamic'
export const maxDuration = 60

const LIST_QUERY = `{
  products(first: 50, sortKey: TITLE) {
    nodes {
      id
      title
      handle
      status
      descriptionHtml
      totalInventory
      featuredImage { url }
      images(first: 10) { nodes { id url } }
      variants(first: 1) { nodes { id price } }
    }
  }
}`

type VariantNode = { id: string; price: string }
type ImageNode = { id: string; url: string }
type ProductNode = {
  id: string
  title: string
  handle: string
  status: string
  descriptionHtml: string
  totalInventory: number | null
  featuredImage: { url: string } | null
  images: { nodes: ImageNode[] }
  variants: { nodes: VariantNode[] }
}

export async function GET() {
  if (!adminConfigured()) {
    return NextResponse.json({ configured: false, products: [] })
  }
  try {
    const data = await adminQuery<{ products: { nodes: ProductNode[] } }>(LIST_QUERY)
    const products = (data.products?.nodes ?? []).map((p) => ({
      id: p.id,
      title: p.title,
      handle: p.handle,
      status: p.status,
      descriptionHtml: p.descriptionHtml ?? '',
      inventory: p.totalInventory ?? 0,
      featuredImage: p.featuredImage?.url ?? p.images.nodes[0]?.url ?? null,
      images: p.images.nodes,
      variantId: p.variants.nodes[0]?.id ?? null,
      price: p.variants.nodes[0]?.price ?? '0',
    }))
    return NextResponse.json({ configured: true, products })
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : 'Failed to load products'
    return NextResponse.json({ configured: true, products: [], error: message }, { status: 500 })
  }
}

const PRODUCT_UPDATE = `mutation productUpdate($input: ProductInput!) {
  productUpdate(input: $input) {
    product { id }
    userErrors { field message }
  }
}`

const VARIANT_UPDATE = `mutation variantUpdate($productId: ID!, $variants: [ProductVariantsBulkInput!]!) {
  productVariantsBulkUpdate(productId: $productId, variants: $variants) {
    productVariants { id price }
    userErrors { field message }
  }
}`

const MEDIA_CREATE = `mutation mediaCreate($productId: ID!, $media: [CreateMediaInput!]!) {
  productCreateMedia(productId: $productId, media: $media) {
    media { ... on MediaImage { id } }
    mediaUserErrors { field message }
  }
}`

export async function POST(request: NextRequest) {
  if (!adminConfigured()) {
    return NextResponse.json({ success: false, error: 'Shopify not connected.' }, { status: 400 })
  }
  try {
    const body = await request.json()
    const { id, title, descriptionHtml, status, price, variantId, newImageUrl } = body

    if (!id) {
      return NextResponse.json({ success: false, error: 'Missing product id.' }, { status: 400 })
    }

    // 1. Update core product fields
    const prod = await adminQuery<{
      productUpdate: { userErrors: { message: string }[] }
    }>(PRODUCT_UPDATE, {
      input: {
        id,
        ...(typeof title === 'string' ? { title } : {}),
        ...(typeof descriptionHtml === 'string' ? { descriptionHtml } : {}),
        ...(status === 'ACTIVE' || status === 'DRAFT' ? { status } : {}),
      },
    })
    const pErr = prod.productUpdate.userErrors?.[0]?.message
    if (pErr) return NextResponse.json({ success: false, error: pErr }, { status: 422 })

    // 2. Update price on the first variant
    if (variantId && price != null && price !== '') {
      const v = await adminQuery<{
        productVariantsBulkUpdate: { userErrors: { message: string }[] }
      }>(VARIANT_UPDATE, {
        productId: id,
        variants: [{ id: variantId, price: String(price) }],
      })
      const vErr = v.productVariantsBulkUpdate.userErrors?.[0]?.message
      if (vErr) return NextResponse.json({ success: false, error: vErr }, { status: 422 })
    }

    // 3. Optionally attach a new image
    if (newImageUrl && typeof newImageUrl === 'string') {
      const m = await adminQuery<{
        productCreateMedia: { mediaUserErrors: { message: string }[] }
      }>(MEDIA_CREATE, {
        productId: id,
        media: [{ originalSource: newImageUrl, mediaContentType: 'IMAGE' }],
      })
      const mErr = m.productCreateMedia.mediaUserErrors?.[0]?.message
      if (mErr) return NextResponse.json({ success: false, error: mErr }, { status: 422 })
    }

    return NextResponse.json({ success: true })
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : 'Failed to save product'
    return NextResponse.json({ success: false, error: message }, { status: 500 })
  }
}
