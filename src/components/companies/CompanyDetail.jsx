import { formatTermsSummary } from '../../lib/utils'

function CompanyDetail({ company }) {
  if (!company) return null

  return (
    <div className="rounded border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-600">
      Default terms: {formatTermsSummary(company.company_terms)}
    </div>
  )
}

export default CompanyDetail
