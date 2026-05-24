import { useState } from 'react'
import { BLOCK_DEFS, Q_B4 } from './data'
import Mode          from './screens/Mode'
import LiderLogin    from './screens/LiderLogin'
import LiderDashboard from './screens/LiderDashboard'
import Register      from './screens/Register'
import QuizBlock     from './screens/QuizBlock'
import Results       from './screens/Results'

const TOTAL_BLOCKS = BLOCK_DEFS.length  // 6

const INITIAL_ANSWERS = { b1: [], b2: [], b3: [], b4: [], b5: [], b6: [] }

// answers[blockId][qi] = score, answers[blockId][`${qi}_idx`] = option index
const INITIAL_ANS_DETAIL = {}

export default function AssessmentApp() {
  const [screen, setScreen]       = useState('mode')
  const [blockIdx, setBlockIdx]   = useState(0)   // 0-5
  const [user, setUser]           = useState({ nombre: '', cliente: '', rol: '' })
  const [answers, setAnswers]     = useState(INITIAL_ANSWERS)
  const [ansDetail, setAnsDetail] = useState(INITIAL_ANS_DETAIL)
  const [liderCliente, setLiderCliente] = useState(null)

  function reset() {
    setScreen('mode')
    setBlockIdx(0)
    setUser({ nombre: '', cliente: '', rol: '' })
    setAnswers(INITIAL_ANSWERS)
    setAnsDetail(INITIAL_ANS_DETAIL)
  }

  function handleBlockAnswer(blockId, qi, score, optIdx) {
    setAnswers((prev) => {
      const arr = [...(prev[blockId] || [])]
      arr[qi] = score
      return { ...prev, [blockId]: arr }
    })
    setAnsDetail((prev) => ({
      ...prev,
      [`${blockId}_${qi}_idx`]: optIdx,
    }))
  }

  function isOptSelected(blockId, qi, optIdx) {
    return ansDetail[`${blockId}_${qi}_idx`] === optIdx
  }

  const currentBlock = BLOCK_DEFS[blockIdx]
  // B4 questions depend on role
  const resolvedBlock = currentBlock
    ? {
        ...currentBlock,
        questions: currentBlock.id === 'b4'
          ? (Q_B4[user.rol] || Q_B4['Dev'])
          : currentBlock.questions,
      }
    : null

  const progress = screen === 'block'
    ? { label: `Bloque ${blockIdx + 1} / ${TOTAL_BLOCKS}`, pct: blockIdx / TOTAL_BLOCKS }
    : screen === 'results'
    ? { label: '✓ Completado', pct: 1 }
    : null

  return (
    <>
      {/* Header */}
      <header className="as-header">
        <div className="as-header-inner">
          <div className="as-logo">TSOFT<span>›</span></div>
          <div className="as-header-badge">AI ADOPTION PROGRAM · 2026</div>
          {progress ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span className="as-progress-label">{progress.label}</span>
              <div className="as-progress-bar-wrap">
                <div className="as-progress-bar-fill" style={{ width: `${progress.pct * 100}%` }} />
              </div>
            </div>
          ) : <div />}
        </div>
      </header>

      {screen === 'mode' && (
        <Mode
          onColaborador={() => setScreen('register')}
          onLider={() => setScreen('lider-login')}
        />
      )}

      {screen === 'lider-login' && (
        <LiderLogin
          onSuccess={(cliente) => { setLiderCliente(cliente); setScreen('lider') }}
          onBack={() => setScreen('mode')}
        />
      )}

      {screen === 'lider' && (
        <LiderDashboard cliente={liderCliente} onBack={reset} />
      )}

      {screen === 'register' && (
        <Register
          onSubmit={(u) => { setUser(u); setBlockIdx(0); setScreen('block') }}
        />
      )}

      {screen === 'block' && resolvedBlock && (
        <QuizBlock
          key={resolvedBlock.id}
          block={resolvedBlock}
          answers={answers[resolvedBlock.id]}
          isOptSelected={(qi, oi) => isOptSelected(resolvedBlock.id, qi, oi)}
          onChange={(qi, score, optIdx) => handleBlockAnswer(resolvedBlock.id, qi, score, optIdx)}
          onNext={() => {
            if (blockIdx < TOTAL_BLOCKS - 1) setBlockIdx(blockIdx + 1)
            else setScreen('results')
          }}
          onBack={() => {
            if (blockIdx > 0) setBlockIdx(blockIdx - 1)
            else setScreen('register')
          }}
          blockNum={blockIdx + 1}
          totalBlocks={TOTAL_BLOCKS}
          rolLabel={user.rol}
        />
      )}

      {screen === 'results' && (
        <Results user={user} answers={answers} onBack={reset} />
      )}
    </>
  )
}
