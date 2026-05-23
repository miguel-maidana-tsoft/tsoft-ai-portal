import { API_URL } from '../constants'

let _cbCounter = 0

export function sendQuizResult(payload) {
  return new Promise((resolve, reject) => {
    const cbName = `_quizCb${++_cbCounter}`
    const params = new URLSearchParams({ action: 'registrarQuizResult', callback: cbName })
    Object.entries(payload).forEach(([k, v]) => params.append(k, String(v)))

    const script = document.createElement('script')
    window[cbName] = (data) => {
      delete window[cbName]
      script.remove()
      if (data?.status === 'ok') resolve(data)
      else reject(new Error(data?.error || 'Error al guardar'))
    }
    script.onerror = () => {
      delete window[cbName]
      script.remove()
      reject(new Error('Error de red'))
    }
    script.src = `${API_URL}?${params}`
    document.head.appendChild(script)
  })
}
