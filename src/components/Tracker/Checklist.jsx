import { useEffect, useRef, useState } from 'react'
import { useApp } from '../../context/AppContext'

function ChecklistItem({ item, onToggle, onEditar, onEliminar }) {
  const [editing, setEditing] = useState(false)
  const [texto, setTexto] = useState(item.texto)
  const inputRef = useRef(null)

  useEffect(() => {
    if (editing) inputRef.current?.select()
  }, [editing])

  function handleSave() {
    const trimmed = texto.trim()
    if (trimmed && trimmed !== item.texto) onEditar(item.id, trimmed)
    else setTexto(item.texto)
    setEditing(false)
  }

  return (
    <div className={['cl-item', item.completado ? 'cl-item--done' : '', item._saving ? 'cl-item--saving' : ''].filter(Boolean).join(' ')}>
      <button
        className={`cl-check ${item.completado ? 'cl-check--done' : ''}`}
        onClick={() => onToggle(item.id, !item.completado)}
        title={item.completado ? 'Marcar como pendiente' : 'Marcar como completado'}
      >
        {item.completado ? '✓' : ''}
      </button>

      {editing ? (
        <input
          ref={inputRef}
          className="cl-edit-input"
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          onBlur={handleSave}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSave()
            if (e.key === 'Escape') { setTexto(item.texto); setEditing(false) }
          }}
        />
      ) : (
        <span className="cl-texto" onClick={() => !item._saving && setEditing(true)} title="Clic para editar">
          {item.texto}
        </span>
      )}

      <button className="cl-btn-del" onClick={() => onEliminar(item.id)} title="Eliminar">×</button>
    </div>
  )
}

export default function Checklist() {
  const {
    currentCliente, checklist,
    loadChecklist, agregarChecklistItem, actualizarChecklistItem, eliminarChecklistItem,
  } = useApp()

  const items = checklist[currentCliente] ?? null
  const [addText, setAddText] = useState('')

  useEffect(() => {
    if (items === null && currentCliente) loadChecklist(currentCliente)
  }, [currentCliente])

  function handleAdd(e) {
    e.preventDefault()
    if (!addText.trim()) return
    agregarChecklistItem(currentCliente, addText.trim())
    setAddText('')
  }

  if (items === null) {
    return (
      <div className="cl-wrap">
        <div className="tablero-loading"><span className="tarea-spinner" /> Cargando checklist...</div>
      </div>
    )
  }

  const completados = items.filter((i) => i.completado).length
  const total = items.length
  const pct = total > 0 ? Math.round((completados / total) * 100) : 0

  return (
    <div className="cl-wrap">
      <div className="cl-header">
        <span className="cl-title">Checklist</span>
        {total > 0 && (
          <span className="cl-stats">
            {completados}/{total} completados · <strong>{pct}%</strong>
          </span>
        )}
      </div>

      {total > 0 && (
        <div className="cl-progress-bar">
          <div
            className="cl-progress-fill"
            style={{
              width: `${pct}%`,
              background: pct === 100 ? '#16A34A' : pct > 0 ? '#D97706' : '#94A3B8',
            }}
          />
        </div>
      )}

      <div className="cl-list">
        {items.length === 0 ? (
          <div className="cl-empty">Sin ítems todavía. Agregá el primero abajo.</div>
        ) : (
          items.map((item) => (
            <ChecklistItem
              key={item.id}
              item={item}
              onToggle={(id, val) => actualizarChecklistItem(id, 'completado', val, currentCliente)}
              onEditar={(id, val) => actualizarChecklistItem(id, 'texto', val, currentCliente)}
              onEliminar={(id) => eliminarChecklistItem(id, currentCliente)}
            />
          ))
        )}
      </div>

      <form className="cl-add-form" onSubmit={handleAdd}>
        <input
          className="cl-add-input"
          value={addText}
          onChange={(e) => setAddText(e.target.value)}
          placeholder="Agregar ítem al checklist..."
        />
        <button className="cl-add-btn" type="submit" disabled={!addText.trim()}>
          + Agregar
        </button>
      </form>
    </div>
  )
}
