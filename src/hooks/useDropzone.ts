import { useState, useRef, useCallback } from 'react'
import { ACCEPTED_FILE_TYPES, ACCEPTED_EXTENSIONS } from '@/lib/constants'

interface UseDropzoneProps {
  onFiles: (files: File[]) => void
  maxFiles?: number
}

export function useDropzone({ onFiles, maxFiles }: UseDropzoneProps) {
  const [isDragOver, setIsDragOver] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const filterValidFiles = useCallback(
    (fileList: FileList | null): File[] => {
      if (!fileList) return []

      const files = Array.from(fileList)
      const acceptedTypes = Object.keys(ACCEPTED_FILE_TYPES)
      
      const validFiles = files.filter((file) => {
        // Check by MIME type first (for standard images)
        if (acceptedTypes.includes(file.type)) {
          return true
        }
        
        // Check by extension (important for RAW files which have no standard MIME type)
        const fileName = file.name.toLowerCase()
        const hasValidExtension = ACCEPTED_EXTENSIONS.some(ext => 
          fileName.endsWith(ext.toLowerCase())
        )
        
        return hasValidExtension
      })

      if (maxFiles && validFiles.length > maxFiles) {
        return validFiles.slice(0, maxFiles)
      }

      return validFiles
    },
    [maxFiles]
  )

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragOver(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragOver(false)
  }, [])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
      setIsDragOver(false)

      const files = filterValidFiles(e.dataTransfer.files)
      if (files.length > 0) {
        onFiles(files)
      }
    },
    [filterValidFiles, onFiles]
  )

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = filterValidFiles(e.target.files)
      if (files.length > 0) {
        onFiles(files)
      }
      if (inputRef.current) {
        inputRef.current.value = ''
      }
    },
    [filterValidFiles, onFiles]
  )

  const openFileDialog = useCallback(() => {
    inputRef.current?.click()
  }, [])

  return {
    isDragOver,
    handleDragEnter,
    handleDragLeave,
    handleDragOver,
    handleDrop,
    handleFileSelect,
    openFileDialog,
    inputRef,
  }
}
