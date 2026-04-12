'use client'

import { X, Check, GripVertical } from 'lucide-react'
import { motion } from 'framer-motion'
import { useDraggable } from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'
import { useAssetStore } from '@/stores/useAssetStore'
import { AssetImage } from '@/types'

interface SelectableImageTileProps {
  image: AssetImage
}

export function SelectableImageTile({ image }: SelectableImageTileProps) {
  const selectedImageIds = useAssetStore((state) => state.selectedImageIds)
  const toggleImageSelection = useAssetStore((state) => state.toggleImageSelection)
  const removeImage = useAssetStore((state) => state.removeImage)
  const showConfirmDialog = useAssetStore((state) => state.showConfirmDialog)
  const addToast = useAssetStore((state) => state.addToast)

  const isSelected = selectedImageIds.includes(image.id)

  // Drag and drop
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: image.id,
  })

  const style = {
    transform: CSS.Translate.toString(transform),
    opacity: isDragging ? 0.3 : 1,
    transition: 'opacity 0.2s ease-in-out',
  }

  const handleClick = (e: React.MouseEvent) => {
    // If clicking with Cmd/Ctrl or Shift, toggle selection
    if (e.metaKey || e.ctrlKey || e.shiftKey) {
      toggleImageSelection(image.id)
    } else {
      // Otherwise, toggle this image only
      toggleImageSelection(image.id)
    }
  }

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation()
    showConfirmDialog({
      title: 'Remove image?',
      description: `"${image.originalName}" will be removed permanently.`,
      variant: 'danger',
      confirmLabel: 'Remove',
      onConfirm: () => {
        removeImage(image.id)
        addToast('success', 'Image removed')
      },
    })
  }

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.2 }}
      className="group relative"
    >
      <div
        onClick={handleClick}
        className={`relative aspect-square rounded-lg overflow-hidden 
          border-2 transition-all duration-300 cursor-pointer
          ${isSelected 
            ? 'border-treez-purple shadow-lg shadow-treez-purple/30 scale-95' 
            : 'border-white/10 hover:border-treez-purple/50'
          }
          bg-white/5 backdrop-blur-sm hover:shadow-lg hover:shadow-treez-purple/20
          hover:scale-105 active:scale-95`}
        {...attributes}
      >
        {/* Image */}
        <img
          src={image.thumbnail}
          alt={image.originalName}
          className="w-full h-full object-cover"
        />

        {/* Drag Handle */}
        <div
          {...listeners}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
            w-10 h-10 rounded-full bg-treez-purple/20 backdrop-blur-sm
            flex items-center justify-center
            opacity-0 group-hover:opacity-100 transition-opacity duration-200
            cursor-grab active:cursor-grabbing z-20"
          title="Drag to assign SKU"
        >
          <GripVertical className="w-5 h-5 text-white" />
        </div>

        {/* Selection Indicator */}
        {isSelected && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute top-2 left-2 w-6 h-6 rounded-full 
              bg-treez-purple flex items-center justify-center
              shadow-lg"
          >
            <Check className="w-4 h-4 text-white" />
          </motion.div>
        )}

        {/* Overlay on Hover */}
        <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent 
          opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="absolute bottom-0 left-0 right-0 p-2">
            <p className="text-xs text-white truncate font-medium">
              {image.originalName}
            </p>
            <p className="text-xs text-gray-400">
              Click to select • {isSelected ? 'Selected' : 'Not selected'}
            </p>
          </div>
        </div>

        {/* Remove Button */}
        <button
          onClick={handleRemove}
          aria-label={`Remove ${image.originalName}`}
          className="absolute top-2 right-2 w-6 h-6 rounded-full 
            bg-error/20 hover:bg-error/40 flex items-center justify-center 
            opacity-0 group-hover:opacity-100 transition-opacity duration-200
            hover:scale-110 z-10"
          title="Remove image"
        >
          <X className="w-3.5 h-3.5 text-white" />
        </button>
      </div>
    </motion.div>
  )
}
