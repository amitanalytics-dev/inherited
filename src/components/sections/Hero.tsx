'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'

const PHOTO_HOLD_MS = 5000 // how long the photo shows between video plays

type HeroProps = {
  headline1?: string
  headline2?: string
  subline?: string
  image?: string
  video?: string
}

export default function Hero({
  headline1 = 'Glow Like You',
  headline2 = 'Inherited It.',
  subline = 'Ghee-powered Ayurvedic skincare. Handmade in the UK.',
  image = '/images/brand/hero_lifestyle.jpg',
  video: videoProp = '',
}: HeroProps) {
  const video = videoProp?.trim() || '/videos/hero.mov'
  const videoRef = useRef<HTMLVideoElement>(null)
  const [showVideo, setShowVideo] = useState(true)

  const handleVideoEnded = () => {
    setShowVideo(false)
    setTimeout(() => {
      setShowVideo(true)
      videoRef.current?.play()
    }, PHOTO_HOLD_MS)
  }

  useEffect(() => {
    videoRef.current?.play()
  }, [])

  return (
    <section className="relative w-full h-screen min-h-[600px] flex items-center overflow-hidden">
      {/* Background — image always present; video fades over it */}
      <Image
        src={image}
        alt="Warm ghee poured into a marble bowl beside the Deep Nourishing Cream on its pomegranate box"
        fill
        priority
        sizes="100vw"
        className="object-cover object-center sm:object-right"
      />
      <video
        ref={videoRef}
        src={video}
        muted
        playsInline
        onEnded={handleVideoEnded}
        className="absolute inset-0 w-full h-full object-cover object-center transition-opacity duration-1000"
        style={{ opacity: showVideo ? 1 : 0, minWidth: '100%', minHeight: '100%' }}
      />

      {/* Soft cream gradient on the left so dark text stays readable */}
      <div className="absolute inset-0 z-10 bg-gradient-to-r from-brand-cream/55 via-brand-cream/10 to-transparent" />

      {/* Content */}
      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="max-w-2xl">
          {/* Pre-heading */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="font-body text-[11px] tracking-[0.35em] uppercase text-brand-amber mb-6 font-semibold"
          >
            Ayurvedic Ghee Skincare · Made in UK
          </motion.p>

          {/* Main heading */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="font-display font-semibold text-brand-dark leading-[1.05] mb-6"
            style={{ fontSize: 'clamp(3rem, 7vw, 6.5rem)' }}
          >
            {headline1}
            <br />
            <em className="italic">{headline2}</em>
          </motion.h1>

          {/* Sub-heading */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.6 }}
            className="font-body text-base md:text-lg text-brand-muted max-w-md leading-relaxed mb-10"
          >
            {subline}
          </motion.p>

          {/* CTA buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.8 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <Link
              href="/products"
              className="inline-flex w-full sm:w-auto items-center justify-center px-8 py-4 bg-brand-amber text-white font-body text-xs tracking-widest uppercase hover:bg-[#b87f43] transition-colors shadow-lg hover:shadow-xl"
            >
              Shop the Ritual
            </Link>
            <Link
              href="/about"
              className="inline-flex w-full sm:w-auto items-center justify-center px-8 py-4 border border-brand-dark/50 text-brand-dark font-body text-xs tracking-widest uppercase hover:bg-brand-dark hover:text-brand-cream transition-colors"
            >
              Our Story
            </Link>
          </motion.div>

          {/* Social proof */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 1.1 }}
            className="mt-12 flex items-center gap-6"
          >
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((i) => (
                <svg
                  key={i}
                  className="w-3.5 h-3.5 text-brand-amber fill-current"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <p className="font-body text-sm text-brand-muted">
              <span className="text-brand-dark font-semibold">5★ Reviews</span>
              <span className="mx-2 text-brand-amber">|</span>
              1,800+ happy customers
            </p>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 0.6 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2"
      >
        <p className="font-body text-[10px] tracking-widest uppercase text-brand-muted/60">
          Scroll
        </p>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
          className="w-px h-8 bg-gradient-to-b from-brand-muted/50 to-transparent"
        />
      </motion.div>
    </section>
  )
}
