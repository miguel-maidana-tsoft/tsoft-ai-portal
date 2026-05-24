import { useCallback, useEffect, useRef, useState } from 'react'
import { QUESTIONS } from '../data'
import { playCorrect, playDangerTick, playTick, playTimeout, playWrong } from '../sounds'

const TIMER_SECS  = 30
const CIRC        = 126
const DELAY_OK    = 10000  // ms antes de avanzar si correcto
const DELAY_FAIL  = 10000  // ms antes de avanzar si incorrecto / timeout

let _floaterSeq = 0

export default function QuizPhase({ onDone, onQuestionChange }) {
  const [idx, setIdx]             = useState(0)
  const [answered, setAnswered]   = useState(false)
  const [timeLeft, setTimeLeft]   = useState(TIMER_SECS)
  const [feedback, setFeedback]   = useState(null) // { type, label, text, delay }
  const [btnStates, setBtnStates] = useState([])
  const [streak, setStreak]       = useState(0)
  const [floaters, setFloaters]   = useState([])

  // Ref para scores — evita closure stale al llamar onDone
  const scoresRef   = useRef([])
  const streakRef   = useRef(0)
  const intervalRef = useRef(null)
  const feedbackRef = useRef(null)

  const q = QUESTIONS[idx]

  // Reset en cada pregunta + notifica al padre el índice actual
  useEffect(() => {
    setAnswered(false)
    setTimeLeft(TIMER_SECS)
    setFeedback(null)
    setFloaters([])
    setBtnStates(new Array(q.options.length).fill(''))
    window.scrollTo({ top: 0, behavior: 'smooth' })
    onQuestionChange?.(idx)
  }, [idx, q.options.length]) // eslint-disable-line

  // Timer con sonidos
  useEffect(() => {
    if (answered) { clearInterval(intervalRef.current); return }
    intervalRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) { clearInterval(intervalRef.current); return 0 }
        const next = t - 1
        if (next <= 8)                          playDangerTick()
        else if (next <= 15 && next % 2 === 0)  playTick()
        return next
      })
    }, 1000)
    return () => clearInterval(intervalRef.current)
  }, [answered, idx])

  // Trigger timeout
  useEffect(() => {
    if (timeLeft === 0 && !answered) handleTimeout()
  }, [timeLeft]) // eslint-disable-line

  // ── Auto-avance ────────────────────────────────────────────
  useEffect(() => {
    if (!feedback) return
    setTimeout(() => feedbackRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 80)
    const timer = setTimeout(() => {
      const nextIdx = idx + 1
      if (nextIdx >= QUESTIONS.length) {
        onDone(scoresRef.current)
      } else {
        setIdx(nextIdx)
      }
    }, feedback.delay)
    return () => clearTimeout(timer)
  }, [feedback]) // eslint-disable-line

  const addFloater = useCallback(() => {
    const id = ++_floaterSeq
    setFloaters((prev) => [...prev, { id }])
    setTimeout(() => setFloaters((prev) => prev.filter((f) => f.id !== id)), 900)
  }, [])

  const handleAnswer = useCallback((chosenIdx) => {
    if (answered) return
    setAnswered(true)
    clearInterval(intervalRef.current)

    const isCorrect = chosenIdx === q.correct
    scoresRef.current = [...scoresRef.current, isCorrect ? 1 : 0]

    setBtnStates(q.options.map((_, i) => {
      if (i === chosenIdx && isCorrect)  return 'correct'
      if (i === chosenIdx && !isCorrect) return 'wrong'
      if (i === q.correct && !isCorrect) return 'reveal'
      return ''
    }))

    if (isCorrect) {
      playCorrect()
      streakRef.current += 1
      setStreak(streakRef.current)
      addFloater()
    } else {
      playWrong()
      streakRef.current = 0
      setStreak(0)
    }

    setFeedback({
      type:  isCorrect ? 'correct' : 'wrong',
      label: isCorrect ? '✓ Correcto' : '✕ Incorrecto',
      text:  q.feedback[isCorrect ? 'ok' : 'fail'],
      delay: isCorrect ? DELAY_OK : DELAY_FAIL,
    })
  }, [answered, q, addFloater])

  function handleTimeout() {
    setAnswered(true)
    clearInterval(intervalRef.current)
    scoresRef.current = [...scoresRef.current, 0]
    setBtnStates(q.options.map((_, i) => (i === q.correct ? 'reveal' : '')))
    playTimeout()
    streakRef.current = 0
    setStreak(0)
    setFeedback({
      type: 'timeout', label: '⏱ Tiempo agotado.',
      text: q.feedback.fail, delay: DELAY_FAIL,
    })
  }

  const ringOffset = CIRC - (CIRC * timeLeft / TIMER_SECS)
  const timerZone  = timeLeft <= 8 ? 'danger' : timeLeft <= 15 ? 'warning' : ''
  const letters    = ['A', 'B', 'C', 'D']

  const streakLabel =
    streak >= 4 ? `🤖⚡ ×${streak} ¡Imparable!` :
    streak === 3 ? '🤖🔥 ×3 En racha' :
    streak === 2 ? '🤖✓ Racha' : null

  return (
    <div className="quiz-screen">

      {/* Floaters +1 */}
      {floaters.map((f) => (
        <div key={f.id} className="q-floater">+1</div>
      ))}

      <div className="quiz-meta">
        <div>
          <div className="screen-label" style={{ marginBottom: '0.2rem' }}>Fase 1 de 2 · Quiz rápido</div>
          <div className="quiz-counter">Pregunta {idx + 1} / {QUESTIONS.length}</div>
        </div>

        <div className={`timer-wrap${timerZone === 'danger' ? ' timer-danger' : ''}`}>
          <svg width="48" height="48" viewBox="0 0 48 48">
            <circle className="timer-ring-bg" cx="24" cy="24" r="20" />
            <circle
              className={`timer-ring-fill${timerZone ? ` ${timerZone}` : ''}`}
              cx="24" cy="24" r="20"
              style={{ strokeDashoffset: ringOffset }}
            />
          </svg>
          <div className="timer-number">{timeLeft}</div>
        </div>
      </div>

      {/* Streak badge — espacio reservado para no desplazar el layout */}
      <div className="q-streak-area">
        {streakLabel && (
          <div key={streak} className="q-streak-badge">{streakLabel}</div>
        )}
      </div>

      {/* Progress bars */}
      <div className="q-dots">
        {QUESTIONS.map((_, i) => (
          <div
            key={i}
            className="q-dot-bar"
            style={{
              background:
                i < idx   ? 'var(--qred)'           :
                i === idx ? 'var(--qwhite)'          :
                            'rgba(255,255,255,0.15)',
            }}
          />
        ))}
      </div>

      <div className={`qtype-tag ${q.type === 'mc' ? 'qtype-mc' : 'qtype-vf'}`}>
        {q.type === 'mc' ? '▪ Opción múltiple' : '◆ Verdadero / Falso'}
      </div>
      <div className="question-text">{q.text}</div>

      <div className="answers-grid">
        {q.options.map((opt, i) => {
          const letter = q.type === 'vf' ? (i === 0 ? '✓' : '✗') : letters[i]
          const cls    = btnStates[i] || ''
          return (
            <button
              key={i}
              className={`answer-btn${cls ? ` ${cls}` : ''}`}
              disabled={answered}
              onClick={() => handleAnswer(i)}
            >
              <span className="answer-letter">{letter}</span>
              <span>{opt}</span>
            </button>
          )
        })}
      </div>

      {/* Feedback con barra de progreso de auto-avance */}
      {feedback && (
        <div ref={feedbackRef} className={`quiz-inline-feedback qfb-${feedback.type}`}>
          <strong>{feedback.label}</strong> — {feedback.text}
          <div
            className="q-auto-progress"
            style={{ '--adv-delay': `${feedback.delay}ms` }}
          />
        </div>
      )}
    </div>
  )
}
