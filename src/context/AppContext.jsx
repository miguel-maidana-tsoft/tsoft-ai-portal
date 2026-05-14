import { createContext, useContext, useState, useCallback } from 'react'
import { useApi } from '../hooks/useApi'
import { OLAS, PLATAFORMA_ID, TABLERO_ID } from '../constants'

const NAV_KEY = 'tsoft_nav'

function saveNav(view, cliente, ola) {
  sessionStorage.setItem(NAV_KEY, JSON.stringify({ view, cliente: cliente || null, ola: ola || null }))
}

function loadNav() {
  try { return JSON.parse(sessionStorage.getItem(NAV_KEY)) || {} } catch { return {} }
}

const AppContext = createContext(null)

export function AppProvider({ children }) {
  const { call } = useApi()
  const _nav = loadNav()

  const [currentOla, setCurrentOla] = useState(_nav.ola || OLAS[0].id)
  const [currentCliente, setCurrentCliente] = useState(_nav.cliente || null)
  const [currentFase, setCurrentFase] = useState(1)
  const [tareas, setTareas] = useState({})
  const [resumen, setResumen] = useState({})
  const [clientesInfo, setClientesInfo] = useState({})
  const [assessment, setAssessment] = useState(null)
  const [tablero, setTablero] = useState(null)
  const [view, setView] = useState(_nav.view || 'dashboard')

  // ── Plataforma: Tareas Generales ──────────────────────────
  const [plataformaTareas, setPlataformaTareas] = useState(null)

  // ── Plataforma: Seguimiento (tableroId='Plataforma') ──────
  const [plataformaSeg, setPlataformaSeg] = useState(null)

  // ── Dashboard ─────────────────────────────────────────────
  const loadDashboard = useCallback(async () => {
    const [res, info] = await Promise.all([
      call({ action: 'getResumen' }),
      call({ action: 'getClientesInfo' }),
    ])
    setResumen(res)
    setClientesInfo(info)
  }, [call])

  // ── Tracker ───────────────────────────────────────────────
  const loadTareas = useCallback(async (cliente, ola) => {
    const olaParam = ola || currentOla
    const data = await call({ action: 'getTareas', ola: olaParam, cliente })
    setTareas((prev) => ({ ...prev, [cliente]: data }))
  }, [call, currentOla])

  const actualizarEstado = useCallback(async (tareaId, nuevoEstado, cliente, faseId) => {
    setTareas((prev) => {
      const copia = { ...prev }
      if (copia[cliente]?.[faseId]) {
        copia[cliente] = { ...copia[cliente] }
        copia[cliente][faseId] = copia[cliente][faseId].map((t) =>
          t.id === tareaId ? { ...t, estado: nuevoEstado } : t
        )
      }
      return copia
    })
    await call({ action: 'actualizarEstado', tareaId, estado: nuevoEstado })
  }, [call])

  const agregarTarea = useCallback(async (texto, cliente, faseId) => {
    const ola = (cliente === PLATAFORMA_ID || cliente === TABLERO_ID) ? cliente : currentOla
    const result = await call({ action: 'agregarTarea', ola, cliente, faseId, texto })
    if (result.success) {
      setTareas((prev) => {
        const copia = { ...prev }
        copia[cliente] = { ...copia[cliente] }
        copia[cliente][faseId] = [
          ...(copia[cliente]?.[faseId] || []),
          { id: result.id, texto, estado: 'Pendiente', notas: '' },
        ]
        return copia
      })
    }
    return result
  }, [call, currentOla])

  const eliminarTarea = useCallback(async (tareaId, cliente, faseId) => {
    await call({ action: 'eliminarTarea', tareaId })
    setTareas((prev) => {
      const copia = { ...prev }
      copia[cliente] = { ...copia[cliente] }
      copia[cliente][faseId] = copia[cliente][faseId].filter((t) => t.id !== tareaId)
      return copia
    })
  }, [call])

  const actualizarClienteInfo = useCallback(async (cliente, campo, valor) => {
    setClientesInfo((prev) => ({
      ...prev,
      [cliente]: { ...(prev[cliente] || {}), [campo]: valor },
    }))
    await call({ action: 'actualizarClienteInfo', cliente, campo, valor })
  }, [call])

  // ── Assessment ────────────────────────────────────────────
  const loadAssessment = useCallback(async () => {
    const data = await call({ action: 'getAssessment' })
    setAssessment(Array.isArray(data) ? data : [])
  }, [call])

  // ── Tablero General ───────────────────────────────────────
  const loadTablero = useCallback(async () => {
    const data = await call({ action: 'getTablero', tableroId: 'General' })
    setTablero(Array.isArray(data) ? data : [])
  }, [call])

  const agregarTableroTarea = useCallback(async (bloque, texto, detalle, semana, responsable) => {
    const tempId = 'temp_' + Date.now()
    setTablero((prev) => [
      ...(prev || []),
      { id: tempId, tableroId: 'General', bloque, texto, detalle: detalle || '', semana: semana || '',
        responsable: responsable || '', estado: 'Pendiente', notas: '', orden: 999999, _saving: true },
    ])
    const result = await call({ action: 'agregarTableroTarea', tableroId: 'General', bloque, texto, detalle, semana, responsable })
    if (result.success) {
      setTablero((prev) => prev.map((t) => t.id === tempId ? { ...t, id: result.id, _saving: false } : t))
    } else {
      setTablero((prev) => prev.filter((t) => t.id !== tempId))
    }
    return result
  }, [call])

  const actualizarTableroTarea = useCallback(async (id, campo, valor) => {
    setTablero((prev) => prev.map((t) => t.id === id ? { ...t, [campo]: valor } : t))
    await call({ action: 'actualizarTableroTarea', tableroId: 'General', id, campo, valor })
  }, [call])

  const eliminarTableroTarea = useCallback(async (id) => {
    setTablero((prev) => prev.filter((t) => t.id !== id))
    await call({ action: 'eliminarTableroTarea', tableroId: 'General', id })
  }, [call])

  const reordenarTableroBloque = useCallback(async (bloque, orderedIds) => {
    setTablero((prev) => {
      if (!prev) return prev
      const other = prev.filter((t) => t.bloque !== bloque)
      const reordered = orderedIds.map((id) => prev.find((t) => t.id === id)).filter(Boolean)
      return [...other, ...reordered]
    })
    await call({ action: 'reordenarTableroBloque', tableroId: 'General', bloque, orderedIds: orderedIds.join(',') })
  }, [call])

  // ── Plataforma: Tareas Generales ──────────────────────────
  const loadPlataformaTareas = useCallback(async () => {
    const data = await call({ action: 'getPlataformaTareas' })
    setPlataformaTareas(Array.isArray(data) ? data : [])
  }, [call])

  const agregarPlataformaTarea = useCallback(async (texto, descripcion) => {
    const tempId = 'temp_' + Date.now()
    setPlataformaTareas((prev) => [
      ...(prev || []),
      { id: tempId, texto, descripcion: descripcion || '', estado: 'Pendiente', fecha_creacion: new Date().toISOString(), orden: 999999, _saving: true },
    ])
    const result = await call({ action: 'agregarPlataformaTarea', texto, descripcion })
    if (result.success) {
      setPlataformaTareas((prev) => prev.map((t) => t.id === tempId ? { ...t, id: result.id, _saving: false } : t))
    } else {
      setPlataformaTareas((prev) => prev.filter((t) => t.id !== tempId))
    }
    return result
  }, [call])

  const actualizarPlataformaTarea = useCallback(async (id, campo, valor) => {
    setPlataformaTareas((prev) => prev.map((t) => t.id === id ? { ...t, [campo]: valor } : t))
    await call({ action: 'actualizarPlataformaTarea', id, campo, valor })
  }, [call])

  const eliminarPlataformaTarea = useCallback(async (id) => {
    setPlataformaTareas((prev) => prev.filter((t) => t.id !== id))
    await call({ action: 'eliminarPlataformaTarea', id })
  }, [call])

  // ── Plataforma: Seguimiento ───────────────────────────────
  const loadPlataformaSeg = useCallback(async () => {
    const data = await call({ action: 'getTablero', tableroId: 'Plataforma' })
    setPlataformaSeg(Array.isArray(data) ? data : [])
  }, [call])

  const agregarSegTarea = useCallback(async (bloque, texto, detalle, prioridad) => {
    const tempId = 'temp_' + Date.now()
    setPlataformaSeg((prev) => [
      ...(prev || []),
      { id: tempId, tableroId: 'Plataforma', bloque, texto, detalle: detalle || '',
        prioridad: prioridad || 'media', estado: 'Pendiente', notas: '', orden: 999999, _saving: true },
    ])
    const result = await call({
      action: 'agregarTableroTarea',
      tableroId: 'Plataforma', bloque, texto,
      detalle: detalle || '', semana: '', responsable: '',
      prioridad: prioridad || 'media',
    })
    if (result.success) {
      setPlataformaSeg((prev) => prev.map((t) => t.id === tempId ? { ...t, id: result.id, _saving: false } : t))
    } else {
      setPlataformaSeg((prev) => prev.filter((t) => t.id !== tempId))
    }
    return result
  }, [call])

  const actualizarSegTarea = useCallback(async (id, campo, valor) => {
    setPlataformaSeg((prev) => prev.map((t) => t.id === id ? { ...t, [campo]: valor } : t))
    await call({ action: 'actualizarTableroTarea', tableroId: 'Plataforma', id, campo, valor })
  }, [call])

  const eliminarSegTarea = useCallback(async (id) => {
    setPlataformaSeg((prev) => prev.filter((t) => t.id !== id))
    await call({ action: 'eliminarTableroTarea', tableroId: 'Plataforma', id })
  }, [call])

  const reordenarSegBloque = useCallback(async (bloque, orderedIds) => {
    setPlataformaSeg((prev) => {
      if (!prev) return prev
      const other = prev.filter((t) => t.bloque !== bloque)
      const reordered = orderedIds.map((id) => prev.find((t) => t.id === id)).filter(Boolean)
      return [...other, ...reordered]
    })
    await call({ action: 'reordenarTableroBloque', tableroId: 'Plataforma', bloque, orderedIds: orderedIds.join(',') })
  }, [call])

  const eliminarSegBloque = useCallback(async (bloque) => {
    setPlataformaSeg((prev) => prev.filter((t) => t.bloque !== bloque))
    await call({ action: 'eliminarTableroBloque', tableroId: 'Plataforma', bloque })
  }, [call])

  const renombrarSegBloque = useCallback(async (oldBloque, newBloque) => {
    setPlataformaSeg((prev) => prev.map((t) => t.bloque === oldBloque ? { ...t, bloque: newBloque } : t))
    await call({ action: 'renombrarTableroBloque', tableroId: 'Plataforma', oldBloque, newBloque })
  }, [call])

  // ── Navegación ────────────────────────────────────────────
  const openTracker = useCallback((cliente, ola) => {
    const olaId = ola || OLAS[0].id
    setCurrentCliente(cliente)
    setCurrentOla(olaId)
    setCurrentFase(1)
    setView('tracker')
    saveNav('tracker', cliente, olaId)
  }, [])

  const openPlataforma = useCallback(() => {
    setCurrentCliente(PLATAFORMA_ID)
    setCurrentOla(PLATAFORMA_ID)
    setCurrentFase(1)
    setView('plataforma')
    saveNav('plataforma', PLATAFORMA_ID, PLATAFORMA_ID)
  }, [])

  const openTablero = useCallback(() => {
    setCurrentCliente(TABLERO_ID)
    setCurrentOla(TABLERO_ID)
    setView('tablero')
    saveNav('tablero', TABLERO_ID, TABLERO_ID)
  }, [])

  const openAssessment = useCallback(() => {
    setView('assessment')
    saveNav('assessment', null, null)
  }, [])

  const goToDashboard = useCallback(() => {
    setView('dashboard')
    saveNav('dashboard', null, null)
  }, [])

  return (
    <AppContext.Provider
      value={{
        currentOla, setCurrentOla,
        currentCliente, setCurrentCliente,
        currentFase, setCurrentFase,
        tareas, resumen, clientesInfo, assessment, tablero,
        plataformaTareas, plataformaSeg,
        view,
        loadDashboard,
        loadTareas,
        loadAssessment,
        loadTablero,
        agregarTableroTarea,
        actualizarTableroTarea,
        eliminarTableroTarea,
        reordenarTableroBloque,
        actualizarEstado,
        agregarTarea,
        eliminarTarea,
        actualizarClienteInfo,
        // Plataforma Tareas Generales
        loadPlataformaTareas,
        agregarPlataformaTarea,
        actualizarPlataformaTarea,
        eliminarPlataformaTarea,
        // Plataforma Seguimiento
        loadPlataformaSeg,
        agregarSegTarea,
        actualizarSegTarea,
        eliminarSegTarea,
        reordenarSegBloque,
        eliminarSegBloque,
        renombrarSegBloque,
        // Nav
        openTracker,
        openPlataforma,
        openTablero,
        openAssessment,
        goToDashboard,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  return useContext(AppContext)
}
