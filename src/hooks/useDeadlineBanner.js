import { useMemo } from 'react'
import { useNotes } from './useNotes'

function daysUntil(deadline) {
  if (!deadline) return null
  const now = new Date()
  now.setHours(0, 0, 0, 0)
  const target = new Date(deadline)
  target.setHours(0, 0, 0, 0)
  const diffMs = target.getTime() - now.getTime()
  return Math.round(diffMs / (1000 * 60 * 60 * 24))
}

export function useDeadlineBanner() {
  const { data: notes } = useNotes()

  return useMemo(() => {
    if (!notes) return { overdue: [], dueToday: [], dueSoon: [] }

    const overdue = []
    const dueToday = []
    const dueSoon = []

    notes
      .filter((n) => !n.is_archived && n.deadline)
      .forEach((note) => {
        const days = daysUntil(note.deadline)
        if (days === null) return

        if (days < 0) overdue.push({ ...note, daysUntil: days })
        else if (days === 0) dueToday.push({ ...note, daysUntil: days })
        else if (days <= 3) dueSoon.push({ ...note, daysUntil: days })
      })

    return { overdue, dueToday, dueSoon }
  }, [notes])
}
