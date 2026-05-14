import { createContext, useContext, useState, useCallback } from 'react'
import { useApi } from '../hooks/useApi'

const AuthContext = createContext(null)

const SESSION_KEY = 'tsoft_auth'
const SESSION_TTL = 8 * 60 * 60 * 1000 // 8 horas

function loadSession() {
  try {
    const raw = localStorage.getItem(SESSION_KEY)
    if (!raw) return null
    const { user, loginAt } = JSON.parse(raw)
    if (Date.now() - loginAt > SESSION_TTL) {
      localStorage.removeItem(SESSION_KEY)
      return null
    }
    return user
  } catch {
    return null
  }
}

const ERROR_LABELS = {
  usuario_no_encontrado: 'Email o contraseña incorrectos.',
  contrasena_incorrecta: 'Email o contraseña incorrectos.',
  error_conexion: 'No se pudo conectar al servidor. Verificá tu conexión.',
  error_desconocido: 'Algo salió mal. Intentá de nuevo.',
}

export const ROL_LABELS = {
  admin: 'Administrador',
  'plataforma-agentica': 'Plataforma Agéntica',
}

export function AuthProvider({ children }) {
  const { call } = useApi()
  const [user, setUser] = useState(() => loadSession())
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const login = useCallback(async (email, password) => {
    setLoading(true)
    setError(null)
    try {
      const res = await call({ action: 'login', email, password })
      if (res.ok) {
        const secciones = Array.isArray(res.usuario.secciones)
          ? res.usuario.secciones
          : (res.usuario.secciones || '').split(',').filter(Boolean)
        const userData = { ...res.usuario, secciones }
        localStorage.setItem(SESSION_KEY, JSON.stringify({ user: userData, loginAt: Date.now() }))
        setUser(userData)
        return { ok: true }
      } else {
        const errKey = res.error || 'error_desconocido'
        setError(errKey)
        return { ok: false, error: errKey }
      }
    } catch {
      setError('error_conexion')
      return { ok: false, error: 'error_conexion' }
    } finally {
      setLoading(false)
    }
  }, [call])

  const logout = useCallback(() => {
    localStorage.removeItem(SESSION_KEY)
    setUser(null)
    setError(null)
  }, [])

  const canAccess = useCallback((seccion) => {
    if (!user) return false
    return user.secciones.includes(seccion)
  }, [user])

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      error,
      errorLabel: ERROR_LABELS[error] || (error ? ERROR_LABELS.error_desconocido : null),
      login,
      logout,
      canAccess,
      isAuthenticated: !!user,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
