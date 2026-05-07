import { createContext, useContext, useState, useCallback } from 'react'
import { useApi } from '../hooks/useApi'
import { OLAS } from '../constants'

const AppContext = createContext(null)

export function AppProvider({ children }) {
  const { call } = useApi()

  const [currentOla, setCurrentOla] = useState(OLAS[0].id)
  const [currentCliente, setCurrentCliente] = useState(null)
  const [currentFase, setCurrentFase] = useState(1)
  const [tareas, setTareas] = useState({})
  const [resumen, setResumen] = useState({})
  const [clientesInfo, setClientesInfo] = useState({})
  const [view, setView] = useState('dashboard')

  const loadDashboard = useCallback(async () => {
    const [res, info] = await Promise.all([
      call({ action: 'getResumen' }),
      call({ action: 'getClientesInfo' }),
    ])
    setResumen(res)
    setClientesInfo(info)
  }, [call])

  const loadTareas = useCallback(async (cliente) => {
    const data = await call({ action: 'getTareas', ola: currentOla, cliente })
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
    const result = await call({
      action: 'agregarTarea',
      ola: currentOla,
      cliente,
      faseId,
      texto,
    })
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

  const openTracker = useCallback((cliente) => {
    setCurrentCliente(cliente)
    setCurrentFase(1)
    setView('tracker')
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
        tareas, resumen, clientesInfo,
        view,
        loadDashboard,
        loadTareas,
        actualizarEstado,
        agregarTarea,
        eliminarTarea,
        actualizarClienteInfo,
        openTracker,
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
