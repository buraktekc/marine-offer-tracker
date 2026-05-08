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

async function getCurrentUserId() {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error) throw error

  return user?.id || null
}

async function fetchCompanies({ includeInactive = false } = {}) {
  let query = supabase
    .from('companies')
    .select('*, company_terms(*)')
    .order('name', { ascending: true })

  if (!includeInactive) {
    query = query.eq('is_active', true)
  }

  const { data, error } = await query

  if (error) throw error

  return (data || []).map((company) => ({
    ...company,
    company_terms: normalizeMaybeArray(company.company_terms),
  }))
}

async function createCompany({ company, terms }) {
  const created_by = await getCurrentUserId()
  const { data: createdCompany, error: companyError } = await supabase
    .from('companies')
    .insert([{ ...cleanCompany(company), created_by, is_active: true }])
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
