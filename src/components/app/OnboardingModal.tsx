'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Hash, Tag, Download } from 'lucide-react'
import { useAssetStore } from '@/stores/useAssetStore'
import { Button } from '@/components/ui/Button'

export function OnboardingModal() {
  const hasSeenOnboarding = useAssetStore((state) => state.hasSeenOnboarding)
  const images = useAssetStore((state) => state.images)
  const setOnboardingComplete = useAssetStore((state) => state.setOnboardingComplete)
  const [dontShowAgain, setDontShowAgain] = useState(false)
  const [isVisible, setIsVisible] = useState(true)

  const shouldShow = !hasSeenOnboarding && images.length > 0 && isVisible

  const handleClose = () => {
    if (dontShowAgain) {
      setOnboardingComplete()
    } else {
      setIsVisible(false)
    }
  }

  return (
    <AnimatePresence>
      {shouldShow && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: 'spring', damping: 20 }}
            className="relative bg-cosmic-gray/95 backdrop-blur-xl 
              border border-white/10 
              rounded-2xl 
              max-w-2xl w-full mx-4 
              shadow-2xl shadow-treez-purple/20
              max-h-[90vh] flex flex-col"
          >
            <button
              onClick={handleClose}
              aria-label="Close onboarding modal"
              className="absolute top-4 right-4 w-8 h-8 rounded-full 
                bg-white/5 hover:bg-white/10 
                flex items-center justify-center
                transition-all duration-300 hover:scale-110"
            >
              <X className="w-4 h-4 text-gray-400" />
            </button>

            {/* Scrollable content area */}
            <div className="overflow-y-auto overflow-x-hidden p-4 sm:p-6 md:p-8">
              <div className="text-center mb-4 sm:mb-6">
                <div className="mb-3 sm:mb-4">
                  <img
                    src="/brand/logo-full.webp"
                    alt="Renamify"
                    className="h-10 sm:h-14 md:h-16 w-auto mx-auto"
                  />
                </div>
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-1 sm:mb-2">
                  Welcome to Renamify!
                </h2>
                <p className="text-sm sm:text-base text-gray-400">
                  Let&apos;s organize your images in 3 simple steps
                </p>
              </div>

                <div className="space-y-3 sm:space-y-4">
                  <div className="flex gap-3 sm:gap-4 p-3 sm:p-4 rounded-lg bg-white/5 border border-white/10">
                    <div className="shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-full 
                      bg-linear-to-r from-treez-purple to-treez-pink 
                      flex items-center justify-center text-white font-bold text-sm sm:text-base">
                      1
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5 sm:gap-2 mb-0.5 sm:mb-1">
                        <Hash className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-treez-purple" />
                        <h3 className="text-sm sm:text-base font-semibold text-white">Assign Product SKUs</h3>
                      </div>
                      <p className="text-xs sm:text-sm text-gray-400 leading-snug">
                        Enter your product SKU or ID (e.g., &quot;63755&quot;, &quot;AB-100&quot;). Images are auto-grouped by SKU.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3 sm:gap-4 p-3 sm:p-4 rounded-lg bg-white/5 border border-white/10">
                    <div className="shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-full 
                      bg-linear-to-r from-treez-purple to-treez-pink 
                      flex items-center justify-center text-white font-bold text-sm sm:text-base">
                      2
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5 sm:gap-2 mb-0.5 sm:mb-1">
                        <Tag className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-treez-cyan" />
                        <h3 className="text-sm sm:text-base font-semibold text-white">Add Descriptors</h3>
                      </div>
                      <p className="text-xs sm:text-sm text-gray-400 leading-snug">
                        Select descriptors for each image (front, back, detail, etc.) to complete the filename.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3 sm:gap-4 p-3 sm:p-4 rounded-lg bg-white/5 border border-white/10">
                    <div className="shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-full 
                      bg-linear-to-r from-treez-purple to-treez-pink 
                      flex items-center justify-center text-white font-bold text-sm sm:text-base">
                      3
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5 sm:gap-2 mb-0.5 sm:mb-1">
                        <Download className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-success" />
                        <h3 className="text-sm sm:text-base font-semibold text-white">Export ZIP</h3>
                      </div>
                      <p className="text-xs sm:text-sm text-gray-400 leading-snug">
                        Click &quot;Export ZIP&quot; to download all your perfectly renamed images!
                      </p>
                    </div>
                  </div>
                </div>
              </div>

            {/* Footer with actions - fixed at bottom */}
            <div className="border-t border-white/10 p-4 sm:p-6 space-y-3 sm:space-y-4 bg-cosmic-gray/50">
              <label className="flex items-center justify-center gap-2 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={dontShowAgain}
                  onChange={(e) => setDontShowAgain(e.target.checked)}
                  className="w-4 h-4 rounded border-white/20 bg-white/5 
                    text-treez-purple focus:ring-2 focus:ring-treez-purple 
                    focus:ring-offset-0 cursor-pointer
                    checked:bg-treez-purple checked:border-treez-purple"
                />
                <span className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors">
                  Don&apos;t show this again
                </span>
              </label>

              <div className="flex justify-center">
                <Button
                  variant="primary"
                  size="lg"
                  onClick={handleClose}
                  className="gap-2"
                >
                  Got it, let&apos;s start!
                </Button>
              </div>

              <p className="text-center text-[10px] sm:text-xs text-gray-500 leading-tight">
                Tip: Use bulk actions to assign SKUs or descriptors to multiple images at once
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
