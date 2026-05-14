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

export function formatDays(value) {
  if (value === null || value === undefined || value === '') return '-'
  const num = Number(value)
  if (Number.isNaN(num)) return '-'
  return `${num.toFixed(1)} days`
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
  'pending_pricing',
  'not_available',
  'sent',
  'won',
  'partially_won',
  'lost',
  'expired',
  'cancelled',
]

export const currencies = ['USD', 'EUR', 'TRY', 'GBP', 'AED']

export const notAvailableCategories = [
  { value: 'supplier_unavailable', label: 'Supplier Unavailable' },
  { value: 'out_of_stock', label: 'Out of Stock' },
  { value: 'insufficient_lead_time', label: 'Insufficient Lead Time' },
  { value: 'out_of_scope', label: 'Out of Scope' },
  { value: 'price_uncompetitive', label: 'Price Uncompetitive' },
  { value: 'other', label: 'Other' },
]

export function getNotAvailableLabel(value) {
  return notAvailableCategories.find((c) => c.value === value)?.label || '-'
}

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
