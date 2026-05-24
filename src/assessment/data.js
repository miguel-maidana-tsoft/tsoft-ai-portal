// ── Auth ─────────────────────────────────────────────────────
export const SUPER_ADMIN_CODE = 'tsoft-admin-2026'
export const LIDER_CODES = {
  'correo-2026': 'Correo Argentino',
  'claro-2026':  'Claro Argentina',
  'tuenti-2026': 'Telefónica — Tuenti',
  'am-2026':     'Telefónica — AM',
}

// ── Clientes / Roles ─────────────────────────────────────────
export const CLIENTES = [
  'Correo Argentino',
  'Telefónica — Tuenti',
  'Telefónica — AM',
  'Claro Argentina',
  'Otro',
]

export const ROLES = [
  { id: 'QA',       name: 'QA',            sub: 'Funcional / Auto / Perf' },
  { id: 'Dev',      name: 'Dev',           sub: 'Front / Back / Full' },
  { id: 'BA',       name: 'BA / Funcional', sub: 'Analista / PO' },
  { id: 'DevOps',   name: 'DevOps / SRE',  sub: 'Infra / Pipelines' },
  { id: 'PM',       name: 'PM / SM',       sub: 'Proyecto / Scrum' },
  { id: 'Preventa', name: 'Preventa',      sub: 'Propuestas / Comercial' },
]

// ── Preguntas por bloque ──────────────────────────────────────
export const Q_B1 = [
  {
    text: '¿Con qué frecuencia usás alguna herramienta de IA (Claude, Copilot, Rovo u otra) en tu trabajo?',
    opts: [
      { l: 'Nunca o casi nunca', s: 0 },
      { l: 'Una vez por semana o menos', s: 1 },
      { l: 'Varias veces por semana', s: 2 },
      { l: 'Todos los días, es parte de mi rutina', s: 3 },
    ],
  },
  {
    text: '¿Tenés prompts propios guardados que reutilizás habitualmente?',
    opts: [
      { l: 'No, improviso cada vez', s: 0 },
      { l: 'Tengo alguno suelto pero no los organizo', s: 1 },
      { l: 'Sí, tengo prompts guardados y los reutilizo', s: 2 },
      { l: 'Sí, documentados y los comparto con el equipo', s: 3 },
    ],
  },
]

export const Q_B2 = [
  {
    text: '¿Qué es un agente de IA?',
    opts: [
      { l: 'Un chatbot que responde preguntas en tiempo real', s: 0 },
      { l: 'Un modelo de lenguaje como GPT o Claude', s: 0 },
      { l: 'Un sistema que ejecuta tareas de forma autónoma usando herramientas, contexto y decisiones encadenadas', s: 3 },
      { l: 'Un script automatizado que reemplaza al programador', s: 1 },
    ],
  },
  {
    text: '¿Qué es un Skill en el contexto de IA agéntica?',
    opts: [
      { l: 'Una certificación que recibe el colaborador al terminar una capacitación', s: 0 },
      { l: 'Una capacidad reutilizable que le indica a un agente cómo realizar una tarea específica', s: 3 },
      { l: 'Un nivel de conocimiento del colaborador sobre IA', s: 0 },
      { l: 'Un plugin de navegador para usar IA más rápido', s: 1 },
    ],
  },
  {
    text: '¿Qué es un MCP (Model Context Protocol)?',
    opts: [
      { l: 'Un protocolo de seguridad para datos en la nube', s: 0 },
      { l: 'Un framework de testing para modelos de lenguaje', s: 0 },
      { l: 'Un estándar que permite a los agentes conectarse con sistemas externos como Jira, GitLab o Confluence', s: 3 },
      { l: 'Un modelo de IA especializado en código', s: 1 },
    ],
  },
  {
    text: '¿Qué es un orquestador en IA agéntica?',
    opts: [
      { l: 'El responsable del equipo que coordina quién usa qué herramienta', s: 0 },
      { l: 'Un sistema que coordina la ejecución de múltiples agentes para lograr un objetivo complejo', s: 3 },
      { l: 'Una plataforma de monitoreo de infraestructura', s: 0 },
      { l: 'El modelo de lenguaje principal que responde al usuario', s: 1 },
    ],
  },
  {
    text: '¿Qué es un system prompt?',
    opts: [
      { l: 'El primer mensaje que el usuario le escribe a la IA', s: 0 },
      { l: 'Un archivo de configuración del servidor donde corre el modelo', s: 0 },
      { l: 'Una instrucción que configura el comportamiento y contexto del agente antes de que el usuario interactúe', s: 3 },
      { l: 'Un tipo de prompt que solo pueden usar desarrolladores senior', s: 1 },
    ],
  },
  {
    text: '¿Cuál es la diferencia entre un LLM y un agente?',
    opts: [
      { l: 'No hay diferencia, son lo mismo', s: 0 },
      { l: 'El LLM es más inteligente que el agente', s: 0 },
      { l: 'El LLM genera texto; el agente usa un LLM como motor pero además toma decisiones, usa herramientas y ejecuta acciones', s: 3 },
      { l: 'El agente funciona sin internet y el LLM no', s: 0 },
    ],
  },
  {
    text: '¿Qué es el "contexto" en una conversación con un modelo de IA?',
    opts: [
      { l: 'El historial completo de mensajes e información disponible que el modelo puede ver en ese momento', s: 3 },
      { l: 'El servidor donde está alojado el modelo', s: 0 },
      { l: 'La velocidad de respuesta del modelo', s: 0 },
      { l: 'El idioma en que está configurado el modelo', s: 0 },
    ],
  },
  {
    text: '¿Qué es el RAG (Retrieval-Augmented Generation)?',
    opts: [
      { l: 'Un tipo de modelo de IA más avanzado que GPT', s: 0 },
      { l: 'Una técnica que permite a la IA buscar y usar información externa antes de generar una respuesta', s: 3 },
      { l: 'Un protocolo de seguridad para sistemas de IA en producción', s: 0 },
      { l: 'Una forma de entrenar modelos con datos propios', s: 1 },
    ],
  },
]

export const Q_B3 = [
  {
    text: 'Si la IA te da una respuesta que parece incorrecta, ¿qué hacés?',
    opts: [
      { l: 'La uso igual, confío en lo que dice', s: 0 },
      { l: 'La ignoro y lo hago a mano', s: 1 },
      { l: 'La valido antes de usarla', s: 2 },
      { l: 'La valido, reformulo el prompt y analizo por qué falló', s: 3 },
    ],
  },
  {
    text: '¿Sabés qué datos de tu proyecto NO deberías ingresar a una herramienta de IA externa?',
    opts: [
      { l: 'No, no lo pensé nunca', s: 0 },
      { l: 'Tengo una idea general pero no está claro', s: 1 },
      { l: 'Sí, conozco la política de datos del cliente', s: 2 },
      { l: 'Sí, la aplico y puedo explicársela a un compañero', s: 3 },
    ],
  },
]

export const Q_B4 = {
  QA: [
    { text: '¿Usás IA para generar o revisar casos de prueba, criterios de aceptación o scripts de testing?', opts: [{ l: 'No', s: 0 }, { l: 'Lo intenté alguna vez', s: 1 }, { l: 'Sí, regularmente', s: 2 }, { l: 'Sí, con prompts o agentes específicos', s: 3 }] },
    { text: '¿Conocés o usás Rovo para buscar contexto del proyecto?', opts: [{ l: 'No sé qué es Rovo', s: 0 }, { l: 'Sé que existe pero no lo uso', s: 1 }, { l: 'Lo uso ocasionalmente', s: 2 }, { l: 'Lo uso habitualmente en mi workflow', s: 3 }] },
  ],
  Dev: [
    { text: '¿Usás Copilot, Claude u otra IA para escribir o revisar código en tu IDE?', opts: [{ l: 'No', s: 0 }, { l: 'Lo probé alguna vez', s: 1 }, { l: 'Sí, regularmente', s: 2 }, { l: 'Sí, integrado y configurado según el proyecto', s: 3 }] },
    { text: '¿Usás IA para revisar PRs, detectar bugs o generar documentación técnica?', opts: [{ l: 'No', s: 0 }, { l: 'Alguna vez', s: 1 }, { l: 'Sí, regularmente', s: 2 }, { l: 'Sí, con prompts o agentes específicos', s: 3 }] },
  ],
  BA: [
    { text: '¿Usás IA para redactar o refinar historias de usuario o requerimientos?', opts: [{ l: 'No', s: 0 }, { l: 'Lo intenté alguna vez', s: 1 }, { l: 'Sí, regularmente', s: 2 }, { l: 'Sí, con prompts propios por tipo de documento', s: 3 }] },
    { text: '¿Usás IA para analizar documentación del cliente o mapear procesos?', opts: [{ l: 'No', s: 0 }, { l: 'Alguna vez', s: 1 }, { l: 'Sí, habitualmente', s: 2 }, { l: 'Sí, con prompts estructurados que reutilizo', s: 3 }] },
  ],
  DevOps: [
    { text: '¿Usás IA para generar o revisar pipelines CI/CD o scripts de IaC?', opts: [{ l: 'No', s: 0 }, { l: 'Lo intenté alguna vez', s: 1 }, { l: 'Sí, regularmente', s: 2 }, { l: 'Sí, con plantillas o agentes para eso', s: 3 }] },
    { text: '¿Usás IA para diagnosticar errores en logs o incidentes?', opts: [{ l: 'No', s: 0 }, { l: 'Alguna vez', s: 1 }, { l: 'Sí, habitualmente', s: 2 }, { l: 'Sí, con agentes o prompts de observabilidad', s: 3 }] },
  ],
  PM: [
    { text: '¿Usás IA para planificar sprints, reportes o presentaciones?', opts: [{ l: 'No', s: 0 }, { l: 'Lo intenté alguna vez', s: 1 }, { l: 'Sí, regularmente', s: 2 }, { l: 'Sí, con prompts o plantillas propias', s: 3 }] },
    { text: '¿Usás IA para detectar riesgos o gestionar el backlog?', opts: [{ l: 'No', s: 0 }, { l: 'Alguna vez', s: 1 }, { l: 'Sí, habitualmente', s: 2 }, { l: 'Sí, es parte de mi metodología', s: 3 }] },
  ],
  Preventa: [
    { text: '¿Usás IA para redactar propuestas técnicas o resúmenes ejecutivos?', opts: [{ l: 'No', s: 0 }, { l: 'Lo intenté alguna vez', s: 1 }, { l: 'Sí, regularmente', s: 2 }, { l: 'Sí, con prompts propios por tipo de propuesta', s: 3 }] },
    { text: '¿Usás IA para analizar RFPs o preparar demos?', opts: [{ l: 'No', s: 0 }, { l: 'Alguna vez', s: 1 }, { l: 'Sí, habitualmente', s: 2 }, { l: 'Sí, con prompts estructurados que reutilizo', s: 3 }] },
  ],
}

export const Q_B5 = [
  {
    text: '¿Tu proyecto tiene definida una política sobre qué datos se pueden usar con herramientas de IA?',
    opts: [
      { l: 'No existe nada de eso en mi proyecto', s: 0 },
      { l: 'Creo que existe pero nunca la vi', s: 1 },
      { l: 'Sí, la conozco y la tengo en cuenta', s: 2 },
      { l: 'Sí, la aplico y puedo explicársela a un compañero', s: 3 },
    ],
  },
  {
    text: '¿Tu proyecto tiene activa una Configuración IA del proyecto (política de datos, agentes asignados, champion)?',
    opts: [
      { l: 'No sé qué es eso', s: 0 },
      { l: 'Sé que debería existir pero no la vi', s: 1 },
      { l: 'Sí, existe y sé dónde encontrarla', s: 2 },
      { l: 'Sí, participé en armarla o la mantengo actualizada', s: 3 },
    ],
  },
]

export const Q_B6 = [
  {
    text: '¿Ayudaste a algún compañero a incorporar IA en su trabajo?',
    opts: [
      { l: 'No', s: 0 },
      { l: 'Sí, de manera informal alguna vez', s: 1 },
      { l: 'Sí, lo hice varias veces y fue útil', s: 2 },
      { l: 'Sí, soy referente informal de IA en mi equipo', s: 3 },
    ],
  },
]

// ── Definición de bloques (para navegación) ───────────────────
export const BLOCK_DEFS = [
  { id: 'b1', badge: 'Bloque 1 — Tronco común',   badgeType: 'tronco',  title: 'Uso actual de IA',              sub: 'Cómo usás IA hoy en tu trabajo diario',                         questions: Q_B1 },
  { id: 'b2', badge: 'Bloque 2 — Conocimiento',    badgeType: 'teoria',  title: 'Conceptos clave de IA agéntica', sub: 'No hay trampa — es para saber dónde estamos parados.',           questions: Q_B2 },
  { id: 'b3', badge: 'Bloque 3 — Tronco común',   badgeType: 'tronco',  title: 'Criterio y uso responsable',    sub: 'Cómo validás lo que hace la IA y qué límites conocés',           questions: Q_B3 },
  { id: 'b4', badge: 'Bloque 4 — Específico',      badgeType: 'rol',     title: 'Herramientas y tareas',         sub: 'Cómo aplicás IA en las tareas concretas de tu especialización',  questions: null }, // dinámico por rol
  { id: 'b5', badge: 'Bloque 5 — Tronco común',   badgeType: 'tronco',  title: 'IA en tu proyecto',             sub: 'Cómo está organizado el uso de IA en tu proyecto actual',        questions: Q_B5 },
  { id: 'b6', badge: 'Bloque 6 — Tronco común',   badgeType: 'tronco',  title: 'Contribución al equipo',        sub: 'Si ayudás a otros a incorporar IA en su trabajo',               questions: Q_B6 },
]

// ── Niveles ───────────────────────────────────────────────────
export const LEVEL_DEFS = [
  {
    n: 'N1', name: 'Explorador', min: 0, max: 8,
    desc: 'Uso ocasional y reactivo. Sin prompts propios ni rutina establecida.',
    next: [
      'Empezá a guardar los prompts que ya usás en un documento propio',
      'Revisá las herramientas IA disponibles para tu rol',
      'Completá el track de formación A del programa (N1 → N2)',
    ],
    color: '#FCEBEB', text: '#791F1F', bar: '#E57373',
  },
  {
    n: 'N2', name: 'Asistido', min: 9, max: 16,
    desc: 'IA integrada en el workflow diario. Prompts guardados y reutilizados.',
    next: [
      'Documentá tus prompts en Confluence o el drive del equipo',
      'Explorá qué es un agente y para qué sirve en tu rol',
      'Completá el track de formación B del programa (N2 → N3)',
    ],
    color: '#FAEEDA', text: '#633806', bar: '#FFB74D',
  },
  {
    n: 'N3', name: 'Agentivo', min: 17, max: 24,
    desc: 'Entiende y opera agentes. Visión del ciclo completo asistido por IA.',
    next: [
      'Documentá al menos un prompt o skill reutilizable para tu equipo',
      'Verificá la configuración IA del proyecto en tu cliente',
      'Evaluá si tenés perfil de Champion — hablá con tu líder',
    ],
    color: '#E6F1FB', text: '#0C447C', bar: '#42A5F5',
  },
  {
    n: 'N4', name: 'Constructor', min: 25, max: 30,
    desc: 'Construye agentes y MCPs desde cero. Perfil Champion natural.',
    next: [
      'Coordiná con Miguel, Facundo o Benjamin para formalizar tus agentes',
      'Postulate formalmente como Champion del servicio',
      'Liderá la configuración IA completa de tu proyecto',
    ],
    color: '#EAF3DE', text: '#27500A', bar: '#66BB6A',
  },
  {
    n: 'N5', name: 'Arquitecto', min: 31, max: 33,
    desc: 'Define el ecosistema. Decide qué se construye, cómo y por qué.',
    next: [
      'Coordiná directamente con Rodrigo Montenegro',
      'Participá en decisiones de arquitectura de la plataforma',
      'Revisá y aprobá propuestas de agentes del equipo',
    ],
    color: '#EEEDFE', text: '#3C3489', bar: '#9575CD',
  },
]

export const MAX_PTS = 33

export const BLOCK_MAXS = [
  { label: 'Uso actual',      key: 'b1', max: 6  },
  { label: 'Teoría agéntica', key: 'b2', max: 24 },
  { label: 'Criterio y datos', key: 'b3', max: 6 },
  { label: 'Específico rol',  key: 'b4', max: 6  },
  { label: 'IA en proyecto',  key: 'b5', max: 6  },
  { label: 'Contribución',    key: 'b6', max: 3  },
]

export function sumArr(arr) {
  return (arr || []).reduce((acc, v) => acc + (v || 0), 0)
}

export function getLevel(total) {
  let level = LEVEL_DEFS[0]
  for (let i = 0; i < LEVEL_DEFS.length; i++) {
    if (total >= LEVEL_DEFS[i].min) level = LEVEL_DEFS[i]
  }
  return level
}
