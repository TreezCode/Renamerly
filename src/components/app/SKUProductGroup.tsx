'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, Package, Check, AlertCircle, Download } from 'lucide-react'
import { useDroppable } from '@dnd-kit/core'
import { useAssetStore } from '@/stores/useAssetStore'
import { AssetImage } from '@/types'
import { ImageGridTile } from './ImageGridTile'
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

  // Check if all images have descriptors - these recalculate on every render when images change
  const allConfigured = images.every((img) => img.descriptor !== null)
  const someConfigured = images.some((img) => img.descriptor !== null)
  const configuredCount = images.filter((img) => img.descriptor).length
  const progressPercent = (configuredCount / images.length) * 100

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

  return (
    <motion.div
      ref={setNodeRef}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`relative rounded-lg sm:rounded-xl overflow-hidden 
        transition-all duration-300
        border-l-2 border-y border-r 
        ${isOver 
          ? 'border-treez-cyan/40 border-r-treez-cyan/40 border-y-treez-cyan/40 shadow-lg shadow-treez-cyan/20 bg-white/5' 
          : 'border-r-white/10 border-y-white/10'
        }
        ${allConfigured 
          ? 'border-l-success/60' 
          : someConfigured 
          ? 'border-l-yellow-500/60' 
          : 'border-l-treez-purple/60'
        }`}
    >
      {/* Header */}
      <button
        onClick={() => toggleSkuCollapse(sku)}
        className="w-full px-4 sm:px-5 py-3 sm:py-3.5 flex items-center justify-between gap-3
          hover:bg-white/5 transition-all duration-200 group"
      >
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className={`p-1.5 sm:p-2 rounded-md ${
            allConfigured ? 'bg-success/20' : someConfigured ? 'bg-yellow-500/20' : 'bg-treez-purple/20'
          }`}>
            {getStatusIcon()}
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-sm sm:text-base font-semibold text-white truncate">
                {sku}
              </h3>
              <span className="px-2 py-0.5 rounded-md bg-white/10 text-gray-300 text-xs font-medium shrink-0">
                {images.length}
              </span>
            </div>
            {/* Mini Progress Bar */}
            <div className="flex items-center gap-2">
              <div className="flex-1 h-1 bg-white/10 rounded-full overflow-hidden">
                <div
                  style={{
                    width: `${progressPercent}%`,
                    transition: 'width 0.3s ease-out'
                  }}
                  className={`h-full ${
                    allConfigured 
                      ? 'bg-linear-to-r from-success to-success/80' 
                      : 'bg-linear-to-r from-treez-purple to-treez-cyan'
                  }`}
                />
              </div>
              <span className="text-xs text-gray-400 shrink-0">
                {configuredCount}/{images.length}
              </span>
            </div>
          </div>
        </div>

        <motion.div
          animate={{ rotate: isCollapsed ? 0 : 180 }}
          transition={{ duration: 0.3 }}
        >
          <ChevronDown className="w-5 h-5 text-gray-400 group-hover:text-treez-cyan transition-colors duration-300" />
        </motion.div>
      </button>

      {/* Content */}
      <AnimatePresence>
        {!isCollapsed && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="overflow-hidden"
          >
            <div className="p-4 pt-2">
              {/* Descriptor Tags - Compact */}
              {usedDescriptors.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {usedDescriptors.map((desc, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded-md text-xs bg-treez-purple/15 text-treez-purple/90 border border-treez-purple/20"
                    >
                      {desc}
                    </span>
                  ))}
                </div>
              )}

              {/* Images Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                <AnimatePresence mode="popLayout">
                  {images.map((image) => (
                    <ImageGridTile key={image.id} image={image} sku={sku} />
                  ))}
                </AnimatePresence>
              </div>

              {/* Export Button - Always visible with intelligent state handling */}
              <div className="mt-3 pt-3 border-t border-white/5">
                <button
                  onClick={handleExportGroup}
                  disabled={!allConfigured || isExporting}
                  className={`group relative w-full sm:w-auto px-6 py-3 rounded-xl
                    text-sm font-semibold
                    flex items-center justify-center gap-2
                    overflow-hidden
                    transition-all duration-300
                    ${allConfigured && !isExporting
                      ? 'bg-linear-to-r from-treez-purple to-treez-pink text-white shadow-lg hover:shadow-treez-purple/50 hover:scale-105 active:scale-95'
                      : 'bg-white/5 text-gray-400 border border-white/10 cursor-not-allowed'
                    }
                    ${isExporting ? 'opacity-80' : ''}`}
                >
                  {isExporting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span className="relative z-10">Exporting {exportProgress}%</span>
                    </>
                  ) : allConfigured ? (
                    <>
                      <span className="relative z-10 flex items-center gap-2">
                        <Download className="w-4 h-4" />
                        Export {sku}
                      </span>
                      <div className="absolute inset-0 
                        bg-linear-to-r from-treez-pink to-treez-purple 
                        opacity-0 group-hover:opacity-100 
                        transition-opacity duration-300" />
                    </>
                  ) : (
                    <>
                      <Package className="w-4 h-4" />
                      <span>Add descriptors to export</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
