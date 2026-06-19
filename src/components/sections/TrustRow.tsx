import { Leaf, ShieldCheck, Rabbit, MapPin, Star } from 'lucide-react'

const DEFAULT_USPS = [
  { icon: Leaf, label: 'Natural ingredients' },
  { icon: ShieldCheck, label: 'CPSR Safety Tested' },
  { icon: Rabbit, label: 'Cruelty Free' },
  { icon: MapPin, label: 'Made in the UK' },
  { icon: Star, label: 'Loved by 1,800+ Customers' },
]

export default function TrustRow({ items }: { items?: string[] }) {
  // Keep the icons; swap labels by index. If the provided list doesn't match
  // the expected length, fall back to defaults entirely.
  const usps =
    items && items.length === DEFAULT_USPS.length
      ? DEFAULT_USPS.map((usp, i) => ({
          icon: usp.icon,
          label: items[i] || usp.label,
        }))
      : DEFAULT_USPS

  return (
    <section className="bg-brand-cream border-b border-brand-warm py-5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 md:gap-6">
          {usps.map((usp, index) => (
            <div
              key={usp.label}
              className={`flex items-center justify-center gap-2.5${index === 4 ? ' col-span-2 sm:col-span-1' : ''}`}
            >
              <usp.icon
                size={18}
                strokeWidth={1.5}
                className="text-brand-amber flex-shrink-0"
              />
              <span className="font-body text-[11px] md:text-xs tracking-widest uppercase text-brand-muted">
                {usp.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
