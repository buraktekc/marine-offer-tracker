import { X } from 'lucide-react'

const shortcuts = [
  { combo: 'Cmd/Ctrl + Alt + N', description: 'New note' },
  { combo: 'Cmd/Ctrl + Enter', description: 'Send comment / save note' },
  { combo: 'Esc', description: 'Close drawer or form' },
  { combo: '?', description: 'Show shortcuts help' },
]

function ShortcutsHelp({ onClose }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 px-4"
      onClick={onClose}
      role="presentation"
    >
      <div
        className="w-full max-w-md rounded-lg bg-white p-5 shadow-xl"
        onClick={(event) => event.stopPropagation()}
        role="dialog"
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-950">
            Keyboard shortcuts
          </h2>
          <button
            aria-label="Close"
            className="rounded p-1 text-slate-500 transition hover:bg-slate-100"
            onClick={onClose}
            type="button"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <ul className="space-y-2">
          {shortcuts.map((sc) => (
            <li
              className="flex items-center justify-between rounded border border-slate-200 px-3 py-2"
              key={sc.combo}
            >
              <span className="text-sm text-slate-700">{sc.description}</span>
              <kbd className="rounded bg-slate-100 px-2 py-1 font-mono text-xs text-slate-700">
                {sc.combo}
              </kbd>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default ShortcutsHelp
