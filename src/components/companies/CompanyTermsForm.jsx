const currencies = ['USD', 'EUR', 'TRY', 'GBP', 'AED']
const pricingTypes = [
  { value: 'net', label: 'Net' },
  { value: 'discounted', label: 'Discounted' },
]

function CompanyTermsForm({ terms, onChange, disabled = false }) {
  function updateField(field, value) {
    onChange({ ...terms, [field]: value })
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-3">
        <label className="block">
          <span className="text-sm font-medium text-slate-700">Currency</span>
          <select
            className="mt-1 h-10 w-full rounded border border-slate-300 bg-white px-3 text-sm outline-none transition focus:border-teal-brand focus:ring-2 focus:ring-teal-brand/20"
            disabled={disabled}
            onChange={(event) => updateField('currency', event.target.value)}
            required
            value={terms.currency}
          >
            {currencies.map((currency) => (
              <option key={currency} value={currency}>
                {currency}
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="text-sm font-medium text-slate-700">Pricing</span>
          <select
            className="mt-1 h-10 w-full rounded border border-slate-300 bg-white px-3 text-sm outline-none transition focus:border-teal-brand focus:ring-2 focus:ring-teal-brand/20"
            disabled={disabled}
            onChange={(event) => updateField('pricing_type', event.target.value)}
            required
            value={terms.pricing_type}
          >
            {pricingTypes.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="text-sm font-medium text-slate-700">Discount %</span>
          <input
            className="mt-1 h-10 w-full rounded border border-slate-300 px-3 text-sm outline-none transition focus:border-teal-brand focus:ring-2 focus:ring-teal-brand/20"
            disabled={disabled}
            max="100"
            min="0"
            onChange={(event) =>
              updateField('discount_percentage', event.target.value)
            }
            placeholder="Optional"
            step="0.01"
            type="number"
            value={terms.discount_percentage}
          />
        </label>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="block">
          <span className="text-sm font-medium text-slate-700">Payment Terms</span>
          <input
            className="mt-1 h-10 w-full rounded border border-slate-300 px-3 text-sm outline-none transition focus:border-teal-brand focus:ring-2 focus:ring-teal-brand/20"
            disabled={disabled}
            onChange={(event) => updateField('payment_terms', event.target.value)}
            placeholder="30 days net"
            value={terms.payment_terms}
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium text-slate-700">Delivery Terms</span>
          <input
            className="mt-1 h-10 w-full rounded border border-slate-300 px-3 text-sm outline-none transition focus:border-teal-brand focus:ring-2 focus:ring-teal-brand/20"
            disabled={disabled}
            onChange={(event) => updateField('delivery_terms', event.target.value)}
            placeholder="Optional"
            value={terms.delivery_terms}
          />
        </label>
      </div>

      <label className="block">
        <span className="text-sm font-medium text-slate-700">Terms Notes</span>
        <textarea
          className="mt-1 min-h-20 w-full rounded border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-teal-brand focus:ring-2 focus:ring-teal-brand/20"
          disabled={disabled}
          onChange={(event) => updateField('notes', event.target.value)}
          placeholder="Optional"
          value={terms.notes}
        />
      </label>
    </div>
  )
}

export default CompanyTermsForm
