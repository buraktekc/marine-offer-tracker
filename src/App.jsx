import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import AppLayout from './components/layout/AppLayout'
import Companies from './pages/Companies'
import Dashboard from './pages/Dashboard'
import Notes from './pages/Notes'
import Quotes from './pages/Quotes'
import Vessels from './pages/Vessels'

const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route element={<AppLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="/companies" element={<Companies />} />
            <Route path="/vessels" element={<Vessels />} />
            <Route path="/quotes" element={<Quotes />} />
            <Route path="/notes" element={<Notes />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  )
}

export default App
