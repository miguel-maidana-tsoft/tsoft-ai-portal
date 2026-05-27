import { useApp } from '../../context/AppContext'
import { OLAS } from '../../constants'
import Tablero from '../Tablero'

export default function OlaView() {
  const { currentOla } = useApp()
  const ola = OLAS.find((o) => o.id === currentOla) || OLAS[0]

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">{ola.label}</div>
          <div className="page-subtitle">Tablero de seguimiento de la ola</div>
        </div>
      </div>
      <Tablero hideHeader tableroId={ola.tableroId} />
    </div>
  )
}
