import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'
import { normalizeEmpty } from '../lib/utils'

function normalizeNumber(value) {
  return normalizeEmpty(value) === null ? null : Number(value)
}

function normalizeInteger(value) {
  return normalizeEmpty(value) === null ? 0 : Number.parseInt(value, 10)
}

function cleanQuote(quote) {
  return {
    reference_no: normalizeEmpty(quote.reference_no),
    customer_reference: normalizeEmpty(quote.customer_reference),
    subject: normalizeEmpty(quote.subject),
    company_id: quote.company_id,
    vessel_id: normalizeEmpty(quote.vessel_id),
    quote_date: quote.quote_date,
    rfq_received_date: normalizeEmpty(quote.rfq_received_date),
    sent_date: normalizeEmpty(quote.sent_date),
    validity_date: normalizeEmpty(quote.validity_date),
    port: normalizeEmpty(quote.port),
    agent: normalizeEmpty(quote.agent),
    quote_total_amount: normalizeNumber(quote.quote_total_amount),
    quote_currency: normalizeEmpty(quote.quote_currency),
    item_count: normalizeInteger(quote.item_count),
    status: quote.status || 'pending_pricing',
    lost_reason: normalizeEmpty(quote.lost_reason),
    not_available_reason_category: normalizeEmpty(
      quote.not_available_reason_category,
    ),
    not_available_note: normalizeEmpty(quote.not_available_note),
    notes: normalizeEmpty(quote.notes),
  }
}

function cleanOrderReturn(orderReturn) {
  return {
    order_no: normalizeEmpty(orderReturn.order_no),
    order_date: normalizeEmpty(orderReturn.order_date),
    order_total_amount: normalizeNumber(orderReturn.order_total_amount),
    order_currency: normalizeEmpty(orderReturn.order_currency),
    order_difference_note: normalizeEmpty(orderReturn.order_difference_note),
    status: orderReturn.status,
    updated_at: new Date().toISOString(),
  }
}

function cleanPricingComplete(payload) {
  return {
    sent_date: normalizeEmpty(payload.sent_date),
    validity_date: normalizeEmpty(payload.validity_date),
    quote_total_amount: normalizeNumber(payload.quote_total_amount),
    quote_currency: normalizeEmpty(payload.quote_currency),
    item_count: normalizeInteger(payload.item_count),
    status: 'sent',
    updated_at: new Date().toISOString(),
  }
}

async function fetchQuotes() {
  const { data, error } = await supabase
    .from('quotes')
    .select('*, companies(id, name), vessels(id, name, imo_number)')
    .order('quote_date', { ascending: false })
    .order('created_at', { ascending: false })

  if (error) throw error

  return (data || []).map((quote) => ({
    ...quote,
    company: quote.companies,
    vessel: quote.vessels,
  }))
}

async function createQuote(quote) {
  const { data, error } = await supabase
    .from('quotes')
    .insert([cleanQuote(quote)])
    .select()
    .single()

  if (error) throw error

  return data
}

async function updateQuote({ id, quote }) {
  const { data, error } = await supabase
    .from('quotes')
    .update({ ...cleanQuote(quote), updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single()

  if (error) throw error

  return data
}

async function markQuoteAsOrder({ id, orderReturn }) {
  const { data, error } = await supabase
    .from('quotes')
    .update(cleanOrderReturn(orderReturn))
    .eq('id', id)
    .select()
    .single()

  if (error) throw error

  return data
}

async function markQuoteAsLost({ id, lost_reason, notes }) {
  const { data, error } = await supabase
    .from('quotes')
    .update({
      lost_reason: normalizeEmpty(lost_reason),
      notes: normalizeEmpty(notes),
      status: 'lost',
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select()
    .single()

  if (error) throw error

  return data
}

async function markQuoteAsSent({ id, payload }) {
  const { data, error } = await supabase
    .from('quotes')
    .update(cleanPricingComplete(payload))
    .eq('id', id)
    .select()
    .single()

  if (error) throw error

  return data
}

async function markQuoteAsNotAvailable({
  id,
  not_available_reason_category,
  not_available_note,
}) {
  const { data, error } = await supabase
    .from('quotes')
    .update({
      not_available_reason_category: normalizeEmpty(not_available_reason_category),
      not_available_note: normalizeEmpty(not_available_note),
      status: 'not_available',
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select()
    .single()

  if (error) throw error

  return data
}

async function revertToPending(id) {
  const { data, error } = await supabase
    .from('quotes')
    .update({
      status: 'pending_pricing',
      not_available_reason_category: null,
      not_available_note: null,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select()
    .single()

  if (error) throw error

  return data
}

async function cancelQuote(id) {
  const { data, error } = await supabase
    .from('quotes')
    .update({ status: 'cancelled', updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single()

  if (error) throw error

  return data
}

export function useQuotes() {
  const queryClient = useQueryClient()

  const quotesQuery = useQuery({
    queryKey: ['quotes'],
    queryFn: fetchQuotes,
  })

  const invalidateQuotes = () =>
    queryClient.invalidateQueries({ queryKey: ['quotes'] })

  return {
    ...quotesQuery,
    cancelQuote: useMutation({
      mutationFn: cancelQuote,
      onSuccess: invalidateQuotes,
    }),
    createQuote: useMutation({
      mutationFn: createQuote,
      onSuccess: invalidateQuotes,
    }),
    markQuoteAsLost: useMutation({
      mutationFn: markQuoteAsLost,
      onSuccess: invalidateQuotes,
    }),
    markQuoteAsOrder: useMutation({
      mutationFn: markQuoteAsOrder,
      onSuccess: invalidateQuotes,
    }),
    markQuoteAsSent: useMutation({
      mutationFn: markQuoteAsSent,
      onSuccess: invalidateQuotes,
    }),
    markQuoteAsNotAvailable: useMutation({
      mutationFn: markQuoteAsNotAvailable,
      onSuccess: invalidateQuotes,
    }),
    revertToPending: useMutation({
      mutationFn: revertToPending,
      onSuccess: invalidateQuotes,
    }),
    updateQuote: useMutation({
      mutationFn: updateQuote,
      onSuccess: invalidateQuotes,
    }),
  }
}
