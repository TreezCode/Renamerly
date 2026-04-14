'use client'

import { useCallback, useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Tables } from '@/lib/supabase/database.types'

type UsageTracking = Tables<'usage_tracking'>

export function useUsageTracking(userId: string | undefined) {
  const [usage, setUsage] = useState<UsageTracking | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchUsage = useCallback(async () => {
    if (!userId) return

    const currentMonth = new Date().toISOString().slice(0, 7) // YYYY-MM format

    try {
      const supabase = createClient()
      const { data, error: fetchError } = await supabase
        .from('usage_tracking')
        .select('*')
        .eq('user_id', userId)
        .eq('month', currentMonth)
        .maybeSingle()

      if (fetchError) throw fetchError
      setUsage(data)
    } catch (err) {
      setError(err as Error)
    } finally {
      setLoading(false)
    }
  }, [userId])

  useEffect(() => {
    fetchUsage()
  }, [fetchUsage])

  return { usage, loading, error, refetch: fetchUsage }
}

export function useIncrementUsage() {
  const [incrementing, setIncrementing] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const incrementUsage = async (userId: string, type: 'images' | 'projects') => {
    setIncrementing(true)
    setError(null)

    const currentMonth = new Date().toISOString().slice(0, 7)

    try {
      const supabase = createClient()
      
      // Try to get existing record
      const { data: existing } = await supabase
        .from('usage_tracking')
        .select('*')
        .eq('user_id', userId)
        .eq('month', currentMonth)
        .maybeSingle()

      if (existing) {
        // Update existing record
        const updates = type === 'images'
          ? { images_processed: (existing.images_processed || 0) + 1 }
          : { projects_created: (existing.projects_created || 0) + 1 }

        const { data, error: updateError } = await supabase
          .from('usage_tracking')
          .update(updates)
          .eq('id', existing.id)
          .select()
          .single()

        if (updateError) throw updateError
        return data
      } else {
        // Create new record
        const { data, error: insertError } = await supabase
          .from('usage_tracking')
          .insert({
            user_id: userId,
            month: currentMonth,
            images_processed: type === 'images' ? 1 : 0,
            projects_created: type === 'projects' ? 1 : 0,
          })
          .select()
          .single()

        if (insertError) throw insertError
        return data
      }
    } catch (err) {
      setError(err as Error)
      throw err
    } finally {
      setIncrementing(false)
    }
  }

  return { incrementUsage, incrementing, error }
}
