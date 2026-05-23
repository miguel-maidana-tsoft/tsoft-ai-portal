import { useEffect, useRef, useState } from 'react'
import { EX_LABELS, MAX_TOTAL, QUIZ_LABELS, getLevel } from '../data'
import { sendQuizResult } from '../api'
import { playVictory } from '../sounds'
import Confetti from '../Confetti'

const CIRC = 364

export default function Results({ user, quizScores, exScores, exSelections }) {
  const [ringOffset, setRingOffset] = useState(CIRC)
  const [ringColor, setRingColor]   = useState('var(--qred)')
  const [displayScore, setDisplayScore] = useState(0)
  const [sendState, setSendState]   = useState('sending')
  const [showConfetti, setShowConfetti] = useState(false)
  const sentRef = useRef(false)

  const quizTotal = quizScores.reduce((a, b) => a + b, 0)
  const exTotal   = exScores.reduce((a, b) => a + b, 0)
  const total     = quizTotal + exTotal
  const level     = getLevel(total)

  // Clases por nivel para el ring
  const ringLevelClass =
    total >= 12 ? 'ring-n4' :
    total >= 9  ? 'ring-n3' :
    total >= 6  ? 'ring-n2' : 'ring-n1'

  useEffect(() => {
    const pct = total / MAX_TOTAL
    setTimeout(() => {
      setRingOffset(CIRC - CIRC * pct)
      setRingColor(pct >= 0.8 ? '#4DC990' : pct >= 0.55 ? '#F0A030' : '#F07090')
      setDisplayScore(total)
    }, 300)

    // Sonido de victoria
    setTimeout(() => playVictory(total), 600)

    // Confetti solo para N4
    if (total >= 12) {
      setTimeout(() => setShowConfetti(true), 400)
    }
  }, [total])

  useEffect(() => {
    if (sentRef.current) return
    sentRef.current = true

    const payload = {
      nombre:       user.name,
      rol:          user.role,
      score_quiz:   quizTotal,
      score_ex1:    exScores[0],
      score_ex2:    exScores[1],
      score_ex3:    exScores[2],
      score_total:  total,
      nivel:        level.name,
      ex1_rol:      exSelections.ex1?.rol    || '',
      ex1_model:    exSelections.ex1?.model  || '',
      ex1_tools:    (exSelections.ex1?.tools || []).join(', '),
      ex2_platform: exSelections.ex2?.platform || '',
      ex2_tools:    (exSelections.ex2?.tools || []).join(', '),
      ex2_mcp:      exSelections.ex2?.mcp    || '',
      ex3_orch:     exSelections.ex3?.orch   || '',
      ex3_sub:      exSelections.ex3?.sub    || '',
      ex3_figma:    exSelections.ex3?.figma  || '',
      ex3_skills:   exSelections.ex3?.skills || '',
    }

    sendQuizResult(payload)
      .then(() => setSendState('ok'))
      .catch(() => setSendState('err'))
  }, []) // eslint-disable-line

  return (
    <div className="quiz-screen">
      {showConfetti && <Confetti count={100} />}

      <div className="screen-label">Test completado</div>
      <h1 className="quiz-h1">Resultados</h1>
      <div className="red-line" />

      {/* Score ring con animación por nivel */}
      <div className="score-ring-wrap">
        <div className={`score-ring ${ringLevelClass}`}>
          <svg width="140" height="140" viewBox="0 0 140 140">
            <circle cx="70" cy="70" r="58" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="10" />
            <circle
              cx="70" cy="70" r="58" fill="none"
              stroke={ringColor} strokeWidth="10"
              strokeLinecap="round"
              strokeDasharray={CIRC}
              strokeDashoffset={ringOffset}
              style={{ transition: 'stroke-dashoffset 1.2s cubic-bezier(0.34,1.56,0.64,1) 0.3s, stroke 0.5s ease' }}
            />
          </svg>
          <div className="score-ring-label">
            <div className="score-number score-number--anim">{displayScore}</div>
            <div className="score-total">/ {MAX_TOTAL} pts</div>
          </div>
        </div>
      </div>

      {/* Level badge con animación de entrada */}
      <div className="level-badge level-badge--anim">
        <div className="level-name" style={{ color: level.color }}>{level.name}</div>
        <div className="level-desc">{level.desc}</div>
      </div>

      {/* Breakdown */}
      <div className="results-breakdown">
        <div className="results-section-head">Quiz rápido — {quizTotal} / 5 pts</div>
        {quizScores.map((s, i) => (
          <div key={i} className="result-row result-row--anim" style={{ animationDelay: `${0.1 + i * 0.07}s` }}>
            <div className="result-row-label">{QUIZ_LABELS[i]}</div>
            <div className={`result-row-score ${s === 1 ? 'score-full' : 'score-zero'}`}>
              {s === 1 ? '✓' : '✕'}
            </div>
          </div>
        ))}

        <div className="results-section-head" style={{ marginTop: '1rem' }}>
          Ejercicios prácticos — {exTotal} / 9 pts
        </div>
        {exScores.map((s, i) => (
          <div key={i} className="result-row result-row--anim" style={{ animationDelay: `${0.45 + i * 0.1}s` }}>
            <div className="result-row-label">{EX_LABELS[i]}</div>
            <div className={`result-row-score ${s === 3 ? 'score-full' : s >= 2 ? 'score-partial' : 'score-zero'}`}>
              {s} / 3
            </div>
          </div>
        ))}
      </div>

      <div className={`send-status${sendState !== 'sending' ? ` ${sendState}` : ''}`}>
        {sendState === 'sending' && <><span className="q-spinner" /> Enviando resultados…</>}
        {sendState === 'ok'      && '✓ Resultados enviados correctamente.'}
        {sendState === 'err'     && '⚠️ No se pudo enviar. Compartí tu score manualmente.'}
      </div>

      <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
        <button className="btn btn-outline" onClick={() => window.location.reload()}>
          Volver a intentar
        </button>
      </div>
    </div>
  )
}
