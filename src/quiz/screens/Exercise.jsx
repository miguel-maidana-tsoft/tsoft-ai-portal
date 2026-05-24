import { useEffect, useRef, useState } from 'react'

const DIFF_CLASS = { easy: 'tag-easy', medium: 'tag-medium', hard: 'tag-hard' }
const DIFF_LABEL = { easy: 'Básico',   medium: 'Intermedio', hard: 'Avanzado' }
const AUTO_DELAY = 10000  // 10 segundos antes de avanzar

// ── Agent preview ────────────────────────────────────────────
function AgentPreview({ lines, title }) {
  const colorClass = { white: 'pv-white', green: 'pv-green', blue: 'pv-blue', muted: 'pv-muted' }
  return (
    <div className="builder-section">
      <div className="builder-section-label">{title}</div>
      <div className="agent-preview">
        <div className="preview-line"><span className="pv-muted">---</span></div>
        {lines.map((line, i) =>
          line.isComment ? (
            <div key={i} className="preview-line">
              <span className="pv-muted">{line.key}</span>
            </div>
          ) : (
            <div key={i} className="preview-line">
              <span className="pk">{line.key}</span>
              <span className={colorClass[line.color] || 'pv-white'}>{line.value}</span>
            </div>
          )
        )}
        <div className="preview-line"><span className="pv-muted">---</span></div>
      </div>
    </div>
  )
}

// ── Feedback box con barra de auto-avance ────────────────────
function FeedbackBox({ score, maxScore, details }) {
  const cls   = score === maxScore ? 'feedback-correct' : score >= maxScore / 2 ? 'feedback-partial' : 'feedback-wrong'
  const title = score === maxScore ? '✓ Configuración perfecta' : score >= maxScore / 2 ? '◎ Casi — algunos ajustes' : '✕ Revisá la configuración'

  return (
    <div className={`feedback-box ${cls}`}>
      <div className="feedback-title">{title} — {score}/{maxScore} puntos</div>
      <div className="feedback-body">
        <ul className="feedback-detail-list">
          {details.map((d, i) => {
            const icon  = d.ok === true ? '✓' : d.ok === 'partial' ? '◎' : '✕'
            const color = d.ok === true ? '#4DC990' : d.ok === 'partial' ? '#F0A030' : '#F07090'
            return (
              <li key={i} className="feedback-detail-item">
                <span className="feedback-detail-icon" style={{ color }}>{icon}</span>
                <span dangerouslySetInnerHTML={{ __html: d.txt }} />
              </li>
            )
          })}
        </ul>
      </div>
      {/* Barra de progreso de auto-avance — igual que en QuizPhase */}
      <div
        className="q-auto-progress"
        style={{ '--adv-delay': `${AUTO_DELAY}ms` }}
      />
    </div>
  )
}

// ── Main exercise component ───────────────────────────────────
export default function Exercise({ exDef, totalExercises = 3, onScore }) {
  const [sel, setSel]             = useState(() => JSON.parse(JSON.stringify(exDef.initialState)))
  const [validated, setValidated] = useState(false)
  const [result, setResult]       = useState(null)

  const validateRef  = useRef(null)
  const feedbackRef  = useRef(null)
  const prevReadyRef = useRef(false)

  const num   = exDef.num
  const ready = exDef.isReady(sel)
  const isLast = num === totalExercises

  // Auto-avance 10s después de validar
  useEffect(() => {
    if (!validated || !result) return
    const timer = setTimeout(() => {
      onScore(result.score, sel)
    }, AUTO_DELAY)
    return () => clearTimeout(timer)
  }, [validated]) // eslint-disable-line

  // Scroll al botón validar cuando se completan todas las selecciones
  useEffect(() => {
    if (ready && !prevReadyRef.current && !validated) {
      setTimeout(() => validateRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 120)
    }
    prevReadyRef.current = ready
  }, [ready, validated])

  // Scroll al feedback tras validar
  useEffect(() => {
    if (!validated || !feedbackRef.current) return
    setTimeout(() => feedbackRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 150)
  }, [validated])

  function toggleChip(key, val, isMulti) {
    setSel((prev) => {
      const next = { ...prev }
      if (isMulti) {
        const arr = [...(prev[key] || [])]
        const idx = arr.indexOf(val)
        if (idx > -1) arr.splice(idx, 1)
        else arr.push(val)
        next[key] = arr
      } else {
        next[key] = prev[key] === val ? '' : val
      }
      return next
    })
  }

  function handleValidate() {
    const res = exDef.validate(sel)
    setResult(res)
    setValidated(true)
  }

  const previewLines  = exDef.getPreview(sel)
  const is2col        = exDef.sectionsLayout === '2col'

  const sectionChips = exDef.sections.map((section) => (
    <div key={section.key} className="builder-section">
      <div className="builder-section-label">
        <div className="req-dot" />
        {section.label}
      </div>
      <div className="options-row">
        {section.options.map((opt) => {
          const isMulti    = section.type === 'multi'
          const isSelected = isMulti
            ? (sel[section.key] || []).includes(opt.val)
            : sel[section.key] === opt.val
          return (
            <div
              key={opt.val}
              className={`option-chip${isMulti ? ' multi' : ''}${isSelected ? ' selected' : ''}`}
              onClick={() => !validated && toggleChip(section.key, opt.val, isMulti)}
              style={validated ? { cursor: 'default', pointerEvents: 'none' } : undefined}
            >
              {opt.label}
            </div>
          )
        })}
      </div>
    </div>
  ))

  return (
    <div className="quiz-screen">
      {/* Step dots */}
      <div className="step-dots">
        {Array.from({ length: totalExercises }, (_, i) => {
          const cls = i < num - 1 ? 'done' : i === num - 1 ? 'active' : ''
          return <div key={i} className={`step-dot${cls ? ` ${cls}` : ''}`} />
        })}
      </div>

      {/* Header */}
      <div className="exercise-header">
        <div className="exercise-badge">{num}</div>
        <div>
          <div className={`difficulty-tag ${DIFF_CLASS[exDef.difficulty]}`}>
            {DIFF_LABEL[exDef.difficulty]}
          </div>
          <h2 className="quiz-h2">{exDef.title}</h2>
        </div>
      </div>

      {/* Scenario */}
      <div className="scenario-box" dangerouslySetInnerHTML={{ __html: `<strong>Escenario:</strong> ${exDef.scenario}` }} />

      {is2col ? (
        /* Layout 2×2: secciones en grilla 2 col + fila preview/validar */
        <>
          <div className="builder-grid builder-grid--2col">
            {sectionChips}
          </div>

          <div className="builder-preview-row">
            <AgentPreview lines={previewLines} title={exDef.previewTitle} />
            {!validated && (
              <div className="validate-col" ref={validateRef}>
                <button
                  className="btn btn-primary"
                  onClick={handleValidate}
                  disabled={!ready}
                >
                  Validar configuración
                </button>
              </div>
            )}
          </div>
        </>
      ) : (
        /* Layout normal: secciones izquierda | preview derecha */
        <>
          <div className="builder-layout">
            <div className="builder-grid">{sectionChips}</div>
            <AgentPreview lines={previewLines} title={exDef.previewTitle} />
          </div>

          {!validated && (
            <div className="validate-row" ref={validateRef}>
              <button
                className="btn btn-primary"
                onClick={handleValidate}
                disabled={!ready}
              >
                Validar configuración
              </button>
            </div>
          )}
        </>
      )}

      {/* Feedback con auto-avance */}
      {validated && result && (
        <div ref={feedbackRef}>
          <FeedbackBox score={result.score} maxScore={3} details={result.details} />
        </div>
      )}
    </div>
  )
}
