'use client'

import { useState } from 'react'

interface AccordionItem {
  title: string
  content: React.ReactNode
}

export default function Accordion({ items }: { items: AccordionItem[] }) {
  const [open, setOpen] = useState<number | null>(null)

  return (
    <div className="divide-y divide-brand-warm border-y border-brand-warm">
      {items.map((item, i) => (
        <div key={i}>
          <button
            onClick={() => setOpen(open === i ? null : i)}
            className="w-full flex items-center justify-between py-4 text-left"
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
          {open === i && (
            <div className="pb-5 font-body text-base text-brand-muted leading-relaxed space-y-2">
              {item.content}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
