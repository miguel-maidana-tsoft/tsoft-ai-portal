export const API_URL =
  'https://script.google.com/macros/s/AKfycbwI70OzecMBOgUD4E4bp8vxRd7FHCxE1iuw1tkqlVtu4uveMZvfJX16IYo0VCHS2jov-w/exec'

export const FASES = [
  { id: 1, nombre: 'Fase 1', periodo: 'Semana 1', subtitulo: 'Lanzamiento del programa' },
  { id: 2, nombre: 'Fase 2', periodo: 'Semanas 2–3', subtitulo: 'Champions' },
  { id: 3, nombre: 'Fase 3', periodo: 'Semanas 4–5', subtitulo: 'Todo el equipo' },
  { id: 4, nombre: 'Fase 4', periodo: 'Continua', subtitulo: 'Consolidación' },
]

export const CLIENTES_OLA1 = [
  'Correo Argentino',
  'Tuenti',
  'AM',
  'Claro',
  'Claro Automatización',
]

// Agregar clientes de Ola 2 cuando estén definidos
export const CLIENTES_OLA2 = []

export const OLAS = [
  { id: 'Ola 1', label: 'OLA 1 — Clientes', clientes: CLIENTES_OLA1 },
  { id: 'Ola 2', label: 'OLA 2 — Clientes', clientes: CLIENTES_OLA2 },
]

export const ROLES_CHAMPION = [
  'Dev Frontend',
  'Dev Backend',
  'QA',
  'PO',
  'PM',
  'Analista Funcional',
  'UX/UI',
  'DevOps',
  'Tech Lead',
  'Otro',
]

export const ESTADOS = ['Pendiente', 'En curso', 'Completado']

export const PLATAFORMA_ID = 'Plataforma'
export const TABLERO_ID = 'General'

export const RESPONSABLES_TABLERO = [
  'Miguel (yo)',
  'Coordinar con AVarela',
  'N4s (Benjamín + Facundo)',
  'AVarela',
  'Equipo',
]

// Tareas iniciales de la Plataforma para Fase 2
// Se auto-seedean en el Sheet la primera vez que se abre esa fase vacía
export const PLATAFORMA_FASE2_TAREAS = [
  'Definir herramientas IA a usar en ese cliente',
  'Definir objetivo de madurez del cliente (a dónde llegar)',
  'Por proyecto: definir agentes/skills obligatorios',
  'Por proyecto: definir agentes/skills opcionales',
  'Definir qué agentes/skills customizar y por qué',
]
