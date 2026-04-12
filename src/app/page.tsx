'use client'

import { useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Hero } from '@/components/landing/Hero'
import { Problem } from '@/components/landing/Problem'
import { Solution } from '@/components/landing/Solution'
import { HowItWorks } from '@/components/landing/HowItWorks'
import { Features } from '@/components/landing/Features'
import { Audience } from '@/components/landing/Audience'
import { Pricing } from '@/components/landing/Pricing'
import { CallToAction } from '@/components/landing/CallToAction'

export default function LandingPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const scrollTo = searchParams.get('scrollTo')

  useEffect(() => {
    if (scrollTo) {
      // Wait for page to render, then scroll to section
      setTimeout(() => {
        const element = document.getElementById(scrollTo)
        if (element) {
          // Account for fixed header height (64px)
          const headerOffset = 64
          const elementPosition = element.getBoundingClientRect().top
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset
          
          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          })
        }
        // Clean up URL by removing query param
        router.replace('/', { scroll: false })
      }, 100)
    }
  }, [scrollTo, router])

  return (
    <>
      <Hero />
      <Problem />
      <Solution />
      <HowItWorks />
      <Features />
      <Audience />
      <Pricing />
      <CallToAction />
    </>
  )
}
