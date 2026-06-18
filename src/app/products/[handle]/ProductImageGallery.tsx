'use client'

import { useState } from 'react'
import Image from 'next/image'

interface ProductImage {
  url: string
  altText: string | null
  width: number | null
  height: number | null
}

interface Props {
  images: ProductImage[]
  productTitle: string
}

export default function ProductImageGallery({ images, productTitle }: Props) {
  const [activeIndex, setActiveIndex] = useState(0)
  const active = images[activeIndex] ?? images[0]

  return (
    <div>
      {/* Main image */}
      <div className="relative aspect-[4/5] overflow-hidden bg-brand-warm">
        {active && (
          <Image
            src={active.url}
            alt={active.altText ?? productTitle}
            fill
            priority
            quality={90}
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover transition-opacity duration-300"
          />
        )}
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="mt-2 flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => setActiveIndex(i)}
              className={`relative flex-shrink-0 w-16 h-16 overflow-hidden bg-brand-warm border-2 transition-colors ${
                i === activeIndex ? 'border-brand-amber' : 'border-transparent hover:border-brand-amber/40'
              }`}
              aria-label={`View image ${i + 1}`}
            >
              <Image
                src={img.url}
                alt={img.altText ?? `${productTitle} view ${i + 1}`}
                fill
                sizes="64px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
