import { useState } from 'react'
import {
  currencies,
  formatCurrency,
  formatStatus,
  suggestOrderStatus,
  todayDateInput,
} from '../../lib/utils'

function MarkAsOrderModal({ isSubmitting = false, onClose, onSubmit, quote }) {
  const [form, setForm] = useState(() => ({
    order_no: quote?.order_no || '',
    order_date: quote?.order_date || todayDateInput(),
    order_total_amount: quote?.order_total_amount ?? '',
    order_currency: quote?.order_currency || quote?.quote_currency || 'USD',
    order_difference_note: quote?.order_difference_note || '',
  }))

  if (!quote) return null

  const suggestedStatus = suggestOrderStatus(
    quote.quote_total_amount,
    form.order_total_amount,
  )

  function updateField(field, value) {
    setForm((current) => ({ ...current, [field]: value }))
  }

  function handleSubmit(event) {
    event.preventDefault()
    onSubmit({ ...form, status: suggestedStatus })
  }

  return (
    <div className="fixed inset-0 z-30 flex items-center justify-center bg-slate-950/40 px-4 py-6">
      <form
        className="w-full max-w-lg rounded-lg bg-white p-5 shadow-xl"
        onSubmit={handleSubmit}
      >
        <div className="mb-5">
          <h2 className="text-lg font-semibold text-slate-950">
            Mark as Order
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Reference: {quote.reference_no}
          </p>
          <p className="mt-1 text-sm text-slate-500">
            Quote Total:{' '}
            {quote.quote_total_amount
              ? formatCurrency(quote.quote_total_amount, quote.quote_currency)
              : '-'}
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <label className="block">
            <span className="text-sm font-medium text-slate-700">Order No</span>
            <input
              className="mt-1 h-10 w-full rounded border border-slate-300 px-3 text-sm outline-none transition focus:border-teal-brand focus:ring-2 focus:ring-teal-brand/20"
              onChange={(event) => updateField('order_no', event.target.value)}
              required
              value={form.order_no}
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-slate-700">Order Date</span>
            <input
              className="mt-1 h-10 w-full rounded border border-slate-300 px-3 text-sm outline-none transition focus:border-teal-brand focus:ring-2 focus:ring-teal-brand/20"
              onChange={(event) => updateField('order_date', event.target.value)}
              required
              type="date"
              value={form.order_date}
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-slate-700">Order Total</span>
            <input
              className="mt-1 h-10 w-full rounded border border-slate-300 px-3 text-sm outline-none transition focus:border-teal-brand focus:ring-2 focus:ring-teal-brand/20"
              min="0"
              onChange={(event) =>
                updateField('order_total_amount', event.target.value)
              }
              required
              step="0.01"
              type="number"
              value={form.order_total_amount}
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-slate-700">Currency</span>
            <select
              className="mt-1 h-10 w-full rounded border border-slate-300 bg-white px-3 text-sm outline-none transition focus:border-teal-brand focus:ring-2 focus:ring-teal-brand/20"
              onChange={(event) =>
                updateField('order_currency', event.target.value)
              }
              value={form.order_currency}
            >
              {currencies.map((currency) => (
                <option key={currency} value={currency}>
                  {currency}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="mt-4 rounded border border-teal-brand/20 bg-teal-brand/10 px-3 py-2 text-sm text-slate-700">
          Suggested status: <strong>{formatStatus(suggestedStatus)}</strong>
        </div>

        <label className="mt-4 block">
          <span className="text-sm font-medium text-slate-700">
            Order Difference Note
          </span>
          <textarea
            className="mt-1 min-h-20 w-full rounded border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-teal-brand focus:ring-2 focus:ring-teal-brand/20"
            onChange={(event) =>
              updateField('order_difference_note', event.target.value)
            }
            value={form.order_difference_note}
          />
        </label>

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
            {isSubmitting ? 'Saving' : 'Save Order Return'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default MarkAsOrderModal
