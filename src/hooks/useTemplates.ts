'use client'

import { useCallback, useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Tables, TablesInsert, TablesUpdate } from '@/lib/supabase/database.types'

type Template = Tables<'templates'>
type TemplateInsert = TablesInsert<'templates'>
type TemplateUpdate = TablesUpdate<'templates'>

export function useTemplates(userId: string | undefined) {
  const [templates, setTemplates] = useState<Template[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchTemplates = useCallback(async () => {
    if (!userId) return

    try {
      const supabase = createClient()
      const { data, error: fetchError } = await supabase
        .from('templates')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

      if (fetchError) throw fetchError
      setTemplates(data)
    } catch (err) {
      setError(err as Error)
    } finally {
      setLoading(false)
    }
  }, [userId])

  useEffect(() => {
    fetchTemplates()
  }, [fetchTemplates])

  return { templates, loading, error, refetch: fetchTemplates }
}

export function useCreateTemplate() {
  const [creating, setCreating] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const createTemplate = async (templateData: Omit<TemplateInsert, 'id' | 'created_at' | 'updated_at'>) => {
    setCreating(true)
    setError(null)

    try {
      const supabase = createClient()
      const { data, error: createError } = await supabase
        .from('templates')
        .insert(templateData)
        .select()
        .single()

      if (createError) throw createError
      return data
    } catch (err) {
      setError(err as Error)
      throw err
    } finally {
      setCreating(false)
    }
  }

  return { createTemplate, creating, error }
}

export function useUpdateTemplate() {
  const [updating, setUpdating] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const updateTemplate = async (templateId: string, updates: TemplateUpdate) => {
    setUpdating(true)
    setError(null)

    try {
      const supabase = createClient()
      const { data, error: updateError } = await supabase
        .from('templates')
        .update(updates)
        .eq('id', templateId)
        .select()
        .single()

      if (updateError) throw updateError
      return data
    } catch (err) {
      setError(err as Error)
      throw err
    } finally {
      setUpdating(false)
    }
  }

  return { updateTemplate, updating, error }
}

export function useDeleteTemplate() {
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const deleteTemplate = async (templateId: string) => {
    setDeleting(true)
    setError(null)

    try {
      const supabase = createClient()
      const { error: deleteError } = await supabase
        .from('templates')
        .delete()
        .eq('id', templateId)

      if (deleteError) throw deleteError
    } catch (err) {
      setError(err as Error)
      throw err
    } finally {
      setDeleting(false)
    }
  }

  return { deleteTemplate, deleting, error }
}
