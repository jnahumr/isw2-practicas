const CITAS_KEY = 'citas_medicas';

function guardarCitas(storage, citas) {
  storage.setItem(CITAS_KEY, JSON.stringify(citas));
}

function cargarCitas(storage) {
  const guardado = storage.getItem(CITAS_KEY);
  return guardado === null ? [] : JSON.parse(guardado);
}

module.exports = { CITAS_KEY, guardarCitas, cargarCitas };
