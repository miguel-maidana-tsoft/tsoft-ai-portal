function parseChampions(val) {
  if (!val) return []
  try { return JSON.parse(val) } catch { return [] }
}

function getSemaforo(pct, total) {
  if (total === 0)  return { color: 'var(--pending-color)', variant: 'vacio' }
  if (pct === 100)  return { color: 'var(--red)',           variant: 'completo' }
  if (pct >= 50)    return { color: 'var(--green)',         variant: 'verde' }
  if (pct > 0)      return { color: 'var(--yellow)',        variant: 'amarillo' }
  return              { color: 'var(--red)',                variant: 'rojo' }
}

export default function ClienteCard({ cliente, resumen, info, items = [] }) {
  const r = resumen || { total: 0, completados: 0, pct: 0 }
  const pct = r.pct || 0
  const sem = getSemaforo(pct, r.total)

  const nivelCBase = info?.nivelC?.split('–')[0].replace(/[^CP0-9]/g, '')
  const nivelPBase = info?.nivelP?.split(' ')[0].replace(/[^CP0-9]/g, '')
  const champions = parseChampions(info?.champion).filter(c => c.nombre)

  return (
    <div className={`cliente-card cliente-card--${sem.variant}`}>

      {sem.variant === 'completo' && (
        <div className="card-completo-badge">✓ 100% Completado</div>
      )}

      <div className="cliente-card-header">
        <div>
          <div className="cliente-name">{cliente}</div>
          <div className="cliente-gerente">
            <span className="card-info-label">Líder:</span> {info?.lider || 'Sin asignar'}
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4, alignItems: 'flex-end' }}>
          {info?.nivelC && (
            <span className={`nivel-badge nivel-${nivelCBase}`}>{info.nivelC}</span>
          )}
          {info?.nivelP && (
            <span className={`nivel-badge nivel-${nivelPBase}`}>{info.nivelP}</span>
          )}
        </div>
      </div>

      {champions.length > 0 && (
        <div className="card-champions">
          <div className="card-info-label" style={{ marginBottom: 5 }}>Champions:</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
            {champions.map((c, i) => (
              <span key={i} className="card-champion-tag">
                {c.nombre}
                {c.rol && c.rol !== 'Otro' && <span className="card-champion-rol"> · {c.rol}</span>}
              </span>
            ))}
          </div>
        </div>
      )}

      {r.total > 0 && (
        <>
          <div className="progress-bar-wrap">
            <div
              className="progress-bar-fill"
              style={{ width: `${pct}%`, background: sem.color }}
            />
          </div>

          <div className="card-checklist-stats">
            <span className="card-cl-fraction" style={{ color: sem.color }}>
              {r.completados}/{r.total} ítems
            </span>
            <span className="card-cl-pct">{pct}% completado</span>
          </div>

          <div className="card-cl-list">
            {items.map((item) => (
              <div key={item.id} className={`card-cl-item ${item.completado ? 'card-cl-item--done' : ''}`}>
                <span className="card-cl-check" style={{ borderColor: item.completado ? sem.color : undefined, background: item.completado ? sem.color : undefined }}>
                  {item.completado ? '✓' : ''}
                </span>
                <span className="card-cl-texto">{item.texto}</span>
              </div>
            ))}
          </div>
        </>
      )}

      {r.total === 0 && (
        <div className="card-cl-empty">Sin ítems en checklist</div>
      )}

      {info?.proximoPaso && (
        <div className="card-proximo-paso">
          → {info.proximoPaso}
        </div>
      )}
    </div>
  )
}
