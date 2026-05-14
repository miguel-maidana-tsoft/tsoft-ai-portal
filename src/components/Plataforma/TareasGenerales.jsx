import { useEffect, useState } from 'react'
import { useApp } from '../../context/AppContext'

const ESTADOS = ['Pendiente', 'En curso', 'Bloqueado', 'Completado']

const ESTADO_SLUG = {
  'Pendiente':  'pendiente',
  'En curso':   'en-curso',
  'Bloqueado':  'bloqueado',
  'Completado': 'finalizado',
}

function TareaRow({ tarea, onEstado, onEliminar, onActualizar }) {
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({ texto: tarea.texto, descripcion: tarea.descripcion || '' })

  function openEdit() {
    setForm({ texto: tarea.texto, descripcion: tarea.descripcion || '' })
    setEditing(true)
  }

  const [saving, setSaving] = useState(false)

  async function handleGuardar() {
    setSaving(true)
    const updates = []
    if (form.texto !== tarea.texto) updates.push(onActualizar(tarea.id, 'texto', form.texto))
    if (form.descripcion !== (tarea.descripcion || '')) updates.push(onActualizar(tarea.id, 'descripcion', form.descripcion))
    await Promise.all(updates)
    setSaving(false)
    setEditing(false)
  }

  if (editing) {
    return (
      <div className="tt-edit-wrap">
        <input
          className="tt-input"
          value={form.texto}
          onChange={(e) => setForm((p) => ({ ...p, texto: e.target.value }))}
          placeholder="Ítem / Título *"
          autoFocus
        />
        <textarea
          className="tt-input tt-textarea"
          value={form.descripcion}
          onChange={(e) => setForm((p) => ({ ...p, descripcion: e.target.value }))}
          placeholder="Descripción"
          rows={2}
        />
        <div className="tt-actions">
          <button className="tt-btn-save" onClick={handleGuardar} disabled={saving || !form.texto.trim()}>
            {saving ? <><span className="tarea-spinner btn-spinner" /> Guardando...</> : 'Guardar'}
          </button>
          <button className="tt-btn-cancel" onClick={() => setEditing(false)} disabled={saving}>
            Cancelar
          </button>
        </div>
      </div>
    )
  }

  const slug = ESTADO_SLUG[tarea.estado] || 'pendiente'

  return (
    <div className={['tt-row', `tt-row--${slug}`, tarea._saving ? 'tt-row--saving' : ''].filter(Boolean).join(' ')}>
      <select
        className={`tt-estado-select tt-estado-select--${slug}`}
        value={tarea.estado}
        onChange={(e) => onEstado(tarea.id, e.target.value)}
      >
        {ESTADOS.map((op) => <option key={op}>{op}</option>)}
      </select>
      <div className="tt-body">
        <div className="tt-texto">{tarea.texto}</div>
        {tarea.descripcion && <div className="tt-detalle">{tarea.descripcion}</div>}
      </div>
      <div className="tt-meta">
        <button className="tt-btn-icon" onClick={openEdit} title="Editar">✎</button>
        <button className="tt-btn-icon tt-btn-del" onClick={() => onEliminar(tarea.id)} title="Eliminar">×</button>
      </div>
    </div>
  )
}

function AddTareaForm({ onAdd, onCancel }) {
  const [form, setForm] = useState({ texto: '', descripcion: '' })

  function handleSubmit(e) {
    e.preventDefault()
    if (!form.texto.trim()) return
    onAdd(form.texto.trim(), form.descripcion.trim())
    onCancel()
  }

  return (
    <form className="tt-add-form" onSubmit={handleSubmit}>
      <input
        className="tt-input"
        value={form.texto}
        onChange={(e) => setForm((p) => ({ ...p, texto: e.target.value }))}
        placeholder="Ítem / Título *"
        autoFocus
      />
      <textarea
        className="tt-input tt-textarea"
        value={form.descripcion}
        onChange={(e) => setForm((p) => ({ ...p, descripcion: e.target.value }))}
        placeholder="Descripción"
        rows={2}
      />
      <div className="tt-actions">
        <button className="tt-btn-save" type="submit" disabled={!form.texto.trim()}>
          Agregar tarea
        </button>
        <button className="tt-btn-cancel" type="button" onClick={onCancel}>
          Cancelar
        </button>
      </div>
    </form>
  )
}

export default function TareasGenerales() {
  const {
    plataformaTareas, loadPlataformaTareas,
    agregarPlataformaTarea, actualizarPlataformaTarea, eliminarPlataformaTarea,
  } = useApp()
  const [addOpen, setAddOpen] = useState(false)

  useEffect(() => {
    if (plataformaTareas === null) loadPlataformaTareas()
  }, [])

  if (plataformaTareas === null) {
    return (
      <div className="tablero-loading">
        <span className="tarea-spinner" /> Cargando tareas...
      </div>
    )
  }

  return (
    <div>
      <div className="pg-section-header">
        <span className="pg-section-count">
          {plataformaTareas.length} tarea{plataformaTareas.length !== 1 ? 's' : ''}
        </span>
        {!addOpen && (
          <button className="tablero-nuevo-bloque-btn" onClick={() => setAddOpen(true)}>
            + Agregar tarea
          </button>
        )}
      </div>

      <div className="tablero-bloque">
        {addOpen && (
          <AddTareaForm
            onAdd={agregarPlataformaTarea}
            onCancel={() => setAddOpen(false)}
          />
        )}
        {plataformaTareas.length === 0 && !addOpen ? (
          <div className="tablero-bloque-empty pg-empty">
            No hay tareas. Usá <strong>+ Agregar tarea</strong> para crear la primera.
          </div>
        ) : (
          plataformaTareas.map((t) => (
            <TareaRow
              key={t.id}
              tarea={t}
              onEstado={(id, estado) => actualizarPlataformaTarea(id, 'estado', estado)}
              onEliminar={eliminarPlataformaTarea}
              onActualizar={actualizarPlataformaTarea}
            />
          ))
        )}
      </div>
    </div>
  )
}
