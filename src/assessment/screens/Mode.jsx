export default function Mode({ onColaborador, onLider }) {
  return (
    <div className="as-screen">
      <div className="as-screen-label">Test de Nivelación IA · 2026</div>
      <h1 className="as-h1">¿Cómo querés<br />ingresar?</h1>
      <div className="as-red-line" />
      <p className="as-subtitle">
        Seleccioná tu rol para continuar.<br />
        Argentina · Uso interno · ~10 minutos
      </p>

      <div className="as-mode-grid">
        <button className="as-mode-card" onClick={onColaborador}>
          <div className="as-mode-icon">👤</div>
          <div className="as-mode-title">Soy colaborador</div>
          <div className="as-mode-sub">Completar el test de nivelación</div>
        </button>
        <button className="as-mode-card" onClick={onLider}>
          <div className="as-mode-icon">📊</div>
          <div className="as-mode-title">Soy líder</div>
          <div className="as-mode-sub">Ver resultados del equipo</div>
        </button>
      </div>
    </div>
  )
}
