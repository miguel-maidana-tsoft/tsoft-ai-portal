import { useApp } from '../context/AppContext'
import { OLAS } from '../constants'

export default function Sidebar() {
  const { view, currentCliente, openTracker, goToDashboard } = useApp()

  return (
    <nav className="sidebar">
      <div className="sidebar-section">
        <div className="sidebar-label">Navegación</div>
        <div
          className={`nav-item ${view === 'dashboard' ? 'active' : ''}`}
          onClick={goToDashboard}
        >
          <span className="dot" /> Dashboard
        </div>
      </div>

      <div className="sidebar-separator" />

      {OLAS.map((ola) => (
        <div className="sidebar-section" key={ola.id}>
          <div className="sidebar-label">{ola.label}</div>
          {ola.clientes.map((cliente) => (
            <div
              key={cliente}
              className={`nav-item ${view === 'tracker' && currentCliente === cliente ? 'active' : ''}`}
              onClick={() => openTracker(cliente)}
            >
              <span className="dot" /> {cliente}
            </div>
          ))}
        </div>
      ))}
    </nav>
  )
}
