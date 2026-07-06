export default function OlaProgressPanel({ olas = [] }) {
  return (
    <section className="dashboard-panel">
      <div className="dashboard-panel-header">
        <div>
          <div className="dashboard-section-eyebrow">Comparativa</div>
          <h3 className="dashboard-panel-title">Progreso por ola</h3>
        </div>
      </div>

      <div className="dashboard-ola-list">
        {olas.map((ola) => (
          <div key={ola.id} className="dashboard-ola-row">
            <div className="dashboard-ola-copy">
              <div className="dashboard-ola-title">{ola.id}</div>
              <div className="dashboard-ola-sub">
                {ola.clientesActivos}/{ola.clientesTotales} clientes con base · {ola.clientesCompletos} al 100%
              </div>
            </div>
            <div className="dashboard-ola-meta">
              <div className="dashboard-ola-pct">{ola.pct}%</div>
              <div className="dashboard-ola-bar">
                <div className="dashboard-ola-bar-fill" style={{ width: `${ola.pct}%` }} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
