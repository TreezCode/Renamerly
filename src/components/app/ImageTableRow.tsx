'use client'

import { useState } from 'react'
import { createPortal } from 'react-dom'
import { GripVertical, X, AlertCircle, Camera, Check, Sparkles, Loader2 } from 'lucide-react'
import { useDraggable } from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'
import { useAssetStore } from '@/stores/useAssetStore'
import { AssetImage } from '@/types'
import { DEFAULT_DESCRIPTORS, ITERATION_PRESETS } from '@/lib/constants'
import { sanitizeString, generateFilename } from '@/lib/filename'
import { scoreSeoFilename, type SeoGrade } from '@/lib/seo'
import { getPresetById } from '@/lib/platformPresets'
import { useAiAnalysis, type AiDescriptorResult } from '@/hooks/useAiAnalysis'
import { AiConsentModal } from '@/components/app/AiConsentModal'

const SEO_BADGE: Record<SeoGrade, string> = {
  good: 'text-success bg-success/10 border-success/20',
  improve: 'text-warning bg-warning/10 border-warning/20',
  poor: 'text-error bg-error/10 border-error/20',
}

const SEO_DOT: Record<SeoGrade, string> = {
  good: 'bg-success',
  improve: 'bg-warning',
  poor: 'bg-error',
}

interface ImageTableRowProps {
  image: AssetImage
  sku: string
  usedDescriptors: string[]
  position?: number
  isPro?: boolean
}

export function ImageTableRow({ image, sku, usedDescriptors, position = 1, isPro = false }: ImageTableRowProps) {
  const setImageDescriptor = useAssetStore((state) => state.setImageDescriptor)
  const setCustomDescriptor = useAssetStore((state) => state.setCustomDescriptor)
  const setImageSku = useAssetStore((state) => state.setImageSku)
  const setImageAltText = useAssetStore((state) => state.setImageAltText)
  const showConfirmDialog = useAssetStore((state) => state.showConfirmDialog)
  const addToast = useAssetStore((state) => state.addToast)
  const selectedImageIds = useAssetStore((state) => state.selectedImageIds)
  const toggleImageSelection = useAssetStore((state) => state.toggleImageSelection)
  const activePlatformPreset = useAssetStore((state) => state.activePlatformPreset)
  const aiConsentGiven = useAssetStore((state) => state.aiConsentGiven)
  const setAiConsentGiven = useAssetStore((state) => state.setAiConsentGiven)

  const { analyze, isAtLimit } = useAiAnalysis()

  const [aiDescLoading, setAiDescLoading] = useState(false)
  const [aiAltLoading, setAiAltLoading] = useState(false)
  const [descSuggestion, setDescSuggestion] = useState<AiDescriptorResult | null>(null)
  const [showConsentModal, setShowConsentModal] = useState(false)
  const [pendingAiAction, setPendingAiAction] = useState<(() => void) | null>(null)

  const preset = getPresetById(activePlatformPreset)

  const isSelected = selectedImageIds.includes(image.id)

  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: image.id,
  })

  const style = {
    transform: CSS.Translate.toString(transform),
    opacity: isDragging ? 0.3 : 1,
  }

  const descriptor =
    image.descriptor === 'custom'
      ? (image.customDescriptor ?? '')
      : (image.descriptor ?? '')

  const newName = sku && descriptor ? generateFilename(sku, descriptor, image.originalName, preset, position) : ''

  const seoResult = newName ? scoreSeoFilename(newName) : null

  const handleDescriptorChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setImageDescriptor(image.id, e.target.value)
  }

  const handleCustomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomDescriptor(image.id, e.target.value)
  }

  const canUseAi = isPro && !image.isRaw && !isAtLimit

  function withConsent(action: () => void) {
    if (!aiConsentGiven) {
      setPendingAiAction(() => action)
      setShowConsentModal(true)
      return
    }
    action()
  }

  const handleAiDescriptor = () => {
    withConsent(async () => {
      setAiDescLoading(true)
      try {
        const result = await analyze(image.file, { sku, mode: 'descriptor' })
        if (result.descriptor) setDescSuggestion(result.descriptor)
      } catch (err) {
        addToast('error', err instanceof Error ? err.message : 'AI analysis failed')
      } finally {
        setAiDescLoading(false)
      }
    })
  }

  const handleAcceptDescriptor = () => {
    if (!descSuggestion) return
    setImageDescriptor(image.id, descSuggestion.descriptor)
    setDescSuggestion(null)
  }

  const handleAiAltText = () => {
    withConsent(async () => {
      setAiAltLoading(true)
      try {
        const result = await analyze(image.file, { sku, descriptor, mode: 'altText' })
        if (result.altText) {
          setImageAltText(image.id, result.altText.altText)
          addToast('success', 'Alt text generated')
        }
      } catch (err) {
        addToast('error', err instanceof Error ? err.message : 'AI analysis failed')
      } finally {
        setAiAltLoading(false)
      }
    })
  }

  const handleConsentAccept = () => {
    setAiConsentGiven()
    setShowConsentModal(false)
    if (pendingAiAction) {
      pendingAiAction()
      setPendingAiAction(null)
    }
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

  return (
    <>
    <tr
      ref={setNodeRef}
      style={style}
      className={`group border-b border-white/5 transition-colors
        ${isSelected ? 'bg-treez-purple/10' : 'hover:bg-white/3'}
        ${isDragging ? 'opacity-30' : ''}`}
    >
      {/* Checkbox */}
      <td className="pl-3 pr-1 py-2.5 w-8">
        <button
          onClick={() => toggleImageSelection(image.id)}
          className={`w-4 h-4 rounded border transition-all flex items-center justify-center shrink-0
            ${isSelected
              ? 'bg-treez-purple border-treez-purple'
              : 'border-white/20 hover:border-treez-purple/50 bg-transparent'
            }`}
          aria-label={`${isSelected ? 'Deselect' : 'Select'} ${image.originalName}`}
        >
          {isSelected && <Check className="w-2.5 h-2.5 text-white" />}
        </button>
      </td>

      {/* Drag Handle */}
      <td className="px-1 py-2.5 w-6">
        <div
          {...listeners}
          {...attributes}
          className="opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing"
          title="Drag to reassign SKU"
        >
          <GripVertical className="w-4 h-4 text-gray-500" />
        </div>
      </td>

      {/* Thumbnail */}
      <td className="px-2 py-2">
        <div className="relative w-10 h-10 shrink-0">
          <img
            src={image.thumbnail}
            alt={image.originalName}
            className={`w-10 h-10 object-cover rounded-lg border-2 transition-all
              ${isSelected ? 'border-treez-purple' : 'border-white/10'}`}
          />
          {image.isRaw && (
            <span className="absolute -bottom-1 -right-1 px-1 py-0.5 rounded bg-amber-500/90 flex items-center gap-0.5">
              <Camera className="w-2 h-2 text-white" />
              <span className="text-[8px] font-bold text-white leading-none">RAW</span>
            </span>
          )}
        </div>
      </td>

      {/* Original Name */}
      <td className="px-3 py-2.5 max-w-[160px] hidden sm:table-cell">
        <p className="text-xs text-gray-400 truncate" title={image.originalName}>
          {image.originalName}
        </p>
      </td>

      {/* Descriptor */}
      <td className="px-3 py-2">
        <div className="space-y-1">
          <div className="flex items-center gap-1">
          <select
            value={image.descriptor ?? ''}
            onChange={handleDescriptorChange}
            className="flex-1 min-w-[120px] px-2 py-1.5 text-xs
              bg-white/5 border border-white/10 rounded-lg text-white
              focus:outline-none focus:ring-1 focus:ring-treez-purple focus:border-treez-purple
              hover:border-white/20 transition-all"
          >
            <option value="" className="bg-deep-space">
              Select descriptor…
            </option>
            <optgroup label="── Auto-Iteration ──" className="bg-deep-space">
              {ITERATION_PRESETS.map((preset) => (
                <option
                  key={preset.value}
                  value={preset.value}
                  className="bg-deep-space text-white"
                >
                  {preset.label}
                </option>
              ))}
            </optgroup>
            <optgroup label="── Descriptors ──" className="bg-deep-space">
              {DEFAULT_DESCRIPTORS.map((d) => {
                const isUsed =
                  d.value !== 'custom' &&
                  usedDescriptors.includes(d.value) &&
                  image.descriptor !== d.value
                return (
                  <option
                    key={d.value}
                    value={d.value}
                    disabled={isUsed}
                    className="bg-deep-space text-white disabled:text-gray-600"
                  >
                    {d.label}{isUsed ? ' (used)' : ''}
                  </option>
                )
              })}
            </optgroup>
          </select>
          {canUseAi && (
            <button
              onClick={handleAiDescriptor}
              disabled={aiDescLoading}
              title={isAtLimit ? 'AI session limit reached' : 'AI: suggest descriptor'}
              className="shrink-0 p-1 rounded-lg text-gray-500
                hover:text-treez-purple hover:bg-treez-purple/10
                disabled:opacity-40 disabled:cursor-not-allowed
                transition-colors"
            >
              {aiDescLoading
                ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                : <Sparkles className="w-3.5 h-3.5" />}
            </button>
          )}
          </div>

          {/* AI Descriptor Suggestion */}
          {descSuggestion && (
            <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg
              bg-treez-purple/10 border border-treez-purple/20 text-xs">
              <Sparkles className="w-3 h-3 text-treez-purple shrink-0" />
              <span className="text-treez-purple font-medium">{descSuggestion.descriptor}</span>
              <span className="text-gray-500">{Math.round(descSuggestion.confidence * 100)}%</span>
              <button
                onClick={handleAcceptDescriptor}
                className="ml-auto text-[10px] px-1.5 py-0.5 rounded
                  bg-treez-purple/20 text-treez-purple hover:bg-treez-purple/30
                  transition-colors font-medium"
              >Apply</button>
              <button
                onClick={() => setDescSuggestion(null)}
                className="text-gray-600 hover:text-white transition-colors"
              ><X className="w-3 h-3" /></button>
            </div>
          )}

          {image.descriptor === 'custom' && (
            <div className="flex items-start gap-1">
              <div className="flex-1 min-w-0">
                <input
                  type="text"
                  value={image.customDescriptor ?? ''}
                  onChange={handleCustomChange}
                  placeholder="Enter custom…"
                  className="w-full px-2 py-1 text-xs bg-white/5 border border-white/10 rounded-lg
                    text-white placeholder:text-gray-500
                    focus:outline-none focus:ring-1 focus:ring-treez-purple
                    transition-all"
                />
                {image.customDescriptor &&
                  image.customDescriptor !== sanitizeString(image.customDescriptor) && (
                    <div className="flex items-center gap-1 text-[10px] text-yellow-400 mt-0.5">
                      <AlertCircle className="w-2.5 h-2.5 shrink-0" />
                      <span>→ <code className="text-treez-cyan">{sanitizeString(image.customDescriptor)}</code></span>
                    </div>
                  )}
              </div>
              {canUseAi && <div className="shrink-0 w-[22px]" />}
            </div>
          )}
        </div>
      </td>

      {/* New Filename + Alt Text */}
      <td className="px-3 py-2 max-w-[200px] hidden md:table-cell">
        {newName ? (
          <code className="text-xs text-treez-cyan font-mono truncate block" title={newName}>
            {newName}
          </code>
        ) : (
          <span className="text-xs text-gray-600 italic">—</span>
        )}
        {/* Alt text row */}
        {image.altText ? (
          <div className="mt-1 flex items-start gap-1">
            <textarea
              value={image.altText}
              onChange={(e) => setImageAltText(image.id, e.target.value)}
              rows={2}
              title="Click to edit alt text"
              className="flex-1 text-[10px] text-gray-400 leading-tight bg-transparent
                border border-transparent hover:border-white/10 rounded p-0.5
                focus:outline-none focus:border-white/20 focus:text-white
                resize-none transition-colors"
            />
            <div className="flex flex-col gap-0.5 shrink-0">
              {canUseAi && (
                <button
                  onClick={handleAiAltText}
                  disabled={aiAltLoading}
                  title="Regenerate alt text with AI"
                  className="p-0.5 rounded text-gray-600
                    hover:text-treez-purple hover:bg-treez-purple/10
                    disabled:opacity-40 transition-colors"
                >
                  {aiAltLoading
                    ? <Loader2 className="w-2.5 h-2.5 animate-spin" />
                    : <Sparkles className="w-2.5 h-2.5" />}
                </button>
              )}
              <button
                onClick={() => setImageAltText(image.id, '')}
                title="Clear alt text"
                className="p-0.5 rounded text-gray-700
                  hover:text-error hover:bg-error/10 transition-colors"
              >
                <X className="w-2.5 h-2.5" />
              </button>
            </div>
          </div>
        ) : canUseAi && newName && (
          <button
            onClick={handleAiAltText}
            disabled={aiAltLoading}
            className="mt-1 flex items-center gap-1 text-[10px] text-gray-600
              hover:text-treez-purple transition-colors
              disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {aiAltLoading
              ? <Loader2 className="w-2.5 h-2.5 animate-spin" />
              : <Sparkles className="w-2.5 h-2.5" />}
            <span>Generate alt text</span>
          </button>
        )}
      </td>

      {/* SEO Badge */}
      <td className="px-3 py-2.5 hidden lg:table-cell">
        {seoResult ? (
          <span
            className={`inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5
              rounded-full border font-medium whitespace-nowrap ${SEO_BADGE[seoResult.grade]}`}
            title={seoResult.tips.length > 0 ? seoResult.tips.join(' · ') : 'Filename looks great for SEO!'}
          >
            <span className={`w-1 h-1 rounded-full shrink-0 ${SEO_DOT[seoResult.grade]}`} />
            {seoResult.label}
          </span>
        ) : (
          <span className="text-xs text-gray-700">—</span>
        )}
      </td>

      {/* Remove */}
      <td className="px-2 py-2.5 w-8">
        <button
          onClick={handleRemove}
          aria-label={`Remove ${image.originalName}`}
          className="opacity-0 group-hover:opacity-100 p-1 rounded-lg
            text-gray-600 hover:text-error hover:bg-error/10 transition-all"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </td>
    </tr>
    {showConsentModal && typeof document !== 'undefined' && createPortal(
      <AiConsentModal
        isOpen={showConsentModal}
        onAccept={handleConsentAccept}
        onDecline={() => { setShowConsentModal(false); setPendingAiAction(null) }}
      />,
      document.body
    )}
    </>
  )
}
