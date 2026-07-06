import DashboardKpis from './DashboardKpis'
import ProgressDonut from './ProgressDonut'

export default function DashboardHero({ summary, focus }) {
  const {
    pctGlobal,
    totalCompletados,
    totalItems,
    phaseMostDelayed,
    olaMostDelayed,
    clientesSinIniciar,
  } = summary

  return (
    <section className="dashboard-hero">
      <div className="dashboard-hero-main">
        <div className="dashboard-hero-copy">
          <div className="dashboard-section-eyebrow">Programa IA</div>
          <h2 className="dashboard-hero-title">Lectura ejecutiva del avance del programa</h2>
          <p className="dashboard-hero-text">
            El dashboard prioriza el estado general, las fases con más fricción y los clientes que necesitan seguimiento.
          </p>
        </div>

        <div className="dashboard-hero-insights">
          <div className="dashboard-insight-card">
            <div className="dashboard-insight-label">Fase más atrasada</div>
            <div className="dashboard-insight-value">{phaseMostDelayed?.nombre || 'Sin datos'}</div>
            <div className="dashboard-insight-sub">{phaseMostDelayed ? `${phaseMostDelayed.pct}% completado` : 'Todavía sin checklist oficial'}</div>
          </div>
          <div className="dashboard-insight-card">
            <div className="dashboard-insight-label">Ola a priorizar</div>
            <div className="dashboard-insight-value">{olaMostDelayed?.id || 'Sin datos'}</div>
            <div className="dashboard-insight-sub">{olaMostDelayed ? `${olaMostDelayed.pct}% de avance oficial` : 'Sin clientes con carga'}</div>
          </div>
          <div className="dashboard-insight-card">
            <div className="dashboard-insight-label">Sin iniciar</div>
            <div className="dashboard-insight-value">{clientesSinIniciar}</div>
            <div className="dashboard-insight-sub">clientes con 0% o sin items</div>
          </div>
        </div>
      </div>

      <div className="dashboard-hero-side">
        <ProgressDonut
          value={pctGlobal}
          completed={totalCompletados}
          total={totalItems}
        />
        <div className="dashboard-focus-card">
          <div className="dashboard-section-eyebrow">En foco</div>
          <h3 className="dashboard-focus-title">Clientes para revisar</h3>
          <div className="dashboard-focus-list">
            {focus.length === 0 ? (
              <div className="dashboard-focus-empty">No hay clientes críticos con los filtros actuales.</div>
            ) : (
              focus.map((cliente) => (
                <div key={cliente.cliente} className="dashboard-focus-item">
                  <div>
                    <div className="dashboard-focus-name">{cliente.cliente}</div>
                    <div className="dashboard-focus-meta">{cliente.olaId} · {cliente.completados}/{cliente.total} items</div>
                  </div>
                  <div className="dashboard-focus-pct">{cliente.pct}%</div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <DashboardKpis summary={summary} />
    </section>
  )
}
