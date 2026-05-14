import { useEffect, useRef, useState } from 'react'
import { useApp } from '../../context/AppContext'

const ESTADOS = ['Pendiente', 'En curso', 'Bloqueado', 'Completado']

const ESTADO_SLUG = {
  'Pendiente':  'pendiente',
  'En curso':   'en-curso',
  'Bloqueado':  'bloqueado',
  'Completado': 'finalizado',
}

const PRIORIDADES = [
  { id: 'alta',  emoji: '🔴', label: 'Alta' },
  { id: 'media', emoji: '🟡', label: 'Media' },
  { id: 'baja',  emoji: '🟢', label: 'Baja' },
]

const PRIO_META = {
  alta:  { label: 'Alta' },
  media: { label: 'Media' },
  baja:  { label: 'Baja' },
}

function PrioBadge({ prioridad }) {
  const p = prioridad || 'media'
  return (
    <span className={`prio-badge prio-badge--${p}`}>
      <span className="prio-badge-dot" />
      {PRIO_META[p]?.label ?? 'Media'}
    </span>
  )
}

function PrioSelect({ value, onChange }) {
  return (
    <select className="pg-prio-select" value={value || 'media'} onChange={(e) => onChange(e.target.value)}>
      {PRIORIDADES.map((p) => (
        <option key={p.id} value={p.id}>{p.emoji} {p.label}</option>
      ))}
    </select>
  )
}

// ── Fila de tarea ──────────────────────────────────────────
function TareaRow({ tarea, onEstado, onEliminar, onActualizar, dragHandlers, isDragOver, isDragging }) {
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({
    texto: tarea.texto,
    detalle: tarea.detalle || '',
    prioridad: tarea.prioridad || 'media',
  })

  function openEdit() {
    setForm({ texto: tarea.texto, detalle: tarea.detalle || '', prioridad: tarea.prioridad || 'media' })
    setEditing(true)
  }

  const [saving, setSaving] = useState(false)

  async function handleGuardar() {
    setSaving(true)
    const updates = []
    if (form.texto !== tarea.texto) updates.push(onActualizar(tarea.id, 'texto', form.texto))
    if (form.detalle !== (tarea.detalle || '')) updates.push(onActualizar(tarea.id, 'detalle', form.detalle))
    if (form.prioridad !== (tarea.prioridad || 'media')) updates.push(onActualizar(tarea.id, 'prioridad', form.prioridad))
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
          placeholder="Ítem *"
          autoFocus
        />
        <textarea
          className="tt-input tt-textarea"
          value={form.detalle}
          onChange={(e) => setForm((p) => ({ ...p, detalle: e.target.value }))}
          placeholder="Descripción"
          rows={2}
        />
        <PrioSelect value={form.prioridad} onChange={(v) => setForm((p) => ({ ...p, prioridad: v }))} />
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
    <div
      className={[
        'tt-row',
        `tt-row--${slug}`,
        isDragOver    ? 'tt-row--drag-over' : '',
        isDragging    ? 'tt-row--dragging'  : '',
        tarea._saving ? 'tt-row--saving'    : '',
      ].filter(Boolean).join(' ')}
      draggable
      onDragStart={dragHandlers.onDragStart}
      onDragOver={dragHandlers.onDragOver}
      onDrop={dragHandlers.onDrop}
      onDragEnd={dragHandlers.onDragEnd}
    >
      <span className="tt-drag-handle" title="Arrastrar para reordenar">⠿</span>
      <PrioBadge prioridad={tarea.prioridad} />
      <select
        className={`tt-estado-select tt-estado-select--${slug}`}
        value={tarea.estado}
        onChange={(e) => onEstado(tarea.id, e.target.value)}
      >
        {ESTADOS.map((op) => <option key={op}>{op}</option>)}
      </select>
      <div className="tt-body">
        <div className="tt-texto">{tarea.texto}</div>
        {tarea.detalle && <div className="tt-detalle">{tarea.detalle}</div>}
      </div>
      <div className="tt-meta">
        <button className="tt-btn-icon" onClick={openEdit} title="Editar">✎</button>
        <button className="tt-btn-icon tt-btn-del" onClick={() => onEliminar(tarea.id)} title="Eliminar">×</button>
      </div>
    </div>
  )
}

// ── Formulario nueva tarea ─────────────────────────────────
function AddTareaForm({ bloque, onAdd, onCancel }) {
  const [form, setForm] = useState({ texto: '', detalle: '', prioridad: 'media' })

  function handleSubmit(e) {
    e.preventDefault()
    if (!form.texto.trim()) return
    onAdd(bloque, form.texto.trim(), form.detalle, form.prioridad)
    onCancel()
  }

  return (
    <form className="tt-add-form" onSubmit={handleSubmit}>
      <input
        className="tt-input"
        value={form.texto}
        onChange={(e) => setForm((p) => ({ ...p, texto: e.target.value }))}
        placeholder="Ítem *"
        autoFocus
      />
      <textarea
        className="tt-input tt-textarea"
        value={form.detalle}
        onChange={(e) => setForm((p) => ({ ...p, detalle: e.target.value }))}
        placeholder="Descripción"
        rows={2}
      />
      <PrioSelect value={form.prioridad} onChange={(v) => setForm((p) => ({ ...p, prioridad: v }))} />
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

// ── Bloque ─────────────────────────────────────────────────
function BloqueSection({ bloque, tareas, onEstado, onEliminar, onActualizar, onAdd, onEliminarBloque, onRenombrarBloque, onReordenar, defaultOpen }) {
  const [addOpen, setAddOpen] = useState(defaultOpen || false)
  const [collapsed, setCollapsed] = useState(false)
  const [editingNombre, setEditingNombre] = useState(false)
  const [nuevoNombre, setNuevoNombre] = useState(bloque)
  const [dragOverId, setDragOverId] = useState(null)
  const dragId = useRef(null)

  const completadas = tareas.filter((t) => t.estado === 'Completado').length
  const todasCompletadas = tareas.length > 0 && completadas === tareas.length

  function handleDragStart(id) { dragId.current = id }
  function handleDragOver(e, id) {
    e.preventDefault()
    if (dragId.current !== id) setDragOverId(id)
  }
  function handleDrop(e, targetId) {
    e.preventDefault()
    const sourceId = dragId.current
    if (!sourceId || sourceId === targetId) { setDragOverId(null); return }
    const list = [...tareas]
    const fromIdx = list.findIndex((t) => t.id === sourceId)
    const toIdx = list.findIndex((t) => t.id === targetId)
    const [moved] = list.splice(fromIdx, 1)
    list.splice(toIdx, 0, moved)
    onReordenar(bloque, list.map((t) => t.id))
    dragId.current = null
    setDragOverId(null)
  }
  function handleDragEnd() { dragId.current = null; setDragOverId(null) }

  async function confirmarRenombrar() {
    const nombre = nuevoNombre.trim()
    if (!nombre || nombre === bloque) { setEditingNombre(false); return }
    await onRenombrarBloque(bloque, nombre)
    setEditingNombre(false)
  }

  function handleEliminarBloque() {
    if (window.confirm(`¿Eliminar el bloque "${bloque}" y todas sus tareas?`)) {
      onEliminarBloque(bloque)
    }
  }

  return (
    <div className={`tablero-bloque ${collapsed ? 'tablero-bloque--collapsed' : ''}`}>
      <div
        className={`tablero-bloque-header ${todasCompletadas ? 'tablero-bloque-header--done' : ''}`}
        onClick={() => !editingNombre && setCollapsed((c) => !c)}
        style={{ cursor: editingNombre ? 'default' : 'pointer' }}
      >
        <span className={`tablero-bloque-chevron ${collapsed ? 'tablero-bloque-chevron--closed' : ''}`}>▾</span>

        {editingNombre ? (
          <input
            className="pg-bloque-rename"
            value={nuevoNombre}
            onChange={(e) => setNuevoNombre(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') confirmarRenombrar()
              if (e.key === 'Escape') setEditingNombre(false)
            }}
            onClick={(e) => e.stopPropagation()}
            autoFocus
          />
        ) : (
          <span className="tablero-bloque-name">{bloque}</span>
        )}

        <span className="tablero-bloque-count">{completadas}/{tareas.length}</span>

        {!collapsed && !editingNombre && (
          <>
            <button
              className={`tablero-bloque-add-btn ${addOpen ? 'active' : ''}`}
              onClick={(e) => { e.stopPropagation(); setAddOpen((o) => !o) }}
            >
              {addOpen ? '− Cerrar' : '+ Tarea'}
            </button>
            <button
              className="tablero-bloque-add-btn"
              onClick={(e) => { e.stopPropagation(); setEditingNombre(true); setNuevoNombre(bloque) }}
              title="Renombrar bloque"
            >
              ✎
            </button>
            <button
              className="tablero-bloque-add-btn pg-bloque-del"
              onClick={(e) => { e.stopPropagation(); handleEliminarBloque() }}
              title="Eliminar bloque"
            >
              ×
            </button>
          </>
        )}

        {editingNombre && (
          <>
            <button
              className="tablero-bloque-add-btn"
              onClick={(e) => { e.stopPropagation(); confirmarRenombrar() }}
            >
              ✓ OK
            </button>
            <button
              className="tablero-bloque-add-btn"
              onClick={(e) => { e.stopPropagation(); setEditingNombre(false) }}
            >
              ✗
            </button>
          </>
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

// ── Seguimiento principal ──────────────────────────────────
export default function Seguimiento() {
  const {
    plataformaSeg, loadPlataformaSeg,
    agregarSegTarea, actualizarSegTarea, eliminarSegTarea,
    reordenarSegBloque, eliminarSegBloque, renombrarSegBloque,
  } = useApp()
  const [addingBloque, setAddingBloque] = useState(false)
  const [nuevoBloque, setNuevoBloque] = useState('')
  const [bloquesNuevos, setBloquesNuevos] = useState([])

  useEffect(() => {
    if (plataformaSeg === null) loadPlataformaSeg()
  }, [])

  function handleNuevoBloque(e) {
    e.preventDefault()
    const nombre = nuevoBloque.trim()
    if (!nombre) return
    setBloquesNuevos((prev) => [...prev, nombre])
    setNuevoBloque('')
    setAddingBloque(false)
  }

  const loading = plataformaSeg === null

  const grupoMap = {}
  ;(plataformaSeg || []).forEach((t) => {
    if (!grupoMap[t.bloque]) grupoMap[t.bloque] = []
    grupoMap[t.bloque].push(t)
  })

  const bloquesVacios = bloquesNuevos.filter((b) => !grupoMap[b])
  const todosLosBloques = [...Object.keys(grupoMap), ...bloquesVacios]

  return (
    <div>
      <div className="tablero-header">
        <div className="tablero-subtitle">Agrupá tareas por bloque temático</div>
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
        <div className="tablero-loading"><span className="tarea-spinner" /> Cargando...</div>
      ) : todosLosBloques.length === 0 ? (
        <div className="tablero-empty">No hay bloques. Creá uno con <strong>+ Nuevo bloque</strong>.</div>
      ) : (
        <div className="tablero-bloques">
          {todosLosBloques.map((bloque) => (
            <BloqueSection
              key={bloque}
              bloque={bloque}
              tareas={grupoMap[bloque] || []}
              defaultOpen={bloquesVacios.includes(bloque)}
              onEstado={(id, estado) => actualizarSegTarea(id, 'estado', estado)}
              onEliminar={eliminarSegTarea}
              onActualizar={actualizarSegTarea}
              onReordenar={reordenarSegBloque}
              onEliminarBloque={(b) => {
                eliminarSegBloque(b)
                setBloquesNuevos((prev) => prev.filter((x) => x !== b))
              }}
              onRenombrarBloque={renombrarSegBloque}
              onAdd={async (b, texto, detalle, prioridad) => {
                setBloquesNuevos((prev) => prev.filter((x) => x !== b))
                return agregarSegTarea(b, texto, detalle, prioridad)
              }}
            />
          ))}
        </div>
      )}
    </div>
  )
}
