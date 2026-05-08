import { useMemo, useState } from 'react'
import VesselTermsForm from './VesselTermsForm'

function hasAnyOverride(terms) {
  return Boolean(
    terms?.currency ||
      terms?.pricing_type ||
      (terms?.discount_percentage !== null &&
        terms?.discount_percentage !== undefined) ||
      terms?.payment_terms ||
      terms?.delivery_terms ||
      terms?.notes,
  )
}

function VesselForm({
  companies,
  initialTerms,
  initialVessel,
  isSubmitting = false,
  onCancel,
  onSubmit,
}) {
  const [vessel, setVessel] = useState(() => {
    const firstCompanyId = companies?.[0]?.id || ''

    return {
      name: initialVessel?.name || '',
      imo_number: initialVessel?.imo_number || '',
      company_id: initialVessel?.company_id || firstCompanyId,
      flag: initialVessel?.flag || '',
      vessel_type: initialVessel?.vessel_type || '',
      notes: initialVessel?.notes || '',
    }
  })
  const [overrideEnabled, setOverrideEnabled] = useState(() =>
    hasAnyOverride(initialTerms),
  )
  const [overrideTerms, setOverrideTerms] = useState(() => ({
    currency: initialTerms?.currency || '',
    pricing_type: initialTerms?.pricing_type || '',
    discount_percentage: initialTerms?.discount_percentage ?? '',
    payment_terms: initialTerms?.payment_terms || '',
    delivery_terms: initialTerms?.delivery_terms || '',
    notes: initialTerms?.notes || '',
  }))

  const selectedCompany = useMemo(
    () => companies?.find((company) => company.id === vessel.company_id),
    [companies, vessel.company_id],
  )

  function updateVesselField(field, value) {
    setVessel((current) => ({ ...current, [field]: value }))
  }

  function handleSubmit(event) {
    event.preventDefault()
    onSubmit({
      vessel,
      overrideEnabled,
      overrideTerms,
      companyTerms: selectedCompany?.company_terms,
    })
  }

  return (
    <form
      className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm"
      onSubmit={handleSubmit}
    >
      <div className="mb-5">
        <h2 className="text-lg font-semibold text-slate-950">
          {initialVessel ? 'Edit Vessel' : 'New Vessel'}
        </h2>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="block">
          <span className="text-sm font-medium text-slate-700">Vessel Name</span>
          <input
            className="mt-1 h-10 w-full rounded border border-slate-300 px-3 text-sm outline-none transition focus:border-teal-brand focus:ring-2 focus:ring-teal-brand/20"
            onChange={(event) => updateVesselField('name', event.target.value)}
            required
            value={vessel.name}
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium text-slate-700">Company</span>
          <select
            className="mt-1 h-10 w-full rounded border border-slate-300 bg-white px-3 text-sm outline-none transition focus:border-teal-brand focus:ring-2 focus:ring-teal-brand/20"
            onChange={(event) =>
              updateVesselField('company_id', event.target.value)
            }
            required
            value={vessel.company_id}
          >
            {companies?.map((company) => (
              <option key={company.id} value={company.id}>
                {company.name}
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="text-sm font-medium text-slate-700">IMO Number</span>
          <input
            className="mt-1 h-10 w-full rounded border border-slate-300 px-3 text-sm outline-none transition focus:border-teal-brand focus:ring-2 focus:ring-teal-brand/20"
            onChange={(event) =>
              updateVesselField('imo_number', event.target.value)
            }
            value={vessel.imo_number}
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium text-slate-700">Flag</span>
          <input
            className="mt-1 h-10 w-full rounded border border-slate-300 px-3 text-sm outline-none transition focus:border-teal-brand focus:ring-2 focus:ring-teal-brand/20"
            onChange={(event) => updateVesselField('flag', event.target.value)}
            value={vessel.flag}
          />
        </label>

        <label className="block md:col-span-2">
          <span className="text-sm font-medium text-slate-700">Vessel Type</span>
          <input
            className="mt-1 h-10 w-full rounded border border-slate-300 px-3 text-sm outline-none transition focus:border-teal-brand focus:ring-2 focus:ring-teal-brand/20"
            onChange={(event) =>
              updateVesselField('vessel_type', event.target.value)
            }
            value={vessel.vessel_type}
          />
        </label>
      </div>

      <label className="mt-4 block">
        <span className="text-sm font-medium text-slate-700">Vessel Notes</span>
        <textarea
          className="mt-1 min-h-20 w-full rounded border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-teal-brand focus:ring-2 focus:ring-teal-brand/20"
          onChange={(event) => updateVesselField('notes', event.target.value)}
          value={vessel.notes}
        />
      </label>

      <div className="my-5 border-t border-slate-200 pt-5">
        <h3 className="mb-4 text-sm font-semibold uppercase text-slate-500">
          Vessel Terms
        </h3>
        <VesselTermsForm
          companyTerms={selectedCompany?.company_terms}
          onChange={setOverrideTerms}
          onOverrideEnabledChange={setOverrideEnabled}
          overrideEnabled={overrideEnabled}
          terms={overrideTerms}
        />
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
          disabled={isSubmitting || !companies?.length}
          type="submit"
        >
          {isSubmitting ? 'Saving' : 'Save Vessel'}
        </button>
      </div>
    </form>
  )
}

export default VesselForm
