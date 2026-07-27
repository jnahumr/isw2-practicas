# Práctica 1 — Limpieza de código

## Contexto

**Proyecto de origen:** — Sistema de Control de Herramientas para la empresa en que actualmente trabajo. FASE1, sin entregar aún.

**Stack:** React + Vite + Supabase
**Archivo:** `src/context/AuthContext.jsx`
**Qué hacía:** este fragmento es el proveedor de autenticación de la aplicación. Al
iniciar, recupera la sesión activa de Supabase Auth y, si existe un usuario, consulta
su fila en la tabla `usuarios` para conocer su rol y su almacén asignado. De ese perfil
dependen todos los permisos del sistema.

---

## Código original

```jsx
export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null)
  const [perfil, setPerfil]   = useState(null)
  const [loading, setLoading] = useState(true)

  async function cargarPerfil(userId) {
    const { data, error } = await supabase
      .from('usuarios')
      .select('*')
      .eq('id', userId)
      .single()
    if (!error) setPerfil(data)
  }

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      if (session?.user) cargarPerfil(session.user.id)
      setLoading(false)
    })
  }, [])
}
```

---

## Smells detectados

| # | Smell (nombre técnico) | Ubicación | Por qué es un problema |
|---|------------------------|-----------|------------------------|
| 1 | **Error Swallowing** (silenciamiento de errores) | `if (!error) setPerfil(data)` | Si la consulta falla, el error se descarta sin registrarlo ni notificarlo. `perfil` queda en `null` y el usuario aparece sin rol ni permisos, sin ninguna pista de la causa. El fallo es invisible tanto para el usuario como para quien depura. |
| 2 | **Over-fetching** (`select('*')`) | `.select('*')` | Se traen todas las columnas de `usuarios` aunque solo se necesiten unas pocas. Transfiere datos innecesarios y genera un acoplamiento invisible: cualquier columna que se agregue en el futuro —incluso sensible— se expone automáticamente al frontend. |
| 3 | **Magic String** | `.from('usuarios')` | El nombre de la tabla está escrito literalmente. Si se renombra, el fallo aparece en tiempo de ejecución y no al compilar, y hay que buscarlo archivo por archivo. |

---
