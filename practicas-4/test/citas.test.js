const test = require('node:test');
const assert = require('node:assert/strict');
const { crearCita, ordenarCitas } = require('../src/citas');

test('RF01: crearCita registra una nueva cita con los datos indicados', () => {
  // Arrange
  const datos = {
    paciente: 'Juan Pérez',
    medico: 'Dra. López',
    especialidad: 'Medicina General',
    fecha: '2026-08-20',
    hora: '10:30',
    motivo: 'Consulta de rutina',
  };

  // Act
  const resultado = crearCita(datos);

  // Assert
  assert.equal(resultado.ok, true);
  assert.equal(resultado.cita.paciente, datos.paciente);
  assert.equal(resultado.cita.medico, datos.medico);
  assert.equal(resultado.cita.especialidad, datos.especialidad);
  assert.equal(resultado.cita.fecha, datos.fecha);
  assert.equal(resultado.cita.hora, datos.hora);
  assert.equal(resultado.cita.motivo, datos.motivo);
  assert.equal(resultado.cita.estado, 'pendiente');
  assert.ok(resultado.cita.id, 'debe generar un id único');
});

test('RF02: crearCita rechaza la creación si falta el paciente', () => {
  // Arrange
  const datos = {
    paciente: '',
    medico: 'Dra. López',
    especialidad: 'Medicina General',
    fecha: '2026-08-20',
    hora: '10:30',
    motivo: 'Consulta de rutina',
  };

  // Act
  const resultado = crearCita(datos);

  // Assert
  assert.equal(resultado.ok, false);
  assert.deepEqual(resultado.errores, ['paciente']);
});

test('RF02: crearCita rechaza la creación si falta el médico', () => {
  // Arrange
  const datos = {
    paciente: 'Juan Pérez',
    medico: '',
    especialidad: 'Medicina General',
    fecha: '2026-08-20',
    hora: '10:30',
    motivo: 'Consulta de rutina',
  };

  // Act
  const resultado = crearCita(datos);

  // Assert
  assert.equal(resultado.ok, false);
  assert.deepEqual(resultado.errores, ['medico']);
});

test('RF02: crearCita rechaza la creación si falta la fecha', () => {
  // Arrange
  const datos = {
    paciente: 'Juan Pérez',
    medico: 'Dra. López',
    especialidad: 'Medicina General',
    fecha: '',
    hora: '10:30',
    motivo: 'Consulta de rutina',
  };

  // Act
  const resultado = crearCita(datos);

  // Assert
  assert.equal(resultado.ok, false);
  assert.deepEqual(resultado.errores, ['fecha']);
});

test('RF02: crearCita rechaza la creación si falta la hora', () => {
  // Arrange
  const datos = {
    paciente: 'Juan Pérez',
    medico: 'Dra. López',
    especialidad: 'Medicina General',
    fecha: '2026-08-20',
    hora: '',
    motivo: 'Consulta de rutina',
  };

  // Act
  const resultado = crearCita(datos);

  // Assert
  assert.equal(resultado.ok, false);
  assert.deepEqual(resultado.errores, ['hora']);
});

test('RF03: crearCita rechaza la creación si la fecha/hora ya pasó', () => {
  // Arrange
  const ahora = new Date('2026-08-20T12:00:00');
  const datos = {
    paciente: 'Juan Pérez',
    medico: 'Dra. López',
    especialidad: 'Medicina General',
    fecha: '2026-08-20',
    hora: '10:30',
    motivo: 'Consulta de rutina',
  };

  // Act
  const resultado = crearCita(datos, ahora);

  // Assert
  assert.equal(resultado.ok, false);
  assert.deepEqual(resultado.errores, ['fecha-pasada']);
});

test('RF04: crearCita rechaza si ya existe una cita con el mismo médico, fecha y hora', () => {
  // Arrange
  const ahora = new Date('2026-08-18T08:00:00');
  const citaExistente = {
    id: '1',
    paciente: 'Otro Paciente',
    medico: 'Dra. López',
    especialidad: 'Medicina General',
    fecha: '2026-08-20',
    hora: '10:30',
    motivo: 'Chequeo',
    estado: 'pendiente',
  };
  const datos = {
    paciente: 'Juan Pérez',
    medico: 'Dra. López',
    especialidad: 'Medicina General',
    fecha: '2026-08-20',
    hora: '10:30',
    motivo: 'Consulta de rutina',
  };

  // Act
  const resultado = crearCita(datos, ahora, [citaExistente]);

  // Assert
  assert.equal(resultado.ok, false);
  assert.deepEqual(resultado.errores, ['solapamiento']);
});

test('RF05: ordenarCitas ordena las citas por fecha y hora ascendente', () => {
  // Arrange
  const citas = [
    { id: '1', fecha: '2026-08-20', hora: '10:00' },
    { id: '2', fecha: '2026-08-19', hora: '09:00' },
    { id: '3', fecha: '2026-08-20', hora: '08:00' },
  ];

  // Act
  const resultado = ordenarCitas(citas);

  // Assert
  assert.deepEqual(resultado.map((cita) => cita.id), ['2', '3', '1']);
});
