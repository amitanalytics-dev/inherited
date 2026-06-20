const SHOP_DOMAIN = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN ?? ''
const TOKEN = process.env.JUDGEME_PUBLIC_TOKEN ?? ''

export interface JudgemeReview {
  id: number
  title: string
  body: string
  rating: number
  authorName: string
  createdAt: string
  verified: boolean
}

export async function fetchJudgemeReviews(handle: string): Promise<JudgemeReview[]> {
  if (!TOKEN || !SHOP_DOMAIN) return []

  const reviews: JudgemeReview[] = []
  let page = 1
  const perPage = 100

  try {
    while (true) {
      const url = `https://judge.me/api/v1/reviews?api_token=${TOKEN}&shop_domain=${SHOP_DOMAIN}&handle=${handle}&per_page=${perPage}&page=${page}`
      const res = await fetch(url, { next: { revalidate: 3600 } })
      if (!res.ok) break
      const data = await res.json()
      const batch = (data.reviews ?? []) as Array<{
        id: number
        title: string
        body: string
        rating: number
        reviewer: { name: string; verified_buyer: boolean }
        created_at: string
      }>
      for (const r of batch) {
        reviews.push({
          id: r.id,
          title: r.title ?? '',
          body: r.body ?? '',
          rating: r.rating,
          authorName: r.reviewer?.name ?? 'Customer',
          createdAt: r.created_at,
          verified: r.reviewer?.verified_buyer ?? false,
        })
      }
      if (batch.length < perPage) break
      page++
    }
  } catch {
    // silently return what we have
  }

  return reviews
}
