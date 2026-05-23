import { useState } from 'react'

const ROLES = [
  'Dev Frontend',
  'Dev Backend',
  'QA / Testing',
  'Analista Funcional',
  'Arquitecto de Soluciones',
  'Tech Lead',
  'Project Manager',
  'UX / Diseño',
  'Otro',
]

export default function Register({ onSubmit }) {
  const [name, setName] = useState('')
  const [role, setRole] = useState('')

  function handleSubmit() {
    if (!name.trim() || !role) return
    onSubmit(name.trim(), role)
  }

  return (
    <div className="quiz-screen">
      <div className="screen-label">Paso previo</div>
      <h2 className="quiz-h2">¿Quién sos?</h2>
      <p className="subtitle" style={{ marginBottom: '1.5rem' }}>
        Tu nombre y rol se envían junto con tus resultados al equipo TSoft.
      </p>

      <div className="qcard" style={{ padding: '1.8rem' }}>
        <div className="form-group">
          <label>Nombre completo</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Tu nombre"
            autoComplete="off"
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
          />
        </div>
        <div className="form-group">
          <label>Tu rol en TSoft</label>
          <select value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="">— Seleccioná tu rol —</option>
            {ROLES.map((r) => <option key={r}>{r}</option>)}
          </select>
        </div>
        <button
          className="btn btn-primary"
          onClick={handleSubmit}
          disabled={!name.trim() || !role}
          style={{ width: '100%', justifyContent: 'center' }}
        >
          Comenzar el test <span style={{ fontSize: '1.1rem' }}>›</span>
        </button>
      </div>
    </div>
  )
}
