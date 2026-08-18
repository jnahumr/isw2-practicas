const test = require('node:test');
const assert = require('node:assert/strict');
const { CITAS_KEY, guardarCitas, cargarCitas } = require('../src/almacenamiento');

function crearStorageFake() {
  const datos = {};
  return {
    getItem: (clave) => (clave in datos ? datos[clave] : null),
    setItem: (clave, valor) => { datos[clave] = valor; },
    removeItem: (clave) => { delete datos[clave]; },
  };
}

test('RF10: guardarCitas guarda el arreglo de citas en el storage', () => {
  // Arrange
  const storage = crearStorageFake();
  const citas = [{ id: '1', paciente: 'Juan Pérez' }];

  // Act
  guardarCitas(storage, citas);

  // Assert
  assert.deepEqual(JSON.parse(storage.getItem(CITAS_KEY)), citas);
});

test('RF10: cargarCitas devuelve las citas guardadas previamente', () => {
  // Arrange
  const storage = crearStorageFake();
  const citas = [{ id: '1', paciente: 'Juan Pérez' }];
  guardarCitas(storage, citas);

  // Act
  const resultado = cargarCitas(storage);

  // Assert
  assert.deepEqual(resultado, citas);
});

test('RF10: cargarCitas devuelve un arreglo vacío si no hay nada guardado', () => {
  // Arrange
  const storage = crearStorageFake();

  // Act
  const resultado = cargarCitas(storage);

  // Assert
  assert.deepEqual(resultado, []);
});
