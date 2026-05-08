import { Archive, ArchiveRestore, Edit2, Trash2 } from 'lucide-react'
import EmptyState from '../ui/EmptyState'
import { formatDate } from '../../lib/utils'

function NoteList({
  isLoading,
  notes,
  onDelete,
  onEdit,
  onToggleArchive,
  showArchived,
}) {
  if (isLoading) {
    return (
      <div className="rounded-lg border border-slate-200 bg-white p-6 text-sm text-slate-500 shadow-sm">
        Loading notes
      </div>
    )
  }

  if (!notes?.length) {
    return (
      <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <EmptyState
          title={showArchived ? 'No archived notes' : 'No active notes'}
          description={
            showArchived
              ? 'Archived notes will appear here.'
              : 'Create a note to keep lightweight operational context close by.'
          }
        />
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-[760px] divide-y divide-slate-200 text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase text-slate-500">
            <tr>
              <th className="px-4 py-3 font-semibold">Title</th>
              <th className="px-4 py-3 font-semibold">Category</th>
              <th className="px-4 py-3 font-semibold">Deadline</th>
              <th className="px-4 py-3 font-semibold">Status</th>
              <th className="px-4 py-3 font-semibold">Content</th>
              <th className="px-4 py-3 text-right font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {notes.map((note) => (
              <tr key={note.id} className="hover:bg-slate-50">
                <td className="px-4 py-3 font-medium text-slate-950">
                  {note.title}
                </td>
                <td className="px-4 py-3 text-slate-600">
                  {note.category || '-'}
                </td>
                <td className="px-4 py-3 text-slate-600">
                  {formatDate(note.deadline)}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={[
                      'rounded px-2 py-1 text-xs font-semibold',
                      note.is_archived
                        ? 'bg-slate-100 text-slate-600'
                        : 'bg-teal-brand/10 text-teal-brand',
                    ].join(' ')}
                  >
                    {note.is_archived ? 'Archived' : 'Active'}
                  </span>
                </td>
                <td className="max-w-sm px-4 py-3 text-slate-600">
                  <p className="line-clamp-2">{note.content || '-'}</p>
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-2">
                    <button
                      className="inline-flex h-9 w-9 items-center justify-center rounded border border-slate-200 text-slate-600 transition hover:border-teal-brand hover:text-teal-brand"
                      onClick={() => onEdit(note)}
                      title="Edit note"
                      type="button"
                    >
                      <Edit2 className="h-4 w-4" aria-hidden="true" />
                    </button>
                    <button
                      className="inline-flex h-9 w-9 items-center justify-center rounded border border-slate-200 text-slate-600 transition hover:border-purple-brand hover:text-purple-brand"
                      onClick={() => onToggleArchive(note)}
                      title={note.is_archived ? 'Restore note' : 'Archive note'}
                      type="button"
                    >
                      {note.is_archived ? (
                        <ArchiveRestore className="h-4 w-4" aria-hidden="true" />
                      ) : (
                        <Archive className="h-4 w-4" aria-hidden="true" />
                      )}
                    </button>
                    <button
                      className="inline-flex h-9 w-9 items-center justify-center rounded border border-slate-200 text-slate-600 transition hover:border-red-300 hover:text-red-600"
                      onClick={() => onDelete(note)}
                      title="Delete note"
                      type="button"
                    >
                      <Trash2 className="h-4 w-4" aria-hidden="true" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default NoteList
