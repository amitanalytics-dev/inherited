import { getProducts } from '@/lib/queries'
import { getSiteSettings, DEFAULT_SECTION_ORDER } from '@/lib/site-settings'
import Hero from '@/components/sections/Hero'
import MarqueeBand from '@/components/sections/MarqueeBand'
import TrustRow from '@/components/sections/TrustRow'
import BestsellerGrid from '@/components/sections/BestsellerGrid'
import ShopByConcern from '@/components/sections/ShopByConcern'
import StorySection from '@/components/sections/StorySection'
import ScienceRitual from '@/components/sections/ScienceRitual'
import PressCarousel from '@/components/sections/PressCarousel'
import PositivityQuotes from '@/components/sections/PositivityQuotes'
import IngredientsSpotlight from '@/components/sections/IngredientsSpotlight'
import QuizCTA from '@/components/sections/QuizCTA'
import InstagramFeed from '@/components/sections/InstagramFeed'
import type { Product } from '@/types'

export const revalidate = 30

export default async function HomePage() {
  let products: Product[] = []

  try {
    products = await getProducts(8)
  } catch {
    products = []
  }

  const settings = await getSiteSettings()
  const show = settings.showSections
  const order = settings.sectionOrder?.length ? settings.sectionOrder : DEFAULT_SECTION_ORDER

  function renderSection(key: string) {
    switch (key) {
      case 'marquee':
        return show.marquee ? <MarqueeBand key="marquee" /> : null
      case 'trustRow':
        return show.trustRow ? <TrustRow key="trustRow" items={settings.uspItems} /> : null
      case 'bestsellers':
        return show.bestsellers ? <BestsellerGrid key="bestsellers" products={products} /> : null
      case 'shopByConcern':
        return show.shopByConcern ? (
          <ShopByConcern
            key="shopByConcern"
            images={{
              sensitive: settings.images.concernSensitive,
              dry: settings.images.concernDry,
              dullness: settings.images.concernDullness,
            }}
          />
        ) : null
      case 'story':
        return show.story ? <StorySection key="story" image={settings.images.story} /> : null
      case 'scienceRitual':
        return show.scienceRitual ? <ScienceRitual key="scienceRitual" /> : null
      case 'ghee':
        // Retired: the duplicate black Power of Ghee section. The white
        // Power of Ghee section is rendered by the 'ingredients' key below.
        return null
      case 'reviews':
        return show.reviews ? <PositivityQuotes key="reviews" /> : null
      case 'ingredients':
        return show.ingredients ? (
          <IngredientsSpotlight key="ingredients" image={settings.images.gheeImage} />
        ) : null
      case 'quizCta':
        return show.quizCta ? <QuizCTA key="quizCta" /> : null
      case 'instagram':
        return show.instagram ? <InstagramFeed key="instagram" /> : null
      default:
        return null
    }
  }

  return (
    <>
      <Hero
        headline1={settings.heroHeadline1}
        headline2={settings.heroHeadline2}
        subline={settings.heroSubline}
        image={settings.images.hero}
      />
      {order.map(renderSection)}
      <PressCarousel />
    </>
  )
}
