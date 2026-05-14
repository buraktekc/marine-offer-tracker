import {
  CheckCircle2,
  Edit2,
  Eye,
  MinusCircle,
  RotateCcw,
  Send,
  ShoppingCart,
  Slash,
  XCircle,
} from 'lucide-react'
import CurrencyAmount from '../ui/CurrencyAmount'
import IconButton from '../ui/IconButton'
import StatusBadge from '../ui/StatusBadge'
import { formatDate, formatPct } from '../../lib/utils'

function QuoteList({
  isLoading,
  onCancel,
  onEdit,
  onMarkAsLost,
  onMarkAsNotAvailable,
  onMarkAsOrder,
  onMarkAsSent,
  onRevertToPending,
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
    <div className="w-full overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
      <div className="w-full overflow-x-auto">
        <table className="w-full min-w-[1180px] divide-y divide-slate-200 text-left text-sm">
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
            {quotes.map((quote) => {
              const isPending = quote.status === 'pending_pricing'
              const isNotAvailable = quote.status === 'not_available'
              const isSent = quote.status === 'sent'
              const isPartial = quote.status === 'partially_won'
              const isCancelled = quote.status === 'cancelled'
              const isClosed = ['won', 'lost', 'expired', 'cancelled'].includes(
                quote.status,
              )

              return (
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
                      <IconButton
                        icon={Eye}
                        label="View details"
                        onClick={() => onView(quote)}
                      />
                      <IconButton
                        icon={Edit2}
                        label="Edit quote"
                        onClick={() => onEdit(quote)}
                      />

                      {isPending ? (
                        <>
                          <IconButton
                            icon={Send}
                            label="Mark as sent (complete pricing)"
                            onClick={() => onMarkAsSent(quote)}
                            variant="primary"
                          />
                          <IconButton
                            icon={MinusCircle}
                            label="Mark as not available"
                            onClick={() => onMarkAsNotAvailable(quote)}
                            variant="danger"
                          />
                        </>
                      ) : null}

                      {isNotAvailable ? (
                        <IconButton
                          icon={RotateCcw}
                          label="Revert to pending"
                          onClick={() => onRevertToPending(quote)}
                          variant="warning"
                        />
                      ) : null}

                      {(isSent || isPartial) ? (
                        <IconButton
                          icon={ShoppingCart}
                          label="Mark as order"
                          onClick={() => onMarkAsOrder(quote)}
                          variant="primary"
                        />
                      ) : null}

                      {(isSent || isPartial) ? (
                        <IconButton
                          icon={XCircle}
                          label="Mark as lost"
                          onClick={() => onMarkAsLost(quote)}
                          variant="danger"
                        />
                      ) : null}

                      {!isClosed ? (
                        <IconButton
                          icon={isCancelled ? CheckCircle2 : Slash}
                          label={isCancelled ? 'Cancelled' : 'Cancel quote'}
                          onClick={() => onCancel(quote)}
                          variant="warning"
                          disabled={isCancelled}
                        />
                      ) : null}
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

export default QuoteList
