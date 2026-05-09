import { useState, useEffect } from 'react'
import { useApp } from '../../context/AppContext'
import { FASES } from '../../constants'
import ChampionsEditor from './ChampionsEditor'

const CAMPOS = [
  { fieldId: 'gerencia', label: 'Gerencia / Vertical' },
  { fieldId: 'gerente', label: 'Gerente TSOFT ref.' },
  { fieldId: 'lider', label: 'Líder de proyecto TSOFT' },
  { fieldId: 'nivelC', label: 'Nivel C', placeholder: 'C1 / C2 / C3 / C4', hint: 'Madurez del cliente · C1 Escéptico · C2 Receptivo · C3 Activo · C4 Estratégico' },
  { fieldId: 'nivelP', label: 'Nivel P actual', placeholder: 'P1 / P2 / P3...', hint: 'Madurez del proyecto · P1 Ad-hoc · P2 Coordinado · P3 Integrado · P4 Autónomo · P5 Orquestado' },
  { fieldId: 'herramientas', label: 'Herramientas IA en uso', full: true },
  { fieldId: 'proximoPaso', label: 'Próximo paso', multiline: 2, full: true },
  { fieldId: 'notas', label: 'Notas clave', multiline: 3, full: true },
]

export default function InfoCliente() {
  const { currentCliente, clientesInfo, actualizarClienteInfo } = useApp()
  const serverInfo = clientesInfo[currentCliente] || {}

  const [form, setForm] = useState({})
  const [saving, setSaving] = useState(false)
  const [savedOk, setSavedOk] = useState(false)
  const [faseActualSaved, setFaseActualSaved] = useState(false)

  // Sincronizar form cuando cambia el cliente o llegan datos del servidor
  useEffect(() => {
    const initial = {}
    CAMPOS.forEach((c) => { initial[c.fieldId] = serverInfo[c.fieldId] || '' })
    setForm(initial)
    setSavedOk(false)
  }, [currentCliente, JSON.stringify(serverInfo)])

  const isDirty = CAMPOS.some((c) => form[c.fieldId] !== (serverInfo[c.fieldId] || ''))

  function handleChange(fieldId, value) {
    setSavedOk(false)
    setForm((prev) => ({ ...prev, [fieldId]: value }))
  }

  async function handleGuardar() {
    setSaving(true)
    const changedCampos = CAMPOS.filter((c) => form[c.fieldId] !== (serverInfo[c.fieldId] || ''))
    await Promise.all(
      changedCampos.map((c) => actualizarClienteInfo(currentCliente, c.fieldId, form[c.fieldId]))
    )
    setSaving(false)
    setSavedOk(true)
    setTimeout(() => setSavedOk(false), 3000)
  }

  async function handleFaseActual(e) {
    await actualizarClienteInfo(currentCliente, 'faseActual', e.target.value)
    setFaseActualSaved(true)
    setTimeout(() => setFaseActualSaved(false), 2000)
  }

  return (
    <div>
      <div className="info-section-title">Ficha del cliente</div>
      <div className="info-grid">

        {/* Fase actual — auto-guarda (es un selector, intención clara) */}
        <div className="info-field">
          <div className="info-field-label">Fase actual ★</div>
          <div className="info-field-select-wrap">
            <select
              className="info-field-value"
              value={serverInfo.faseActual || ''}
              onChange={handleFaseActual}
            >
              <option value="">— Sin definir —</option>
              {FASES.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.nombre} · {f.subtitulo}
                </option>
              ))}
            </select>
            {faseActualSaved && <span style={{ marginLeft: 8, color: 'var(--green)', fontSize: 13 }}>✓</span>}
          </div>
        </div>

        {/* Campos de texto — guardan todos juntos con el botón */}
        {CAMPOS.map((c) => (
          <div key={c.fieldId} className={`info-field ${c.full ? 'full' : ''}`}>
            <div className="info-field-label">
              {c.label}
              {c.hint && <span className="info-field-hint">{c.hint}</span>}
            </div>
            {c.multiline ? (
              <textarea
                className="info-field-value"
                rows={c.multiline}
                value={form[c.fieldId] ?? ''}
                placeholder={c.placeholder || '—'}
                onChange={(e) => handleChange(c.fieldId, e.target.value)}
              />
            ) : (
              <input
                className="info-field-value"
                value={form[c.fieldId] ?? ''}
                placeholder={c.placeholder || '—'}
                onChange={(e) => handleChange(c.fieldId, e.target.value)}
              />
            )}
          </div>
        ))}

        {/* Champions — tiene su propio flujo de add/remove */}
        <div className="info-field full">
          <div className="info-field-label">Champions asignados</div>
          <ChampionsEditor cliente={currentCliente} />
        </div>
      </div>

      {/* Botón guardar */}
      <div className="info-save-bar">
        {savedOk && <span className="info-saved-msg">✓ Cambios guardados</span>}
        <button
          className={`btn-guardar ${isDirty ? 'dirty' : ''}`}
          onClick={handleGuardar}
          disabled={saving || !isDirty}
        >
          {saving ? (
            <><span className="tarea-spinner btn-spinner" /> Guardando...</>
          ) : (
            'Guardar cambios'
          )}
        </button>
      </div>
    </div>
  )
}
