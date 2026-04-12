'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Check } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { landingCopy } from '@/lib/landing-copy'

export function Pricing() {
  const { heading, subheading, reinforcement, tiers } = landingCopy.pricing
  const tierData = [
    {
      ...tiers.free,
      ctaLink: '/app',
      highlighted: false,
    },
    {
      ...tiers.pro,
      ctaLink: null,
      highlighted: true,
    },
  ]

  return (
    <section id="pricing" className="py-16 sm:py-20 md:py-28 lg:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 font-display">
            {heading}
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-400 max-w-2xl mx-auto">
            {subheading}
          </p>
        </motion.div>

        {/* Pricing Cards */}
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          variants={{
            hidden: { opacity: 0 },
            show: {
              opacity: 1,
              transition: { staggerChildren: 0.15 },
            },
          }}
          className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl mx-auto"
        >
          {tierData.map((tier) => (
            <motion.div
              key={tier.name}
              variants={{
                hidden: { opacity: 0, scale: 0.9 },
                show: { opacity: 1, scale: 1 },
              }}
              className={`group relative rounded-xl p-8 transition-all duration-500 isolate ${
                tier.highlighted
                  ? 'bg-white/3 backdrop-blur-2xl backdrop-saturate-150 border-2 border-treez-purple/50 shadow-xl shadow-treez-purple/20 md:scale-105 hover:shadow-2xl hover:shadow-treez-purple/30 hover:border-treez-purple/70'
                  : 'bg-white/2 backdrop-blur-xl backdrop-saturate-120 border border-white/10 shadow-lg shadow-black/20 hover:bg-white/4 hover:border-white/20 hover:shadow-xl hover:shadow-black/30 hover:scale-[1.02]'
              }`}
            >
              {/* Inner glow accent */}
              <div className={`absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none ${
                tier.highlighted
                  ? 'bg-linear-to-br from-treez-purple/10 via-transparent to-treez-cyan/10'
                  : 'bg-linear-to-br from-white/5 via-transparent to-white/5'
              }`} />

              {/* Badge */}
              {'badge' in tier && tier.badge && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-linear-to-r from-treez-purple to-treez-pink text-white text-sm font-semibold shadow-lg shadow-treez-purple/50">
                  {tier.badge}
                </div>
              )}

              {/* Header */}
              <div className="relative text-center mb-8">
                <h3 className="text-2xl font-bold text-white mb-2">{tier.name}</h3>
                <div className="flex items-baseline justify-center gap-1 mb-2">
                  <span className="text-5xl font-bold text-white">{tier.price}</span>
                  {'priceSubtext' in tier && tier.priceSubtext && (
                    <span className="text-gray-400">{tier.priceSubtext}</span>
                  )}
                </div>
                <p className="text-sm text-gray-400">{tier.description}</p>
              </div>

              {/* Features */}
              <ul className="relative space-y-4 mb-8">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-success shrink-0 mt-0.5" />
                    <span className="text-gray-300 text-sm">{feature}</span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <div className="relative mt-auto">
                {tier.ctaLink ? (
                  <Link href={tier.ctaLink} className="block">
                    <Button
                      variant={tier.highlighted ? 'primary' : 'secondary'}
                      size="lg"
                      className="w-full"
                    >
                      {tier.cta}
                    </Button>
                  </Link>
                ) : (
                  <Button
                    variant={tier.highlighted ? 'primary' : 'secondary'}
                    size="lg"
                    className="w-full"
                    disabled
                  >
                    {tier.cta}
                  </Button>
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Reinforcement Text */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-center text-base text-gray-400 mt-12"
        >
          {reinforcement}
        </motion.p>
      </div>
    </section>
  )
}
