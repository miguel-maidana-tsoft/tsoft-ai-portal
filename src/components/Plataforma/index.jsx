import { useState } from 'react'
import TareasGenerales from './TareasGenerales'
import Seguimiento from './Seguimiento'

export default function Plataforma({ onToast }) {
  const [tab, setTab] = useState('tareas')

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Plataforma Agéntica</div>
          <div className="page-subtitle">Gestión interna del equipo TSOFT</div>
        </div>
      </div>

      <div className="fase-tabs plataforma-tabs">
        <button
          className={`fase-tab ${tab === 'tareas' ? 'active' : ''}`}
          onClick={() => setTab('tareas')}
        >
          Tareas Generales
        </button>
        <button
          className={`fase-tab ${tab === 'seguimiento' ? 'active' : ''}`}
          onClick={() => setTab('seguimiento')}
        >
          Seguimiento
        </button>
      </div>

      {tab === 'tareas' && <TareasGenerales />}
      {tab === 'seguimiento' && <Seguimiento />}
    </div>
  )
}
