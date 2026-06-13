'use client'

import { motion, useReducedMotion } from 'framer-motion'

interface RevealProps {
  children: React.ReactNode
  className?: string
  /** Stagger delay in seconds */
  delay?: number
  /** Initial y offset in px */
  y?: number
}

/**
 * Scroll-reveal wrapper — fades and slides content up when it enters
 * the viewport (fires once). Use `delay` to stagger siblings.
 * Server components can import this as a client island.
 */
export default function Reveal({
  children,
  className,
  delay = 0,
  y = 24,
}: RevealProps) {
  const prefersReducedMotion = useReducedMotion()

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.7, delay, ease: [0.21, 0.47, 0.32, 0.98] }}
    >
      {children}
    </motion.div>
  )
}
