import { useAuth } from '../context/AuthContext'

export default function Topbar({ onMenuToggle }) {
  const { user } = useAuth()
  const initial = user?.nombre ? user.nombre.charAt(0).toUpperCase() : '?'

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
        {user && (
          <div className="topbar-user">
            <span className="topbar-user-avatar">{initial}</span>
            <span className="topbar-user-name">{user.nombre.split(' ')[0]}</span>
          </div>
        )}
      </div>
    </div>
  )
}
