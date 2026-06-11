import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getArticle } from '@/lib/queries'

interface PageProps {
  params: { handle: string }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  try {
    const article = await getArticle('news', params.handle)
    if (!article) return { title: 'Article Not Found' }
    return {
      title: article.seo.title ?? article.title,
      description: article.seo.description ?? article.excerpt ?? '',
      openGraph: {
        images: article.image ? [{ url: article.image.url }] : [],
      },
    }
  } catch {
    return { title: 'Journal' }
  }
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

export default async function BlogArticlePage({ params }: PageProps) {
  let article = null

  try {
    // Try common blog handles
    const blogHandles = ['news', 'journal', 'blog']
    for (const blogHandle of blogHandles) {
      article = await getArticle(blogHandle, params.handle)
      if (article) break
    }
  } catch {
    // fallback
  }

  if (!article) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-brand-cream pt-20">
      {/* Hero image */}
      {article.image && (
        <div className="relative h-[50vh] min-h-[350px] overflow-hidden">
          <Image
            src={article.image.url}
            alt={article.image.altText ?? article.title}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/60 to-transparent" />
        </div>
      )}

      {/* Content */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 font-body text-xs text-brand-muted mb-8">
          <Link href="/" className="hover:text-brand-amber transition-colors">Home</Link>
          <span>/</span>
          <Link href="/blog" className="hover:text-brand-amber transition-colors">Journal</Link>
          <span>/</span>
          <span className="text-brand-dark line-clamp-1">{article.title}</span>
        </nav>

        {/* Article header */}
        <header className="mb-10">
          <h1 className="font-display font-semibold text-4xl md:text-5xl text-brand-dark leading-tight mb-5">
            {article.title}
          </h1>
          <div className="flex items-center gap-4 font-body text-sm text-brand-muted pb-6 border-b border-brand-warm">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-brand-amber/20 flex items-center justify-center">
                <span className="font-display italic text-brand-amber text-sm">
                  {article.author.name.charAt(0)}
                </span>
              </div>
              <span>{article.author.name}</span>
            </div>
            <span>·</span>
            <span>{formatDate(article.publishedAt)}</span>
          </div>
        </header>

        {/* Article body */}
        <div
          className="prose-brand font-body text-base text-brand-dark leading-relaxed space-y-5 [&_h1]:font-display [&_h1]:text-4xl [&_h1]:text-brand-dark [&_h1]:font-semibold [&_h2]:font-display [&_h2]:text-3xl [&_h2]:text-brand-dark [&_h2]:font-semibold [&_h2]:mt-10 [&_h2]:mb-4 [&_h3]:font-display [&_h3]:text-2xl [&_h3]:text-brand-dark [&_h3]:font-semibold [&_h3]:mt-8 [&_h3]:mb-3 [&_p]:mb-5 [&_p]:leading-relaxed [&_a]:text-brand-amber [&_a]:underline [&_a]:underline-offset-3 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-2 [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:space-y-2 [&_blockquote]:border-l-4 [&_blockquote]:border-brand-amber [&_blockquote]:pl-6 [&_blockquote]:italic [&_blockquote]:font-display [&_blockquote]:text-xl [&_blockquote]:text-brand-dark [&_img]:w-full [&_img]:my-8"
          dangerouslySetInnerHTML={{ __html: article.contentHtml }}
        />

        {/* Bottom CTA */}
        <div className="mt-16 pt-10 border-t border-brand-warm text-center">
          <p className="font-display italic text-2xl text-brand-dark mb-4">
            Ready to begin your own ritual?
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/quiz"
              className="inline-flex items-center justify-center px-8 py-3.5 bg-brand-amber text-white font-body text-xs tracking-widest uppercase hover:bg-[#a0693a] transition-colors"
            >
              Take the Skin Quiz
            </Link>
            <Link
              href="/products"
              className="inline-flex items-center justify-center px-8 py-3.5 border border-brand-dark text-brand-dark font-body text-xs tracking-widest uppercase hover:bg-brand-dark hover:text-brand-cream transition-colors"
            >
              Shop the Collection
            </Link>
          </div>
        </div>

        {/* Back to blog */}
        <div className="mt-10 text-center">
          <Link
            href="/blog"
            className="font-body text-xs tracking-widest uppercase text-brand-muted hover:text-brand-amber transition-colors"
          >
            ← Back to Journal
          </Link>
        </div>
      </div>
    </div>
  )
}
