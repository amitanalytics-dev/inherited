import type { Metadata } from 'next'
import Link from 'next/link'
import { Mail, Instagram, MapPin, Clock, Phone } from 'lucide-react'
import ContactForm from './ContactForm'
import { getSiteSettings } from '@/lib/site-settings'

export const metadata: Metadata = {
  title: 'Contact Us',
  description:
    'Get in touch with Inherited Skincare — questions about your order, your skin, or your ritual. Email hello@inheritedskincare.com or use our contact form.',
}

export const dynamic = 'force-dynamic'

export default async function ContactPage() {
  const settings = await getSiteSettings()
  const contact = settings.pages.contact
  return (
    <div className="min-h-screen bg-brand-cream pt-24 md:pt-28">
      {/* Header */}
      <div className="bg-brand-warm border-b border-brand-warm/80 py-10 md:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="font-body text-[11px] tracking-[0.35em] uppercase text-brand-amber mb-3">
            We&rsquo;d Love to Hear From You
          </p>
          <h1 className="font-display font-semibold text-5xl md:text-6xl text-brand-dark">
            Contact Us
          </h1>
          <p className="font-body text-base text-brand-muted mt-3 max-w-lg mx-auto">
            Questions about your order, your skin, or your ritual — our small team replies
            to every message.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Contact details */}
          <div className="lg:col-span-2 space-y-5">
            <div className="bg-brand-warm p-6">
              <div className="flex items-start gap-3 mb-5">
                <Mail size={20} strokeWidth={1.5} className="text-brand-amber mt-0.5 flex-shrink-0" />
                <div>
                  <h2 className="font-display font-semibold text-lg text-brand-dark">Email</h2>
                  <a
                    href={`mailto:${contact.email}`}
                    className="font-body text-sm text-brand-amber underline underline-offset-2"
                  >
                    {contact.email}
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-3 mb-5">
                <Phone size={20} strokeWidth={1.5} className="text-brand-amber mt-0.5 flex-shrink-0" />
                <div>
                  <h2 className="font-display font-semibold text-lg text-brand-dark">Phone</h2>
                  <a
                    href={`tel:${contact.phone.replace(/\s/g, '')}`}
                    className="font-body text-sm text-brand-amber underline underline-offset-2"
                  >
                    {contact.phone}
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-3 mb-5">
                <Instagram size={20} strokeWidth={1.5} className="text-brand-amber mt-0.5 flex-shrink-0" />
                <div>
                  <h2 className="font-display font-semibold text-lg text-brand-dark">Instagram</h2>
                  <a
                    href="https://www.instagram.com/inheritedskincare"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-body text-sm text-brand-amber underline underline-offset-2"
                  >
                    {contact.instagram}
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-3 mb-5">
                <Clock size={20} strokeWidth={1.5} className="text-brand-amber mt-0.5 flex-shrink-0" />
                <div>
                  <h2 className="font-display font-semibold text-lg text-brand-dark">Response time</h2>
                  <p className="font-body text-sm text-brand-muted">
                    {contact.responseTime}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin size={20} strokeWidth={1.5} className="text-brand-amber mt-0.5 flex-shrink-0" />
                <div>
                  <h2 className="font-display font-semibold text-lg text-brand-dark">Studio</h2>
                  <p className="font-body text-sm text-brand-muted">
                    {contact.address}
                  </p>
                </div>
              </div>
            </div>

            <div className="border border-brand-warm p-6">
              <p className="font-display italic text-lg text-brand-dark mb-2">
                Looking for a quick answer?
              </p>
              <p className="font-body text-sm text-brand-muted mb-4">
                Shipping times, returns, and how to use each product are all covered in our FAQ.
              </p>
              <Link
                href="/faq"
                className="font-body text-xs tracking-widest uppercase text-brand-amber border-b border-brand-amber/40 pb-0.5 hover:border-brand-amber transition-colors"
              >
                Visit the FAQ →
              </Link>
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-3">
            <ContactForm />
          </div>
        </div>
      </div>
    </div>
  )
}
