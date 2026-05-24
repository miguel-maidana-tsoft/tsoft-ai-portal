export default function QuizBlock({ block, answers, isOptSelected, onChange, onNext, onBack, blockNum, totalBlocks, rolLabel }) {
  const title       = block.id === 'b4' ? `${block.title} — ${rolLabel}` : block.title
  const allAnswered = block.questions.every((_, i) => (answers[i] ?? null) !== null && answers[i] !== undefined)

  return (
    <div className="as-screen">
      <div className={`as-badge as-badge--${block.badgeType}`}>{block.badge}</div>
      <h2 className="as-h2">{title}</h2>
      <p className="as-block-sub">{block.sub}</p>

      {block.questions.map((q, qi) => (
        <div key={qi} className={`as-q-card${answers[qi] !== undefined ? ' answered' : ''}`}>
          <div className="as-q-num">Pregunta {qi + 1} de {block.questions.length}</div>
          <div className="as-q-text">{q.text}</div>
          <div className="as-options">
            {q.opts.map((opt, oi) => (
              <label
                key={oi}
                className={`as-opt${isOptSelected(qi, oi) ? ' selected' : ''}`}
                onClick={() => onChange(qi, opt.s, oi)}
              >
                <input type="radio" name={`${block.id}_q${qi}`} readOnly checked={isOptSelected(qi, oi)} />
                <span className="as-opt-label">{opt.l}</span>
              </label>
            ))}
          </div>
        </div>
      ))}

      <div className="as-nav">
        <button className="as-btn" onClick={onBack}>← Atrás</button>
        <button className="as-btn as-btn--primary" onClick={onNext} disabled={!allAnswered}>
          {blockNum === totalBlocks ? 'Ver mi resultado' : 'Siguiente →'}
        </button>
      </div>
    </div>
  )
}
