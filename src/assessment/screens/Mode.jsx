function IconColaborador() {
  return (
    <svg width="52" height="52" viewBox="0 0 52 52" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Person */}
      <circle cx="20" cy="15" r="8" stroke="white" strokeWidth="2"/>
      <path d="M4 46c0-8.837 7.163-16 16-16s16 7.163 16 16" stroke="white" strokeWidth="2" strokeLinecap="round"/>
      {/* AI nodes — neural network accent */}
      <circle cx="40" cy="14" r="3" fill="#C8102E"/>
      <circle cx="46" cy="24" r="2.5" fill="#C8102E" opacity="0.75"/>
      <circle cx="34" cy="26" r="2.5" fill="#C8102E" opacity="0.75"/>
      <circle cx="44" cy="8"  r="2"   fill="#C8102E" opacity="0.55"/>
      <line x1="40" y1="17"  x2="44" y2="22"  stroke="#C8102E" strokeWidth="1.5" opacity="0.7"/>
      <line x1="40" y1="17"  x2="34" y2="23.5" stroke="#C8102E" strokeWidth="1.5" opacity="0.7"/>
      <line x1="44" y1="10"  x2="40" y2="11"   stroke="#C8102E" strokeWidth="1.5" opacity="0.5"/>
      <line x1="44" y1="23.5" x2="35" y2="25.5" stroke="#C8102E" strokeWidth="1.2" opacity="0.4"/>
    </svg>
  )
}

function IconLider() {
  return (
    <svg width="52" height="52" viewBox="0 0 52 52" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Bar chart */}
      <rect x="4"  y="32" width="10" height="14" rx="2" fill="white" opacity="0.35"/>
      <rect x="21" y="22" width="10" height="24" rx="2" fill="white" opacity="0.6"/>
      <rect x="38" y="12" width="10" height="34" rx="2" fill="#C8102E"/>
      {/* Trend line */}
      <path d="M9 28 L26 18 L43 8" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      {/* Arrow head */}
      <path d="M39 6 L44 8 L41 12.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

export default function Mode({ onColaborador, onLider }) {
  return (
    <div className="as-screen">
      <div className="as-screen-label">AI Adoption Program · 2026</div>
      <h1 className="as-h1">
        Test de Nivelación IA
      </h1>
      <div className="as-red-line" />
      <p className="as-subtitle">
        Medimos tu nivel actual de adopción de IA para guiar tu desarrollo.<br />
        Seleccioná tu rol para comenzar · ~10 minutos
      </p>

      <div className="as-mode-grid">
        <button className="as-mode-card" onClick={onColaborador}>
          <div className="as-mode-icon"><IconColaborador /></div>
          <div className="as-mode-title">Soy colaborador</div>
          <div className="as-mode-sub">Completar el test de nivelación</div>
        </button>
        <button className="as-mode-card" onClick={onLider}>
          <div className="as-mode-icon"><IconLider /></div>
          <div className="as-mode-title">Soy líder</div>
          <div className="as-mode-sub">Ver resultados del equipo</div>
        </button>
      </div>
    </div>
  )
}
