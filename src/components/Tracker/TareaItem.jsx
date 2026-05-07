import { useState } from 'react'
import { useApp } from '../../context/AppContext'
import { ESTADOS } from '../../constants'

export default function TareaItem({ tarea, cliente, faseId, onToast }) {
  const { actualizarEstado, eliminarTarea } = useApp()
  const [saving, setSaving] = useState(false)

  async function handleEstado(e) {
    const nuevoEstado = e.target.value
    setSaving(true)
    await actualizarEstado(tarea.id, nuevoEstado, cliente, faseId)
    setSaving(false)
    onToast('Estado actualizado')
  }

  async function handleEliminar() {
    if (!confirm('¿Eliminar esta tarea?')) return
    await eliminarTarea(tarea.id, cliente, faseId)
    onToast('Tarea eliminada')
  }

  const estadoClass = tarea.estado.replace(' ', '-')

  return (
    <div className="tarea-row">
      <div className={`tarea-texto ${tarea.estado === 'Completado' ? 'done' : ''}`}>
        {tarea.texto}
      </div>
      <div className="tarea-estado-wrap">
        {saving && <span className="tarea-spinner" />}
        <select
          className={`estado-select ${estadoClass}`}
          value={tarea.estado}
          onChange={handleEstado}
          disabled={saving}
          style={{ opacity: saving ? 0.5 : 1 }}
        >
          {ESTADOS.map((e) => (
            <option key={e}>{e}</option>
          ))}
        </select>
      </div>
      <button className="btn-delete" onClick={handleEliminar} title="Eliminar">
        ✕
      </button>
    </div>
  )
}
