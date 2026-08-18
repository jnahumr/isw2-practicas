function generarId() {
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function crearCita(datos) {
  const errores = [];
  if (!datos.paciente) {
    errores.push('paciente');
  }
  if (!datos.medico) {
    errores.push('medico');
  }
  if (errores.length > 0) {
    return { ok: false, errores };
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

module.exports = { crearCita };
