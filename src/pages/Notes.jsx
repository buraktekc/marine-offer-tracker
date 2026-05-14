import { AlertCircle, Plus } from 'lucide-react'
import { useState } from 'react'
import NoteDetailDrawer from '../components/notes/NoteDetailDrawer'
import NoteForm from '../components/notes/NoteForm'
import NoteList from '../components/notes/NoteList'
import ShortcutsHelp from '../components/notes/ShortcutsHelp'
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts'
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
  const [openNote, setOpenNote] = useState(null)
  const [showArchived, setShowArchived] = useState(false)
  const [showShortcuts, setShowShortcuts] = useState(false)

  const filteredNotes =
    notes?.filter((note) => Boolean(note.is_archived) === showArchived) || []

  const isSubmitting =
    createNote.isPending ||
    updateNote.isPending ||
    toggleArchive.isPending ||
    deleteNote.isPending

  function openNew() {
    setEditingNote(null)
    setIsFormOpen(true)
  }

  function openEdit(note) {
    setEditingNote(note)
    setIsFormOpen(true)
  }

  function closeForm() {
    setIsFormOpen(false)
    setEditingNote(null)
  }

  async function handleSubmit(nextNote) {
    setNotice(null)
    try {
      if (editingNote) {
        await updateNote.mutateAsync({ id: editingNote.id, note: nextNote })
        setNotice({ type: 'success', text: 'Note updated.' })
      } else {
        await createNote.mutateAsync(nextNote)
        setNotice({ type: 'success', text: 'Note created.' })
      }
      closeForm()
    } catch (submitError) {
      setNotice({ type: 'error', text: formatSupabaseError(submitError) })
    }
  }

  async function handleToggleArchive(note) {
    try {
      await toggleArchive.mutateAsync({
        id: note.id,
        is_archived: !note.is_archived,
      })
    } catch (submitError) {
      setNotice({ type: 'error', text: formatSupabaseError(submitError) })
    }
  }

  async function handleDelete(note) {
    const shouldDelete = window.confirm(`Delete note "${note.title}"?`)
    if (!shouldDelete) return

    try {
      await deleteNote.mutateAsync(note.id)
      if (openNote?.id === note.id) setOpenNote(null)
    } catch (submitError) {
      setNotice({ type: 'error', text: formatSupabaseError(submitError) })
    }
  }

  useKeyboardShortcuts([
    {
      combo: 'mod+alt+n',
      handler: () => openNew(),
      description: 'New note',
    },
    {
      combo: 'esc',
      handler: () => {
        if (showShortcuts) setShowShortcuts(false)
        else if (isFormOpen) closeForm()
        else if (openNote) setOpenNote(null)
      },
      description: 'Close drawer / form',
    },
    {
      combo: '?',
      handler: () => setShowShortcuts(true),
      description: 'Show shortcuts',
    },
  ])

  return (
    <section className="w-full space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase text-teal-brand">Notes</p>
          <h1 className="mt-2 text-2xl font-semibold text-slate-950">
            Marine Notes
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Press{' '}
            <kbd className="rounded bg-slate-100 px-1 py-0.5 text-xs">?</kbd>{' '}
            for shortcuts.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            className="h-10 rounded border border-slate-300 bg-white px-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            onClick={() => setShowArchived((value) => !value)}
            type="button"
          >
            {showArchived ? 'Show active' : 'Show archived'}
          </button>
          <button
            className="inline-flex h-10 items-center gap-2 rounded bg-teal-brand px-4 text-sm font-semibold text-sidebar transition hover:bg-teal-brand/90"
            onClick={openNew}
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
          onCancel={closeForm}
          onSubmit={handleSubmit}
        />
      ) : null}

      <NoteList
        isLoading={isLoading}
        notes={filteredNotes}
        onDelete={handleDelete}
        onEdit={openEdit}
        onOpenDetail={setOpenNote}
        onToggleArchive={handleToggleArchive}
        showArchived={showArchived}
      />

      {openNote ? (
        <NoteDetailDrawer note={openNote} onClose={() => setOpenNote(null)} />
      ) : null}

      {showShortcuts ? (
        <ShortcutsHelp onClose={() => setShowShortcuts(false)} />
      ) : null}
    </section>
  )
}

export default Notes
