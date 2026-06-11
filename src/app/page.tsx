import { getProducts } from '@/lib/queries'
import Hero from '@/components/sections/Hero'
import MarqueeBand from '@/components/sections/MarqueeBand'
import BestsellerGrid from '@/components/sections/BestsellerGrid'
import StorySection from '@/components/sections/StorySection'
import ScienceRitual from '@/components/sections/ScienceRitual'
import PressCarousel from '@/components/sections/PressCarousel'
import IngredientsSpotlight from '@/components/sections/IngredientsSpotlight'
import QuizCTA from '@/components/sections/QuizCTA'
import InstagramFeed from '@/components/sections/InstagramFeed'
import type { Product } from '@/types'

export default async function HomePage() {
  let products: Product[] = []

  try {
    products = await getProducts(8)
  } catch {
    // Shopify token not yet set — render static fallback gracefully
    products = []
  }

  return (
    <>
      <Hero />
      <MarqueeBand />
      <BestsellerGrid products={products} />
      <StorySection />
      <ScienceRitual />
      <PressCarousel />
      <IngredientsSpotlight />
      <QuizCTA />
      <InstagramFeed />
    </>
  )
}
