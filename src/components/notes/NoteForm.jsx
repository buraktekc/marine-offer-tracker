import { useState } from 'react'
import { useVessels } from '../../hooks/useVessels'

const priorities = [
  { value: 'low', label: 'Low' },
  { value: 'normal', label: 'Normal' },
  { value: 'high', label: 'High' },
  { value: 'urgent', label: 'Urgent' },
]

function createNoteDraft(note) {
  return {
    title: note?.title || '',
    content: note?.content || '',
    category: note?.category || '',
    deadline: note?.deadline || '',
    vessel_id: note?.vessel_id || '',
    priority: note?.priority || 'normal',
    author_name: note?.author_name || '',
    is_archived: Boolean(note?.is_archived),
  }
}

function NoteForm({ initialNote, isSubmitting, onCancel, onSubmit }) {
  const { data: vessels } = useVessels()
  const [note, setNote] = useState(() => createNoteDraft(initialNote))

  function updateField(field, value) {
    setNote((current) => ({ ...current, [field]: value }))
  }

  function handleSubmit(event) {
    event.preventDefault()
    onSubmit(note)
  }

  function handleKeyDown(event) {
    if (event.key === 'Enter' && (event.metaKey || event.ctrlKey)) {
      event.preventDefault()
      onSubmit(note)
    }
  }

  return (
    <form
      className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm"
      onKeyDown={handleKeyDown}
      onSubmit={handleSubmit}
    >
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-slate-950">
          {initialNote ? 'Edit Note' : 'New Note'}
        </h2>
        <p className="mt-1 text-xs text-slate-500">
          Tip: Cmd/Ctrl + Enter to save quickly.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <label className="block">
          <span className="text-sm font-semibold text-slate-700">Title</span>
          <input
            autoFocus
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
          <span className="text-sm font-semibold text-slate-700">Vessel</span>
          <select
            className="mt-1 h-10 w-full rounded border border-slate-300 bg-white px-3 text-sm outline-none transition focus:border-teal-brand focus:ring-2 focus:ring-teal-brand/20"
            onChange={(event) => updateField('vessel_id', event.target.value)}
            value={note.vessel_id}
          >
            <option value="">No vessel</option>
            {(vessels || []).map((vessel) => (
              <option key={vessel.id} value={vessel.id}>
                {vessel.name}
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="text-sm font-semibold text-slate-700">Priority</span>
          <select
            className="mt-1 h-10 w-full rounded border border-slate-300 bg-white px-3 text-sm outline-none transition focus:border-teal-brand focus:ring-2 focus:ring-teal-brand/20"
            onChange={(event) => updateField('priority', event.target.value)}
            value={note.priority}
          >
            {priorities.map((p) => (
              <option key={p.value} value={p.value}>
                {p.label}
              </option>
            ))}
          </select>
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

        <label className="block">
          <span className="text-sm font-semibold text-slate-700">Author</span>
          <input
            className="mt-1 h-10 w-full rounded border border-slate-300 px-3 text-sm outline-none transition focus:border-teal-brand focus:ring-2 focus:ring-teal-brand/20"
            onChange={(event) => updateField('author_name', event.target.value)}
            placeholder="Optional"
            type="text"
            value={note.author_name}
          />
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

      <label className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-slate-700">
        <input
          checked={note.is_archived}
          className="h-4 w-4 rounded border-slate-300 text-teal-brand focus:ring-teal-brand"
          onChange={(event) => updateField('is_archived', event.target.checked)}
          type="checkbox"
        />
        Archived
      </label>

      <div className="mt-5 flex justify-end gap-3">
        <button
          className="h-10 rounded border border-slate-300 px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          onClick={onCancel}
          type="button"
        >
          Cancel
        </button>
        <button
          className="h-10 rounded bg-teal-brand px-4 text-sm font-semibold text-sidebar transition hover:bg-teal-brand/90 disabled:cursor-not-allowed disabled:opacity-70"
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
