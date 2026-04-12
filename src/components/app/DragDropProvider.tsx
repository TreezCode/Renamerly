'use client'

import { DndContext, DragEndEvent, DragOverlay, DragStartEvent, closestCenter } from '@dnd-kit/core'
import { useState } from 'react'
import { useAssetStore } from '@/stores/useAssetStore'
import { AssetImage } from '@/types'

interface DragDropProviderProps {
  children: React.ReactNode
}

export function DragDropProvider({ children }: DragDropProviderProps) {
  const [activeImage, setActiveImage] = useState<AssetImage | null>(null)
  
  const images = useAssetStore((state) => state.images)
  const setImageSku = useAssetStore((state) => state.setImageSku)
  const addToast = useAssetStore((state) => state.addToast)

  const handleDragStart = (event: DragStartEvent) => {
    const imageId = event.active.id as string
    const image = images.find((img) => img.id === imageId)
    if (image) {
      setActiveImage(image)
    }
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    
    // Clear drag state immediately
    setActiveImage(null)

    if (!over) {
      return
    }

    const imageId = active.id as string
    const targetSku = over.id as string

    // Handle different drop zones
    if (targetSku === 'remove-sku') {
      // Remove SKU from image
      setImageSku(imageId, '')
      addToast('success', 'SKU removed from image')
    } else if (targetSku.startsWith('sku-')) {
      // Assign to SKU group
      const sku = targetSku.replace('sku-', '')
      setImageSku(imageId, sku)
      addToast('success', `Image assigned to ${sku}`)
    }
  }

  const handleDragCancel = () => {
    setActiveImage(null)
  }

  return (
    <DndContext
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      {children}
      
      {/* Drag Overlay - Ghost image while dragging */}
      <DragOverlay>
        {activeImage && (
          <div className="w-24 h-24 rounded-lg overflow-hidden 
            border-2 border-treez-purple/80 
            shadow-xl shadow-treez-purple/30
            backdrop-blur-sm
            animate-pulse-subtle
            scale-105
            transition-all duration-200">
            <img
              src={activeImage.thumbnail}
              alt={activeImage.originalName}
              className="w-full h-full object-cover opacity-95"
            />
            <div className="absolute inset-0 bg-treez-purple/10" />
          </div>
        )}
      </DragOverlay>
    </DndContext>
  )
}
