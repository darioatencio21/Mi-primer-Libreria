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
