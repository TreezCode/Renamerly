'use client'

import { motion } from 'framer-motion'
import { ShoppingBag, Paintbrush, Camera, Briefcase } from 'lucide-react'
import { landingCopy } from '@/lib/landing-copy'

const icons = {
  'Shopify store owners': ShoppingBag,
  'Etsy sellers': Paintbrush,
  'Product photographers': Camera,
  Freelancers: Briefcase,
}

export function Audience() {
  const { heading, subheading, personas, reinforcement } = landingCopy.audience

  return (
    <section className="py-16 sm:py-20 md:py-28 lg:py-32 bg-deep-space/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6 font-display">
            {heading}
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-400 max-w-3xl mx-auto">
            {subheading}
          </p>
        </motion.div>

        {/* Persona Cards */}
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
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 mb-12"
        >
          {personas.map((persona) => {
            const Icon = icons[persona.title as keyof typeof icons]
            return (
              <motion.div
                key={persona.title}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  show: { opacity: 1, y: 0 },
                }}
                className="group relative bg-white/2 backdrop-blur-xl backdrop-saturate-120 border border-white/10 rounded-xl p-6 shadow-lg shadow-black/20 hover:bg-white/4 hover:border-treez-purple/30 hover:shadow-xl hover:shadow-treez-purple/20 hover:scale-[1.03] transition-all duration-500 text-center"
              >
                {/* Inner glow accent on hover */}
                <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none bg-linear-to-br from-treez-purple/5 via-transparent to-treez-cyan/5" />
                
                <div className="relative w-12 h-12 mx-auto mb-4 rounded-lg bg-linear-to-br from-treez-purple/20 to-treez-cyan/20 flex items-center justify-center group-hover:from-treez-purple/30 group-hover:to-treez-cyan/30 group-hover:shadow-lg group-hover:shadow-treez-cyan/20 transition-all duration-500">
                  <Icon className="w-6 h-6 text-treez-cyan group-hover:text-treez-purple group-hover:scale-110 transition-all duration-500" />
                </div>
                <h3 className="relative text-lg font-semibold text-white mb-2 group-hover:text-treez-cyan transition-colors duration-500">
                  {persona.title}
                </h3>
                <p className="relative text-sm text-gray-400 group-hover:text-gray-300 transition-colors duration-500">{persona.description}</p>
              </motion.div>
            )
          })}
        </motion.div>

        {/* Reinforcement */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-lg sm:text-xl text-center text-gray-300 max-w-2xl mx-auto"
        >
          {reinforcement}
        </motion.p>
      </div>
    </section>
  )
}
