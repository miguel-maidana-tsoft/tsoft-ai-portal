import { createContext, useContext, useState, useCallback } from 'react'
import { useApi } from '../hooks/useApi'
import { OLAS, PLATAFORMA_ID, TABLERO_ID } from '../constants'

const AppContext = createContext(null)

export function AppProvider({ children }) {
  const { call } = useApi()

  const [currentOla, setCurrentOla] = useState(OLAS[0].id)
  const [currentCliente, setCurrentCliente] = useState(null)
  const [currentFase, setCurrentFase] = useState(1)
  const [tareas, setTareas] = useState({})
  const [resumen, setResumen] = useState({})
  const [clientesInfo, setClientesInfo] = useState({})
  const [assessment, setAssessment] = useState(null) // null = no cargado, [] = cargado vacío
  const [tablero, setTablero] = useState(null)        // null = no cargado, [] = cargado vacío
  const [view, setView] = useState('dashboard')

  const loadDashboard = useCallback(async () => {
    const [res, info] = await Promise.all([
      call({ action: 'getResumen' }),
      call({ action: 'getClientesInfo' }),
    ])
    setResumen(res)
    setClientesInfo(info)
  }, [call])

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

  const openTracker = useCallback((cliente, ola) => {
    setCurrentCliente(cliente)
    setCurrentOla(ola || OLAS[0].id)
    setCurrentFase(1)
    setView('tracker')
  }, [])

  const openPlataforma = useCallback(() => {
    setCurrentCliente(PLATAFORMA_ID)
    setCurrentOla(PLATAFORMA_ID)
    setCurrentFase(1)
    setView('plataforma')
  }, [])

  const loadAssessment = useCallback(async () => {
    const data = await call({ action: 'getAssessment' })
    setAssessment(Array.isArray(data) ? data : [])
  }, [call])

  const loadTablero = useCallback(async () => {
    const data = await call({ action: 'getTablero' })
    setTablero(Array.isArray(data) ? data : [])
  }, [call])

  const agregarTableroTarea = useCallback(async (bloque, texto, detalle, semana, responsable) => {
    const result = await call({ action: 'agregarTableroTarea', bloque, texto, detalle, semana, responsable })
    if (result.success) {
      setTablero((prev) => [
        ...(prev || []),
        { id: result.id, bloque, texto, detalle: detalle || '', semana: semana || '',
          responsable: responsable || '', estado: 'Pendiente', notas: '' },
      ])
    }
    return result
  }, [call])

  const actualizarTableroTarea = useCallback(async (id, campo, valor) => {
    setTablero((prev) => prev.map((t) => t.id === id ? { ...t, [campo]: valor } : t))
    await call({ action: 'actualizarTableroTarea', id, campo, valor })
  }, [call])

  const eliminarTableroTarea = useCallback(async (id) => {
    setTablero((prev) => prev.filter((t) => t.id !== id))
    await call({ action: 'eliminarTableroTarea', id })
  }, [call])

  const reordenarTableroBloque = useCallback(async (bloque, orderedIds) => {
    setTablero((prev) => {
      if (!prev) return prev
      const other = prev.filter((t) => t.bloque !== bloque)
      const reordered = orderedIds.map((id) => prev.find((t) => t.id === id)).filter(Boolean)
      return [...other, ...reordered]
    })
    await call({ action: 'reordenarTableroBloque', bloque, orderedIds: orderedIds.join(',') })
  }, [call])

  const openTablero = useCallback(() => {
    setCurrentCliente(TABLERO_ID)
    setCurrentOla(TABLERO_ID)
    setView('tablero')
  }, [])

  const openAssessment = useCallback(() => {
    setView('assessment')
  }, [])

  const goToDashboard = useCallback(() => {
    setView('dashboard')
  }, [])

  return (
    <AppContext.Provider
      value={{
        currentOla, setCurrentOla,
        currentCliente, setCurrentCliente,
        currentFase, setCurrentFase,
        tareas, resumen, clientesInfo, assessment, tablero,
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
