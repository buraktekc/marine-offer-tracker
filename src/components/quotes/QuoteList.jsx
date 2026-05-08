import {
  CheckCircle2,
  Edit2,
  Eye,
  ShoppingCart,
  Slash,
  XCircle,
} from 'lucide-react'
import CurrencyAmount from '../ui/CurrencyAmount'
import StatusBadge from '../ui/StatusBadge'
import { formatDate, formatPct } from '../../lib/utils'

function QuoteList({
  isLoading,
  onCancel,
  onEdit,
  onMarkAsLost,
  onMarkAsOrder,
  onView,
  quotes,
}) {
  if (isLoading) {
    return (
      <div className="rounded-lg border border-slate-200 bg-white p-6 text-sm text-slate-500 shadow-sm">
        Loading quotes
      </div>
    )
  }

  if (!quotes?.length) {
    return (
      <div className="rounded-lg border border-slate-200 bg-white p-6 text-sm text-slate-500 shadow-sm">
        No quotes match the current filters.
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase text-slate-500">
            <tr>
              <th className="px-4 py-3 font-semibold">Reference No</th>
              <th className="px-4 py-3 font-semibold">Customer Ref</th>
              <th className="px-4 py-3 font-semibold">Company</th>
              <th className="px-4 py-3 font-semibold">Vessel</th>
              <th className="px-4 py-3 font-semibold">Port</th>
              <th className="px-4 py-3 font-semibold">Quote Date</th>
              <th className="px-4 py-3 font-semibold">Quote Total</th>
              <th className="px-4 py-3 font-semibold">Order Total</th>
              <th className="px-4 py-3 font-semibold">Return %</th>
              <th className="px-4 py-3 font-semibold">Status</th>
              <th className="px-4 py-3 text-right font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {quotes.map((quote) => (
              <tr key={quote.id} className="hover:bg-slate-50">
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
                <td className="px-4 py-3 text-slate-600">{quote.port || '-'}</td>
                <td className="px-4 py-3 text-slate-600">
                  {formatDate(quote.quote_date)}
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
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-2">
                    <button
                      className="inline-flex h-9 w-9 items-center justify-center rounded border border-slate-200 text-slate-600 transition hover:border-teal-brand hover:text-teal-brand"
                      onClick={() => onView(quote)}
                      title="View quote"
                      type="button"
                    >
                      <Eye className="h-4 w-4" aria-hidden="true" />
                    </button>
                    <button
                      className="inline-flex h-9 w-9 items-center justify-center rounded border border-slate-200 text-slate-600 transition hover:border-teal-brand hover:text-teal-brand"
                      onClick={() => onEdit(quote)}
                      title="Edit quote"
                      type="button"
                    >
                      <Edit2 className="h-4 w-4" aria-hidden="true" />
                    </button>
                    <button
                      className="inline-flex h-9 w-9 items-center justify-center rounded border border-slate-200 text-slate-600 transition hover:border-emerald-300 hover:text-emerald-600"
                      onClick={() => onMarkAsOrder(quote)}
                      title="Mark as order"
                      type="button"
                    >
                      <ShoppingCart className="h-4 w-4" aria-hidden="true" />
                    </button>
                    <button
                      className="inline-flex h-9 w-9 items-center justify-center rounded border border-slate-200 text-slate-600 transition hover:border-red-300 hover:text-red-600"
                      onClick={() => onMarkAsLost(quote)}
                      title="Mark as lost"
                      type="button"
                    >
                      <XCircle className="h-4 w-4" aria-hidden="true" />
                    </button>
                    <button
                      className="inline-flex h-9 w-9 items-center justify-center rounded border border-slate-200 text-slate-600 transition hover:border-amber-300 hover:text-amber-600"
                      onClick={() => onCancel(quote)}
                      title="Cancel quote"
                      type="button"
                    >
                      {quote.status === 'cancelled' ? (
                        <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
                      ) : (
                        <Slash className="h-4 w-4" aria-hidden="true" />
                      )}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default QuoteList
