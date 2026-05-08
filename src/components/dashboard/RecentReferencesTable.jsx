import CurrencyAmount from '../ui/CurrencyAmount'
import EmptyState from '../ui/EmptyState'
import StatusBadge from '../ui/StatusBadge'
import { formatPct } from '../../lib/utils'

function RecentReferencesTable({ isLoading, onSelectQuote, quotes }) {
  return (
    <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-5">
        <p className="text-sm font-semibold uppercase text-teal-brand">
          Recent Offer References
        </p>
        <h2 className="mt-1 text-lg font-semibold text-slate-950">
          Latest Quotes
        </h2>
      </div>

      {isLoading ? (
        <div className="rounded bg-slate-50 p-5 text-sm text-slate-500">
          Loading references
        </div>
      ) : quotes?.length ? (
        <div className="overflow-x-auto">
          <table className="min-w-[1040px] divide-y divide-slate-200 text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase text-slate-500">
              <tr>
                <th className="px-4 py-3 font-semibold">Reference No</th>
                <th className="px-4 py-3 font-semibold">Customer Ref</th>
                <th className="px-4 py-3 font-semibold">Company</th>
                <th className="px-4 py-3 font-semibold">Vessel</th>
                <th className="px-4 py-3 font-semibold">Port</th>
                <th className="px-4 py-3 font-semibold">Quote Total</th>
                <th className="px-4 py-3 font-semibold">Order Total</th>
                <th className="px-4 py-3 font-semibold">Return %</th>
                <th className="px-4 py-3 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {quotes.map((quote) => (
                <tr
                  className="cursor-pointer transition hover:bg-slate-50 focus:bg-slate-50 focus:outline-none"
                  key={quote.id}
                  onClick={() => onSelectQuote(quote)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                      event.preventDefault()
                      onSelectQuote(quote)
                    }
                  }}
                  role="button"
                  tabIndex={0}
                >
                  <td className="px-4 py-3 font-medium text-slate-950">
                    {quote.reference_no}
                  </td>
                  <td className="px-4 py-3 text-slate-600">
                    {quote.customer_reference || '-'}
                  </td>
                  <td className="px-4 py-3 text-slate-600">
                    {quote.company?.name || '-'}
                  </td>
                  <td className="px-4 py-3 text-slate-600">
                    {quote.vessel?.name || '-'}
                  </td>
                  <td className="px-4 py-3 text-slate-600">
                    {quote.port || '-'}
                  </td>
                  <td className="px-4 py-3">
                    <CurrencyAmount
                      amount={quote.quote_total_amount}
                      currency={quote.quote_currency}
                    />
                  </td>
                  <td className="px-4 py-3">
                    <CurrencyAmount
                      amount={quote.order_total_amount}
                      currency={quote.order_currency}
                    />
                  </td>
                  <td className="px-4 py-3 text-slate-600">
                    {formatPct(quote.return_rate_pct)}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={quote.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <EmptyState
          title="No recent references"
          description="Latest quotes will appear here."
        />
      )}
    </section>
  )
}

export default RecentReferencesTable
