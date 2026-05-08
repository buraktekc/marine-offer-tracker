export function formatCurrency(value, currency = 'USD') {
  if (value === null || value === undefined || value === '') return '-'

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    maximumFractionDigits: 2,
  }).format(Number(value))
}

export function formatDate(value) {
  if (!value) return '-'

  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
  }).format(new Date(value))
}

export function formatPct(value) {
  if (value === null || value === undefined || value === '') return '-'

  return `${Number(value).toFixed(2)}%`
}
