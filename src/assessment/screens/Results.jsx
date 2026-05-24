import { useEffect, useState } from 'react'
import { saveResult } from '../api'
import { LEVEL_DEFS, BLOCK_MAXS, MAX_PTS, sumArr, getLevel } from '../data'

export default function Results({ user, answers, onBack }) {
  const [saved, setSaved]     = useState(null) // null | 'ok' | 'err'
  const [barW, setBarW]       = useState(0)

  const scores = {
    b1: sumArr(answers.b1), b2: sumArr(answers.b2), b3: sumArr(answers.b3),
    b4: sumArr(answers.b4), b5: sumArr(answers.b5), b6: sumArr(answers.b6),
  }
  const total = Object.values(scores).reduce((a, v) => a + v, 0)
  const level = getLevel(total)

  useEffect(() => {
    setTimeout(() => setBarW(Math.round((total / MAX_PTS) * 100)), 200)

    const fecha = new Date().toLocaleDateString('es-AR')
    saveResult({
      nombre: user.nombre, cliente: user.cliente, rol: user.rol,
      nivel: level.n, nivelNombre: level.name,
      puntaje: total, maxPts: MAX_PTS, fecha,
      b1: scores.b1, b2: scores.b2, b3: scores.b3,
      b4: scores.b4, b5: scores.b5, b6: scores.b6,
    })
      .then(() => setSaved('ok'))
      .catch(() => setSaved('err'))
  }, []) // eslint-disable-line

  return (
    <div className="as-screen">
      <div className="as-screen-label">Resultado</div>
      <h1 className="as-h1" style={{ fontSize: '1.5rem' }}>Tu nivel en el AI Adoption Program</h1>
      <div className="as-red-line" />

      <div className="as-result-card">
        {/* Nivel */}
        <div className="as-result-level" style={{ color: level.text, background: level.color }}>
          {level.n}
        </div>
        <div className="as-result-name">{level.name}</div>
        <p className="as-result-desc">{level.desc}</p>

        {/* Barra de score */}
        <div className="as-score-bar-bg">
          <div className="as-score-bar-fill" style={{ width: `${barW}%` }} />
        </div>
        <div className="as-score-label">
          <span>0</span>
          <span className="as-mono">{total} / {MAX_PTS} pts</span>
          <span>{MAX_PTS}</span>
        </div>

        {/* Level strip */}
        <div className="as-level-strip">
          {LEVEL_DEFS.map((l) => (
            <div key={l.n} className="as-pip-wrap">
              <div
                className={`as-pip${total >= l.min ? ' active' : ''}${l.n === level.n ? ' current' : ''}`}
                style={l.n === level.n ? { background: '#C8102E' } : total >= l.min ? { background: '#3B82F6' } : {}}
              />
              <div className="as-pip-lbl">{l.n}</div>
            </div>
          ))}
        </div>

        {/* Bloques */}
        <div className="as-blocks-grid">
          {BLOCK_MAXS.map((b) => (
            <div key={b.key} className="as-block-card">
              <div className="as-block-title">{b.label}</div>
              <div>
                <span className="as-block-score">{scores[b.key]}</span>
                <span className="as-block-max"> / {b.max} pts</span>
              </div>
            </div>
          ))}
        </div>

        {/* Próximos pasos */}
        <div className="as-next-steps">
          <div className="as-next-title">Próximos pasos</div>
          {level.next.map((n, i) => (
            <div key={i} className="as-next-item">
              <div className="as-next-dot" />
              <span>{n}</span>
            </div>
          ))}
        </div>
      </div>

      {saved === 'ok' && (
        <div className="as-saved-ok">
          ✓ Resultado guardado correctamente. Tu líder puede verlo en el dashboard.
        </div>
      )}
      {saved === 'err' && (
        <div className="as-saved-err">
          ⚠ No se pudo guardar automáticamente. Tomá una captura de pantalla de tu resultado y enviásela a tu líder.
        </div>
      )}

      <div style={{ marginTop: '1.2rem', textAlign: 'center' }}>
        <button className="as-btn" onClick={onBack}>Volver al inicio</button>
      </div>
    </div>
  )
}
