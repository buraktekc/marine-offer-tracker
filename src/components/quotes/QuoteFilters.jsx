import { currencies, notAvailableCategories, quoteStatuses } from '../../lib/utils'

function QuoteFilters({ companies, filters, onChange, onReset, vessels }) {
  function updateFilter(field, value) {
    onChange({ ...filters, [field]: value })
  }

  const filteredVessels = filters.company_id
    ? vessels.filter((vessel) => vessel.company_id === filters.company_id)
    : vessels

  const showNaFilter = filters.status === 'not_available'

  return (
    <div className="w-full rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <label className="block">
          <span className="text-xs font-semibold uppercase text-slate-500">
            Search
          </span>
          <input
            className="mt-1 h-10 w-full rounded border border-slate-300 px-3 text-sm outline-none transition focus:border-teal-brand focus:ring-2 focus:ring-teal-brand/20"
            onChange={(event) => updateFilter('search', event.target.value)}
            placeholder="Reference, customer ref, company"
            type="search"
            value={filters.search}
          />
        </label>

        <label className="block">
          <span className="text-xs font-semibold uppercase text-slate-500">
            Company
          </span>
          <select
            className="mt-1 h-10 w-full rounded border border-slate-300 bg-white px-3 text-sm outline-none transition focus:border-teal-brand focus:ring-2 focus:ring-teal-brand/20"
            onChange={(event) =>
              onChange({
                ...filters,
                company_id: event.target.value,
                vessel_id: '',
              })
            }
            value={filters.company_id}
          >
            <option value="">All companies</option>
            {companies.map((company) => (
              <option key={company.id} value={company.id}>
                {company.name}
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="text-xs font-semibold uppercase text-slate-500">
            Vessel
          </span>
          <select
            className="mt-1 h-10 w-full rounded border border-slate-300 bg-white px-3 text-sm outline-none transition focus:border-teal-brand focus:ring-2 focus:ring-teal-brand/20"
            onChange={(event) => updateFilter('vessel_id', event.target.value)}
            value={filters.vessel_id}
          >
            <option value="">All vessels</option>
            {filteredVessels.map((vessel) => (
              <option key={vessel.id} value={vessel.id}>
                {vessel.name}
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="text-xs font-semibold uppercase text-slate-500">
            Status
          </span>
          <select
            className="mt-1 h-10 w-full rounded border border-slate-300 bg-white px-3 text-sm outline-none transition focus:border-teal-brand focus:ring-2 focus:ring-teal-brand/20"
            onChange={(event) =>
              onChange({
                ...filters,
                status: event.target.value,
                na_reason:
                  event.target.value === 'not_available' ? filters.na_reason : '',
              })
            }
            value={filters.status}
          >
            <option value="">All statuses</option>
            {quoteStatuses.map((status) => (
              <option key={status} value={status}>
                {status.replace(/_/g, ' ')}
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="text-xs font-semibold uppercase text-slate-500">
            From
          </span>
          <input
            className="mt-1 h-10 w-full rounded border border-slate-300 px-3 text-sm outline-none transition focus:border-teal-brand focus:ring-2 focus:ring-teal-brand/20"
            onChange={(event) => updateFilter('date_from', event.target.value)}
            type="date"
            value={filters.date_from}
          />
        </label>

        <label className="block">
          <span className="text-xs font-semibold uppercase text-slate-500">
            To
          </span>
          <input
            className="mt-1 h-10 w-full rounded border border-slate-300 px-3 text-sm outline-none transition focus:border-teal-brand focus:ring-2 focus:ring-teal-brand/20"
            onChange={(event) => updateFilter('date_to', event.target.value)}
            type="date"
            value={filters.date_to}
          />
        </label>

        <label className="block">
          <span className="text-xs font-semibold uppercase text-slate-500">
            Currency
          </span>
          <select
            className="mt-1 h-10 w-full rounded border border-slate-300 bg-white px-3 text-sm outline-none transition focus:border-teal-brand focus:ring-2 focus:ring-teal-brand/20"
            onChange={(event) => updateFilter('currency', event.target.value)}
            value={filters.currency}
          >
            <option value="">All currencies</option>
            {currencies.map((currency) => (
              <option key={currency} value={currency}>
                {currency}
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="text-xs font-semibold uppercase text-slate-500">
            Port
          </span>
          <input
            className="mt-1 h-10 w-full rounded border border-slate-300 px-3 text-sm outline-none transition focus:border-teal-brand focus:ring-2 focus:ring-teal-brand/20"
            onChange={(event) => updateFilter('port', event.target.value)}
            placeholder="Port"
            value={filters.port}
          />
        </label>

        {showNaFilter ? (
          <label className="block xl:col-span-2">
            <span className="text-xs font-semibold uppercase text-slate-500">
              NA Reason
            </span>
            <select
              className="mt-1 h-10 w-full rounded border border-slate-300 bg-white px-3 text-sm outline-none transition focus:border-teal-brand focus:ring-2 focus:ring-teal-brand/20"
              onChange={(event) => updateFilter('na_reason', event.target.value)}
              value={filters.na_reason || ''}
            >
              <option value="">All reasons</option>
              {notAvailableCategories.map((category) => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>
          </label>
        ) : null}
      </div>

      <div className="mt-4 flex justify-end">
        <button
          className="h-9 rounded border border-slate-300 px-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          onClick={onReset}
          type="button"
        >
          Clear filters
        </button>
      </div>
    </div>
  )
}

export default QuoteFilters
