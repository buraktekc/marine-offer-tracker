import { useEffect } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'
import { normalizeEmpty } from '../lib/utils'

async function fetchComments(noteId) {
  if (!noteId) return []

  const { data, error } = await supabase
    .from('note_comments')
    .select('*')
    .eq('note_id', noteId)
    .order('created_at', { ascending: true })

  if (error) throw error
  return data || []
}

async function createComment({ note_id, author_name, content }) {
  const { data, error } = await supabase
    .from('note_comments')
    .insert([
      {
        note_id,
        author_name: normalizeEmpty(author_name),
        content: normalizeEmpty(content),
      },
    ])
    .select()
    .single()

  if (error) throw error
  return data
}

async function deleteComment(id) {
  const { error } = await supabase.from('note_comments').delete().eq('id', id)
  if (error) throw error
  return id
}

export function useNoteComments(noteId) {
  const queryClient = useQueryClient()

  const commentsQuery = useQuery({
    queryKey: ['note_comments', noteId],
    queryFn: () => fetchComments(noteId),
    enabled: Boolean(noteId),
  })

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: ['note_comments', noteId] })

  useEffect(() => {
    if (!noteId) return

    const channel = supabase
      .channel(`note_comments:${noteId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'note_comments',
          filter: `note_id=eq.${noteId}`,
        },
        () => {
          invalidate()
        },
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [noteId])

  return {
    ...commentsQuery,
    createComment: useMutation({
      mutationFn: createComment,
      onSuccess: invalidate,
    }),
    deleteComment: useMutation({
      mutationFn: deleteComment,
      onSuccess: invalidate,
    }),
  }
}
