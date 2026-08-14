const AUTH_KEY = 'citas_medicas_auth';

async function hashPassword(password) {
  const datos = new TextEncoder().encode(password);
  const buffer = await crypto.subtle.digest('SHA-256', datos);
  return Array.from(new Uint8Array(buffer))
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('');
}

async function registrarCredenciales(storage, usuario, password) {
  const passwordHash = await hashPassword(password);
  storage.setItem(AUTH_KEY, JSON.stringify({ usuario, passwordHash }));
  return { ok: true };
}

module.exports = { AUTH_KEY, hashPassword, registrarCredenciales };
