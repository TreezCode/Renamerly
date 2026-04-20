'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, Check } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { landingCopy } from '@/lib/landing-copy'
import { BeforeAfterVisual } from './BeforeAfterVisual'

export function Hero() {
  const handleScrollToHowItWorks = () => {
    document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section
      id="hero"
      className="relative flex flex-col items-center justify-start md:justify-center min-h-screen px-4 sm:px-6 lg:px-8 pt-20 pb-12 sm:py-24 md:py-28 lg:py-18"
    >
      {/* Gradient background accents */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-treez-purple/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-treez-cyan/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 text-center max-w-5xl mx-auto space-y-3 sm:space-y-6 md:space-y-8">
        {/* Badge - Now visible on mobile too */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="flex justify-center"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-white/5 backdrop-blur-sm border border-white/10">
            <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-treez-cyan" />
            <span className="text-xs sm:text-sm font-medium text-gray-300">
              {landingCopy.hero.badge}
            </span>
          </div>
        </motion.div>

        {/* Headline - Responsive sizing */}
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight font-display px-2"
        >
          <span className="bg-linear-to-r from-treez-purple via-treez-cyan to-treez-pink bg-clip-text text-transparent">
            {landingCopy.hero.headline}
          </span>
        </motion.h1>

        {/* Subheadline - Condensed on mobile */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-400 max-w-3xl mx-auto px-2"
        >
          {landingCopy.hero.subheadline}
        </motion.p>

        {/* Visual Proof - Mobile priority */}
        <BeforeAfterVisual />

        {/* Value Bullets - Hidden on mobile, visible on tablet+ */}
        <motion.ul
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.35 }}
          className="hidden md:flex flex-col space-y-3 max-w-2xl mx-auto text-left"
        >
          {landingCopy.hero.bullets.map((bullet) => (
            <li key={bullet} className="flex items-start gap-3">
              <Check className="w-5 h-5 text-success shrink-0 mt-0.5" />
              <span className="text-gray-300">{bullet}</span>
            </li>
          ))}
        </motion.ul>

        {/* CTAs - Simplified and consistent */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="space-y-4 pt-4"
        >
          {/* Button container */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 sm:gap-4">
            {/* Primary CTA */}
            <Link href="/app" className="w-full sm:w-auto">
              <Button variant="primary" size="lg" className="gap-2 w-full sm:w-auto sm:min-w-[200px]">
                {landingCopy.hero.primaryCta}
                <ArrowRight className="w-5 h-5 shrink-0" />
              </Button>
            </Link>
            
            {/* Secondary CTA - Same size as primary on desktop */}
            <Button
              variant="secondary"
              size="lg"
              onClick={handleScrollToHowItWorks}
              className="w-full sm:w-auto sm:min-w-[200px]"
            >
              {landingCopy.hero.secondaryCta}
            </Button>
          </div>
          
          {/* Trust reinforcement */}
          <p className="text-xs sm:text-sm text-gray-400 px-4">
            {landingCopy.hero.reinforcement}
          </p>
        </motion.div>
      </div>
    </section>
  )
}
