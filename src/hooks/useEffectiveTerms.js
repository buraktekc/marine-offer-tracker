import { useQuery } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'

async function fetchEffectiveTerms() {
  const { data, error } = await supabase
    .from('effective_vessel_terms')
    .select('*')
    .order('vessel_name', { ascending: true })

  if (error) throw error

  return data || []
}

export function useEffectiveTerms() {
  return useQuery({
    queryKey: ['effective_vessel_terms'],
    queryFn: fetchEffectiveTerms,
  })
}
