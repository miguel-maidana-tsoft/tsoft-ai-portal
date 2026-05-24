import { useState } from 'react'
import { SUPER_ADMIN_CODE, LIDER_CODES } from '../data'

export default function LiderLogin({ onSuccess, onBack }) {
  const [pass, setPass]   = useState('')
  const [error, setError] = useState(false)

  function handleSubmit(e) {
    e.preventDefault()
    const v = pass.trim()
    if (v === SUPER_ADMIN_CODE) {
      onSuccess(null) // null = super admin
    } else if (LIDER_CODES[v]) {
      onSuccess(LIDER_CODES[v])
    } else {
      setError(true)
    }
  }

  return (
    <div className="as-screen">
      <div className="as-screen-label">Acceso líder</div>
      <h1 className="as-h1">Ingresá el código<br />de acceso</h1>
      <div className="as-red-line" />

      <form className="as-card" onSubmit={handleSubmit}>
        <label className="as-field-label">Código de acceso</label>
        <input
          type="password"
          className={`as-input${error ? ' as-input--error' : ''}`}
          placeholder="Ingresá el código de tu proyecto"
          value={pass}
          onChange={(e) => { setPass(e.target.value); setError(false) }}
          autoFocus
        />
        <p className="as-field-hint">
          Cada líder tiene el código de su proyecto. Si sos Super Admin usá el código maestro.
        </p>
        {error && <p className="as-error-msg">Código incorrecto. Intentá de nuevo.</p>}
        <div className="as-btn-row" style={{ marginTop: '1.2rem' }}>
          <button type="submit" className="as-btn as-btn--primary">Ingresar</button>
          <button type="button" className="as-btn" onClick={onBack}>Volver</button>
        </div>
      </form>
    </div>
  )
}
