import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'
import { normalizeEmpty, normalizeMaybeArray } from '../lib/utils'

function cleanVessel(vessel) {
  return {
    name: normalizeEmpty(vessel.name),
    imo_number: normalizeEmpty(vessel.imo_number),
    company_id: vessel.company_id,
    flag: normalizeEmpty(vessel.flag),
    vessel_type: normalizeEmpty(vessel.vessel_type),
    notes: normalizeEmpty(vessel.notes),
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

function normalizeDiscount(value) {
  return normalizeEmpty(value) === null ? null : Number(value)
}

function valuesMatch(value, defaultValue) {
  if (value === null && (defaultValue === null || defaultValue === undefined)) {
    return true
  }

  if (value !== null && defaultValue !== null && defaultValue !== undefined) {
    const valueNumber = Number(value)
    const defaultNumber = Number(defaultValue)

    if (!Number.isNaN(valueNumber) && !Number.isNaN(defaultNumber)) {
      return valueNumber === defaultNumber
    }
  }

  return String(value ?? '') === String(defaultValue ?? '')
}

function cleanVesselTerms(overrideTerms, companyTerms) {
  const nextTerms = {
    currency: normalizeEmpty(overrideTerms.currency),
    pricing_type: normalizeEmpty(overrideTerms.pricing_type),
    discount_percentage: normalizeDiscount(overrideTerms.discount_percentage),
    payment_terms: normalizeEmpty(overrideTerms.payment_terms),
    delivery_terms: normalizeEmpty(overrideTerms.delivery_terms),
    notes: normalizeEmpty(overrideTerms.notes),
  }

  return {
    currency: valuesMatch(nextTerms.currency, companyTerms?.currency)
      ? null
      : nextTerms.currency,
    pricing_type: valuesMatch(nextTerms.pricing_type, companyTerms?.pricing_type)
      ? null
      : nextTerms.pricing_type,
    discount_percentage: valuesMatch(
      nextTerms.discount_percentage,
      companyTerms?.discount_percentage,
    )
      ? null
      : nextTerms.discount_percentage,
    payment_terms: valuesMatch(nextTerms.payment_terms, companyTerms?.payment_terms)
      ? null
      : nextTerms.payment_terms,
    delivery_terms: valuesMatch(
      nextTerms.delivery_terms,
      companyTerms?.delivery_terms,
    )
      ? null
      : nextTerms.delivery_terms,
    notes: nextTerms.notes,
    updated_at: new Date().toISOString(),
  }
}

async function fetchVessels({ includeInactive = false } = {}) {
  let vesselQuery = supabase
    .from('vessels')
    .select('*, companies(id, name), vessel_terms(*)')
    .order('name', { ascending: true })

  if (!includeInactive) {
    vesselQuery = vesselQuery.eq('is_active', true)
  }

  const [
    { data: vessels, error: vesselError },
    { data: effectiveTerms, error: termsError },
    { data: statsRows, error: statsError },
  ] = await Promise.all([
    vesselQuery,
    supabase.from('effective_vessel_terms').select('*'),
    supabase.from('vessel_return_stats').select('*'),
  ])

  if (vesselError) throw vesselError
  if (termsError) throw termsError
  if (statsError) throw statsError

  const termsByVessel = new Map(
    (effectiveTerms || []).map((terms) => [terms.vessel_id, terms]),
  )
  const statsByVessel = new Map(
    (statsRows || []).map((stats) => [stats.vessel_id, stats]),
  )

  return (vessels || []).map((vessel) => ({
    ...vessel,
    company: vessel.companies,
    vessel_terms: normalizeMaybeArray(vessel.vessel_terms),
    effective_terms: termsByVessel.get(vessel.id) || null,
    return_stats: normalizeStats(statsByVessel.get(vessel.id)),
  }))
}

async function saveVesselTerms({
  vesselId,
  overrideEnabled,
  overrideTerms,
  companyTerms,
}) {
  if (!overrideEnabled) {
    const { error } = await supabase
      .from('vessel_terms')
      .delete()
      .eq('vessel_id', vesselId)

    if (error) throw error
    return
  }

  const { error } = await supabase.from('vessel_terms').upsert({
    vessel_id: vesselId,
    ...cleanVesselTerms(overrideTerms, companyTerms),
  })

  if (error) throw error
}

async function createVessel({
  vessel,
  overrideEnabled,
  overrideTerms,
  companyTerms,
}) {
  const { data: createdVessel, error: vesselError } = await supabase
    .from('vessels')
    .insert([{ ...cleanVessel(vessel), is_active: true }])
    .select()
    .single()

  if (vesselError) throw vesselError

  await saveVesselTerms({
    vesselId: createdVessel.id,
    overrideEnabled,
    overrideTerms,
    companyTerms,
  })

  return createdVessel
}

async function updateVessel({
  id,
  vessel,
  overrideEnabled,
  overrideTerms,
  companyTerms,
}) {
  const { error: vesselError } = await supabase
    .from('vessels')
    .update({ ...cleanVessel(vessel), updated_at: new Date().toISOString() })
    .eq('id', id)

  if (vesselError) throw vesselError

  await saveVesselTerms({
    vesselId: id,
    overrideEnabled,
    overrideTerms,
    companyTerms,
  })
}

async function softDeleteVessel(id) {
  const { error } = await supabase
    .from('vessels')
    .update({ is_active: false, updated_at: new Date().toISOString() })
    .eq('id', id)

  if (error) throw error
}

export function useVessels(options) {
  const queryClient = useQueryClient()

  const vesselsQuery = useQuery({
    queryKey: ['vessels', options],
    queryFn: () => fetchVessels(options),
  })

  const invalidateVessels = () =>
    Promise.all([
      queryClient.invalidateQueries({ queryKey: ['vessels'] }),
      queryClient.invalidateQueries({ queryKey: ['effective_vessel_terms'] }),
    ])

  return {
    ...vesselsQuery,
    createVessel: useMutation({
      mutationFn: createVessel,
      onSuccess: invalidateVessels,
    }),
    updateVessel: useMutation({
      mutationFn: updateVessel,
      onSuccess: invalidateVessels,
    }),
    softDeleteVessel: useMutation({
      mutationFn: softDeleteVessel,
      onSuccess: invalidateVessels,
    }),
  }
}
