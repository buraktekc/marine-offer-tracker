import { useQuery } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'

async function fetchVesselTerms(vesselId) {
  const { data, error } = await supabase
    .from('vessel_terms')
    .select('*')
    .eq('vessel_id', vesselId)
    .maybeSingle()

  if (error) throw error

  return data
}

export function useVesselTerms(vesselId) {
  return useQuery({
    queryKey: ['vessel_terms', vesselId],
    queryFn: () => fetchVesselTerms(vesselId),
    enabled: Boolean(vesselId),
  })
}
