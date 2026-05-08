import { Search } from 'lucide-react'

function TopBar() {
  return (
    <header className="flex min-h-16 items-center gap-3 border-b border-slate-200 bg-white px-4 md:px-8">
      <div className="relative min-w-0 max-w-xl flex-1">
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
    </header>
  )
}

export default TopBar
