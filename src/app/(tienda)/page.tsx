import {
  Hero,
  BenefitsBar,
  CategoriesSection,
  BestsellersSection,
  EditorialBanner,
  RecommendedSection,
  QuizSection,
  AuthorsSection,
  WhyUsSection,
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
      <QuizSection />
      <RecommendedSection />
      <AuthorsSection />
      <WhyUsSection />
      <TestimonialsSection />
      <NewsletterSection />
    </>
  )
}
