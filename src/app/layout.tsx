import type { Metadata } from 'next'
import { Cormorant_Garamond, DM_Sans } from 'next/font/google'
import Script from 'next/script'
import './globals.css'
import Navbar from '@/components/ui/Navbar'
import Footer from '@/components/ui/Footer'
import { getSiteSettings } from '@/lib/site-settings'
import { SITE_URL } from '@/lib/site-url'

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

export const metadata: Metadata = {
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
  openGraph: {
    type: 'website',
    locale: 'en_GB',
    url: SITE_URL,
    siteName: 'Inherited Skincare',
    title: 'Inherited Skincare — Ancient Wisdom. Modern Skin.',
    description:
      'Ayurvedic ghee-based skincare crafted for modern skin. Born from a grandmother\'s evening ghee ritual, passed down through generations.',
    images: [
      {
        url: '/images/products/_ALL13.jpg',
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
    images: ['/images/products/_ALL13.jpg'],
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

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const settings = await getSiteSettings()
  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${dmSans.variable}`}
    >
      <body className="bg-brand-cream text-brand-dark font-body antialiased">
        <Navbar announcement={settings.announcementBar} />
        <main className="min-h-screen">{children}</main>
        <Footer />
        {/* Klaviyo onsite tracking + forms (public site key) */}
        <Script
          src="https://static.klaviyo.com/onsite/js/klaviyo.js?company_id=WYzZWr"
          strategy="afterInteractive"
        />
      </body>
    </html>
  )
}
