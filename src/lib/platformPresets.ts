export type PlatformPresetId = 'generic' | 'amazon' | 'dated' | 'shopify' | 'etsy' | 'woocommerce'

export interface PlatformPresetFormat {
  sku: string
  descriptor: string
  extension: string
  position: number
  date: string
}

export interface PlatformPreset {
  id: PlatformPresetId
  label: string
  description: string
  example: string
  proOnly: boolean
  format: (params: PlatformPresetFormat) => string
}

export const PLATFORM_PRESETS: PlatformPreset[] = [
  {
    id: 'generic',
    label: 'Generic',
    description: 'SKU-descriptor (standard)',
    example: 'nike-001-front.jpg',
    proOnly: false,
    format: ({ sku, descriptor, extension }) =>
      descriptor ? `${sku}-${descriptor}${extension}` : '',
  },
  {
    id: 'amazon',
    label: 'Amazon',
    description: 'ASIN_VIEW_POSITION uppercase format',
    example: 'B01N5IB20Q_MAIN_1.jpg',
    proOnly: false,
    format: ({ sku, descriptor, extension, position }) => {
      if (!descriptor) return ''
      const s = sku.replace(/-/g, '_').toUpperCase()
      const d = descriptor.replace(/-/g, '_').toUpperCase()
      return `${s}_${d}_${position}${extension}`
    },
  },
  {
    id: 'dated',
    label: 'Dated',
    description: 'YYYYMMDD date prefix',
    example: '20240116-nike-001-front.jpg',
    proOnly: false,
    format: ({ sku, descriptor, extension, date }) =>
      descriptor ? `${date}-${sku}-${descriptor}${extension}` : '',
  },
  {
    id: 'shopify',
    label: 'Shopify',
    description: 'handle-variant-position format',
    example: 'nike-001-front-1.jpg',
    proOnly: true,
    format: ({ sku, descriptor, extension, position }) =>
      descriptor ? `${sku}-${descriptor}-${position}${extension}` : '',
  },
  {
    id: 'etsy',
    label: 'Etsy',
    description: 'shop-product-descriptor-number format',
    example: 'mytshop-vintage-tee-front-1.jpg',
    proOnly: true,
    format: ({ sku, descriptor, extension, position }) =>
      descriptor ? `${sku}-${descriptor}-${position}${extension}` : '',
  },
  {
    id: 'woocommerce',
    label: 'WooCommerce',
    description: 'product_slug_attribute format',
    example: 'nike_001_front.jpg',
    proOnly: true,
    format: ({ sku, descriptor, extension }) => {
      if (!descriptor) return ''
      const s = sku.replace(/-/g, '_')
      const d = descriptor.replace(/-/g, '_')
      return `${s}_${d}${extension}`
    },
  },
]

export const FREE_PRESET_IDS: PlatformPresetId[] = ['generic', 'amazon', 'dated']
export const PRO_PRESET_IDS: PlatformPresetId[] = ['shopify', 'etsy', 'woocommerce']

export function getPresetById(id: PlatformPresetId): PlatformPreset {
  return PLATFORM_PRESETS.find((p) => p.id === id) ?? PLATFORM_PRESETS[0]
}
