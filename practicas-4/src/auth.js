const AUTH_KEY = 'citas_medicas_auth';
const SESSION_KEY = 'citas_medicas_sesion';

async function hashPassword(password) {
  const datos = new TextEncoder().encode(password);
  const buffer = await crypto.subtle.digest('SHA-256', datos);
  return Array.from(new Uint8Array(buffer))
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('');
}

function leerCredenciales(storage) {
  const guardado = storage.getItem(AUTH_KEY);
  return guardado === null ? null : JSON.parse(guardado);
}

async function registrarCredenciales(storage, usuario, password) {
  if (leerCredenciales(storage) !== null) {
    return { ok: false, error: 'ya-existen-credenciales' };
  }
  const passwordHash = await hashPassword(password);
  storage.setItem(AUTH_KEY, JSON.stringify({ usuario, passwordHash }));
  return { ok: true };
}

async function iniciarSesion(storage, usuario, password) {
  const guardado = leerCredenciales(storage);
  const passwordHash = await hashPassword(password);
  const coincide = guardado.usuario === usuario && guardado.passwordHash === passwordHash;
  if (!coincide) {
    return { ok: false, error: 'credenciales-invalidas' };
  }
  storage.setItem(SESSION_KEY, '1');
  return { ok: true };
}

function haySesionActiva(storage) {
  return storage.getItem(SESSION_KEY) === '1';
}

function cerrarSesion(storage) {
  storage.removeItem(SESSION_KEY);
}

module.exports = {
  AUTH_KEY,
  SESSION_KEY,
  hashPassword,
  registrarCredenciales,
  iniciarSesion,
  haySesionActiva,
  cerrarSesion,
};
