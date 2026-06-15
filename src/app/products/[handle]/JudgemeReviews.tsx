'use client'

import { useEffect, useRef } from 'react'

interface Props {
  productId: string // Shopify GID e.g. gid://shopify/Product/123456
}

export default function JudgemeReviews({ productId }: Props) {
  const numericId = productId.replace('gid://shopify/Product/', '')
  const loaded = useRef(false)

  useEffect(() => {
    if (loaded.current) return
    loaded.current = true

    // Set config before script loads
    ;(window as any).jdgm = (window as any).jdgm || {}
    ;(window as any).jdgm.SHOP_DOMAIN = 'leela-skincare.myshopify.com'
    ;(window as any).jdgm.CDN_HOST = 'https://cdn.judge.me'
    ;(window as any).jdgm.PLATFORM = 'shopify'

    const script = document.createElement('script')
    script.src = 'https://cdn.judge.me/assets/v2.1/static_widget.js'
    script.async = true
    document.body.appendChild(script)
  }, [])

  return (
    <div className="mt-16">
      <h2 className="font-display font-semibold text-2xl md:text-3xl text-brand-dark mb-8">
        Customer Reviews
      </h2>
      <div
        data-host="https://judge.me"
        data-shop-domain="leela-skincare.myshopify.com"
        data-platform="shopify"
        data-widget-type="product_review"
        id="jdgm-widget"
        className="jdgm-widget jdgm-review-widget"
        data-id={numericId}
      />
    </div>
  )
}
