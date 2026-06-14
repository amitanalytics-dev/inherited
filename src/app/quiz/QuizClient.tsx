'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {
  Leaf, Sun, Moon, Droplets, Shield, Sparkles, Clock, Shrub, Heart, Flower2,
} from 'lucide-react'
import type { QuizConfig, QuizResult } from '@/lib/site-settings'
import { FALLBACK_PRODUCTS } from '@/lib/fallback'

function QuizIcon({ name }: { name: string }) {
  const p = { size: 28, strokeWidth: 1.5 } as const
  if (name === 'leaf')     return <span role="img" aria-label="leaf" className="text-4xl leading-none">🍃</span>
  if (name === 'sun')      return <span role="img" aria-label="sun" className="text-4xl leading-none">☀️</span>
  if (name === 'moon')     return <span role="img" aria-label="moon" className="text-4xl leading-none">🌙</span>
  if (name === 'droplet')  return <span role="img" aria-label="droplet" className="text-4xl leading-none">💧</span>
  if (name === 'shield')   return <Shield   {...p} className="text-brand-green" />
  if (name === 'sparkles') return <Sparkles {...p} className="text-brand-amber" />
  if (name === 'clock')    return <Clock    {...p} className="text-brand-muted" />
  if (name === 'cactus')   return <Shrub    {...p} className="text-sky-600" />
  if (name === 'heart')    return <Heart    {...p} className="text-brand-green" />
  if (name === 'yin-yang') return <span className="text-brand-amber font-bold text-2xl">☯</span>
  if (name === 'flower')   return <Flower2  {...p} className="text-brand-muted" />
  return <span className="text-2xl">{name}</span>
}

type Answers = Record<string, string>

type ResultProduct = {
  handle: string
  name: string
  img: string
  price: string
}

function resolveProducts(handles: string[]): ResultProduct[] {
  return handles
    .map((handle) => {
      const p = FALLBACK_PRODUCTS.find((fp) => fp.handle === handle)
      if (!p) return null
      const amount = parseFloat(p.priceRange.minVariantPrice.amount)
      return {
        handle: p.handle,
        name: p.title,
        img: p.images[0]?.url ?? '/images/products/_ALL13.jpg',
        price: `£${amount.toFixed(2)}`,
      }
    })
    .filter((p): p is ResultProduct => p !== null)
}

function pickResult(config: QuizConfig, answers: Answers): QuizResult {
  const firstQuestion = config.questions[0]
  const primaryAnswer = firstQuestion ? answers[firstQuestion.id] : undefined
  return (
    config.results.find((r) => r.key === primaryAnswer) ?? config.results[0]
  )
}

export default function QuizClient({ config }: { config: QuizConfig }) {
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState<Answers>({})
  const [complete, setComplete] = useState(false)

  const questions = config.questions
  const currentQuestion = questions[step]
  const totalSteps = questions.length

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

  const result = complete ? pickResult(config, answers) : null
  const resultProducts = result ? resolveProducts(result.productHandles) : []

  return (
    <div className="min-h-screen bg-brand-cream pt-24 md:pt-28">
      {/* Header */}
      <div className="bg-brand-warm border-b border-brand-warm/80 py-14">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="font-body text-[11px] tracking-[0.35em] uppercase text-brand-amber mb-3">
            {config.intro.overline}
          </p>
          <h1 className="font-display font-semibold text-4xl md:text-5xl text-brand-dark">
            {config.intro.title}
          </h1>
          <p className="font-body text-sm text-brand-muted mt-3">
            {config.intro.subtitle}
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
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
                {currentQuestion.title}
              </h2>
              {currentQuestion.subtitle && (
                <p className="font-body text-sm text-brand-muted mt-3">
                  {currentQuestion.subtitle}
                </p>
              )}
            </div>

            {/* Options */}
            <div className="grid grid-cols-2 gap-4">
              {currentQuestion.options.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleAnswer(option.value)}
                  className="group p-7 border border-brand-warm rounded-lg bg-white text-left hover:border-brand-amber hover:bg-brand-amber/5 transition-all duration-200 active:scale-[0.98] shadow-sm"
                >
                  {option.icon && (
                    <div className="mb-4">
                      <QuizIcon name={option.icon} />
                    </div>
                  )}
                  <h3 className="font-display font-semibold text-xl text-brand-dark group-hover:text-brand-amber transition-colors mb-2">
                    {option.label}
                  </h3>
                  {option.description && (
                    <p className="font-body text-sm text-brand-muted leading-relaxed">
                      {option.description}
                    </p>
                  )}
                  <div className="mt-4 border-t border-brand-warm/60" />
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
                {result!.title}
              </h2>
              <p className="font-body text-base text-brand-muted max-w-xl mx-auto leading-relaxed">
                {result!.description}
              </p>
            </div>

            {/* Recommended products */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-10">
              {resultProducts.map((product) => (
                <Link
                  key={product.handle}
                  href={`/products/${product.handle}`}
                  className="group block border border-brand-warm hover:border-brand-amber transition-colors"
                >
                  <div className="relative aspect-[4/5] overflow-hidden">
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
                className="inline-flex items-center justify-center px-10 py-4 bg-brand-amber text-white font-body text-xs tracking-widest uppercase hover:bg-[#b87f43] transition-colors"
              >
                {config.intro.buttonLabel}
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
