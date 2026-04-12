'use client'

import { useEffect, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Images } from 'lucide-react'
import { useAssetStore } from '@/stores/useAssetStore'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import { DragDropProvider } from '@/components/app/DragDropProvider'
import { AppToolbar } from '@/components/app/AppToolbar'
import { UploadZone } from '@/components/app/UploadZone'
import { SelectionActionBar } from '@/components/app/SelectionActionBar'
import { QuickSKUInput } from '@/components/app/QuickSKUInput'
import { SKUProductGroup } from '@/components/app/SKUProductGroup'
import { SelectableImageTile } from '@/components/app/SelectableImageTile'
import { ExportControls } from '@/components/app/ExportControls'
import { OnboardingModal } from '@/components/app/OnboardingModal'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'

export default function AppPage() {
  const images = useAssetStore((state) => state.images)
  const uploadZoneCollapsed = useAssetStore((state) => state.uploadZoneCollapsed)
  const setUploadZoneCollapsed = useAssetStore((state) => state.setUploadZoneCollapsed)
  const confirmDialog = useAssetStore((state) => state.confirmDialog)
  const closeConfirmDialog = useAssetStore((state) => state.closeConfirmDialog)

  // Auto-group images by SKU
  const groupedBySku = useMemo(() => {
    const groups: Record<string, typeof images> = {}
    images.forEach((img) => {
      if (img.sku) {
        if (!groups[img.sku]) {
          groups[img.sku] = []
        }
        groups[img.sku].push(img)
      }
    })
    return groups
  }, [images])

  const imagesWithoutSku = images.filter((img) => !img.sku)
  const hasImages = images.length > 0
  const skus = Object.keys(groupedBySku).sort()

  useEffect(() => {
    if (hasImages && !uploadZoneCollapsed) {
      setUploadZoneCollapsed(true)
    }
  }, [hasImages, uploadZoneCollapsed, setUploadZoneCollapsed])

  return (
    <ErrorBoundary>
      <OnboardingModal />
      
      {/* Global Confirmation Dialog */}
      {confirmDialog && (
        <ConfirmDialog
          open={confirmDialog.open}
          onClose={closeConfirmDialog}
          onConfirm={confirmDialog.onConfirm}
          title={confirmDialog.title}
          description={confirmDialog.description}
          confirmLabel={confirmDialog.confirmLabel}
          cancelLabel={confirmDialog.cancelLabel}
          variant={confirmDialog.variant}
        />
      )}
      
      <main className="min-h-screen pt-20 pb-6 sm:pt-24 sm:pb-8 px-4 sm:px-6 lg:px-8">
        <DragDropProvider>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-7xl mx-auto space-y-4 sm:space-y-5"
          >
          {/* Toolbar */}
          <AppToolbar />

          {/* Selection Action Bar - Sticky when images are selected */}
          <SelectionActionBar />

          {/* Upload Zone - Compact after upload */}
          <UploadZone />

          {/* Quick SKU Input - Prominent when images exist */}
          {hasImages && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <QuickSKUInput />
            </motion.div>
          )}

          {/* SKU Product Groups - Auto-grouped by SKU */}
          {skus.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-3"
            >
              {skus.map((sku, index) => (
                <motion.div
                  key={sku}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + index * 0.05 }}
                >
                  <SKUProductGroup sku={sku} images={groupedBySku[sku]} />
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* Images Without SKU - Selectable Grid */}
          {imagesWithoutSku.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-4 sm:p-6"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-yellow-500/20">
                  <Images className="w-5 h-5 text-yellow-400" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-white">
                    Images Without SKU
                  </h3>
                  <p className="text-sm text-gray-400">
                    Click to select, then assign a SKU above
                  </p>
                </div>
                <span className="px-3 py-1 rounded-full bg-yellow-500/20 border border-yellow-500/30 
                  text-yellow-400 text-sm font-medium">
                  {imagesWithoutSku.length}
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
                {imagesWithoutSku.map((image) => (
                  <SelectableImageTile key={image.id} image={image} />
                ))}
              </div>
            </motion.div>
          )}

          {/* Export Controls - Always at Bottom */}
          {hasImages && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <ExportControls />
            </motion.div>
          )}
          </motion.div>
        </DragDropProvider>
      </main>
    </ErrorBoundary>
  )
}
