import { AlertTriangle, Bell, Calendar, ChevronDown, ChevronUp, X } from 'lucide-react'
import { useState } from 'react'
import { useDeadlineBanner } from '../../hooks/useDeadlineBanner'
import { formatDate } from '../../lib/utils'

const DISMISS_KEY = 'marine-tracker.banner-dismissed-at'

function isDismissedToday() {
  try {
    const value = localStorage.getItem(DISMISS_KEY)
    if (!value) return false
    const today = new Date().toISOString().slice(0, 10)
    return value === today
  } catch {
    return false
  }
}

function dismissToday() {
  try {
    const today = new Date().toISOString().slice(0, 10)
    localStorage.setItem(DISMISS_KEY, today)
  } catch {
    /* ignore */
  }
}

function DeadlineBanner({ onSelectNote }) {
  const { overdue, dueToday, dueSoon } = useDeadlineBanner()
  const [expanded, setExpanded] = useState(false)
  const [dismissedSession, setDismissedSession] = useState(() => isDismissedToday())

  const total = overdue.length + dueToday.length + dueSoon.length
  if (total === 0 || dismissedSession) return null

  const tone =
    overdue.length > 0
      ? {
          bg: 'bg-red-50',
          border: 'border-red-300',
          text: 'text-red-700',
          icon: AlertTriangle,
        }
      : dueToday.length > 0
        ? {
            bg: 'bg-amber-50',
            border: 'border-amber-300',
            text: 'text-amber-700',
            icon: Bell,
          }
        : {
            bg: 'bg-teal-brand/5',
            border: 'border-teal-brand/30',
            text: 'text-slate-700',
            icon: Calendar,
          }

  const Icon = tone.icon

  const items = [
    ...overdue.map((n) => ({ ...n, group: 'Overdue' })),
    ...dueToday.map((n) => ({ ...n, group: 'Due today' })),
    ...dueSoon.map((n) => ({ ...n, group: 'Due soon' })),
  ]

  function dismiss() {
    dismissToday()
    setDismissedSession(true)
  }

  return (
    <div
      className={[
        'border-b px-4 py-3 md:px-8',
        tone.bg,
        tone.border,
      ].join(' ')}
    >
      <div className="flex items-start gap-3">
        <Icon className={['mt-0.5 h-5 w-5 shrink-0', tone.text].join(' ')} />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className={['text-sm font-semibold', tone.text].join(' ')}>
              {overdue.length > 0
                ? `${overdue.length} overdue, ${dueToday.length + dueSoon.length} upcoming`
                : dueToday.length > 0
                  ? `${dueToday.length} due today, ${dueSoon.length} upcoming`
                  : `${dueSoon.length} notes due in 3 days`}
            </p>
            <div className="flex gap-1">
              <button
                className="rounded px-2 py-1 text-xs font-medium text-slate-600 transition hover:bg-white"
                onClick={() => setExpanded((value) => !value)}
                type="button"
              >
                {expanded ? (
                  <>
                    <ChevronUp className="inline h-3 w-3" /> Hide
                  </>
                ) : (
                  <>
                    <ChevronDown className="inline h-3 w-3" /> Show
                  </>
                )}
              </button>
              <button
                aria-label="Dismiss until tomorrow"
                className="rounded p-1 text-slate-500 transition hover:bg-white"
                onClick={dismiss}
                title="Dismiss until tomorrow"
                type="button"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {expanded ? (
            <ul className="mt-3 space-y-1.5">
              {items.map((item) => (
                <li
                  className="flex items-center justify-between gap-3 rounded bg-white px-3 py-2 text-sm shadow-sm"
                  key={item.id}
                >
                  <button
                    className="min-w-0 flex-1 truncate text-left font-medium text-slate-800 transition hover:text-teal-brand"
                    onClick={() => onSelectNote?.(item)}
                    type="button"
                  >
                    {item.title}
                  </button>
                  <span className="shrink-0 text-xs text-slate-500">
                    {item.group} · {formatDate(item.deadline)}
                  </span>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </div>
    </div>
  )
}

export default DeadlineBanner
