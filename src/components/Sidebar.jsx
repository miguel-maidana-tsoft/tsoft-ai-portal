import { useState } from 'react'
import { useApp } from '../context/AppContext'
import { useAuth, ROL_LABELS } from '../context/AuthContext'
import { OLAS, FASES, PLATAFORMA_ID, TABLERO_ID } from '../constants'
import CambiarPassword from './CambiarPassword'

export default function Sidebar({ open, onClose }) {
  const { view, currentCliente, currentOla, clientesInfo, openTracker, openPlataforma, openTablero, openOla, openTableroGeneral, openAssessment, goToDashboard } = useApp()
  const { user, logout, canAccess } = useAuth()
  const [showCambiarPass, setShowCambiarPass] = useState(false)
  const [collapsedOlas, setCollapsedOlas] = useState({})

  const initial = user?.nombre ? user.nombre.charAt(0).toUpperCase() : '?'
  const rolLabel = user ? (ROL_LABELS[user.rol] || user.rol) : ''

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

  function handleOlaClick(olaId) {
    openOla(olaId)
    onClose?.()
  }

  function handleAssessmentClick() {
    openAssessment()
    onClose?.()
  }

  function handleLogout() {
    onClose?.()
    logout()
  }

  const showOlas = canAccess('tracker')
  const showTablero = canAccess('tablero')
  const showTableroGeneral = canAccess('tablero')
  const showPlataforma = canAccess('plataforma')
  const showAssessment = canAccess('assessment')
  const showInternoSection = showPlataforma || showAssessment

  return (
    <>
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
          {showTableroGeneral && (
            <div
              className={`nav-item ${view === 'tablero-general' ? 'active' : ''}`}
              onClick={() => { openTableroGeneral(); onClose?.() }}
            >
              <span className="dot" /> Tablero General
            </div>
          )}
        </div>

        {showOlas && (
          <>
            <div className="sidebar-separator" />
            {OLAS.map((ola) => {
              const isCollapsed = !!collapsedOlas[ola.id]
              return (
                <div className="sidebar-section" key={ola.id}>
                  <div
                    className="sidebar-label sidebar-label--collapsible"
                    onClick={() => setCollapsedOlas((p) => ({ ...p, [ola.id]: !p[ola.id] }))}
                  >
                    {ola.label}
                    <span className={`sidebar-chevron ${isCollapsed ? 'sidebar-chevron--closed' : ''}`}>▾</span>
                  </div>
                  {!isCollapsed && (
                    <>
                      {showTablero && (
                        <div
                          className={`nav-item ${view === 'ola' && currentOla === ola.id ? 'active' : ''}`}
                          onClick={() => handleOlaClick(ola.id)}
                        >
                          <span className="dot" /> Tablero de Seguimiento
                        </div>
                      )}
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
                    </>
                  )}
                </div>
              )
            })}
          </>
        )}

        {showInternoSection && (
          <>
            <div className="sidebar-separator" />
            <div className="sidebar-section">
              <div className="sidebar-label">Interno TSOFT</div>
              {showPlataforma && (
                <div
                  className={`nav-item ${view === 'plataforma' ? 'active' : ''}`}
                  onClick={handlePlataformaClick}
                >
                  <span className="dot" /> Plataforma
                </div>
              )}
              {showAssessment && (
                <div
                  className={`nav-item ${view === 'assessment' ? 'active' : ''}`}
                  onClick={handleAssessmentClick}
                >
                  <span className="dot" /> Assessment
                </div>
              )}
            </div>
          </>
        )}

        <div className="sidebar-separator" />

        <div className="sidebar-user">
          <div className="sidebar-user-info">
            <div className="sidebar-user-avatar">{initial}</div>
            <div className="sidebar-user-details">
              <div className="sidebar-user-nombre">{user?.nombre}</div>
              <div className="sidebar-user-rol">{rolLabel}</div>
            </div>
          </div>
          <button className="sidebar-cambiar-pass-btn" onClick={() => setShowCambiarPass(true)}>
            Cambiar contraseña
          </button>
          <button className="sidebar-logout-btn" onClick={handleLogout}>
            Cerrar sesión
          </button>
        </div>
      </nav>
      {showCambiarPass && (
        <CambiarPassword onClose={() => setShowCambiarPass(false)} />
      )}
    </>
  )
}
