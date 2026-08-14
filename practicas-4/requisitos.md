# Requisitos — Aplicación para Agendar Citas Médicas

## 1. Descripción general

Aplicación web **standalone** (un único archivo `.html` con HTML, CSS y JavaScript embebidos, sin backend ni dependencias externas) que permite gestionar citas médicas: crear, ver, editar y cancelar citas, con persistencia local en el navegador.

## 2. Alcance

- Un solo archivo `.html` que se pueda abrir directamente en el navegador (doble clic), sin servidor ni instalación.
- Persistencia de datos usando `localStorage` (los datos sobreviven al cerrar y reabrir el navegador).
- Sin conexión a internet ni APIs externas.

## 3. Requerimientos funcionales

| ID | Requerimiento |
|----|----------------|
| RF01 | El usuario puede registrar una nueva cita indicando: nombre del paciente, médico/especialidad, fecha, hora y motivo de consulta. |
| RF02 | El sistema valida que los campos obligatorios (paciente, médico, fecha, hora) no estén vacíos antes de guardar. |
| RF03 | El sistema valida que la fecha/hora de la cita no sea en el pasado. |
| RF04 | El sistema impide agendar dos citas con el mismo médico en la misma fecha y hora (evita solapamiento). |
| RF05 | El usuario puede ver un listado de todas las citas agendadas, ordenadas por fecha y hora. |
| RF06 | El usuario puede filtrar/buscar citas por paciente, médico o fecha. |
| RF07 | El usuario puede editar los datos de una cita existente. |
| RF08 | El usuario puede cancelar (eliminar) una cita, con confirmación previa. |
| RF09 | El sistema muestra visualmente el estado de cada cita (ej. próxima, hoy, pasada/atendida, cancelada). |
| RF10 | Las citas quedan guardadas en `localStorage` y se recargan automáticamente al abrir la aplicación. |
| RF11 | El usuario puede seleccionar el médico/especialidad de una lista predefinida (ej. Medicina General, Pediatría, Odontología, etc.). |
| RF12 | Si no hay credenciales guardadas, el sistema permite configurar un usuario y contraseña la primera vez que se abre la aplicación. |
| RF13 | El usuario debe iniciar sesión con el usuario y contraseña configurados antes de acceder a la gestión de citas. |
| RF14 | Si las credenciales ingresadas no coinciden con las guardadas, el sistema muestra un mensaje de error y no otorga acceso. |
| RF15 | El usuario puede cerrar sesión; al hacerlo debe volver a autenticarse para acceder nuevamente a sus citas. |

## 4. Requerimientos no funcionales

| ID | Requerimiento |
|----|----------------|
| RNF01 | La aplicación debe funcionar como archivo único `.html`, sin necesidad de build tools, npm ni servidor. |
| RNF02 | Debe funcionar en los navegadores modernos más comunes (Chrome, Edge, Firefox). |
| RNF03 | Interfaz responsiva, usable tanto en escritorio como en dispositivos móviles. |
| RNF04 | Interfaz simple, clara e intuitiva (formulario + tabla/lista de citas). |
| RNF05 | El código debe estar organizado y comentado donde sea necesario, aunque esté en un solo archivo. |
| RNF06 | Tiempo de respuesta inmediato (todas las operaciones son locales, sin llamadas de red). |

## 5. Reglas de negocio

- No se permite crear una cita en una fecha/hora ya pasada.
- No se permite doble reserva: mismo médico + misma fecha + misma hora.
- Al cancelar una cita, se debe pedir confirmación al usuario antes de eliminarla definitivamente.
- Una cita se considera "hoy" si su fecha coincide con la fecha actual del sistema.
- Una cita se considera "pasada" si su fecha/hora ya transcurrió y no fue cancelada.
- El acceso a la gestión de citas requiere haber iniciado sesión con las credenciales configuradas.
- Las credenciales se almacenan localmente en `localStorage` (no se transmiten a ningún servidor, ya que la aplicación no tiene backend); por lo tanto, este login es una barrera de acceso local para un único usuario, no un mecanismo de seguridad robusto multiusuario.

## 6. Modelo de datos (localStorage)

Cada cita se almacena como un objeto con la siguiente estructura:

```json
{
  "id": "uuid o timestamp único",
  "paciente": "string",
  "medico": "string",
  "especialidad": "string",
  "fecha": "YYYY-MM-DD",
  "hora": "HH:MM",
  "motivo": "string",
  "estado": "pendiente | atendida | cancelada"
}
```

Todas las citas se guardan como un arreglo JSON bajo una clave fija en `localStorage` (ej. `citas_medicas`).

Las credenciales de acceso se guardan como un único objeto bajo otra clave fija en `localStorage` (ej. `citas_medicas_auth`):

```json
{
  "usuario": "string",
  "passwordHash": "string"
}
```

`passwordHash` se genera con una función de hash nativa del navegador (Web Crypto API, `crypto.subtle.digest`), no con una librería externa, para no romper la restricción de "sin frameworks ni CDNs".

## 7. Restricciones técnicas

- No usar frameworks externos (React, Vue, etc.) ni CDNs, para mantener el archivo verdaderamente standalone y funcional sin conexión.
- No usar backend ni base de datos externa.
- Todo el CSS y JavaScript deben estar embebidos en el mismo `.html` (`<style>` y `<script>` internos).

## 8. Fuera de alcance

- Autenticación multiusuario, roles o permisos (solo se soporta un usuario/perfil con credenciales propias, sin gestión de múltiples cuentas).
- Recuperación de contraseña olvidada (al no haber backend ni correo, no es posible enviar un enlace de recuperación).
- Notificaciones o recordatorios automáticos (email, push, SMS).
- Sincronización entre dispositivos o multiusuario.
- Impresión o exportación de citas (podría considerarse como mejora futura).
