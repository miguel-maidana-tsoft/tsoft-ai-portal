import { useEffect, useState } from 'react'
import { useApp } from '../../context/AppContext'
import { FASES, OLAS } from '../../constants'
import ClienteCard from './ClienteCardAccordion'
import DashboardFilters from './DashboardFilters'
import DashboardHero from './DashboardHero'
import PhaseProgressPanel from './PhaseProgressPanel'
import OlaProgressPanel from './OlaProgressPanel'
import ClientPhaseMatrix from './ClientPhaseMatrix'
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

function getDashboardSummary(clientes, resumen) {
  const totalItems = clientes.reduce((acc, cliente) => acc + (resumen[cliente]?.total || 0), 0)
  const totalCompletados = clientes.reduce((acc, cliente) => acc + (resumen[cliente]?.completados || 0), 0)
  const clientesConItems = clientes.filter((cliente) => (resumen[cliente]?.total || 0) > 0).length
  const clientesCompletos = clientes.filter((cliente) => (resumen[cliente]?.pct || 0) === 100).length
  const clientesSinIniciar = clientes.filter((cliente) => (resumen[cliente]?.pct || 0) === 0).length

  return {
    totalItems,
    totalCompletados,
    pctGlobal: totalItems > 0 ? Math.round((totalCompletados / totalItems) * 100) : 0,
    clientesTotales: clientes.length,
    clientesConItems,
    clientesCompletos,
    clientesSinIniciar,
    olasActivas: OLAS.filter((ola) => ola.clientes.some((cliente) => clientes.includes(cliente))).map((ola) => ola.id),
  }
}

function getPhaseSummary(clientes, resumen) {
  return FASES.map((fase) => {
    const total = clientes.reduce((acc, cliente) => acc + (resumen[cliente]?.porFase?.[fase.id]?.total || 0), 0)
    const completados = clientes.reduce((acc, cliente) => acc + (resumen[cliente]?.porFase?.[fase.id]?.completados || 0), 0)
    const pct = total > 0 ? Math.round((completados / total) * 100) : 0
    return { ...fase, total, completados, pct }
  })
}

function getOlaSummary(resumen, filtros) {
  return OLAS
    .filter((ola) => filtros.ola === 'todos' || filtros.ola === ola.id)
    .map((ola) => {
      const clientes = ola.clientes
      const total = clientes.reduce((acc, cliente) => acc + (resumen[cliente]?.total || 0), 0)
      const completados = clientes.reduce((acc, cliente) => acc + (resumen[cliente]?.completados || 0), 0)
      const pct = total > 0 ? Math.round((completados / total) * 100) : 0
      return {
        id: ola.id,
        pct,
        clientesTotales: clientes.length,
        clientesActivos: clientes.filter((cliente) => (resumen[cliente]?.total || 0) > 0).length,
        clientesCompletos: clientes.filter((cliente) => (resumen[cliente]?.pct || 0) === 100).length,
      }
    })
}

function getFocusClients(clientesFiltrados, resumen) {
  return clientesFiltrados
    .map(({ cliente, olaId }) => ({
      cliente,
      olaId,
      pct: resumen[cliente]?.pct || 0,
      completados: resumen[cliente]?.completados || 0,
      total: resumen[cliente]?.total || 0,
    }))
    .sort((a, b) => a.pct - b.pct || a.total - b.total)
    .slice(0, 4)
}

function getMatrixRows(clientesFiltrados, resumen) {
  return clientesFiltrados.map(({ cliente, olaId }) => ({
    cliente,
    olaId,
    pct: resumen[cliente]?.pct || 0,
    fases: FASES.map((fase) => ({
      id: fase.id,
      pct: resumen[cliente]?.porFase?.[fase.id]?.pct || 0,
    })),
  }))
}

export default function Dashboard() {
  const { resumen, clientesInfo, checklist, loadDashboard, openTracker } = useApp()
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
  const clientesFiltradosIds = clientesFiltrados.map(({ cliente }) => cliente)
  const summary = getDashboardSummary(clientesFiltradosIds, resumen)
  const phaseSummary = getPhaseSummary(clientesFiltradosIds, resumen)
  const olaSummary = getOlaSummary(resumen, filtros)
  const focusClients = getFocusClients(clientesFiltrados, resumen)
  const matrixRows = getMatrixRows(clientesFiltrados, resumen)
  const phaseMostDelayed = [...phaseSummary]
    .filter((phase) => phase.total > 0)
    .sort((a, b) => a.pct - b.pct)[0] || null
  const olaMostDelayed = [...olaSummary]
    .filter((ola) => ola.clientesActivos > 0)
    .sort((a, b) => a.pct - b.pct)[0] || null

  const hayFiltrosActivos = filtros.ola !== 'todos' || filtros.avance !== 'todos'

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Dashboard</div>
          <div className="page-subtitle">Estado general del programa — Argentina 2026</div>
        </div>
      </div>

      {!loaded ? (
        <Spinner />
      ) : (
        <>
          <DashboardHero
            summary={{ ...summary, phaseMostDelayed, olaMostDelayed }}
            focus={focusClients}
          />

          <div className="dashboard-overview-grid">
            <PhaseProgressPanel phases={phaseSummary} />
            <OlaProgressPanel olas={olaSummary} />
          </div>

          <ClientPhaseMatrix rows={matrixRows} onOpenTracker={openTracker} />

          <div className="dashboard-detail-head">
            <div>
              <div className="dashboard-section-eyebrow">Seguimiento</div>
              <h3 className="dashboard-panel-title">Detalle por cliente</h3>
            </div>
          </div>

          <DashboardFilters filtros={filtros} onChange={setFiltros} />

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
              {clientesFiltrados.map(({ cliente, olaId }) => (
                <ClienteCard
                  key={cliente}
                  cliente={cliente}
                  olaId={olaId}
                  resumen={resumen[cliente]}
                  info={clientesInfo[cliente]}
                  items={checklist[cliente] || []}
                  onOpenTracker={openTracker}
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}
