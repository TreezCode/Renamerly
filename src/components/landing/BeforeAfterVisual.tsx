'use client'

import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'

export function BeforeAfterVisual() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, delay: 0.3 }}
      className="w-full max-w-2xl mx-auto"
    >
      <div className="relative bg-white/2 backdrop-blur-xl backdrop-saturate-120 border border-white/10 rounded-xl p-4 sm:p-6 shadow-xl shadow-black/20">
        {/* Before/After Labels */}
        <div className="grid grid-cols-[1fr_auto_1fr] gap-2 sm:gap-4 items-center mb-3 sm:mb-4">
          <div className="text-center">
            <span className="text-xs sm:text-sm font-semibold text-gray-400 uppercase tracking-wide">Before</span>
          </div>
          <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 text-treez-cyan shrink-0" />
          <div className="text-center">
            <span className="text-xs sm:text-sm font-semibold text-treez-cyan uppercase tracking-wide">After</span>
          </div>
        </div>

        {/* File Examples */}
        <div className="space-y-2 sm:space-y-3">
          {[
            { before: 'IMG_2045.jpg', after: 'product-front.jpg', delay: 0.05 },
            { before: 'DSC_0892.png', after: 'product-rear.png', delay: 0.1 },
            { before: 'photo (3).jpeg', after: 'product-side.jpeg', delay: 0.15 },
          ].map((item) => (
            <motion.div
              key={item.before}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.4 + item.delay }}
              className="grid grid-cols-[1fr_auto_1fr] gap-2 sm:gap-4 items-center"
            >
              {/* Before */}
              <div className="bg-deep-space/50 border border-white/5 rounded-lg px-2 sm:px-3 py-1.5 sm:py-2 overflow-hidden">
                <p className="text-xs sm:text-sm text-gray-400 font-mono truncate">
                  {item.before}
                </p>
              </div>

              {/* Arrow */}
              <div className="shrink-0">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ 
                    duration: 0.2, 
                    delay: 0.5 + item.delay,
                    type: 'spring',
                    stiffness: 300
                  }}
                >
                  <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 text-treez-cyan/50" />
                </motion.div>
              </div>

              {/* After */}
              <motion.div
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.5 + item.delay }}
                className="bg-linear-to-r from-treez-purple/10 to-treez-cyan/10 border border-treez-cyan/30 rounded-lg px-2 sm:px-3 py-1.5 sm:py-2 overflow-hidden"
              >
                <p className="text-xs sm:text-sm text-white font-mono truncate">
                  {item.after}
                </p>
              </motion.div>
            </motion.div>
          ))}
        </div>

        {/* Trust Signal */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.7 }}
          className="mt-4 sm:mt-6 text-center"
        >
          <p className="text-xs sm:text-sm text-gray-400">
            <span className="text-treez-cyan font-semibold">Instant results</span> • No signup required
          </p>
        </motion.div>
      </div>
    </motion.div>
  )
}
