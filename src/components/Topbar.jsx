import { useApp } from '../context/AppContext'
import { FASES } from '../constants'

export default function Topbar() {
  const { currentOla, currentFase } = useApp()
  const fase = FASES.find((f) => f.id === currentFase)

  return (
    <div className="topbar">
      <div className="topbar-brand">
        <div className="topbar-logo">
          TSOFT<span>▶</span>
        </div>
        <div className="topbar-divider" />
        <div className="topbar-subtitle">AI Program · Portal de Seguimiento</div>
      </div>
      <div className="topbar-meta">
        <span className="badge-ola">{currentOla.toUpperCase()}</span>
        {fase && (
          <span className="badge-fase">
            {fase.nombre} · {fase.periodo}
          </span>
        )}
      </div>
    </div>
  )
}
