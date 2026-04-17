'use client'

import { generateFilename, isFilenameComplete } from '@/lib/filename'
import { getPresetById } from '@/lib/platformPresets'
import { useAssetStore } from '@/stores/useAssetStore'
import { AlertCircle, Check } from 'lucide-react'

interface FilenamePreviewProps {
  sku: string
  descriptor: string | null
  customDescriptor: string | null
  originalFilename: string
}

export function FilenamePreview({
  sku,
  descriptor,
  customDescriptor,
  originalFilename,
}: FilenamePreviewProps) {
  const activePlatformPreset = useAssetStore((state) => state.activePlatformPreset)
  const preset = getPresetById(activePlatformPreset)

  const finalDescriptor = descriptor === 'custom' ? (customDescriptor || '') : (descriptor || '')
  const filename = generateFilename(sku, finalDescriptor, originalFilename, preset)
  const isComplete = isFilenameComplete(sku, finalDescriptor)

  if (!isComplete) {
    return (
      <div className="flex items-center gap-2 text-xs text-yellow-400">
        <AlertCircle className="w-3 h-3 shrink-0" />
        <span>
          {!sku && !finalDescriptor && 'Missing SKU and descriptor'}
          {!sku && finalDescriptor && 'Missing SKU'}
          {sku && !finalDescriptor && 'Missing descriptor'}
        </span>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-2">
      <Check className="w-3 h-3 shrink-0 text-success" />
      <code className="text-xs text-treez-cyan bg-treez-cyan/10 px-2 py-1 rounded font-mono">
        {filename}
      </code>
    </div>
  )
}
