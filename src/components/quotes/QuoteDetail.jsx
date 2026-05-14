import CurrencyAmount from '../ui/CurrencyAmount'
import StatusBadge from '../ui/StatusBadge'
import {
  formatDate,
  formatDays,
  formatPct,
  getNotAvailableLabel,
} from '../../lib/utils'

function DetailItem({ label, value }) {
  const displayValue =
    value === null || value === undefined || value === '' ? '-' : value

  return (
    <div>
      <dt className="text-xs font-semibold uppercase text-slate-500">{label}</dt>
      <dd className="mt-1 text-sm font-medium text-slate-800">{displayValue}</dd>
    </div>
  )
}

function QuoteDetail({ quote, onClose }) {
  if (!quote) return null

  const isNotAvailable = quote.status === 'not_available'

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase text-teal-brand">
            Quote Detail
          </p>
          <h2 className="mt-1 text-xl font-semibold text-slate-950">
            {quote.reference_no}
          </h2>
        </div>
        <button
          className="h-9 rounded border border-slate-300 px-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          onClick={onClose}
          type="button"
        >
          Close
        </button>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <div className="space-y-4">
          <h3 className="text-sm font-semibold uppercase text-slate-500">
            Reference Details
          </h3>
          <dl className="grid gap-4 rounded border border-slate-200 p-4 md:grid-cols-2">
            <DetailItem label="Customer Ref" value={quote.customer_reference} />
            <DetailItem label="Subject" value={quote.subject} />
            <DetailItem
              label="RFQ Received"
              value={formatDate(quote.rfq_received_date)}
            />
            <DetailItem label="Quote Date" value={formatDate(quote.quote_date)} />
            <DetailItem label="Sent Date" value={formatDate(quote.sent_date)} />
            <DetailItem
              label="Validity Date"
              value={formatDate(quote.validity_date)}
            />
            <DetailItem
              label="Response Time"
              value={formatDays(quote.response_time_days)}
            />
            <DetailItem label="Status" value={<StatusBadge status={quote.status} />} />
          </dl>
        </div>

        <div className="space-y-4">
          <h3 className="text-sm font-semibold uppercase text-slate-500">
            Company/Vessel
          </h3>
          <dl className="grid gap-4 rounded border border-slate-200 p-4 md:grid-cols-2">
            <DetailItem label="Company" value={quote.company?.name} />
            <DetailItem label="Vessel" value={quote.vessel?.name} />
            <DetailItem label="Port" value={quote.port} />
            <DetailItem label="Agent" value={quote.agent} />
          </dl>
        </div>

        <div className="space-y-4">
          <h3 className="text-sm font-semibold uppercase text-slate-500">
            Quote Amount
          </h3>
          <dl className="grid gap-4 rounded border border-slate-200 p-4 md:grid-cols-2">
            <DetailItem
              label="Quote Total"
              value={
                <CurrencyAmount
                  amount={quote.quote_total_amount}
                  currency={quote.quote_currency}
                />
              }
            />
            <DetailItem label="Item Count" value={quote.item_count} />
          </dl>
        </div>

        <div className="space-y-4">
          <h3 className="text-sm font-semibold uppercase text-slate-500">
            Order Return Details
          </h3>
          <dl className="grid gap-4 rounded border border-slate-200 p-4 md:grid-cols-2">
            <DetailItem label="Order No" value={quote.order_no} />
            <DetailItem label="Order Date" value={formatDate(quote.order_date)} />
            <DetailItem
              label="Order Total"
              value={
                <CurrencyAmount
                  amount={quote.order_total_amount}
                  currency={quote.order_currency}
                />
              }
            />
            <DetailItem label="Return %" value={formatPct(quote.return_rate_pct)} />
            <DetailItem
              label="Difference Note"
              value={quote.order_difference_note}
            />
          </dl>
        </div>
      </div>

      {isNotAvailable ? (
        <div className="mt-5">
          <h3 className="text-sm font-semibold uppercase text-slate-500">
            Not Available Details
          </h3>
          <div className="mt-2 rounded border border-slate-200 p-4">
            <p className="text-sm font-medium text-slate-800">
              Reason:{' '}
              <span className="font-normal">
                {getNotAvailableLabel(quote.not_available_reason_category)}
              </span>
            </p>
            {quote.not_available_note ? (
              <p className="mt-2 text-sm text-slate-700">
                {quote.not_available_note}
              </p>
            ) : null}
          </div>
        </div>
      ) : null}

      <div className="mt-5 grid gap-5 lg:grid-cols-2">
        <div>
          <h3 className="text-sm font-semibold uppercase text-slate-500">
            Lost Reason
          </h3>
          <p className="mt-2 rounded border border-slate-200 p-4 text-sm text-slate-700">
            {quote.lost_reason || '-'}
          </p>
        </div>
        <div>
          <h3 className="text-sm font-semibold uppercase text-slate-500">Notes</h3>
          <p className="mt-2 rounded border border-slate-200 p-4 text-sm text-slate-700">
            {quote.notes || '-'}
          </p>
        </div>
      </div>
    </section>
  )
}

export default QuoteDetail
