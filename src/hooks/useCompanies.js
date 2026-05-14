import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'
import { normalizeEmpty, normalizeMaybeArray } from '../lib/utils'

function cleanCompany(company) {
  return {
    name: normalizeEmpty(company.name),
    type: normalizeEmpty(company.type),
    contact_email: normalizeEmpty(company.contact_email),
    contact_phone: normalizeEmpty(company.contact_phone),
    address: normalizeEmpty(company.address),
    notes: normalizeEmpty(company.notes),
  }
}

function cleanCompanyTerms(terms) {
  return {
    currency: terms.currency,
    pricing_type: terms.pricing_type,
    discount_percentage:
      normalizeEmpty(terms.discount_percentage) === null
        ? null
        : Number(terms.discount_percentage),
    payment_terms: normalizeEmpty(terms.payment_terms),
    delivery_terms: normalizeEmpty(terms.delivery_terms),
    notes: normalizeEmpty(terms.notes),
    updated_at: new Date().toISOString(),
  }
}

function normalizeStats(stats) {
  const toNullable = (v) =>
    v === null || v === undefined ? null : Number(v)

  return {
    total_offers: Number(stats?.total_offers || 0),
    pending_pricing: Number(stats?.pending_pricing || 0),
    not_available: Number(stats?.not_available || 0),
    returned_offers: Number(stats?.returned_offers || 0),
    win_rate_pct: toNullable(stats?.win_rate_pct),
    pricing_rate_pct: toNullable(stats?.pricing_rate_pct),
  }
}

async function fetchCompanies({ includeInactive = false } = {}) {
  let query = supabase
    .from('companies')
    .select('*, company_terms(*)')
    .order('name', { ascending: true })

  if (!includeInactive) {
    query = query.eq('is_active', true)
  }

  const [
    { data: companies, error },
    { data: statsRows, error: statsError },
  ] = await Promise.all([
    query,
    supabase.from('company_return_stats').select('*'),
  ])

  if (error) throw error
  if (statsError) throw statsError

  const statsByCompany = new Map(
    (statsRows || []).map((stats) => [stats.company_id, stats]),
  )

  return (companies || []).map((company) => ({
    ...company,
    company_terms: normalizeMaybeArray(company.company_terms),
    return_stats: normalizeStats(statsByCompany.get(company.id)),
  }))
}

async function createCompany({ company, terms }) {
  const { data: createdCompany, error: companyError } = await supabase
    .from('companies')
    .insert([{ ...cleanCompany(company), is_active: true }])
    .select()
    .single()

  if (companyError) throw companyError

  const { error: termsError } = await supabase.from('company_terms').insert([
    {
      company_id: createdCompany.id,
      ...cleanCompanyTerms(terms),
    },
  ])

  if (termsError) throw termsError

  return createdCompany
}

async function updateCompany({ id, company, terms }) {
  const { error: companyError } = await supabase
    .from('companies')
    .update({ ...cleanCompany(company), updated_at: new Date().toISOString() })
    .eq('id', id)

  if (companyError) throw companyError

  const { error: termsError } = await supabase.from('company_terms').upsert({
    company_id: id,
    ...cleanCompanyTerms(terms),
  })

  if (termsError) throw termsError
}

async function softDeleteCompany(id) {
  const { error } = await supabase
    .from('companies')
    .update({ is_active: false, updated_at: new Date().toISOString() })
    .eq('id', id)

  if (error) throw error
}

export function useCompanies(options) {
  const queryClient = useQueryClient()

  const companiesQuery = useQuery({
    queryKey: ['companies', options],
    queryFn: () => fetchCompanies(options),
  })

  const invalidateCompanies = () =>
    queryClient.invalidateQueries({ queryKey: ['companies'] })

  return {
    ...companiesQuery,
    createCompany: useMutation({
      mutationFn: createCompany,
      onSuccess: invalidateCompanies,
    }),
    updateCompany: useMutation({
      mutationFn: updateCompany,
      onSuccess: invalidateCompanies,
    }),
    softDeleteCompany: useMutation({
      mutationFn: softDeleteCompany,
      onSuccess: invalidateCompanies,
    }),
  }
}
