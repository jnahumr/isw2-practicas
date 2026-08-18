const test = require('node:test');
const assert = require('node:assert/strict');
const { registrarCredenciales, iniciarSesion, AUTH_KEY } = require('../src/auth');

function crearStorageFake() {
  const datos = {};
  return {
    getItem: (clave) => (clave in datos ? datos[clave] : null),
    setItem: (clave, valor) => { datos[clave] = valor; },
    removeItem: (clave) => { delete datos[clave]; },
  };
}

test('RF12: registrarCredenciales guarda usuario y hash cuando no hay credenciales previas', async () => {
  // Arrange
  const storage = crearStorageFake();

  // Act
  const resultado = await registrarCredenciales(storage, 'admin', 'clave123');

  // Assert
  assert.equal(resultado.ok, true);
  const guardado = JSON.parse(storage.getItem(AUTH_KEY));
  assert.equal(guardado.usuario, 'admin');
  assert.ok(guardado.passwordHash, 'debe guardar un hash de la contraseña');
  assert.notEqual(guardado.passwordHash, 'clave123', 'la contraseña no debe guardarse en texto plano');
});

test('RF12: registrarCredenciales no sobrescribe si ya hay credenciales guardadas', async () => {
  // Arrange
  const storage = crearStorageFake();
  await registrarCredenciales(storage, 'admin', 'clave123');
  const guardadoOriginal = storage.getItem(AUTH_KEY);

  // Act
  const resultado = await registrarCredenciales(storage, 'otro', 'otraClave');

  // Assert
  assert.equal(resultado.ok, false);
  assert.equal(resultado.error, 'ya-existen-credenciales');
  assert.equal(storage.getItem(AUTH_KEY), guardadoOriginal);
});

test('RF13: iniciarSesion permite el acceso cuando usuario y contraseña coinciden', async () => {
  // Arrange
  const storage = crearStorageFake();
  await registrarCredenciales(storage, 'admin', 'clave123');

  // Act
  const resultado = await iniciarSesion(storage, 'admin', 'clave123');

  // Assert
  assert.equal(resultado.ok, true);
});

test('RF14: iniciarSesion rechaza el acceso y reporta error cuando la contraseña no coincide', async () => {
  // Arrange
  const storage = crearStorageFake();
  await registrarCredenciales(storage, 'admin', 'clave123');

  // Act
  const resultado = await iniciarSesion(storage, 'admin', 'claveIncorrecta');

  // Assert
  assert.equal(resultado.ok, false);
  assert.equal(resultado.error, 'credenciales-invalidas');
});
