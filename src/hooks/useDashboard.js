import { useQueries } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'

const EMPTY_SUMMARY = {
  total_offers: 0,
  returned_offers: 0,
  open_offers: 0,
  total_quote_amount: 0,
  total_order_amount: 0,
  offer_return_rate_pct: 0,
  amount_return_rate_pct: 0,
}

function toNumber(value) {
  if (value === null || value === undefined || value === '') return 0

  return Number(value)
}

function monthKey(date) {
  const value = new Date(date)
  const year = value.getUTCFullYear()
  const month = String(value.getUTCMonth() + 1).padStart(2, '0')

  return `${year}-${month}`
}

function getMonthStart(offsetFromCurrent) {
  const now = new Date()

  return new Date(Date.UTC(now.getFullYear(), now.getMonth() - offsetFromCurrent, 1))
}

function formatMonthLabel(date) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
  }).format(date)
}

function normalizeTrendRows(rows = []) {
  const rowsByMonth = new Map(rows.map((row) => [monthKey(row.month), row]))

  return Array.from({ length: 7 }, (_, index) => getMonthStart(6 - index)).map(
    (monthStart) => {
      const row = rowsByMonth.get(monthKey(monthStart))

      return {
        month: monthStart.toISOString(),
        label: formatMonthLabel(monthStart),
        total_offers: toNumber(row?.total_offers),
        returned_offers: toNumber(row?.returned_offers),
      }
    },
  )
}

function normalizeSummary(summary) {
  if (!summary) return EMPTY_SUMMARY

  return {
    total_offers: toNumber(summary.total_offers),
    returned_offers: toNumber(summary.returned_offers),
    open_offers: toNumber(summary.open_offers),
    total_quote_amount: toNumber(summary.total_quote_amount),
    total_order_amount: toNumber(summary.total_order_amount),
    offer_return_rate_pct: toNumber(summary.offer_return_rate_pct),
    amount_return_rate_pct: toNumber(summary.amount_return_rate_pct),
  }
}

function normalizeTopCompanies(rows = []) {
  return rows
    .filter((company) => toNumber(company.total_offers) > 0)
    .map((company) => ({
      ...company,
      total_offers: toNumber(company.total_offers),
      returned_offers: toNumber(company.returned_offers),
      offer_return_rate_pct: toNumber(company.offer_return_rate_pct),
    }))
    .sort((a, b) => {
      if (b.offer_return_rate_pct !== a.offer_return_rate_pct) {
        return b.offer_return_rate_pct - a.offer_return_rate_pct
      }

      return b.total_offers - a.total_offers
    })
    .slice(0, 5)
}

async function fetchSummary() {
  const { data, error } = await supabase
    .from('dashboard_summary')
    .select('*')
    .maybeSingle()

  if (error) throw error

  return normalizeSummary(data)
}

async function fetchMonthlyTrend() {
  const { data, error } = await supabase
    .from('monthly_return_trend')
    .select('*')
    .order('month', { ascending: false })
    .limit(7)

  if (error) throw error

  return normalizeTrendRows(data || [])
}

async function fetchTopCompanies() {
  const { data, error } = await supabase.from('company_return_stats').select('*')

  if (error) throw error

  return normalizeTopCompanies(data || [])
}

async function fetchRecentReferences() {
  const { data, error } = await supabase
    .from('quotes')
    .select('*, companies(id, name), vessels(id, name, imo_number)')
    .order('quote_date', { ascending: false })
    .order('created_at', { ascending: false })
    .limit(5)

  if (error) throw error

  return (data || []).map((quote) => ({
    ...quote,
    company: quote.companies,
    vessel: quote.vessels,
  }))
}

export function useDashboard() {
  const [summaryQuery, trendQuery, topCompaniesQuery, recentReferencesQuery] =
    useQueries({
      queries: [
        {
          queryKey: ['dashboard', 'summary'],
          queryFn: fetchSummary,
        },
        {
          queryKey: ['dashboard', 'monthly-return-trend'],
          queryFn: fetchMonthlyTrend,
        },
        {
          queryKey: ['dashboard', 'top-companies'],
          queryFn: fetchTopCompanies,
        },
        {
          queryKey: ['dashboard', 'recent-references'],
          queryFn: fetchRecentReferences,
        },
      ],
    })

  const queries = [
    summaryQuery,
    trendQuery,
    topCompaniesQuery,
    recentReferencesQuery,
  ]

  return {
    error: queries.find((query) => query.error)?.error || null,
    isLoading: queries.some((query) => query.isLoading),
    monthlyTrend: trendQuery.data || normalizeTrendRows(),
    recentReferences: recentReferencesQuery.data || [],
    summary: summaryQuery.data || EMPTY_SUMMARY,
    topCompanies: topCompaniesQuery.data || [],
  }
}
