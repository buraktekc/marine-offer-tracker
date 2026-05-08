import { LogOut, Search } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'

function TopBar({ user }) {
  const navigate = useNavigate()
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  async function handleLogout() {
    setIsLoggingOut(true)
    await supabase.auth.signOut()
    navigate('/login', { replace: true })
  }

  return (
    <header className="flex min-h-16 items-center gap-3 border-b border-slate-200 bg-white px-4 md:px-8">
      <div className="relative max-w-xl flex-1">
        <Search
          className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
          aria-hidden="true"
        />
        <input
          className="h-10 w-full rounded border border-slate-200 bg-slate-50 pl-9 pr-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-teal-brand focus:bg-white focus:ring-2 focus:ring-teal-brand/20"
          placeholder="Search offers, companies, vessels"
          type="search"
        />
      </div>

      <div className="hidden min-w-0 text-right text-sm text-slate-600 sm:block">
        <span className="block max-w-[220px] truncate">{user?.email}</span>
      </div>

      <button
        type="button"
        onClick={handleLogout}
        disabled={isLoggingOut}
        className="inline-flex h-10 items-center gap-2 rounded bg-purple-brand px-3 text-sm font-semibold text-white transition hover:bg-purple-brand/90 disabled:cursor-not-allowed disabled:opacity-70"
      >
        <LogOut className="h-4 w-4" aria-hidden="true" />
        <span className="hidden sm:inline">
          {isLoggingOut ? 'Logging out' : 'Logout'}
        </span>
      </button>
    </header>
  )
}

export default TopBar
