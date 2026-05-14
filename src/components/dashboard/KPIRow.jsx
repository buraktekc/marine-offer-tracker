import {
  CheckCircle2,
  Clock,
  Inbox,
  Percent,
  Send,
  Timer,
  TrendingUp,
  Trophy,
} from 'lucide-react'
import KPICard from '../ui/KPICard'
import { formatAmount, formatDays, formatNumber, formatPct } from '../../lib/utils'

function KPIRow({ summary }) {
  const cards = [
    {
      accent: 'slate',
      icon: Inbox,
      label: 'Total RFQs',
      value: formatNumber(summary.total_offers),
    },
    {
      accent: 'purple',
      icon: Clock,
      label: 'Pending Pricing',
      value: formatNumber(summary.pending_pricing),
    },
    {
      accent: 'teal',
      icon: Send,
      label: 'Sent Offers',
      value: formatNumber(summary.open_offers),
    },
    {
      accent: 'teal',
      icon: CheckCircle2,
      label: 'Returned',
      value: formatNumber(summary.returned_offers),
    },
    {
      accent: 'purple',
      detail: 'Sent / (Sent + NA)',
      icon: Percent,
      label: 'Pricing Rate',
      value: formatPct(summary.pricing_rate_pct),
    },
    {
      accent: 'teal',
      detail: 'Won / Quoted',
      icon: Trophy,
      label: 'Win Rate',
      value: formatPct(summary.win_rate_pct),
    },
    {
      accent: 'purple',
      detail: 'Order $ / Quote $',
      icon: TrendingUp,
      label: 'Amount Win Rate',
      value: formatPct(summary.amount_win_rate_pct),
    },
    {
      accent: 'slate',
      detail: 'RFQ → Sent',
      icon: Timer,
      label: 'Avg Response',
      value: formatDays(summary.avg_response_days),
    },
  ]

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => (
        <KPICard key={card.label} {...card} />
      ))}
    </div>
  )
}

export default KPIRow
