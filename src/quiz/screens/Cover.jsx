export default function Cover({ onStart }) {
  return (
    <div className="quiz-screen">
      <div className="screen-label">Test de conocimiento · Champions IA</div>
      <h1 className="quiz-h1">¿Cuánto sabés<br />de Agentes IA?</h1>
      <div className="red-line" />
      <p className="subtitle">
        Dos fases, escenarios reales de TSOFT y feedback inmediato.<br />
        Cada decisión importa — igual que en producción.
      </p>

      {/* Dos fases */}
      <div className="cover-phases">

        <div className="cover-phase">
          <div className="cover-phase-num">
            <span className="cover-phase-label">FASE 1</span>
            <span className="cover-phase-tag cover-phase-tag--quiz">Quiz rápido</span>
          </div>
          <div className="cover-phase-title">Teoría en acción</div>
          <ul className="cover-phase-list">
            <li>5 preguntas · 30 segundos por respuesta</li>
            <li>Agentes vs asistentes, Skills, MCPs</li>
            <li>Optimización de modelos: Haiku, Sonnet, Opus</li>
          </ul>
        </div>

        <div className="cover-phase cover-phase--right">
          <div className="cover-phase-num">
            <span className="cover-phase-label">FASE 2</span>
            <span className="cover-phase-tag cover-phase-tag--ex">Desafío práctico</span>
          </div>
          <div className="cover-phase-title">Armá el agente</div>
          <ul className="cover-phase-list">
            <li>3 escenarios reales de clientes TSOFT</li>
            <li>Elegís rol, modelo, tools e integraciones</li>
            <li>Feedback detallado en cada decisión</li>
          </ul>
        </div>

      </div>

      {/* Chips de info */}
      <div className="cover-chips">
        <span className="cover-chip">⏱ ~10 min</span>
        <span className="cover-chip">✓ Feedback automático</span>
        <span className="cover-chip">🏆 Nivel IA al final</span>
      </div>

      <button className="btn btn-primary" onClick={onStart}>
        Empezar <span style={{ fontSize: '1.1rem' }}>›</span>
      </button>
    </div>
  )
}
