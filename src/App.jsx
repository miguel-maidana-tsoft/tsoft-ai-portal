import { useApp } from './context/AppContext'
import { useToast } from './hooks/useToast'
import Topbar from './components/Topbar'
import Sidebar from './components/Sidebar'
import Dashboard from './components/Dashboard'
import Tracker from './components/Tracker'
import Toast from './components/Toast'
import './styles/global.css'

export default function App() {
  const { view } = useApp()
  const { message, visible, toast } = useToast()

  return (
    <>
      <Topbar />
      <div className="app-layout">
        <Sidebar />
        <main className="main">
          {view === 'dashboard' && <Dashboard />}
          {view === 'tracker' && <Tracker onToast={toast} />}
        </main>
      </div>
      <Toast message={message} visible={visible} />
    </>
  )
}
