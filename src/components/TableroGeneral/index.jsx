import { useEffect, useRef, useState } from 'react'
import * as XLSX from 'xlsx'          // upload/parsing
import { useApp } from '../../context/AppContext'
import Spinner from '../Spinner'

const ESTADOS = ['Pendiente', 'En curso', 'Bloqueado', 'Completado']
const VALID_ESTADOS = new Set(ESTADOS)

const ESTADO_SLUG = {
  'Pendiente':  'pendiente',
  'En curso':   'en-curso',
  'Bloqueado':  'bloqueado',
  'Completado': 'completado',
}

// ── Excel helpers ─────────────────────────────────────────────
const SHEET_NAME = 'Tablero_General_PM'
const COL = {
  id:               'id (no modificar)',
  texto:            'Título',
  descripcion:      'Descripción',
  estado:           'Estado',
  fecha_creacion:   'Fecha creación',
  fecha_completado: 'Fecha completado',
}

function formatFecha(iso) {
  if (!iso) return ''
  try { return new Date(iso).toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit', year: 'numeric' }) }
  catch { return '' }
}

const ESTADO_FILL = {
  'Completado': { argb: 'FFD1FAE5' },
  'En curso':   { argb: 'FFFEF3C7' },
  'Bloqueado':  { argb: 'FFFEE2E2' },
  'Pendiente':  { argb: 'FFF8FAFC' },
}
const ESTADO_FONT = {
  'Completado': { argb: 'FF15803D' },
  'En curso':   { argb: 'FFD97706' },
  'Bloqueado':  { argb: 'FFDC2626' },
  'Pendiente':  { argb: 'FF64748B' },
}

async function downloadExcel(tareas) {
  // Carga ExcelJS solo cuando se necesita (no infla el bundle inicial)
  const { default: ExcelJS } = await import('exceljs')

  const workbook = new ExcelJS.Workbook()
  workbook.creator = 'TSOFT AI Portal'

  const ws = workbook.addWorksheet(SHEET_NAME, {
    views: [{ state: 'frozen', ySplit: 1 }],  // header siempre visible
  })

  ws.columns = [
    { header: COL.id,               key: 'id',               width: 38 },
    { header: COL.texto,            key: 'texto',            width: 52 },
    { header: COL.descripcion,      key: 'descripcion',      width: 62 },
    { header: COL.estado,           key: 'estado',           width: 16 },
    { header: COL.fecha_creacion,   key: 'fecha_creacion',   width: 20 },
    { header: COL.fecha_completado, key: 'fecha_completado', width: 20 },
  ]

  // ── Header row ────────────────────────────────────────────
  const headerRow = ws.getRow(1)
  headerRow.height = 26
  headerRow.eachCell((cell) => {
    cell.fill   = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF0D1B3E' } }
    cell.font   = { bold: true, color: { argb: 'FFFFFFFF' }, size: 10, name: 'Calibri' }
    cell.alignment = { vertical: 'middle', horizontal: 'center' }
    cell.border = { bottom: { style: 'medium', color: { argb: 'FFC8102E' } } }
  })

  // ── Filas de datos ────────────────────────────────────────
  tareas.forEach((t, i) => {
    const row = ws.addRow({
      id:               t.id,
      texto:            t.texto,
      descripcion:      t.descripcion || '',
      estado:           t.estado,
      fecha_creacion:   formatFecha(t.fecha_creacion),
      fecha_completado: formatFecha(t.fecha_completado),
    })
    row.height = 22

    const bgBase = i % 2 === 0 ? 'FFFFFFFF' : 'FFF8FAFC'
    const borderColor = { argb: 'FFE2E8F0' }
    const thinBorder  = { style: 'thin', color: borderColor }

    row.eachCell({ includeEmpty: true }, (cell, col) => {
      cell.border = { bottom: thinBorder, right: thinBorder }
      cell.font   = { size: 10, color: { argb: 'FF1E293B' }, name: 'Calibri' }
      cell.alignment = { vertical: 'middle' }

      // Col 1: id → gris claro + cursiva (indica "no tocar")
      if (col === 1) {
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF1F5F9' } }
        cell.font = { size: 9, color: { argb: 'FF94A3B8' }, italic: true, name: 'Calibri' }
        return
      }

      // Col 3: descripcion → wrap text
      if (col === 3) {
        cell.alignment = { vertical: 'top', wrapText: true }
      }

      // Col 4: estado → color-coded
      if (col === 4) {
        const fill = ESTADO_FILL[t.estado]
        const fc   = ESTADO_FONT[t.estado]
        if (fill) cell.fill = { type: 'pattern', pattern: 'solid', fgColor: fill }
        if (fc)   cell.font = { size: 10, bold: true, color: fc, name: 'Calibri' }
        cell.alignment = { horizontal: 'center', vertical: 'middle' }
        return
      }

      // Col 6: fecha_completado → verde cuando tiene valor
      if (col === 6 && t.fecha_completado) {
        cell.font = { size: 10, bold: true, color: { argb: 'FF15803D' }, name: 'Calibri' }
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFECFDF5' } }
        return
      }

      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: bgBase } }
    })
  })

  // ── Descarga en el browser ────────────────────────────────
  const buffer = await workbook.xlsx.writeBuffer()
  const blob = new Blob([buffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${SHEET_NAME}.xlsx`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

async function parseExcel(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const wb = XLSX.read(e.target.result, { type: 'array' })
        const ws = wb.Sheets[SHEET_NAME]
        if (!ws) {
          reject(new Error(`No se encontró la solapa "${SHEET_NAME}" en el archivo.`))
          return
        }
        resolve(XLSX.utils.sheet_to_json(ws, { defval: '' }))
      } catch (err) { reject(err) }
    }
    reader.onerror = () => reject(new Error('No se pudo leer el archivo.'))
    reader.readAsArrayBuffer(file)
  })
}

const CAMPO_LABEL = {
  texto:       'título',
  descripcion: 'descripción',
  estado:      'estado',
}

function truncar(str, max = 48) {
  if (!str) return '(vacío)'
  return str.length > max ? str.slice(0, max) + '…' : str
}

// Normaliza texto para comparar: trim + saltos de línea unificados
function norm(str) {
  return (str || '').trim().replace(/\r\n/g, '\n').replace(/\r/g, '\n')
}

function computeDiff(rows, tareas) {
  const idMap = Object.fromEntries((tareas || []).map((t) => [t.id, t]))
  const updates = []  // { id, titulo, cambios: [{campo, label, de, a, valor}] }
  const nuevas  = []  // { texto, descripcion, estado }
  const errores = []

  for (const row of rows) {
    const id          = String(row[COL.id]         || '').trim()
    const texto       = String(row[COL.texto]       || '').trim()
    const descripcion = String(row[COL.descripcion] || '').trim()
    const estado      = String(row[COL.estado]      || '').trim()

    if (!texto) continue

    if (estado && !VALID_ESTADOS.has(estado)) {
      errores.push(`Estado inválido "${estado}" en tarea "${texto}". Válidos: ${ESTADOS.join(', ')}.`)
      continue
    }

    if (id && idMap[id]) {
      const t = idMap[id]
      const cambios = []

      if (norm(texto) !== norm(t.texto))
        cambios.push({ campo: 'texto',       label: 'título',      de: truncar(t.texto),             a: truncar(texto),       valor: texto })
      if (norm(descripcion) !== norm(t.descripcion))
        cambios.push({ campo: 'descripcion', label: 'descripción', de: truncar(t.descripcion || ''), a: truncar(descripcion), valor: descripcion })
      if (estado && estado !== t.estado)
        cambios.push({ campo: 'estado',      label: 'estado',      de: t.estado,                     a: estado,               valor: estado })

      if (cambios.length) updates.push({ id, titulo: t.texto, cambios })
    } else if (!id) {
      nuevas.push({ texto, descripcion, estado: VALID_ESTADOS.has(estado) ? estado : 'Pendiente' })
    }
  }

  return { updates, nuevas, errores }
}

// ── Modal de importación ──────────────────────────────────────
function ImportModal({ diff, onConfirm, onCancel, applying }) {
  const { updates, nuevas, errores } = diff
  const totalCambios = updates.length + nuevas.length

  return (
    <div className="tg-modal-overlay">
      <div className="tg-modal">
        <div className="tg-modal-header">
          <span className="tg-modal-title">Revisar cambios del Excel</span>
          {totalCambios > 0 && (
            <div className="tg-modal-badges">
              {updates.length > 0 && (
                <span className="tg-modal-badge tg-modal-badge--update">
                  {updates.length} actualización{updates.length > 1 ? 'es' : ''}
                </span>
              )}
              {nuevas.length > 0 && (
                <span className="tg-modal-badge tg-modal-badge--new">
                  {nuevas.length} nueva{nuevas.length > 1 ? 's' : ''}
                </span>
              )}
            </div>
          )}
        </div>

        {errores.length > 0 && (
          <div className="tg-modal-errors">
            <strong>⚠ Filas ignoradas por error:</strong>
            <ul>{errores.map((e, i) => <li key={i}>{e}</li>)}</ul>
          </div>
        )}

        {totalCambios === 0 ? (
          <p className="tg-modal-empty">No se detectaron cambios respecto al estado actual.</p>
        ) : (
          <ul className="tg-modal-list">
            {/* Tareas actualizadas — con detalle por campo */}
            {updates.map(({ id, titulo, cambios }) => (
              <li key={id} className="tg-modal-item tg-modal-item--update">
                <div className="tg-modal-item-header">
                  <span className="tg-modal-item-tag tg-modal-item-tag--update">Modificada</span>
                  <span className="tg-modal-item-titulo">"{titulo}"</span>
                </div>
                <ul className="tg-modal-cambios">
                  {cambios.map((c, i) => (
                    <li key={i} className="tg-modal-cambio">
                      <span className="tg-modal-cambio-campo">{c.label}:</span>
                      {c.campo === 'estado' ? (
                        <>
                          <span className={`tg-modal-estado tg-modal-estado--${(c.de || '').toLowerCase().replace(' ', '-')}`}>{c.de}</span>
                          <span className="tg-modal-arrow">→</span>
                          <span className={`tg-modal-estado tg-modal-estado--${(c.a || '').toLowerCase().replace(' ', '-')}`}>{c.a}</span>
                        </>
                      ) : (
                        <span className="tg-modal-cambio-valor">"{c.de}" → "{c.a}"</span>
                      )}
                    </li>
                  ))}
                </ul>
              </li>
            ))}

            {/* Tareas nuevas */}
            {nuevas.map(({ texto, estado }, i) => (
              <li key={`new-${i}`} className="tg-modal-item tg-modal-item--new">
                <div className="tg-modal-item-header">
                  <span className="tg-modal-item-tag tg-modal-item-tag--new">Nueva tarea</span>
                  <span className="tg-modal-item-titulo">"{texto}"</span>
                </div>
                {estado && estado !== 'Pendiente' && (
                  <ul className="tg-modal-cambios">
                    <li className="tg-modal-cambio">
                      <span className="tg-modal-cambio-campo">estado:</span>
                      <span className={`tg-modal-estado tg-modal-estado--${(estado || '').toLowerCase().replace(' ', '-')}`}>{estado}</span>
                    </li>
                  </ul>
                )}
              </li>
            ))}
          </ul>
        )}

        <div className="tg-modal-footer">
          <button className="tt-btn-cancel" onClick={onCancel} disabled={applying}>
            Cancelar
          </button>
          {totalCambios > 0 && (
            <button className="tt-btn-save" onClick={onConfirm} disabled={applying}>
              {applying
                ? <><span className="tarea-spinner btn-spinner" /> Aplicando...</>
                : `Confirmar ${totalCambios} cambio${totalCambios > 1 ? 's' : ''}`}
            </button>
          )}
        </div>
      </div>
    </div>
  )
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
      form.texto !== tarea.texto            && onActualizar(tarea.id, 'texto',       form.texto.trim()),
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
        tarea._saving  ? 'tg-row--saving'    : '',
        isDragOver     ? 'tg-row--drag-over' : '',
        isDragging     ? 'tg-row--dragging'  : '',
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
        <div className="tg-fechas">
          {tarea.fecha_creacion && (
            <span className="tg-fecha">
              Creado: {new Date(tarea.fecha_creacion).toLocaleDateString('es-AR', { day: '2-digit', month: 'short', year: 'numeric' })}
            </span>
          )}
          {tarea.estado === 'Completado' && tarea.fecha_completado && (
            <span className="tg-fecha tg-fecha--completado">
              ✓ {new Date(tarea.fecha_completado).toLocaleDateString('es-AR', { day: '2-digit', month: 'short', year: 'numeric' })}
            </span>
          )}
        </div>
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

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.texto.trim()) return
    await onAdd(form.texto.trim(), form.descripcion.trim())
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
  const {
    tareasGenerales, loadTareasGenerales,
    agregarTareaGeneral, actualizarTareaGeneral,
    eliminarTareaGeneral, reordenarTareasGenerales,
  } = useApp()

  const [addOpen,        setAddOpen]        = useState(false)
  const [filtro,         setFiltro]         = useState('todos')
  const [dragOverId,     setDragOverId]     = useState(null)
  const [importDiff,     setImportDiff]     = useState(null)
  const [importApplying, setImportApplying] = useState(false)
  const [importError,    setImportError]    = useState(null)
  const dragId      = useRef(null)
  const fileInputRef = useRef(null)

  async function handleAgregar(texto, descripcion) {
    const result = await agregarTareaGeneral(texto, descripcion)
    if (result?.success) {
      const currentIds = (tareasGenerales || []).map((t) => t.id).filter((id) => id !== result.id)
      reordenarTareasGenerales([result.id, ...currentIds])
    }
  }

  function toggleFiltro(estado) {
    setFiltro((prev) => prev === estado ? 'todos' : estado)
  }

  // ── Estado de tareas ──────────────────────
  function handleEstado(id, estado) {
    const newOrder = estado === 'Completado'
      ? [...(tareasGenerales || []).filter((t) => t.id !== id).map((t) => t.id), id]
      : null
    actualizarTareaGeneral(id, 'estado', estado)
    if (estado === 'Completado') {
      actualizarTareaGeneral(id, 'fecha_completado', new Date().toISOString())
      reordenarTareasGenerales(newOrder)
    }
  }

  // ── Drag & drop ───────────────────────────
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

  // ── Excel: descarga ───────────────────────
  const [downloading, setDownloading] = useState(false)
  async function handleDownload() {
    setDownloading(true)
    try { await downloadExcel(tareasGenerales || []) }
    finally { setDownloading(false) }
  }

  // ── Excel: subida ─────────────────────────
  async function handleFileChange(e) {
    const file = e.target.files[0]
    if (!file) return
    e.target.value = ''
    setImportError(null)
    try {
      const rows = await parseExcel(file)
      const diff = computeDiff(rows, tareasGenerales)
      setImportDiff(diff)
    } catch (err) {
      setImportError(err.message)
    }
  }

  async function handleImportConfirm() {
    if (!importDiff) return
    setImportApplying(true)
    const { updates, nuevas } = importDiff

    for (const { id, cambios } of updates) {
      for (const { campo, valor } of cambios) {
        await actualizarTareaGeneral(id, campo, valor)
        if (campo === 'estado' && valor === 'Completado') {
          await actualizarTareaGeneral(id, 'fecha_completado', new Date().toISOString())
          const current = tareasGenerales || []
          const newOrder = [...current.filter((t) => t.id !== id).map((t) => t.id), id]
          reordenarTareasGenerales(newOrder)
        }
      }
    }

    for (const { texto, descripcion, estado } of nuevas) {
      const result = await agregarTareaGeneral(texto, descripcion)
      if (result?.success) {
        if (estado && estado !== 'Pendiente') {
          await actualizarTareaGeneral(result.id, 'estado', estado)
        }
        // Mover al principio de la lista (y persistir orden)
        const currentIds = (tareasGenerales || []).map((t) => t.id).filter((id) => id !== result.id)
        reordenarTareasGenerales([result.id, ...currentIds])
      }
    }

    setImportApplying(false)
    setImportDiff(null)
  }

  useEffect(() => {
    if (tareasGenerales === null) loadTareasGenerales()
  }, [])

  const pendientes  = (tareasGenerales || []).filter((t) => t.estado === 'Pendiente').length
  const enCurso     = (tareasGenerales || []).filter((t) => t.estado === 'En curso').length
  const bloqueadas  = (tareasGenerales || []).filter((t) => t.estado === 'Bloqueado').length
  const completadas = (tareasGenerales || []).filter((t) => t.estado === 'Completado').length
  const tareasFiltradas = filtro === 'todos'
    ? (tareasGenerales || [])
    : (tareasGenerales || []).filter((t) => t.estado === filtro)

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Tablero General</div>
          <div className="page-subtitle">Tareas generales del programa · PM</div>
        </div>
        <div className="tg-header-actions">
          <button
            className="tg-excel-btn tg-excel-btn--download"
            onClick={handleDownload}
            disabled={!tareasGenerales || tareasGenerales.length === 0 || downloading}
            title="Descargar como Excel"
          >
            {downloading ? '⏳ Generando...' : '⬇ Descargar Excel'}
          </button>
          <button
            className="tg-excel-btn tg-excel-btn--upload"
            onClick={() => fileInputRef.current?.click()}
            title="Subir Excel con cambios"
          >
            ⬆ Subir Excel
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".xlsx,.xls"
            style={{ display: 'none' }}
            onChange={handleFileChange}
          />
          <button className="tg-nueva-btn" onClick={() => setAddOpen((o) => !o)}>
            {addOpen ? '− Cancelar' : '+ Nueva tarea'}
          </button>
        </div>
      </div>

      {importError && (
        <div className="tg-import-error">
          ⚠ {importError}
          <button onClick={() => setImportError(null)}>×</button>
        </div>
      )}

      {importDiff && (
        <ImportModal
          diff={importDiff}
          onConfirm={handleImportConfirm}
          onCancel={() => setImportDiff(null)}
          applying={importApplying}
        />
      )}

      {tareasGenerales !== null && tareasGenerales.length > 0 && (
        <div className="tg-kpis">
          <span
            className={`tg-kpi tg-kpi--todos ${filtro === 'todos' ? 'tg-kpi--active' : ''}`}
            onClick={() => setFiltro('todos')}
          >
            <span className="tg-kpi-num">{tareasGenerales.length}</span> Todas
          </span>
          <span
            className={`tg-kpi ${filtro === 'Pendiente' ? 'tg-kpi--active' : ''}`}
            onClick={() => toggleFiltro('Pendiente')}
          >
            <span className="tg-kpi-num">{pendientes}</span> Pendientes
          </span>
          <span
            className={`tg-kpi tg-kpi--curso ${filtro === 'En curso' ? 'tg-kpi--active' : ''}`}
            onClick={() => toggleFiltro('En curso')}
          >
            <span className="tg-kpi-num">{enCurso}</span> En curso
          </span>
          {bloqueadas > 0 && (
            <span
              className={`tg-kpi tg-kpi--bloqueado ${filtro === 'Bloqueado' ? 'tg-kpi--active' : ''}`}
              onClick={() => toggleFiltro('Bloqueado')}
            >
              <span className="tg-kpi-num">{bloqueadas}</span> Bloqueadas
            </span>
          )}
          <span
            className={`tg-kpi tg-kpi--done ${filtro === 'Completado' ? 'tg-kpi--active' : ''}`}
            onClick={() => toggleFiltro('Completado')}
          >
            <span className="tg-kpi-num">{completadas}</span> Completadas
          </span>
        </div>
      )}

      <div className="tg-wrap">
        {addOpen && (
          <AddForm
            onAdd={handleAgregar}
            onCancel={() => setAddOpen(false)}
          />
        )}

        {tareasGenerales === null ? (
          <Spinner />
        ) : tareasGenerales.length === 0 && !addOpen ? (
          <div className="tg-empty">
            Sin tareas todavía. Usá <strong>+ Nueva tarea</strong> para agregar.
          </div>
        ) : tareasFiltradas.length === 0 ? (
          <div className="tg-empty">
            No hay tareas con estado <strong>{filtro}</strong>.
          </div>
        ) : (
          <div className="tg-list">
            {tareasFiltradas.map((t) => (
              <TareaRow
                key={t.id}
                tarea={t}
                onEstado={handleEstado}
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
