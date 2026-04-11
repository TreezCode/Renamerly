export interface AssetImage {
  id: string
  file: File
  thumbnail: string
  originalName: string
  extension: string
  groupId: string | null
  descriptor: string | null
  customDescriptor: string | null
}

export interface ProductGroup {
  id: string
  name: string
  sku: string
}

export interface ResolvedFilename {
  imageId: string
  original: string
  resolved: string
  isComplete: boolean
}

export interface DescriptorOption {
  value: string
  label: string
  disabled: boolean
}

export type ButtonVariant = 'primary' | 'secondary' | 'ghost'
export type ButtonSize = 'sm' | 'md' | 'lg'

export type ToastType = 'success' | 'error' | 'warning' | 'info'

export interface Toast {
  id: string
  type: ToastType
  message: string
  duration?: number
}

export interface AssetStore {
  images: AssetImage[]
  groups: ProductGroup[]
  hasSeenOnboarding: boolean
  collapsedGroups: string[]
  uploadZoneCollapsed: boolean
  toasts: Toast[]

  addImages: (files: File[]) => Promise<void>
  removeImage: (id: string) => void
  createGroup: (name: string) => void
  deleteGroup: (id: string) => void
  assignImageToGroup: (imageId: string, groupId: string) => void
  setGroupSku: (groupId: string, sku: string) => void
  setImageDescriptor: (imageId: string, descriptor: string) => void
  setCustomDescriptor: (imageId: string, text: string) => void
  reset: () => void

  setOnboardingComplete: () => void
  toggleGroupCollapse: (groupId: string) => void
  setUploadZoneCollapsed: (collapsed: boolean) => void

  addToast: (type: ToastType, message: string, duration?: number) => void
  removeToast: (id: string) => void

  getResolvedFilenames: () => ResolvedFilename[]
  getGroupImages: (groupId: string) => AssetImage[]
  getUsedDescriptors: (groupId: string) => string[]
  isExportReady: () => boolean
}
