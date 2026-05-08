import { formatTermsSummary } from '../../lib/utils'

function VesselDetail({ terms }) {
  return (
    <div className="flex flex-col gap-1 text-sm">
      <span className="font-medium text-slate-700">
        {formatTermsSummary(terms)}
      </span>
      <span className="text-xs text-slate-500">
        {terms?.has_override ? 'Override' : 'Company default'}
      </span>
    </div>
  )
}

export default VesselDetail
