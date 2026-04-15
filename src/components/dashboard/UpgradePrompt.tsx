'use client'

import { motion } from 'framer-motion'
import { Crown, X, Check, ArrowRight } from 'lucide-react'
import Link from 'next/link'

interface UpgradePromptProps {
  title?: string
  description?: string
  features?: string[]
  onClose?: () => void
  inline?: boolean
}

export function UpgradePrompt({
  title = 'Upgrade to Pro',
  description = 'Unlock unlimited power and advanced features',
  features = [
    'Unlimited images per session',
    'Unlimited saved projects',
    '10 saved templates',
    'RAW processing & conversion',
    'Priority support',
  ],
  onClose,
  inline = false,
}: UpgradePromptProps) {
  if (inline) {
    return (
      <div className="bg-gradient-to-r from-treez-purple/10 to-treez-pink/10 border border-treez-purple/30 rounded-xl p-6">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-gradient-to-br from-treez-purple/20 to-treez-cyan/20 border border-treez-purple/30 rounded-lg shrink-0">
            <Crown className="w-6 h-6 text-treez-purple" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
            <p className="text-gray-400 text-sm mb-4">{description}</p>
            <Link
              href="/pricing"
              className="inline-flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-treez-purple to-treez-pink rounded-lg font-semibold text-white hover:scale-105 transition-all duration-300"
            >
              <span>View Pricing</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors shrink-0"
              aria-label="Close"
            >
              <X className="w-5 h-5 text-gray-400" />
            </button>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.3 }}
        className="relative bg-[#1a1a2e]/95 backdrop-blur-xl border border-white/10 rounded-2xl p-8 max-w-lg w-full shadow-2xl shadow-treez-purple/20"
      >
        {/* Close button */}
        {onClose && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-lg transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        )}

        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="p-4 bg-gradient-to-br from-treez-purple/20 to-treez-cyan/20 border border-treez-purple/30 rounded-2xl">
            <Crown className="w-12 h-12 text-treez-purple" />
          </div>
        </div>

        {/* Title */}
        <h2 className="text-3xl font-bold text-center mb-3">
          <span className="bg-gradient-to-r from-treez-purple to-treez-cyan bg-clip-text text-transparent">
            {title}
          </span>
        </h2>

        {/* Description */}
        <p className="text-gray-400 text-center mb-8">{description}</p>

        {/* Features */}
        <ul className="space-y-3 mb-8">
          {features.map((feature, idx) => (
            <li key={idx} className="flex items-start gap-3">
              <Check className="w-5 h-5 text-treez-cyan shrink-0 mt-0.5" />
              <span className="text-gray-300">{feature}</span>
            </li>
          ))}
        </ul>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            href="/api/stripe/checkout"
            className="group relative flex-1 py-4 bg-gradient-to-r from-treez-purple to-treez-pink rounded-xl font-semibold text-white shadow-lg hover:shadow-treez-purple/50 transition-all duration-300 hover:scale-105 overflow-hidden flex items-center justify-center gap-2"
          >
            <span className="relative z-10">Upgrade Now</span>
            <ArrowRight className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform" />
            <div className="absolute inset-0 bg-gradient-to-r from-treez-pink to-treez-purple opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </Link>
          <Link
            href="/pricing"
            className="flex-1 py-4 border-2 border-treez-cyan rounded-xl font-semibold text-treez-cyan hover:bg-treez-cyan/10 transition-all duration-300 hover:scale-105 text-center"
          >
            View Pricing
          </Link>
        </div>

        {/* Fine print */}
        <p className="text-xs text-gray-500 text-center mt-6">
          14-day money-back guarantee • Cancel anytime
        </p>
      </motion.div>
    </div>
  )
}

// Banner version for persistent display
export function UpgradeBanner({ onClose }: { onClose?: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-gradient-to-r from-treez-purple/10 to-treez-pink/10 border-b border-treez-purple/30"
    >
      <div className="max-w-7xl mx-auto px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Crown className="w-5 h-5 text-treez-purple shrink-0" />
            <p className="text-sm sm:text-base text-white">
              <span className="font-semibold">Upgrade to Pro</span> for unlimited images and advanced features
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/pricing"
              className="px-4 py-2 bg-gradient-to-r from-treez-purple to-treez-pink rounded-lg font-semibold text-white text-sm hover:scale-105 transition-all duration-300 whitespace-nowrap"
            >
              Upgrade
            </Link>
            {onClose && (
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                aria-label="Dismiss"
              >
                <X className="w-4 h-4 text-gray-400" />
              </button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  )
}
