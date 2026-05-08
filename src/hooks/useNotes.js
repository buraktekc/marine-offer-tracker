import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'
import { normalizeEmpty } from '../lib/utils'

function cleanNote(note) {
  return {
    title: normalizeEmpty(note.title),
    content: normalizeEmpty(note.content),
    category: normalizeEmpty(note.category),
    deadline: normalizeEmpty(note.deadline),
    is_archived: Boolean(note.is_archived),
  }
}

async function getCurrentUserId() {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error) throw error

  return user?.id || null
}

async function fetchNotes() {
  const { data, error } = await supabase
    .from('notes')
    .select('*')
    .order('is_archived', { ascending: true })
    .order('deadline', { ascending: true, nullsFirst: false })
    .order('created_at', { ascending: false })

  if (error) throw error

  return data || []
}

async function createNote(note) {
  const created_by = await getCurrentUserId()
  const { data, error } = await supabase
    .from('notes')
    .insert([{ ...cleanNote(note), created_by }])
    .select()
    .single()

  if (error) throw error

  return data
}

async function updateNote({ id, note }) {
  const { data, error } = await supabase
    .from('notes')
    .update({ ...cleanNote(note), updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single()

  if (error) throw error

  return data
}

async function toggleArchive({ id, is_archived }) {
  const { data, error } = await supabase
    .from('notes')
    .update({ is_archived, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single()

  if (error) throw error

  return data
}

async function deleteNote(id) {
  const { error } = await supabase.from('notes').delete().eq('id', id)

  if (error) throw error
}

export function useNotes() {
  const queryClient = useQueryClient()

  const notesQuery = useQuery({
    queryKey: ['notes'],
    queryFn: fetchNotes,
  })

  const invalidateNotes = () =>
    queryClient.invalidateQueries({ queryKey: ['notes'] })

  return {
    ...notesQuery,
    createNote: useMutation({
      mutationFn: createNote,
      onSuccess: invalidateNotes,
    }),
    deleteNote: useMutation({
      mutationFn: deleteNote,
      onSuccess: invalidateNotes,
    }),
    toggleArchive: useMutation({
      mutationFn: toggleArchive,
      onSuccess: invalidateNotes,
    }),
    updateNote: useMutation({
      mutationFn: updateNote,
      onSuccess: invalidateNotes,
    }),
  }
}
