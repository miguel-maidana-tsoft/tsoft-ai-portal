import { API_URL } from '../constants'

let _counter = 0

function jsonp(params) {
  return new Promise((resolve, reject) => {
    const cbName = '_tsoftCb' + ++_counter
    const scriptId = '_jsonp_' + cbName

    const timeout = setTimeout(() => {
      cleanup()
      reject(new Error('JSONP timeout'))
    }, 10000)

    function cleanup() {
      delete window[cbName]
      document.getElementById(scriptId)?.remove()
      clearTimeout(timeout)
    }

    window[cbName] = (data) => {
      cleanup()
      resolve(data)
    }

    const url = new URL(API_URL)
    Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v))
    url.searchParams.set('callback', cbName)

    const script = document.createElement('script')
    script.id = scriptId
    script.src = url.toString()
    script.onerror = () => {
      cleanup()
      reject(new Error('JSONP error'))
    }
    document.head.appendChild(script)
  })
}

// Referencia estable a nivel de módulo — evita que useCallback en AppContext
// se recree en cada render y dispare loops infinitos en useEffect
const call = (params) => jsonp(params)

export function useApi() {
  return { call }
}
