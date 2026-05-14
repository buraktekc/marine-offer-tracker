import { X } from 'lucide-react'
import { formatDate } from '../../lib/utils'
import NoteComments from './NoteComments'

const priorityClasses = {
  low: 'bg-slate-100 text-slate-600',
  normal: 'bg-blue-100 text-blue-700',
  high: 'bg-orange-100 text-orange-700',
  urgent: 'bg-red-100 text-red-700',
}

function NoteDetailDrawer({ note, onClose }) {
  if (!note) return null

  return (
    <div className="fixed inset-0 z-40 flex">
      <div
        className="flex-1 bg-slate-950/30"
        onClick={onClose}
        role="presentation"
      />
      <aside className="flex h-full w-full max-w-xl flex-col bg-white shadow-2xl">
        <header className="flex items-start justify-between gap-4 border-b border-slate-200 px-5 py-4">
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase text-teal-brand">
              Note
            </p>
            <h2 className="mt-1 truncate text-lg font-semibold text-slate-950">
              {note.title}
            </h2>
            <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
              <span
                className={[
                  'rounded px-2 py-0.5 font-semibold uppercase',
                  priorityClasses[note.priority] || priorityClasses.normal,
                ].join(' ')}
              >
                {note.priority || 'normal'}
              </span>
              {note.category ? (
                <span className="rounded bg-slate-100 px-2 py-0.5 text-slate-600">
                  {note.category}
                </span>
              ) : null}
              {note.vessel_name ? (
                <span className="rounded bg-purple-100 px-2 py-0.5 text-purple-700">
                  ⚓ {note.vessel_name}
                </span>
              ) : null}
              {note.deadline ? (
                <span className="rounded bg-amber-100 px-2 py-0.5 text-amber-700">
                  Due {formatDate(note.deadline)}
                </span>
              ) : null}
              {note.is_archived ? (
                <span className="rounded bg-slate-200 px-2 py-0.5 text-slate-600">
                  Archived
                </span>
              ) : null}
            </div>
          </div>
          <button
            aria-label="Close"
            className="rounded p-1 text-slate-500 transition hover:bg-slate-100"
            onClick={onClose}
            type="button"
          >
            <X className="h-5 w-5" />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto px-5 py-4">
          {note.content ? (
            <div className="mb-5 rounded border border-slate-200 bg-slate-50 p-4">
              <p className="whitespace-pre-wrap text-sm text-slate-700">
                {note.content}
              </p>
            </div>
          ) : null}

          <div className="flex h-[400px] flex-col">
            <h3 className="mb-2 text-sm font-semibold uppercase text-slate-500">
              Comments
            </h3>
            <NoteComments noteId={note.id} />
          </div>
        </div>
      </aside>
    </div>
  )
}

export default NoteDetailDrawer
