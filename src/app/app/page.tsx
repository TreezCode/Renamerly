'use client'

import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { useAssetStore } from '@/stores/useAssetStore'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import { AppToolbar } from '@/components/app/AppToolbar'
import { UploadZone } from '@/components/app/UploadZone'
import { GroupManager } from '@/components/app/GroupManager'
import { ProductGroup } from '@/components/app/ProductGroup'
import { UngroupedGallery } from '@/components/app/UngroupedGallery'
import { ExportControls } from '@/components/app/ExportControls'
import { OnboardingModal } from '@/components/app/OnboardingModal'

export default function AppPage() {
  const images = useAssetStore((state) => state.images)
  const groups = useAssetStore((state) => state.groups)
  const uploadZoneCollapsed = useAssetStore((state) => state.uploadZoneCollapsed)
  const setUploadZoneCollapsed = useAssetStore((state) => state.setUploadZoneCollapsed)

  const ungroupedImages = images.filter((img) => img.groupId === null)
  const hasImages = images.length > 0

  useEffect(() => {
    if (hasImages && !uploadZoneCollapsed) {
      setUploadZoneCollapsed(true)
    }
  }, [hasImages, uploadZoneCollapsed, setUploadZoneCollapsed])

  return (
    <ErrorBoundary>
      <OnboardingModal />
      
      <main className="min-h-screen py-6 sm:py-8 px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-7xl mx-auto space-y-6 sm:space-y-8"
        >
          {/* Toolbar */}
          <AppToolbar />

          {/* Upload Zone - Compact after upload */}
          <UploadZone />

          {/* Create Group Section - Prominent when images exist */}
          {hasImages && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-4 sm:p-6"
            >
              <div className="mb-4">
                <h2 className="text-lg sm:text-xl font-semibold text-white mb-1">
                  {groups.length === 0 ? 'Create Your First Product Group' : 'Product Groups'}
                </h2>
                {groups.length === 0 && (
                  <p className="text-sm text-gray-400">
                    Group your images by product to organize and rename them
                  </p>
                )}
              </div>
              <GroupManager />
            </motion.div>
          )}

          {/* Product Groups - Priority Display */}
          {groups.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-4 sm:space-y-6"
            >
              {groups.map((group, index) => (
                <motion.div
                  key={group.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + index * 0.1 }}
                >
                  <ProductGroup group={group} />
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* Ungrouped Images - Secondary Display */}
          {ungroupedImages.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <UngroupedGallery
                ungroupedImages={ungroupedImages}
                groups={groups}
              />
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
      </main>
    </ErrorBoundary>
  )
}
