import { useState } from 'react'
import { EX1, EX2, EX3 } from './data'
import Cover      from './screens/Cover'
import Register   from './screens/Register'
import QuizPhase  from './screens/QuizPhase'
import Phase2     from './screens/Phase2'
import Exercise   from './screens/Exercise'
import Results    from './screens/Results'

const INITIAL_EX_SEL = {
  ex1: { rol: '', model: '', tools: [] },
  ex2: { platform: '', tools: [], mcp: '' },
  ex3: { orch: '', sub: '', figma: '', skills: '' },
}

// Devuelve qué mostrar en el header según la pantalla
function getHeaderProgress(screen, quizIdx) {
  if (screen === 'quiz')    return { label: `Preg. ${quizIdx + 1} / 5`, pct: quizIdx / 5 }
  if (screen === 'ex1')     return { label: 'Ej. 1 / 3', pct: 0 }
  if (screen === 'ex2')     return { label: 'Ej. 2 / 3', pct: 1 / 3 }
  if (screen === 'ex3')     return { label: 'Ej. 3 / 3', pct: 2 / 3 }
  if (screen === 'results') return { label: '✓ Completado', pct: 1 }
  return null  // cover, register, phase2 → sin barra
}

export default function QuizApp() {
  const [screen, setScreen]         = useState('cover')
  const [quizIdx, setQuizIdx]       = useState(0)
  const [user, setUser]             = useState({ name: '', role: '' })
  const [quizScores, setQuizScores] = useState([])
  const [exScores, setExScores]     = useState([0, 0, 0])
  const [exSel, setExSel]           = useState(INITIAL_EX_SEL)

  function handleExDone(exIdx, score, selections) {
    setExScores((prev) => { const n = [...prev]; n[exIdx] = score; return n })
    setExSel((prev) => ({ ...prev, [`ex${exIdx + 1}`]: selections }))
    setScreen(exIdx < 2 ? `ex${exIdx + 2}` : 'results')
  }

  const exDefs  = [EX1, EX2, EX3]
  const exIndex = screen === 'ex1' ? 0 : screen === 'ex2' ? 1 : screen === 'ex3' ? 2 : -1
  const hdr     = getHeaderProgress(screen, quizIdx)

  return (
    <>
      <header className="quiz-header">
        <div className="quiz-header-inner">
          <div className="header-logo">TSOFT<span>›</span></div>
          <div className="header-badge">AI ADOPTION PROGRAM · CHAMPIONS 2026</div>

          {hdr ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span className="progress-label">{hdr.label}</span>
              <div className="progress-bar-wrap">
                <div className="progress-bar-fill" style={{ width: `${hdr.pct * 100}%` }} />
              </div>
            </div>
          ) : (
            // En cover/register/phase2 mostramos solo el badge sin barra
            <div />
          )}
        </div>
      </header>

      {screen === 'cover' && (
        <Cover onStart={() => setScreen('register')} />
      )}

      {screen === 'register' && (
        <Register
          onSubmit={(name, role) => {
            setUser({ name, role })
            setScreen('quiz')
          }}
        />
      )}

      {screen === 'quiz' && (
        <QuizPhase
          onQuestionChange={setQuizIdx}
          onDone={(scores) => {
            setQuizScores(scores)
            setScreen('phase2')
          }}
        />
      )}

      {screen === 'phase2' && (
        <Phase2 onStart={() => setScreen('ex1')} />
      )}

      {exIndex >= 0 && (
        <Exercise
          key={screen}
          exDef={exDefs[exIndex]}
          totalExercises={3}
          onScore={(score, sel) => handleExDone(exIndex, score, sel)}
        />
      )}

      {screen === 'results' && (
        <Results
          user={user}
          quizScores={quizScores}
          exScores={exScores}
          exSelections={exSel}
        />
      )}
    </>
  )
}
