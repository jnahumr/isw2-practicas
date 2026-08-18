const CAMPOS_OBLIGATORIOS = ['paciente', 'medico', 'fecha', 'hora'];

const ESPECIALIDADES = [
  'Medicina General',
  'Pediatría',
  'Odontología',
  'Ginecología',
  'Cardiología',
  'Dermatología',
];

const MEDICOS_POR_ESPECIALIDAD = {
  'Medicina General': ['Dra. López', 'Dr. Luis Pérez'],
  Pediatría: ['Dra. Carla Méndez', 'Dr. Jorge Ramírez'],
  Odontología: ['Dra. Sofía Torres'],
  Ginecología: ['Dra. Elena Castro'],
  Cardiología: ['Dr. Miguel Ángel Rivas'],
  Dermatología: ['Dra. Paula Navarro'],
};

function generarId() {
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function fechaHoraDe(fecha, hora) {
  return new Date(`${fecha}T${hora}`);
}

function crearCita(datos, ahora = new Date(), citasExistentes = []) {
  const errores = CAMPOS_OBLIGATORIOS.filter((campo) => !datos[campo]);
  if (errores.length > 0) {
    return { ok: false, errores };
  }

  const fechaHoraCita = fechaHoraDe(datos.fecha, datos.hora);
  if (fechaHoraCita < ahora) {
    return { ok: false, errores: ['fecha-pasada'] };
  }

  const haySolapamiento = citasExistentes.some(
    (cita) => cita.medico === datos.medico && cita.fecha === datos.fecha && cita.hora === datos.hora
  );
  if (haySolapamiento) {
    return { ok: false, errores: ['solapamiento'] };
  }

  const medicosDeEspecialidad = MEDICOS_POR_ESPECIALIDAD[datos.especialidad] || [];
  if (!medicosDeEspecialidad.includes(datos.medico)) {
    return { ok: false, errores: ['medico-invalido'] };
  }

  const cita = {
    id: generarId(),
    paciente: datos.paciente,
    medico: datos.medico,
    especialidad: datos.especialidad,
    fecha: datos.fecha,
    hora: datos.hora,
    motivo: datos.motivo,
    estado: 'pendiente',
  };
  return { ok: true, cita };
}

function ordenarCitas(citas) {
  return [...citas].sort((a, b) => {
    const fechaHoraA = `${a.fecha}T${a.hora}`;
    const fechaHoraB = `${b.fecha}T${b.hora}`;
    return fechaHoraA.localeCompare(fechaHoraB);
  });
}

function filtrarCitas(citas, texto) {
  const busqueda = texto.toLowerCase();
  return citas.filter(
    (cita) =>
      cita.paciente.toLowerCase().includes(busqueda) ||
      cita.medico.toLowerCase().includes(busqueda) ||
      cita.fecha.toLowerCase().includes(busqueda)
  );
}

function editarCita(citas, id, cambios) {
  const existe = citas.some((cita) => cita.id === id);
  if (!existe) {
    return { ok: false, error: 'cita-no-encontrada' };
  }
  const citasActualizadas = citas.map((cita) => (cita.id === id ? { ...cita, ...cambios } : cita));
  return { ok: true, citas: citasActualizadas };
}

function cancelarCita(citas, id) {
  return editarCita(citas, id, { estado: 'cancelada' });
}

function fechaLocalISO(date) {
  const year = date.getFullYear();
  const mes = String(date.getMonth() + 1).padStart(2, '0');
  const dia = String(date.getDate()).padStart(2, '0');
  return `${year}-${mes}-${dia}`;
}

function calcularEstadoVisual(cita, ahora = new Date()) {
  if (cita.estado === 'cancelada') {
    return 'cancelada';
  }
  if (cita.fecha === fechaLocalISO(ahora)) {
    return 'hoy';
  }
  const fechaHoraCita = fechaHoraDe(cita.fecha, cita.hora);
  return fechaHoraCita < ahora ? 'pasada' : 'proxima';
}

module.exports = {
  crearCita,
  ordenarCitas,
  filtrarCitas,
  editarCita,
  cancelarCita,
  calcularEstadoVisual,
  ESPECIALIDADES,
  MEDICOS_POR_ESPECIALIDAD,
};
