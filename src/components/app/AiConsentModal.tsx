'use client'

import { Sparkles, Shield, X, ExternalLink } from 'lucide-react'

interface AiConsentModalProps {
  isOpen: boolean
  onAccept: () => void
  onDecline: () => void
}

export function AiConsentModal({ isOpen, onAccept, onDecline }: AiConsentModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-9999 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onDecline} />
      <div className="relative z-10 w-full max-w-md bg-[#0d0d1a] border border-white/10 rounded-2xl shadow-2xl shadow-black/60 overflow-hidden">
        {/* Header */}
        <div className="px-6 pt-6 pb-4 border-b border-white/5">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-xl bg-treez-purple/15 border border-treez-purple/20 shrink-0">
              <Sparkles className="w-5 h-5 text-treez-purple" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-white">Enable AI Analysis</h2>
              <p className="text-sm text-gray-400 mt-0.5">Before we continue, a quick note about privacy</p>
            </div>
            <button
              onClick={onDecline}
              className="ml-auto p-1.5 rounded-lg text-gray-500 hover:text-white hover:bg-white/5 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-4">
          <div className="flex items-start gap-3 p-3 rounded-xl bg-white/3 border border-white/5">
            <Shield className="w-4 h-4 text-treez-cyan shrink-0 mt-0.5" />
            <div className="text-sm text-gray-300 space-y-1.5">
              <p>To generate descriptors and alt text, Renamerly sends your image to <strong className="text-white">OpenAI&apos;s Vision API</strong> for analysis.</p>
              <ul className="space-y-1 text-gray-400 text-xs">
                <li className="flex items-center gap-1.5"><span className="text-treez-cyan">✓</span> Images are analyzed and immediately discarded</li>
                <li className="flex items-center gap-1.5"><span className="text-treez-cyan">✓</span> No images are stored by OpenAI or Renamerly</li>
                <li className="flex items-center gap-1.5"><span className="text-treez-cyan">✓</span> Limited to 20 analyses per session</li>
                <li className="flex items-center gap-1.5"><span className="text-gray-500">→</span> Subject to <a href="https://openai.com/policies/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-treez-cyan hover:underline inline-flex items-center gap-0.5">OpenAI&apos;s privacy policy <ExternalLink className="w-3 h-3" /></a></li>
              </ul>
            </div>
          </div>

          <p className="text-xs text-gray-500">
            By clicking &ldquo;Enable AI&rdquo; you acknowledge that image data will be sent to OpenAI for processing. This preference is saved for your session.
          </p>
        </div>

        {/* Actions */}
        <div className="px-6 pb-6 flex items-center gap-3">
          <button
            onClick={onDecline}
            className="flex-1 px-4 py-2.5 rounded-xl text-sm font-medium text-gray-400
              bg-white/5 border border-white/10
              hover:bg-white/10 hover:text-white transition-colors"
          >
            Not now
          </button>
          <button
            onClick={onAccept}
            className="flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold text-white
              bg-treez-purple hover:bg-treez-purple/90 transition-colors
              shadow-lg shadow-treez-purple/20"
          >
            Enable AI
          </button>
        </div>
      </div>
    </div>
  )
}
