import Accordion from '@/components/ui/Accordion'

const FAQ_ITEMS = [
  {
    title: 'Is ghee really good for skin?',
    content: (
      <p>
        Yes — ghee has been central to Ayurvedic skincare for over 5,000 years.
        It is rich in vitamins A, D, E and K, essential fatty acids, and natural
        antioxidants. Unlike many synthetic moisturisers, ghee works with your skin&apos;s
        own lipid barrier to deliver deep, lasting nourishment without harsh additives.
      </p>
    ),
  },
  {
    title: 'Will ghee-based skincare clog my pores?',
    content: (
      <p>
        No. Pure ghee has one of the lowest comedogenic ratings (0–1) of any fatty
        ingredient, meaning it is extremely unlikely to block pores. Our formulas
        absorb beautifully, leaving skin soft — not greasy.
      </p>
    ),
  },
  {
    title: 'Is this suitable for sensitive or reactive skin?',
    content: (
      <p>
        All Inherited Skincare products are formulated without harsh synthetics,
        artificial fragrances, parabens, or sulphates, and every product is CPSR
        safety tested. That said, if your skin is very reactive, we always recommend
        a patch test on your inner wrist 24 hours before full use.
      </p>
    ),
  },
  {
    title: 'Are your products cruelty-free?',
    content: (
      <p>
        Absolutely. We never test on animals at any stage of production, and we only
        work with suppliers who share that commitment.
      </p>
    ),
  },
  {
    title: 'Are your products vegan?',
    content: (
      <p>
        Our products contain clarified butter (ghee), which is derived from cow&apos;s milk,
        making them vegetarian but not vegan. We&apos;re proud to use this time-honoured
        Ayurvedic ingredient exactly as nature intended.
      </p>
    ),
  },
  {
    title: 'Is it safe to use during pregnancy or breastfeeding?',
    content: (
      <p>
        Our ingredients are natural and our products are CPSR safety certified.
        However, as with any new skincare during pregnancy or breastfeeding, we
        recommend checking with your midwife or GP before introducing them into
        your routine.
      </p>
    ),
  },
  {
    title: 'How long will a product last me?',
    content: (
      <p>
        With regular daily use, most products last 4–8 weeks. A little goes a long
        way — you only need a pea-sized amount per application. Store away from
        direct sunlight and excess moisture to maintain freshness.
      </p>
    ),
  },
  {
    title: 'How quickly will I see results?',
    content: (
      <p>
        Many customers notice visibly softer, more radiant skin within 1–2 weeks
        of consistent use. For lasting transformation — improved texture, tone and
        glow — we recommend committing to the ritual for at least 4 weeks.
      </p>
    ),
  },
  {
    title: 'Where are your products made?',
    content: (
      <p>
        Every product is handcrafted in small batches in the UK, ensuring the
        freshest possible formulas and careful quality control at every step.
      </p>
    ),
  },
  {
    title: 'What is your returns policy?',
    content: (
      <p>
        We accept returns of unused, unopened products within 14 days of delivery.
        Please email us at{' '}
        <a href="mailto:suruchi@inheritedskincare.com" className="text-brand-amber underline underline-offset-2">
          suruchi@inheritedskincare.com
        </a>{' '}
        and we will arrange everything for you.
      </p>
    ),
  },
]

export default function ProductFAQ() {
  return (
    <div className="max-w-3xl mt-16">
      <h2 className="font-display font-semibold text-2xl md:text-3xl text-brand-dark mb-6">
        Frequently Asked Questions
      </h2>
      <Accordion items={FAQ_ITEMS} expandAllOnDesktop />
    </div>
  )
}
