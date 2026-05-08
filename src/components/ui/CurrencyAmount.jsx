import { formatCurrency } from '../../lib/utils'

function CurrencyAmount({ amount, currency }) {
  return (
    <span className="font-medium text-slate-700">
      {amount === null || amount === undefined
        ? '-'
        : formatCurrency(amount, currency || 'USD')}
    </span>
  )
}

export default CurrencyAmount
