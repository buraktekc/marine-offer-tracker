import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import EmptyState from '../ui/EmptyState'

function MonthlyReturnChart({ data, isLoading }) {
  const hasOffers = data?.some(
    (month) => month.total_offers > 0 || month.returned_offers > 0,
  )

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-5">
        <p className="text-sm font-semibold uppercase text-teal-brand">
          Monthly Return Trend
        </p>
        <h2 className="mt-1 text-lg font-semibold text-slate-950">
          Offers and Returns
        </h2>
      </div>

      {isLoading ? (
        <div className="h-72 rounded bg-slate-50 p-5 text-sm text-slate-500">
          Loading trend
        </div>
      ) : hasOffers ? (
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ left: 0, right: 12, top: 8 }}>
              <CartesianGrid stroke="#E2E8F0" strokeDasharray="4 4" />
              <XAxis
                dataKey="label"
                stroke="#64748B"
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                allowDecimals={false}
                stroke="#64748B"
                tickLine={false}
                axisLine={false}
              />
              <Tooltip
                contentStyle={{
                  border: '1px solid #E2E8F0',
                  borderRadius: 8,
                  boxShadow: '0 10px 25px rgb(15 23 42 / 0.08)',
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="total_offers"
                name="Offers"
                stroke="#00ADB5"
                strokeWidth={3}
                dot={{ r: 4 }}
              />
              <Line
                type="monotone"
                dataKey="returned_offers"
                name="Returned Offers"
                stroke="#7F30E4"
                strokeWidth={3}
                dot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <EmptyState
          title="No monthly offer data"
          description="The trend will appear after quotes are created."
        />
      )}
    </section>
  )
}

export default MonthlyReturnChart
