'use client'

import { RefreshCw } from 'lucide-react'
import { useAssetStore } from '@/stores/useAssetStore'
import { MAX_FREE_IMAGES } from '@/lib/constants'
import { Button } from '@/components/ui/Button'

export function AppToolbar() {
  const images = useAssetStore((state) => state.images)
  const reset = useAssetStore((state) => state.reset)
  const showConfirmDialog = useAssetStore((state) => state.showConfirmDialog)
  const addToast = useAssetStore((state) => state.addToast)

  const imageCount = images.length
  const uniqueSkus = new Set(images.filter((img) => img.sku).map((img) => img.sku)).size
  const imagesWithSku = images.filter((img) => img.sku).length

  const handleReset = () => {
    if (imageCount === 0) return
    showConfirmDialog({
      title: 'Start over?',
      description: 'This will clear all images and SKUs. This action cannot be undone.',
      variant: 'danger',
      confirmLabel: 'Clear Everything',
      onConfirm: () => {
        reset()
        addToast('success', 'Session cleared')
      },
    })
  }

  const getCountColor = () => {
    const percentage = (imageCount / MAX_FREE_IMAGES) * 100
    if (percentage >= 100) return 'text-error'
    if (percentage >= 75) return 'text-yellow-400'
    return 'text-success'
  }

  return (
    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-4">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-4">
          <div>
            <span className="text-gray-400 text-sm mr-2">Images:</span>
            <span className={`font-semibold ${getCountColor()}`}>
              {imageCount} / {MAX_FREE_IMAGES}
            </span>
          </div>
          {uniqueSkus > 0 && (
            <>
              <div>
                <span className="text-gray-400 text-sm mr-2">Products:</span>
                <span className="font-semibold text-treez-purple">{uniqueSkus}</span>
              </div>
              <div>
                <span className="text-gray-400 text-sm mr-2">Configured:</span>
                <span className="font-semibold text-treez-cyan">
                  {imagesWithSku} / {imageCount}
                </span>
              </div>
            </>
          )}
        </div>

        <Button
          variant="secondary"
          size="sm"
          onClick={handleReset}
          disabled={imageCount === 0}
          className="gap-2"
        >
          <RefreshCw className="w-4 h-4" />
          Start Over
        </Button>
      </div>
    </div>
  )
}
