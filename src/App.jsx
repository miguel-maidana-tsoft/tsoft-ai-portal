import { useState } from 'react'
import { useApp } from './context/AppContext'
import { useToast } from './hooks/useToast'
import Topbar from './components/Topbar'
import Sidebar from './components/Sidebar'
import Dashboard from './components/Dashboard'
import Tracker from './components/Tracker'
import Assessment from './components/Assessment'
import Tablero from './components/Tablero'
import Toast from './components/Toast'
import './styles/global.css'

export default function App() {
  const { view } = useApp()
  const { message, visible, toast } = useToast()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <>
      <Topbar onMenuToggle={() => setSidebarOpen((o) => !o)} />
      <div className="app-layout">
        <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <main className="main">
          {view === 'dashboard' && <Dashboard />}
          {(view === 'tracker' || view === 'plataforma') && <Tracker onToast={toast} />}
          {view === 'assessment' && <Assessment />}
          {view === 'tablero' && <Tablero />}
        </main>
      </div>
      <Toast message={message} visible={visible} />
    </>
  )
}
