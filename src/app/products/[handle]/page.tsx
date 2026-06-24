import type { Metadata } from 'next'
import Link from 'next/link'
import Script from 'next/script'
import { notFound } from 'next/navigation'
import { getProduct, getRelatedProducts } from '@/lib/queries'
import { getFallbackProduct, getFallbackRelated } from '@/lib/fallback'
import ProductCard from '@/components/ui/ProductCard'
import ProductActions from './ProductActions'
import ProductImageGallery from './ProductImageGallery'
import JudgemeReviews from './JudgemeReviews'
import RichText from '@/components/ui/RichText'
import Accordion from '@/components/ui/Accordion'
import ProductFAQ from './ProductFAQ'
import { SITE_URL } from '@/lib/site-url'
import type { Product } from '@/types'

function sanitizeHtml(html: string): string {
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/\bon\w+\s*=\s*["'][^"']*["']/gi, '')
    .replace(/javascript\s*:/gi, '')
}

interface PageProps {
  params: { handle: string }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  try {
    const product = (await getProduct(params.handle)) ?? getFallbackProduct(params.handle)
    if (!product) return { title: 'Product Not Found' }
    const canonical = `${SITE_URL}/products/${product.handle}`
    return {
      title: product.seo.title ?? product.title,
      description: product.seo.description ?? product.description,
      alternates: { canonical },
      openGraph: {
        type: 'website',
        url: canonical,
        images: product.images[0] ? [{ url: product.images[0].url, width: product.images[0].width ?? 800, height: product.images[0].height ?? 800, alt: product.images[0].altText ?? product.title }] : [],
      },
    }
  } catch {
    return { title: 'Product' }
  }
}

export default async function ProductPage({ params }: PageProps) {
  let product: Product | null = null
  let related: Product[] = []

  try {
    product = await getProduct(params.handle)
    if (product) {
      related = await getRelatedProducts(product.id, 4)
    }
  } catch {
    // Fallback handled below
  }

  // Static fallback when the Storefront API is unavailable
  if (!product) {
    product = getFallbackProduct(params.handle)
    if (product) {
      related = getFallbackRelated(params.handle, 4)
    }
  }

  if (!product) {
    notFound()
  }

  const price = product.variants[0]?.price ?? product.priceRange.minVariantPrice
  const compareAtPrice =
    product.variants[0]?.compareAtPrice ?? product.compareAtPriceRange?.minVariantPrice

  const formattedPrice = new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: price.currencyCode,
    minimumFractionDigits: 0,
  }).format(parseFloat(price.amount))

  const hasDiscount =
    compareAtPrice &&
    parseFloat(compareAtPrice.amount) > parseFloat(price.amount)

  const formattedCompare = hasDiscount
    ? new Intl.NumberFormat('en-GB', {
        style: 'currency',
        currency: compareAtPrice!.currencyCode,
        minimumFractionDigits: 0,
      }).format(parseFloat(compareAtPrice!.amount))
    : null

  const ratingMeta = product.metafields?.find((m) => m?.namespace === 'reviews' && m?.key === 'rating')
  const ratingCountMeta = product.metafields?.find((m) => m?.namespace === 'reviews' && m?.key === 'rating_count')
  const ratingValue = ratingMeta?.value
    ? (() => { try { return parseFloat(JSON.parse(ratingMeta.value).value) } catch { return null } })()
    : null
  const ratingCount = ratingCountMeta?.value ? parseInt(ratingCountMeta.value, 10) : null

  const ingredients = product.metafields?.find((m) => m?.key === 'ingredients')
  const howToUse = product.metafields?.find((m) => m?.key === 'how_to_use')
  const benefitIconsMeta = product.metafields?.find((m) => m?.key === 'benefit_icons')
  const productDetailsMeta = product.metafields?.find((m) => m?.key === 'product_details')
  const whyYouLoveIt = product.metafields?.find((m) => m?.key === 'why_you_will_love_it')
  const whoItsGoodFor = product.metafields?.find((m) => m?.key === 'who_good_for')
  const keyIngredients = product.metafields?.find((m) => m?.key === 'key_ingredients')
  const theExperience = product.metafields?.find((m) => m?.key === 'the_experience')
  const deliveryShipping = product.metafields?.find((m) => m?.key === 'delivery_shipping')

  // benefit_icons stored as comma-separated string e.g. "Soothes,Strengthens,Hydrates,Softens"
  const benefitIcons = benefitIconsMeta?.value
    ? benefitIconsMeta.value.split(',').map((s: string) => s.trim()).filter(Boolean)
    : []

  // Build accordion items — only include sections that have content
  const accordionItems = [
    ...(productDetailsMeta?.value ? [{
      title: 'Product Details',
      content: <RichText content={productDetailsMeta.value} />,
    }] : []),
    ...(whyYouLoveIt?.value ? [{
      title: "Why You'll Love It",
      content: <RichText content={whyYouLoveIt.value} />,
    }] : []),
    ...(whoItsGoodFor?.value ? [{
      title: "Who It's Good For",
      content: <p className="font-body text-base text-brand-muted leading-relaxed">{whoItsGoodFor.value}</p>,
    }] : []),
    ...(keyIngredients?.value ? [{
      title: 'Key Ingredients',
      content: (
        <div
          className="font-body text-base text-brand-muted leading-relaxed space-y-2 [&_strong]:font-semibold [&_strong]:text-brand-dark [&_p]:mb-2"
          dangerouslySetInnerHTML={{ __html: sanitizeHtml(keyIngredients.value) }}
        />
      ),
    }] : []),
    ...(theExperience?.value ? [{
      title: 'The Experience',
      content: (
        <div className="space-y-1">
          {theExperience.value.split('\n').filter(Boolean).map((line: string, i: number) => (
            <p key={i} className="font-body text-base text-brand-muted">{line}</p>
          ))}
        </div>
      ),
    }] : []),
    {
      title: 'Delivery & Shipping (UK Only)',
      content: deliveryShipping?.value
        ? <RichText content={deliveryShipping.value} />
        : (
          <ul className="space-y-1.5 font-body text-sm text-brand-muted">
            <li>Free tracked UK delivery on orders over £55</li>
            <li>Ships within 2 working days (Mon–Fri)</li>
            <li>UK delivery 2–3 working days after dispatch</li>
            <li>Returns accepted within 14 days of delivery</li>
          </ul>
        ),
    },
  ]

  const productUrl = `${SITE_URL}/products/${product.handle}`
  const productSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.title,
    description: product.description,
    brand: { '@type': 'Brand', name: product.vendor || 'Inherited Skincare' },
    url: productUrl,
    image: product.images.map((img) => img.url),
    offers: {
      '@type': 'Offer',
      url: productUrl,
      priceCurrency: price.currencyCode,
      price: parseFloat(price.amount).toFixed(2),
      availability: product.availableForSale
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
      seller: { '@type': 'Organization', name: 'Inherited Skincare' },
    },
  }

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Products', item: `${SITE_URL}/products` },
      { '@type': 'ListItem', position: 3, name: product.title, item: productUrl },
    ],
  }

  return (
    <div className="min-h-screen bg-brand-cream pt-24 md:pt-28">
      <Script id="product-schema" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }} />
      <Script id="breadcrumb-schema" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <nav className="flex items-center gap-2 font-body text-xs text-brand-muted">
          <Link href="/" className="hover:text-brand-amber transition-colors">Home</Link>
          <span>/</span>
          <Link href="/products" className="hover:text-brand-amber transition-colors">Products</Link>
          <span>/</span>
          <span className="text-brand-dark">{product.title}</span>
        </nav>
      </div>

      {/* Product main */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Images */}
          <div>
            <ProductImageGallery images={product.images} productTitle={product.title} />
          </div>

          {/* Details */}
          <div className="lg:pt-4 lg:text-center">
            {/* Tags */}
            {product.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-4 lg:justify-center">
                {product.tags.slice(0, 3).map((tag) => (
                  <span key={tag} className="font-body text-[10px] tracking-widest uppercase text-brand-amber bg-brand-amber/10 px-2.5 py-1">
                    {tag}
                  </span>
                ))}
              </div>
            )}

            <h1 className="font-display font-semibold text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-brand-dark leading-tight mb-3">
              {product.title}
            </h1>

            {/* Star rating */}
            {ratingValue !== null && ratingCount !== null && ratingCount > 0 && (
              <a href="#reviews" className="flex items-center gap-2 mb-4 w-fit hover:opacity-75 transition-opacity lg:mx-auto">
                <div className="flex items-center gap-0.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg key={star} className="w-4 h-4" viewBox="0 0 20 20" fill={star <= Math.round(ratingValue) ? '#C8923A' : 'none'} stroke="#C8923A" strokeWidth="1.5">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <span className="font-body text-sm text-brand-dark font-medium">{ratingValue.toFixed(1)}</span>
                <span className="font-body text-sm text-brand-muted">({ratingCount} reviews)</span>
              </a>
            )}

            {/* Price */}
            <div className="flex items-center gap-3 mb-6 lg:justify-center">
              <span className="font-body text-xl sm:text-2xl font-medium text-brand-dark">
                {formattedPrice}
              </span>
              {formattedCompare && (
                <span className="font-body text-base sm:text-lg text-brand-muted line-through">
                  {formattedCompare}
                </span>
              )}
              {!product.availableForSale && (
                <span className="font-body text-xs tracking-widest uppercase text-white bg-brand-muted px-3 py-1">
                  Sold Out
                </span>
              )}
            </div>

            {/* Description */}
            <div className="font-body text-base text-brand-muted leading-relaxed mb-8 space-y-3">
              <p>{product.description}</p>
            </div>

            {/* Variant selector + Add to Cart */}
            <ProductActions variants={product.variants} />

            {/* Trust badges — flex-wrap centers any overflow row; 5-col on sm+ */}
            <div className="mt-6 border-t border-b border-brand-warm py-5">
              <div className="flex flex-wrap justify-center sm:flex-nowrap gap-y-4">
                {[
                  { icon: (
                    <svg className="w-5 h-5 text-brand-amber" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 22V12M12 12C12 7 7 4 3 5c0 5 3 9 9 7M12 12c0-5 5-8 9-7-1 5-4 8-9 7" />
                    </svg>
                  ), label: 'Natural Ingredients' },
                  { icon: (
                    <svg className="w-5 h-5 text-brand-amber" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    </svg>
                  ), label: 'CPSR Safety Tested' },
                  { icon: (
                    <svg className="w-5 h-5 text-brand-amber" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5z" />
                      <line x1="16" y1="8" x2="2" y2="22" />
                      <line x1="17.5" y1="15" x2="9" y2="15" />
                    </svg>
                  ), label: 'Cruelty Free' },
                  { icon: (
                    <svg className="w-5 h-5 text-brand-amber" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                  ), label: 'Made in the UK' },
                  { icon: (
                    <svg className="w-5 h-5 text-brand-amber" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>
                  ), label: 'Loved by 1,800+' },
                ].map(({ icon, label }) => (
                  <div key={label} className="flex flex-col items-center text-center gap-1.5 w-1/3 sm:flex-1 px-1">
                    {icon}
                    <span className="font-body text-[9px] tracking-widest uppercase text-brand-muted leading-tight">
                      {label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Benefit icons */}
            {benefitIcons.length > 0 && (
              <div className="mt-5 flex flex-wrap gap-2 lg:justify-center">
                {benefitIcons.map((label: string) => (
                  <span
                    key={label}
                    className="font-body text-[10px] tracking-widest uppercase text-brand-green bg-brand-green/10 px-3 py-1.5 border border-brand-green/20"
                  >
                    {label}
                  </span>
                ))}
              </div>
            )}

            {/* Ingredients */}
            {ingredients?.value && (
              <div className="mt-5">
                <h3 className="font-display font-semibold text-xl text-brand-dark mb-2">
                  Ingredients
                </h3>
                <p className="font-body text-xs text-brand-muted/70 leading-relaxed">
                  {ingredients.value}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* How to Use */}
        {howToUse?.value && (
          <div className="mt-10 max-w-3xl">
            <h3 className="font-display font-semibold text-2xl md:text-3xl text-brand-dark mb-4">
              How to Use
            </h3>
            <RichText content={howToUse.value} className="font-body text-base text-brand-muted leading-relaxed" />
          </div>
        )}

        {/* Product info accordion */}
        <div className="max-w-3xl mt-12">
          <Accordion items={accordionItems} />
        </div>

        {/* FAQs */}
        <ProductFAQ />

        {/* Customer reviews */}
        <div className="max-w-3xl">
          <JudgemeReviews
            ratingValue={ratingValue}
            ratingCount={ratingCount}
            productHandle={product.handle}
          />
        </div>
      </div>

      {/* Related products */}
      {related.length > 0 && (
        <div className="bg-brand-warm py-10 md:py-12 mt-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="font-display font-semibold text-3xl md:text-4xl text-brand-dark text-center mb-6">
              Complete the Ritual
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-5 md:gap-6">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
