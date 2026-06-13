'use client'

import { useState } from 'react'

const SUBJECTS: Record<string, string> = {
  order: 'Question about my order',
  product: 'Product advice for my skin',
  returns: 'Returns & refunds',
  wholesale: 'Wholesale & press',
  other: 'Website enquiry',
}

export default function ContactForm() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [subject, setSubject] = useState('order')
  const [message, setMessage] = useState('')

  function send(e: React.FormEvent) {
    e.preventDefault()
    const subj = encodeURIComponent(`${SUBJECTS[subject]} — ${name}`)
    const body = encodeURIComponent(
      `${message}\n\n—\nFrom: ${name}\nReply to: ${email}`
    )
    window.location.href = `mailto:hello@inheritedskincare.com?subject=${subj}&body=${body}`
  }

  return (
    <form
      onSubmit={send}
      className="bg-white border border-brand-warm p-6 md:p-8 space-y-5"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label
            htmlFor="name"
            className="block font-body text-xs tracking-widest uppercase text-brand-muted mb-2"
          >
            Your Name
          </label>
          <input
            id="name"
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Jane Smith"
            className="w-full bg-brand-cream border border-brand-warm px-4 py-3 font-body text-sm text-brand-dark placeholder:text-brand-muted/40 focus:outline-none focus:border-brand-amber transition-colors"
          />
        </div>
        <div>
          <label
            htmlFor="email"
            className="block font-body text-xs tracking-widest uppercase text-brand-muted mb-2"
          >
            Email Address
          </label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            className="w-full bg-brand-cream border border-brand-warm px-4 py-3 font-body text-sm text-brand-dark placeholder:text-brand-muted/40 focus:outline-none focus:border-brand-amber transition-colors"
          />
        </div>
      </div>
      <div>
        <label
          htmlFor="subject"
          className="block font-body text-xs tracking-widest uppercase text-brand-muted mb-2"
        >
          Subject
        </label>
        <select
          id="subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className="w-full bg-brand-cream border border-brand-warm px-4 py-3 font-body text-sm text-brand-dark focus:outline-none focus:border-brand-amber transition-colors"
        >
          <option value="order">Question about my order</option>
          <option value="product">Product advice for my skin</option>
          <option value="returns">Returns &amp; refunds</option>
          <option value="wholesale">Wholesale &amp; press</option>
          <option value="other">Something else</option>
        </select>
      </div>
      <div>
        <label
          htmlFor="message"
          className="block font-body text-xs tracking-widest uppercase text-brand-muted mb-2"
        >
          Your Message
        </label>
        <textarea
          id="message"
          rows={6}
          required
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Tell us how we can help..."
          className="w-full bg-brand-cream border border-brand-warm px-4 py-3 font-body text-sm text-brand-dark placeholder:text-brand-muted/40 focus:outline-none focus:border-brand-amber transition-colors resize-y"
        />
      </div>
      <button
        type="submit"
        className="w-full sm:w-auto inline-flex items-center justify-center px-10 py-4 bg-brand-amber text-white font-body text-xs tracking-widest uppercase hover:bg-[#b87f43] transition-colors"
      >
        Send Message
      </button>
      <p className="font-body text-xs text-brand-muted/70">
        Sending opens your email app addressed to{' '}
        <a
          href="mailto:hello@inheritedskincare.com"
          className="text-brand-amber underline underline-offset-2"
        >
          hello@inheritedskincare.com
        </a>
        .
      </p>
    </form>
  )
}
