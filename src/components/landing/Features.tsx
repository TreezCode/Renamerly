'use client'

import { motion } from 'framer-motion'
import { Lock, Eye, Zap, Clock, Layers, MousePointerClick } from 'lucide-react'
import { landingCopy } from '@/lib/landing-copy'

const icons: Record<string, typeof Lock> = {
  'Smart Descriptor Locking': Lock,
  'Instant Preview': Eye,
  'Zero Learning Curve': Zap,
  'Actually Saves Time': Clock,
  'Bulk Operations': Layers,
  'No Signup Required': MousePointerClick,
}

export function Features() {
  const { heading, subheading, items } = landingCopy.features

  return (
    <section id="features" className="py-16 sm:py-20 md:py-28 lg:py-32 bg-deep-space/50">
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

        {/* Features Grid */}
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.1 }}
          variants={{
            hidden: { opacity: 0 },
            show: {
              opacity: 1,
              transition: { staggerChildren: 0.1 },
            },
          }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
        >
          {items.map((feature) => {
            const Icon = icons[feature.title]
            return (
              <motion.div
                key={feature.title}
                variants={{
                  hidden: { opacity: 0, scale: 0.9 },
                  show: { opacity: 1, scale: 1 },
                }}
                className="group relative overflow-hidden bg-white/2 backdrop-blur-xl backdrop-saturate-120 border border-white/10 rounded-xl p-6 shadow-lg shadow-black/20 hover:bg-white/4 hover:border-treez-purple/30 hover:shadow-xl hover:shadow-treez-purple/20 hover:scale-[1.03] transition-all duration-500"
              >
                {/* Inner glow accent on hover */}
                <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none bg-linear-to-br from-treez-purple/5 via-transparent to-treez-cyan/5" />
                
                <div className="relative flex items-start gap-4">
                  <div className="shrink-0">
                    <div className="w-12 h-12 rounded-lg bg-linear-to-br from-treez-purple/20 to-treez-cyan/20 flex items-center justify-center group-hover:from-treez-purple/30 group-hover:to-treez-cyan/30 group-hover:shadow-lg group-hover:shadow-treez-cyan/20 transition-all duration-500">
                      <Icon className="w-6 h-6 text-treez-cyan group-hover:text-treez-purple group-hover:scale-110 transition-all duration-500" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-treez-cyan transition-colors duration-500">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors duration-500">{feature.description}</p>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}
