import type { Metadata } from 'next'
import Link from 'next/link'
import {
  ShoppingBag,
  Package,
  BarChart3,
  BarChart2,
  Mail,
  Newspaper,
  Globe,
  ExternalLink,
  Info,
  ArrowUpRight,
} from 'lucide-react'
import StatsPanel from './StatsPanel'
import AnalyticsPanel from './AnalyticsPanel'
import EditorPanel from './EditorPanel'
import QuizEditor from './QuizEditor'
import ProductsEditor from './pages/ProductsEditor'
import AboutEditor from './pages/AboutEditor'
import FaqEditor from './pages/FaqEditor'
import ContactEditor from './pages/ContactEditor'
import ShippingEditor from './pages/ShippingEditor'
import ReviewsEditor from './pages/ReviewsEditor'
import PendingReviewsEditor from './pages/PendingReviewsEditor'
import OgImageEditor from './OgImageEditor'
import AnnouncementEmailEditor from './AnnouncementEmailEditor'
import BlogEditor from './BlogEditor'
import AdminTabLayout from './AdminTabLayout'

export const metadata: Metadata = {
  title: 'Admin',
  robots: { index: false, follow: false },
}

export const dynamic = 'force-dynamic'

const QUICK_LINKS = [
  {
    label: 'Shopify Orders',
    description: 'See and manage every order',
    href: 'https://admin.shopify.com/store/leela-skincare/orders',
    icon: ShoppingBag,
  },
  {
    label: 'Shopify Products',
    description: 'Edit products, prices & stock',
    href: 'https://admin.shopify.com/store/leela-skincare/products',
    icon: Package,
  },
  {
    label: 'Shopify Analytics',
    description: 'Sales reports & trends',
    href: 'https://admin.shopify.com/store/leela-skincare/analytics',
    icon: BarChart3,
  },
  {
    label: 'Klaviyo Dashboard',
    description: 'Email flows & campaigns',
    href: 'https://www.klaviyo.com/dashboard',
    icon: Mail,
  },
  {
    label: 'Blog posts',
    description: 'Write & edit journal articles',
    href: 'https://admin.shopify.com/store/leela-skincare/content/articles',
    icon: Newspaper,
  },
  {
    label: 'Google Analytics',
    description: 'Traffic, add-to-carts & conversions',
    href: 'https://analytics.google.com/',
    icon: BarChart2,
  },
  {
    label: 'View live site',
    description: 'See the website as customers do',
    href: '/',
    icon: Globe,
  },
]

const HEALTH_ITEMS = [
  '48 blog articles live',
  '9 products',
  'Sitemap — 78 pages',
  'Policies synced from store',
  'Customer review submissions — live on all product pages',
  'Pending review queue — approve or reject from Reviews tab',
  'Announcement emails — Suruchi approval required before sending',
  'Cart badge syncs to live Shopify cart on every page load',
]

function SectionHeading({
  title,
  subtitle,
}: {
  title: string
  subtitle?: string
}) {
  return (
    <div className="mb-5">
      <h2 className="font-display text-2xl md:text-3xl text-brand-dark">{title}</h2>
      {subtitle && (
        <p className="font-body text-sm text-brand-muted mt-1.5">{subtitle}</p>
      )}
    </div>
  )
}

function QuickLinkCard({ link }: { link: typeof QUICK_LINKS[0] }) {
  const inner = (
    <>
      <div className="w-10 h-10 rounded-full bg-brand-amber/15 flex items-center justify-center flex-shrink-0">
        <link.icon size={18} className="text-brand-amber" />
      </div>
      <div>
        <p className="font-body text-sm font-semibold text-brand-dark group-hover:text-brand-amber transition-colors flex items-center gap-1.5">
          {link.label}
          <ExternalLink size={12} className="text-brand-muted" />
        </p>
        <p className="font-body text-xs text-brand-muted mt-0.5">{link.description}</p>
      </div>
    </>
  )
  const cls = 'group bg-white border border-brand-warm rounded-2xl p-5 shadow-sm hover:shadow-md hover:border-brand-amber/60 transition-all flex items-start gap-4'
  return link.href.startsWith('/') ? (
    <Link href={link.href} target="_blank" className={cls}>{inner}</Link>
  ) : (
    <a href={link.href} target="_blank" rel="noopener noreferrer" className={cls}>{inner}</a>
  )
}

export default function AdminPage() {
  const today = new Date().toLocaleDateString('en-GB', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  })

  const header = (
    <header>
      <h1 className="font-display font-semibold text-4xl md:text-5xl mb-2">
        <span className="gold-shimmer">Inherited Skincare</span>
        <span className="text-brand-dark"> — Admin</span>
      </h1>
      <p className="font-body text-sm text-brand-muted">
        Hello Suruchi — here&apos;s your shop today. {today}.
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        {QUICK_LINKS.slice(0, 4).map((l) => (
          <a
            key={l.label}
            href={l.href}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-brand-warm bg-white font-body text-xs text-brand-dark hover:border-brand-amber transition-colors"
          >
            {l.label} <ExternalLink size={11} className="text-brand-muted" />
          </a>
        ))}
      </div>
    </header>
  )

  const overview = (
    <>
      <section>
        <SectionHeading title="Today at a Glance" subtitle="Live orders and revenue, straight from Shopify." />
        <StatsPanel />
      </section>

      <section>
        <SectionHeading title="Quick Links" subtitle="Everything you need, one click away. Links open in a new tab." />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {QUICK_LINKS.map((link) => <QuickLinkCard key={link.label} link={link} />)}
        </div>
      </section>

      <section>
        <SectionHeading title="Site Health" subtitle="A quick pulse-check on everything that's live." />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2 bg-white border border-brand-warm rounded-2xl p-6 shadow-sm">
            <ul className="space-y-3.5">
              {HEALTH_ITEMS.map((item) => (
                <li key={item} className="flex items-center gap-3 font-body text-sm text-brand-dark">
                  <span className="w-2.5 h-2.5 rounded-full bg-brand-green flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-brand-warm/50 border border-brand-warm rounded-2xl p-6 shadow-sm flex items-start gap-3">
            <Info size={16} className="text-brand-amber mt-0.5 flex-shrink-0" />
            <p className="font-body text-sm text-brand-dark leading-relaxed">
              Checkout activates when the Storefront API token is connected.
            </p>
          </div>
        </div>
      </section>
    </>
  )

  const content = (
    <>
      <section>
        <SectionHeading title="Edit Website" subtitle="Change the words on your homepage and choose which sections show. No developer needed." />
        <EditorPanel />
      </section>

      <section>
        <SectionHeading title="Social Sharing Image" subtitle="The image that appears when someone shares your website link on WhatsApp, Instagram, or Facebook. Upload a 1200×630 px landscape photo." />
        <OgImageEditor />
      </section>

      <section>
        <SectionHeading title="About Page" subtitle="Edit the founder story, brand values, and key ingredients shown on the About page." />
        <AboutEditor />
      </section>

      <section>
        <SectionHeading title="FAQ Page" subtitle="Add, edit, or reorder frequently asked questions." />
        <FaqEditor />
      </section>

      <section>
        <SectionHeading title="Contact Details" subtitle="Update the email, phone, Instagram, address, and response time shown on the Contact page." />
        <ContactEditor />
      </section>

      <section>
        <SectionHeading title="Shipping & Returns" subtitle="Edit the shipping highlight tiles and returns policy paragraphs." />
        <ShippingEditor />
      </section>

      <section>
        <SectionHeading title="Blog Posts" subtitle="Edit any published article — title, body, excerpt, or toggle it between published and draft." />
        <BlogEditor />
      </section>
    </>
  )

  const products = (
    <>
      <section>
        <SectionHeading title="Products" subtitle="Edit each product's name, price, description, visibility, and photos — saved straight to Shopify." />
        <ProductsEditor />
      </section>

      <section>
        <SectionHeading title="Find Your Ritual — Quiz Logic" subtitle="Edit the quiz questions, answers, and which products each result recommends." />
        <QuizEditor />
      </section>

      <section>
        <SectionHeading title="Checkout" subtitle="Your checkout is hosted securely by Shopify." />
        <div className="bg-white border border-brand-warm rounded-2xl p-6 md:p-8 shadow-sm">
          <p className="font-body text-sm text-brand-dark leading-relaxed mb-5 max-w-2xl">
            When a customer clicks &ldquo;Checkout&rdquo;, they&apos;re handed to Shopify&apos;s
            secure, PCI-compliant checkout — so card details and payments are never handled by
            this site. Checkout text, logo, colours, and payment methods are managed in
            Shopify&apos;s checkout settings.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <a
              href="https://admin.shopify.com/store/leela-skincare/settings/checkout"
              target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-brand-amber text-white font-body text-xs tracking-widest uppercase rounded-lg hover:bg-[#b87f43] transition-colors"
            >
              Checkout settings <ExternalLink size={13} />
            </a>
            <a
              href="https://admin.shopify.com/store/leela-skincare/settings/branding"
              target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-brand-warm text-brand-dark font-body text-xs tracking-widest uppercase rounded-lg hover:border-brand-amber/60 transition-colors"
            >
              Branding &amp; logo <ExternalLink size={13} />
            </a>
            <a
              href="/cart" target="_blank"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-brand-warm text-brand-dark font-body text-xs tracking-widest uppercase rounded-lg hover:border-brand-amber/60 transition-colors"
            >
              View cart page <ExternalLink size={13} />
            </a>
          </div>
        </div>
      </section>
    </>
  )

  const reviews = (
    <>
      <section>
        <SectionHeading title="Pending Reviews" subtitle="Customer reviews submitted from product pages — approve to publish, reject to discard." />
        <PendingReviewsEditor />
      </section>

      <section>
        <SectionHeading title="Curated Reviews" subtitle="Add new customer reviews or edit existing ones shown on the Reviews page." />
        <ReviewsEditor />
      </section>

      <section>
        <SectionHeading title="Reviewer Names & Media" subtitle="Override the display name for any Judge.me reviewer, and attach photos or videos to reviews." />
        <div className="bg-white border border-brand-warm rounded-2xl p-6 shadow-sm flex items-start justify-between gap-4">
          <div className="space-y-1">
            <p className="font-body text-sm text-brand-dark font-medium">Open Reviewer Manager</p>
            <p className="font-body text-xs text-brand-muted max-w-md">
              Change reviewer display names, upload photos and videos that appear alongside any review on product pages.
            </p>
          </div>
          <Link
            href="/admin/reviews"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-dark text-brand-cream font-body text-xs tracking-widest uppercase hover:bg-brand-amber transition-colors whitespace-nowrap flex-shrink-0"
          >
            Open <ArrowUpRight size={13} />
          </Link>
        </div>
      </section>
    </>
  )

  const email = (
    <section>
      <SectionHeading title="Send Announcement Email" subtitle="Compose an email to all newsletter subscribers. It sends via Klaviyo at 6pm BST — throttled at 100 emails per hour so inboxes stay warm." />
      <AnnouncementEmailEditor />
    </section>
  )

  const analytics = (
    <section>
      <SectionHeading title="Traffic & Analytics" subtitle="Sales funnel and revenue metrics. Add-to-carts and traffic come from Google Analytics." />
      <AnalyticsPanel />
    </section>
  )

  return (
    <AdminTabLayout
      header={header}
      overview={overview}
      content={content}
      products={products}
      reviews={reviews}
      email={email}
      analytics={analytics}
    />
  )
}
