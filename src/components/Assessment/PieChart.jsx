const NIVEL_COLORS = {
  'Principiante': '#64748B',
  'Explorador': '#3B82F6',
  'Practicante': '#10B981',
  'Constructor': '#F59E0B',
  'Arquitecto': '#8B5CF6',
}
export const getNivelColor = (nombre) => NIVEL_COLORS[nombre] || '#94A3B8'

function polarToCartesian(cx, cy, r, deg) {
  const rad = (deg - 90) * Math.PI / 180
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) }
}

function slicePath(cx, cy, r, startDeg, endDeg) {
  if (endDeg - startDeg >= 359.99) {
    return `M ${cx - r} ${cy} A ${r} ${r} 0 1 1 ${cx + r} ${cy} A ${r} ${r} 0 1 1 ${cx - r} ${cy} Z`
  }
  const s = polarToCartesian(cx, cy, r, startDeg)
  const e = polarToCartesian(cx, cy, r, endDeg)
  const large = endDeg - startDeg > 180 ? 1 : 0
  return `M ${cx} ${cy} L ${s.x} ${s.y} A ${r} ${r} 0 ${large} 1 ${e.x} ${e.y} Z`
}

export default function PieChart({ data }) {
  const total = data.reduce((s, d) => s + d.count, 0)
  if (total === 0) return null

  const cx = 90, cy = 90, r = 78
  let currentAngle = 0
  const slices = data.map((d) => {
    const angle = (d.count / total) * 360
    const slice = { ...d, startAngle: currentAngle, endAngle: currentAngle + angle }
    currentAngle += angle
    return slice
  })

  return (
    <div className="pie-chart-wrap">
      <svg viewBox="0 0 180 180" width="180" height="180" style={{ flexShrink: 0 }}>
        {slices.map((s, i) => (
          <path
            key={i}
            d={slicePath(cx, cy, r, s.startAngle, s.endAngle)}
            fill={s.color}
            stroke="#fff"
            strokeWidth={2}
          />
        ))}
      </svg>
      <div className="pie-legend">
        {slices.map((s, i) => (
          <div key={i} className="pie-legend-item">
            <span className="pie-legend-dot" style={{ background: s.color }} />
            <span className="pie-legend-label">{s.label}</span>
            <span className="pie-legend-pct">
              {Math.round((s.count / total) * 100)}% ({s.count})
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
