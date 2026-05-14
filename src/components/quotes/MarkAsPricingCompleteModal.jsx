import { useState } from 'react'
import {
  currencies,
  formatDate,
  todayDateInput,
} from '../../lib/utils'

function MarkAsPricingCompleteModal({
  isSubmitting = false,
  onClose,
  onSubmit,
  quote,
}) {
  const [form, setForm] = useState(() => ({
    sent_date: quote?.sent_date || todayDateInput(),
    validity_date: quote?.validity_date || '',
    quote_total_amount: quote?.quote_total_amount ?? '',
    quote_currency: quote?.quote_currency || 'USD',
    item_count: quote?.item_count ?? 0,
  }))

  if (!quote) return null

  function updateField(field, value) {
    setForm((current) => ({ ...current, [field]: value }))
  }

  function handleSubmit(event) {
    event.preventDefault()
    onSubmit(form)
  }

  return (
    <div className="fixed inset-0 z-30 flex items-center justify-center bg-slate-950/40 px-4 py-6">
      <form
        className="w-full max-w-lg rounded-lg bg-white p-5 shadow-xl"
        onSubmit={handleSubmit}
      >
        <div className="mb-5">
          <h2 className="text-lg font-semibold text-slate-950">
            Mark as Sent (Pricing Complete)
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Reference: {quote.reference_no}
          </p>
          {quote.customer_reference ? (
            <p className="mt-1 text-sm text-slate-500">
              Customer Ref: {quote.customer_reference}
            </p>
          ) : null}
          {quote.rfq_received_date ? (
            <p className="mt-1 text-sm text-slate-500">
              RFQ Received: {formatDate(quote.rfq_received_date)}
            </p>
          ) : null}
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <label className="block">
            <span className="text-sm font-medium text-slate-700">Sent Date</span>
            <input
              className="mt-1 h-10 w-full rounded border border-slate-300 px-3 text-sm outline-none transition focus:border-teal-brand focus:ring-2 focus:ring-teal-brand/20"
              onChange={(event) => updateField('sent_date', event.target.value)}
              required
              type="date"
              value={form.sent_date}
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-slate-700">Validity Date</span>
            <input
              className="mt-1 h-10 w-full rounded border border-slate-300 px-3 text-sm outline-none transition focus:border-teal-brand focus:ring-2 focus:ring-teal-brand/20"
              onChange={(event) => updateField('validity_date', event.target.value)}
              type="date"
              value={form.validity_date}
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-slate-700">Quote Total</span>
            <input
              className="mt-1 h-10 w-full rounded border border-slate-300 px-3 text-sm outline-none transition focus:border-teal-brand focus:ring-2 focus:ring-teal-brand/20"
              min="0"
              onChange={(event) =>
                updateField('quote_total_amount', event.target.value)
              }
              required
              step="0.01"
              type="number"
              value={form.quote_total_amount}
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-slate-700">Currency</span>
            <select
              className="mt-1 h-10 w-full rounded border border-slate-300 bg-white px-3 text-sm outline-none transition focus:border-teal-brand focus:ring-2 focus:ring-teal-brand/20"
              onChange={(event) =>
                updateField('quote_currency', event.target.value)
              }
              value={form.quote_currency}
            >
              {currencies.map((currency) => (
                <option key={currency} value={currency}>
                  {currency}
                </option>
              ))}
            </select>
          </label>

          <label className="block md:col-span-2">
            <span className="text-sm font-medium text-slate-700">Item Count</span>
            <input
              className="mt-1 h-10 w-full rounded border border-slate-300 px-3 text-sm outline-none transition focus:border-teal-brand focus:ring-2 focus:ring-teal-brand/20"
              min="0"
              onChange={(event) => updateField('item_count', event.target.value)}
              type="number"
              value={form.item_count}
            />
          </label>
        </div>

        <div className="mt-4 rounded border border-teal-brand/20 bg-teal-brand/10 px-3 py-2 text-sm text-slate-700">
          Status: <strong>Pending Pricing → Sent</strong>
        </div>

        <div className="mt-5 flex justify-end gap-3">
          <button
            className="h-10 rounded border border-slate-300 px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            onClick={onClose}
            type="button"
          >
            Cancel
          </button>
          <button
            className="h-10 rounded bg-teal-brand px-4 text-sm font-semibold text-sidebar transition hover:bg-teal-brand/90 disabled:cursor-not-allowed disabled:opacity-70"
            disabled={isSubmitting}
            type="submit"
          >
            {isSubmitting ? 'Saving' : 'Save & Mark as Sent'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default MarkAsPricingCompleteModal
