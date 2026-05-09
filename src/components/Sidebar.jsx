import { useApp } from '../context/AppContext'
import { OLAS, FASES, PLATAFORMA_ID, TABLERO_ID } from '../constants'

export default function Sidebar({ open, onClose }) {
  const { view, currentCliente, clientesInfo, openTracker, openPlataforma, openTablero, openAssessment, goToDashboard } = useApp()

  function getFaseLabel(cliente) {
    const fa = clientesInfo[cliente]?.faseActual
    if (!fa) return null
    const fase = FASES.find((f) => String(f.id) === String(fa))
    return fase ? fase.nombre : null
  }

  function handleClienteClick(cliente, olaId) {
    openTracker(cliente, olaId)
    onClose?.()
  }

  function handleDashboardClick() {
    goToDashboard()
    onClose?.()
  }

  function handlePlataformaClick() {
    openPlataforma()
    onClose?.()
  }

  function handleTableroClick() {
    openTablero()
    onClose?.()
  }

  function handleAssessmentClick() {
    openAssessment()
    onClose?.()
  }

  return (
    <>
      {/* Overlay para móvil */}
      {open && <div className="sidebar-overlay" onClick={onClose} />}

      <nav className={`sidebar ${open ? 'sidebar-open' : ''}`}>
        <div className="sidebar-section">
          <div className="sidebar-label">Navegación</div>
          <div
            className={`nav-item ${view === 'dashboard' ? 'active' : ''}`}
            onClick={handleDashboardClick}
          >
            <span className="dot" /> Dashboard
          </div>
          <div
            className={`nav-item ${view === 'tablero' ? 'active' : ''}`}
            onClick={handleTableroClick}
          >
            <span className="dot" /> Tablero General
          </div>
        </div>

        <div className="sidebar-separator" />

        {OLAS.filter((o) => o.clientes.length > 0).map((ola) => (
          <div className="sidebar-section" key={ola.id}>
            <div className="sidebar-label">{ola.label}</div>
            {ola.clientes.map((cliente) => {
              const faseLabel = getFaseLabel(cliente)
              const isActive = view === 'tracker' && currentCliente === cliente
              return (
                <div
                  key={cliente}
                  className={`nav-item ${isActive ? 'active' : ''}`}
                  onClick={() => handleClienteClick(cliente, ola.id)}
                >
                  <span className="dot" />
                  <span className="nav-item-text">{cliente}</span>
                  {faseLabel && (
                    <span className="nav-fase-badge">{faseLabel}</span>
                  )}
                </div>
              )
            })}
          </div>
        ))}

        <div className="sidebar-separator" />

        <div className="sidebar-section">
          <div className="sidebar-label">Interno TSOFT</div>
          <div
            className={`nav-item ${view === 'plataforma' ? 'active' : ''}`}
            onClick={handlePlataformaClick}
          >
            <span className="dot" /> Plataforma
          </div>
          <div
            className={`nav-item ${view === 'assessment' ? 'active' : ''}`}
            onClick={handleAssessmentClick}
          >
            <span className="dot" /> Assessment
          </div>
        </div>
      </nav>
    </>
  )
}
