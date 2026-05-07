import { useState } from 'react'
import { useApp } from '../../context/AppContext'
import ChampionsEditor from './ChampionsEditor'

function InfoField({ label, fieldId, value, placeholder, multiline, full, cliente, onSave }) {
  const [saved, setSaved] = useState(false)

  async function handleBlur(e) {
    await onSave(cliente, fieldId, e.target.value)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className={`info-field ${full ? 'full' : ''}`}>
      <div className="info-field-label">{label}</div>
      {multiline ? (
        <textarea
          className="info-field-value"
          rows={multiline}
          defaultValue={value}
          placeholder={placeholder || '—'}
          onBlur={handleBlur}
        />
      ) : (
        <input
          className="info-field-value"
          defaultValue={value}
          placeholder={placeholder || '—'}
          onBlur={handleBlur}
        />
      )}
      <div className={`field-saved ${saved ? 'show' : ''}`}>✓ Guardado</div>
    </div>
  )
}

export default function InfoCliente() {
  const { currentCliente, clientesInfo, actualizarClienteInfo } = useApp()
  const info = clientesInfo[currentCliente] || {}

  const campos = [
    { fieldId: 'gerencia', label: 'Gerencia / Vertical' },
    { fieldId: 'gerente', label: 'Gerente TSOFT ref.' },
    { fieldId: 'nivelC', label: 'Nivel C', placeholder: 'C1 / C2 / C3 / C4' },
    { fieldId: 'nivelP', label: 'Nivel P actual', placeholder: 'P1 / P2 / P3...' },
    { fieldId: 'herramientas', label: 'Herramientas IA en uso', full: true },
    { fieldId: 'proximoPaso', label: 'Próximo paso', multiline: 2, full: true },
    { fieldId: 'notas', label: 'Notas clave', multiline: 3, full: true },
  ]

  return (
    <div>
      <div
        style={{
          fontSize: 13,
          fontWeight: 600,
          color: 'var(--muted)',
          textTransform: 'uppercase',
          letterSpacing: '0.8px',
          marginBottom: 12,
        }}
      >
        Ficha del cliente
      </div>
      <div className="info-grid">
        {campos.map((c) => (
          <InfoField
            key={c.fieldId}
            label={c.label}
            fieldId={c.fieldId}
            value={info[c.fieldId] || ''}
            placeholder={c.placeholder}
            multiline={c.multiline}
            full={c.full}
            cliente={currentCliente}
            onSave={actualizarClienteInfo}
          />
        ))}
        <div className="info-field full">
          <div className="info-field-label">Champions asignados</div>
          <ChampionsEditor cliente={currentCliente} />
        </div>
      </div>
    </div>
  )
}
