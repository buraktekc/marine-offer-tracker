import { formatStatus } from '../../lib/utils'

const statusClasses = {
  sent: 'bg-slate-100 text-slate-700',
  won: 'bg-emerald-100 text-emerald-700',
  partially_won: 'bg-teal-brand/10 text-teal-brand',
  lost: 'bg-red-100 text-red-700',
  expired: 'bg-amber-100 text-amber-700',
  cancelled: 'bg-zinc-100 text-zinc-600',
}

function StatusBadge({ status }) {
  return (
    <span
      className={[
        'inline-flex rounded px-2 py-1 text-xs font-semibold',
        statusClasses[status] || statusClasses.sent,
      ].join(' ')}
    >
      {formatStatus(status)}
    </span>
  )
}

export default StatusBadge
