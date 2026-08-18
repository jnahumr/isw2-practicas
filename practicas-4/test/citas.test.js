const test = require('node:test');
const assert = require('node:assert/strict');
const {
  crearCita,
  ordenarCitas,
  filtrarCitas,
  editarCita,
  cancelarCita,
  calcularEstadoVisual,
  ESPECIALIDADES,
} = require('../src/citas');

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

test('RF06: filtrarCitas encuentra coincidencias por nombre de paciente', () => {
  // Arrange
  const citas = [
    { id: '1', paciente: 'Juan Pérez', medico: 'Dra. López', fecha: '2026-08-20' },
    { id: '2', paciente: 'María Gómez', medico: 'Dr. Ruiz', fecha: '2026-08-21' },
  ];

  // Act
  const resultado = filtrarCitas(citas, 'juan');

  // Assert
  assert.deepEqual(resultado.map((cita) => cita.id), ['1']);
});

test('RF06: filtrarCitas encuentra coincidencias por médico', () => {
  // Arrange
  const citas = [
    { id: '1', paciente: 'Juan Pérez', medico: 'Dra. López', fecha: '2026-08-20' },
    { id: '2', paciente: 'María Gómez', medico: 'Dr. Ruiz', fecha: '2026-08-21' },
  ];

  // Act
  const resultado = filtrarCitas(citas, 'ruiz');

  // Assert
  assert.deepEqual(resultado.map((cita) => cita.id), ['2']);
});

test('RF07: editarCita actualiza los campos indicados de la cita con el id dado', () => {
  // Arrange
  const citas = [
    { id: '1', paciente: 'Juan Pérez', medico: 'Dra. López', fecha: '2026-08-20', hora: '10:00', estado: 'pendiente' },
    { id: '2', paciente: 'María Gómez', medico: 'Dr. Ruiz', fecha: '2026-08-21', hora: '11:00', estado: 'pendiente' },
  ];

  // Act
  const resultado = editarCita(citas, '1', { hora: '15:00', motivo: 'Cambio de horario' });

  // Assert
  assert.equal(resultado.ok, true);
  const citaEditada = resultado.citas.find((cita) => cita.id === '1');
  assert.equal(citaEditada.hora, '15:00');
  assert.equal(citaEditada.motivo, 'Cambio de horario');
  assert.equal(citaEditada.paciente, 'Juan Pérez');
  const otraCita = resultado.citas.find((cita) => cita.id === '2');
  assert.equal(otraCita.hora, '11:00');
});

test('RF07: editarCita retorna error si el id no existe', () => {
  // Arrange
  const citas = [
    { id: '1', paciente: 'Juan Pérez', medico: 'Dra. López', fecha: '2026-08-20', hora: '10:00', estado: 'pendiente' },
  ];

  // Act
  const resultado = editarCita(citas, 'no-existe', { hora: '15:00' });

  // Assert
  assert.equal(resultado.ok, false);
  assert.equal(resultado.error, 'cita-no-encontrada');
});

test('RF08: cancelarCita cambia el estado de la cita indicada a cancelada', () => {
  // Arrange
  const citas = [
    { id: '1', paciente: 'Juan Pérez', estado: 'pendiente' },
    { id: '2', paciente: 'María Gómez', estado: 'pendiente' },
  ];

  // Act
  const resultado = cancelarCita(citas, '1');

  // Assert
  assert.equal(resultado.ok, true);
  const citaCancelada = resultado.citas.find((cita) => cita.id === '1');
  assert.equal(citaCancelada.estado, 'cancelada');
  const otraCita = resultado.citas.find((cita) => cita.id === '2');
  assert.equal(otraCita.estado, 'pendiente');
});

test('RF08: cancelarCita retorna error si el id no existe', () => {
  // Arrange
  const citas = [{ id: '1', paciente: 'Juan Pérez', estado: 'pendiente' }];

  // Act
  const resultado = cancelarCita(citas, 'no-existe');

  // Assert
  assert.equal(resultado.ok, false);
  assert.equal(resultado.error, 'cita-no-encontrada');
});

test('RF09: calcularEstadoVisual retorna "cancelada" si la cita fue cancelada', () => {
  // Arrange
  const ahora = new Date('2026-08-20T09:00:00');
  const cita = { fecha: '2026-08-25', hora: '10:00', estado: 'cancelada' };

  // Act
  const resultado = calcularEstadoVisual(cita, ahora);

  // Assert
  assert.equal(resultado, 'cancelada');
});

test('RF09: calcularEstadoVisual retorna "hoy" si la fecha coincide con la fecha actual', () => {
  // Arrange
  const ahora = new Date('2026-08-20T09:00:00');
  const cita = { fecha: '2026-08-20', hora: '15:00', estado: 'pendiente' };

  // Act
  const resultado = calcularEstadoVisual(cita, ahora);

  // Assert
  assert.equal(resultado, 'hoy');
});

test('RF09: calcularEstadoVisual retorna "pasada" si la fecha/hora ya transcurrió', () => {
  // Arrange
  const ahora = new Date('2026-08-20T09:00:00');
  const cita = { fecha: '2026-08-18', hora: '10:00', estado: 'pendiente' };

  // Act
  const resultado = calcularEstadoVisual(cita, ahora);

  // Assert
  assert.equal(resultado, 'pasada');
});

test('RF09: calcularEstadoVisual retorna "proxima" si la fecha es futura', () => {
  // Arrange
  const ahora = new Date('2026-08-20T09:00:00');
  const cita = { fecha: '2026-08-25', hora: '10:00', estado: 'pendiente' };

  // Act
  const resultado = calcularEstadoVisual(cita, ahora);

  // Assert
  assert.equal(resultado, 'proxima');
});

test('RF11: ESPECIALIDADES ofrece una lista predefinida no vacía de especialidades médicas', () => {
  // Arrange & Act
  // (ESPECIALIDADES es una constante exportada, no requiere Act)

  // Assert
  assert.ok(Array.isArray(ESPECIALIDADES));
  assert.ok(ESPECIALIDADES.length > 0);
  assert.ok(ESPECIALIDADES.includes('Medicina General'));
  assert.ok(ESPECIALIDADES.includes('Pediatría'));
  assert.ok(ESPECIALIDADES.includes('Odontología'));
});

test('RF06: filtrarCitas encuentra coincidencias por fecha', () => {
  // Arrange
  const citas = [
    { id: '1', paciente: 'Juan Pérez', medico: 'Dra. López', fecha: '2026-08-20' },
    { id: '2', paciente: 'María Gómez', medico: 'Dr. Ruiz', fecha: '2026-08-21' },
  ];

  // Act
  const resultado = filtrarCitas(citas, '2026-08-21');

  // Assert
  assert.deepEqual(resultado.map((cita) => cita.id), ['2']);
});
