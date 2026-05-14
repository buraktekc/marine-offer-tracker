function IconButton({
  icon: Icon,
  label,
  onClick,
  variant = 'default',
  disabled = false,
  type = 'button',
}) {
  const variants = {
    default: 'border-slate-200 text-slate-600 hover:border-teal-brand hover:text-teal-brand',
    primary: 'border-slate-200 text-slate-600 hover:border-emerald-300 hover:text-emerald-600',
    danger: 'border-slate-200 text-slate-600 hover:border-red-300 hover:text-red-600',
    warning: 'border-slate-200 text-slate-600 hover:border-amber-300 hover:text-amber-600',
  }

  return (
    <button
      aria-label={label}
      className={[
        'group relative inline-flex h-9 w-9 items-center justify-center rounded border transition disabled:cursor-not-allowed disabled:opacity-50',
        variants[variant] || variants.default,
      ].join(' ')}
      disabled={disabled}
      onClick={onClick}
      type={type}
    >
      <Icon className="h-4 w-4" aria-hidden="true" />
      <span
        className="pointer-events-none absolute bottom-full left-1/2 z-20 mb-2 -translate-x-1/2 whitespace-nowrap rounded bg-slate-900 px-2 py-1 text-xs font-medium text-white opacity-0 shadow-lg transition group-hover:opacity-100"
        role="tooltip"
      >
        {label}
      </span>
    </button>
  )
}

export default IconButton
