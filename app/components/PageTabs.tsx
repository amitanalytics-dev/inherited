'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const TABS = [
  { label: 'Founder Form', href: '/' },
  { label: 'Website A — Relief', href: '/website-a' },
  { label: 'Website B — Heritage', href: '/website-b' },
  { label: 'Heritage Strategy', href: '/strategy' },
  { label: 'Growth Plan', href: '/todo' },
  { label: 'Command Centre', href: '/command-centre' },
]

export default function PageTabs() {
  const path = usePathname()
  return (
    <div className="flex gap-2 mt-6 flex-wrap">
      {TABS.map(({ label, href }) => (
        <Link
          key={href}
          href={href}
          className={`text-xs font-semibold px-4 py-1.5 rounded-full transition-all ${
            path === href
              ? 'bg-white text-ink'
              : 'bg-white/10 text-white/50 hover:bg-white/20 hover:text-white/80'
          }`}
        >
          {label}
        </Link>
      ))}
    </div>
  )
}
