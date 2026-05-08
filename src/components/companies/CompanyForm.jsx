import { useState } from 'react'
import CompanyTermsForm from './CompanyTermsForm'

const companyTypes = [
  { value: '', label: 'Select type' },
  { value: 'owner', label: 'Owner' },
  { value: 'operator', label: 'Operator' },
  { value: 'agent', label: 'Agent' },
  { value: 'manager', label: 'Manager' },
  { value: 'trader', label: 'Trader' },
  { value: 'other', label: 'Other' },
]

function CompanyForm({
  initialCompany,
  initialTerms,
  isSubmitting = false,
  onCancel,
  onSubmit,
}) {
  const [company, setCompany] = useState(() => ({
    name: initialCompany?.name || '',
    type: initialCompany?.type || '',
    contact_email: initialCompany?.contact_email || '',
    contact_phone: initialCompany?.contact_phone || '',
    address: initialCompany?.address || '',
    notes: initialCompany?.notes || '',
  }))
  const [terms, setTerms] = useState(() => ({
    currency: initialTerms?.currency || 'USD',
    pricing_type: initialTerms?.pricing_type || 'net',
    discount_percentage: initialTerms?.discount_percentage ?? '',
    payment_terms: initialTerms?.payment_terms || '',
    delivery_terms: initialTerms?.delivery_terms || '',
    notes: initialTerms?.notes || '',
  }))

  function updateCompanyField(field, value) {
    setCompany((current) => ({ ...current, [field]: value }))
  }

  function handleSubmit(event) {
    event.preventDefault()
    onSubmit({ company, terms })
  }

  return (
    <form
      className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm"
      onSubmit={handleSubmit}
    >
      <div className="mb-5">
        <h2 className="text-lg font-semibold text-slate-950">
          {initialCompany ? 'Edit Company' : 'New Company'}
        </h2>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="block">
          <span className="text-sm font-medium text-slate-700">Company Name</span>
          <input
            className="mt-1 h-10 w-full rounded border border-slate-300 px-3 text-sm outline-none transition focus:border-teal-brand focus:ring-2 focus:ring-teal-brand/20"
            onChange={(event) => updateCompanyField('name', event.target.value)}
            required
            value={company.name}
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium text-slate-700">Type</span>
          <select
            className="mt-1 h-10 w-full rounded border border-slate-300 bg-white px-3 text-sm outline-none transition focus:border-teal-brand focus:ring-2 focus:ring-teal-brand/20"
            onChange={(event) => updateCompanyField('type', event.target.value)}
            value={company.type}
          >
            {companyTypes.map((type) => (
              <option key={type.value || 'empty'} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="text-sm font-medium text-slate-700">Contact Email</span>
          <input
            className="mt-1 h-10 w-full rounded border border-slate-300 px-3 text-sm outline-none transition focus:border-teal-brand focus:ring-2 focus:ring-teal-brand/20"
            onChange={(event) =>
              updateCompanyField('contact_email', event.target.value)
            }
            type="email"
            value={company.contact_email}
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium text-slate-700">Contact Phone</span>
          <input
            className="mt-1 h-10 w-full rounded border border-slate-300 px-3 text-sm outline-none transition focus:border-teal-brand focus:ring-2 focus:ring-teal-brand/20"
            onChange={(event) =>
              updateCompanyField('contact_phone', event.target.value)
            }
            value={company.contact_phone}
          />
        </label>
      </div>

      <label className="mt-4 block">
        <span className="text-sm font-medium text-slate-700">Address</span>
        <input
          className="mt-1 h-10 w-full rounded border border-slate-300 px-3 text-sm outline-none transition focus:border-teal-brand focus:ring-2 focus:ring-teal-brand/20"
          onChange={(event) => updateCompanyField('address', event.target.value)}
          value={company.address}
        />
      </label>

      <label className="mt-4 block">
        <span className="text-sm font-medium text-slate-700">Company Notes</span>
        <textarea
          className="mt-1 min-h-20 w-full rounded border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-teal-brand focus:ring-2 focus:ring-teal-brand/20"
          onChange={(event) => updateCompanyField('notes', event.target.value)}
          value={company.notes}
        />
      </label>

      <div className="my-5 border-t border-slate-200 pt-5">
        <h3 className="mb-4 text-sm font-semibold uppercase text-slate-500">
          Default Terms
        </h3>
        <CompanyTermsForm terms={terms} onChange={setTerms} />
      </div>

      <div className="flex flex-wrap justify-end gap-3">
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
          {isSubmitting ? 'Saving' : 'Save Company'}
        </button>
      </div>
    </form>
  )
}

export default CompanyForm
