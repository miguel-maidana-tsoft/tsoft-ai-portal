import { useApp } from '../../context/AppContext'
import Checklist from './Checklist'
import InfoCliente from './InfoCliente'

export default function Tracker({ onToast }) {
  const { currentCliente, goToDashboard } = useApp()

  return (
    <div>
      <div className="tracker-header">
        <button className="btn-back" onClick={goToDashboard}>
          ← Volver
        </button>
        <div className="tracker-title-wrap">
          <div className="tracker-title">{currentCliente}</div>
        </div>
      </div>

      <Checklist />

      <div style={{ marginTop: 24 }}>
        <InfoCliente onToast={onToast} />
      </div>
    </div>
  )
}
