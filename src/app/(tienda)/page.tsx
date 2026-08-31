import {
  Hero,
  BenefitsBar,
  CategoriesSection,
  BestsellersSection,
  EditorialBanner,
  RecommendedSection,
  AuthorsSection,
  WhyNovaBooks,
  TestimonialsSection,
  NewsletterSection,
} from '@/components/home'
import { getCategorias } from '@/lib/db'

export default async function Home() {
  const categorias = await getCategorias()

  return (
    <>
      <Hero />
      <BenefitsBar />
      <CategoriesSection categories={categorias} />
      <BestsellersSection />
      <EditorialBanner />
      <RecommendedSection />
      <AuthorsSection />
      <WhyNovaBooks />
      <TestimonialsSection />
      <NewsletterSection />
    </>
  )
}
