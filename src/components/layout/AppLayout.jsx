import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import DeadlineBanner from '../notes/DeadlineBanner'
import NoteDetailDrawer from '../notes/NoteDetailDrawer'
import Sidebar from './Sidebar'
import TopBar from './TopBar'

function AppLayout() {
  const [bannerNote, setBannerNote] = useState(null)

  return (
    <div className="flex min-h-screen bg-slate-100">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <TopBar />
        <DeadlineBanner onSelectNote={setBannerNote} />
        <main className="flex-1 px-4 py-6 md:px-8">
          <Outlet />
        </main>
      </div>

      {bannerNote ? (
        <NoteDetailDrawer
          note={bannerNote}
          onClose={() => setBannerNote(null)}
        />
      ) : null}
    </div>
  )
}

export default AppLayout
