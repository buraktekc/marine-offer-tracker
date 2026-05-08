import { useQuery } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'

async function fetchCompanyTerms(companyId) {
  const { data, error } = await supabase
    .from('company_terms')
    .select('*')
    .eq('company_id', companyId)
    .maybeSingle()

  if (error) throw error

  return data
}

export function useCompanyTerms(companyId) {
  return useQuery({
    queryKey: ['company_terms', companyId],
    queryFn: () => fetchCompanyTerms(companyId),
    enabled: Boolean(companyId),
  })
}
