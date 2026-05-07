import { useEffect } from 'react'
import { useApp } from '../../context/AppContext'
import { FASES, PLATAFORMA_ID } from '../../constants'
import FaseTabs from './FaseTabs'
import FasePanel from './FasePanel'
import InfoCliente from './InfoCliente'
import Spinner from '../Spinner'

export default function Tracker({ onToast }) {
  const { currentCliente, currentOla, currentFase, clientesInfo, tareas, loadTareas, goToDashboard } = useApp()
  const loaded = tareas[currentCliente] !== undefined
  const isPlataforma = currentOla === PLATAFORMA_ID

  const faseActualId = clientesInfo[currentCliente]?.faseActual
  const faseActual = FASES.find((f) => String(f.id) === String(faseActualId))

  useEffect(() => {
    if (currentCliente) loadTareas(currentCliente, currentOla)
  }, [currentCliente, loadTareas, currentOla])

  return (
    <div>
      <div className="tracker-header">
        <button className="btn-back" onClick={goToDashboard}>
          ← Volver
        </button>
        <div className="tracker-title-wrap">
          <div className="tracker-title">
            {isPlataforma ? 'Plataforma Agéntica TSOFT' : currentCliente}
          </div>
          {!isPlataforma && faseActual && (
            <span className="tracker-fase-actual">
              ★ Estamos aquí: {faseActual.nombre} · {faseActual.subtitulo}
            </span>
          )}
        </div>
      </div>

      <FaseTabs />

      {!loaded ? (
        <Spinner text="Cargando tareas..." />
      ) : (
        <>
          <FasePanel onToast={onToast} />
          {!isPlataforma && (
            <div style={{ marginTop: 24 }}>
              <InfoCliente />
            </div>
          )}
        </>
      )}
    </div>
  )
}
