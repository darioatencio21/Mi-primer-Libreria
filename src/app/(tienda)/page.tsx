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

export const revalidate = 60

export default function Home() {
  return (
    <>
      <Hero />
      <BenefitsBar />
      <CategoriesSection />
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
