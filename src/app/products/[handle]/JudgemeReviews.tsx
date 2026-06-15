'use client'

import Script from 'next/script'

interface Props {
  productId: string // Shopify GID e.g. gid://shopify/Product/123456
}

export default function JudgemeReviews({ productId }: Props) {
  const numericId = productId.replace('gid://shopify/Product/', '')

  return (
    <div className="mt-16">
      <h2 className="font-display font-semibold text-2xl md:text-3xl text-brand-dark mb-8">
        Customer Reviews
      </h2>
      <div
        className="jdgm-widget jdgm-review-widget"
        data-id={numericId}
      />
      <Script
        id="jdgm-config"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.jdgm = window.jdgm || {};
            window.jdgm.SHOP_DOMAIN = 'leela-skincare.myshopify.com';
            window.jdgm.CDN_HOST = '//cdn.judge.me';
            window.jdgm.PLATFORM = 'shopify';
          `,
        }}
      />
      <Script
        src="//cdn.judge.me/assets/judge_me.js"
        strategy="afterInteractive"
      />
    </div>
  )
}
