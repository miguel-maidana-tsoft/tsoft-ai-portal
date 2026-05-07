export const API_URL =
  'https://script.google.com/macros/s/AKfycbwI70OzecMBOgUD4E4bp8vxRd7FHCxE1iuw1tkqlVtu4uveMZvfJX16IYo0VCHS2jov-w/exec'

export const FASES = [
  { id: 1, nombre: 'Fase 1', periodo: 'Semana 1', subtitulo: 'Lanzamiento del programa' },
  { id: 2, nombre: 'Fase 2', periodo: 'Semanas 2–3', subtitulo: 'Champions' },
  { id: 3, nombre: 'Fase 3', periodo: 'Semanas 4–5', subtitulo: 'Todo el equipo' },
  { id: 4, nombre: 'Fase 4', periodo: 'En curso', subtitulo: 'Consolidación' },
]

export const CLIENTES_OLA1 = [
  'Correo Argentino',
  'Tuenti',
  'AM',
  'Claro',
  'Claro Automatización',
]

export const OLAS = [
  { id: 'Ola 1', label: 'OLA 1 — Clientes', clientes: CLIENTES_OLA1 },
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
