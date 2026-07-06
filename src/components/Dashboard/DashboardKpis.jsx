export default function DashboardKpis({ summary }) {
  const items = [
    {
      label: 'Avance global',
      value: `${summary.pctGlobal}%`,
      sub: `${summary.totalCompletados} de ${summary.totalItems} items`,
      tone: 'red',
    },
    {
      label: 'Clientes en programa',
      value: summary.clientesTotales,
      sub: `${summary.olasActivas.join(' · ')}`,
    },
    {
      label: 'Con checklist oficial',
      value: summary.clientesConItems,
      sub: 'clientes con base cargada',
    },
    {
      label: 'Clientes 100%',
      value: summary.clientesCompletos,
      sub: 'todas las fases completadas',
    },
  ]

  return (
    <div className="kpi-grid">
      {items.map((item) => (
        <div key={item.label} className="kpi-card kpi-card--dashboard">
          <div className="kpi-label">{item.label}</div>
          <div className={`kpi-value ${item.tone === 'red' ? 'red' : ''}`}>{item.value}</div>
          <div className="kpi-sub">{item.sub}</div>
        </div>
      ))}
    </div>
  )
}
