'use client'

import { useState } from 'react'
import { Download, CheckCircle2, Table2, FileDown, Lock } from 'lucide-react'
import { motion } from 'framer-motion'
import { useAssetStore } from '@/stores/useAssetStore'
import { useSubscription } from '@/hooks/useSubscription'
import { exportAsZip } from '@/lib/export'
import { generateFilename, getFileExtension } from '@/lib/filename'
import { buildCsvManifest, downloadCsv, getCsvFilename } from '@/lib/csv'
import { Button } from '@/components/ui/Button'
import { UpgradeModal } from '@/components/ui/UpgradeModal'
import { NamingPreviewTable } from '@/components/app/NamingPreviewTable'

export function ExportControls() {
  const images = useAssetStore((state) => state.images)
  const isExportReady = useAssetStore((state) => state.isExportReady)
  const addToast = useAssetStore((state) => state.addToast)

  const { isPro } = useSubscription()

  const [isExporting, setIsExporting] = useState(false)
  const [progress, setProgress] = useState(0)
  const [showSuccess, setShowSuccess] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const [showUpgrade, setShowUpgrade] = useState(false)

  const totalImages = images.length
  const readyImages = images.filter((img) => {
    if (!img.sku) return false
    const descriptor = img.descriptor === 'custom' ? (img.customDescriptor || '') : (img.descriptor || '')
    return descriptor.length > 0
  })
  const completeImages = readyImages.length
  const allReady = isExportReady()
  const canExport = completeImages > 0

  const handleExport = async () => {
    if (!canExport || isExporting) return

    const filenameMap = new Map<string, number>()
    const duplicates: string[] = []

    // Only check ready images for duplicates
    readyImages.forEach((image) => {
      const sku = image.sku || ''
      const descriptor = image.descriptor === 'custom'
        ? (image.customDescriptor || '')
        : (image.descriptor || '')
      const extension = getFileExtension(image.originalName)
      const filename = generateFilename(sku, descriptor, extension)

      const count = filenameMap.get(filename) || 0
      filenameMap.set(filename, count + 1)

      if (count === 1) {
        duplicates.push(filename)
      }
    })

    if (duplicates.length > 0) {
      addToast(
        'error',
        `Duplicate filenames detected! ${duplicates.length} filename(s) appear multiple times. Each image needs a unique SKU + descriptor combination.`,
        8000
      )
      return
    }

    setIsExporting(true)
    setProgress(0)
    setShowSuccess(false)

    try {
      await exportAsZip(
        readyImages,
        (image) => {
          const sku = image.sku || ''
          const descriptor = image.descriptor === 'custom'
            ? (image.customDescriptor || '')
            : (image.descriptor || '')
          const extension = getFileExtension(image.originalName)
          return generateFilename(sku, descriptor, extension)
        },
        (percent) => setProgress(Math.round(percent))
      )

      addToast('success', `${readyImages.length} image(s) exported successfully!`, 4000)
      setShowSuccess(true)
      setTimeout(() => setShowSuccess(false), 3000)
    } catch (error) {
      console.error('Export failed:', error)
      const errorMessage = error instanceof Error ? error.message : 'Export failed. Please try again.'
      addToast('error', errorMessage, 6000)
    } finally {
      setIsExporting(false)
      setProgress(0)
    }
  }

  function handleExportCsv() {
    if (!isPro) {
      setShowUpgrade(true)
      return
    }
    const csv = buildCsvManifest(images)
    downloadCsv(csv, getCsvFilename())
    addToast('success', 'Manifest CSV downloaded!', 4000)
  }

  if (totalImages === 0) {
    return null
  }

  return (
    <>
    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <p className="text-white font-medium mb-1">
            {allReady ? (
              <span className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-success" />
                All images ready to export!
              </span>
            ) : (
              `${completeImages} of ${totalImages} images ready`
            )}
          </p>
          {!allReady && completeImages > 0 && (
            <p className="text-sm text-gray-400">
              You can export ready images now, or finish configuring all images
            </p>
          )}
          {completeImages === 0 && (
            <p className="text-sm text-gray-400">
              Assign SKUs and descriptors to export images
            </p>
          )}
        </div>

        <div className="flex items-center gap-2 flex-wrap justify-end">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setShowPreview(true)}
            className="gap-1.5 whitespace-nowrap"
          >
            <Table2 className="w-4 h-4" />
            Preview
          </Button>

          {isPro ? (
            <Button
              variant="secondary"
              size="sm"
              onClick={handleExportCsv}
              className="gap-1.5 whitespace-nowrap"
            >
              <FileDown className="w-4 h-4" />
              Export CSV
            </Button>
          ) : (
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setShowUpgrade(true)}
              className="gap-1.5 whitespace-nowrap opacity-60"
            >
              <Lock className="w-3.5 h-3.5" />
              Export CSV
            </Button>
          )}

          <Button
            variant="primary"
            size="lg"
            onClick={handleExport}
            disabled={!canExport || isExporting}
            className="gap-2 whitespace-nowrap"
          >
            {isExporting ? (
              <>Exporting... {progress}%</>
            ) : (
              <>
                <Download className="w-5 h-5" />
                {allReady ? 'Export All' : `Export Ready (${completeImages})`}
              </>
            )}
          </Button>
        </div>
      </div>

      {isExporting && (
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          className="mt-4 h-2 bg-linear-to-r from-treez-purple to-treez-cyan rounded-full"
        />
      )}

      {showSuccess && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 p-3 bg-success/20 border border-success/30 rounded-lg text-success text-center font-medium"
        >
          Export complete! Check your downloads.
        </motion.div>
      )}
    </div>

    <NamingPreviewTable open={showPreview} onClose={() => setShowPreview(false)} />

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
