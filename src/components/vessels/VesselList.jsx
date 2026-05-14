import { Edit2, Trash2 } from 'lucide-react'
import IconButton from '../ui/IconButton'
import VesselDetail from './VesselDetail'
import { formatNumber, formatPct } from '../../lib/utils'

function VesselList({ isLoading, onDelete, onEdit, vessels }) {
  if (isLoading) {
    return (
      <div className="rounded-lg border border-slate-200 bg-white p-6 text-sm text-slate-500 shadow-sm">
        Loading vessels
      </div>
    )
  }

  if (!vessels?.length) {
    return (
      <div className="rounded-lg border border-slate-200 bg-white p-6 text-sm text-slate-500 shadow-sm">
        No active vessels yet.
      </div>
    )
  }

  return (
    <div className="w-full overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
      <div className="w-full overflow-x-auto">
        <table className="w-full min-w-[1080px] divide-y divide-slate-200 text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase text-slate-500">
            <tr>
              <th className="px-4 py-3 font-semibold">Vessel Name</th>
              <th className="px-4 py-3 font-semibold">IMO</th>
              <th className="px-4 py-3 font-semibold">Company</th>
              <th className="px-4 py-3 font-semibold">Active</th>
              <th className="px-4 py-3 font-semibold">Total Offers</th>
              <th className="px-4 py-3 font-semibold">Returned</th>
              <th className="px-4 py-3 font-semibold">Win Rate</th>
              <th className="px-4 py-3 font-semibold">Effective Terms</th>
              <th className="px-4 py-3 text-right font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {vessels.map((vessel) => {
              const stats = vessel.return_stats || {}

              return (
                <tr key={vessel.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 font-medium text-slate-950">
                    {vessel.name}
                  </td>
                  <td className="px-4 py-3 text-slate-600">
                    {vessel.imo_number || '-'}
                  </td>
                  <td className="px-4 py-3 text-slate-600">
                    {vessel.company?.name || '-'}
                  </td>
                  <td className="px-4 py-3">
                    <span className="rounded bg-teal-brand/10 px-2 py-1 text-xs font-semibold text-teal-brand">
                      {vessel.is_active ? 'Active' : 'Inactive'}
                    </span>
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
                    <VesselDetail terms={vessel.effective_terms} />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <IconButton
                        icon={Edit2}
                        label="Edit vessel"
                        onClick={() => onEdit(vessel)}
                      />
                      <IconButton
                        icon={Trash2}
                        label="Delete vessel"
                        onClick={() => onDelete(vessel)}
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

export default VesselList
