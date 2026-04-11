'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { X, Upload, FolderPlus, Hash, Tag, Download } from 'lucide-react'
import { useAssetStore } from '@/stores/useAssetStore'
import { Button } from '@/components/ui/Button'

export function OnboardingModal() {
  const hasSeenOnboarding = useAssetStore((state) => state.hasSeenOnboarding)
  const images = useAssetStore((state) => state.images)
  const setOnboardingComplete = useAssetStore((state) => state.setOnboardingComplete)

  const shouldShow = !hasSeenOnboarding && images.length > 0

  const handleClose = () => {
    setOnboardingComplete()
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
            className="relative bg-[#1a1a2e]/95 backdrop-blur-xl 
              border border-white/10 
              rounded-2xl p-6 sm:p-8 
              max-w-2xl w-full mx-4 
              shadow-2xl shadow-[#915eff]/20"
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

            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full 
                bg-gradient-to-br from-[#915eff]/20 to-[#00d4ff]/20 
                border border-[#915eff]/30 mb-4">
                <Upload className="w-8 h-8 text-[#915eff]" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                Welcome to AssetFlow!
              </h2>
              <p className="text-gray-400">
                Let's organize your images in 4 simple steps
              </p>
            </div>

            <div className="space-y-4 mb-8">
              <div className="flex gap-4 p-4 rounded-lg bg-white/5 border border-white/10">
                <div className="flex-shrink-0 w-10 h-10 rounded-full 
                  bg-gradient-to-r from-[#915eff] to-[#ff6b9d] 
                  flex items-center justify-center text-white font-bold">
                  1
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <FolderPlus className="w-4 h-4 text-[#915eff]" />
                    <h3 className="font-semibold text-white">Create Product Groups</h3>
                  </div>
                  <p className="text-sm text-gray-400">
                    Click "Create Group" below and name your product (e.g., "Sneakers", "Hoodies")
                  </p>
                </div>
              </div>

              <div className="flex gap-4 p-4 rounded-lg bg-white/5 border border-white/10">
                <div className="flex-shrink-0 w-10 h-10 rounded-full 
                  bg-gradient-to-r from-[#915eff] to-[#ff6b9d] 
                  flex items-center justify-center text-white font-bold">
                  2
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Hash className="w-4 h-4 text-[#00d4ff]" />
                    <h3 className="font-semibold text-white">Add Product SKU</h3>
                  </div>
                  <p className="text-sm text-gray-400">
                    Enter your product&apos;s SKU or ID (e.g., &quot;63755&quot;, &quot;AB-100&quot;)
                  </p>
                </div>
              </div>

              <div className="flex gap-4 p-4 rounded-lg bg-white/5 border border-white/10">
                <div className="flex-shrink-0 w-10 h-10 rounded-full 
                  bg-gradient-to-r from-[#915eff] to-[#ff6b9d] 
                  flex items-center justify-center text-white font-bold">
                  3
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Tag className="w-4 h-4 text-[#ff6b9d]" />
                    <h3 className="font-semibold text-white">Assign & Label Images</h3>
                  </div>
                  <p className="text-sm text-gray-400">
                    Click ungrouped images to assign them, then select descriptors (front, back, etc.)
                  </p>
                </div>
              </div>

              <div className="flex gap-4 p-4 rounded-lg bg-white/5 border border-white/10">
                <div className="flex-shrink-0 w-10 h-10 rounded-full 
                  bg-gradient-to-r from-[#915eff] to-[#ff6b9d] 
                  flex items-center justify-center text-white font-bold">
                  4
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Download className="w-4 h-4 text-success" />
                    <h3 className="font-semibold text-white">Export</h3>
                  </div>
                  <p className="text-sm text-gray-400">
                    Click "Export ZIP" to download your renamed images!
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-center">
              <Button
                variant="primary"
                size="lg"
                onClick={handleClose}
                className="gap-2"
              >
                Got it, let's start!
              </Button>
            </div>

            <p className="text-center text-xs text-gray-500 mt-4">
              You can collapse sections by clicking the chevron icons
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
