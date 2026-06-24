import type { Metadata } from 'next'
import { Cormorant_Garamond, DM_Sans } from 'next/font/google'
import Script from 'next/script'
import './globals.css'
import Navbar from '@/components/ui/Navbar'
import Footer from '@/components/ui/Footer'
import EmailPopup from '@/components/ui/EmailPopup'
import { getSiteSettings } from '@/lib/site-settings'
import { SITE_URL } from '@/lib/site-url'

const ORG_SCHEMA = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': `${SITE_URL}/#organization`,
      name: 'Inherited Skincare',
      url: SITE_URL,
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_URL}/images/products/_ALL13.jpg`,
        width: 1200,
        height: 630,
      },
      sameAs: [
        'https://www.instagram.com/inheritedskincare',
      ],
      contactPoint: {
        '@type': 'ContactPoint',
        contactType: 'customer support',
        email: 'suruchi@inheritedskincare.com',
        availableLanguage: ['English'],
      },
    },
    {
      '@type': 'WebSite',
      '@id': `${SITE_URL}/#website`,
      url: SITE_URL,
      name: 'Inherited Skincare',
      publisher: { '@id': `${SITE_URL}/#organization` },
      potentialAction: {
        '@type': 'SearchAction',
        target: { '@type': 'EntryPoint', urlTemplate: `${SITE_URL}/search?q={search_term_string}` },
        'query-input': 'required name=search_term_string',
      },
    },
  ],
}

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-cormorant',
  display: 'swap',
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-dm-sans',
  display: 'swap',
})

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings()
  const ogImg = settings.ogImage || '/images/products/_ALL13.jpg'

  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: 'Inherited Skincare — Ancient Wisdom. Modern Skin.',
      template: '%s | Inherited Skincare',
    },
    description:
      'Ayurvedic ghee-based skincare crafted for modern skin. Born from a grandmother\'s evening ghee ritual, passed down through generations. Discover the ritual.',
    keywords: [
      'Ayurvedic skincare',
      'ghee skincare',
      'natural skincare UK',
      'Ayurvedic beauty',
      'ghee moisturiser',
      'inherited skincare',
      'ancient beauty rituals',
    ],
    alternates: {
      canonical: SITE_URL,
      languages: {
        'en-GB': SITE_URL,
        'en-US': SITE_URL,
        'x-default': SITE_URL,
      },
    },
    openGraph: {
      type: 'website',
      locale: 'en_GB',
      alternateLocale: ['en_US'],
      url: SITE_URL,
      siteName: 'Inherited Skincare',
      title: 'Inherited Skincare — Ancient Wisdom. Modern Skin.',
      description:
        'Ayurvedic ghee-based skincare crafted for modern skin. Born from a grandmother\'s evening ghee ritual, passed down through generations.',
      images: [
        {
          url: ogImg,
          width: 1200,
          height: 630,
          alt: 'Inherited Skincare — The Full Ritual',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Inherited Skincare — Ancient Wisdom. Modern Skin.',
      description:
        'Ayurvedic ghee-based skincare crafted for modern skin.',
      images: [ogImg],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-image-preview': 'large',
      },
    },
  }
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const settings = await getSiteSettings()
  return (
    <html
      lang="en-GB"
      className={`${cormorant.variable} ${dmSans.variable}`}
    >
      <head>
        <Script
          id="org-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(ORG_SCHEMA) }}
        />
      </head>
      <body className="bg-brand-cream text-brand-dark font-body antialiased">
        <Navbar announcement={settings.announcementBar} />
        <main className="min-h-screen">{children}</main>
        <Footer />
        <EmailPopup />
      </body>
    </html>
  )
}
