import {
  ArrowRightCircle,
  DollarSign,
  FileText,
  PieChart,
  ShoppingCart,
  TrendingUp,
} from 'lucide-react'
import KPICard from '../ui/KPICard'
import { formatAmount, formatNumber, formatPct } from '../../lib/utils'

function KPIRow({ summary }) {
  const cards = [
    {
      accent: 'teal',
      icon: FileText,
      label: 'Total Offers',
      value: formatNumber(summary.total_offers),
    },
    {
      accent: 'purple',
      icon: ArrowRightCircle,
      label: 'Returned Offers',
      value: formatNumber(summary.returned_offers),
    },
    {
      accent: 'teal',
      icon: PieChart,
      label: 'Offer Return Rate',
      value: formatPct(summary.offer_return_rate_pct),
    },
    {
      accent: 'slate',
      detail: 'Mixed',
      icon: DollarSign,
      label: 'Total Quote Amount',
      value: formatAmount(summary.total_quote_amount),
    },
    {
      accent: 'purple',
      detail: 'Mixed',
      icon: ShoppingCart,
      label: 'Total Order Amount',
      value: formatAmount(summary.total_order_amount),
    },
    {
      accent: 'teal',
      icon: TrendingUp,
      label: 'Amount Return Rate',
      value: formatPct(summary.amount_return_rate_pct),
    },
  ]

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-6">
      {cards.map((card) => (
        <KPICard key={card.label} {...card} />
      ))}
    </div>
  )
}

export default KPIRow
