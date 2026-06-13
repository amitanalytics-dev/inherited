'use client'

const MARQUEE_TEXT =
  'Ghee-Powered Skincare · Ayurvedic Rituals · Made in the UK · CPSR Safety Tested · Cruelty Free · Natural Ingredients · '

const items = Array.from({ length: 3 }, (_, i) => (
  <span key={i} className="whitespace-nowrap">
    {MARQUEE_TEXT}
  </span>
))

export default function MarqueeBand() {
  return (
    <div className="bg-brand-amber overflow-hidden py-3.5 select-none">
      <div className="flex">
        <div className="marquee-track font-body text-[11px] tracking-[0.2em] uppercase text-brand-dark font-medium">
          {items}
          {items}
        </div>
      </div>
    </div>
  )
}
