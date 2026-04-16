'use client'

import { useEffect, useRef } from 'react'
import { useAssetStore } from '@/stores/useAssetStore'
import { saveSession, loadSession } from '@/lib/idb-session'

const SAVE_DEBOUNCE_MS = 800

/**
 * Invisible component that wires IndexedDB auto-save and session restore.
 * Mount once inside the app page — it renders null and manages persistence
 * entirely via side effects.
 *
 * Save: debounced on every images/currentProject change (800ms)
 * Restore: on first mount, if the store is empty and IDB has a saved session
 * Skip restore: if reset() was called this navigation (sessionStorage flag)
 */
export function SessionPersistProvider() {
  const images = useAssetStore((state) => state.images)
  const currentProject = useAssetStore((state) => state.currentProject)
  const restoreSession = useAssetStore((state) => state.restoreSession)
  const addToast = useAssetStore((state) => state.addToast)

  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const hasRestoredRef = useRef(false)

  // ── Restore on first mount ────────────────────────────────────────────────
  useEffect(() => {
    if (hasRestoredRef.current) return
    hasRestoredRef.current = true

    // Skip if reset() was called during this navigation
    if (sessionStorage.getItem('renamerly-skip-restore') === '1') {
      sessionStorage.removeItem('renamerly-skip-restore')
      return
    }

    // Skip if store already has images (project was pre-loaded before navigation)
    const currentImages = useAssetStore.getState().images
    if (currentImages.length > 0) return

    loadSession().then((saved) => {
      if (!saved || saved.images.length === 0) return

      // Double-check store hasn't been populated in the meantime
      if (useAssetStore.getState().images.length > 0) return

      restoreSession(saved.images, saved.currentProject)
      addToast(
        'success',
        `Session restored — ${saved.images.length} image${saved.images.length !== 1 ? 's' : ''} recovered`,
        5000
      )
    })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // ── Auto-save on change (debounced) ──────────────────────────────────────
  useEffect(() => {
    if (saveTimer.current) clearTimeout(saveTimer.current)

    if (images.length === 0) return

    saveTimer.current = setTimeout(() => {
      saveSession(images, currentProject)
    }, SAVE_DEBOUNCE_MS)

    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current)
    }
  }, [images, currentProject])

  return null
}
