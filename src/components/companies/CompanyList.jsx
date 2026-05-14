import { Edit2, Trash2 } from 'lucide-react'
import IconButton from '../ui/IconButton'
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
    <div className="w-full overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
      <div className="w-full overflow-x-auto">
        <table className="w-full min-w-[920px] divide-y divide-slate-200 text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase text-slate-500">
            <tr>
              <th className="px-4 py-3 font-semibold">Company Name</th>
              <th className="px-4 py-3 font-semibold">Type</th>
              <th className="px-4 py-3 font-semibold">Default Currency</th>
              <th className="px-4 py-3 font-semibold">Default Pricing</th>
              <th className="px-4 py-3 font-semibold">Total Offers</th>
              <th className="px-4 py-3 font-semibold">Returned</th>
              <th className="px-4 py-3 font-semibold">Win Rate</th>
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
                    {formatPct(stats.win_rate_pct)}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <IconButton
                        icon={Edit2}
                        label="Edit company"
                        onClick={() => onEdit(company)}
                      />
                      <IconButton
                        icon={Trash2}
                        label="Delete company"
                        onClick={() => onDelete(company)}
                        variant="danger"
                      />
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
