import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { AssetStore } from '@/types'
import type { Toast } from '@/components/ui/Toast'
import type { AssetImage, ResolvedFilename } from '@/types'
import { generateFilename, isFilenameComplete, getFileExtension } from '@/lib/filename'
import { MAX_FREE_IMAGES, THUMBNAIL_MAX_SIZE } from '@/lib/constants'
import { validateImageFile, getTotalFileSize } from '@/lib/file-validation'
import { cleanupThumbnails } from '@/lib/memory-monitor'

function generateThumbnail(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const img = new Image()
      img.onload = () => {
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')
        if (!ctx) {
          resolve(e.target?.result as string)
          return
        }

        let { width, height } = img
        if (width > height) {
          if (width > THUMBNAIL_MAX_SIZE) {
            height = (height * THUMBNAIL_MAX_SIZE) / width
            width = THUMBNAIL_MAX_SIZE
          }
        } else {
          if (height > THUMBNAIL_MAX_SIZE) {
            width = (width * THUMBNAIL_MAX_SIZE) / height
            height = THUMBNAIL_MAX_SIZE
          }
        }

        canvas.width = width
        canvas.height = height
        ctx.drawImage(img, 0, 0, width, height)
        resolve(canvas.toDataURL('image/jpeg', 0.8))
      }
      img.onerror = () => reject(new Error('Failed to load image'))
      img.src = e.target?.result as string
    }
    reader.onerror = () => reject(new Error('Failed to read file'))
    reader.readAsDataURL(file)
  })
}

export const useAssetStore = create<AssetStore>()(
  persist(
    (set, get) => ({
      images: [],
      groups: [],
      hasSeenOnboarding: false,
      collapsedGroups: [],
      uploadZoneCollapsed: false,

  addImages: async (files: File[]) => {
    const { images } = get()
    const remaining = MAX_FREE_IMAGES - images.length
    const filesToAdd = files.slice(0, remaining)

    const currentTotalSize = getTotalFileSize(images.map((img) => img.file))
    const validatedFiles: File[] = []
    const errors: string[] = []
    const duplicates: string[] = []

    for (const file of filesToAdd) {
      const isDuplicate = images.some(
        (img) => img.file.name === file.name && img.file.size === file.size
      )
      
      if (isDuplicate) {
        duplicates.push(file.name)
        continue
      }

      const validation = await validateImageFile(file, currentTotalSize)
      if (validation.isValid) {
        validatedFiles.push(file)
      } else {
        errors.push(validation.error || `Failed to validate ${file.name}`)
      }
    }

    if (duplicates.length > 0) {
      const duplicateMessage = duplicates.length === 1
        ? `"${duplicates[0]}" has already been uploaded`
        : `${duplicates.length} duplicate file(s) skipped:\n\n${duplicates.slice(0, 5).join('\n')}${duplicates.length > 5 ? '\n\n...and more' : ''}`
      
      alert(`⚠️ Duplicate Files Detected\n\n${duplicateMessage}`)
    }

    if (errors.length > 0) {
      const errorMessage = errors.length === 1
        ? errors[0]
        : `${errors.length} file(s) rejected:\n\n${errors.slice(0, 5).join('\n')}${errors.length > 5 ? '\n\n...and more' : ''}`
      
      alert(`⚠️ File Validation Error\n\n${errorMessage}`)
    }

    if (validatedFiles.length === 0) {
      return
    }

    try {
      const newImages: AssetImage[] = await Promise.all(
        validatedFiles.map(async (file) => {
          const thumbnail = await generateThumbnail(file)
          return {
            id: crypto.randomUUID(),
            file,
            thumbnail,
            originalName: file.name,
            extension: getFileExtension(file.name),
            groupId: null,
            descriptor: null,
            customDescriptor: null,
          }
        })
      )

      set((state) => ({ images: [...state.images, ...newImages] }))

      if (validatedFiles.length > 0 && errors.length > 0) {
        setTimeout(() => {
          alert(`✅ ${validatedFiles.length} file(s) uploaded successfully\n\n${errors.length} file(s) were rejected due to validation errors.`)
        }, 100)
      }
    } catch (error) {
      console.error('Failed to process images:', error)
      alert('❌ Failed to process images. Please try again.')
    }
  },

  removeImage: (id: string) => {
    const { images } = get()
    const imageToRemove = images.find((img) => img.id === id)
    if (imageToRemove) {
      cleanupThumbnails([imageToRemove])
    }
    set((state) => ({ images: state.images.filter((img) => img.id !== id) }))
  },

  createGroup: (name: string) => {
    const group = {
      id: crypto.randomUUID(),
      name,
      sku: '',
    }
    set((state) => ({ groups: [...state.groups, group] }))
  },

  deleteGroup: (id: string) => {
    set((state) => ({
      groups: state.groups.filter((g) => g.id !== id),
      images: state.images.map((img) =>
        img.groupId === id
          ? { ...img, groupId: null, descriptor: null, customDescriptor: null }
          : img
      ),
    }))
  },

  assignImageToGroup: (imageId: string, groupId: string) => {
    set((state) => ({
      images: state.images.map((img) =>
        img.id === imageId
          ? { ...img, groupId }
          : img
      ),
    }))
  },

  setGroupSku: (groupId: string, sku: string) => {
    set((state) => ({
      groups: state.groups.map((g) =>
        g.id === groupId ? { ...g, sku } : g
      ),
    }))
  },

  setImageDescriptor: (imageId: string, descriptor: string) => {
    set((state) => ({
      images: state.images.map((img) =>
        img.id === imageId
          ? { ...img, descriptor, customDescriptor: descriptor === 'custom' ? img.customDescriptor : null }
          : img
      ),
    }))
  },

  setCustomDescriptor: (imageId: string, text: string) => {
    set((state) => ({
      images: state.images.map((img) =>
        img.id === imageId ? { ...img, customDescriptor: text } : img
      ),
    }))
  },

  reset: () => {
    const { images } = get()
    cleanupThumbnails(images)
    set({ images: [], groups: [] })
  },

  getResolvedFilenames: (): ResolvedFilename[] => {
    const { images, groups } = get()
    return images.map((img) => {
      const group = groups.find((g) => g.id === img.groupId)
      const sku = group?.sku ?? ''
      const descriptor = img.descriptor === 'custom'
        ? (img.customDescriptor ?? '')
        : (img.descriptor ?? '')

      const resolved = generateFilename(sku, descriptor, img.originalName)
      const isComplete = isFilenameComplete(sku, descriptor)

      return {
        imageId: img.id,
        original: img.originalName,
        resolved: resolved || img.originalName,
        isComplete,
      }
    })
  },

  getGroupImages: (groupId: string): AssetImage[] => {
    const { images } = get()
    return images.filter((img) => img.groupId === groupId)
  },

  getUsedDescriptors: (groupId: string): string[] => {
    const { images } = get()
    return images
      .filter((img) => img.groupId === groupId && img.descriptor !== null)
      .map((img) => {
        if (img.descriptor === 'custom') return img.customDescriptor ?? ''
        return img.descriptor ?? ''
      })
      .filter(Boolean)
  },

  setOnboardingComplete: () => {
    set({ hasSeenOnboarding: true })
  },

  toggleGroupCollapse: (groupId: string) => {
    set((state) => ({
      collapsedGroups: state.collapsedGroups.includes(groupId)
        ? state.collapsedGroups.filter((id) => id !== groupId)
        : [...state.collapsedGroups, groupId],
    }))
  },

  setUploadZoneCollapsed: (collapsed: boolean) => {
    set({ uploadZoneCollapsed: collapsed })
  },

  isExportReady: (): boolean => {
    const { images, groups } = get()
    if (images.length === 0) return false
    return images.every((img) => {
      const group = groups.find((g) => g.id === img.groupId)
      if (!group?.sku) return false
      const descriptor = img.descriptor === 'custom'
        ? (img.customDescriptor ?? '')
        : (img.descriptor ?? '')
      return isFilenameComplete(group.sku, descriptor)
    })
  },
    }),
    {
      name: 'assetflow-ui-state',
      partialize: (state) => ({
        hasSeenOnboarding: state.hasSeenOnboarding,
      }),
    }
  )
)
