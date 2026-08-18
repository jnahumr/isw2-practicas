const CAMPOS_OBLIGATORIOS = ['paciente', 'medico', 'fecha', 'hora'];

function generarId() {
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function crearCita(datos, ahora = new Date(), citasExistentes = []) {
  const errores = CAMPOS_OBLIGATORIOS.filter((campo) => !datos[campo]);
  if (errores.length > 0) {
    return { ok: false, errores };
  }

  const fechaHoraCita = new Date(`${datos.fecha}T${datos.hora}`);
  if (fechaHoraCita < ahora) {
    return { ok: false, errores: ['fecha-pasada'] };
  }

  const haySolapamiento = citasExistentes.some(
    (cita) => cita.medico === datos.medico && cita.fecha === datos.fecha && cita.hora === datos.hora
  );
  if (haySolapamiento) {
    return { ok: false, errores: ['solapamiento'] };
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

module.exports = { crearCita, ordenarCitas, filtrarCitas, editarCita };
