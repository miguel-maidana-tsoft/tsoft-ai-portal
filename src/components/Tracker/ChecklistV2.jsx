import { useEffect, useRef, useState } from 'react'
import { useApp } from '../../context/AppContext'
import { FASES } from '../../constants'

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
    <div className={['cl-item', item.completado ? 'cl-item--done' : '', item._saving ? 'cl-item--saving' : '', item.extra ? 'cl-item--extra' : ''].filter(Boolean).join(' ')}>
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

export default function ChecklistV2() {
  const {
    currentCliente, currentFase, checklist,
    loadChecklist, agregarChecklistItem, actualizarChecklistItem, eliminarChecklistItem,
  } = useApp()

  const items = checklist[currentCliente] ?? null
  const [addText, setAddText] = useState('')
  const [addFase, setAddFase] = useState(currentFase || 1)

  useEffect(() => {
    if (items === null && currentCliente) loadChecklist(currentCliente)
  }, [currentCliente, items, loadChecklist])

  useEffect(() => {
    setAddFase(currentFase || 1)
  }, [currentFase])

  function handleAdd(e) {
    e.preventDefault()
    if (!addText.trim()) return
    agregarChecklistItem(currentCliente, addText.trim(), addFase)
    setAddText('')
  }

  if (items === null) {
    return (
      <div className="cl-wrap">
        <div className="tablero-loading"><span className="tarea-spinner" /> Cargando checklist...</div>
      </div>
    )
  }

  const oficiales = items.filter((item) => !item.extra)
  const extras = items.filter((item) => item.extra)
  const completados = oficiales.filter((item) => item.completado).length
  const total = oficiales.length
  const pct = total > 0 ? Math.round((completados / total) * 100) : 0
  const secciones = FASES.map((fase) => ({
    ...fase,
    items: oficiales.filter((item) => Number(item.fase) === Number(fase.id)),
  })).filter((fase) => fase.items.length > 0)

  return (
    <div className="cl-wrap">
      <div className="cl-header">
        <span className="cl-title">Checklist del programa</span>
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
        {oficiales.length === 0 ? (
          <div className="cl-empty">Sin ítems todavía. Agregá el primero abajo.</div>
        ) : (
          <>
            {secciones.map((fase) => {
              const faseCompletados = fase.items.filter((item) => item.completado).length
              const fasePct = fase.items.length > 0 ? Math.round((faseCompletados / fase.items.length) * 100) : 0
              return (
                <div key={fase.id} className="cl-phase">
                  <div className="cl-phase-header">
                    <div>
                      <div className="cl-phase-title">{fase.nombre}</div>
                      <div className="cl-phase-sub">{fase.periodo} · {fase.subtitulo}</div>
                    </div>
                    <div className="cl-phase-stats">{faseCompletados}/{fase.items.length} · {fasePct}%</div>
                  </div>

                  {fase.items.map((item) => (
                    <ChecklistItem
                      key={item.id}
                      item={item}
                      onToggle={(id, val) => actualizarChecklistItem(id, 'completado', val, currentCliente)}
                      onEditar={(id, val) => actualizarChecklistItem(id, 'texto', val, currentCliente)}
                      onEliminar={(id) => eliminarChecklistItem(id, currentCliente)}
                    />
                  ))}
                </div>
              )
            })}

            {extras.length > 0 && (
              <div className="cl-phase cl-phase--extras">
                <div className="cl-phase-header">
                  <div>
                    <div className="cl-phase-title">Extras</div>
                    <div className="cl-phase-sub">Ítems manuales fuera del checklist base oficial</div>
                  </div>
                  <div className="cl-phase-stats">{extras.filter((item) => item.completado).length}/{extras.length}</div>
                </div>

                {extras.map((item) => (
                  <ChecklistItem
                    key={item.id}
                    item={item}
                    onToggle={(id, val) => actualizarChecklistItem(id, 'completado', val, currentCliente)}
                    onEditar={(id, val) => actualizarChecklistItem(id, 'texto', val, currentCliente)}
                    onEliminar={(id) => eliminarChecklistItem(id, currentCliente)}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>

      <form className="cl-add-form" onSubmit={handleAdd}>
        <div className="cl-add-row">
          <input
            className="cl-add-input"
            value={addText}
            onChange={(e) => setAddText(e.target.value)}
            placeholder="Agregar ítem al checklist..."
          />
          <select className="cl-add-select" value={addFase} onChange={(e) => setAddFase(Number(e.target.value))}>
            {FASES.map((fase) => (
              <option key={fase.id} value={fase.id}>{fase.nombre}</option>
            ))}
          </select>
        </div>
        <button className="cl-add-btn" type="submit" disabled={!addText.trim()}>
          + Agregar
        </button>
      </form>
    </div>
  )
}
