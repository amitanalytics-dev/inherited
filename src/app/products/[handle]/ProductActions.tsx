'use client'

import { useState } from 'react'
import AddToCartButton from './AddToCartButton'
import type { ProductVariant } from '@/types'

interface ProductActionsProps {
  variants: ProductVariant[]
}

export default function ProductActions({ variants }: ProductActionsProps) {
  const [selectedId, setSelectedId] = useState(variants[0]?.id ?? '')
  const selected = variants.find((v) => v.id === selectedId) ?? variants[0]

  return (
    <>
      {variants.length > 1 && (
        <div className="mb-6">
          <p className="font-body text-xs tracking-widest uppercase text-brand-muted mb-2">
            {variants[0].selectedOptions[0]?.name ?? 'Option'}
          </p>
          <div className="flex flex-wrap gap-2">
            {variants.map((variant) => (
              <button
                key={variant.id}
                onClick={() => setSelectedId(variant.id)}
                disabled={!variant.availableForSale}
                className={`px-4 py-3 min-h-[44px] border font-body text-sm transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${
                  variant.id === selectedId
                    ? 'border-brand-amber text-brand-amber'
                    : 'border-brand-dark/20 hover:border-brand-amber hover:text-brand-amber'
                }`}
              >
                {variant.title}
              </button>
            ))}
          </div>
        </div>
      )}
      <AddToCartButton
        variantId={selected?.id}
        available={selected?.availableForSale ?? false}
      />
    </>
  )
}
