'use client'

import { Upload } from 'lucide-react'
import { useDropzone } from '@/hooks/useDropzone'
import { useAssetStore } from '@/stores/useAssetStore'
import { MAX_FREE_IMAGES, ACCEPTED_EXTENSIONS } from '@/lib/constants'

export function UploadZone() {
  const images = useAssetStore((state) => state.images)
  const addImages = useAssetStore((state) => state.addImages)

  const hasImages = images.length > 0
  const isAtLimit = images.length >= MAX_FREE_IMAGES
  const remainingSlots = MAX_FREE_IMAGES - images.length

  const { isDragOver, handleDragEnter, handleDragLeave, handleDragOver, handleDrop, handleFileSelect, openFileDialog, inputRef } = useDropzone({
    onFiles: (files) => {
      const filesToAdd = files.slice(0, remainingSlots)
      if (filesToAdd.length > 0) {
        addImages(filesToAdd)
      }
    },
    maxFiles: remainingSlots,
  })

  if (isAtLimit) {
    return (
      <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-6 text-center">
        <p className="text-yellow-400 font-medium mb-2">
          Free tier limit reached: {MAX_FREE_IMAGES} images
        </p>
        <p className="text-sm text-gray-400">
          Remove images to upload new ones, or upgrade to Pro for unlimited uploads
        </p>
      </div>
    )
  }

  return (
    <div
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onClick={openFileDialog}
      className={`
        relative border-2 border-dashed rounded-xl transition-all duration-300 cursor-pointer
        ${hasImages ? 'p-4' : 'p-12'}
        ${isDragOver
          ? 'border-treez-cyan bg-treez-cyan/10 shadow-lg shadow-treez-cyan/30 scale-[1.005]'
          : 'border-white/20 hover:border-treez-purple/30 bg-white/5'
        }
      `}
    >
      <input
        ref={inputRef}
        type="file"
        multiple
        accept={ACCEPTED_EXTENSIONS.join(',')}
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Drop Indicator Overlay */}
      {isDragOver && (
        <div
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
        </div>
      )}

      {hasImages ? (
        <div className={`flex items-center justify-center gap-4 transition-opacity duration-200 ${
          isDragOver ? 'pointer-events-none opacity-50' : ''
        }`}>
          <Upload className="w-5 h-5 text-treez-cyan" />
          <div className="text-left">
            <p className="text-white font-medium">
              {images.length} / {MAX_FREE_IMAGES} images
            </p>
            <p className="text-sm text-gray-400">
              Click or drag to add more
            </p>
          </div>
        </div>
      ) : (
        <div className={`flex flex-col items-center justify-center text-center transition-opacity duration-200 ${
          isDragOver ? 'pointer-events-none opacity-50' : ''
        }`}>
          <div className="w-16 h-16 mb-4 rounded-full bg-linear-to-br from-treez-purple/20 to-treez-cyan/20 flex items-center justify-center">
            <Upload className="w-8 h-8 text-treez-cyan" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">
            Drag & drop images here
          </h3>
          <p className="text-gray-400 mb-1">or click to browse</p>
          <p className="text-sm text-gray-500">
            Supports JPG, PNG, WebP, GIF, RAW (CR2, NEF, ARW, DNG, etc.)
          </p>
          <p className="text-xs text-gray-600">
            Max {MAX_FREE_IMAGES} images in free tier
          </p>
        </div>
      )}
    </div>
  )
}
