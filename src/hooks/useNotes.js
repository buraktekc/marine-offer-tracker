import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'
import { normalizeEmpty } from '../lib/utils'

function cleanNote(note) {
  return {
    title: normalizeEmpty(note.title),
    content: normalizeEmpty(note.content),
    category: normalizeEmpty(note.category),
    deadline: normalizeEmpty(note.deadline),
    vessel_id: normalizeEmpty(note.vessel_id),
    priority: note.priority || 'normal',
    author_name: normalizeEmpty(note.author_name),
    is_archived: Boolean(note.is_archived),
  }
}

async function fetchNotes() {
  const { data, error } = await supabase
    .from('notes_enriched')
    .select('*')
    .order('is_archived', { ascending: true })
    .order('deadline', { ascending: true, nullsFirst: false })
    .order('created_at', { ascending: false })

  if (error) throw error
  return data || []
}

async function createNote(note) {
  const { data, error } = await supabase
    .from('notes')
    .insert([cleanNote(note)])
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

async function deleteNote(id) {
  const { error } = await supabase.from('notes').delete().eq('id', id)
  if (error) throw error
  return id
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

export function useNotes() {
  const queryClient = useQueryClient()

  const notesQuery = useQuery({
    queryKey: ['notes'],
    queryFn: fetchNotes,
  })

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: ['notes'] })

  return {
    ...notesQuery,
    createNote: useMutation({ mutationFn: createNote, onSuccess: invalidate }),
    updateNote: useMutation({ mutationFn: updateNote, onSuccess: invalidate }),
    deleteNote: useMutation({ mutationFn: deleteNote, onSuccess: invalidate }),
    toggleArchive: useMutation({ mutationFn: toggleArchive, onSuccess: invalidate }),
  }
}
