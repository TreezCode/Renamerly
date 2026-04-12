'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, Package, Check, AlertCircle, Download } from 'lucide-react'
import { useDroppable } from '@dnd-kit/core'
import { useAssetStore } from '@/stores/useAssetStore'
import { AssetImage } from '@/types'
import { ImageGridTile } from './ImageGridTile'
import { Button } from '@/components/ui/Button'
import { exportAsZip } from '@/lib/export'
import { generateFilename, getFileExtension } from '@/lib/filename'

interface SKUProductGroupProps {
  sku: string
  images: AssetImage[]
}

export function SKUProductGroup({ sku, images }: SKUProductGroupProps) {
  const collapsedSkus = useAssetStore((state) => state.collapsedSkus)
  const toggleSkuCollapse = useAssetStore((state) => state.toggleSkuCollapse)
  const getUsedDescriptors = useAssetStore((state) => state.getUsedDescriptors)
  const addToast = useAssetStore((state) => state.addToast)

  const [isExporting, setIsExporting] = useState(false)
  const [exportProgress, setExportProgress] = useState(0)

  const isCollapsed = collapsedSkus.includes(sku)
  const usedDescriptors = getUsedDescriptors(sku)

  // Droppable zone for dragging images to this SKU
  const { setNodeRef, isOver } = useDroppable({
    id: `sku-${sku}`,
  })

  // Check if all images have descriptors
  const allConfigured = images.every((img) => img.descriptor !== null)
  const someConfigured = images.some((img) => img.descriptor !== null)

  const handleExportGroup = async () => {
    if (!allConfigured || isExporting) return

    setIsExporting(true)
    setExportProgress(0)

    try {
      await exportAsZip(
        images,
        (image) => {
          const descriptor = image.descriptor === 'custom'
            ? (image.customDescriptor || '')
            : (image.descriptor || '')
          const extension = getFileExtension(image.originalName)
          return generateFilename(sku, descriptor, extension)
        },
        (percent) => setExportProgress(Math.round(percent))
      )

      addToast('success', `${sku} exported successfully!`, 4000)
    } catch (error) {
      console.error('Export failed:', error)
      const errorMessage = error instanceof Error ? error.message : 'Export failed. Please try again.'
      addToast('error', errorMessage, 6000)
    } finally {
      setIsExporting(false)
      setExportProgress(0)
    }
  }

  const getStatusIcon = () => {
    if (allConfigured) {
      return <Check className="w-5 h-5 text-success" />
    }
    if (someConfigured) {
      return <AlertCircle className="w-5 h-5 text-yellow-400" />
    }
    return <Package className="w-5 h-5 text-gray-400" />
  }

  const getStatusText = () => {
    if (allConfigured) {
      return 'Ready to export'
    }
    const remaining = images.filter((img) => !img.descriptor).length
    return `${remaining} image(s) need descriptors`
  }

  const getStatusColor = () => {
    if (allConfigured) return 'text-success'
    if (someConfigured) return 'text-yellow-400'
    return 'text-gray-400'
  }

  return (
    <motion.div
      ref={setNodeRef}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-white/5 backdrop-blur-xl rounded-xl overflow-hidden transition-all duration-300
        ${isOver 
          ? 'border-2 border-treez-purple/80 shadow-lg shadow-treez-purple/20 bg-treez-purple/5' 
          : 'border border-white/10'
        }`}
    >
      {/* Header */}
      <button
        onClick={() => toggleSkuCollapse(sku)}
        className="w-full px-4 sm:px-6 py-4 flex items-center justify-between 
          hover:bg-white/5 transition-all duration-300 group"
      >
        <div className="flex items-center gap-3 flex-1">
          <div className={`p-2 rounded-lg ${
            allConfigured ? 'bg-success/20' : someConfigured ? 'bg-yellow-500/20' : 'bg-treez-purple/20'
          }`}>
            {getStatusIcon()}
          </div>
          
          <div className="flex-1 text-left">
            <div className="flex items-center gap-2">
              <h3 className="text-base sm:text-lg font-semibold text-white">
                {sku}
              </h3>
              <span className="px-2 py-0.5 rounded-full bg-treez-cyan/20 border border-treez-cyan/30 
                text-treez-cyan text-xs font-medium">
                {images.length} {images.length === 1 ? 'image' : 'images'}
              </span>
            </div>
            <p className={`text-sm ${getStatusColor()}`}>
              {getStatusText()}
            </p>
          </div>
        </div>

        <motion.div
          animate={{ rotate: isCollapsed ? 0 : 180 }}
          transition={{ duration: 0.3 }}
        >
          <ChevronDown className="w-5 h-5 text-gray-400 group-hover:text-treez-purple" />
        </motion.div>
      </button>

      {/* Content */}
      <AnimatePresence>
        {!isCollapsed && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="p-4 pt-3">
              {/* Progress Info - Inline */}
              <div className="bg-white/5 rounded-lg p-2.5 mb-4">
                <div className="flex items-center justify-between gap-4 flex-wrap">
                  <div className="flex items-center gap-3">
                    <span className="text-gray-400 text-xs whitespace-nowrap">Progress:</span>
                    {usedDescriptors.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {usedDescriptors.map((desc, i) => (
                          <span
                            key={i}
                            className="px-2 py-0.5 rounded text-xs bg-treez-purple/20 text-treez-purple border border-treez-purple/30"
                          >
                            {desc}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <span className="text-white font-medium text-xs whitespace-nowrap">
                    {images.filter((img) => img.descriptor).length} / {images.length} configured
                  </span>
                </div>
              </div>

              {/* Images Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 mt-4">
                <AnimatePresence mode="popLayout">
                  {images.map((image) => (
                    <ImageGridTile key={image.id} image={image} sku={sku} />
                  ))}
                </AnimatePresence>
              </div>

              {/* Export Button */}
              {allConfigured && (
                <div className="mt-4 pt-4 border-t border-white/10">
                  <Button
                    variant="primary"
                    size="md"
                    onClick={handleExportGroup}
                    disabled={isExporting || images.filter((img) => img.descriptor).length === 0}
                    className="gap-2 w-full sm:w-auto"
                  >
                    {isExporting ? (
                      <>Exporting... {exportProgress}%</>
                    ) : (
                      <>
                        <Download className="w-4 h-4" />
                        Export {sku} ({images.filter((img) => img.descriptor).length})
                      </>
                    )}
                  </Button>
                  {isExporting && (
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${exportProgress}%` }}
                      className="mt-3 h-2 bg-linear-to-r from-treez-purple to-treez-cyan rounded-full"
                    />
                  )}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
