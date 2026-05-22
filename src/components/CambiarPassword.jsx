import { useState } from 'react'
import { useAuth } from '../context/AuthContext'

export default function CambiarPassword({ forced = false, onClose }) {
  const { cambiarPassword, user, logout } = useAuth()
  const [form, setForm] = useState({ actual: '', nueva: '', confirmar: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)

  const [showActual, setShowActual] = useState(false)
  const [showNueva, setShowNueva] = useState(false)
  const [showConfirmar, setShowConfirmar] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)

    if (form.nueva.length < 6) {
      setError('La nueva contraseña debe tener al menos 6 caracteres.')
      return
    }
    if (form.nueva !== form.confirmar) {
      setError('Las contraseñas no coinciden.')
      return
    }

    setLoading(true)
    const res = await cambiarPassword(form.actual, form.nueva)
    setLoading(false)

    if (res.ok) {
      setSuccess(true)
      if (!forced) setTimeout(() => onClose?.(), 1500)
    } else {
      setError(res.error === 'contrasena_incorrecta'
        ? 'La contraseña actual es incorrecta.'
        : 'No se pudo cambiar la contraseña. Intentá de nuevo.')
    }
  }

  const content = (
    <div className="cp-card">
      <div className="cp-brand">
        <div className="login-logo">T<span>SOFT</span></div>
      </div>

      {forced && (
        <div className="cp-forced-notice">
          Es tu primer ingreso. Por seguridad, establecé una contraseña personal antes de continuar.
        </div>
      )}

      <div className="cp-title">{forced ? 'Establecé tu contraseña' : 'Cambiar contraseña'}</div>
      {user && <div className="cp-user">{user.nombre} · {user.email}</div>}

      {success ? (
        <div className="cp-success">
          ✓ Contraseña actualizada correctamente.
          {forced && ' Redirigiendo...'}
        </div>
      ) : (
        <form className="login-form" onSubmit={handleSubmit}>
          <div className="login-field">
            <label className="login-label">Contraseña actual</label>
            <div className="login-input-wrap">
              <input
                className="login-input login-input--password"
                type={showActual ? 'text' : 'password'}
                value={form.actual}
                onChange={(e) => setForm((p) => ({ ...p, actual: e.target.value }))}
                placeholder="Tu contraseña actual"
                autoFocus
                required
              />
              <button type="button" className="login-eye-btn" onClick={() => setShowActual((s) => !s)}>
                {showActual ? '🙈' : '👁'}
              </button>
            </div>
          </div>

          <div className="login-field">
            <label className="login-label">Nueva contraseña</label>
            <div className="login-input-wrap">
              <input
                className="login-input login-input--password"
                type={showNueva ? 'text' : 'password'}
                value={form.nueva}
                onChange={(e) => setForm((p) => ({ ...p, nueva: e.target.value }))}
                placeholder="Mínimo 6 caracteres"
                required
              />
              <button type="button" className="login-eye-btn" onClick={() => setShowNueva((s) => !s)}>
                {showNueva ? '🙈' : '👁'}
              </button>
            </div>
          </div>

          <div className="login-field">
            <label className="login-label">Confirmar nueva contraseña</label>
            <div className="login-input-wrap">
              <input
                className="login-input login-input--password"
                type={showConfirmar ? 'text' : 'password'}
                value={form.confirmar}
                onChange={(e) => setForm((p) => ({ ...p, confirmar: e.target.value }))}
                placeholder="Repetí la nueva contraseña"
                required
              />
              <button type="button" className="login-eye-btn" onClick={() => setShowConfirmar((s) => !s)}>
                {showConfirmar ? '🙈' : '👁'}
              </button>
            </div>
          </div>

          {error && <div className="login-error">{error}</div>}

          <button
            className="login-btn"
            type="submit"
            disabled={loading || !form.actual || !form.nueva || !form.confirmar}
          >
            {loading
              ? <><span className="login-spinner" /> Guardando...</>
              : 'Cambiar contraseña'
            }
          </button>

          {forced && (
            <button type="button" className="cp-logout-link" onClick={logout}>
              Cerrar sesión
            </button>
          )}
        </form>
      )}
    </div>
  )

  if (forced) {
    return (
      <div className="cp-overlay">
        {content}
      </div>
    )
  }

  return (
    <div className="cp-modal-backdrop" onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()}>
        <button className="cp-close-btn" onClick={onClose}>×</button>
        {content}
      </div>
    </div>
  )
}
