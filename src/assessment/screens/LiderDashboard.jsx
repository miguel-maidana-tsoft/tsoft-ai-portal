import { useEffect, useState } from 'react'
import { getAllResults } from '../api'
import { CLIENTES, LEVEL_DEFS } from '../data'

const ROLES_OPTS = ['QA', 'Dev', 'BA', 'DevOps', 'PM', 'Preventa']

// row format from GAS: [nombre, cliente, rol, nivel, nivelNombre, puntaje, maxPts, fecha, b1..b6]
export default function LiderDashboard({ cliente: clienteFiltro, onBack }) {
  const [rows, setRows]     = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError]   = useState(false)
  const [fCliente, setFCliente] = useState('')
  const [fNivel, setFNivel]   = useState('')
  const [fRol, setFRol]     = useState('')

  useEffect(() => {
    getAllResults()
      .then((all) => {
        setRows(clienteFiltro ? all.filter((r) => r[1] === clienteFiltro) : all)
        setLoading(false)
      })
      .catch(() => { setError(true); setLoading(false) })
  }, [clienteFiltro])

  const filtered = rows.filter((r) =>
    (!fCliente || r[1] === fCliente) &&
    (!fNivel   || r[3] === fNivel)   &&
    (!fRol     || r[2] === fRol)
  )

  // Stats
  const counts = { N1: 0, N2: 0, N3: 0, N4: 0, N5: 0 }
  rows.forEach((r) => { if (counts[r[3]] !== undefined) counts[r[3]]++ })
  const total = rows.length

  function exportXLSX() {
    if (!rows.length) return
    let html = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel"><head><meta charset="UTF-8"></head><body><table>'
    html += '<tr style="background:#1A2744;color:#fff"><th>Nombre</th><th>Cliente</th><th>Rol</th><th>Nivel</th><th>Nombre Nivel</th><th>Puntaje</th><th>Max Pts</th><th>Fecha</th><th>B1</th><th>B2</th><th>B3</th><th>B4</th><th>B5</th><th>B6</th></tr>'
    rows.forEach((r) => {
      html += '<tr>' + r.map((v) => `<td>${v}</td>`).join('') + '</tr>'
    })
    html += '</table></body></html>'
    const blob = new Blob([html], { type: 'application/vnd.ms-excel;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `TSOFT_AI_Assessment_${new Date().toLocaleDateString('es-AR').replace(/\//g, '-')}.xls`
    a.click()
    setTimeout(() => URL.revokeObjectURL(url), 1000)
  }

  return (
    <div className="as-screen as-screen--wide">
      <div className="as-screen-label">Vista líder</div>
      <h1 className="as-h1" style={{ fontSize: '1.6rem' }}>
        {clienteFiltro ? `Equipo: ${clienteFiltro}` : 'Dashboard — todos los clientes'}
      </h1>
      <div className="as-red-line" />

      {loading && <div className="as-loading">Cargando resultados...</div>}
      {error   && <div className="as-error-msg" style={{ display: 'block' }}>Error al cargar. Verificá la configuración del script.</div>}

      {!loading && !error && (
        <>
          {/* Stats */}
          <div className="as-stat-grid">
            <div className="as-stat-card as-stat-card--navy">
              <div className="as-stat-num">{total}</div>
              <div className="as-stat-label">Total completados</div>
            </div>
            {LEVEL_DEFS.map((l) => (
              <div key={l.n} className="as-stat-card" style={{ background: l.color }}>
                <div className="as-stat-num" style={{ color: l.text }}>{counts[l.n]}</div>
                <div className="as-stat-label" style={{ color: l.text }}>{l.n} · {l.name}</div>
              </div>
            ))}
          </div>

          {/* Distribución */}
          {total > 0 && (
            <div className="as-card" style={{ marginBottom: '1rem' }}>
              <div className="as-card-title">Distribución del equipo</div>
              <div className="as-dist-bar">
                {total === 0
                  ? <div className="as-dist-empty">Sin datos aún</div>
                  : LEVEL_DEFS.map((l) => counts[l.n] > 0 && (
                    <div
                      key={l.n}
                      className="as-dist-seg"
                      style={{ flex: counts[l.n], background: l.bar }}
                    >
                      {Math.round((counts[l.n] / total) * 100)}%
                    </div>
                  ))
                }
              </div>
              <div className="as-dist-legend">
                {LEVEL_DEFS.map((l) => (
                  <div key={l.n} className="as-dist-legend-item">
                    <div className="as-dist-legend-dot" style={{ background: l.bar }} />
                    <span><strong>{l.n}</strong> {l.name} ({counts[l.n]})</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Guía de niveles */}
          <div className="as-card" style={{ marginBottom: '1rem' }}>
            <div className="as-card-title">¿Qué significa cada nivel?</div>
            {LEVEL_DEFS.map((l) => (
              <div key={l.n} className="as-level-row">
                <div className="as-level-pill-wrap">
                  <span className="as-nivel-pill" style={{ background: l.color, color: l.text }}>{l.n}</span>
                  <div className="as-level-pill-name" style={{ color: l.text }}>{l.name}</div>
                </div>
                <div>
                  <div className="as-level-desc">{l.desc}</div>
                  <div className="as-level-accion">→ {l.next[0]}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Filtros + tabla */}
          <div className="as-card" style={{ marginBottom: '1rem' }}>
            <div className="as-card-title">Detalle por colaborador</div>
            <div className="as-filter-row">
              {!clienteFiltro && (
                <select className="as-select" value={fCliente} onChange={(e) => setFCliente(e.target.value)}>
                  <option value="">Todos los clientes</option>
                  {CLIENTES.map((c) => <option key={c}>{c}</option>)}
                </select>
              )}
              <select className="as-select" value={fNivel} onChange={(e) => setFNivel(e.target.value)}>
                <option value="">Todos los niveles</option>
                {['N1','N2','N3','N4','N5'].map((n) => <option key={n}>{n}</option>)}
              </select>
              <select className="as-select" value={fRol} onChange={(e) => setFRol(e.target.value)}>
                <option value="">Todos los roles</option>
                {ROLES_OPTS.map((r) => <option key={r}>{r}</option>)}
              </select>
            </div>
            {filtered.length === 0 ? (
              <div className="as-empty-state">No hay resultados con esos filtros todavía.</div>
            ) : (
              <div className="as-tbl-wrap">
                <table className="as-table">
                  <thead>
                    <tr>
                      <th>Nombre</th><th>Cliente</th><th>Rol</th>
                      <th>Nivel</th><th>Puntaje</th><th>Fecha</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((r, i) => {
                      const lvl = LEVEL_DEFS.find((l) => l.n === r[3]) || LEVEL_DEFS[0]
                      return (
                        <tr key={i}>
                          <td>{r[0]}</td>
                          <td>{r[1]}</td>
                          <td>{r[2]}</td>
                          <td>
                            <span className="as-nivel-pill" style={{ background: lvl.color, color: lvl.text }}>
                              {r[3]} {r[4]}
                            </span>
                          </td>
                          <td className="as-mono">{r[5]} / {r[6]} pts</td>
                          <td className="as-mono as-small">{r[7]}</td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <div className="as-btn-row">
            <button className="as-btn as-btn--primary" onClick={exportXLSX}>↓ Exportar Excel</button>
            <button className="as-btn" onClick={() => { setLoading(true); getAllResults().then((all) => { setRows(clienteFiltro ? all.filter((r) => r[1] === clienteFiltro) : all); setLoading(false) }).catch(() => setLoading(false)) }}>↺ Actualizar</button>
            <button className="as-btn" onClick={onBack}>Salir</button>
          </div>
        </>
      )}
    </div>
  )
}
