import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'

function EyeIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  )
}

function EyeOffIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  )
}

export default function Login() {
  const { login, loading, errorLabel } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    if (loading) return
    await login(email.trim().toLowerCase(), password)
  }

  return (
    <div className="login-wrap">
      <div className="login-card">
        <div className="login-brand">
          <div className="login-logo">TSOFT<span>▶</span></div>
          <div className="login-brand-sub">AI Program · Portal de Seguimiento</div>
        </div>

        <h1 className="login-title">Iniciar sesión</h1>
        <p className="login-subtitle">Ingresá con tu cuenta TSOFT</p>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="login-field">
            <label className="login-label">Email</label>
            <input
              type="email"
              className="login-input"
              placeholder="nombre@tsoftglobal.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoFocus
              autoComplete="email"
            />
          </div>

          <div className="login-field">
            <label className="login-label">Contraseña</label>
            <div className="login-input-wrap">
              <input
                type={showPassword ? 'text' : 'password'}
                className="login-input login-input--password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
              <button
                type="button"
                className="login-eye-btn"
                onClick={() => setShowPassword((v) => !v)}
                tabIndex={-1}
                aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
              >
                {showPassword ? <EyeOffIcon /> : <EyeIcon />}
              </button>
            </div>
          </div>

          {errorLabel && (
            <div className="login-error">{errorLabel}</div>
          )}

          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? (
              <><span className="login-spinner" /> Verificando...</>
            ) : (
              'Ingresar'
            )}
          </button>
        </form>

        <p className="login-footer">
          Acceso restringido a usuarios del programa IA · TSOFT Argentina
        </p>
      </div>
    </div>
  )
}
