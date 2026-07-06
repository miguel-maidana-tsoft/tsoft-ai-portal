import { useState } from 'react'
import { FASES } from '../../constants'

function parseChampions(val) {
  if (!val) return []
  try { return JSON.parse(val) } catch { return [] }
}

function getSemaforo(pct, total) {
  if (total === 0) return { color: 'var(--pending-color)', variant: 'vacio' }
  if (pct === 100) return { color: 'var(--red)', variant: 'completo' }
  if (pct >= 50) return { color: 'var(--green)', variant: 'verde' }
  if (pct > 0) return { color: 'var(--yellow)', variant: 'amarillo' }
  return { color: 'var(--red)', variant: 'rojo' }
}

export default function ClienteCardAccordion({ cliente, resumen, info, items = [], olaId, onOpenTracker }) {
  const r = resumen || { total: 0, completados: 0, pct: 0, porFase: {} }
  const pct = r.pct || 0
  const sem = getSemaforo(pct, r.total)
  const nivelCBase = info?.nivelC?.split('–')[0].replace(/[^CP0-9]/g, '')
  const nivelPBase = info?.nivelP?.split(' ')[0].replace(/[^CP0-9]/g, '')
  const champions = parseChampions(info?.champion).filter((c) => c.nombre)
  const oficiales = items.filter((item) => !item.extra)
  const extras = items.filter((item) => item.extra)
  const fases = FASES.map((fase) => ({
    ...fase,
    resumen: r.porFase?.[fase.id] || { total: 0, completados: 0, pct: 0 },
    items: oficiales.filter((item) => Number(item.fase) === Number(fase.id)),
  })).filter((fase) => fase.items.length > 0 || (fase.resumen?.total || 0) > 0)

  const [openKey, setOpenKey] = useState(null)

  function toggleSection(key) {
    setOpenKey((current) => current === key ? null : key)
  }

  return (
    <div className={`cliente-card cliente-card--${sem.variant}`}>
      {sem.variant === 'completo' && (
        <div className="card-completo-badge">✓ 100% Completado</div>
      )}

      <div className="cliente-card-header">
        <div>
          <div className="cliente-name">{cliente}</div>
          {olaId && <div className="cliente-card-ola">{olaId}</div>}
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

      {r.total > 0 ? (
        <>
          <div className="progress-bar-wrap">
            <div className="progress-bar-fill" style={{ width: `${pct}%`, background: sem.color }} />
          </div>

          <div className="card-checklist-stats">
            <span className="card-cl-fraction" style={{ color: sem.color }}>
              {r.completados}/{r.total} ítems oficiales
            </span>
            <span className="card-cl-pct">{pct}% completado</span>
          </div>

          {onOpenTracker && (
            <div className="cliente-card-actions">
              <button type="button" className="cliente-card-link" onClick={() => onOpenTracker(cliente, olaId)}>
                Ver tracker
              </button>
            </div>
          )}

          <div className="card-phase-list card-phase-list--accordion">
            {fases.map((fase) => {
              const isOpen = openKey === fase.id
              return (
                <div key={fase.id} className={`card-phase ${isOpen ? 'card-phase--open' : ''}`}>
                  <button type="button" className="card-phase-header card-phase-toggle" onClick={() => toggleSection(fase.id)}>
                    <div>
                      <div className="card-phase-title">{fase.nombre}</div>
                      <div className="card-phase-sub">{fase.periodo}</div>
                    </div>
                    <div className="card-phase-meta">
                      <div className="card-phase-stats">
                        {fase.resumen.completados}/{fase.resumen.total} · {fase.resumen.pct}%
                      </div>
                      <span className={`card-phase-chevron ${isOpen ? 'card-phase-chevron--open' : ''}`}>▾</span>
                    </div>
                  </button>

                  {isOpen && (
                    <div className="card-cl-list">
                      {fase.items.map((item) => (
                        <div key={item.id} className={`card-cl-item ${item.completado ? 'card-cl-item--done' : ''}`}>
                          <span className="card-cl-check" style={{ borderColor: item.completado ? sem.color : undefined, background: item.completado ? sem.color : undefined }}>
                            {item.completado ? '✓' : ''}
                          </span>
                          <span className="card-cl-texto">{item.texto}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )
            })}

            {extras.length > 0 && (
              <div className={`card-phase card-phase--extras ${openKey === 'extras' ? 'card-phase--open' : ''}`}>
                <button type="button" className="card-phase-header card-phase-toggle" onClick={() => toggleSection('extras')}>
                  <div>
                    <div className="card-phase-title">Extras</div>
                    <div className="card-phase-sub">No cuentan para el avance oficial</div>
                  </div>
                  <div className="card-phase-meta">
                    <div className="card-phase-stats">
                      {extras.filter((item) => item.completado).length}/{extras.length}
                    </div>
                    <span className={`card-phase-chevron ${openKey === 'extras' ? 'card-phase-chevron--open' : ''}`}>▾</span>
                  </div>
                </button>

                {openKey === 'extras' && (
                  <div className="card-cl-list">
                    {extras.map((item) => (
                      <div key={item.id} className={`card-cl-item ${item.completado ? 'card-cl-item--done' : ''}`}>
                        <span className="card-cl-check" style={{ borderColor: item.completado ? sem.color : undefined, background: item.completado ? sem.color : undefined }}>
                          {item.completado ? '✓' : ''}
                        </span>
                        <span className="card-cl-texto">{item.texto}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </>
      ) : (
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
