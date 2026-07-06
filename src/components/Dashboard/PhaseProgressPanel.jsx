export default function PhaseProgressPanel({ phases = [] }) {
  return (
    <section className="dashboard-panel">
      <div className="dashboard-panel-header">
        <div>
          <div className="dashboard-section-eyebrow">Comparativa</div>
          <h3 className="dashboard-panel-title">Progreso por fase</h3>
        </div>
      </div>

      <div className="dashboard-progress-list">
        {phases.map((phase) => (
          <div key={phase.id} className="dashboard-progress-row">
            <div className="dashboard-progress-head">
              <div>
                <div className="dashboard-progress-title">{phase.nombre}</div>
                <div className="dashboard-progress-sub">{phase.periodo}</div>
              </div>
              <div className="dashboard-progress-metric">
                {phase.completados}/{phase.total} · {phase.pct}%
              </div>
            </div>

            <div className="dashboard-progress-bar">
              <div className="dashboard-progress-bar-fill" style={{ width: `${phase.pct}%` }} />
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
