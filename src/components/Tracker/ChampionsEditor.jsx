import { useState } from 'react'
import { useApp } from '../../context/AppContext'
import { ROLES_CHAMPION } from '../../constants'

function parseChampions(val) {
  if (!val) return []
  try {
    return JSON.parse(val)
  } catch {
    return val ? [{ nombre: val, rol: 'Otro' }] : []
  }
}

export default function ChampionsEditor({ cliente }) {
  const { clientesInfo, actualizarClienteInfo } = useApp()
  const info = clientesInfo[cliente] || {}
  const [champions, setChampions] = useState(() => parseChampions(info.champion))
  const [saved, setSaved] = useState(false)

  async function saveChampions(updated) {
    const val = JSON.stringify(updated)
    await actualizarClienteInfo(cliente, 'champion', val)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  function update(idx, field, value) {
    const updated = champions.map((c, i) => (i === idx ? { ...c, [field]: value } : c))
    setChampions(updated)
    saveChampions(updated)
  }

  function add() {
    const updated = [...champions, { nombre: '', rol: 'Otro' }]
    setChampions(updated)
  }

  function remove(idx) {
    const updated = champions.filter((_, i) => i !== idx)
    setChampions(updated)
    saveChampions(updated)
  }

  return (
    <div>
      <div className="champions-list">
        {champions.map((c, i) => (
          <div className="champion-row" key={i}>
            <input
              className="champion-nombre"
              value={c.nombre}
              placeholder="Nombre del champion"
              onChange={(e) => update(i, 'nombre', e.target.value)}
            />
            <select
              className="champion-rol"
              value={c.rol}
              onChange={(e) => update(i, 'rol', e.target.value)}
            >
              {ROLES_CHAMPION.map((r) => (
                <option key={r}>{r}</option>
              ))}
            </select>
            <button className="champion-del" onClick={() => remove(i)} title="Eliminar">
              ✕
            </button>
          </div>
        ))}
      </div>
      <button className="btn-add-champion" onClick={add}>
        + Agregar champion
      </button>
      <div className={`field-saved ${saved ? 'show' : ''}`}>✓ Guardado</div>
    </div>
  )
}
