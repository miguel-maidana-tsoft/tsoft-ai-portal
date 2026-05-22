// ============================================================
// TSOFT AI Program — Portal de Seguimiento
// Apps Script Backend (Code.gs)
// ============================================================

const SHEET_ID = '10bleHEMvUmxtoM6HVNswaXDsbN8zJPHLEzeljV37HEk';
const SHEET_NAME = 'Seguimiento_Clientes';

// Mapa explícito: tableroId → nombre del sheet dedicado
var TABLERO_SHEET_NAMES = {
  'General':    'Tablero_Olas',
  'Plataforma': 'Plataforma_Seguimiento',
};

const OLA_CONFIG = {
  'Ola 1': {
    clientes: ['Correo Argentino','Tuenti','AM','Claro','Claro Automatización']
  }
};

const FASES_BASE = [
  { id: 1, nombre: 'Fase 1', periodo: 'Semana 1', subtitulo: 'Lanzamiento del programa',
    tareas_base: ['Alinear criterios','Assessment del equipo','Identificación de Champions'] },
  { id: 2, nombre: 'Fase 2', periodo: 'Semanas 2–3', subtitulo: 'Champions',
    tareas_base: ['Reunión con los Champions','Nivelación — primeros agentes y skills','Configuración de agente en proyecto real'] },
  { id: 3, nombre: 'Fase 3', periodo: 'Semanas 4–5', subtitulo: 'Todo el equipo',
    tareas_base: ['Utilización de agentes para todos','Formación por perfil: Dev · QA · UX · BA · PM','Primeros skills publicados'] },
  { id: 4, nombre: 'Fase 4', periodo: 'En curso', subtitulo: 'Consolidación',
    tareas_base: ['Seguimiento de adopción por equipo','Ajuste de agentes en proyectos reales','Métricas y próximos pasos'] }
];

const CLIENTES_INFO = {
  'Correo Argentino': {
    gerencia: 'QA', gerente: 'Guillermo Zorzi',
    champion: 'A confirmar (candidato identificado en kickoff)',
    nivelC: 'C1–C2 (estimado)', nivelP: 'P1 → P2',
    estado: 'Muy bajo general · 1 colaborador con conocimiento avanzado',
    herramientas: 'Rovo + Claude (cuenta compartida)',
    proximoPaso: 'Sem 1: Mariana Noel entrega lista de colaboradores + confirmación champion + relevamiento stack',
    notas: 'Mariana Noel = Líder de Servicio. Kickoff realizado Abril 2026 (AVarela, Rodrigo, Guillermo Zorzi, Mariana, Miguel)'
  },
  'Tuenti': { gerencia:'', gerente:'', champion:'', nivelC:'', nivelP:'', estado:'', herramientas:'', proximoPaso:'', notas:'' },
  'AM': { gerencia:'', gerente:'', champion:'', nivelC:'', nivelP:'', estado:'', herramientas:'', proximoPaso:'', notas:'' },
  'Claro': { gerencia:'', gerente:'', champion:'', nivelC:'', nivelP:'', estado:'', herramientas:'', proximoPaso:'', notas:'' },
  'Claro Automatización': { gerencia:'', gerente:'', champion:'', nivelC:'', nivelP:'', estado:'', herramientas:'', proximoPaso:'', notas:'' }
};

// ============================================================
// AUTENTICACIÓN — Usuarios y login
// ============================================================

// Usuarios iniciales — se seedean automáticamente la primera vez que se crea la hoja
var USUARIOS_INICIALES = [
  ['miguel.maidana@tsoftglobal.com',    'Miguel Maidana',    'tsoft2026!', 'admin',                'dashboard,tablero,tracker,assessment,plataforma'],
  ['alejandro.varela@tsoftglobal.com',  'Alejandro Varela',  'tsoft2026!', 'admin',                'dashboard,tablero,tracker,assessment,plataforma'],
  ['benjamin.montero@tsoftglobal.com',  'Benjamín Montero',  'tsoft2026!', 'plataforma-agentica',  'dashboard,plataforma'],
  ['facundo.varela@tsoftglobal.com',    'Facundo Varela',    'tsoft2026!', 'plataforma-agentica',  'dashboard,plataforma']
];

function getUsuariosSheet() {
  var ss = SpreadsheetApp.openById(SHEET_ID);
  var sheet = ss.getSheetByName('Usuarios');
  if (!sheet) {
    sheet = ss.insertSheet('Usuarios');
    sheet.appendRow(['email', 'nombre', 'password', 'rol', 'secciones']);
    sheet.setFrozenRows(1);
    USUARIOS_INICIALES.forEach(function(user) {
      sheet.appendRow(user);
    });
  }
  return sheet;
}

function login(email, password) {
  var sheet = getUsuariosSheet();
  var data = sheet.getDataRange().getValues();
  var headers = data[0];
  var emailCol    = headers.indexOf('email');
  var nombreCol   = headers.indexOf('nombre');
  var passwordCol = headers.indexOf('password');
  var rolCol      = headers.indexOf('rol');
  var seccionesCol = headers.indexOf('secciones');

  var userEmail = String(email).trim().toLowerCase();

  var changedCol = headers.indexOf('password_changed');

  for (var i = 1; i < data.length; i++) {
    var rowEmail = String(data[i][emailCol]).trim().toLowerCase();
    if (rowEmail === userEmail) {
      var storedPassword = String(data[i][passwordCol]);
      if (storedPassword === String(password)) {
        var secciones = String(data[i][seccionesCol])
          .split(',')
          .map(function(s) { return s.trim(); })
          .filter(Boolean);
        var passwordChanged = changedCol !== -1
          ? (data[i][changedCol] === true || data[i][changedCol] === 'TRUE' || data[i][changedCol] === 1)
          : false;
        return {
          ok: true,
          requirePasswordChange: !passwordChanged,
          usuario: {
            email:    data[i][emailCol],
            nombre:   data[i][nombreCol],
            rol:      data[i][rolCol],
            secciones: secciones
          }
        };
      } else {
        return { ok: false, error: 'contrasena_incorrecta' };
      }
    }
  }
  return { ok: false, error: 'usuario_no_encontrado' };
}

function cambiarPassword(email, passwordActual, passwordNueva) {
  var sheet = getUsuariosSheet();
  var data = sheet.getDataRange().getValues();
  var headers = data[0];
  var emailCol    = headers.indexOf('email');
  var passwordCol = headers.indexOf('password');
  var changedCol  = headers.indexOf('password_changed');

  if (changedCol === -1) {
    changedCol = headers.length;
    sheet.getRange(1, changedCol + 1).setValue('password_changed');
  }

  var userEmail = String(email).trim().toLowerCase();
  for (var i = 1; i < data.length; i++) {
    var rowEmail = String(data[i][emailCol]).trim().toLowerCase();
    if (rowEmail === userEmail) {
      if (String(data[i][passwordCol]) !== String(passwordActual)) {
        return { ok: false, error: 'contrasena_incorrecta' };
      }
      sheet.getRange(i + 1, passwordCol + 1).setValue(passwordNueva);
      sheet.getRange(i + 1, changedCol + 1).setValue(true);
      return { ok: true };
    }
  }
  return { ok: false, error: 'usuario_no_encontrado' };
}

// ============================================================
// INICIALIZACIÓN
// ============================================================
function inicializarSheet() {
  const ss = SpreadsheetApp.openById(SHEET_ID);
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) sheet = ss.insertSheet(SHEET_NAME);
  sheet.clearContents();
  const headers = ['ola','cliente','fase_id','tarea_id','tarea_texto','estado','fecha_mod','notas'];
  sheet.getRange(1,1,1,headers.length).setValues([headers]);
  const rows = [];
  OLA_CONFIG['Ola 1'].clientes.forEach(cliente => {
    FASES_BASE.forEach(fase => {
      fase.tareas_base.forEach((tarea, idx) => {
        rows.push(['Ola 1', cliente, fase.id, cliente+'_f'+fase.id+'_t'+(idx+1), tarea, 'Pendiente', new Date().toISOString(), '']);
      });
    });
  });
  if (rows.length > 0) sheet.getRange(2,1,rows.length,8).setValues(rows);
  return { success: true, message: 'Sheet inicializada con '+rows.length+' tareas' };
}

// ============================================================
// LECTURA
// ============================================================
function getTareas(ola, cliente) {
  const ss = SpreadsheetApp.openById(SHEET_ID);
  const sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) return { error: 'Sheet no encontrada' };
  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  const result = {};
  FASES_BASE.forEach(f => { result[f.id] = []; });
  data.slice(1).forEach(row => {
    if (row[headers.indexOf('ola')] === ola && row[headers.indexOf('cliente')] === cliente) {
      const faseId = row[headers.indexOf('fase_id')];
      if (result[faseId] !== undefined) {
        result[faseId].push({
          id: row[headers.indexOf('tarea_id')],
          texto: row[headers.indexOf('tarea_texto')],
          estado: row[headers.indexOf('estado')],
          notas: row[headers.indexOf('notas')]
        });
      }
    }
  });
  return result;
}

function getResumenGeneral() {
  var sheet = getChecklistClienteSheet();
  var data = sheet.getDataRange().getValues();
  var resumen = {};
  var todosLosClientes = Object.keys(OLA_CONFIG).reduce(function(acc, olaId) {
    return acc.concat(OLA_CONFIG[olaId].clientes);
  }, []);
  if (data.length <= 1) {
    todosLosClientes.forEach(function(c) {
      resumen[c] = { total: 0, completados: 0, pct: 0 };
    });
    return resumen;
  }
  var headers = data[0];
  var clienteCol    = headers.indexOf('cliente');
  var completadoCol = headers.indexOf('completado');
  var rows = data.slice(1).filter(function(r) { return r[0] !== ''; });
  todosLosClientes.forEach(function(cliente) {
    var items = rows.filter(function(r) { return String(r[clienteCol]) === cliente; });
    var total = items.length;
    var completados = items.filter(function(r) {
      var v = r[completadoCol];
      return v === true || v === 'TRUE' || v === 1;
    }).length;
    resumen[cliente] = { total: total, completados: completados, pct: total > 0 ? Math.round((completados/total)*100) : 0 };
  });
  return resumen;
}

function getClientesInfoSheet() {
  const ss = SpreadsheetApp.openById(SHEET_ID);
  const sheet = ss.getSheetByName('Clientes_Info');
  if (!sheet) return CLIENTES_INFO;
  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  const result = {};
  data.slice(1).forEach(row => {
    const obj = {};
    headers.slice(1).forEach((h, i) => { obj[h] = row[i + 1] || ''; });
    result[row[0]] = obj;
  });
  return result;
}

// ============================================================
// ESCRITURA
// ============================================================
function actualizarEstado(tareaId, nuevoEstado) {
  const ss = SpreadsheetApp.openById(SHEET_ID);
  const sheet = ss.getSheetByName(SHEET_NAME);
  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  for (let i = 1; i < data.length; i++) {
    if (data[i][headers.indexOf('tarea_id')] === tareaId) {
      sheet.getRange(i+1, headers.indexOf('estado')+1).setValue(nuevoEstado);
      sheet.getRange(i+1, headers.indexOf('fecha_mod')+1).setValue(new Date().toISOString());
      return { success: true };
    }
  }
  return { error: 'Tarea no encontrada' };
}

function agregarTarea(ola, cliente, faseId, texto) {
  const ss = SpreadsheetApp.openById(SHEET_ID);
  const sheet = ss.getSheetByName(SHEET_NAME);
  const tareaId = cliente+'_f'+faseId+'_custom_'+Date.now();
  sheet.appendRow([ola, cliente, faseId, tareaId, texto, 'Pendiente', new Date().toISOString(), '']);
  return { success: true, id: tareaId };
}

function eliminarTarea(tareaId) {
  const ss = SpreadsheetApp.openById(SHEET_ID);
  const sheet = ss.getSheetByName(SHEET_NAME);
  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  for (let i = 1; i < data.length; i++) {
    if (data[i][headers.indexOf('tarea_id')] === tareaId) {
      sheet.deleteRow(i+1);
      return { success: true };
    }
  }
  return { error: 'Tarea no encontrada' };
}

function actualizarClienteInfo(cliente, campo, valor) {
  const ss = SpreadsheetApp.openById(SHEET_ID);
  let sheet = ss.getSheetByName('Clientes_Info');
  if (!sheet) {
    sheet = ss.insertSheet('Clientes_Info');
    sheet.getRange(1,1,1,10).setValues([['cliente','gerencia','gerente','champion','nivelC','nivelP','estado','herramientas','proximoPaso','notas']]);
    Object.entries(CLIENTES_INFO).forEach(([c, info]) => {
      sheet.appendRow([c, info.gerencia, info.gerente, info.champion, info.nivelC, info.nivelP, info.estado, info.herramientas, info.proximoPaso, info.notas]);
    });
  }
  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  let colIdx = headers.indexOf(campo) + 1;
  if (colIdx === 0) {
    colIdx = headers.length + 1;
    sheet.getRange(1, colIdx).setValue(campo);
  }
  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === cliente) {
      sheet.getRange(i + 1, colIdx).setValue(valor);
      return { success: true };
    }
  }
  return { error: 'Cliente no encontrado' };
}

// ============================================================
// ASSESSMENT
// ============================================================
function getAssessment() {
  const ss = SpreadsheetApp.openById(SHEET_ID);
  const sheet = ss.getSheetByName('Assesment');
  if (!sheet) return [];
  const data = sheet.getDataRange().getValues();
  const headers = data[0].map(h => String(h).trim());
  return data.slice(1)
    .filter(row => row[0])
    .map(row => {
      const obj = {};
      headers.forEach((h, i) => { obj[h] = row[i]; });
      return obj;
    });
}

// ============================================================
// TABLERO — Sheet dedicado por tablero
// 'General' → Tablero_General  |  'Plataforma' → Tablero_Plataforma
// Agregar más tableros es gratis: solo pasar un nuevo tableroId
// ============================================================
function getSheetForTablero(tableroId) {
  var tId = String(tableroId || 'General');
  var sheetName = TABLERO_SHEET_NAMES[tId] || ('Tablero_' + tId);
  var ss = SpreadsheetApp.openById(SHEET_ID);
  var sheet = ss.getSheetByName(sheetName);
  if (!sheet) {
    sheet = ss.insertSheet(sheetName);
    sheet.appendRow(['id','bloque','texto','detalle','semana','responsable','estado','notas','orden','fecha_mod','prioridad']);
    sheet.setFrozenRows(1);
  } else {
    var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    if (headers.indexOf('prioridad') === -1) {
      sheet.getRange(1, headers.length + 1).setValue('prioridad');
    }
  }
  return sheet;
}

function getTablero(tableroId) {
  var sheet = getSheetForTablero(tableroId);
  var data = sheet.getDataRange().getValues();
  if (data.length <= 1) return [];
  var headers = data[0];
  var rows = data.slice(1)
    .filter(function(row) { return String(row[0]) !== ''; })
    .map(function(row) {
      var obj = {};
      headers.forEach(function(h, i) { obj[h] = row[i]; });
      return obj;
    });
  rows.sort(function(a, b) {
    var oa = (a.orden !== '' && a.orden !== undefined) ? Number(a.orden) : 999999;
    var ob = (b.orden !== '' && b.orden !== undefined) ? Number(b.orden) : 999999;
    return oa - ob;
  });
  return rows;
}

function agregarTableroTarea(tableroId, bloque, texto, detalle, semana, responsable, prioridad) {
  var sheet = getSheetForTablero(tableroId);
  var id = 'T_' + new Date().getTime();
  var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  var vals = {
    id: id, bloque: bloque||'', texto: texto||'', detalle: detalle||'',
    semana: semana||'', responsable: responsable||'', estado: 'Pendiente', notas: '',
    orden: 999999, fecha_mod: new Date().toISOString(), prioridad: prioridad||'media'
  };
  var newRow = headers.map(function(h) {
    return (h !== '' && vals[h] !== undefined) ? vals[h] : '';
  });
  sheet.appendRow(newRow);
  return { success: true, id: id };
}

function actualizarTableroTarea(tableroId, id, campo, valor) {
  var sheet = getSheetForTablero(tableroId);
  var data = sheet.getDataRange().getValues();
  var headers = data[0];
  var colIdx = headers.indexOf(campo);
  if (colIdx === -1) return { success: false, error: 'Campo no encontrado' };
  for (var i = 1; i < data.length; i++) {
    if (String(data[i][0]) === String(id)) {
      sheet.getRange(i+1, colIdx+1).setValue(valor);
      var fechaCol = headers.indexOf('fecha_mod');
      if (fechaCol !== -1) sheet.getRange(i+1, fechaCol+1).setValue(new Date().toISOString());
      return { success: true };
    }
  }
  return { success: false, error: 'Tarea no encontrada' };
}

function eliminarTableroTarea(tableroId, id) {
  var sheet = getSheetForTablero(tableroId);
  var data = sheet.getDataRange().getValues();
  for (var i = 1; i < data.length; i++) {
    if (String(data[i][0]) === String(id)) {
      sheet.deleteRow(i+1);
      return { success: true };
    }
  }
  return { success: false };
}

function reordenarTableroBloque(tableroId, bloque, orderedIds) {
  var sheet = getSheetForTablero(tableroId);
  var data = sheet.getDataRange().getValues();
  var headers = data[0];
  var idCol = headers.indexOf('id');
  var ordenCol = headers.indexOf('orden');
  if (ordenCol === -1) {
    sheet.getRange(1, headers.length + 1).setValue('orden');
    data = sheet.getDataRange().getValues();
    headers = data[0];
    ordenCol = headers.indexOf('orden');
  }
  var ids = String(orderedIds).split(',');
  ids.forEach(function(id, index) {
    var trimmedId = String(id).trim();
    for (var i = 1; i < data.length; i++) {
      if (String(data[i][idCol]) === trimmedId) {
        sheet.getRange(i + 1, ordenCol + 1).setValue(index + 1);
        break;
      }
    }
  });
  return { success: true };
}

function renombrarTableroBloque(tableroId, oldBloque, newBloque) {
  var sheet = getSheetForTablero(tableroId);
  var data = sheet.getDataRange().getValues();
  var headers = data[0];
  var bloqueCol = headers.indexOf('bloque');
  for (var i = 1; i < data.length; i++) {
    if (String(data[i][bloqueCol]) === String(oldBloque)) {
      sheet.getRange(i + 1, bloqueCol + 1).setValue(newBloque);
    }
  }
  return { success: true };
}

function eliminarTableroBloque(tableroId, bloque) {
  var sheet = getSheetForTablero(tableroId);
  var data = sheet.getDataRange().getValues();
  var headers = data[0];
  var bloqueCol = headers.indexOf('bloque');
  for (var i = data.length - 1; i >= 1; i--) {
    if (String(data[i][bloqueCol]) === String(bloque)) {
      sheet.deleteRow(i + 1);
    }
  }
  return { success: true };
}

// Renombra los sheets existentes al nuevo esquema de nombres (ejecutar una sola vez)
function migrarNombresHojas() {
  var ss = SpreadsheetApp.openById(SHEET_ID);
  var renombres = [
    { de: 'Seguimiento',        a: 'Seguimiento_Clientes' },
    { de: 'Plataforma_Tareas',  a: 'Plataforma_General' },
    { de: 'Tablero_Plataforma', a: 'Plataforma_Seguimiento' },
  ];
  var resultado = [];
  renombres.forEach(function(r) {
    var sheet = ss.getSheetByName(r.de);
    if (sheet) {
      sheet.setName(r.a);
      resultado.push(r.de + ' → ' + r.a);
    } else {
      resultado.push(r.de + ' (no encontrado, ignorado)');
    }
  });
  return { success: true, cambios: resultado };
}

// Migración única: copia filas del viejo sheet 'Tablero' a los sheets dedicados
function migrarTableroData() {
  var ss = SpreadsheetApp.openById(SHEET_ID);
  var oldSheet = ss.getSheetByName('Tablero');
  if (!oldSheet) return { success: false, error: 'No existe hoja Tablero original' };
  var data = oldSheet.getDataRange().getValues();
  var headers = data[0];
  var tIdCol = headers.indexOf('tableroId');
  var moved = {};
  data.slice(1).forEach(function(row) {
    if (!row[0]) return;
    var tId = (tIdCol >= 0 && row[tIdCol]) ? String(row[tIdCol]) : 'General';
    var targetSheet = getSheetForTablero(tId);
    var targetHeaders = targetSheet.getRange(1, 1, 1, targetSheet.getLastColumn()).getValues()[0];
    var vals = {};
    headers.forEach(function(h, i) { if (h && h !== 'tableroId') vals[h] = row[i]; });
    var newRow = targetHeaders.map(function(h) {
      return (h !== '' && vals[h] !== undefined) ? vals[h] : '';
    });
    targetSheet.appendRow(newRow);
    moved[tId] = (moved[tId] || 0) + 1;
  });
  return { success: true, moved: moved };
}

// ============================================================
// PLATAFORMA — Tareas Generales
// ============================================================
function getPlataformaTareasSheet() {
  var ss = SpreadsheetApp.openById(SHEET_ID);
  var sheet = ss.getSheetByName('Plataforma_General');
  if (!sheet) {
    sheet = ss.insertSheet('Plataforma_General');
    sheet.appendRow(['id','texto','descripcion','estado','fecha_creacion','orden']);
    sheet.setFrozenRows(1);
  }
  return sheet;
}

function getPlataformaTareas() {
  var sheet = getPlataformaTareasSheet();
  var data = sheet.getDataRange().getValues();
  if (data.length <= 1) return [];
  var headers = data[0];
  var rows = data.slice(1)
    .filter(function(row) { return row[0] !== ''; })
    .map(function(row) {
      var obj = {};
      headers.forEach(function(h, i) { obj[h] = row[i]; });
      return obj;
    });
  rows.sort(function(a, b) {
    var oa = (a.orden !== '' && a.orden !== undefined) ? Number(a.orden) : 999999;
    var ob = (b.orden !== '' && b.orden !== undefined) ? Number(b.orden) : 999999;
    return oa - ob;
  });
  return rows;
}

function agregarPlataformaTarea(texto, descripcion) {
  var sheet = getPlataformaTareasSheet();
  var id = 'PT_' + new Date().getTime();
  sheet.appendRow([id, texto||'', descripcion||'', 'Pendiente', new Date().toISOString(), 999999]);
  return { success: true, id: id };
}

function actualizarPlataformaTarea(id, campo, valor) {
  var sheet = getPlataformaTareasSheet();
  var data = sheet.getDataRange().getValues();
  var headers = data[0];
  var colIdx = headers.indexOf(campo);
  if (colIdx === -1) return { success: false, error: 'Campo no encontrado' };
  for (var i = 1; i < data.length; i++) {
    if (String(data[i][0]) === String(id)) {
      sheet.getRange(i + 1, colIdx + 1).setValue(valor);
      return { success: true };
    }
  }
  return { success: false, error: 'Tarea no encontrada' };
}

function eliminarPlataformaTarea(id) {
  var sheet = getPlataformaTareasSheet();
  var data = sheet.getDataRange().getValues();
  for (var i = 1; i < data.length; i++) {
    if (String(data[i][0]) === String(id)) {
      sheet.deleteRow(i + 1);
      return { success: true };
    }
  }
  return { success: false };
}

// ============================================================
// TABLERO GENERAL PM
// Sheet: Tablero_General_PM — id | texto | descripcion | estado | fecha_creacion | fecha_mod
// ============================================================
function getTareasGeneralesSheet() {
  var ss = SpreadsheetApp.openById(SHEET_ID);
  var sheet = ss.getSheetByName('Tablero_General_PM');
  if (!sheet) {
    sheet = ss.insertSheet('Tablero_General_PM');
    sheet.appendRow(['id', 'texto', 'descripcion', 'estado', 'fecha_creacion', 'fecha_mod']);
    sheet.setFrozenRows(1);
  }
  return sheet;
}

function getTareasGenerales() {
  var sheet = getTareasGeneralesSheet();
  var data = sheet.getDataRange().getValues();
  if (data.length <= 1) return [];
  var headers = data[0];
  var ordenCol = headers.indexOf('orden');
  var rows = data.slice(1)
    .filter(function(row) { return row[0] !== ''; })
    .map(function(row) {
      var obj = {};
      headers.forEach(function(h, i) { obj[h] = row[i]; });
      return obj;
    });
  if (ordenCol !== -1) {
    rows.sort(function(a, b) { return (Number(a.orden) || 0) - (Number(b.orden) || 0); });
  }
  return rows;
}

function agregarTareaGeneral(texto, descripcion) {
  var sheet = getTareasGeneralesSheet();
  var id = 'TG_' + new Date().getTime();
  sheet.appendRow([id, texto || '', descripcion || '', 'Pendiente', new Date().toISOString(), new Date().toISOString()]);
  return { success: true, id: id };
}

function actualizarTareaGeneral(id, campo, valor) {
  var sheet = getTareasGeneralesSheet();
  var data = sheet.getDataRange().getValues();
  var headers = data[0];
  var colIdx = headers.indexOf(campo);
  if (colIdx === -1) return { success: false, error: 'Campo no encontrado' };
  for (var i = 1; i < data.length; i++) {
    if (String(data[i][0]) === String(id)) {
      sheet.getRange(i + 1, colIdx + 1).setValue(valor);
      var fechaCol = headers.indexOf('fecha_mod');
      if (fechaCol !== -1) sheet.getRange(i + 1, fechaCol + 1).setValue(new Date().toISOString());
      return { success: true };
    }
  }
  return { success: false, error: 'Tarea no encontrada' };
}

function eliminarTareaGeneral(id) {
  var sheet = getTareasGeneralesSheet();
  var data = sheet.getDataRange().getValues();
  for (var i = 1; i < data.length; i++) {
    if (String(data[i][0]) === String(id)) {
      sheet.deleteRow(i + 1);
      return { success: true };
    }
  }
  return { success: false };
}

function reordenarTareasGenerales(orderedIds) {
  var sheet = getTareasGeneralesSheet();
  var data = sheet.getDataRange().getValues();
  var headers = data[0];
  var idCol = headers.indexOf('id');
  var ordenCol = headers.indexOf('orden');
  if (ordenCol === -1) {
    sheet.getRange(1, headers.length + 1).setValue('orden');
    data = sheet.getDataRange().getValues();
    headers = data[0];
    ordenCol = headers.indexOf('orden');
  }
  var ids = String(orderedIds).split(',');
  ids.forEach(function(id, index) {
    var trimmedId = String(id).trim();
    for (var i = 1; i < data.length; i++) {
      if (String(data[i][idCol]) === trimmedId) {
        sheet.getRange(i + 1, ordenCol + 1).setValue(index + 1);
        break;
      }
    }
  });
  return { success: true };
}

// ============================================================
// CHECKLIST POR CLIENTE
// Sheet: Checklist_Clientes — id | cliente | texto | completado | orden | fecha_mod
// ============================================================
function getChecklistClienteSheet() {
  var ss = SpreadsheetApp.openById(SHEET_ID);
  var sheet = ss.getSheetByName('Checklist_Clientes');
  if (!sheet) {
    sheet = ss.insertSheet('Checklist_Clientes');
    sheet.appendRow(['id', 'cliente', 'texto', 'completado', 'orden', 'fecha_mod']);
    sheet.setFrozenRows(1);
  }
  return sheet;
}

function getChecklistCliente(cliente) {
  var sheet = getChecklistClienteSheet();
  var data = sheet.getDataRange().getValues();
  if (data.length <= 1) return [];
  var headers = data[0];
  var clienteCol = headers.indexOf('cliente');
  var rows = data.slice(1)
    .filter(function(row) { return row[0] !== '' && String(row[clienteCol]) === String(cliente); })
    .map(function(row) {
      var obj = {};
      headers.forEach(function(h, i) { obj[h] = row[i]; });
      obj.completado = (obj.completado === true || obj.completado === 'TRUE' || obj.completado === 1);
      return obj;
    });
  rows.sort(function(a, b) {
    return (Number(a.orden) || 999999) - (Number(b.orden) || 999999);
  });
  return rows;
}

function agregarChecklistItemCliente(cliente, texto) {
  var sheet = getChecklistClienteSheet();
  var id = 'CLC_' + new Date().getTime();
  sheet.appendRow([id, cliente || '', texto || '', false, 999999, new Date().toISOString()]);
  return { success: true, id: id };
}

function actualizarChecklistItemCliente(id, campo, valor) {
  var sheet = getChecklistClienteSheet();
  var data = sheet.getDataRange().getValues();
  var headers = data[0];
  var colIdx = headers.indexOf(campo);
  if (colIdx === -1) return { success: false, error: 'Campo no encontrado' };
  for (var i = 1; i < data.length; i++) {
    if (String(data[i][0]) === String(id)) {
      var val = valor;
      if (campo === 'completado') val = (valor === 'true' || valor === true || valor === '1' || valor === 1);
      sheet.getRange(i + 1, colIdx + 1).setValue(val);
      var fechaCol = headers.indexOf('fecha_mod');
      if (fechaCol !== -1) sheet.getRange(i + 1, fechaCol + 1).setValue(new Date().toISOString());
      return { success: true };
    }
  }
  return { success: false, error: 'Item no encontrado' };
}

function eliminarChecklistItemCliente(id) {
  var sheet = getChecklistClienteSheet();
  var data = sheet.getDataRange().getValues();
  for (var i = 1; i < data.length; i++) {
    if (String(data[i][0]) === String(id)) {
      sheet.deleteRow(i + 1);
      return { success: true };
    }
  }
  return { success: false };
}

function getAllChecklistItems() {
  var sheet = getChecklistClienteSheet();
  var data = sheet.getDataRange().getValues();
  if (data.length <= 1) return {};
  var headers = data[0];
  var clienteCol = headers.indexOf('cliente');
  var result = {};
  data.slice(1)
    .filter(function(row) { return row[0] !== ''; })
    .forEach(function(row) {
      var obj = {};
      headers.forEach(function(h, i) { obj[h] = row[i]; });
      obj.completado = (obj.completado === true || obj.completado === 'TRUE' || obj.completado === 1);
      var c = String(row[clienteCol]);
      if (!result[c]) result[c] = [];
      result[c].push(obj);
    });
  Object.keys(result).forEach(function(c) {
    result[c].sort(function(a, b) {
      return (Number(a.orden) || 999999) - (Number(b.orden) || 999999);
    });
  });
  return result;
}

// ============================================================
// CHECKLIST GLOBAL (legacy — sin uso activo)
// — Items globales (mismos para todos los clientes)
// — Hoja 'Checklist': id | texto | orden | {cliente}...
// — Las columnas de clientes son dinámicas (TRUE/FALSE)
// ============================================================
function getChecklistSheet() {
  var ss = SpreadsheetApp.openById(SHEET_ID);
  var sheet = ss.getSheetByName('Checklist');
  if (!sheet) {
    sheet = ss.insertSheet('Checklist');
    sheet.appendRow(['id', 'texto', 'orden']);
    sheet.setFrozenRows(1);
  }
  return sheet;
}

function getChecklist() {
  var sheet = getChecklistSheet();
  var data = sheet.getDataRange().getValues();
  if (data.length <= 1) return [];
  var headers = data[0];
  var idCol = headers.indexOf('id');
  var textoCol = headers.indexOf('texto');
  var ordenCol = headers.indexOf('orden');
  var rows = data.slice(1).map(function(row) {
    var obj = {
      id: row[idCol],
      texto: row[textoCol],
      orden: row[ordenCol],
      estados: {}
    };
    headers.forEach(function(h, i) {
      if (h && h !== 'id' && h !== 'texto' && h !== 'orden') {
        obj.estados[h] = (row[i] === true || row[i] === 'TRUE' || row[i] === 1);
      }
    });
    return obj;
  }).filter(function(r) { return r.id !== ''; });
  rows.sort(function(a, b) {
    var oa = (a.orden !== '' && a.orden !== undefined && a.orden !== null) ? Number(a.orden) : 999999;
    var ob = (b.orden !== '' && b.orden !== undefined && b.orden !== null) ? Number(b.orden) : 999999;
    return oa - ob;
  });
  return rows;
}

function agregarChecklistItem(texto) {
  var sheet = getChecklistSheet();
  var id = 'CL_' + new Date().getTime();
  sheet.appendRow([id, texto || '', 999999]);
  return { success: true, id: id };
}

function eliminarChecklistItem(id) {
  var sheet = getChecklistSheet();
  var data = sheet.getDataRange().getValues();
  for (var i = 1; i < data.length; i++) {
    if (String(data[i][0]) === String(id)) {
      sheet.deleteRow(i + 1);
      return { success: true };
    }
  }
  return { success: false };
}

function editarChecklistItem(id, texto) {
  var sheet = getChecklistSheet();
  var data = sheet.getDataRange().getValues();
  var headers = data[0];
  var textoCol = headers.indexOf('texto');
  for (var i = 1; i < data.length; i++) {
    if (String(data[i][0]) === String(id)) {
      sheet.getRange(i + 1, textoCol + 1).setValue(texto);
      return { success: true };
    }
  }
  return { success: false };
}

function setChecklistEstado(itemId, cliente, completado) {
  var sheet = getChecklistSheet();
  var data = sheet.getDataRange().getValues();
  var headers = data[0];
  var clienteCol = headers.indexOf(cliente);
  if (clienteCol === -1) {
    clienteCol = headers.length;
    sheet.getRange(1, clienteCol + 1).setValue(cliente);
    data = sheet.getDataRange().getValues();
    headers = data[0];
  }
  for (var i = 1; i < data.length; i++) {
    if (String(data[i][0]) === String(itemId)) {
      var val = (completado === true || completado === 'true' || completado === '1');
      sheet.getRange(i + 1, clienteCol + 1).setValue(val);
      return { success: true };
    }
  }
  return { success: false };
}

function reordenarChecklist(orderedIds) {
  var sheet = getChecklistSheet();
  var data = sheet.getDataRange().getValues();
  var headers = data[0];
  var idCol = headers.indexOf('id');
  var ordenCol = headers.indexOf('orden');
  var ids = String(orderedIds).split(',');
  ids.forEach(function(id, index) {
    var trimmedId = String(id).trim();
    for (var i = 1; i < data.length; i++) {
      if (String(data[i][idCol]) === trimmedId) {
        sheet.getRange(i + 1, ordenCol + 1).setValue(index + 1);
        break;
      }
    }
  });
  return { success: true };
}

// ============================================================
// WEB APP — JSONP para CORS
// ============================================================
function doGet(e) {
  const action = e.parameter.action;
  const callback = e.parameter.callback;

  let result;
  switch(action) {

    // AUTENTICACIÓN
    case 'login':
      result = login(e.parameter.email, e.parameter.password); break;
    case 'cambiarPassword':
      result = cambiarPassword(e.parameter.email, e.parameter.passwordActual, e.parameter.passwordNueva); break;

    // DATOS
    case 'getTareas':
      result = getTareas(e.parameter.ola, e.parameter.cliente); break;
    case 'getResumen':
      result = getResumenGeneral(); break;
    case 'getClientesInfo':
      result = getClientesInfoSheet(); break;
    case 'getConfig':
      result = { olas: OLA_CONFIG, fases: FASES_BASE, currentOla: 'Ola 1', currentFase: 1 }; break;
    case 'inicializar':
      result = inicializarSheet(); break;
    case 'actualizarEstado':
      result = actualizarEstado(e.parameter.tareaId, e.parameter.estado); break;
    case 'agregarTarea':
      result = agregarTarea(e.parameter.ola, e.parameter.cliente, parseInt(e.parameter.faseId), e.parameter.texto); break;
    case 'eliminarTarea':
      result = eliminarTarea(e.parameter.tareaId); break;
    case 'actualizarClienteInfo':
      result = actualizarClienteInfo(e.parameter.cliente, e.parameter.campo, e.parameter.valor); break;
    case 'getAssessment':
      result = getAssessment(); break;

    // TABLERO
    case 'getTablero':
      result = getTablero(e.parameter.tableroId); break;
    case 'agregarTableroTarea':
      result = agregarTableroTarea(e.parameter.tableroId, e.parameter.bloque, e.parameter.texto, e.parameter.detalle, e.parameter.semana, e.parameter.responsable, e.parameter.prioridad); break;
    case 'actualizarTableroTarea':
      result = actualizarTableroTarea(e.parameter.tableroId, e.parameter.id, e.parameter.campo, e.parameter.valor); break;
    case 'eliminarTableroTarea':
      result = eliminarTableroTarea(e.parameter.tableroId, e.parameter.id); break;
    case 'migrarTableroData':
      result = migrarTableroData(); break;
    case 'migrarNombresHojas':
      result = migrarNombresHojas(); break;
    case 'reordenarTableroBloque':
      result = reordenarTableroBloque(e.parameter.tableroId, e.parameter.bloque, e.parameter.orderedIds); break;
    case 'renombrarTableroBloque':
      result = renombrarTableroBloque(e.parameter.tableroId, e.parameter.oldBloque, e.parameter.newBloque); break;
    case 'eliminarTableroBloque':
      result = eliminarTableroBloque(e.parameter.tableroId, e.parameter.bloque); break;

    // TABLERO GENERAL PM
    case 'getTareasGenerales':
      result = getTareasGenerales(); break;
    case 'agregarTareaGeneral':
      result = agregarTareaGeneral(e.parameter.texto, e.parameter.descripcion); break;
    case 'actualizarTareaGeneral':
      result = actualizarTareaGeneral(e.parameter.id, e.parameter.campo, e.parameter.valor); break;
    case 'eliminarTareaGeneral':
      result = eliminarTareaGeneral(e.parameter.id); break;
    case 'reordenarTareasGenerales':
      result = reordenarTareasGenerales(e.parameter.orderedIds); break;

    // PLATAFORMA TAREAS GENERALES
    case 'getPlataformaTareas':
      result = getPlataformaTareas(); break;
    case 'agregarPlataformaTarea':
      result = agregarPlataformaTarea(e.parameter.texto, e.parameter.descripcion); break;
    case 'actualizarPlataformaTarea':
      result = actualizarPlataformaTarea(e.parameter.id, e.parameter.campo, e.parameter.valor); break;
    case 'eliminarPlataformaTarea':
      result = eliminarPlataformaTarea(e.parameter.id); break;

    case 'getAllChecklistItems':
      result = getAllChecklistItems(); break;

    // CHECKLIST POR CLIENTE
    case 'getChecklistCliente':
      result = getChecklistCliente(e.parameter.cliente); break;
    case 'agregarChecklistItemCliente':
      result = agregarChecklistItemCliente(e.parameter.cliente, e.parameter.texto); break;
    case 'actualizarChecklistItemCliente':
      result = actualizarChecklistItemCliente(e.parameter.id, e.parameter.campo, e.parameter.valor); break;
    case 'eliminarChecklistItemCliente':
      result = eliminarChecklistItemCliente(e.parameter.id); break;

    // CHECKLIST GLOBAL (legacy)
    case 'getChecklist':
      result = getChecklist(); break;
    case 'agregarChecklistItem':
      result = agregarChecklistItem(e.parameter.texto); break;
    case 'eliminarChecklistItem':
      result = eliminarChecklistItem(e.parameter.id); break;
    case 'editarChecklistItem':
      result = editarChecklistItem(e.parameter.id, e.parameter.texto); break;
    case 'setChecklistEstado':
      result = setChecklistEstado(e.parameter.itemId, e.parameter.cliente, e.parameter.completado); break;
    case 'reordenarChecklist':
      result = reordenarChecklist(e.parameter.orderedIds); break;

    default:
      result = { error: 'Accion no reconocida: ' + action };
  }

  const json = JSON.stringify(result);
  if (callback) {
    return ContentService
      .createTextOutput(callback + '(' + json + ')')
      .setMimeType(ContentService.MimeType.JAVASCRIPT);
  }
  return ContentService
    .createTextOutput(json)
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  try {
    const body = JSON.parse(e.postData.contents);
    let result;
    switch(body.action) {
      case 'actualizarEstado': result = actualizarEstado(body.tareaId, body.estado); break;
      case 'agregarTarea': result = agregarTarea(body.ola, body.cliente, body.faseId, body.texto); break;
      case 'eliminarTarea': result = eliminarTarea(body.tareaId); break;
      case 'actualizarClienteInfo': result = actualizarClienteInfo(body.cliente, body.campo, body.valor); break;
      default: result = { error: 'Accion no reconocida' };
    }
    return ContentService.createTextOutput(JSON.stringify(result)).setMimeType(ContentService.MimeType.JSON);
  } catch(err) {
    return ContentService.createTextOutput(JSON.stringify({ error: err.toString() })).setMimeType(ContentService.MimeType.JSON);
  }
}
