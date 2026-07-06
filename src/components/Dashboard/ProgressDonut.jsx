export default function ProgressDonut({ value = 0, completed = 0, total = 0, label = 'Avance global' }) {
  const safeValue = Math.max(0, Math.min(100, Number(value) || 0))
  const radius = 58
  const circumference = 2 * Math.PI * radius
  const dashOffset = circumference - (safeValue / 100) * circumference

  return (
    <div className="dashboard-donut-card">
      <div className="dashboard-donut-copy">
        <div className="dashboard-section-eyebrow">Overview</div>
        <h3 className="dashboard-donut-title">{label}</h3>
        <p className="dashboard-donut-text">
          {completed} de {total} items oficiales completados.
        </p>
      </div>

      <div className="dashboard-donut-wrap" aria-label={`${label}: ${safeValue}%`}>
        <svg className="dashboard-donut" viewBox="0 0 160 160" role="img">
          <circle className="dashboard-donut-track" cx="80" cy="80" r={radius} />
          <circle
            className="dashboard-donut-fill"
            cx="80"
            cy="80"
            r={radius}
            strokeDasharray={circumference}
            strokeDashoffset={dashOffset}
          />
        </svg>
        <div className="dashboard-donut-center">
          <div className="dashboard-donut-value">{safeValue}%</div>
          <div className="dashboard-donut-sub">completado</div>
        </div>
      </div>
    </div>
  )
}
