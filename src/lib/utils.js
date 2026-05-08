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

export function formatPricingType(value) {
  if (!value) return '-'

  return value
    .split('_')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')
}

export function formatTermsSummary(terms) {
  if (!terms) return '-'

  const parts = [
    terms.currency,
    terms.pricing_type ? formatPricingType(terms.pricing_type) : null,
    terms.payment_terms,
  ].filter(Boolean)

  return parts.length > 0 ? parts.join(', ') : '-'
}

export function normalizeEmpty(value) {
  if (value === undefined || value === null) return null
  if (typeof value === 'string' && value.trim() === '') return null

  return typeof value === 'string' ? value.trim() : value
}

export function normalizeMaybeArray(value) {
  if (Array.isArray(value)) return value[0] || null

  return value || null
}
