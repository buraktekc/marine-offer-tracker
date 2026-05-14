import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import EmptyState from '../ui/EmptyState'
import { formatPct } from '../../lib/utils'

function TopCompaniesChart({ companies, isLoading }) {
  return (
    <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-5">
        <p className="text-sm font-semibold uppercase text-teal-brand">
          Top Companies
        </p>
        <h2 className="mt-1 text-lg font-semibold text-slate-950">
          By Win Rate
        </h2>
      </div>

      {isLoading ? (
        <div className="h-80 rounded bg-slate-50 p-5 text-sm text-slate-500">
          Loading companies
        </div>
      ) : companies?.length ? (
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={companies}
              layout="vertical"
              margin={{ bottom: 8, left: 12, right: 24, top: 8 }}
            >
              <CartesianGrid stroke="#E2E8F0" strokeDasharray="4 4" />
              <XAxis
                axisLine={false}
                domain={[0, 100]}
                tickFormatter={(value) => `${value}%`}
                tickLine={false}
                type="number"
              />
              <YAxis
                axisLine={false}
                dataKey="company_name"
                tickLine={false}
                type="category"
                width={150}
              />
              <Tooltip
                contentStyle={{
                  border: '1px solid #E2E8F0',
                  borderRadius: 8,
                  boxShadow: '0 10px 25px rgb(15 23 42 / 0.08)',
                }}
                formatter={(value) => [formatPct(value), 'Win Rate']}
              />
              <Bar
                dataKey="win_rate_pct"
                fill="#00ADB5"
                name="Win Rate"
                radius={[0, 6, 6, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <EmptyState
          title="No company return data"
          description="Company rankings will appear after quotes are created."
        />
      )}
    </section>
  )
}

export default TopCompaniesChart
