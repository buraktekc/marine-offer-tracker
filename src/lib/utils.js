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

export function formatNumber(value, options = {}) {
  if (value === null || value === undefined || value === '') return '-'

  return new Intl.NumberFormat('en-US', options).format(Number(value))
}

export function formatAmount(value) {
  return formatNumber(value, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
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

export const quoteStatuses = [
  'sent',
  'won',
  'partially_won',
  'lost',
  'expired',
  'cancelled',
]

export const currencies = ['USD', 'EUR', 'TRY', 'GBP', 'AED']

export function formatStatus(value) {
  if (!value) return '-'

  return value
    .split('_')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')
}

export function formatSupabaseError(error) {
  if (!error) return 'Something went wrong.'

  if (error.code === '23505' || error.message?.includes('duplicate key')) {
    return 'Reference number already exists.'
  }

  return error.message || 'Something went wrong.'
}

export function todayDateInput() {
  return new Date().toISOString().slice(0, 10)
}

export function suggestOrderStatus(quoteTotal, orderTotal) {
  const quoteValue = Number(quoteTotal)
  const orderValue = Number(orderTotal)

  if (!quoteValue || !orderValue) return 'won'
  if (orderValue > 0 && orderValue < quoteValue) return 'partially_won'

  return 'won'
}
