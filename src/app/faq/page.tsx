import type { Metadata } from 'next'
import Link from 'next/link'
import Script from 'next/script'
import { getSiteSettings } from '@/lib/site-settings'

export const metadata: Metadata = {
  title: 'FAQ',
  description:
    'Frequently asked questions about Inherited Skincare — ghee skincare, shipping, returns, sensitive skin, and how to use each product.',
}

export const dynamic = 'force-dynamic'

export default async function FAQPage() {
  const settings = await getSiteSettings()
  const faqs = settings.pages.faq.items

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.q,
      acceptedAnswer: { '@type': 'Answer', text: faq.a },
    })),
  }

  return (
    <div className="min-h-screen bg-brand-cream pt-24 md:pt-28">
      <Script id="faq-schema" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      {/* Header */}
      <div className="bg-brand-warm border-b border-brand-warm/80 py-10 md:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="font-body text-[11px] tracking-[0.35em] uppercase text-brand-amber mb-3">
            Help & Advice
          </p>
          <h1 className="font-display font-semibold text-5xl md:text-6xl text-brand-dark">
            Frequently Asked Questions
          </h1>
          <p className="font-body text-base text-brand-muted mt-3 max-w-lg mx-auto">
            Ghee skincare, shipping, and rituals — answered.
          </p>
        </div>
      </div>

      {/* FAQ accordion */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-12">
        <div className="divide-y divide-brand-warm border-y border-brand-warm">
          {faqs.map((faq) => (
            <details key={faq.q} className="group py-5">
              <summary className="flex items-center justify-between cursor-pointer list-none [&::-webkit-details-marker]:hidden">
                <h2 className="font-display font-semibold text-xl text-brand-dark pr-6 group-hover:text-brand-amber transition-colors">
                  {faq.q}
                </h2>
                <span
                  aria-hidden="true"
                  className="flex-shrink-0 text-brand-amber text-2xl font-light leading-none transition-transform duration-300 group-open:rotate-45"
                >
                  +
                </span>
              </summary>
              <p className="font-body text-sm text-brand-muted leading-relaxed mt-3 pr-8">
                {faq.a}
              </p>
            </details>
          ))}
        </div>

        {/* Contact CTA */}
        <div className="mt-10 bg-brand-warm p-6 text-center">
          <p className="font-display italic text-xl text-brand-dark mb-2">
            Still have a question?
          </p>
          <p className="font-body text-sm text-brand-muted mb-4">
            We reply to every message within one working day.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center px-8 py-3 bg-brand-amber text-white font-body text-xs tracking-widest uppercase hover:bg-[#b87f43] transition-colors"
          >
            Contact Us
          </Link>
        </div>
      </div>
    </div>
  )
}
