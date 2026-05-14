import {
  Archive,
  ArchiveRestore,
  Edit2,
  Eye,
  MessageSquare,
  Trash2,
} from 'lucide-react'
import IconButton from '../ui/IconButton'
import { formatDate } from '../../lib/utils'

const priorityClasses = {
  low: 'bg-slate-100 text-slate-600',
  normal: 'bg-blue-100 text-blue-700',
  high: 'bg-orange-100 text-orange-700',
  urgent: 'bg-red-100 text-red-700',
}

function NoteList({
  isLoading,
  notes,
  onDelete,
  onEdit,
  onOpenDetail,
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
      <div className="rounded-lg border border-slate-200 bg-white p-6 text-sm text-slate-500 shadow-sm">
        {showArchived ? 'No archived notes.' : 'No active notes yet. Press Cmd/Ctrl+N to create one.'}
      </div>
    )
  }

  return (
    <div className="w-full overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
      <div className="w-full overflow-x-auto">
        <table className="w-full min-w-[900px] divide-y divide-slate-200 text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase text-slate-500">
            <tr>
              <th className="px-4 py-3 font-semibold">Title</th>
              <th className="px-4 py-3 font-semibold">Priority</th>
              <th className="px-4 py-3 font-semibold">Vessel</th>
              <th className="px-4 py-3 font-semibold">Category</th>
              <th className="px-4 py-3 font-semibold">Deadline</th>
              <th className="px-4 py-3 font-semibold">Comments</th>
              <th className="px-4 py-3 font-semibold">Status</th>
              <th className="px-4 py-3 text-right font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {notes.map((note) => (
              <tr
                className="cursor-pointer hover:bg-slate-50"
                key={note.id}
                onClick={() => onOpenDetail?.(note)}
              >
                <td className="px-4 py-3 font-medium text-slate-950">
                  {note.title}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={[
                      'rounded px-2 py-1 text-xs font-semibold uppercase',
                      priorityClasses[note.priority] || priorityClasses.normal,
                    ].join(' ')}
                  >
                    {note.priority || 'normal'}
                  </span>
                </td>
                <td className="px-4 py-3 text-slate-600">
                  {note.vessel_name || '-'}
                </td>
                <td className="px-4 py-3 text-slate-600">
                  {note.category || '-'}
                </td>
                <td className="px-4 py-3 text-slate-600">
                  {formatDate(note.deadline)}
                </td>
                <td className="px-4 py-3 text-slate-600">
                  {note.comment_count > 0 ? (
                    <span className="inline-flex items-center gap-1">
                      <MessageSquare className="h-3 w-3" />
                      {note.comment_count}
                    </span>
                  ) : (
                    '-'
                  )}
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
                <td
                  className="px-4 py-3"
                  onClick={(event) => event.stopPropagation()}
                >
                  <div className="flex justify-end gap-2">
                    <IconButton
                      icon={Eye}
                      label="Open note"
                      onClick={() => onOpenDetail?.(note)}
                    />
                    <IconButton
                      icon={Edit2}
                      label="Edit note"
                      onClick={() => onEdit(note)}
                    />
                    <IconButton
                      icon={note.is_archived ? ArchiveRestore : Archive}
                      label={note.is_archived ? 'Restore note' : 'Archive note'}
                      onClick={() => onToggleArchive(note)}
                    />
                    <IconButton
                      icon={Trash2}
                      label="Delete note"
                      onClick={() => onDelete(note)}
                      variant="danger"
                    />
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
