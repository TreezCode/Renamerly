import type { AssetImage } from '@/types'
import { generateFilename } from '@/lib/filename'

type CsvValue = string | number | null

function escapeCsvValue(value: CsvValue): string {
  if (value === null || value === undefined) return ''
  const str = String(value)
  if (str.includes(',') || str.includes('"') || str.includes('\n') || str.includes('\r')) {
    return `"${str.replace(/"/g, '""')}"`
  }
  return str
}

export const CSV_HEADERS = [
  'original_filename',
  'new_filename',
  'sku',
  'descriptor',
  'status',
  'file_type',
  'file_size_kb',
] as const

export type CsvHeader = (typeof CSV_HEADERS)[number]

/**
 * Builds a CSV manifest string from the current session's images.
 * Includes all images (complete and incomplete).
 */
export function buildCsvManifest(images: AssetImage[]): string {
  const rows = images.map((image) => {
    const descriptor =
      image.descriptor === 'custom'
        ? (image.customDescriptor ?? '')
        : (image.descriptor ?? '')

    const newFilename =
      image.sku && descriptor
        ? generateFilename(image.sku, descriptor, image.originalName)
        : ''

    const isComplete = !!(image.sku && descriptor)

    const ext = image.originalName.includes('.')
      ? image.originalName.slice(image.originalName.lastIndexOf('.') + 1).toUpperCase()
      : ''

    const fileSizeKb = Math.round(image.file.size / 1024)

    const row: Record<CsvHeader, CsvValue> = {
      original_filename: image.originalName,
      new_filename: newFilename,
      sku: image.sku ?? '',
      descriptor,
      status: isComplete ? 'complete' : 'incomplete',
      file_type: ext,
      file_size_kb: fileSizeKb,
    }

    return CSV_HEADERS.map((h) => escapeCsvValue(row[h])).join(',')
  })

  const header = CSV_HEADERS.join(',')
  return [header, ...rows].join('\n')
}

/**
 * Triggers a browser download of the given CSV string.
 */
export function downloadCsv(content: string, filename: string): void {
  const BOM = '\uFEFF' // UTF-8 BOM — ensures Excel opens the file correctly
  const blob = new Blob([BOM + content], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

/**
 * Generates a timestamped manifest filename.
 */
export function getCsvFilename(): string {
  const now = new Date()
  const ts = now.toISOString().slice(0, 19).replace('T', '-').replace(/:/g, '')
  return `renamerly-manifest-${ts}.csv`
}
