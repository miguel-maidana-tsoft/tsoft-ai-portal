import { useEffect, useState } from 'react'
import { useApp } from '../../context/AppContext'
import { OLAS } from '../../constants'
import KpiGrid from './KpiGrid'
import ClienteCard from './ClienteCard'
import Filtros from './Filtros'
import Spinner from '../Spinner'

const FILTROS_DEFAULT = { ola: 'todos', avance: 'todos' }

function clienteMatchesFiltros(cliente, olaId, resumen, filtros) {
  if (filtros.ola !== 'todos' && filtros.ola !== olaId) return false

  const r = resumen[cliente] || {}
  const pct = r.pct || 0
  if (filtros.avance === 'sin-empezar' && pct !== 0) return false
  if (filtros.avance === 'en-progreso' && (pct === 0 || pct === 100)) return false
  if (filtros.avance === 'completado' && pct !== 100) return false

  return true
}

export default function Dashboard() {
  const { resumen, clientesInfo, checklist, loadDashboard } = useApp()
  const [filtros, setFiltros] = useState(FILTROS_DEFAULT)
  const loaded = Object.keys(resumen).length > 0

  useEffect(() => {
    loadDashboard()
  }, [loadDashboard])

  const clientesFiltrados = OLAS.flatMap((o) =>
    o.clientes
      .filter((c) => clienteMatchesFiltros(c, o.id, resumen, filtros))
      .map((c) => ({ cliente: c, olaId: o.id }))
  )

  const hayFiltrosActivos = filtros.ola !== 'todos' || filtros.avance !== 'todos'

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Dashboard · Ola 1</div>
          <div className="page-subtitle">Estado general del programa — Argentina 2026</div>
        </div>
      </div>

      {!loaded ? (
        <Spinner />
      ) : (
        <>
          <KpiGrid resumen={resumen} />
          <Filtros filtros={filtros} onChange={setFiltros} />

          {clientesFiltrados.length === 0 ? (
            <div className="filtros-empty">
              {filtros.avance === 'completado'
                ? 'Ningún cliente tiene el 100% de todas las fases completado todavía.'
                : 'Ningún cliente coincide con los filtros.'}
              {' '}
              <button className="filtros-reset" onClick={() => setFiltros(FILTROS_DEFAULT)}>
                Limpiar filtros
              </button>
            </div>
          ) : (
            <div className="clientes-grid">
              {clientesFiltrados.map(({ cliente }) => (
                <ClienteCard
                  key={cliente}
                  cliente={cliente}
                  resumen={resumen[cliente]}
                  info={clientesInfo[cliente]}
                  items={checklist[cliente] || []}
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}
