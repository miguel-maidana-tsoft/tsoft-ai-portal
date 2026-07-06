export default function ClientPhaseMatrix({ rows = [], onOpenTracker }) {
  function getCellTone(pct) {
    if (pct >= 100) return 'done'
    if (pct >= 50) return 'progress'
    if (pct > 0) return 'started'
    return 'empty'
  }

  return (
    <section className="dashboard-panel dashboard-panel--matrix">
      <div className="dashboard-panel-header">
        <div>
          <div className="dashboard-section-eyebrow">Vista analítica</div>
          <h3 className="dashboard-panel-title">Matriz cliente x fase</h3>
        </div>
      </div>

      <div className="dashboard-matrix-wrap">
        <table className="dashboard-matrix">
          <thead>
            <tr>
              <th>Cliente</th>
              <th>Fase 1</th>
              <th>Fase 2</th>
              <th>Fase 3</th>
              <th>Fase 4</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.cliente}>
                <td>
                  <button
                    type="button"
                    className="dashboard-matrix-client"
                    onClick={() => onOpenTracker(row.cliente, row.olaId)}
                  >
                    <span>{row.cliente}</span>
                    <span className="dashboard-matrix-client-sub">{row.olaId}</span>
                  </button>
                </td>
                {row.fases.map((fase) => (
                  <td key={fase.id}>
                    <div className={`dashboard-matrix-cell dashboard-matrix-cell--${getCellTone(fase.pct)}`}>
                      {fase.pct}%
                    </div>
                  </td>
                ))}
                <td>
                  <div className="dashboard-matrix-total">{row.pct}%</div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}
