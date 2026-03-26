'use client'

import PublicHeader from '@/components/global/PublicHeader'
import { CareersSection } from '@/components/modules/landing-pages/careers'
import { HeroSection } from '@/components/modules/landing-pages/hero'
import ProductHighlight from '@/components/modules/landing-pages/ProductHighlight'
import { ResumeFeaturesSection } from '@/components/modules/landing-pages/resume-features'
import { TestimonialsSection } from '@/components/modules/landing-pages/testimonials'


export default function Home() {
  return (
    <main className="w-full bg-white dark:bg-background text-gray-900 dark:text-white">
     <PublicHeader/>
      <HeroSection />
      <TestimonialsSection />
      <ProductHighlight/>
      <ResumeFeaturesSection />

      <CareersSection />
    </main>
  )
}
