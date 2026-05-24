import { useState } from 'react'
import { CLIENTES, ROLES } from '../data'

export default function Register({ onSubmit }) {
  const [nombre, setNombre]   = useState('')
  const [cliente, setCliente] = useState('')
  const [rol, setRol]         = useState('')
  const [errors, setErrors]   = useState({})

  function handleNext() {
    const e = {}
    if (!nombre.trim()) e.nombre  = true
    if (!cliente)       e.cliente = true
    if (!rol)           e.rol     = true
    if (Object.keys(e).length) { setErrors(e); return }
    onSubmit({ nombre: nombre.trim(), cliente, rol })
  }

  return (
    <div className="as-screen">
      <div className="as-screen-label">Datos del colaborador</div>
      <h1 className="as-h1">Antes de arrancar,<br />contanos sobre vos</h1>
      <div className="as-red-line" />
      <p className="as-subtitle">Esta info le llega al líder junto con tu resultado.</p>

      <div className="as-card">
        <label className="as-field-label">Nombre completo</label>
        <input
          type="text"
          className={`as-input${errors.nombre ? ' as-input--error' : ''}`}
          placeholder="Tu nombre y apellido"
          value={nombre}
          onChange={(e) => { setNombre(e.target.value); setErrors((p) => ({ ...p, nombre: false })) }}
          style={{ marginBottom: '1rem' }}
        />

        <label className="as-field-label">Cliente / proyecto donde trabajás actualmente</label>
        <select
          className={`as-input${errors.cliente ? ' as-input--error' : ''}`}
          value={cliente}
          onChange={(e) => { setCliente(e.target.value); setErrors((p) => ({ ...p, cliente: false })) }}
          style={{ marginBottom: '1rem' }}
        >
          <option value="">— Seleccioná —</option>
          {CLIENTES.map((c) => <option key={c}>{c}</option>)}
        </select>

        <label className="as-field-label">¿Cuál es tu rol principal?</label>
        {errors.rol && <p className="as-error-msg" style={{ display: 'block', marginBottom: '0.5rem' }}>Seleccioná tu rol.</p>}
        <div className="as-role-grid">
          {ROLES.map((r) => (
            <div
              key={r.id}
              className={`as-role-card${rol === r.id ? ' selected' : ''}`}
              onClick={() => { setRol(r.id); setErrors((p) => ({ ...p, rol: false })) }}
            >
              <div className="as-role-name">{r.name}</div>
              <div className="as-role-sub">{r.sub}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="as-nav">
        <div />
        <button className="as-btn as-btn--primary" onClick={handleNext}>Siguiente →</button>
      </div>
    </div>
  )
}
