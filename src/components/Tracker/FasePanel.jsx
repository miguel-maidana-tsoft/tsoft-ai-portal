import { useState } from 'react'
import { useApp } from '../../context/AppContext'
import { FASES } from '../../constants'
import TareaItem from './TareaItem'

export default function FasePanel({ onToast }) {
  const { currentCliente, currentFase, tareas, agregarTarea } = useApp()
  const [nuevaTarea, setNuevaTarea] = useState('')

  const fase = FASES.find((f) => f.id === currentFase)
  const listaTareas = (tareas[currentCliente] || {})[currentFase] || []

  const completadas = listaTareas.filter((t) => t.estado === 'Completado').length
  const enCurso = listaTareas.filter((t) => t.estado === 'En curso').length
  const pendientes = listaTareas.filter((t) => t.estado === 'Pendiente').length

  async function handleAgregar() {
    const texto = nuevaTarea.trim()
    if (!texto) return
    await agregarTarea(texto, currentCliente, currentFase)
    setNuevaTarea('')
    onToast('Tarea agregada')
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter') handleAgregar()
  }

  return (
    <div className="fase-panel">
      <div className="fase-panel-header">
        <div>
          <div className="fase-panel-title">
            {fase.nombre} · {fase.periodo}
          </div>
          <div className="fase-panel-sub">{fase.subtitulo}</div>
        </div>
        <div className="fase-panel-stats">
          <span className="mini-badge mb-green">{completadas} ✓</span>
          <span className="mini-badge mb-yellow">{enCurso} ↻</span>
          <span className="mini-badge mb-gray">{pendientes} ·</span>
        </div>
      </div>

      <div className="tareas-list">
        {listaTareas.length === 0 ? (
          <div style={{ padding: '20px 22px', color: 'var(--muted)', fontSize: 13 }}>
            Sin tareas. Agregá la primera abajo.
          </div>
        ) : (
          listaTareas.map((t) => (
            <TareaItem
              key={t.id}
              tarea={t}
              cliente={currentCliente}
              faseId={currentFase}
              onToast={onToast}
            />
          ))
        )}
      </div>

      <div className="add-tarea-wrap">
        <input
          type="text"
          className="add-tarea-input"
          placeholder="Agregar nueva tarea..."
          value={nuevaTarea}
          onChange={(e) => setNuevaTarea(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button className="btn-add" onClick={handleAgregar}>
          + Agregar
        </button>
      </div>
    </div>
  )
}
