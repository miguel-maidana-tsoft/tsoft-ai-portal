// GAS del assessment — URL separada del portal principal, no tocar
const GAS_URL = 'https://script.google.com/macros/s/AKfycbyQ4sey3-Is6XROPqRwuTRMxZABtNJ5OR93E7fMyfIp3Vl5LIcUra-RmP506p-l0Q9X/exec'

let _cbSeq = 0

export function saveResult(payload) {
  return fetch(GAS_URL, {
    method: 'POST',
    mode: 'no-cors',
    headers: { 'Content-Type': 'text/plain' },
    body: JSON.stringify({ action: 'save', ...payload }),
  })
}

export function getAllResults() {
  return new Promise((resolve, reject) => {
    const cbName = `_assCb${++_cbSeq}`
    const script = document.createElement('script')
    window[cbName] = (data) => {
      delete window[cbName]
      script.remove()
      resolve(data.rows || [])
    }
    script.onerror = () => {
      delete window[cbName]
      script.remove()
      reject(new Error('Error de red'))
    }
    script.src = `${GAS_URL}?action=getAll&callback=${cbName}&_=${Date.now()}`
    document.head.appendChild(script)
  })
}
