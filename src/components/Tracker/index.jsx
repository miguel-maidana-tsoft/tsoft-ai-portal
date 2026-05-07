import { useEffect } from 'react'
import { useApp } from '../../context/AppContext'
import FaseTabs from './FaseTabs'
import FasePanel from './FasePanel'
import InfoCliente from './InfoCliente'
import Spinner from '../Spinner'

export default function Tracker({ onToast }) {
  const { currentCliente, currentFase, tareas, loadTareas, goToDashboard } = useApp()
  const loaded = tareas[currentCliente] !== undefined

  useEffect(() => {
    if (currentCliente) loadTareas(currentCliente)
  }, [currentCliente, loadTareas])

  return (
    <div>
      <div className="tracker-header">
        <button className="btn-back" onClick={goToDashboard}>
          ← Volver
        </button>
        <div className="tracker-title">{currentCliente}</div>
      </div>

      <FaseTabs />

      {!loaded ? (
        <Spinner text="Cargando tareas..." />
      ) : (
        <>
          <FasePanel onToast={onToast} />
          <div style={{ marginTop: 24 }}>
            <InfoCliente />
          </div>
        </>
      )}
    </div>
  )
}
