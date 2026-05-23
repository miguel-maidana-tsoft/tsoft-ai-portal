import { useEffect, useRef, useState } from 'react'
import { useApp } from '../../context/AppContext'
import Spinner from '../Spinner'


const ESTADOS = ['Pendiente', 'En curso', 'Bloqueado', 'Completado']

const ESTADO_SLUG = {
  'Pendiente':  'pendiente',
  'En curso':   'en-curso',
  'Bloqueado':  'bloqueado',
  'Completado': 'completado',
}

// ── Fila de tarea ────────────────────────────────────────────
function TareaRow({ tarea, onEstado, onActualizar, onEliminar, dragHandlers, isDragOver, isDragging }) {
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({ texto: tarea.texto, descripcion: tarea.descripcion || '' })
  const [saving, setSaving] = useState(false)
  const inputRef = useRef(null)

  useEffect(() => { if (editing) inputRef.current?.focus() }, [editing])

  function handleOpen() {
    setForm({ texto: tarea.texto, descripcion: tarea.descripcion || '' })
    setEditing(true)
  }

  async function handleGuardar() {
    if (!form.texto.trim()) return
    setSaving(true)
    const cambios = [
      form.texto !== tarea.texto       && onActualizar(tarea.id, 'texto',       form.texto.trim()),
      form.descripcion !== tarea.descripcion && onActualizar(tarea.id, 'descripcion', form.descripcion),
    ].filter(Boolean)
    await Promise.all(cambios)
    setSaving(false)
    setEditing(false)
  }

  const slug = ESTADO_SLUG[tarea.estado] || 'pendiente'

  if (editing) {
    return (
      <div className="tg-edit-wrap">
        <input
          ref={inputRef}
          className="tt-input"
          value={form.texto}
          onChange={(e) => setForm((p) => ({ ...p, texto: e.target.value }))}
          placeholder="Título *"
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
          <button className="tt-btn-cancel" onClick={() => setEditing(false)} disabled={saving}>Cancelar</button>
        </div>
      </div>
    )
  }

  return (
    <div
      className={[
        'tg-row',
        `tg-row--${slug}`,
        tarea._saving ? 'tg-row--saving'    : '',
        isDragOver    ? 'tg-row--drag-over' : '',
        isDragging    ? 'tg-row--dragging'  : '',
      ].filter(Boolean).join(' ')}
      draggable
      onDragStart={dragHandlers.onDragStart}
      onDragOver={dragHandlers.onDragOver}
      onDrop={dragHandlers.onDrop}
      onDragEnd={dragHandlers.onDragEnd}
    >
      <span className="tt-drag-handle" title="Arrastrar para reordenar">⠿</span>
      <select
        className={`tt-estado-select tt-estado-select--${slug}`}
        value={tarea.estado}
        onChange={(e) => onEstado(tarea.id, e.target.value)}
      >
        {ESTADOS.map((op) => <option key={op}>{op}</option>)}
      </select>
      <div className="tg-body">
        <div className="tg-texto">{tarea.texto}</div>
        {tarea.descripcion && <div className="tg-descripcion">{tarea.descripcion}</div>}
      </div>
      <div className="tg-actions">
        {tarea.fecha_creacion && (
          <span className="tg-fecha">
            {new Date(tarea.fecha_creacion).toLocaleDateString('es-AR', { day: '2-digit', month: 'short', year: 'numeric' })}
          </span>
        )}
        <button className="tt-btn-icon" onClick={handleOpen} title="Editar">✎</button>
        <button className="tt-btn-icon tt-btn-del" onClick={() => onEliminar(tarea.id)} title="Eliminar">×</button>
      </div>
    </div>
  )
}

// ── Formulario de nueva tarea ────────────────────────────────
function AddForm({ onAdd, onCancel }) {
  const [form, setForm] = useState({ texto: '', descripcion: '' })
  const inputRef = useRef(null)
  useEffect(() => { inputRef.current?.focus() }, [])

  function handleSubmit(e) {
    e.preventDefault()
    if (!form.texto.trim()) return
    onAdd(form.texto.trim(), form.descripcion.trim())
    onCancel()
  }

  return (
    <form className="tg-add-form" onSubmit={handleSubmit}>
      <input
        ref={inputRef}
        className="tt-input"
        value={form.texto}
        onChange={(e) => setForm((p) => ({ ...p, texto: e.target.value }))}
        placeholder="Título *"
      />
      <textarea
        className="tt-input tt-textarea"
        value={form.descripcion}
        onChange={(e) => setForm((p) => ({ ...p, descripcion: e.target.value }))}
        placeholder="Descripción (opcional)"
        rows={2}
      />
      <div className="tt-actions">
        <button className="tt-btn-save" type="submit" disabled={!form.texto.trim()}>Agregar tarea</button>
        <button className="tt-btn-cancel" type="button" onClick={onCancel}>Cancelar</button>
      </div>
    </form>
  )
}

// ── Tablero General PM ───────────────────────────────────────
export default function TableroGeneral() {
  const { tareasGenerales, loadTareasGenerales, agregarTareaGeneral, actualizarTareaGeneral, eliminarTareaGeneral, reordenarTareasGenerales } = useApp()
  const [addOpen, setAddOpen] = useState(false)
  const [dragOverId, setDragOverId] = useState(null)
  const dragId = useRef(null)

  function handleDragStart(id) { dragId.current = id }
  function handleDragOver(e, id) { e.preventDefault(); if (dragId.current !== id) setDragOverId(id) }
  function handleDrop(e, targetId) {
    e.preventDefault()
    const sourceId = dragId.current
    if (!sourceId || sourceId === targetId) { setDragOverId(null); return }
    const list = [...(tareasGenerales || [])]
    const fromIdx = list.findIndex((t) => t.id === sourceId)
    const toIdx   = list.findIndex((t) => t.id === targetId)
    const [moved] = list.splice(fromIdx, 1)
    list.splice(toIdx, 0, moved)
    reordenarTareasGenerales(list.map((t) => t.id))
    dragId.current = null
    setDragOverId(null)
  }
  function handleDragEnd() { dragId.current = null; setDragOverId(null) }

  useEffect(() => {
    if (tareasGenerales === null) loadTareasGenerales()
  }, [])

  const pendientes  = (tareasGenerales || []).filter((t) => t.estado === 'Pendiente').length
  const enCurso     = (tareasGenerales || []).filter((t) => t.estado === 'En curso').length
  const completadas = (tareasGenerales || []).filter((t) => t.estado === 'Completado').length

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Tablero General</div>
          <div className="page-subtitle">Tareas generales del programa · PM</div>
        </div>
        <button className="tg-nueva-btn" onClick={() => setAddOpen((o) => !o)}>
          {addOpen ? '− Cancelar' : '+ Nueva tarea'}
        </button>
      </div>

      {tareasGenerales !== null && tareasGenerales.length > 0 && (
        <div className="tg-kpis">
          <span className="tg-kpi"><span className="tg-kpi-num">{pendientes}</span> Pendientes</span>
          <span className="tg-kpi tg-kpi--curso"><span className="tg-kpi-num">{enCurso}</span> En curso</span>
          <span className="tg-kpi tg-kpi--done"><span className="tg-kpi-num">{completadas}</span> Completadas</span>
        </div>
      )}

      <div className="tg-wrap">
        {addOpen && (
          <AddForm
            onAdd={agregarTareaGeneral}
            onCancel={() => setAddOpen(false)}
          />
        )}

        {tareasGenerales === null ? (
          <Spinner />
        ) : tareasGenerales.length === 0 && !addOpen ? (
          <div className="tg-empty">
            Sin tareas todavía. Usá <strong>+ Nueva tarea</strong> para agregar.
          </div>
        ) : (
          <div className="tg-list">
            {tareasGenerales.map((t) => (
              <TareaRow
                key={t.id}
                tarea={t}
                onEstado={(id, estado) => actualizarTareaGeneral(id, 'estado', estado)}
                onActualizar={actualizarTareaGeneral}
                onEliminar={eliminarTareaGeneral}
                isDragOver={dragOverId === t.id}
                isDragging={dragId.current === t.id}
                dragHandlers={{
                  onDragStart: () => handleDragStart(t.id),
                  onDragOver:  (e) => handleDragOver(e, t.id),
                  onDrop:      (e) => handleDrop(e, t.id),
                  onDragEnd:   handleDragEnd,
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
