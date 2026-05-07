import { useApp } from '../../context/AppContext'
import { FASES } from '../../constants'

export default function FaseTabs() {
  const { currentFase, setCurrentFase } = useApp()

  return (
    <div className="fase-tabs">
      {FASES.map((f) => (
        <button
          key={f.id}
          className={`fase-tab ${f.id === currentFase ? 'active' : ''} ${f.id === 1 ? 'current-badge' : ''}`}
          onClick={() => setCurrentFase(f.id)}
        >
          {f.nombre} · {f.periodo}
        </button>
      ))}
    </div>
  )
}
