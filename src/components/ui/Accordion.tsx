'use client'

import { useState } from 'react'

interface AccordionItem {
  title: string
  content: React.ReactNode
}

export default function Accordion({ items, expandAllOnDesktop }: { items: AccordionItem[]; expandAllOnDesktop?: boolean }) {
  const [open, setOpen] = useState<number | null>(null)

  return (
    <div className="divide-y divide-brand-warm border-y border-brand-warm">
      {items.map((item, i) => (
        <div key={i}>
          {/* Toggle button — hidden on md+ when expandAllOnDesktop */}
          <button
            onClick={() => setOpen(open === i ? null : i)}
            className={`w-full flex items-center justify-between py-4 text-left${expandAllOnDesktop ? ' md:hidden' : ''}`}
            aria-expanded={open === i}
          >
            <span className="font-body text-base font-medium text-brand-dark tracking-wide">
              {item.title}
            </span>
            <span
              aria-hidden
              className={`text-brand-amber text-xl font-light leading-none flex-shrink-0 ml-4 transition-transform duration-200 ${open === i ? 'rotate-45' : ''}`}
            >
              +
            </span>
          </button>
          {/* Static title on desktop when expandAllOnDesktop */}
          {expandAllOnDesktop && (
            <div className="hidden md:block py-4">
              <span className="font-body text-base font-medium text-brand-dark tracking-wide">
                {item.title}
              </span>
            </div>
          )}
          {/* Content: mobile uses accordion state; desktop always visible when expandAllOnDesktop */}
          <div
            className={`pb-5 font-body text-base text-brand-muted leading-relaxed space-y-2 ${
              expandAllOnDesktop
                ? `md:block ${open === i ? '' : 'hidden'}`
                : open === i
                ? ''
                : 'hidden'
            }`}
          >
            {item.content}
          </div>
        </div>
      ))}
    </div>
  )
}
