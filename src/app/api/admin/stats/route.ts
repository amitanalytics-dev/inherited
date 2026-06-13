import { NextResponse } from 'next/server'
import { adminConfigured, adminQuery } from '@/lib/admin-shopify'

export const dynamic = 'force-dynamic'

const STATS_QUERY = `{
  orders(first: 50, sortKey: CREATED_AT, reverse: true) {
    nodes {
      id
      name
      createdAt
      displayFinancialStatus
      displayFulfillmentStatus
      totalPriceSet { shopMoney { amount currencyCode } }
      customer { displayName }
    }
  }
  shop { name }
}`

type OrderNode = {
  id: string
  name: string
  createdAt: string
  displayFinancialStatus: string | null
  displayFulfillmentStatus: string | null
  totalPriceSet: { shopMoney: { amount: string; currencyCode: string } }
  customer: { displayName: string } | null
}

export async function GET() {
  if (!adminConfigured()) {
    return NextResponse.json({ configured: false })
  }

  try {
    const data = await adminQuery<{
      orders: { nodes: OrderNode[] }
      shop: { name: string }
    }>(STATS_QUERY)

    const orders = data.orders?.nodes ?? []
    const now = Date.now()
    const startOfToday = new Date()
    startOfToday.setHours(0, 0, 0, 0)
    const sevenDaysAgo = now - 7 * 24 * 60 * 60 * 1000

    let ordersToday = 0
    let ordersLast7Days = 0
    let revenueLast7Days = 0
    let currency = 'GBP'

    for (const o of orders) {
      const t = new Date(o.createdAt).getTime()
      currency = o.totalPriceSet?.shopMoney?.currencyCode || currency
      if (t >= startOfToday.getTime()) ordersToday++
      if (t >= sevenDaysAgo) {
        ordersLast7Days++
        revenueLast7Days += parseFloat(o.totalPriceSet?.shopMoney?.amount || '0')
      }
    }

    const recentOrders = orders.slice(0, 10).map((o) => ({
      id: o.id,
      name: o.name,
      createdAt: o.createdAt,
      customer: o.customer?.displayName ?? 'Guest',
      total: o.totalPriceSet?.shopMoney?.amount ?? '0',
      currency: o.totalPriceSet?.shopMoney?.currencyCode ?? currency,
      financialStatus: o.displayFinancialStatus ?? 'UNKNOWN',
      fulfillmentStatus: o.displayFulfillmentStatus ?? 'UNFULFILLED',
    }))

    return NextResponse.json({
      configured: true,
      shopName: data.shop?.name ?? 'Inherited Skincare',
      ordersToday,
      ordersLast7Days,
      revenueLast7Days: Math.round(revenueLast7Days * 100) / 100,
      currency,
      recentOrders,
    })
  } catch (e: any) {
    return NextResponse.json(
      { configured: true, error: e?.message ?? 'Failed to load stats' },
      { status: 500 }
    )
  }
}
