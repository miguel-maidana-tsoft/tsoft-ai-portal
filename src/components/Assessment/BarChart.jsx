export default function BarChart({ data }) {
  if (!data.length) return null

  return (
    <div className="bar-chart-wrap">
      {data.map((d, i) => {
        const color =
          d.avgPct >= 80 ? 'var(--green)' : d.avgPct >= 60 ? '#D97706' : '#EF4444'
        return (
          <div key={i} className="bar-row">
            <div className="bar-label">{d.label}</div>
            <div className="bar-track">
              <div className="bar-fill" style={{ width: `${d.avgPct}%`, background: color }} />
            </div>
            <div className="bar-pct" style={{ color }}>{d.avgPct}%</div>
          </div>
        )
      })}
    </div>
  )
}
