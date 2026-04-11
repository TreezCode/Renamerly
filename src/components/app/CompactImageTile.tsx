'use client'

import { useState } from 'react'
import { X } from 'lucide-react'
import { motion } from 'framer-motion'
import { AssetImage } from '@/types'
import { useAssetStore } from '@/stores/useAssetStore'
import { useDragScroll } from '@/hooks/useDragScroll'

interface CompactImageTileProps {
  image: AssetImage
  onClick?: () => void
}

export function CompactImageTile({ image, onClick }: CompactImageTileProps) {
  const removeImage = useAssetStore((state) => state.removeImage)
  const [isDragging, setIsDragging] = useState(false)

  useDragScroll(isDragging)

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (confirm('Remove this image?')) {
      removeImage(image.id)
    }
  }

  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('imageId', image.id)
    e.dataTransfer.setData('imageName', image.originalName)
    setIsDragging(true)
  }

  const handleDragEnd = () => {
    setIsDragging(false)
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.2 }}
      className="group"
    >
      <div
        onClick={onClick}
        draggable
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        className="relative aspect-square rounded-lg overflow-hidden 
          bg-white/5 backdrop-blur-sm border border-white/10 
          hover:border-[#915eff]/50 hover:shadow-lg hover:shadow-[#915eff]/20
          hover:scale-105 transition-all duration-300 cursor-move"
      >
      <img
        src={image.thumbnail}
        alt={image.originalName}
        className="w-full h-full object-cover"
      />
      
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent 
        opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="absolute bottom-0 left-0 right-0 p-2">
          <p className="text-xs text-white truncate font-medium">
            {image.originalName}
          </p>
        </div>
      </div>

      <button
        onClick={handleRemove}
        aria-label={`Remove ${image.originalName}`}
        className="absolute top-2 right-2 w-6 h-6 rounded-full bg-error/20 hover:bg-error/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200
          hover:scale-110"
        title="Remove image"
      >
        <X className="w-3.5 h-3.5 text-white" />
      </button>
      </div>
    </motion.div>
  )
}
