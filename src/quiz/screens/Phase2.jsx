export default function Phase2({ onStart }) {
  return (
    <div className="quiz-screen">
      <div className="phase-divider">
        <div className="phase-divider-icon">⚙️</div>
        <h2 className="quiz-h2" style={{ fontSize: '1.4rem', marginBottom: '0.4rem' }}>
          Fase 2 — Armá el Agente
        </h2>
        <p>
          Las preguntas rápidas terminaron. Ahora viene lo práctico:<br />
          tres escenarios reales donde vas a configurar agentes desde cero.
        </p>
      </div>

      <div className="phase-ex-grid">
        {[
          { num: 'EJ. 1', label: 'Básico' },
          { num: 'EJ. 2', label: 'Intermedio' },
          { num: 'EJ. 3', label: 'Avanzado' },
        ].map((item) => (
          <div key={item.num} className="phase-ex-card">
            <div className="phase-ex-num">{item.num}</div>
            <div className="phase-ex-label">{item.label}</div>
          </div>
        ))}
      </div>

      <button className="btn btn-primary" onClick={onStart}>
        Empezar ejercicios <span style={{ fontSize: '1.1rem' }}>›</span>
      </button>
    </div>
  )
}
