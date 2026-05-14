import { Send, Trash2 } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { useNoteComments } from '../../hooks/useNoteComments'
import { useKeyboardShortcuts } from '../../hooks/useKeyboardShortcuts'
import IconButton from '../ui/IconButton'

const AUTHOR_STORAGE_KEY = 'marine-tracker.author-name'

function loadStoredAuthor() {
  try {
    return localStorage.getItem(AUTHOR_STORAGE_KEY) || ''
  } catch {
    return ''
  }
}

function storeAuthor(name) {
  try {
    if (name) localStorage.setItem(AUTHOR_STORAGE_KEY, name)
  } catch {
    /* ignore */
  }
}

function formatRelative(value) {
  if (!value) return ''
  const now = new Date()
  const then = new Date(value)
  const diff = (now - then) / 1000

  if (diff < 60) return 'just now'
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
  if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`
  return then.toLocaleDateString()
}

function NoteComments({ noteId }) {
  const { data: comments, createComment, deleteComment } = useNoteComments(noteId)
  const [author, setAuthor] = useState(() => loadStoredAuthor())
  const [content, setContent] = useState('')
  const textareaRef = useRef(null)
  const scrollerRef = useRef(null)

  useEffect(() => {
    if (!scrollerRef.current) return
    scrollerRef.current.scrollTop = scrollerRef.current.scrollHeight
  }, [comments?.length])

  async function submit() {
    const trimmedContent = content.trim()
    const trimmedAuthor = author.trim()
    if (!trimmedContent || !trimmedAuthor) return

    storeAuthor(trimmedAuthor)

    try {
      await createComment.mutateAsync({
        note_id: noteId,
        author_name: trimmedAuthor,
        content: trimmedContent,
      })
      setContent('')
      textareaRef.current?.focus()
    } catch {
      /* ignore */
    }
  }

  useKeyboardShortcuts([
    {
      combo: 'mod+enter',
      handler: submit,
      description: 'Send comment',
    },
  ])

  function handleKeyDown(event) {
    if (event.key === 'Enter' && (event.metaKey || event.ctrlKey)) {
      event.preventDefault()
      submit()
    }
  }

  return (
    <div className="flex h-full flex-col">
      <div
        className="flex-1 space-y-3 overflow-y-auto rounded border border-slate-200 bg-slate-50 p-3"
        ref={scrollerRef}
      >
        {comments?.length ? (
          comments.map((comment) => (
            <div
              key={comment.id}
              className="group rounded border border-slate-200 bg-white p-3 shadow-sm"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-slate-700">
                    {comment.author_name}
                    <span className="ml-2 font-normal text-slate-400">
                      {formatRelative(comment.created_at)}
                    </span>
                  </p>
                  <p className="mt-1 whitespace-pre-wrap text-sm text-slate-700">
                    {comment.content}
                  </p>
                </div>
                <div className="opacity-0 transition group-hover:opacity-100">
                  <IconButton
                    icon={Trash2}
                    label="Delete comment"
                    onClick={() => deleteComment.mutate(comment.id)}
                    variant="danger"
                  />
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="py-6 text-center text-sm text-slate-400">
            No comments yet — be the first to add one.
          </p>
        )}
      </div>

      <div className="mt-3 space-y-2">
        <input
          className="h-9 w-full rounded border border-slate-300 px-3 text-sm outline-none transition focus:border-teal-brand focus:ring-2 focus:ring-teal-brand/20"
          onChange={(event) => setAuthor(event.target.value)}
          placeholder="Your name (saved on this device)"
          type="text"
          value={author}
        />
        <div className="flex gap-2">
          <textarea
            className="min-h-[60px] flex-1 rounded border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-teal-brand focus:ring-2 focus:ring-teal-brand/20"
            onChange={(event) => setContent(event.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Add a comment… (Cmd/Ctrl+Enter to send)"
            ref={textareaRef}
            value={content}
          />
          <button
            className="self-end inline-flex h-10 items-center gap-2 rounded bg-teal-brand px-3 text-sm font-semibold text-sidebar transition hover:bg-teal-brand/90 disabled:cursor-not-allowed disabled:opacity-50"
            disabled={!content.trim() || !author.trim() || createComment.isPending}
            onClick={submit}
            type="button"
          >
            <Send className="h-4 w-4" aria-hidden="true" />
            Send
          </button>
        </div>
      </div>
    </div>
  )
}

export default NoteComments
