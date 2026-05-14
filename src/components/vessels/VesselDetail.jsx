import { formatTermsSummary } from '../../lib/utils'

function VesselDetail({ terms }) {
  return (
    <div className="space-y-1">
      <p className="text-sm font-medium text-slate-700">
        {formatTermsSummary(terms)}
      </p>
      <p className="text-xs text-slate-500">
        {terms?.has_override ? 'Vessel override' : 'Company default'}
      </p>
    </div>
  )
}

export default VesselDetail
