'use client'

import { useEffect, useMemo } from 'react'
import { motion } from 'framer-motion'
import { useAssetStore } from '@/stores/useAssetStore'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import { DragDropProvider } from '@/components/app/DragDropProvider'
import { AppToolbar } from '@/components/app/AppToolbar'
import { UploadZone } from '@/components/app/UploadZone'
import { SelectionActionBar } from '@/components/app/SelectionActionBar'
import { QuickSKUInput } from '@/components/app/QuickSKUInput'
import { SKUProductGroup } from '@/components/app/SKUProductGroup'
import { ImagesWithoutSKU } from '@/components/app/ImagesWithoutSKU'
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

          {/* Images Without SKU - Inbox/Staging Area at TOP (Enterprise Pattern) */}
          <ImagesWithoutSKU images={imagesWithoutSku} />

          {/* SKU Product Groups - Organized items below inbox (Enterprise Pattern) */}
          {skus.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="space-y-3"
            >
              {skus.map((sku, index) => (
                <motion.div
                  key={sku}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.05 }}
                >
                  <SKUProductGroup sku={sku} images={groupedBySku[sku]} />
                </motion.div>
              ))}
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
