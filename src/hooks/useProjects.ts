'use client'

import { useCallback, useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Tables, TablesInsert, TablesUpdate } from '@/lib/supabase/database.types'

type Project = Tables<'projects'>
type ProjectInsert = TablesInsert<'projects'>
type ProjectUpdate = TablesUpdate<'projects'>

export function useProjects(userId: string | undefined) {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchProjects = useCallback(async () => {
    if (!userId) return

    try {
      const supabase = createClient()
      const { data, error: fetchError } = await supabase
        .from('projects')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

      if (fetchError) throw fetchError
      setProjects(data)
    } catch (err) {
      setError(err as Error)
    } finally {
      setLoading(false)
    }
  }, [userId])

  useEffect(() => {
    fetchProjects()
  }, [fetchProjects])

  return { projects, loading, error, refetch: fetchProjects }
}

export function useProject(projectId: string | undefined) {
  const [project, setProject] = useState<Project | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    if (!projectId) {
      setLoading(false)
      return
    }

    const supabase = createClient()

    async function fetchProject() {
      if (!projectId) return

      try {
        const { data, error: fetchError } = await supabase
          .from('projects')
          .select('*')
          .eq('id', projectId)
          .single()

        if (fetchError) throw fetchError
        setProject(data)
      } catch (err) {
        setError(err as Error)
      } finally {
        setLoading(false)
      }
    }

    fetchProject()
  }, [projectId])

  return { project, loading, error }
}

export function useCreateProject() {
  const [creating, setCreating] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const createProject = async (projectData: Omit<ProjectInsert, 'id' | 'created_at' | 'updated_at'>) => {
    setCreating(true)
    setError(null)

    try {
      const supabase = createClient()
      const { data, error: createError } = await supabase
        .from('projects')
        .insert(projectData)
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

  return { createProject, creating, error }
}

export function useUpdateProject() {
  const [updating, setUpdating] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const updateProject = async (projectId: string, updates: ProjectUpdate) => {
    setUpdating(true)
    setError(null)

    try {
      const supabase = createClient()
      const { data, error: updateError } = await supabase
        .from('projects')
        .update(updates)
        .eq('id', projectId)
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

  return { updateProject, updating, error }
}

export function useDeleteProject() {
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const deleteProject = async (projectId: string) => {
    setDeleting(true)
    setError(null)

    try {
      const supabase = createClient()
      const { error: deleteError } = await supabase
        .from('projects')
        .delete()
        .eq('id', projectId)

      if (deleteError) throw deleteError
    } catch (err) {
      setError(err as Error)
      throw err
    } finally {
      setDeleting(false)
    }
  }

  return { deleteProject, deleting, error }
}
