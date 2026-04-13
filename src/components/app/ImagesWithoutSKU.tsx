'use client'

import { motion } from 'framer-motion'
import { Images, Upload } from 'lucide-react'
import { useDropzone } from '@/hooks/useDropzone'
import { useAssetStore } from '@/stores/useAssetStore'
import { SelectableImageTile } from './SelectableImageTile'
import { AssetImage } from '@/types'

interface ImagesWithoutSKUProps {
  images: AssetImage[]
}

export function ImagesWithoutSKU({ images }: ImagesWithoutSKUProps) {
  const addImages = useAssetStore((state) => state.addImages)
  
  // Make entire section a drop target
  const {
    isDragOver,
    handleDragEnter,
    handleDragLeave,
    handleDragOver,
    handleDrop,
  } = useDropzone({
    onFiles: addImages,
  })

  if (images.length === 0) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      className={`
        relative bg-white/5 backdrop-blur-xl border-2 border-dashed rounded-xl p-4 sm:p-6
        transition-all duration-300
        ${
          isDragOver
            ? 'border-treez-cyan bg-treez-cyan/10 shadow-lg shadow-treez-cyan/30 scale-[1.005]'
            : 'border-white/10 hover:border-treez-purple/30'
        }
      `}
    >
      {/* Drop Indicator Overlay */}
      {isDragOver && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.2 }}
          className="absolute inset-0 rounded-xl bg-treez-cyan/10 backdrop-blur-md
            flex items-center justify-center z-20 pointer-events-none"
        >
          <div className="flex flex-col items-center gap-3">
            <div className="p-4 rounded-full bg-treez-cyan/20 backdrop-blur-sm shadow-lg shadow-treez-cyan/30">
              <Upload className="w-8 h-8 text-treez-cyan" />
            </div>
            <p className="text-lg font-semibold text-white drop-shadow-lg">
              Drop images here
            </p>
          </div>
        </motion.div>
      )}

      {/* Header */}
      <div className={`flex items-center gap-3 mb-4 transition-opacity duration-200 ${
        isDragOver ? 'pointer-events-none' : ''
      }`}>
        <div className="p-2 rounded-lg bg-yellow-500/20">
          <Images className="w-5 h-5 text-yellow-400" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-white">Ready to Organize</h3>
          <p className="text-sm text-gray-400">
            Select images to assign a SKU • Drop new files here
          </p>
        </div>
        <span
          className="px-3 py-1 rounded-full bg-yellow-500/20 border border-yellow-500/30 
          text-yellow-400 text-sm font-medium"
        >
          {images.length}
        </span>
      </div>

      {/* Image Grid */}
      <div className={`grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4 transition-opacity duration-200 ${
        isDragOver ? 'pointer-events-none opacity-50' : ''
      }`}>
        {images.map((image) => (
          <SelectableImageTile key={image.id} image={image} />
        ))}
      </div>
    </motion.div>
  )
}
