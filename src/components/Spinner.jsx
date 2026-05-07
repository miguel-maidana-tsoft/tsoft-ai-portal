export default function Spinner({ text = 'Cargando...' }) {
  return (
    <div className="loading">
      <div className="spinner" />
      {text}
    </div>
  )
}
