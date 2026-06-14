import Image from 'next/image'
import Link from 'next/link'
import Reveal from '@/components/ui/Reveal'

export default function QuizCTA() {
  return (
    <section className="relative section-pad overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-brand-green" />
      {/* Pomegranate illustration layer — cropped to hide URL strip */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <Image
          src="/images/brand/quote_1.png"
          alt=""
          fill
          sizes="100vw"
          className="object-cover object-top scale-[1.15] opacity-[0.15]"
        />
      </div>
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23FFFDF8' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <Reveal>
        <p className="font-body text-[11px] tracking-[0.3em] uppercase text-brand-cream/60 mb-4">
          Personalised for You
        </p>
        <h2 className="font-display font-semibold text-brand-cream leading-tight mb-6"
          style={{ fontSize: 'clamp(2.5rem, 5vw, 5rem)' }}
        >
          Find Your Ritual —{' '}
          <em className="italic">Find Your Fix</em>
        </h2>
        <p className="font-body text-base text-brand-cream/70 max-w-lg mx-auto leading-relaxed mb-8">
          Answer 3 questions. Get your personalised skincare routine.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/quiz"
            className="inline-flex items-center justify-center px-10 py-4 bg-brand-amber text-white font-body text-xs tracking-widest uppercase hover:bg-[#b87f43] transition-colors shadow-lg hover:shadow-xl"
          >
            Take the Skin Quiz
          </Link>
          <Link
            href="/products"
            className="inline-flex items-center justify-center px-8 py-4 border border-brand-cream/40 text-brand-cream font-body text-xs tracking-widest uppercase hover:bg-brand-cream/10 transition-colors"
          >
            Browse All
          </Link>
        </div>

        {/* Quick stats */}
        <div className="mt-8 flex items-center justify-center gap-8 flex-wrap">
          {[
            '3 Questions',
            'Instant Results',
            'Tailored to You',
          ].map((item) => (
            <div key={item} className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-brand-amber" />
              <span className="font-body text-xs text-brand-cream/60 tracking-wide">
                {item}
              </span>
            </div>
          ))}
        </div>
        </Reveal>
      </div>
    </section>
  )
}
