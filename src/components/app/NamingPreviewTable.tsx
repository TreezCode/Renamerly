'use client'

import { useState, useMemo } from 'react'
import {
  X,
  ArrowUp,
  ArrowDown,
  ChevronsUpDown,
  CheckCircle2,
  XCircle,
  FileDown,
  Wand2,
  Lock,
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAssetStore } from '@/stores/useAssetStore'
import { useSubscription } from '@/hooks/useSubscription'
import { generateFilename } from '@/lib/filename'
import { scoreSeoFilename, type SeoGrade } from '@/lib/seo'
import { buildCsvManifest, downloadCsv, getCsvFilename } from '@/lib/csv'
import { getPresetById } from '@/lib/platformPresets'
import { UpgradeModal } from '@/components/ui/UpgradeModal'
import { Button } from '@/components/ui/Button'
import { DEFAULT_DESCRIPTORS } from '@/lib/constants'

type SortField = 'original' | 'newName' | 'sku' | 'descriptor' | 'status' | 'seo'
type SortDir = 'asc' | 'desc'
type StatusFilter = 'all' | 'complete' | 'incomplete'

const SEO_COLORS: Record<SeoGrade, string> = {
  good: 'text-success bg-success/10 border-success/20',
  improve: 'text-warning bg-warning/10 border-warning/20',
  poor: 'text-error bg-error/10 border-error/20',
}

const SEO_DOT: Record<SeoGrade, string> = {
  good: 'bg-success',
  improve: 'bg-warning',
  poor: 'bg-error',
}

const SEO_GRADE_ORDER: Record<SeoGrade, number> = { good: 2, improve: 1, poor: 0 }

interface NamingPreviewTableProps {
  open: boolean
  onClose: () => void
}

export function NamingPreviewTable({ open, onClose }: NamingPreviewTableProps) {
  const images = useAssetStore((state) => state.images)
  const setImageSku = useAssetStore((state) => state.setImageSku)
  const setImageDescriptor = useAssetStore((state) => state.setImageDescriptor)
  const selectAllInContext = useAssetStore((state) => state.selectAllInContext)
  const clearSelection = useAssetStore((state) => state.clearSelection)

  const activePlatformPreset = useAssetStore((state) => state.activePlatformPreset)
  const { isPro } = useSubscription()

  const preset = getPresetById(activePlatformPreset)

  const [sortField, setSortField] = useState<SortField>('original')
  const [sortDir, setSortDir] = useState<SortDir>('asc')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')
  const [showUpgrade, setShowUpgrade] = useState(false)

  const positionMap = useMemo(() => {
    const counters = new Map<string, number>()
    const map = new Map<string, number>()
    images.forEach((img) => {
      if (img.sku) {
        const count = (counters.get(img.sku) ?? 0) + 1
        counters.set(img.sku, count)
        map.set(img.id, count)
      }
    })
    return map
  }, [images])

  const rows = useMemo(() => {
    return images.map((image) => {
      const descriptor =
        image.descriptor === 'custom'
          ? (image.customDescriptor ?? '')
          : (image.descriptor ?? '')
      const position = positionMap.get(image.id) ?? 1
      const newName =
        image.sku && descriptor
          ? generateFilename(image.sku, descriptor, image.originalName, preset, position)
          : ''
      const isComplete = !!(image.sku && descriptor)
      const seoResult = newName ? scoreSeoFilename(newName) : null

      return { image, descriptor, newName, isComplete, seoResult }
    })
  }, [images, preset, positionMap])

  const filtered = useMemo(() => {
    if (statusFilter === 'all') return rows
    return rows.filter((r) =>
      statusFilter === 'complete' ? r.isComplete : !r.isComplete
    )
  }, [rows, statusFilter])

  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      let cmp = 0
      switch (sortField) {
        case 'original':
          cmp = a.image.originalName.localeCompare(b.image.originalName)
          break
        case 'newName':
          cmp = a.newName.localeCompare(b.newName)
          break
        case 'sku':
          cmp = (a.image.sku ?? '').localeCompare(b.image.sku ?? '')
          break
        case 'descriptor':
          cmp = a.descriptor.localeCompare(b.descriptor)
          break
        case 'status':
          cmp = Number(a.isComplete) - Number(b.isComplete)
          break
        case 'seo':
          cmp =
            (SEO_GRADE_ORDER[a.seoResult?.grade ?? 'poor']) -
            (SEO_GRADE_ORDER[b.seoResult?.grade ?? 'poor'])
          break
      }
      return sortDir === 'asc' ? cmp : -cmp
    })
  }, [filtered, sortField, sortDir])

  const incompleteCount = rows.filter((r) => !r.isComplete).length
  const completeCount = rows.filter((r) => r.isComplete).length

  function handleSort(field: SortField) {
    if (sortField === field) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortField(field)
      setSortDir('asc')
    }
  }

  function handleFixIncomplete() {
    clearSelection()
    images.forEach((img) => {
      const descriptor =
        img.descriptor === 'custom' ? (img.customDescriptor ?? '') : (img.descriptor ?? '')
      if (!img.sku || !descriptor) {
        selectAllInContext()
      }
    })
    onClose()
  }

  function handleExportCsv() {
    if (!isPro) {
      setShowUpgrade(true)
      return
    }
    const csv = buildCsvManifest(images, preset)
    downloadCsv(csv, getCsvFilename())
  }

  function SortIcon({ field }: { field: SortField }) {
    if (sortField !== field) return <ChevronsUpDown className="w-3.5 h-3.5 text-gray-600" />
    return sortDir === 'asc' ? (
      <ArrowUp className="w-3.5 h-3.5 text-treez-purple" />
    ) : (
      <ArrowDown className="w-3.5 h-3.5 text-treez-purple" />
    )
  }

  return (
    <>
      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm"
              onClick={onClose}
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, y: 24, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 24, scale: 0.98 }}
              transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
              className="fixed inset-4 sm:inset-8 lg:inset-12 z-50 flex flex-col
                bg-cosmic-gray border border-white/10 rounded-2xl shadow-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 shrink-0">
                <div>
                  <h2 className="text-lg font-bold text-white">Naming Preview</h2>
                  <p className="text-sm text-gray-400 mt-0.5">
                    {completeCount} of {rows.length} images ready
                    {incompleteCount > 0 && (
                      <span className="text-warning ml-2">· {incompleteCount} incomplete</span>
                    )}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  {/* Fix Incomplete */}
                  {incompleteCount > 0 && (
                    <Button variant="secondary" size="sm" onClick={handleFixIncomplete} className="gap-1.5">
                      <Wand2 className="w-3.5 h-3.5" />
                      Select Incomplete ({incompleteCount})
                    </Button>
                  )}

                  {/* Export CSV */}
                  {isPro ? (
                    <Button variant="secondary" size="sm" onClick={handleExportCsv} className="gap-1.5">
                      <FileDown className="w-3.5 h-3.5" />
                      Export CSV
                    </Button>
                  ) : (
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => setShowUpgrade(true)}
                      className="gap-1.5 opacity-70"
                    >
                      <Lock className="w-3.5 h-3.5" />
                      Export CSV
                    </Button>
                  )}

                  <button
                    onClick={onClose}
                    className="p-2 rounded-lg text-gray-500 hover:text-white hover:bg-white/10 transition-all"
                    aria-label="Close preview"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Filter tabs */}
              <div className="flex items-center gap-1 px-6 py-3 border-b border-white/5 shrink-0">
                {(['all', 'complete', 'incomplete'] as const).map((f) => (
                  <button
                    key={f}
                    onClick={() => setStatusFilter(f)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium capitalize transition-all
                      ${statusFilter === f
                        ? 'bg-treez-purple/20 text-treez-purple border border-treez-purple/30'
                        : 'text-gray-500 hover:text-white hover:bg-white/5'
                      }`}
                  >
                    {f === 'all' ? `All (${rows.length})` : f === 'complete' ? `Complete (${completeCount})` : `Incomplete (${incompleteCount})`}
                  </button>
                ))}

                {!isPro && (
                  <span className="ml-auto flex items-center gap-1.5 text-xs text-gray-500">
                    <Lock className="w-3 h-3" />
                    Inline editing requires Pro
                  </span>
                )}
              </div>

              {/* Table */}
              <div className="flex-1 overflow-auto">
                <table className="w-full text-sm border-collapse">
                  <thead className="sticky top-0 bg-cosmic-gray border-b border-white/10 z-10">
                    <tr>
                      <th className="w-12 px-4 py-3 text-left"></th>
                      {(
                        [
                          { field: 'original' as SortField, label: 'Original Name' },
                          { field: 'newName' as SortField, label: 'New Name' },
                          { field: 'sku' as SortField, label: 'SKU' },
                          { field: 'descriptor' as SortField, label: 'Descriptor' },
                          { field: 'status' as SortField, label: 'Status' },
                          { field: 'seo' as SortField, label: 'SEO' },
                        ]
                      ).map(({ field, label }) => (
                        <th
                          key={field}
                          className="px-4 py-3 text-left font-medium text-gray-400 cursor-pointer
                            hover:text-white transition-colors select-none whitespace-nowrap"
                          onClick={() => handleSort(field)}
                        >
                          <div className="flex items-center gap-1.5">
                            {label}
                            <SortIcon field={field} />
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>

                  <tbody>
                    {sorted.map(({ image, descriptor, newName, isComplete, seoResult }) => (
                      <tr
                        key={image.id}
                        className="border-b border-white/5 hover:bg-white/3 transition-colors group"
                      >
                        {/* Thumbnail */}
                        <td className="px-4 py-3">
                          <img
                            src={image.thumbnail}
                            alt={image.originalName}
                            className="w-10 h-10 object-cover rounded-lg border border-white/10"
                          />
                        </td>

                        {/* Original Name */}
                        <td className="px-4 py-3 text-gray-300 max-w-[180px]">
                          <p className="truncate" title={image.originalName}>
                            {image.originalName}
                          </p>
                        </td>

                        {/* New Name */}
                        <td className="px-4 py-3 max-w-[200px]">
                          {newName ? (
                            <p className="truncate text-treez-cyan font-medium" title={newName}>
                              {newName}
                            </p>
                          ) : (
                            <span className="text-gray-600 italic text-xs">Not configured</span>
                          )}
                        </td>

                        {/* SKU */}
                        <td className="px-4 py-3">
                          {isPro ? (
                            <input
                              type="text"
                              defaultValue={image.sku ?? ''}
                              onBlur={(e) => {
                                const val = e.target.value.trim()
                                if (val !== image.sku) setImageSku(image.id, val)
                              }}
                              className="w-full min-w-[80px] px-2 py-1 text-xs bg-white/5 border border-white/10
                                rounded-lg text-white placeholder:text-gray-500
                                focus:outline-none focus:ring-1 focus:ring-treez-purple
                                focus:border-treez-purple transition-all"
                              placeholder="No SKU"
                            />
                          ) : (
                            <span className={`text-xs ${image.sku ? 'text-white' : 'text-gray-600 italic'}`}>
                              {image.sku || 'No SKU'}
                            </span>
                          )}
                        </td>

                        {/* Descriptor */}
                        <td className="px-4 py-3">
                          {isPro ? (
                            <select
                              value={image.descriptor ?? ''}
                              onChange={(e) => setImageDescriptor(image.id, e.target.value)}
                              className="w-full min-w-[100px] px-2 py-1 text-xs bg-white/5 border border-white/10
                                rounded-lg text-white focus:outline-none focus:ring-1 focus:ring-treez-purple
                                focus:border-treez-purple transition-all"
                            >
                              <option value="" className="bg-deep-space">None</option>
                              {DEFAULT_DESCRIPTORS.map((d) => (
                                <option key={d.value} value={d.value} className="bg-deep-space">
                                  {d.label}
                                </option>
                              ))}
                            </select>
                          ) : (
                            <span className={`text-xs ${descriptor ? 'text-white' : 'text-gray-600 italic'}`}>
                              {descriptor || 'None'}
                            </span>
                          )}
                        </td>

                        {/* Status */}
                        <td className="px-4 py-3">
                          {isComplete ? (
                            <span className="flex items-center gap-1.5 text-xs text-success">
                              <CheckCircle2 className="w-4 h-4" />
                              Ready
                            </span>
                          ) : (
                            <span className="flex items-center gap-1.5 text-xs text-warning">
                              <XCircle className="w-4 h-4" />
                              Incomplete
                            </span>
                          )}
                        </td>

                        {/* SEO Score */}
                        <td className="px-4 py-3">
                          {seoResult ? (
                            <span
                              className={`inline-flex items-center gap-1.5 text-xs px-2 py-1
                                rounded-full border font-medium ${SEO_COLORS[seoResult.grade]}`}
                              title={seoResult.tips.length > 0 ? seoResult.tips.join(' · ') : 'Filename looks great!'}
                            >
                              <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${SEO_DOT[seoResult.grade]}`} />
                              {seoResult.label}
                            </span>
                          ) : (
                            <span className="text-xs text-gray-600">—</span>
                          )}
                        </td>
                      </tr>
                    ))}

                    {sorted.length === 0 && (
                      <tr>
                        <td colSpan={7} className="px-4 py-16 text-center text-gray-500">
                          No images match the current filter.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {showUpgrade && (
        <UpgradeModal
          isOpen={showUpgrade}
          onClose={() => setShowUpgrade(false)}
          feature="csv"
        />
      )}
    </>
  )
}
