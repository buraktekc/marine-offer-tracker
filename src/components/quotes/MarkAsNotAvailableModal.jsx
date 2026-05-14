import { useState } from 'react'
import { notAvailableCategories } from '../../lib/utils'

function MarkAsNotAvailableModal({
  isSubmitting = false,
  onClose,
  onSubmit,
  quote,
}) {
  const [form, setForm] = useState(() => ({
    not_available_reason_category:
      quote?.not_available_reason_category || 'supplier_unavailable',
    not_available_note: quote?.not_available_note || '',
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
            Mark as Not Available
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Reference: {quote.reference_no}
          </p>
          {quote.customer_reference ? (
            <p className="mt-1 text-sm text-slate-500">
              Customer Ref: {quote.customer_reference}
            </p>
          ) : null}
        </div>

        <fieldset className="space-y-2">
          <legend className="text-sm font-medium text-slate-700">
            Reason Category
          </legend>
          {notAvailableCategories.map((category) => (
            <label
              key={category.value}
              className="flex cursor-pointer items-start gap-2 rounded border border-slate-200 px-3 py-2 transition hover:border-slate-300"
            >
              <input
                checked={form.not_available_reason_category === category.value}
                className="mt-0.5 h-4 w-4 text-teal-brand"
                name="na_reason"
                onChange={() =>
                  updateField('not_available_reason_category', category.value)
                }
                type="radio"
                value={category.value}
              />
              <span className="text-sm text-slate-700">{category.label}</span>
            </label>
          ))}
        </fieldset>

        <label className="mt-4 block">
          <span className="text-sm font-medium text-slate-700">
            Additional Note (optional)
          </span>
          <textarea
            className="mt-1 min-h-24 w-full rounded border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-teal-brand focus:ring-2 focus:ring-teal-brand/20"
            onChange={(event) =>
              updateField('not_available_note', event.target.value)
            }
            value={form.not_available_note}
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
            className="h-10 rounded bg-red-600 px-4 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-70"
            disabled={isSubmitting}
            type="submit"
          >
            {isSubmitting ? 'Saving' : 'Confirm Not Available'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default MarkAsNotAvailableModal
