import {
  Building2,
  FileText,
  LayoutDashboard,
  NotebookText,
  Ship,
} from 'lucide-react'
import { NavLink } from 'react-router-dom'

const navigation = [
  { name: 'Dashboard', to: '/', icon: LayoutDashboard },
  { name: 'Companies', to: '/companies', icon: Building2 },
  { name: 'Vessels', to: '/vessels', icon: Ship },
  { name: 'Quotes', to: '/quotes', icon: FileText },
  { name: 'Notes', to: '/notes', icon: NotebookText },
]

function Sidebar() {
  return (
    <aside className="flex min-h-screen w-16 shrink-0 flex-col bg-sidebar text-white md:w-[240px]">
      <div className="flex h-16 items-center justify-center border-b border-white/10 px-3 md:justify-start md:px-5">
        <div className="flex h-9 w-9 items-center justify-center rounded bg-teal-brand text-sm font-bold text-sidebar">
          MO
        </div>
        <div className="ml-3 hidden min-w-0 md:block">
          <p className="truncate text-sm font-semibold">Marine Offer</p>
          <p className="truncate text-xs text-slate-400">Tracker</p>
        </div>
      </div>

      <nav className="flex flex-1 flex-col gap-1 px-2 py-4 md:px-3">
        {navigation.map((item) => {
          const Icon = item.icon

          return (
            <NavLink
              key={item.name}
              to={item.to}
              end={item.to === '/'}
              title={item.name}
              className={({ isActive }) =>
                [
                  'flex h-11 items-center justify-center rounded px-3 text-sm font-medium transition md:justify-start',
                  isActive
                    ? 'bg-teal-brand text-sidebar shadow-sm'
                    : 'text-slate-300 hover:bg-white/10 hover:text-white',
                ].join(' ')
              }
            >
              <Icon className="h-5 w-5 shrink-0" aria-hidden="true" />
              <span className="ml-3 hidden md:inline">{item.name}</span>
            </NavLink>
          )
        })}
      </nav>
    </aside>
  )
}

export default Sidebar
