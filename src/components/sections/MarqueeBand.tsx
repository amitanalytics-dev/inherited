'use client'

const SEGMENT =
  'Ghee-Powered Skincare · Ayurvedic Rituals · Made in the UK · CPSR Safety Tested · Cruelty Free · Natural Ingredients · '

// Two identical copies; CSS scrolls exactly -50% so the second copy
// aligns seamlessly with where the first started — no visible jump.
export default function MarqueeBand() {
  return (
    <div className="bg-brand-amber overflow-hidden py-3.5 select-none">
      <div className="marquee-track font-body text-[11px] tracking-[0.2em] uppercase text-brand-dark font-medium">
        <span className="whitespace-nowrap">{SEGMENT.repeat(6)}</span>
        <span className="whitespace-nowrap" aria-hidden="true">{SEGMENT.repeat(6)}</span>
      </div>
    </div>
  )
}
