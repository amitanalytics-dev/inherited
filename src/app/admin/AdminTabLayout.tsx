'use client'

import { useState } from 'react'
import {
  LayoutDashboard,
  FileEdit,
  Package,
  Star,
  Mail,
  BarChart2,
} from 'lucide-react'

type TabId = 'overview' | 'content' | 'products' | 'reviews' | 'email' | 'analytics'

const TABS: { id: TabId; label: string; Icon: React.ElementType }[] = [
  { id: 'overview',   label: 'Overview',   Icon: LayoutDashboard },
  { id: 'content',    label: 'Content',    Icon: FileEdit },
  { id: 'products',   label: 'Products',   Icon: Package },
  { id: 'reviews',    label: 'Reviews',    Icon: Star },
  { id: 'email',      label: 'Email',      Icon: Mail },
  { id: 'analytics',  label: 'Analytics',  Icon: BarChart2 },
]

export default function AdminTabLayout({
  header,
  overview,
  content,
  products,
  reviews,
  email,
  analytics,
}: {
  header: React.ReactNode
  overview: React.ReactNode
  content: React.ReactNode
  products: React.ReactNode
  reviews: React.ReactNode
  email: React.ReactNode
  analytics: React.ReactNode
}) {
  const [active, setActive] = useState<TabId>('overview')

  const panels: Record<TabId, React.ReactNode> = {
    overview,
    content,
    products,
    reviews,
    email,
    analytics,
  }

  return (
    <div className="bg-brand-cream min-h-screen pt-28 md:pt-36 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page header */}
        <div className="mb-8">{header}</div>

        {/* Tab bar */}
        <div className="border-b border-brand-warm mb-10 -mx-1 overflow-x-auto">
          <div className="flex gap-1 min-w-max px-1">
            {TABS.map(({ id, label, Icon }) => {
              const isActive = active === id
              return (
                <button
                  key={id}
                  onClick={() => setActive(id)}
                  className={`inline-flex items-center gap-2 px-5 py-3 font-body text-xs tracking-widest uppercase whitespace-nowrap border-b-2 transition-colors ${
                    isActive
                      ? 'border-brand-amber text-brand-dark font-semibold'
                      : 'border-transparent text-brand-muted hover:text-brand-dark hover:border-brand-warm'
                  }`}
                >
                  <Icon size={13} />
                  {label}
                </button>
              )
            })}
          </div>
        </div>

        {/* Active panel */}
        <div className="space-y-14">
          {panels[active]}
        </div>
      </div>
    </div>
  )
}
