const accentClasses = {
  teal: 'bg-teal-brand/10 text-teal-brand',
  purple: 'bg-purple-brand/10 text-purple-brand',
  slate: 'bg-slate-100 text-slate-700',
}

function KPICard({ accent = 'teal', icon: Icon, label, value, detail }) {
  return (
    <article className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase text-slate-500">{label}</p>
          <p className="mt-3 truncate text-2xl font-semibold text-slate-950">
            {value}
          </p>
        </div>
        {Icon ? (
          <span
            className={[
              'inline-flex h-10 w-10 shrink-0 items-center justify-center rounded',
              accentClasses[accent] || accentClasses.teal,
            ].join(' ')}
          >
            <Icon className="h-5 w-5" aria-hidden="true" />
          </span>
        ) : null}
      </div>
      {detail ? <p className="mt-3 text-xs text-slate-500">{detail}</p> : null}
    </article>
  )
}

export default KPICard
