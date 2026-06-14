import type { Metadata } from 'next'
import Link from 'next/link'
import { Truck, RotateCcw, PackageCheck, Clock } from 'lucide-react'
import { getSiteSettings } from '@/lib/site-settings'

export const metadata: Metadata = {
  title: 'Shipping & Returns',
  description:
    'Inherited Skincare UK shipping and returns — Royal Mail Tracked 48, free UK delivery over £55, and 14-day returns on unused products in original packaging.',
}

export const dynamic = 'force-dynamic'

const ICONS = [Truck, Clock, PackageCheck, RotateCcw]

export default async function ShippingPage() {
  const settings = await getSiteSettings()
  const { highlights, returnsBody } = settings.pages.shipping
  return (
    <div className="min-h-screen bg-brand-cream pt-24 md:pt-28">
      {/* Header */}
      <div className="bg-brand-warm border-b border-brand-warm/80 py-10 md:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="font-body text-[11px] tracking-[0.35em] uppercase text-brand-amber mb-3">
            Delivery Information
          </p>
          <h1 className="font-display font-semibold text-5xl md:text-6xl text-brand-dark">
            Shipping & Returns
          </h1>
          <p className="font-body text-base text-brand-muted mt-3 max-w-lg mx-auto">
            Shipped Mon–Fri via Royal Mail Tracked 48.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-12">
        {/* Highlights */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {highlights.map((item, i) => {
            const Icon = ICONS[i] ?? Truck
            return (
              <div
                key={item.title}
                className="bg-brand-warm p-5 text-center flex flex-col items-center"
              >
                <Icon size={24} strokeWidth={1.5} className="text-brand-amber mb-3" />
                <h2 className="font-display font-semibold text-lg text-brand-dark mb-1">
                  {item.title}
                </h2>
                <p className="font-body text-xs text-brand-muted leading-relaxed">
                  {item.body}
                </p>
              </div>
            )
          })}
        </div>

        {/* UK Shipping */}
        <section className="mb-10">
          <h2 className="font-display font-semibold text-3xl text-brand-dark mb-4">
            UK Shipping
          </h2>
          <div className="border border-brand-warm divide-y divide-brand-warm font-body text-sm mb-5">
            <div className="grid grid-cols-3 bg-brand-warm/60 font-medium text-brand-dark">
              <span className="px-4 py-3">Service</span>
              <span className="px-4 py-3">Delivery time</span>
              <span className="px-4 py-3">Cost</span>
            </div>
            <div className="grid grid-cols-3 text-brand-muted">
              <span className="px-4 py-3">Royal Mail Tracked 48</span>
              <span className="px-4 py-3">Tracked delivery</span>
              <span className="px-4 py-3">Calculated at checkout</span>
            </div>
            <div className="grid grid-cols-3 text-brand-muted">
              <span className="px-4 py-3">Orders over £55</span>
              <span className="px-4 py-3">Tracked delivery</span>
              <span className="px-4 py-3 text-brand-green font-medium">FREE</span>
            </div>
          </div>
          <div className="space-y-3 font-body text-sm text-brand-muted leading-relaxed">
            <p>
              We ship Mon–Fri via Royal Mail Tracked 48.
            </p>
            <p>
              Orders before midday aim to ship same day.
            </p>
            <p>
              You&rsquo;ll receive a tracking email on dispatch.
            </p>
            <p>
              Allow 2–3 working days during busy periods.
            </p>
          </div>
        </section>

        {/* Returns */}
        <section className="mb-10">
          <h2 className="font-display font-semibold text-3xl text-brand-dark mb-4">
            Returns & Refunds
          </h2>
          <div className="space-y-3 font-body text-sm text-brand-muted leading-relaxed">
            {returnsBody.map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </div>
        </section>

        {/* CTA */}
        <div className="bg-brand-warm p-6 text-center">
          <p className="font-display italic text-xl text-brand-dark mb-2">
            Questions about your order?
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-4">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center px-8 py-3 bg-brand-amber text-white font-body text-xs tracking-widest uppercase hover:bg-[#b87f43] transition-colors"
            >
              Contact Us
            </Link>
            <Link
              href="/faq"
              className="inline-flex items-center justify-center px-8 py-3 border border-brand-dark text-brand-dark font-body text-xs tracking-widest uppercase hover:bg-brand-dark hover:text-brand-cream transition-colors"
            >
              Read the FAQ
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
