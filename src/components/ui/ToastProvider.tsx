'use client'

import { useAssetStore } from '@/stores/useAssetStore'
import { ToastContainer } from './Toast'

export function ToastProvider() {
  const toasts = useAssetStore((state) => state.toasts)
  const removeToast = useAssetStore((state) => state.removeToast)

  return <ToastContainer toasts={toasts} onClose={removeToast} />
}
