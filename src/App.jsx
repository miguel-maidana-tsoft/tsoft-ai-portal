import { useState } from 'react'
import { useApp } from './context/AppContext'
import { useAuth } from './context/AuthContext'
import { useToast } from './hooks/useToast'
import Topbar from './components/Topbar'
import Sidebar from './components/Sidebar'
import Dashboard from './components/Dashboard'
import Tracker from './components/Tracker'
import Assessment from './components/Assessment'
import Tablero from './components/Tablero'
import Login from './components/Login'
import Toast from './components/Toast'
import './styles/global.css'

const VIEW_SECTION = {
  dashboard: 'dashboard',
  tablero: 'tablero',
  tracker: 'tracker',
  plataforma: 'plataforma',
  assessment: 'assessment',
}

export default function App() {
  const { view } = useApp()
  const { isAuthenticated, canAccess } = useAuth()
  const { message, visible, toast } = useToast()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  if (!isAuthenticated) {
    return (
      <>
        <Login />
        <Toast message={message} visible={visible} />
      </>
    )
  }

  const activeSection = VIEW_SECTION[view] || 'dashboard'
  const effectiveView = canAccess(activeSection) ? view : 'dashboard'

  return (
    <>
      <Topbar onMenuToggle={() => setSidebarOpen((o) => !o)} />
      <div className="app-layout">
        <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <main className="main">
          {effectiveView === 'dashboard' && <Dashboard />}
          {(effectiveView === 'tracker' || effectiveView === 'plataforma') && <Tracker onToast={toast} />}
          {effectiveView === 'assessment' && <Assessment />}
          {effectiveView === 'tablero' && <Tablero />}
        </main>
      </div>
      <Toast message={message} visible={visible} />
    </>
  )
}
