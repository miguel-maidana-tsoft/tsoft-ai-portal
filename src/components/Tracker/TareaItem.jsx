import { useApp } from '../../context/AppContext'
import { ESTADOS } from '../../constants'

export default function TareaItem({ tarea, cliente, faseId, onToast }) {
  const { actualizarEstado, eliminarTarea } = useApp()

  async function handleEstado(e) {
    const nuevoEstado = e.target.value
    await actualizarEstado(tarea.id, nuevoEstado, cliente, faseId)
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
      <select
        className={`estado-select ${estadoClass}`}
        value={tarea.estado}
        onChange={handleEstado}
      >
        {ESTADOS.map((e) => (
          <option key={e}>{e}</option>
        ))}
      </select>
      <button className="btn-delete" onClick={handleEliminar} title="Eliminar">
        ✕
      </button>
    </div>
  )
}
