import { OLAS } from '../../constants'

export default function KpiGrid({ resumen }) {
  const clientes = OLAS.flatMap((o) => o.clientes)
  const totalItems = clientes.reduce((a, c) => a + (resumen[c]?.total || 0), 0)
  const totalCompletados = clientes.reduce((a, c) => a + (resumen[c]?.completados || 0), 0)
  const clientesConItems = clientes.filter((c) => (resumen[c]?.total || 0) > 0).length
  const pctGlobal = totalItems > 0 ? Math.round((totalCompletados / totalItems) * 100) : 0
  const olasActivas = OLAS.filter((o) => o.clientes.length > 0)

  return (
    <div className="kpi-grid">
      <div className="kpi-card">
        <div className="kpi-label">Avance global</div>
        <div className="kpi-value red">{pctGlobal}%</div>
        <div className="kpi-sub">{totalCompletados} de {totalItems} ítems</div>
      </div>
      <div className="kpi-card">
        <div className="kpi-label">Clientes en programa</div>
        <div className="kpi-value">{clientes.length}</div>
        <div className="kpi-sub">{olasActivas.map((o) => o.id).join(' · ')}</div>
      </div>
      <div className="kpi-card">
        <div className="kpi-label">Con checklist</div>
        <div className="kpi-value">{clientesConItems}</div>
        <div className="kpi-sub">clientes con ítems cargados</div>
      </div>
      <div className="kpi-card">
        <div className="kpi-label">Completados</div>
        <div className="kpi-value">{totalCompletados}</div>
        <div className="kpi-sub">ítems finalizados</div>
      </div>
    </div>
  )
}
