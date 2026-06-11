'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'

const questions = [
  {
    id: 'skin_type',
    question: 'How would you describe your skin type?',
    options: [
      { value: 'dry', label: 'Dry & Tight', icon: '🌵', description: 'Feels rough, flaky, or tight after cleansing' },
      { value: 'oily', label: 'Oily & Shiny', icon: '✨', description: 'Gets shiny throughout the day, enlarged pores' },
      { value: 'combination', label: 'Combination', icon: '🌗', description: 'Oily T-zone, dry or normal cheeks' },
      { value: 'sensitive', label: 'Sensitive', icon: '🌸', description: 'Easily irritated, prone to redness or reactions' },
    ],
  },
  {
    id: 'concern',
    question: 'What\'s your main skin concern?',
    options: [
      { value: 'dullness', label: 'Dullness & Uneven Tone', icon: '🌟', description: 'Skin looks tired, lacks radiance' },
      { value: 'ageing', label: 'Fine Lines & Ageing', icon: '⏳', description: 'Early signs of ageing, loss of firmness' },
      { value: 'dryness', label: 'Dryness & Dehydration', icon: '💧', description: 'Skin feels parched, lacks moisture' },
      { value: 'texture', label: 'Texture & Congestion', icon: '🔬', description: 'Rough texture, blackheads, or congestion' },
    ],
  },
  {
    id: 'routine',
    question: 'How would you describe your ideal skincare routine?',
    options: [
      { value: 'minimal', label: 'Minimal', icon: '⚡', description: '2-3 steps, quick and effective' },
      { value: 'balanced', label: 'Balanced', icon: '🎯', description: '4-5 steps, morning and evening' },
      { value: 'full', label: 'Full Ritual', icon: '🕯️', description: 'I love a complete, indulgent routine' },
      { value: 'flexible', label: 'Flexible', icon: '🌊', description: 'Different each day depending on my skin' },
    ],
  },
]

type Answers = Record<string, string>

interface Recommendation {
  title: string
  description: string
  products: { handle: string; name: string; img: string; price: string }[]
}

function getRecommendation(answers: Answers): Recommendation {
  const { skin_type, concern, routine } = answers

  // Determine primary products based on skin type + concern
  const productMap: Record<string, Recommendation> = {
    'dry+dryness': {
      title: 'The Deep Nourishment Ritual',
      description: 'Your skin craves intense moisture and barrier repair. Our ghee-rich formulas deliver exactly that — deep nourishment from within the skin barrier.',
      products: [
        { handle: 'overnight-rejuvenation-cream', name: 'Overnight Rejuvenation Cream', img: '/images/products/1_night_cream_HERO.jpg', price: '£38' },
        { handle: 'deep-nourishing-cream', name: 'Deep Nourishing Cream', img: '/images/products/2_deep_cream_HERO.jpg', price: '£34' },
        { handle: 'ghee-oat-cleansing-balm', name: 'Ghee & Oat Cleansing Balm', img: '/images/products/6_cleansing_balm_HERO.jpg', price: '£28' },
      ],
    },
    'dry+ageing': {
      title: 'The Anti-Ageing Nourishment Ritual',
      description: 'Ghee\'s unique fatty acid profile helps plump, firm, and deeply nourish ageing skin. Your ritual starts here.',
      products: [
        { handle: 'radiance-serum', name: 'Radiance Serum', img: '/images/products/5_radiance_serum_HERO.jpg', price: '£42' },
        { handle: 'overnight-rejuvenation-cream', name: 'Overnight Rejuvenation Cream', img: '/images/products/1_night_cream_HERO.jpg', price: '£38' },
        { handle: 'deep-nourishing-cream', name: 'Deep Nourishing Cream', img: '/images/products/2_deep_cream_HERO.jpg', price: '£34' },
      ],
    },
    'oily+texture': {
      title: 'The Balancing Clarity Ritual',
      description: 'Contrary to myth, the right oils balance oily skin. Our ghee formulas work with your skin\'s sebum, not against it.',
      products: [
        { handle: 'ghee-oat-cleansing-balm', name: 'Ghee & Oat Cleansing Balm', img: '/images/products/6_cleansing_balm_HERO.jpg', price: '£28' },
        { handle: 'radiance-serum', name: 'Radiance Serum', img: '/images/products/5_radiance_serum_HERO.jpg', price: '£42' },
        { handle: 'deep-nourishing-cream', name: 'Deep Nourishing Cream', img: '/images/products/2_deep_cream_HERO.jpg', price: '£34' },
      ],
    },
    'sensitive+dullness': {
      title: 'The Calm & Radiance Ritual',
      description: 'Sensitive skin needs gentle, anti-inflammatory nourishment. Our oat and ghee formulas calm while brightening.',
      products: [
        { handle: 'ghee-oat-cleansing-balm', name: 'Ghee & Oat Cleansing Balm', img: '/images/products/6_cleansing_balm_HERO.jpg', price: '£28' },
        { handle: 'radiance-serum', name: 'Radiance Serum', img: '/images/products/5_radiance_serum_HERO.jpg', price: '£42' },
        { handle: 'deep-nourishing-cream', name: 'Deep Nourishing Cream', img: '/images/products/2_deep_cream_HERO.jpg', price: '£34' },
      ],
    },
  }

  // Try exact match first
  const key = `${skin_type}+${concern}`
  if (productMap[key]) return productMap[key]

  // Fallback based on routine preference
  if (routine === 'minimal') {
    return {
      title: 'The Essential Duo',
      description: 'Simple, powerful, effective. Your minimal ritual with maximum impact from our two best-loved formulas.',
      products: [
        { handle: 'deep-nourishing-cream', name: 'Deep Nourishing Cream', img: '/images/products/2_deep_cream_HERO.jpg', price: '£34' },
        { handle: 'ghee-oat-cleansing-balm', name: 'Ghee & Oat Cleansing Balm', img: '/images/products/6_cleansing_balm_HERO.jpg', price: '£28' },
        { handle: 'radiance-serum', name: 'Radiance Serum', img: '/images/products/5_radiance_serum_HERO.jpg', price: '£42' },
      ],
    }
  }

  // Default recommendation
  return {
    title: 'The Full Ritual',
    description: 'Your skin deserves the complete Inherited Skincare experience. Start with our most beloved trio.',
    products: [
      { handle: 'radiance-serum', name: 'Radiance Serum', img: '/images/products/5_radiance_serum_HERO.jpg', price: '£42' },
      { handle: 'overnight-rejuvenation-cream', name: 'Overnight Rejuvenation Cream', img: '/images/products/1_night_cream_HERO.jpg', price: '£38' },
      { handle: 'ghee-oat-cleansing-balm', name: 'Ghee & Oat Cleansing Balm', img: '/images/products/6_cleansing_balm_HERO.jpg', price: '£28' },
    ],
  }
}

export default function QuizPage() {
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState<Answers>({})
  const [complete, setComplete] = useState(false)

  const currentQuestion = questions[step]
  const totalSteps = questions.length
  const progress = ((step) / totalSteps) * 100

  function handleAnswer(value: string) {
    const newAnswers = { ...answers, [currentQuestion.id]: value }
    setAnswers(newAnswers)

    if (step < totalSteps - 1) {
      setStep((s) => s + 1)
    } else {
      setComplete(true)
    }
  }

  function restart() {
    setStep(0)
    setAnswers({})
    setComplete(false)
  }

  const recommendation = complete ? getRecommendation(answers) : null

  return (
    <div className="min-h-screen bg-brand-cream pt-20">
      {/* Header */}
      <div className="bg-brand-warm border-b border-brand-warm/80 py-14">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="font-body text-[11px] tracking-[0.35em] uppercase text-brand-amber mb-3">
            Personalised Ritual
          </p>
          <h1 className="font-display font-semibold text-4xl md:text-5xl text-brand-dark">
            Find Your Perfect Ritual
          </h1>
          <p className="font-body text-sm text-brand-muted mt-3">
            3 quick questions. Instant personalised results.
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        {!complete ? (
          <>
            {/* Progress */}
            <div className="mb-10">
              <div className="flex items-center justify-between mb-2">
                <span className="font-body text-xs text-brand-muted">
                  Question {step + 1} of {totalSteps}
                </span>
                <span className="font-body text-xs text-brand-muted">
                  {Math.round(((step + 1) / totalSteps) * 100)}% complete
                </span>
              </div>
              <div className="h-1 bg-brand-warm overflow-hidden">
                <div
                  className="h-full bg-brand-amber transition-all duration-500"
                  style={{ width: `${((step + 1) / totalSteps) * 100}%` }}
                />
              </div>
            </div>

            {/* Question */}
            <div className="text-center mb-10">
              <h2 className="font-display font-semibold text-3xl md:text-4xl text-brand-dark">
                {currentQuestion.question}
              </h2>
            </div>

            {/* Options */}
            <div className="grid grid-cols-2 gap-4">
              {currentQuestion.options.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleAnswer(option.value)}
                  className="group p-6 border border-brand-warm bg-white text-left hover:border-brand-amber hover:bg-brand-amber/5 transition-all duration-200 active:scale-[0.98]"
                >
                  <span className="text-3xl block mb-3">{option.icon}</span>
                  <h3 className="font-display font-semibold text-lg text-brand-dark group-hover:text-brand-amber transition-colors mb-1">
                    {option.label}
                  </h3>
                  <p className="font-body text-xs text-brand-muted leading-relaxed">
                    {option.description}
                  </p>
                </button>
              ))}
            </div>

            {/* Back button */}
            {step > 0 && (
              <div className="mt-6 text-center">
                <button
                  onClick={() => setStep((s) => s - 1)}
                  className="font-body text-xs tracking-widest uppercase text-brand-muted hover:text-brand-amber transition-colors"
                >
                  ← Back
                </button>
              </div>
            )}
          </>
        ) : (
          /* Results */
          <div>
            <div className="text-center mb-10">
              <p className="font-body text-[11px] tracking-[0.35em] uppercase text-brand-amber mb-2">
                Your Match
              </p>
              <h2 className="font-display font-semibold text-3xl md:text-4xl text-brand-dark mb-4">
                {recommendation!.title}
              </h2>
              <p className="font-body text-base text-brand-muted max-w-xl mx-auto leading-relaxed">
                {recommendation!.description}
              </p>
            </div>

            {/* Recommended products */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-10">
              {recommendation!.products.map((product) => (
                <Link
                  key={product.handle}
                  href={`/products/${product.handle}`}
                  className="group block border border-brand-warm hover:border-brand-amber transition-colors"
                >
                  <div className="relative aspect-square overflow-hidden">
                    <Image
                      src={product.img}
                      alt={product.name}
                      fill
                      sizes="(max-width: 640px) 100vw, 33vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-display text-lg text-brand-dark group-hover:text-brand-amber transition-colors">
                      {product.name}
                    </h3>
                    <p className="font-body text-sm text-brand-muted mt-1">
                      {product.price}
                    </p>
                  </div>
                </Link>
              ))}
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/products"
                className="inline-flex items-center justify-center px-10 py-4 bg-brand-amber text-white font-body text-xs tracking-widest uppercase hover:bg-[#a0693a] transition-colors"
              >
                Shop All Products
              </Link>
              <button
                onClick={restart}
                className="inline-flex items-center justify-center px-8 py-4 border border-brand-dark/30 text-brand-dark font-body text-xs tracking-widest uppercase hover:border-brand-amber hover:text-brand-amber transition-colors"
              >
                Retake Quiz
              </button>
            </div>

            {/* Skin profile summary */}
            <div className="mt-10 bg-brand-warm p-6">
              <p className="font-body text-xs tracking-widest uppercase text-brand-muted mb-3">
                Your Skin Profile
              </p>
              <div className="flex flex-wrap gap-3">
                {Object.entries(answers).map(([key, value]) => (
                  <span
                    key={key}
                    className="font-body text-xs text-brand-dark bg-brand-amber/15 px-3 py-1.5 capitalize"
                  >
                    {value.replace('_', ' ')}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
