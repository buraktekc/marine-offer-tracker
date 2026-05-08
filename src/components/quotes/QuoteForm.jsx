import { currencies, quoteStatuses, todayDateInput } from '../../lib/utils'

function quoteStateFromInitial(initialQuote, companies) {
  return {
    reference_no: initialQuote?.reference_no || '',
    customer_reference: initialQuote?.customer_reference || '',
    subject: initialQuote?.subject || '',
    company_id: initialQuote?.company_id || companies?.[0]?.id || '',
    vessel_id: initialQuote?.vessel_id || '',
    quote_date: initialQuote?.quote_date || todayDateInput(),
    sent_date: initialQuote?.sent_date || '',
    validity_date: initialQuote?.validity_date || '',
    port: initialQuote?.port || '',
    agent: initialQuote?.agent || '',
    quote_total_amount: initialQuote?.quote_total_amount ?? '',
    quote_currency: initialQuote?.quote_currency || 'USD',
    item_count: initialQuote?.item_count ?? 0,
    status: initialQuote?.status || 'sent',
    lost_reason: initialQuote?.lost_reason || '',
    notes: initialQuote?.notes || '',
  }
}

function QuoteForm({
  companies,
  initialQuote,
  isSubmitting = false,
  onCancel,
  onChange,
  onSubmit,
  quote,
  vessels,
}) {
  const currentQuote = quote || quoteStateFromInitial(initialQuote, companies)

  function updateField(field, value) {
    onChange({ ...currentQuote, [field]: value })
  }

  function handleVesselChange(vesselId) {
    const selectedVessel = vessels.find((vessel) => vessel.id === vesselId)

    onChange({
      ...currentQuote,
      vessel_id: vesselId,
      company_id: selectedVessel?.company_id || currentQuote.company_id,
      quote_currency:
        selectedVessel?.effective_terms?.currency || currentQuote.quote_currency,
    })
  }

  function handleSubmit(event) {
    event.preventDefault()
    onSubmit(currentQuote)
  }

  return (
    <form
      className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm"
      onSubmit={handleSubmit}
    >
      <div className="mb-5">
        <h2 className="text-lg font-semibold text-slate-950">
          {initialQuote ? 'Edit Quote' : 'New Quote'}
        </h2>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <label className="block">
          <span className="text-sm font-medium text-slate-700">Reference No</span>
          <input
            className="mt-1 h-10 w-full rounded border border-slate-300 px-3 text-sm outline-none transition focus:border-teal-brand focus:ring-2 focus:ring-teal-brand/20"
            onChange={(event) => updateField('reference_no', event.target.value)}
            required
            value={currentQuote.reference_no}
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium text-slate-700">Customer Ref</span>
          <input
            className="mt-1 h-10 w-full rounded border border-slate-300 px-3 text-sm outline-none transition focus:border-teal-brand focus:ring-2 focus:ring-teal-brand/20"
            onChange={(event) =>
              updateField('customer_reference', event.target.value)
            }
            value={currentQuote.customer_reference}
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium text-slate-700">Status</span>
          <select
            className="mt-1 h-10 w-full rounded border border-slate-300 bg-white px-3 text-sm outline-none transition focus:border-teal-brand focus:ring-2 focus:ring-teal-brand/20"
            onChange={(event) => updateField('status', event.target.value)}
            value={currentQuote.status}
          >
            {quoteStatuses.map((status) => (
              <option key={status} value={status}>
                {status.replace('_', ' ')}
              </option>
            ))}
          </select>
        </label>
      </div>

      <label className="mt-4 block">
        <span className="text-sm font-medium text-slate-700">Subject</span>
        <input
          className="mt-1 h-10 w-full rounded border border-slate-300 px-3 text-sm outline-none transition focus:border-teal-brand focus:ring-2 focus:ring-teal-brand/20"
          onChange={(event) => updateField('subject', event.target.value)}
          value={currentQuote.subject}
        />
      </label>

      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <label className="block">
          <span className="text-sm font-medium text-slate-700">Vessel</span>
          <select
            className="mt-1 h-10 w-full rounded border border-slate-300 bg-white px-3 text-sm outline-none transition focus:border-teal-brand focus:ring-2 focus:ring-teal-brand/20"
            onChange={(event) => handleVesselChange(event.target.value)}
            value={currentQuote.vessel_id}
          >
            <option value="">No vessel selected</option>
            {vessels.map((vessel) => (
              <option key={vessel.id} value={vessel.id}>
                {vessel.name}
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="text-sm font-medium text-slate-700">Company</span>
          <select
            className="mt-1 h-10 w-full rounded border border-slate-300 bg-white px-3 text-sm outline-none transition focus:border-teal-brand focus:ring-2 focus:ring-teal-brand/20 disabled:bg-slate-100"
            disabled={Boolean(currentQuote.vessel_id)}
            onChange={(event) => updateField('company_id', event.target.value)}
            required
            value={currentQuote.company_id}
          >
            <option value="">Select company</option>
            {companies.map((company) => (
              <option key={company.id} value={company.id}>
                {company.name}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-3">
        <label className="block">
          <span className="text-sm font-medium text-slate-700">Quote Date</span>
          <input
            className="mt-1 h-10 w-full rounded border border-slate-300 px-3 text-sm outline-none transition focus:border-teal-brand focus:ring-2 focus:ring-teal-brand/20"
            onChange={(event) => updateField('quote_date', event.target.value)}
            required
            type="date"
            value={currentQuote.quote_date}
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium text-slate-700">Sent Date</span>
          <input
            className="mt-1 h-10 w-full rounded border border-slate-300 px-3 text-sm outline-none transition focus:border-teal-brand focus:ring-2 focus:ring-teal-brand/20"
            onChange={(event) => updateField('sent_date', event.target.value)}
            type="date"
            value={currentQuote.sent_date}
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium text-slate-700">Validity Date</span>
          <input
            className="mt-1 h-10 w-full rounded border border-slate-300 px-3 text-sm outline-none transition focus:border-teal-brand focus:ring-2 focus:ring-teal-brand/20"
            onChange={(event) => updateField('validity_date', event.target.value)}
            type="date"
            value={currentQuote.validity_date}
          />
        </label>
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <label className="block">
          <span className="text-sm font-medium text-slate-700">Port</span>
          <input
            className="mt-1 h-10 w-full rounded border border-slate-300 px-3 text-sm outline-none transition focus:border-teal-brand focus:ring-2 focus:ring-teal-brand/20"
            onChange={(event) => updateField('port', event.target.value)}
            value={currentQuote.port}
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium text-slate-700">Agent</span>
          <input
            className="mt-1 h-10 w-full rounded border border-slate-300 px-3 text-sm outline-none transition focus:border-teal-brand focus:ring-2 focus:ring-teal-brand/20"
            onChange={(event) => updateField('agent', event.target.value)}
            value={currentQuote.agent}
          />
        </label>
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-3">
        <label className="block">
          <span className="text-sm font-medium text-slate-700">Quote Total</span>
          <input
            className="mt-1 h-10 w-full rounded border border-slate-300 px-3 text-sm outline-none transition focus:border-teal-brand focus:ring-2 focus:ring-teal-brand/20"
            min="0"
            onChange={(event) =>
              updateField('quote_total_amount', event.target.value)
            }
            step="0.01"
            type="number"
            value={currentQuote.quote_total_amount}
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium text-slate-700">Currency</span>
          <select
            className="mt-1 h-10 w-full rounded border border-slate-300 bg-white px-3 text-sm outline-none transition focus:border-teal-brand focus:ring-2 focus:ring-teal-brand/20"
            onChange={(event) => updateField('quote_currency', event.target.value)}
            value={currentQuote.quote_currency}
          >
            {currencies.map((currency) => (
              <option key={currency} value={currency}>
                {currency}
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="text-sm font-medium text-slate-700">Item Count</span>
          <input
            className="mt-1 h-10 w-full rounded border border-slate-300 px-3 text-sm outline-none transition focus:border-teal-brand focus:ring-2 focus:ring-teal-brand/20"
            min="0"
            onChange={(event) => updateField('item_count', event.target.value)}
            type="number"
            value={currentQuote.item_count}
          />
        </label>
      </div>

      <label className="mt-4 block">
        <span className="text-sm font-medium text-slate-700">Notes</span>
        <textarea
          className="mt-1 min-h-20 w-full rounded border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-teal-brand focus:ring-2 focus:ring-teal-brand/20"
          onChange={(event) => updateField('notes', event.target.value)}
          value={currentQuote.notes}
        />
      </label>

      <div className="mt-5 flex flex-wrap justify-end gap-3">
        <button
          className="h-10 rounded border border-slate-300 px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          onClick={onCancel}
          type="button"
        >
          Cancel
        </button>
        <button
          className="h-10 rounded bg-teal-brand px-4 text-sm font-semibold text-sidebar transition hover:bg-teal-brand/90 disabled:cursor-not-allowed disabled:opacity-70"
          disabled={isSubmitting}
          type="submit"
        >
          {isSubmitting ? 'Saving' : 'Save Quote'}
        </button>
      </div>
    </form>
  )
}

export default QuoteForm
