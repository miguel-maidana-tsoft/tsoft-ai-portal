// ── PREGUNTAS RÁPIDAS (5 preguntas, 1 pt c/u) ───────────────────────────
export const QUESTIONS = [
  {
    type: 'mc',
    text: '¿Cuál es la diferencia principal entre un asistente de IA y un agente de IA?',
    options: [
      'El agente usa un modelo más potente',
      'El agente recibe un objetivo y define los pasos solo, con herramientas y contexto',
      'El asistente puede ejecutar código y el agente no',
      'Son lo mismo, el agente es solo un nombre más técnico',
    ],
    correct: 1,
    feedback: {
      ok:   'Exacto. El cambio clave es la autonomía: el agente no espera que vos le digas cada paso — recibe un objetivo, razona el plan y ejecuta con las herramientas que tiene.',
      fail: 'La diferencia no está en el modelo, sino en la autonomía. Un agente recibe un objetivo, define sus propios pasos y ejecuta usando herramientas reales — sin que vos lo guíes en cada decisión.',
    },
  },
  {
    type: 'vf',
    text: '¿Verdadero o Falso?\n\n"Cuando un agente arranca, carga el contenido completo de todas sus Skills disponibles."',
    options: ['Verdadero', 'Falso'],
    correct: 1,
    feedback: {
      ok:   'Correcto, es Falso. Al arrancar solo se cargan el name y description de cada Skill (~100 tokens c/u). El cuerpo completo se carga únicamente cuando el agente decide activar esa Skill. Eso se llama carga progresiva.',
      fail: 'Es Falso. Al arrancar la sesión el agente solo lee el name + description de cada Skill para saber qué tiene disponible. El contenido completo se carga a demanda, cuando realmente la necesita. Así el contexto se mantiene limpio.',
    },
  },
  {
    type: 'mc',
    text: '¿Qué puede hacer un MCP que una Skill no puede hacer?',
    options: [
      'Darle instrucciones más detalladas al agente',
      'Conectar al agente con sistemas externos como Jira, GitLab o Figma en tiempo real',
      'Hacer que el agente use un modelo más barato',
      'Cargar el contexto del proyecto automáticamente',
    ],
    correct: 1,
    feedback: {
      ok:   'Correcto. Un MCP expone herramientas reales al agente — puede leer tickets de Jira, revisar PRs en GitLab, inspeccionar diseños en Figma. Una Skill son instrucciones; un MCP es una conexión activa a un sistema externo.',
      fail: 'La diferencia es que un MCP es una conexión activa: expone herramientas reales que el agente puede llamar para leer o escribir en sistemas externos. Una Skill solo agrega instrucciones y contexto — no puede hacer calls a APIs.',
    },
  },
  {
    type: 'vf',
    text: '¿Verdadero o Falso?\n\n"Usar Opus 4.6 para todos los agentes del equipo garantiza los mejores resultados."',
    options: ['Verdadero', 'Falso'],
    correct: 1,
    feedback: {
      ok:   'Correcto, es Falso. Un agente de revisión de código rutinaria con Haiku 4.5 rinde igual o mejor que con Opus, a ~0.20x del costo. Opus tiene sentido para análisis arquitectónico crítico — no para tareas repetitivas.',
      fail: 'Es Falso. Un agente focalizado en una tarea específica (revisar código, formatear, validar) rinde igual o mejor con Haiku 4.5 a una fracción del costo. Usar el modelo más grande para todo es costoso y no mejora los resultados.',
    },
  },
  {
    type: 'mc',
    text: 'Un agente tiene que formatear automáticamente cientos de archivos JSON según un esquema fijo. ¿Qué modelo conviene usar?',
    options: [
      'Opus 4.6 — para asegurar la mayor precisión posible',
      'Sonnet 4.6 — es el modelo estándar del equipo',
      'Haiku 4.5 — tarea repetitiva y focalizada, no requiere razonamiento complejo',
      'Cualquiera da lo mismo para tareas de formateo',
    ],
    correct: 2,
    feedback: {
      ok:   'Perfecto. Haiku 4.5 es ideal para tareas mecánicas y repetitivas como formateo masivo. Costo ~0.33x comparado con Sonnet, mismo resultado. Reservás Sonnet para planificación y razonamiento, Opus para decisiones críticas.',
      fail: 'Para una tarea mecánica y repetitiva como formatear archivos JSON, Haiku 4.5 es la respuesta correcta. No requiere razonamiento complejo — y el ahorro de costo es real: ~0.33x vs Sonnet. Usar Opus o Sonnet aquí es desperdicio.',
    },
  },
]

// ── EJERCICIOS PRÁCTICOS (3 pts c/u) ────────────────────────────────────
// validate(sel) → { score: number, details: { ok: bool|'partial', txt: string }[] }

export const EX1 = {
  num: 1,
  title: 'El Planificador de Desarrollo',
  difficulty: 'easy',
  scenario:
    'Un cliente nuevo arranca un proyecto. El equipo necesita un agente que <strong>lea los documentos funcionales del repo y arme un plan de desarrollo estructurado</strong>. El agente solo debe analizar y planificar — <strong>todavía no tiene que tocar ni crear ningún archivo</strong>.',
  sections: [
    {
      key: 'rol',
      label: 'Rol del agente',
      type: 'single',
      options: [
        { val: 'dev-planner',   label: 'dev-planner' },
        { val: 'dev-agent',     label: 'dev-agent' },
        { val: 'code-executor', label: 'code-executor' },
        { val: 'deploy-agent',  label: 'deploy-agent' },
      ],
    },
    {
      key: 'model',
      label: 'Modelo',
      type: 'single',
      options: [
        { val: 'haiku',  label: 'Haiku 4.5 — tareas rápidas y repetitivas' },
        { val: 'sonnet', label: 'Sonnet 4.6 — razonamiento y planificación' },
        { val: 'opus',   label: 'Opus 4.6 — análisis crítico profundo' },
      ],
    },
    {
      key: 'tools',
      label: 'Tools (podés elegir varias)',
      type: 'multi',
      options: [
        { val: 'Read',     label: 'Read' },
        { val: 'Glob',     label: 'Glob' },
        { val: 'Write',    label: 'Write' },
        { val: 'Bash',     label: 'Bash' },
        { val: 'Grep',     label: 'Grep' },
        { val: 'WebFetch', label: 'WebFetch' },
      ],
    },
  ],
  initialState: { rol: '', model: '', tools: [] },
  previewTitle: 'Vista previa del frontmatter',
  getPreview: (sel) => [
    { key: 'name:',  value: sel.rol   || '_', color: 'white' },
    { key: 'model:', value: sel.model || '_', color: 'green' },
    { key: 'tools:', value: sel.tools?.length ? sel.tools.join(', ') : '_', color: 'blue' },
  ],
  isReady: (sel) => !!sel.rol && !!sel.model && sel.tools?.length >= 1,
  validate(sel) {
    let score = 0
    const details = []

    // ROL
    if (sel.rol === 'dev-planner') {
      score++
      details.push({ ok: true, txt: '<strong>Rol correcto.</strong> <em>dev-planner</em> comunica exactamente lo que hace el agente: planifica, no ejecuta. Un nombre preciso evita que el LLM "desvíe" su comportamiento hacia tareas que no le corresponden.' })
    } else if (sel.rol === 'dev-agent') {
      details.push({ ok: false, txt: '<strong>Demasiado genérico.</strong> <em>dev-agent</em> no le dice al modelo qué rol cumple — podría hacer cualquier cosa. La especificidad del nombre influye directamente en cómo el agente interpreta sus instrucciones.' })
    } else if (sel.rol === 'code-executor') {
      details.push({ ok: false, txt: '<strong>Rol incorrecto.</strong> <em>code-executor</em> implica ejecución. Este agente solo tiene que leer y planificar — si el nombre dice "ejecutor", el modelo va a tender a hacer más de lo que debe.' })
    } else {
      details.push({ ok: false, txt: '<strong>Rol incorrecto.</strong> <em>deploy-agent</em> refiere a despliegues, que no tiene nada que ver con este escenario. El nombre del agente debe reflejar su propósito real.' })
    }

    // MODEL
    if (sel.model === 'sonnet') {
      score++
      details.push({ ok: true, txt: '<strong>Modelo correcto.</strong> Armar un plan de desarrollo requiere razonamiento: entender requerimientos, detectar dependencias y estructurar prioridades. Eso es Sonnet 4.6 — no es una tarea mecánica repetitiva.' })
    } else if (sel.model === 'haiku') {
      details.push({ ok: false, txt: '<strong>Haiku se queda corto aquí.</strong> Haiku es ideal para tareas focalizadas y repetitivas (formatear, buscar, validar). Leer docs funcionales y armar un plan estructurado requiere razonamiento real — eso es Sonnet.' })
    } else {
      details.push({ ok: false, txt: '<strong>Opus es excesivo para este escenario.</strong> Opus se reserva para análisis arquitectónico crítico o decisiones de alta complejidad. Para planificación de desarrollo Sonnet tiene suficiente capacidad a menor costo.' })
    }

    // TOOLS
    const hasRead  = sel.tools.includes('Read')
    const hasGlob  = sel.tools.includes('Glob')
    const hasWrite = sel.tools.includes('Write')
    const hasBash  = sel.tools.includes('Bash')
    const hasGrep  = sel.tools.includes('Grep')
    const goodTools = hasRead && hasGlob
    const badTools  = hasWrite || hasBash

    if (goodTools && !badTools) {
      score++
      details.push({ ok: true, txt: `<strong>Tools perfectas.</strong> <em>Read</em> para leer los documentos funcionales y <em>Glob</em> para navegar la estructura del repo es exactamente lo que este agente necesita. Sin Write ni Bash garantizás que solo analiza — no modifica nada.${hasGrep ? ' Grep es inofensivo aunque no era necesario.' : ''}` })
    } else if (goodTools && badTools) {
      details.push({ ok: 'partial', txt: `<strong>Casi — sobran tools peligrosas.</strong> Read y Glob están bien, pero ${hasWrite ? '<em>Write</em> ' : ''}${hasBash ? '<em>Bash</em>' : ''} le dan al agente la capacidad de modificar o ejecutar. El escenario dice que todavía no tiene que tocar nada.` })
    } else if (!hasRead && !hasGlob) {
      details.push({ ok: false, txt: '<strong>Faltan las tools esenciales.</strong> Sin <em>Read</em> el agente no puede leer los documentos funcionales, y sin <em>Glob</em> no puede navegar la estructura del repo. No tiene cómo hacer su trabajo.' })
    } else if (!hasRead) {
      details.push({ ok: false, txt: '<strong>Falta Read.</strong> Sin <em>Read</em> el agente no puede leer el contenido de los archivos — solo navegar la estructura. No puede armar un plan sin leer los documentos.' })
    } else {
      details.push({ ok: false, txt: '<strong>Falta Glob.</strong> Sin <em>Glob</em> el agente no puede navegar y descubrir los archivos del repo. Necesitás Read para leer + Glob para explorar la estructura.' })
    }

    return { score, details }
  },
}

export const EX2 = {
  num: 2,
  title: 'El Agente de QA con Rovo',
  difficulty: 'medium',
  scenario:
    'El equipo de QA quiere un agente Rovo en Atlassian que, dado un número de ticket de Jira, <strong>genere automáticamente los casos de prueba, los documente en Confluence y actualice el estado del ticket</strong>. El equipo usa Atlassian para todo — no hay repos externos.',
  sections: [
    {
      key: 'platform',
      label: 'Plataforma del agente',
      type: 'single',
      options: [
        { val: 'claude-code', label: 'Claude Code (.claude/agents/)' },
        { val: 'rovo',        label: 'Atlassian Rovo' },
        { val: 'copilot',     label: 'GitHub Copilot' },
        { val: 'codex',       label: 'OpenAI Codex' },
      ],
    },
    {
      key: 'tools',
      label: 'Tools / integraciones necesarias',
      type: 'multi',
      options: [
        { val: 'jira',       label: 'Jira' },
        { val: 'confluence', label: 'Confluence' },
        { val: 'bitbucket',  label: 'Bitbucket' },
        { val: 'github',     label: 'GitHub' },
        { val: 'gitlab',     label: 'GitLab' },
        { val: 'figma',      label: 'Figma' },
      ],
    },
    {
      key: 'mcp',
      label: '¿Necesita configurar un MCP adicional?',
      type: 'single',
      options: [
        { val: 'si', label: 'Sí, necesita MCP para conectarse' },
        { val: 'no', label: 'No, tiene acceso nativo' },
      ],
    },
  ],
  initialState: { platform: '', tools: [], mcp: '' },
  previewTitle: 'Vista previa',
  getPreview: (sel) => [
    { key: 'platform:',   value: sel.platform || '_',                              color: 'white' },
    { key: 'tools:',      value: sel.tools?.length ? sel.tools.join(', ') : '_',   color: 'blue' },
    { key: 'mcp_needed:', value: sel.mcp || '_',                                   color: 'green' },
  ],
  isReady: (sel) => !!sel.platform && sel.tools?.length >= 1 && !!sel.mcp,
  validate(sel) {
    let score = 0
    const details = []

    if (sel.platform === 'rovo') {
      score++
      details.push({ ok: true, txt: '<strong>Plataforma correcta.</strong> Atlassian Rovo es el agente nativo del ecosistema Atlassian. Accede a Jira, Confluence y Bitbucket sin configuración adicional.' })
    } else {
      details.push({ ok: false, txt: `<strong>Plataforma incorrecta (${sel.platform}).</strong> El escenario dice "el equipo usa Atlassian para todo". Rovo es el agente nativo — las otras plataformas necesitarían MCPs adicionales para conectarse a Jira y Confluence.` })
    }

    const hasJira = sel.tools.includes('jira')
    const hasConf = sel.tools.includes('confluence')
    const hasFigma = sel.tools.includes('figma')
    const hasGitHub = sel.tools.includes('github')

    if (hasJira && hasConf) {
      score++
      details.push({ ok: true, txt: '<strong>Integraciones correctas.</strong> Jira (gestión del ticket) + Confluence (documentación) son exactamente lo que el flujo necesita.' + (hasFigma || hasGitHub ? ' Las otras herramientas seleccionadas no eran necesarias en este escenario.' : '') })
    } else {
      details.push({ ok: false, txt: `<strong>Integraciones incompletas.</strong> El flujo necesita <em>Jira</em> (leer el ticket y actualizar estado) y <em>Confluence</em> (documentar los casos de prueba). ${!hasJira ? 'Faltó Jira. ' : ''}${!hasConf ? 'Faltó Confluence.' : ''}` })
    }

    if (sel.mcp === 'no') {
      score++
      details.push({ ok: true, txt: '<strong>Correcto.</strong> Rovo tiene acceso nativo al ecosistema Atlassian. No necesita configurar un MCP porque Jira, Confluence y Bitbucket ya están integrados de fábrica.' })
    } else {
      details.push({ ok: false, txt: '<strong>Incorrecto.</strong> Rovo es nativo en Atlassian — Jira, Confluence y Bitbucket están integrados sin necesidad de MCP. Los MCPs los necesitarías si usaras Claude Code u otro agente externo.' })
    }

    return { score, details }
  },
}

export const EX3 = {
  num: 3,
  title: 'El Ecosistema Orquestado',
  difficulty: 'hard',
  scenario:
    'Un arquitecto de soluciones necesita diseñar un flujo multi-agente para el onboarding de una nueva feature en un cliente bancario. El flujo es: <strong>Sonnet planifica → sub-agentes de Haiku implementan en paralelo → un agente final valida contra los diseños de Figma</strong>. ¿Qué piezas hay que configurar?',
  sections: [
    {
      key: 'orch',
      label: 'Modelo del orquestador',
      type: 'single',
      options: [
        { val: 'haiku',  label: 'Haiku 4.5 — más barato' },
        { val: 'sonnet', label: 'Sonnet 4.6 — razonamiento' },
        { val: 'opus',   label: 'Opus 4.6 — máxima capacidad' },
      ],
    },
    {
      key: 'sub',
      label: 'Modelo de los sub-agentes de implementación',
      type: 'single',
      options: [
        { val: 'haiku',  label: 'Haiku 4.5 — tareas focalizadas' },
        { val: 'sonnet', label: 'Sonnet 4.6 — mismo modelo' },
        { val: 'opus',   label: 'Opus 4.6 — más potencia' },
      ],
    },
    {
      key: 'figma',
      label: '¿Cómo accede el agente validador a Figma?',
      type: 'single',
      options: [
        { val: 'manual', label: 'Le paso el link manualmente en el prompt' },
        { val: 'mcp',    label: 'Configuro el MCP de Figma en el agente' },
        { val: 'skill',  label: 'Creo una Skill de Figma con instrucciones' },
        { val: 'nada',   label: 'No puede acceder a Figma' },
      ],
    },
    {
      key: 'skills',
      label: '¿Cuándo cargan sus skills los sub-agentes?',
      type: 'single',
      options: [
        { val: 'inicio',  label: 'Al inicio, todas precargadas en el frontmatter' },
        { val: 'demanda', label: 'A demanda, cuando las necesitan' },
        { val: 'manual2', label: 'Manualmente, el agente no carga skills' },
      ],
    },
  ],
  initialState: { orch: '', sub: '', figma: '', skills: '' },
  previewTitle: 'Vista previa del flujo',
  getPreview: (sel) => [
    { key: '# Orquestador', value: '',           color: 'muted', isComment: true },
    { key: 'model:',        value: sel.orch  || '_', color: 'green' },
    { key: '# Sub-agentes', value: '',           color: 'muted', isComment: true },
    { key: 'sub_model:',    value: sel.sub   || '_', color: 'green' },
    { key: 'figma_access:', value: sel.figma || '_', color: 'blue' },
    { key: 'skills_load:',  value: sel.skills || '_', color: 'white' },
  ],
  isReady: (sel) => !!sel.orch && !!sel.sub && !!sel.figma && !!sel.skills,
  validate(sel) {
    let score = 0
    const details = []

    if (sel.orch === 'sonnet') {
      score++
      details.push({ ok: true, txt: '<strong>Orquestador correcto.</strong> Sonnet 4.6 es el modelo de razonamiento y planificación. Define el plan, identifica ambigüedades y delega — es el cerebro del flujo.' })
    } else if (sel.orch === 'haiku') {
      details.push({ ok: false, txt: '<strong>Haiku es demasiado limitado para orquestar.</strong> El orquestador necesita razonar sobre el plan completo, detectar ambigüedades y coordinar sub-agentes. Eso requiere Sonnet.' })
    } else {
      details.push({ ok: false, txt: '<strong>Opus es excesivo para orquestar.</strong> Sonnet ya tiene la capacidad de razonamiento y planificación necesaria. Opus es para análisis crítico de arquitectura, no para orquestación.' })
    }

    if (sel.sub === 'haiku') {
      score++
      details.push({ ok: true, txt: '<strong>Sub-agentes correctos.</strong> Haiku 4.5 para tareas focalizadas en paralelo es el patrón óptimo. Costo ~0.33x con excelente rendimiento en tareas específicas.' })
    } else {
      details.push({ ok: false, txt: `<strong>Sub-agentes con modelo incorrecto (${sel.sub}).</strong> Los sub-agentes ejecutan tareas específicas y repetitivas en paralelo — Haiku es ideal. Usar Sonnet u Opus multiplica el costo sin beneficio real.` })
    }

    if (sel.figma === 'mcp') {
      score++
      details.push({ ok: true, txt: '<strong>Acceso a Figma correcto.</strong> Configurar el MCP de Figma permite al agente inspeccionar componentes, leer tokens de diseño y extraer specs directamente — sin intervención manual.' })
    } else if (sel.figma === 'manual') {
      details.push({ ok: false, txt: '<strong>El acceso manual rompería la automatización.</strong> Si el agente necesita que vos le pases el link cada vez, el flujo ya no es autónomo. El MCP de Figma resuelve esto.' })
    } else if (sel.figma === 'skill') {
      details.push({ ok: false, txt: '<strong>Una Skill no puede acceder a Figma.</strong> Una Skill son instrucciones — no puede hacer calls a APIs externas. Para acceder a sistemas externos necesitás un MCP.' })
    } else {
      details.push({ ok: false, txt: '<strong>Sí puede acceder a Figma.</strong> Configurando el MCP de Figma el agente puede inspeccionar diseños, leer tokens y extraer specs directamente desde el archivo.' })
    }

    if (sel.skills === 'demanda') {
      details.push({ ok: true, txt: '<strong>Carga de skills correcta.</strong> A demanda — el agente conoce las skills disponibles (solo name+description al arrancar) y las carga completas cuando las necesita. Contexto limpio y costo bajo.' })
    } else {
      details.push({ ok: false, txt: '<strong>No precargar skills.</strong> Si listás las skills en el frontmatter, se cargan todas al inicio aunque no se usen — desperdicio de contexto y tokens. La carga a demanda es el patrón correcto.' })
    }

    return { score, details }
  },
}

export const EXERCISES = [EX1, EX2, EX3]

export const MAX_QUIZ_SCORE = QUESTIONS.length        // 5
export const MAX_EX_SCORE   = EXERCISES.length * 3   // 9
export const MAX_TOTAL      = MAX_QUIZ_SCORE + MAX_EX_SCORE  // 14

export const QUIZ_LABELS = [
  '¿Asistente vs Agente?',
  'Skills: carga progresiva',
  'MCP vs Skill',
  'Modelos: Opus para todo',
  'Haiku, Sonnet u Opus',
]

export const EX_LABELS = [
  'EJ.1 — El Planificador de Desarrollo',
  'EJ.2 — El Agente QA con Rovo',
  'EJ.3 — El Ecosistema Orquestado',
]

export function getLevel(total) {
  if (total >= 12) return {
    name: 'Champion N4 — Constructor',
    desc: 'Dominás agentes, skills, MCP y optimización. Estás listo para construir y escalar.',
    color: '#4DC990',
  }
  if (total >= 9) return {
    name: 'Champion N3 — Agentivo',
    desc: 'Operás y configurás agentes correctamente. Un par de conceptos más y llegás a N4.',
    color: '#F0A030',
  }
  if (total >= 6) return {
    name: 'Champion N2 — Asistido',
    desc: 'Tenés la base. Revisá las secciones de MCP y optimización de tokens.',
    color: '#F07090',
  }
  return {
    name: 'N1 — Explorador',
    desc: 'Recomendamos revisar el material antes del primer encuentro. ¡Vas a poder!',
    color: '#F07090',
  }
}
