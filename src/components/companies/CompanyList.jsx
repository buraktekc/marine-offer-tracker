import { Edit2, Trash2 } from 'lucide-react'
import { formatNumber, formatPct, formatPricingType } from '../../lib/utils'

function CompanyList({ companies, isLoading, onDelete, onEdit }) {
  if (isLoading) {
    return (
      <div className="rounded-lg border border-slate-200 bg-white p-6 text-sm text-slate-500 shadow-sm">
        Loading companies
      </div>
    )
  }

  if (!companies?.length) {
    return (
      <div className="rounded-lg border border-slate-200 bg-white p-6 text-sm text-slate-500 shadow-sm">
        No active companies yet.
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-[920px] divide-y divide-slate-200 text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase text-slate-500">
            <tr>
              <th className="px-4 py-3 font-semibold">Company Name</th>
              <th className="px-4 py-3 font-semibold">Type</th>
              <th className="px-4 py-3 font-semibold">Default Currency</th>
              <th className="px-4 py-3 font-semibold">Default Pricing</th>
              <th className="px-4 py-3 font-semibold">Total Offers</th>
              <th className="px-4 py-3 font-semibold">Returned</th>
              <th className="px-4 py-3 font-semibold">Return Rate</th>
              <th className="px-4 py-3 text-right font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {companies.map((company) => {
              const stats = company.return_stats || {}

              return (
                <tr key={company.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 font-medium text-slate-950">
                    {company.name}
                  </td>
                  <td className="px-4 py-3 capitalize text-slate-600">
                    {company.type || '-'}
                  </td>
                  <td className="px-4 py-3 text-slate-600">
                    {company.company_terms?.currency || '-'}
                  </td>
                  <td className="px-4 py-3 text-slate-600">
                    {formatPricingType(company.company_terms?.pricing_type)}
                  </td>
                  <td className="px-4 py-3 text-slate-600">
                    {formatNumber(stats.total_offers || 0)}
                  </td>
                  <td className="px-4 py-3 text-slate-600">
                    {formatNumber(stats.returned_offers || 0)}
                  </td>
                  <td className="px-4 py-3 text-slate-600">
                    {formatPct(stats.offer_return_rate_pct)}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <button
                        className="inline-flex h-9 w-9 items-center justify-center rounded border border-slate-200 text-slate-600 transition hover:border-teal-brand hover:text-teal-brand"
                        onClick={() => onEdit(company)}
                        title="Edit company"
                        type="button"
                      >
                        <Edit2 className="h-4 w-4" aria-hidden="true" />
                      </button>
                      <button
                        className="inline-flex h-9 w-9 items-center justify-center rounded border border-slate-200 text-slate-600 transition hover:border-red-300 hover:text-red-600"
                        onClick={() => onDelete(company)}
                        title="Delete company"
                        type="button"
                      >
                        <Trash2 className="h-4 w-4" aria-hidden="true" />
                      </button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default CompanyList
