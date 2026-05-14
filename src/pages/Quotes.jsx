import { AlertCircle, Plus } from 'lucide-react'
import { useMemo, useState } from 'react'
import MarkAsLostModal from '../components/quotes/MarkAsLostModal'
import MarkAsNotAvailableModal from '../components/quotes/MarkAsNotAvailableModal'
import MarkAsOrderModal from '../components/quotes/MarkAsOrderModal'
import MarkAsPricingCompleteModal from '../components/quotes/MarkAsPricingCompleteModal'
import QuoteDetail from '../components/quotes/QuoteDetail'
import QuoteFilters from '../components/quotes/QuoteFilters'
import QuoteForm from '../components/quotes/QuoteForm'
import QuoteList from '../components/quotes/QuoteList'
import { useCompanies } from '../hooks/useCompanies'
import { useQuotes } from '../hooks/useQuotes'
import { useVessels } from '../hooks/useVessels'
import { formatSupabaseError, todayDateInput } from '../lib/utils'

const emptyFilters = {
  search: '',
  company_id: '',
  vessel_id: '',
  status: '',
  date_from: '',
  date_to: '',
  currency: '',
  port: '',
  na_reason: '',
}

function createQuoteDraft(initialQuote, companies) {
  return {
    reference_no: initialQuote?.reference_no || '',
    customer_reference: initialQuote?.customer_reference || '',
    subject: initialQuote?.subject || '',
    company_id: initialQuote?.company_id || companies?.[0]?.id || '',
    vessel_id: initialQuote?.vessel_id || '',
    quote_date: initialQuote?.quote_date || todayDateInput(),
    rfq_received_date: initialQuote?.rfq_received_date || todayDateInput(),
    sent_date: initialQuote?.sent_date || '',
    validity_date: initialQuote?.validity_date || '',
    port: initialQuote?.port || '',
    agent: initialQuote?.agent || '',
    quote_total_amount: initialQuote?.quote_total_amount ?? '',
    quote_currency: initialQuote?.quote_currency || 'USD',
    item_count: initialQuote?.item_count ?? 0,
    status: initialQuote?.status || 'pending_pricing',
    lost_reason: initialQuote?.lost_reason || '',
    notes: initialQuote?.notes || '',
  }
}

function quoteMatchesFilters(quote, filters) {
  const search = filters.search.trim().toLowerCase()
  const searchableValues = [
    quote.reference_no,
    quote.customer_reference,
    quote.subject,
    quote.company?.name,
    quote.vessel?.name,
    quote.port,
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase()

  if (search && !searchableValues.includes(search)) return false
  if (filters.company_id && quote.company_id !== filters.company_id) return false
  if (filters.vessel_id && quote.vessel_id !== filters.vessel_id) return false
  if (filters.status && quote.status !== filters.status) return false
  if (filters.currency && quote.quote_currency !== filters.currency) return false
  if (
    filters.na_reason &&
    quote.not_available_reason_category !== filters.na_reason
  ) {
    return false
  }
  if (
    filters.port &&
    !quote.port?.toLowerCase().includes(filters.port.trim().toLowerCase())
  ) {
    return false
  }
  if (filters.date_from && quote.quote_date < filters.date_from) return false
  if (filters.date_to && quote.quote_date > filters.date_to) return false

  return true
}

function Quotes() {
  const {
    data: companies,
    error: companiesError,
    isLoading: isLoadingCompanies,
  } = useCompanies()
  const {
    data: vessels,
    error: vesselsError,
    isLoading: isLoadingVessels,
  } = useVessels()
  const {
    cancelQuote,
    createQuote,
    data: quotes,
    error: quotesError,
    isLoading: isLoadingQuotes,
    markQuoteAsLost,
    markQuoteAsNotAvailable,
    markQuoteAsOrder,
    markQuoteAsSent,
    revertToPending,
    updateQuote,
  } = useQuotes()

  const [editingQuote, setEditingQuote] = useState(null)
  const [filters, setFilters] = useState(emptyFilters)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [lostQuote, setLostQuote] = useState(null)
  const [notAvailableQuote, setNotAvailableQuote] = useState(null)
  const [notice, setNotice] = useState(null)
  const [orderQuote, setOrderQuote] = useState(null)
  const [pricingQuote, setPricingQuote] = useState(null)
  const [quoteDraft, setQuoteDraft] = useState(null)
  const [selectedQuote, setSelectedQuote] = useState(null)

  const isSubmitting =
    createQuote.isPending ||
    updateQuote.isPending ||
    markQuoteAsLost.isPending ||
    markQuoteAsNotAvailable.isPending ||
    markQuoteAsOrder.isPending ||
    markQuoteAsSent.isPending ||
    revertToPending.isPending ||
    cancelQuote.isPending
  const isLoading = isLoadingCompanies || isLoadingVessels || isLoadingQuotes
  const pageError = companiesError || vesselsError || quotesError

  const filteredQuotes = useMemo(
    () => (quotes || []).filter((quote) => quoteMatchesFilters(quote, filters)),
    [filters, quotes],
  )

  function openNewQuoteForm() {
    setEditingQuote(null)
    setNotice(null)
    setSelectedQuote(null)
    setQuoteDraft(createQuoteDraft(null, companies || []))
    setIsFormOpen(true)
  }

  function openEditQuoteForm(quote) {
    setEditingQuote(quote)
    setNotice(null)
    setQuoteDraft(createQuoteDraft(quote, companies || []))
    setIsFormOpen(true)
  }

  function closeForm() {
    setEditingQuote(null)
    setIsFormOpen(false)
    setQuoteDraft(null)
  }

  async function handleSubmitQuote(nextQuote) {
    setNotice(null)

    try {
      if (editingQuote) {
        await updateQuote.mutateAsync({ id: editingQuote.id, quote: nextQuote })
        setNotice({ type: 'success', text: 'Quote updated.' })
      } else {
        await createQuote.mutateAsync(nextQuote)
        setNotice({ type: 'success', text: 'Quote created.' })
      }

      closeForm()
    } catch (submitError) {
      setNotice({ type: 'error', text: formatSupabaseError(submitError) })
    }
  }

  async function handleMarkAsOrder(orderReturn) {
    setNotice(null)

    try {
      await markQuoteAsOrder.mutateAsync({
        id: orderQuote.id,
        orderReturn,
      })
      setNotice({ type: 'success', text: 'Order return saved.' })
      setOrderQuote(null)
    } catch (submitError) {
      setNotice({ type: 'error', text: formatSupabaseError(submitError) })
    }
  }

  async function handleMarkAsLost(payload) {
    setNotice(null)

    try {
      await markQuoteAsLost.mutateAsync({
        id: lostQuote.id,
        ...payload,
      })
      setNotice({ type: 'success', text: 'Quote marked as lost.' })
      setLostQuote(null)
    } catch (submitError) {
      setNotice({ type: 'error', text: formatSupabaseError(submitError) })
    }
  }

  async function handleMarkAsSent(payload) {
    setNotice(null)

    try {
      await markQuoteAsSent.mutateAsync({
        id: pricingQuote.id,
        payload,
      })
      setNotice({ type: 'success', text: 'Quote marked as sent.' })
      setPricingQuote(null)
    } catch (submitError) {
      setNotice({ type: 'error', text: formatSupabaseError(submitError) })
    }
  }

  async function handleMarkAsNotAvailable(payload) {
    setNotice(null)

    try {
      await markQuoteAsNotAvailable.mutateAsync({
        id: notAvailableQuote.id,
        ...payload,
      })
      setNotice({ type: 'success', text: 'Marked as not available.' })
      setNotAvailableQuote(null)
    } catch (submitError) {
      setNotice({ type: 'error', text: formatSupabaseError(submitError) })
    }
  }

  async function handleRevertToPending(quote) {
    const shouldRevert = window.confirm(`Revert ${quote.reference_no} to Pending?`)
    if (!shouldRevert) return

    setNotice(null)

    try {
      await revertToPending.mutateAsync(quote.id)
      setNotice({ type: 'success', text: 'Reverted to pending.' })
    } catch (submitError) {
      setNotice({ type: 'error', text: formatSupabaseError(submitError) })
    }
  }

  async function handleCancelQuote(quote) {
    if (quote.status === 'cancelled') return

    const shouldCancel = window.confirm(`Cancel quote ${quote.reference_no}?`)
    if (!shouldCancel) return

    setNotice(null)

    try {
      await cancelQuote.mutateAsync(quote.id)
      setNotice({ type: 'success', text: 'Quote cancelled.' })
    } catch (submitError) {
      setNotice({ type: 'error', text: formatSupabaseError(submitError) })
    }
  }

  return (
    <section className="w-full space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase text-teal-brand">Quotes</p>
          <h1 className="mt-2 text-2xl font-semibold text-slate-950">Quotes</h1>
        </div>

        <button
          className="inline-flex h-10 items-center gap-2 rounded bg-teal-brand px-4 text-sm font-semibold text-sidebar transition hover:bg-teal-brand/90 disabled:cursor-not-allowed disabled:opacity-60"
          disabled={!companies?.length}
          onClick={openNewQuoteForm}
          type="button"
        >
          <Plus className="h-4 w-4" aria-hidden="true" />
          New Quote
        </button>
      </div>

      {notice ? (
        <div
          className={[
            'rounded border px-4 py-3 text-sm',
            notice.type === 'error'
              ? 'border-red-200 bg-red-50 text-red-700'
              : 'border-teal-brand/20 bg-teal-brand/10 text-slate-700',
          ].join(' ')}
        >
          {notice.text}
        </div>
      ) : null}

      {pageError ? (
        <div className="flex items-center gap-2 rounded border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <AlertCircle className="h-4 w-4" aria-hidden="true" />
          {formatSupabaseError(pageError)}
        </div>
      ) : null}

      {!isLoadingCompanies && !companies?.length ? (
        <div className="rounded border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600 shadow-sm">
          Create an active company before adding quotes.
        </div>
      ) : null}

      {isFormOpen ? (
        <QuoteForm
          companies={companies || []}
          initialQuote={editingQuote}
          isSubmitting={isSubmitting}
          key={editingQuote?.id || 'new-quote'}
          onCancel={closeForm}
          onChange={setQuoteDraft}
          onSubmit={handleSubmitQuote}
          quote={quoteDraft}
          vessels={vessels || []}
        />
      ) : null}

      <QuoteFilters
        companies={companies || []}
        filters={filters}
        onChange={setFilters}
        onReset={() => setFilters(emptyFilters)}
        vessels={vessels || []}
      />

      {selectedQuote ? (
        <QuoteDetail
          onClose={() => setSelectedQuote(null)}
          quote={selectedQuote}
        />
      ) : null}

      <QuoteList
        isLoading={isLoading}
        onCancel={handleCancelQuote}
        onEdit={openEditQuoteForm}
        onMarkAsLost={setLostQuote}
        onMarkAsNotAvailable={setNotAvailableQuote}
        onMarkAsOrder={setOrderQuote}
        onMarkAsSent={setPricingQuote}
        onRevertToPending={handleRevertToPending}
        onView={setSelectedQuote}
        quotes={filteredQuotes}
      />

      {orderQuote ? (
        <MarkAsOrderModal
          isSubmitting={markQuoteAsOrder.isPending}
          onClose={() => setOrderQuote(null)}
          onSubmit={handleMarkAsOrder}
          quote={orderQuote}
        />
      ) : null}

      {lostQuote ? (
        <MarkAsLostModal
          isSubmitting={markQuoteAsLost.isPending}
          onClose={() => setLostQuote(null)}
          onSubmit={handleMarkAsLost}
          quote={lostQuote}
        />
      ) : null}

      {pricingQuote ? (
        <MarkAsPricingCompleteModal
          isSubmitting={markQuoteAsSent.isPending}
          onClose={() => setPricingQuote(null)}
          onSubmit={handleMarkAsSent}
          quote={pricingQuote}
        />
      ) : null}

      {notAvailableQuote ? (
        <MarkAsNotAvailableModal
          isSubmitting={markQuoteAsNotAvailable.isPending}
          onClose={() => setNotAvailableQuote(null)}
          onSubmit={handleMarkAsNotAvailable}
          quote={notAvailableQuote}
        />
      ) : null}
    </section>
  )
}

export default Quotes
