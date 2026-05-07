import { useApp } from '../context/AppContext'
import { FASES, PLATAFORMA_ID } from '../constants'

export default function Topbar({ onMenuToggle }) {
  const { currentOla, currentFase, view } = useApp()
  const fase = FASES.find((f) => f.id === currentFase)
  const isPlataforma = currentOla === PLATAFORMA_ID

  return (
    <div className="topbar">
      <div className="topbar-brand">
        <button className="hamburger" onClick={onMenuToggle} aria-label="Menú">
          <span /><span /><span />
        </button>
        <div className="topbar-logo">
          TSOFT<span>▶</span>
        </div>
        <div className="topbar-divider" />
        <div className="topbar-subtitle">AI Program · Portal de Seguimiento</div>
      </div>
      <div className="topbar-meta">
        {isPlataforma ? (
          <span className="badge-ola" style={{ background: 'var(--blue)' }}>PLATAFORMA</span>
        ) : (
          <span className="badge-ola">{currentOla.toUpperCase()}</span>
        )}
        {!isPlataforma && fase && view !== 'dashboard' && (
          <span className="badge-fase">
            {fase.nombre} · {fase.periodo}
          </span>
        )}
      </div>
    </div>
  )
}
