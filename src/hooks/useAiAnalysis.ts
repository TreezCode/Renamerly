'use client'

import { createClient } from '@/lib/supabase/client'
import { useAssetStore } from '@/stores/useAssetStore'

const AI_SESSION_LIMIT = 20

export type AiMode = 'descriptor' | 'altText' | 'both'

export interface AiDescriptorResult {
  descriptor: string
  confidence: number
  reasoning: string
}

export interface AiAltTextResult {
  altText: string
  characterCount: number
  seoScore: number
}

export interface AiAnalysisResult {
  descriptor?: AiDescriptorResult
  altText?: AiAltTextResult
}

async function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      const dataUrl = reader.result as string
      resolve(dataUrl.split(',')[1])
    }
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

export function useAiAnalysis() {
  const aiRequestCount = useAssetStore((state) => state.aiRequestCount)
  const incrementAiRequestCount = useAssetStore((state) => state.incrementAiRequestCount)
  const activePlatformPreset = useAssetStore((state) => state.activePlatformPreset)

  const isAtLimit = aiRequestCount >= AI_SESSION_LIMIT
  const remainingRequests = Math.max(0, AI_SESSION_LIMIT - aiRequestCount)

  async function analyze(
    file: File,
    opts: { sku?: string; descriptor?: string; mode: AiMode }
  ): Promise<AiAnalysisResult> {
    if (isAtLimit) {
      throw new Error(`Session AI limit reached (${AI_SESSION_LIMIT} requests)`)
    }

    const supabase = createClient()
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) throw new Error('Not authenticated')

    const imageBase64 = await fileToBase64(file)

    const { data, error } = await supabase.functions.invoke('analyze-image', {
      headers: {
        Authorization: `Bearer ${session.access_token}`,
      },
      body: {
        imageBase64,
        mimeType: file.type || 'image/jpeg',
        sku: opts.sku ?? '',
        descriptor: opts.descriptor ?? '',
        platform: activePlatformPreset,
        mode: opts.mode,
        sessionCount: aiRequestCount,
      },
    })

    if (error) {
      // FunctionsHttpError wraps the actual response — extract the real message
      const ctx = (error as { context?: Response }).context
      if (ctx) {
        try {
          const body = await ctx.json() as { error?: string }
          throw new Error(body.error ?? error.message)
        } catch (parseErr) {
          if (parseErr instanceof Error && parseErr.message !== error.message) throw parseErr
        }
      }
      throw new Error(error.message)
    }
    if (data?.error) throw new Error(data.error)

    incrementAiRequestCount()
    return data as AiAnalysisResult
  }

  return { analyze, isAtLimit, remainingRequests, aiRequestCount }
}
