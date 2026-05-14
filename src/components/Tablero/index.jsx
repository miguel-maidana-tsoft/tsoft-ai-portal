import { useEffect, useRef, useState } from 'react'
import { useApp } from '../../context/AppContext'
import { RESPONSABLES_TABLERO } from '../../constants'

const ESTADOS_TABLERO = ['Pendiente', 'En curso', 'Finalizado', 'Bloqueado']

// ── Fila de tarea ────────────────────────────────────────────────
function TareaRow({ tarea, onEstado, onEliminar, onActualizar, dragHandlers, isDragOver, isDragging }) {
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({ ...tarea })
  const [pendingFinalizado, setPendingFinalizado] = useState(false)
  const [notaCierre, setNotaCierre] = useState('')
  const [savingCierre, setSavingCierre] = useState(false)

  function handleEstadoChange(e) {
    const nuevo = e.target.value
    if (nuevo === 'Finalizado') {
      setPendingFinalizado(true)
      setNotaCierre('')
    } else {
      onEstado(tarea.id, nuevo)
    }
  }

  async function confirmarFinalizado() {
    if (!notaCierre.trim()) return
    setSavingCierre(true)
    await Promise.all([
      onEstado(tarea.id, 'Finalizado'),
      onActualizar(tarea.id, 'notas', notaCierre.trim()),
    ])
    setSavingCierre(false)
    setPendingFinalizado(false)
  }

  function cancelarFinalizado() {
    setPendingFinalizado(false)
    setNotaCierre('')
  }

  function openEdit() {
    setForm({ ...tarea })
    setEditing(true)
  }

  const [saving, setSaving] = useState(false)

  async function handleGuardar() {
    setSaving(true)
    const campos = ['texto', 'detalle', 'semana', 'responsable', 'notas']
    await Promise.all(
      campos
        .filter((c) => form[c] !== tarea[c])
        .map((c) => onActualizar(tarea.id, c, form[c]))
    )
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
          placeholder="Tarea *"
          autoFocus
        />
        <textarea
          className="tt-input tt-textarea"
          value={form.detalle}
          onChange={(e) => setForm((p) => ({ ...p, detalle: e.target.value }))}
          placeholder="Detalle / Criterio de éxito"
          rows={2}
        />
        <div className="tt-edit-row">
          <input
            className="tt-input tt-short"
            value={form.semana}
            onChange={(e) => setForm((p) => ({ ...p, semana: e.target.value }))}
            placeholder="Semana (ej: Sem 1-2)"
          />
          <select
            className="tt-input tt-select"
            value={form.responsable}
            onChange={(e) => setForm((p) => ({ ...p, responsable: e.target.value }))}
          >
            <option value="">— Responsable —</option>
            {RESPONSABLES_TABLERO.map((r) => <option key={r}>{r}</option>)}
          </select>
        </div>
        <textarea
          className="tt-input tt-textarea"
          value={form.notas}
          onChange={(e) => setForm((p) => ({ ...p, notas: e.target.value }))}
          placeholder="Notas adicionales"
          rows={1}
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

  const estadoVisible = pendingFinalizado ? 'Finalizado' : tarea.estado
  const estadoSlug = estadoVisible?.toLowerCase().replace(' ', '-') ?? 'pendiente'

  return (
    <div
      className={[
        'tt-row',
        `tt-row--${estadoSlug}`,
        isDragOver    ? 'tt-row--drag-over'  : '',
        isDragging    ? 'tt-row--dragging'   : '',
        tarea._saving ? 'tt-row--saving'     : '',
      ].filter(Boolean).join(' ')}
      draggable
      onDragStart={dragHandlers.onDragStart}
      onDragOver={dragHandlers.onDragOver}
      onDrop={dragHandlers.onDrop}
      onDragEnd={dragHandlers.onDragEnd}
    >
      <span className="tt-drag-handle" title="Arrastrar para reordenar">⠿</span>
      <select
        className={`tt-estado-select tt-estado-select--${estadoSlug}`}
        value={estadoVisible}
        onChange={handleEstadoChange}
      >
        {ESTADOS_TABLERO.map((op) => <option key={op}>{op}</option>)}
      </select>
      <div className="tt-body">
        <div className="tt-texto">{tarea.texto}</div>
        {tarea.detalle && <div className="tt-detalle">{tarea.detalle}</div>}
        {tarea.notas && <div className="tt-notas">{tarea.notas}</div>}
        {pendingFinalizado && (
          <div className="tt-cierre-form">
            <textarea
              className="tt-input tt-textarea tt-cierre-nota"
              value={notaCierre}
              onChange={(e) => setNotaCierre(e.target.value)}
              placeholder="¿Qué se logró? Dejá un comentario de cierre (obligatorio)..."
              rows={2}
              autoFocus
            />
            <div className="tt-actions">
              <button
                className="tt-btn-save"
                onClick={confirmarFinalizado}
                disabled={!notaCierre.trim() || savingCierre}
              >
                {savingCierre
                  ? <><span className="tarea-spinner btn-spinner" /> Guardando...</>
                  : 'Confirmar cierre'
                }
              </button>
              <button className="tt-btn-cancel" onClick={cancelarFinalizado} disabled={savingCierre}>
                Cancelar
              </button>
            </div>
          </div>
        )}
      </div>
      <div className="tt-meta">
        {tarea.semana && <span className="tt-badge tt-badge--semana">{tarea.semana}</span>}
        {tarea.responsable && <span className="tt-badge tt-badge--resp">{tarea.responsable}</span>}
        <button className="tt-btn-icon" onClick={openEdit} title="Editar">✎</button>
        <button className="tt-btn-icon tt-btn-del" onClick={() => onEliminar(tarea.id)} title="Eliminar">×</button>
      </div>
    </div>
  )
}

// ── Formulario de nueva tarea ────────────────────────────────────
function AddTareaForm({ bloque, onAdd, onCancel }) {
  const [form, setForm] = useState({ texto: '', detalle: '', semana: '', responsable: '' })

  function handleSubmit(e) {
    e.preventDefault()
    if (!form.texto.trim()) return
    onAdd(bloque, form.texto.trim(), form.detalle, form.semana, form.responsable)
    onCancel()
  }

  return (
    <form className="tt-add-form" onSubmit={handleSubmit}>
      <input
        className="tt-input"
        value={form.texto}
        onChange={(e) => setForm((p) => ({ ...p, texto: e.target.value }))}
        placeholder="Tarea *"
        autoFocus
      />
      <textarea
        className="tt-input tt-textarea"
        value={form.detalle}
        onChange={(e) => setForm((p) => ({ ...p, detalle: e.target.value }))}
        placeholder="Detalle / Criterio de éxito"
        rows={2}
      />
      <div className="tt-edit-row">
        <input
          className="tt-input tt-short"
          value={form.semana}
          onChange={(e) => setForm((p) => ({ ...p, semana: e.target.value }))}
          placeholder="Semana (ej: Sem 1)"
        />
        <select
          className="tt-input tt-select"
          value={form.responsable}
          onChange={(e) => setForm((p) => ({ ...p, responsable: e.target.value }))}
        >
          <option value="">— Responsable —</option>
          {RESPONSABLES_TABLERO.map((r) => <option key={r}>{r}</option>)}
        </select>
      </div>
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

// ── Sección de bloque ────────────────────────────────────────────
function BloqueSection({ bloque, tareas, onEstado, onEliminar, onActualizar, onAdd, onReordenar, defaultOpen }) {
  const [addOpen, setAddOpen] = useState(defaultOpen || false)
  const [collapsed, setCollapsed] = useState(false)
  const [dragOverId, setDragOverId] = useState(null)
  const dragId = useRef(null)

  const finalizadas = tareas.filter((t) => t.estado === 'Finalizado').length
  const todasFinalizadas = tareas.length > 0 && finalizadas === tareas.length

  function handleDragStart(id) {
    dragId.current = id
  }

  function handleDragOver(e, id) {
    e.preventDefault()
    if (dragId.current !== id) setDragOverId(id)
  }

  function handleDrop(e, targetId) {
    e.preventDefault()
    const sourceId = dragId.current
    if (!sourceId || sourceId === targetId) {
      setDragOverId(null)
      return
    }
    const list = [...tareas]
    const fromIdx = list.findIndex((t) => t.id === sourceId)
    const toIdx   = list.findIndex((t) => t.id === targetId)
    const [moved] = list.splice(fromIdx, 1)
    list.splice(toIdx, 0, moved)
    onReordenar(bloque, list.map((t) => t.id))
    dragId.current = null
    setDragOverId(null)
  }

  function handleDragEnd() {
    dragId.current = null
    setDragOverId(null)
  }

  return (
    <div className={`tablero-bloque ${collapsed ? 'tablero-bloque--collapsed' : ''}`}>
      <div
        className={`tablero-bloque-header ${todasFinalizadas ? 'tablero-bloque-header--done' : ''}`}
        onClick={() => setCollapsed((c) => !c)}
        style={{ cursor: 'pointer' }}
      >
        <span className={`tablero-bloque-chevron ${collapsed ? 'tablero-bloque-chevron--closed' : ''}`}>▾</span>
        <span className="tablero-bloque-name">{bloque}</span>
        <span className="tablero-bloque-count">{finalizadas}/{tareas.length}</span>
        {!collapsed && (
          <button
            className={`tablero-bloque-add-btn ${addOpen ? 'active' : ''}`}
            onClick={(e) => { e.stopPropagation(); setAddOpen((o) => !o) }}
          >
            {addOpen ? '− Cerrar' : '+ Tarea'}
          </button>
        )}
      </div>

      {!collapsed && (
        <div className="tablero-bloque-body">
          {tareas.map((t) => (
            <TareaRow
              key={t.id}
              tarea={t}
              onEstado={onEstado}
              onEliminar={onEliminar}
              onActualizar={onActualizar}
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
          {addOpen && (
            <AddTareaForm
              bloque={bloque}
              onAdd={async (...args) => {
                await onAdd(...args)
                setAddOpen(false)
              }}
              onCancel={() => setAddOpen(false)}
            />
          )}
          {tareas.length === 0 && !addOpen && (
            <div className="tablero-bloque-empty">Sin tareas — usá "+ Tarea" para agregar.</div>
          )}
        </div>
      )}
    </div>
  )
}

// ── Tablero principal ────────────────────────────────────────────
export default function Tablero({ hideHeader = false }) {
  const {
    tablero, loadTablero,
    agregarTableroTarea, actualizarTableroTarea, eliminarTableroTarea, reordenarTableroBloque,
  } = useApp()
  const [addingBloque, setAddingBloque] = useState(false)
  const [nuevoBloque, setNuevoBloque] = useState('')
  const [bloquesNuevos, setBloquesNuevos] = useState([])

  useEffect(() => {
    if (tablero === null) loadTablero()
  }, [])

  function handleNuevoBloque(e) {
    e.preventDefault()
    const nombre = nuevoBloque.trim()
    if (!nombre) return
    setBloquesNuevos((prev) => [...prev, nombre])
    setNuevoBloque('')
    setAddingBloque(false)
  }

  const loading = tablero === null

  const grupoMap = {}
  ;(tablero || []).forEach((t) => {
    if (!grupoMap[t.bloque]) grupoMap[t.bloque] = []
    grupoMap[t.bloque].push(t)
  })

  const bloquesVacios = bloquesNuevos.filter((b) => !grupoMap[b])
  const todosLosBloques = [...Object.keys(grupoMap), ...bloquesVacios]

  return (
    <div className="tablero-wrap">
      <div className="tablero-header">
        {!hideHeader && (
          <div>
            <div className="tablero-title">Tablero General</div>
            <div className="tablero-subtitle">Tareas transversales del programa</div>
          </div>
        )}
        <div className="tablero-header-actions">
          {addingBloque ? (
            <form className="nuevo-bloque-form" onSubmit={handleNuevoBloque}>
              <input
                className="tt-input nuevo-bloque-input"
                value={nuevoBloque}
                onChange={(e) => setNuevoBloque(e.target.value)}
                placeholder="Nombre del bloque..."
                autoFocus
              />
              <button className="tt-btn-save" type="submit">Crear</button>
              <button className="tt-btn-cancel" type="button" onClick={() => setAddingBloque(false)}>×</button>
            </form>
          ) : (
            <button className="tablero-nuevo-bloque-btn" onClick={() => setAddingBloque(true)}>
              + Nuevo bloque
            </button>
          )}
        </div>
      </div>

      {loading ? (
        <div className="tablero-loading">
          <span className="tarea-spinner" /> Cargando tablero...
        </div>
      ) : todosLosBloques.length === 0 ? (
        <div className="tablero-empty">
          No hay bloques todavía. Creá uno con <strong>+ Nuevo bloque</strong>.
        </div>
      ) : (
        <div className="tablero-bloques">
          {todosLosBloques.map((bloque) => (
            <BloqueSection
              key={bloque}
              bloque={bloque}
              tareas={grupoMap[bloque] || []}
              defaultOpen={bloquesVacios.includes(bloque)}
              onEstado={(id, estado) => actualizarTableroTarea(id, 'estado', estado)}
              onEliminar={eliminarTableroTarea}
              onActualizar={actualizarTableroTarea}
              onReordenar={reordenarTableroBloque}
              onAdd={async (b, texto, detalle, semana, responsable) => {
                setBloquesNuevos((prev) => prev.filter((x) => x !== b))
                return agregarTableroTarea(b, texto, detalle, semana, responsable)
              }}
            />
          ))}
        </div>
      )}
    </div>
  )
}
