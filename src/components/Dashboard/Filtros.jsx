import { OLAS, FASES } from '../../constants'

export default function Filtros({ filtros, onChange }) {
  const olasConClientes = OLAS.filter((o) => o.clientes.length > 0)

  return (
    <div className="filtros-bar">
      <div className="filtros-group">
        <span className="filtros-label">Ola</span>
        <button
          className={`filtro-btn ${filtros.ola === 'todos' ? 'active' : ''}`}
          onClick={() => onChange({ ...filtros, ola: 'todos' })}
        >
          Todas
        </button>
        {olasConClientes.map((o) => (
          <button
            key={o.id}
            className={`filtro-btn ${filtros.ola === o.id ? 'active' : ''}`}
            onClick={() => onChange({ ...filtros, ola: o.id })}
          >
            {o.id}
          </button>
        ))}
      </div>

      <div className="filtros-group">
        <span className="filtros-label">Avance</span>
        {[
          { key: 'todos', label: 'Todos' },
          { key: 'sin-empezar', label: 'Sin empezar' },
          { key: 'en-progreso', label: 'En progreso' },
          { key: 'completado', label: 'Completado' },
        ].map((op) => (
          <button
            key={op.key}
            className={`filtro-btn ${filtros.avance === op.key ? 'active' : ''}`}
            onClick={() => onChange({ ...filtros, avance: op.key })}
          >
            {op.label}
          </button>
        ))}
      </div>

      <div className="filtros-group">
        <span className="filtros-label">Fase actual</span>
        <button
          className={`filtro-btn ${filtros.fase === 'todos' ? 'active' : ''}`}
          onClick={() => onChange({ ...filtros, fase: 'todos' })}
        >
          Todas
        </button>
        {FASES.map((f) => (
          <button
            key={f.id}
            className={`filtro-btn ${filtros.fase === String(f.id) ? 'active' : ''}`}
            onClick={() => onChange({ ...filtros, fase: String(f.id) })}
          >
            {f.nombre}
          </button>
        ))}
      </div>
    </div>
  )
}
