import { useState } from 'react'

function createNoteDraft(note) {
  return {
    title: note?.title || '',
    content: note?.content || '',
    category: note?.category || '',
    deadline: note?.deadline || '',
    is_archived: Boolean(note?.is_archived),
  }
}

function NoteForm({ initialNote, isSubmitting, onCancel, onSubmit }) {
  const [note, setNote] = useState(() => createNoteDraft(initialNote))

  function updateField(field, value) {
    setNote((current) => ({ ...current, [field]: value }))
  }

  function handleSubmit(event) {
    event.preventDefault()
    onSubmit(note)
  }

  return (
    <form
      className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm"
      onSubmit={handleSubmit}
    >
      <div className="grid gap-4 lg:grid-cols-2">
        <label className="block">
          <span className="text-sm font-semibold text-slate-700">Title</span>
          <input
            className="mt-1 h-10 w-full rounded border border-slate-300 px-3 text-sm outline-none transition focus:border-teal-brand focus:ring-2 focus:ring-teal-brand/20"
            onChange={(event) => updateField('title', event.target.value)}
            required
            type="text"
            value={note.title}
          />
        </label>

        <label className="block">
          <span className="text-sm font-semibold text-slate-700">Category</span>
          <input
            className="mt-1 h-10 w-full rounded border border-slate-300 px-3 text-sm outline-none transition focus:border-teal-brand focus:ring-2 focus:ring-teal-brand/20"
            onChange={(event) => updateField('category', event.target.value)}
            placeholder="Operations, purchasing, finance"
            type="text"
            value={note.category}
          />
        </label>

        <label className="block">
          <span className="text-sm font-semibold text-slate-700">Deadline</span>
          <input
            className="mt-1 h-10 w-full rounded border border-slate-300 px-3 text-sm outline-none transition focus:border-teal-brand focus:ring-2 focus:ring-teal-brand/20"
            onChange={(event) => updateField('deadline', event.target.value)}
            type="date"
            value={note.deadline}
          />
        </label>

        <label className="flex h-full items-end gap-3 rounded border border-slate-200 px-3 py-3 text-sm font-semibold text-slate-700">
          <input
            checked={note.is_archived}
            className="h-4 w-4 rounded border-slate-300 text-teal-brand focus:ring-teal-brand"
            onChange={(event) => updateField('is_archived', event.target.checked)}
            type="checkbox"
          />
          Archived
        </label>
      </div>

      <label className="mt-4 block">
        <span className="text-sm font-semibold text-slate-700">Content</span>
        <textarea
          className="mt-1 min-h-32 w-full rounded border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-teal-brand focus:ring-2 focus:ring-teal-brand/20"
          onChange={(event) => updateField('content', event.target.value)}
          value={note.content}
        />
      </label>

      <div className="mt-5 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <button
          className="h-10 rounded border border-slate-300 px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          disabled={isSubmitting}
          onClick={onCancel}
          type="button"
        >
          Cancel
        </button>
        <button
          className="h-10 rounded bg-teal-brand px-4 text-sm font-semibold text-sidebar transition hover:bg-teal-brand/90 disabled:cursor-not-allowed disabled:opacity-60"
          disabled={isSubmitting}
          type="submit"
        >
          {isSubmitting ? 'Saving' : 'Save Note'}
        </button>
      </div>
    </form>
  )
}

export default NoteForm
