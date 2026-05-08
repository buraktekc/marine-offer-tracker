import { AlertCircle, Plus } from 'lucide-react'
import { useMemo, useState } from 'react'
import NoteForm from '../components/notes/NoteForm'
import NoteList from '../components/notes/NoteList'
import { useNotes } from '../hooks/useNotes'
import { formatSupabaseError } from '../lib/utils'

function Notes() {
  const {
    createNote,
    data: notes,
    deleteNote,
    error,
    isLoading,
    toggleArchive,
    updateNote,
  } = useNotes()
  const [editingNote, setEditingNote] = useState(null)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [notice, setNotice] = useState(null)
  const [showArchived, setShowArchived] = useState(false)

  const isSubmitting =
    createNote.isPending ||
    updateNote.isPending ||
    toggleArchive.isPending ||
    deleteNote.isPending

  const visibleNotes = useMemo(
    () => (notes || []).filter((note) => note.is_archived === showArchived),
    [notes, showArchived],
  )

  function openNewNoteForm() {
    setEditingNote(null)
    setNotice(null)
    setIsFormOpen(true)
  }

  function openEditNoteForm(note) {
    setEditingNote(note)
    setNotice(null)
    setIsFormOpen(true)
  }

  function closeForm() {
    setEditingNote(null)
    setIsFormOpen(false)
  }

  async function handleSubmit(note) {
    setNotice(null)

    try {
      if (editingNote) {
        await updateNote.mutateAsync({ id: editingNote.id, note })
        setNotice({ type: 'success', text: 'Note updated.' })
      } else {
        await createNote.mutateAsync(note)
        setNotice({ type: 'success', text: 'Note created.' })
      }

      closeForm()
    } catch (submitError) {
      setNotice({ type: 'error', text: formatSupabaseError(submitError) })
    }
  }

  async function handleToggleArchive(note) {
    setNotice(null)

    try {
      await toggleArchive.mutateAsync({
        id: note.id,
        is_archived: !note.is_archived,
      })
      setNotice({
        type: 'success',
        text: note.is_archived ? 'Note restored.' : 'Note archived.',
      })
    } catch (submitError) {
      setNotice({ type: 'error', text: formatSupabaseError(submitError) })
    }
  }

  async function handleDelete(note) {
    const shouldDelete = window.confirm(`Delete note "${note.title}"?`)
    if (!shouldDelete) return

    setNotice(null)

    try {
      await deleteNote.mutateAsync(note.id)
      setNotice({ type: 'success', text: 'Note deleted.' })
    } catch (submitError) {
      setNotice({ type: 'error', text: formatSupabaseError(submitError) })
    }
  }

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase text-teal-brand">Notes</p>
          <h1 className="mt-2 text-2xl font-semibold text-slate-950">Notes</h1>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="inline-flex rounded border border-slate-200 bg-white p-1 shadow-sm">
            <button
              className={[
                'h-9 rounded px-3 text-sm font-semibold transition',
                !showArchived
                  ? 'bg-teal-brand text-sidebar'
                  : 'text-slate-600 hover:bg-slate-50',
              ].join(' ')}
              onClick={() => setShowArchived(false)}
              type="button"
            >
              Active
            </button>
            <button
              className={[
                'h-9 rounded px-3 text-sm font-semibold transition',
                showArchived
                  ? 'bg-teal-brand text-sidebar'
                  : 'text-slate-600 hover:bg-slate-50',
              ].join(' ')}
              onClick={() => setShowArchived(true)}
              type="button"
            >
              Archived
            </button>
          </div>

          <button
            className="inline-flex h-10 items-center justify-center gap-2 rounded bg-teal-brand px-4 text-sm font-semibold text-sidebar transition hover:bg-teal-brand/90"
            onClick={openNewNoteForm}
            type="button"
          >
            <Plus className="h-4 w-4" aria-hidden="true" />
            New Note
          </button>
        </div>
      </div>

      {notice ? (
        <div
          className={[
            'rounded border px-4 py-3 text-sm',
            notice.type === 'error'
              ? 'border-red-200 bg-red-50 text-red-700'
              : 'border-teal-brand/20 bg-teal-brand/10 text-slate-700',
          ].join(' ')}
        >
          {notice.text}
        </div>
      ) : null}

      {error ? (
        <div className="flex items-center gap-2 rounded border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <AlertCircle className="h-4 w-4" aria-hidden="true" />
          {formatSupabaseError(error)}
        </div>
      ) : null}

      {isFormOpen ? (
        <NoteForm
          initialNote={editingNote}
          isSubmitting={isSubmitting}
          key={editingNote?.id || 'new-note'}
          onCancel={closeForm}
          onSubmit={handleSubmit}
        />
      ) : null}

      <NoteList
        isLoading={isLoading}
        notes={visibleNotes}
        onDelete={handleDelete}
        onEdit={openEditNoteForm}
        onToggleArchive={handleToggleArchive}
        showArchived={showArchived}
      />
    </section>
  )
}

export default Notes
