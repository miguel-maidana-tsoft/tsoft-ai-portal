import { OLAS } from '../../constants'

export default function KpiGrid({ resumen }) {
  const clientes = OLAS.flatMap((o) => o.clientes)
  const totalTareas = clientes.reduce((a, c) => a + (resumen[c]?.total || 0), 0)
  const totalCompletadas = clientes.reduce((a, c) => a + (resumen[c]?.completadas || 0), 0)
  const totalEnCurso = clientes.reduce((a, c) => a + (resumen[c]?.enCurso || 0), 0)
  const pctGlobal = totalTareas > 0 ? Math.round((totalCompletadas / totalTareas) * 100) : 0

  return (
    <div className="kpi-grid">
      <div className="kpi-card">
        <div className="kpi-label">Avance global</div>
        <div className="kpi-value red">{pctGlobal}%</div>
        <div className="kpi-sub">
          {totalCompletadas} de {totalTareas} tareas
        </div>
      </div>
      <div className="kpi-card">
        <div className="kpi-label">Clientes Ola 1</div>
        <div className="kpi-value">{clientes.length}</div>
        <div className="kpi-sub">activos en programa</div>
      </div>
      <div className="kpi-card">
        <div className="kpi-label">En curso</div>
        <div className="kpi-value">{totalEnCurso}</div>
        <div className="kpi-sub">tareas activas</div>
      </div>
      <div className="kpi-card">
        <div className="kpi-label">Fase actual</div>
        <div className="kpi-value">F1</div>
        <div className="kpi-sub">Semana 1 · Lanzamiento</div>
      </div>
    </div>
  )
}
