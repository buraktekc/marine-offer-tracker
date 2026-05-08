import { AlertCircle } from 'lucide-react'
import { useState } from 'react'
import KPIRow from '../components/dashboard/KPIRow'
import MonthlyReturnChart from '../components/dashboard/MonthlyReturnChart'
import RecentReferencesTable from '../components/dashboard/RecentReferencesTable'
import TopCompaniesChart from '../components/dashboard/TopCompaniesChart'
import QuoteDetail from '../components/quotes/QuoteDetail'
import { useDashboard } from '../hooks/useDashboard'
import { formatSupabaseError } from '../lib/utils'

function Dashboard() {
  const {
    error,
    isLoading,
    monthlyTrend,
    recentReferences,
    summary,
    topCompanies,
  } = useDashboard()
  const [selectedQuote, setSelectedQuote] = useState(null)

  return (
    <section className="space-y-6">
      <div>
        <p className="text-sm font-semibold uppercase text-teal-brand">Dashboard</p>
        <h1 className="mt-2 text-2xl font-semibold text-slate-950">
          Dashboard
        </h1>
      </div>

      {error ? (
        <div className="flex items-center gap-2 rounded border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <AlertCircle className="h-4 w-4" aria-hidden="true" />
          {formatSupabaseError(error)}
        </div>
      ) : null}

      <KPIRow summary={summary} />

      <MonthlyReturnChart data={monthlyTrend} isLoading={isLoading} />

      <RecentReferencesTable
        isLoading={isLoading}
        onSelectQuote={setSelectedQuote}
        quotes={recentReferences}
      />

      {selectedQuote ? (
        <QuoteDetail
          onClose={() => setSelectedQuote(null)}
          quote={selectedQuote}
        />
      ) : null}

      <TopCompaniesChart companies={topCompanies} isLoading={isLoading} />
    </section>
  )
}

export default Dashboard
