import { useState } from 'react'

function MarkAsLostModal({ isSubmitting = false, onClose, onSubmit, quote }) {
  const [form, setForm] = useState(() => ({
    lost_reason: quote?.lost_reason || '',
    notes: quote?.notes || '',
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
          <h2 className="text-lg font-semibold text-slate-950">Mark as Lost</h2>
          <p className="mt-1 text-sm text-slate-500">
            Reference: {quote.reference_no}
          </p>
        </div>

        <label className="block">
          <span className="text-sm font-medium text-slate-700">Lost Reason</span>
          <textarea
            className="mt-1 min-h-24 w-full rounded border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-teal-brand focus:ring-2 focus:ring-teal-brand/20"
            onChange={(event) => updateField('lost_reason', event.target.value)}
            required
            value={form.lost_reason}
          />
        </label>

        <label className="mt-4 block">
          <span className="text-sm font-medium text-slate-700">Notes</span>
          <textarea
            className="mt-1 min-h-24 w-full rounded border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-teal-brand focus:ring-2 focus:ring-teal-brand/20"
            onChange={(event) => updateField('notes', event.target.value)}
            value={form.notes}
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
            {isSubmitting ? 'Saving' : 'Save Lost Status'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default MarkAsLostModal
