import { formatPricingType } from '../../lib/utils'

const currencies = ['USD', 'EUR', 'TRY', 'GBP', 'AED']
const pricingTypes = [
  { value: 'net', label: 'Net' },
  { value: 'discounted', label: 'Discounted' },
]

function VesselTermsForm({
  companyTerms,
  disabled = false,
  onChange,
  onOverrideEnabledChange,
  overrideEnabled,
  terms,
}) {
  function updateField(field, value) {
    onChange({ ...terms, [field]: value })
  }

  return (
    <div className="space-y-4 rounded border border-slate-200 bg-slate-50 p-4">
      <div className="grid gap-3 md:grid-cols-2">
        <label className="flex cursor-pointer items-center gap-3 rounded border border-slate-200 bg-white px-3 py-3 text-sm font-medium text-slate-700">
          <input
            checked={!overrideEnabled}
            className="h-4 w-4 accent-teal-brand"
            disabled={disabled}
            name="vessel-terms-mode"
            onChange={() => onOverrideEnabledChange(false)}
            type="radio"
          />
          Use company default terms
        </label>
        <label className="flex cursor-pointer items-center gap-3 rounded border border-slate-200 bg-white px-3 py-3 text-sm font-medium text-slate-700">
          <input
            checked={overrideEnabled}
            className="h-4 w-4 accent-teal-brand"
            disabled={disabled}
            name="vessel-terms-mode"
            onChange={() => onOverrideEnabledChange(true)}
            type="radio"
          />
          Define vessel override
        </label>
      </div>

      <div className="rounded border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600">
        Company default: {companyTerms?.currency || '-'}
        {companyTerms?.pricing_type
          ? `, ${formatPricingType(companyTerms.pricing_type)}`
          : ''}
        {companyTerms?.payment_terms ? `, ${companyTerms.payment_terms}` : ''}
      </div>

      {overrideEnabled ? (
        <div className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <label className="block">
              <span className="text-sm font-medium text-slate-700">Currency</span>
              <select
                className="mt-1 h-10 w-full rounded border border-slate-300 bg-white px-3 text-sm outline-none transition focus:border-teal-brand focus:ring-2 focus:ring-teal-brand/20"
                disabled={disabled}
                onChange={(event) => updateField('currency', event.target.value)}
                value={terms.currency}
              >
                <option value="">Use default ({companyTerms?.currency || '-'})</option>
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
                onChange={(event) =>
                  updateField('pricing_type', event.target.value)
                }
                value={terms.pricing_type}
              >
                <option value="">
                  Use default ({formatPricingType(companyTerms?.pricing_type)})
                </option>
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
                placeholder={
                  companyTerms?.discount_percentage ?? 'Use company default'
                }
                step="0.01"
                type="number"
                value={terms.discount_percentage}
              />
            </label>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="block">
              <span className="text-sm font-medium text-slate-700">
                Payment Terms
              </span>
              <input
                className="mt-1 h-10 w-full rounded border border-slate-300 px-3 text-sm outline-none transition focus:border-teal-brand focus:ring-2 focus:ring-teal-brand/20"
                disabled={disabled}
                onChange={(event) =>
                  updateField('payment_terms', event.target.value)
                }
                placeholder={companyTerms?.payment_terms || 'Use company default'}
                value={terms.payment_terms}
              />
            </label>

            <label className="block">
              <span className="text-sm font-medium text-slate-700">
                Delivery Terms
              </span>
              <input
                className="mt-1 h-10 w-full rounded border border-slate-300 px-3 text-sm outline-none transition focus:border-teal-brand focus:ring-2 focus:ring-teal-brand/20"
                disabled={disabled}
                onChange={(event) =>
                  updateField('delivery_terms', event.target.value)
                }
                placeholder={companyTerms?.delivery_terms || 'Use company default'}
                value={terms.delivery_terms}
              />
            </label>
          </div>

          <label className="block">
            <span className="text-sm font-medium text-slate-700">Override Notes</span>
            <textarea
              className="mt-1 min-h-20 w-full rounded border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-teal-brand focus:ring-2 focus:ring-teal-brand/20"
              disabled={disabled}
              onChange={(event) => updateField('notes', event.target.value)}
              placeholder="Optional"
              value={terms.notes}
            />
          </label>
        </div>
      ) : null}
    </div>
  )
}

export default VesselTermsForm
