import { useEffect } from 'react'
import { useApp } from '../../context/AppContext'
import { OLAS } from '../../constants'
import KpiGrid from './KpiGrid'
import ClienteCard from './ClienteCard'
import Spinner from '../Spinner'

export default function Dashboard() {
  const { resumen, clientesInfo, loadDashboard } = useApp()
  const loaded = Object.keys(resumen).length > 0

  useEffect(() => {
    loadDashboard()
  }, [loadDashboard])

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Dashboard · Ola 1</div>
          <div className="page-subtitle">Estado general del programa — Argentina 2026</div>
        </div>
      </div>

      {!loaded ? (
        <Spinner />
      ) : (
        <>
          <KpiGrid resumen={resumen} />
          <div className="clientes-grid">
            {OLAS.flatMap((o) => o.clientes).map((cliente) => (
              <ClienteCard
                key={cliente}
                cliente={cliente}
                resumen={resumen[cliente]}
                info={clientesInfo[cliente]}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
