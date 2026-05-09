import { useApp } from '../../context/AppContext'

function parseChampions(val) {
  if (!val) return []
  try { return JSON.parse(val) } catch { return [] }
}

export default function ClienteCard({ cliente, resumen, info }) {
  const { openTracker } = useApp()
  const r = resumen || { total: 0, completadas: 0, enCurso: 0, pendientes: 0, pct: 0 }
  const pct = r.pct || 0
  const semaforo = pct === 100 ? '#16A34A' : pct > 0 ? '#D97706' : '#94A3B8'

  const nivelCBase = info?.nivelC?.split('–')[0].replace(/[^CP0-9]/g, '')
  const nivelPBase = info?.nivelP?.split(' ')[0].replace(/[^CP0-9]/g, '')
  const champions = parseChampions(info?.champion).filter(c => c.nombre)

  return (
    <div className="cliente-card" onClick={() => openTracker(cliente)}>
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

      <div className="progress-bar-wrap">
        <div
          className="progress-bar-fill"
          style={{ width: `${pct}%`, background: semaforo }}
        />
      </div>

      <div className="progress-stats">
        <span>
          <span className="stat-dot" style={{ background: 'var(--green)' }} />
          {r.completadas} completadas
        </span>
        <span>
          <span className="stat-dot" style={{ background: 'var(--yellow)' }} />
          {r.enCurso} en curso
        </span>
        <span>
          <span className="stat-dot" style={{ background: 'var(--border)' }} />
          {r.pendientes} pendientes
        </span>
      </div>

      {info?.proximoPaso && (
        <div
          style={{
            marginTop: 10,
            fontSize: 11.5,
            color: 'var(--muted)',
            borderTop: '1px solid var(--border)',
            paddingTop: 8,
          }}
        >
          → {info.proximoPaso}
        </div>
      )}
    </div>
  )
}
