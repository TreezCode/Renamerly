'use client'

import { X, AlertCircle } from 'lucide-react'
import { motion } from 'framer-motion'
import { AssetImage } from '@/types'
import { useAssetStore } from '@/stores/useAssetStore'
import { DEFAULT_DESCRIPTORS } from '@/lib/constants'
import { sanitizeString } from '@/lib/filename'
import { FilenamePreview } from './FilenamePreview'

interface ImageGridTileProps {
  image: AssetImage
  groupId: string
  sku: string
}

export function ImageGridTile({ image, groupId, sku }: ImageGridTileProps) {
  const removeImage = useAssetStore((state) => state.removeImage)
  const setImageDescriptor = useAssetStore((state) => state.setImageDescriptor)
  const setCustomDescriptor = useAssetStore((state) => state.setCustomDescriptor)
  const getUsedDescriptors = useAssetStore((state) => state.getUsedDescriptors)

  const usedDescriptors = getUsedDescriptors(groupId)

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (confirm('Remove this image?')) {
      removeImage(image.id)
    }
  }

  const handleDescriptorChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setImageDescriptor(image.id, e.target.value)
  }

  const handleCustomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomDescriptor(image.id, e.target.value)
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.2 }}
      className="group relative flex flex-col gap-2"
    >
      <div className="relative aspect-square rounded-lg overflow-hidden 
        bg-white/5 backdrop-blur-sm border border-white/10 
        hover:border-[#915eff]/50 hover:shadow-lg hover:shadow-[#915eff]/20
        transition-all duration-300">
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
          aria-label={`Remove ${image.originalName} from group`}
          className="absolute top-2 right-2 w-6 h-6 rounded-full bg-error/20 hover:bg-error/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200
            hover:scale-110"
          title="Remove image"
        >
          <X className="w-3.5 h-3.5 text-white" />
        </button>

        {image.descriptor && (
          <div className="absolute top-1 left-1 px-2 py-1 
            bg-[#915eff]/90 backdrop-blur-sm rounded-md">
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
            focus:outline-none focus:ring-2 focus:ring-[#915eff] 
            transition-all duration-300
            hover:border-[#915eff]/30"
        >
          <option value="" className="bg-[#0a0a0a]">
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
                className="bg-[#0a0a0a] text-white disabled:text-gray-600"
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
                focus:outline-none focus:ring-2 focus:ring-[#915eff] 
                transition-all duration-300"
            />
            {image.customDescriptor && image.customDescriptor !== sanitizeString(image.customDescriptor) && (
              <div className="flex items-start gap-1 text-xs text-yellow-400">
                <AlertCircle className="w-3 h-3 flex-shrink-0 mt-0.5" />
                <span className="leading-tight">
                  Sanitized: <code className="text-[#00d4ff]">{sanitizeString(image.customDescriptor)}</code>
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
