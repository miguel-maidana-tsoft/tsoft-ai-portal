import { useEffect } from 'react'
import { useApp } from '../../context/AppContext'
import Spinner from '../Spinner'
import PieChart from './PieChart'

const NIVEL_DEFS = [
  { n: 'N1', nombre: 'Explorador',  min: 0,  max: 8,  color: '#E57373', bg: '#FCEBEB', text: '#791F1F', desc: 'Uso ocasional y reactivo. Sin prompts propios ni rutina establecida.' },
  { n: 'N2', nombre: 'Asistido',    min: 9,  max: 16, color: '#FFB74D', bg: '#FAEEDA', text: '#633806', desc: 'IA integrada en el workflow diario. Prompts guardados y reutilizados.' },
  { n: 'N3', nombre: 'Agentivo',    min: 17, max: 24, color: '#42A5F5', bg: '#E6F1FB', text: '#0C447C', desc: 'Entiende y opera agentes. Visión del ciclo completo asistido por IA.' },
  { n: 'N4', nombre: 'Constructor', min: 25, max: 30, color: '#66BB6A', bg: '#EAF3DE', text: '#27500A', desc: 'Construye agentes y MCPs desde cero. Perfil Champion natural.' },
  { n: 'N5', nombre: 'Arquitecto',  min: 31, max: 51, color: '#9575CD', bg: '#EEEDFE', text: '#3C3489', desc: 'Define el ecosistema. Decide qué se construye, cómo y por qué.' },
]

const MAX_SCORE = 51

function getNivelDef(nombreOrN) {
  const s = String(nombreOrN || '').trim()
  return NIVEL_DEFS.find(d => d.nombre === s || d.n === s) || NIVEL_DEFS[0]
}

export default function Assessment() {
  const { assessment, loadAssessment } = useApp()

  useEffect(() => {
    loadAssessment()
  }, [loadAssessment])

  if (assessment === null) return <Spinner />

  if (assessment.length === 0) return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Assessment</div>
          <div className="page-subtitle">Resultados del relevamiento de madurez IA — Ola 1</div>
        </div>
      </div>
      <div className="filtros-empty">
        No hay datos de assessment disponibles.<br />
        <span style={{ fontSize: 12, color: 'var(--muted)', display: 'block', marginTop: 6 }}>
          Verificá que la solapa "Assessment" exista en el Sheet y que el GAS tenga el case getAssessment.
        </span>
      </div>
    </div>
  )

  // Group by cliente
  const byCliente = {}
  assessment.forEach((r) => {
    const c = String(r.Cliente || 'Sin cliente').trim()
    if (!byCliente[c]) byCliente[c] = []
    byCliente[c].push(r)
  })

  // Nivel counts
  const nivelCount = {}
  NIVEL_DEFS.forEach(d => { nivelCount[d.nombre] = 0 })
  assessment.forEach((r) => {
    const d = getNivelDef(r.NivelNombre)
    nivelCount[d.nombre]++
  })

  // Pie data — only niveles that have at least 1
  const pieData = NIVEL_DEFS
    .filter(d => nivelCount[d.nombre] > 0)
    .map(d => ({ label: `${d.n} · ${d.nombre}`, count: nivelCount[d.nombre], color: d.color }))

  const total = assessment.length

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Assessment</div>
          <div className="page-subtitle">Resultados del relevamiento de madurez IA — Ola 1</div>
        </div>
      </div>

      {/* KPIs */}
      <div className="assessment-kpis">
        <div className="assessment-kpi">
          <div className="assessment-kpi-value">{total}</div>
          <div className="assessment-kpi-label">Colaboradores relevados</div>
        </div>
        <div className="assessment-kpi">
          <div className="assessment-kpi-value">{Object.keys(byCliente).length}</div>
          <div className="assessment-kpi-label">Clientes con datos</div>
        </div>
        {NIVEL_DEFS.slice().reverse().filter(d => nivelCount[d.nombre] > 0).slice(0, 2).map(d => (
          <div key={d.n} className="assessment-kpi" style={{ borderLeft: `3px solid ${d.color}` }}>
            <div className="assessment-kpi-value" style={{ color: d.color }}>{nivelCount[d.nombre]}</div>
            <div className="assessment-kpi-label">{d.n} · {d.nombre}</div>
          </div>
        ))}
      </div>

      {/* Guía de niveles */}
      <div className="nivel-guide-section">
        <div className="chart-card-title" style={{ marginBottom: 14 }}>¿Qué significa cada nivel?</div>
        <div className="nivel-guide-grid">
          {NIVEL_DEFS.map(d => (
            <div key={d.n} className="nivel-guide-card" style={{ borderColor: d.color, background: d.bg }}>
              <div className="nivel-guide-badge" style={{ background: d.color }}>{d.n}</div>
              <div className="nivel-guide-nombre" style={{ color: d.text }}>{d.nombre}</div>
              <div className="nivel-guide-rango" style={{ color: d.text }}>{d.min}–{d.n === 'N5' ? '51' : d.max} pts</div>
              <div className="nivel-guide-desc" style={{ color: d.text }}>{d.desc}</div>
              {nivelCount[d.nombre] > 0 && (
                <div className="nivel-guide-count" style={{ background: d.color }}>
                  {nivelCount[d.nombre]} colaboradores
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Charts */}
      <div className="assessment-charts">
        <div className="chart-card">
          <div className="chart-card-title">Distribución general</div>
          <PieChart data={pieData} />
        </div>
        <div className="chart-card">
          <div className="chart-card-title">Distribución por cliente</div>
          <div className="dist-by-client">
            {Object.entries(byCliente)
              .sort((a, b) => b[1].length - a[1].length)
              .map(([cliente, rows]) => {
                const counts = {}
                NIVEL_DEFS.forEach(d => { counts[d.nombre] = 0 })
                rows.forEach(r => { counts[getNivelDef(r.NivelNombre).nombre]++ })
                return (
                  <div key={cliente} className="dist-client-row">
                    <div className="dist-client-label">{cliente}</div>
                    <div className="dist-client-bar">
                      {NIVEL_DEFS.filter(d => counts[d.nombre] > 0).map(d => (
                        <div
                          key={d.n}
                          className="dist-segment"
                          style={{ flex: counts[d.nombre], background: d.color }}
                          title={`${d.n} ${d.nombre}: ${counts[d.nombre]}`}
                        >
                          {counts[d.nombre]}
                        </div>
                      ))}
                    </div>
                    <div className="dist-client-count">{rows.length}</div>
                  </div>
                )
              })}
          </div>
        </div>
      </div>

      {/* Per-client tables */}
      {Object.entries(byCliente).map(([cliente, rows]) => {
        const counts = {}
        NIVEL_DEFS.forEach(d => { counts[d.nombre] = 0 })
        rows.forEach(r => { counts[getNivelDef(r.NivelNombre).nombre]++ })

        return (
          <div key={cliente} className="assessment-cliente-section">
            <div className="assessment-cliente-header">
              <span className="assessment-cliente-name">{cliente}</span>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {NIVEL_DEFS.filter(d => counts[d.nombre] > 0).map(d => (
                  <span key={d.n} className="assessment-nivel-badge" style={{ background: d.color }}>
                    {counts[d.nombre]} {d.n}
                  </span>
                ))}
              </div>
              <span className="assessment-cliente-stats">{rows.length} colaboradores</span>
            </div>
            <table className="assessment-table">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Rol</th>
                  <th>Nivel</th>
                  <th>Puntaje / 51</th>
                </tr>
              </thead>
              <tbody>
                {rows
                  .slice()
                  .sort((a, b) => Number(b.Puntaje) - Number(a.Puntaje))
                  .map((r, i) => {
                    const nd = getNivelDef(r.NivelNombre)
                    const score = Number(r.Puntaje)
                    const pct = Math.round((score / MAX_SCORE) * 100)
                    return (
                      <tr key={i}>
                        <td>{r.Nombre}</td>
                        <td style={{ color: 'var(--slate)', fontSize: 12 }}>{r.Rol}</td>
                        <td>
                          <span className="assessment-nivel-badge" style={{ background: nd.color }}>
                            {r.Nivel} · {r.NivelNombre}
                          </span>
                        </td>
                        <td>
                          <div className="assessment-pct-cell">
                            <div className="assessment-mini-bar-track">
                              <div
                                className="assessment-mini-bar-fill"
                                style={{ width: `${pct}%`, background: nd.color }}
                              />
                            </div>
                            <span style={{ color: nd.text, minWidth: 44, fontSize: 12 }}>
                              {score} / 51
                            </span>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
              </tbody>
            </table>
          </div>
        )
      })}
    </div>
  )
}
