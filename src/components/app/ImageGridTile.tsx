'use client'

import { X, AlertCircle, Check, GripVertical } from 'lucide-react'
import { motion } from 'framer-motion'
import { useDraggable } from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'
import { AssetImage } from '@/types'
import { useAssetStore } from '@/stores/useAssetStore'
import { DEFAULT_DESCRIPTORS } from '@/lib/constants'
import { sanitizeString } from '@/lib/filename'
import { FilenamePreview } from './FilenamePreview'

interface ImageGridTileProps {
  image: AssetImage
  sku: string
}

export function ImageGridTile({ image, sku }: ImageGridTileProps) {
  const setImageSku = useAssetStore((state) => state.setImageSku)
  const setImageDescriptor = useAssetStore((state) => state.setImageDescriptor)
  const setCustomDescriptor = useAssetStore((state) => state.setCustomDescriptor)
  const getUsedDescriptors = useAssetStore((state) => state.getUsedDescriptors)
  const showConfirmDialog = useAssetStore((state) => state.showConfirmDialog)
  const addToast = useAssetStore((state) => state.addToast)
  const selectedImageIds = useAssetStore((state) => state.selectedImageIds)
  const toggleImageSelection = useAssetStore((state) => state.toggleImageSelection)

  const usedDescriptors = getUsedDescriptors(sku)
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

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation()
    showConfirmDialog({
      title: 'Remove SKU?',
      description: `Remove SKU from "${image.originalName}"? You can reassign it later.`,
      variant: 'warning',
      confirmLabel: 'Remove SKU',
      onConfirm: () => {
        setImageSku(image.id, '')
        addToast('success', 'SKU removed from image')
      },
    })
  }

  const handleDescriptorChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setImageDescriptor(image.id, e.target.value)
  }

  const handleCustomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomDescriptor(image.id, e.target.value)
  }

  const handleImageClick = (e: React.MouseEvent) => {
    // Don't toggle selection if clicking on interactive elements
    if ((e.target as HTMLElement).closest('button, select, input')) {
      return
    }
    toggleImageSelection(image.id)
  }

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      key={image.id}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.3 }}
      className="group relative flex flex-col gap-2"
    >
      <div 
        onClick={handleImageClick}
        className={`relative aspect-square rounded-lg overflow-hidden 
        bg-white/5 backdrop-blur-sm border-2 cursor-pointer
        ${isSelected 
          ? 'border-treez-purple shadow-lg shadow-treez-purple/30' 
          : 'border-white/10 hover:border-treez-purple/50 hover:shadow-lg hover:shadow-treez-purple/20'
        }
        transition-all duration-300`}
        {...attributes}
      >
        <img
          src={image.thumbnail}
          alt={image.originalName}
          className="w-full h-full object-cover"
        />
        
        <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent 
          opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="absolute bottom-0 left-0 right-0 p-2">
            <p className="text-xs text-white truncate font-medium">
              {image.originalName}
            </p>
          </div>
        </div>

        {/* Drag Handle */}
        <div
          {...listeners}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
            w-10 h-10 rounded-full bg-treez-purple/20 backdrop-blur-sm
            flex items-center justify-center
            opacity-0 group-hover:opacity-100 transition-opacity duration-200
            cursor-grab active:cursor-grabbing z-20"
          title="Drag to reassign SKU"
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
              shadow-lg shadow-treez-purple/50 z-10"
          >
            <Check className="w-4 h-4 text-white" />
          </motion.div>
        )}

        <button
          onClick={handleRemove}
          aria-label={`Remove ${image.originalName} from group`}
          className="absolute top-2 right-2 w-6 h-6 rounded-full bg-error/20 hover:bg-error/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200
            hover:scale-110 z-10"
          title="Remove image"
        >
          <X className="w-3.5 h-3.5 text-white" />
        </button>

        {image.descriptor && !isSelected && (
          <div className="absolute top-1 left-1 px-2 py-1 
            bg-treez-purple/90 backdrop-blur-sm rounded-md">
            <p className="text-xs font-medium text-white">
              {image.descriptor === 'custom' 
                ? image.customDescriptor 
                : image.descriptor}
            </p>
          </div>
        )}
      </div>

      <div className="space-y-2">
        <select
          value={image.descriptor || ''}
          onChange={handleDescriptorChange}
          className="w-full px-2 py-1.5 text-xs
            bg-white/5 backdrop-blur-sm 
            border border-white/10 
            rounded-lg text-white
            focus:outline-none focus:ring-2 focus:ring-treez-purple 
            transition-all duration-300
            hover:border-treez-purple/30"
        >
          <option value="" className="bg-deep-space">
            Select...
          </option>
          {DEFAULT_DESCRIPTORS.map((desc) => {
            const isUsed = 
              desc.value !== 'custom' &&
              usedDescriptors.includes(desc.value) &&
              image.descriptor !== desc.value
            return (
              <option
                key={desc.value}
                value={desc.value}
                disabled={isUsed}
                className="bg-deep-space text-white disabled:text-gray-600"
              >
                {desc.label} {isUsed ? '(used)' : ''}
              </option>
            )
          })}
        </select>

        {image.descriptor === 'custom' && (
          <>
            <input
              type="text"
              value={image.customDescriptor || ''}
              onChange={handleCustomChange}
              placeholder="Enter custom..."
              className="w-full px-2 py-1.5 text-xs
                bg-white/5 backdrop-blur-sm 
                border border-white/10 
                rounded-lg text-white 
                placeholder:text-gray-400
                focus:outline-none focus:ring-2 focus:ring-treez-purple 
                transition-all duration-300"
            />
            {image.customDescriptor && image.customDescriptor !== sanitizeString(image.customDescriptor) && (
              <div className="flex items-start gap-1 text-xs text-yellow-400">
                <AlertCircle className="w-3 h-3 shrink-0 mt-0.5" />
                <span className="leading-tight">
                  Sanitized: <code className="text-treez-cyan">{sanitizeString(image.customDescriptor)}</code>
                </span>
              </div>
            )}
          </>
        )}

        <FilenamePreview
          sku={sku}
          descriptor={image.descriptor}
          customDescriptor={image.customDescriptor}
          originalFilename={image.originalName}
        />
      </div>
    </motion.div>
  )
}
