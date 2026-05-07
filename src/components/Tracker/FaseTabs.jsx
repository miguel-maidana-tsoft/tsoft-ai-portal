import { useApp } from '../../context/AppContext'
import { FASES } from '../../constants'

function getFaseStatus(listaTareas) {
  if (!listaTareas || listaTareas.length === 0) return 'empty'
  const total = listaTareas.length
  const completadas = listaTareas.filter((t) => t.estado === 'Completado').length
  const enCurso = listaTareas.filter((t) => t.estado === 'En curso').length
  if (completadas === total) return 'done'
  if (completadas > 0 || enCurso > 0) return 'partial'
  return 'pending'
}

export default function FaseTabs() {
  const { currentFase, setCurrentFase, currentCliente, tareas } = useApp()
  const clienteTareas = tareas[currentCliente] || {}

  return (
    <div className="fase-tabs">
      {FASES.map((f) => {
        const status = getFaseStatus(clienteTareas[f.id])
        const isActive = f.id === currentFase
        return (
          <button
            key={f.id}
            className={`fase-tab ${isActive ? 'active' : ''} fase-tab--${status}`}
            onClick={() => setCurrentFase(f.id)}
          >
            {f.nombre} · {f.periodo}
            {status === 'done' && <span className="fase-tab-check">✓</span>}
            {status === 'partial' && <span className="fase-tab-dot partial" />}
          </button>
        )
      })}
    </div>
  )
}
