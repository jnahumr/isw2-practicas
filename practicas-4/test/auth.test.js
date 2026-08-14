const test = require('node:test');
const assert = require('node:assert/strict');
const { registrarCredenciales } = require('../src/auth');

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
  const guardado = JSON.parse(storage.getItem('citas_medicas_auth'));
  assert.equal(guardado.usuario, 'admin');
  assert.ok(guardado.passwordHash, 'debe guardar un hash de la contraseña');
  assert.notEqual(guardado.passwordHash, 'clave123', 'la contraseña no debe guardarse en texto plano');
});
