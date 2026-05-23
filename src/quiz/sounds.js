// Web Audio API — sin archivos externos, generado en tiempo real
let _ctx = null

function getCtx() {
  if (!_ctx) _ctx = new (window.AudioContext || window.webkitAudioContext)()
  if (_ctx.state === 'suspended') _ctx.resume()
  return _ctx
}

function tone(freq, duration, type = 'sine', volume = 0.12, delay = 0) {
  try {
    const ctx   = getCtx()
    const osc   = ctx.createOscillator()
    const gain  = ctx.createGain()
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.type = type
    osc.frequency.value = freq
    const t = ctx.currentTime + delay
    gain.gain.setValueAtTime(0, t)
    gain.gain.linearRampToValueAtTime(volume, t + 0.01)
    gain.gain.exponentialRampToValueAtTime(0.001, t + duration)
    osc.start(t)
    osc.stop(t + duration + 0.05)
  } catch (_) {}
}

// ── Sonidos del quiz ──────────────────────────────────────────

export function playTick() {
  // Zona de advertencia — tick suave
  tone(660, 0.04, 'square', 0.06)
}

export function playDangerTick() {
  // Zona de peligro — tick más agudo
  tone(880, 0.05, 'square', 0.1)
}

export function playCorrect() {
  // Do5 → Mi5 — chime agradable
  tone(523, 0.12, 'sine', 0.14)
  tone(659, 0.22, 'sine', 0.11, 0.1)
}

export function playWrong() {
  // Descenso corto — buzz
  tone(280, 0.1,  'sawtooth', 0.09)
  tone(200, 0.18, 'sawtooth', 0.07, 0.1)
}

export function playTimeout() {
  // Tres tonos descendentes
  tone(440, 0.09, 'sine', 0.1)
  tone(330, 0.09, 'sine', 0.1,  0.12)
  tone(220, 0.28, 'sine', 0.09, 0.25)
}

export function playVictory(total) {
  // N4 — fanfare ascendente de 4 notas
  if (total >= 12) {
    tone(523,  0.1, 'sine', 0.14)
    tone(659,  0.1, 'sine', 0.14, 0.13)
    tone(784,  0.1, 'sine', 0.14, 0.26)
    tone(1047, 0.4, 'sine', 0.15, 0.39)
    return
  }
  // N3 — dos notas
  if (total >= 9) {
    tone(523, 0.1,  'sine', 0.12)
    tone(659, 0.28, 'sine', 0.12, 0.12)
    return
  }
  // N2/N1 — ding simple
  tone(440, 0.25, 'sine', 0.1)
}
