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
import OlaView from './components/OlaView'
import TableroGeneral from './components/TableroGeneral'
import Plataforma from './components/Plataforma'
import Login from './components/Login'
import CambiarPassword from './components/CambiarPassword'
import Toast from './components/Toast'
import './styles/global.css'

const VIEW_SECTION = {
  dashboard: 'dashboard',
  tablero: 'tablero',
  ola: 'tablero',
  'tablero-general': 'tablero',
  tracker: 'tracker',
  plataforma: 'plataforma',
  assessment: 'assessment',
}

export default function App() {
  const { view } = useApp()
  const { isAuthenticated, canAccess, requirePasswordChange } = useAuth()
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

  if (requirePasswordChange) {
    return <CambiarPassword forced />
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
          {effectiveView === 'tracker' && <Tracker onToast={toast} />}
          {effectiveView === 'plataforma' && <Plataforma onToast={toast} />}
          {effectiveView === 'assessment' && <Assessment />}
          {effectiveView === 'tablero' && <Tablero />}
          {effectiveView === 'ola' && <OlaView />}
          {effectiveView === 'tablero-general' && <TableroGeneral />}
        </main>
      </div>
      <Toast message={message} visible={visible} />
    </>
  )
}
