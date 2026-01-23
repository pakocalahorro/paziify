# 🗄️ Guía de Arquitectura de Base de Datos - Paziify (v1.0)

Esta guía detalla la infraestructura de datos de Paziify alojada en **Supabase (PostgreSQL)**. La seguridad y la escalabilidad son los pilares de este diseño.

---

## 1. Principio de Seguridad: Row Level Security (RLS) 🛡️

En Paziify, la privacidad es una característica, no una opción. Todas las tablas tienen RLS activado.

- **Aislamiento Total**: Cada registro está vinculado a un `user_id` (UUID de `auth.users`).
- **Validación en Servidor**: Las políticas de PostgreSQL impiden que un usuario realice operaciones sobre datos que no le pertenecen, incluso si intentara manipular las peticiones desde el cliente.

---

## 2. Diccionario de Datos (Esquema Public)

### `profiles`
Extensión del perfil de usuario para gamificación y personalización.
| Campo | Tipo | Descripción |
| :--- | :--- | :--- |
| `id` | UUID (PK) | Referencia a `auth.users.id` |
| `full_name` | TEXT | Nombre completo del usuario |
| `avatar_url` | TEXT | URL de la imagen de perfil |
| `streak` | INTEGER | Racha actual de días consecutivos |
| `resilience_score` | INTEGER | Puntuación acumulada de bienestar (0-100) |
| `is_plus_member` | BOOLEAN | Estado de suscripción premium |
| `created_at` | TIMESTAMPTZ | Fecha de registro |

### `meditation_logs`
Histórico de sesiones completadas.
| Campo | Tipo | Descripción |
| :--- | :--- | :--- |
| `id` | UUID (PK) | Identificador único del log |
| `user_id` | UUID (FK) | Relación con el usuario |
| `session_id` | TEXT | ID de la sesión (ej: `anx_box`) |
| `duration_minutes` | INTEGER | Minutos meditados en esa sesión |
| `mood_score` | INTEGER | Estado de ánimo reportado (1-5) |

### `academy_progress`
Registro de lecciones de la Academia TCC.
| Campo | Tipo | Descripción |
| :--- | :--- | :--- |
| `user_id` | UUID (FK) | Relación con el usuario |
| `lesson_id` | TEXT | ID de la lección completada |
| `completed` | BOOLEAN | True si se ha finalizado |
| *Restricción* | `UNIQUE` | Un usuario solo tiene un registro por lección |

### `community_posts`
Espacio social para reflexiones.
| Campo | Tipo | Descripción |
| :--- | :--- | :--- |
| `user_id` | UUID (FK) | Creador del post |
| `content` | TEXT | Reflexión escrita |
| `mood_index` | INTEGER | Estado de ánimo asociado |
| `likes_count`| INTEGER | Apoyo recibido ("Paz") |

---

## 3. Políticas de Seguridad Aplicadas 🔐

A continuación, la lógica de las políticas RLS implementadas:

```sql
-- Perfiles
CREATE POLICY "Dueño puede gestionar su perfil" ON profiles 
  FOR ALL USING (auth.uid() = id);

-- Logs y Progreso
CREATE POLICY "Datos privados de usuario" ON meditation_logs 
  FOR ALL USING (auth.uid() = user_id);

-- Comunidad
CREATE POLICY "Lectura global" ON community_posts FOR SELECT USING (true);
CREATE POLICY "Solo dueño edita su post" ON community_posts FOR ALL USING (auth.uid() = user_id);
```

---

## 4. Automatizaciones de Base de Datos (Triggers) ⚡

Para asegurar una experiencia de "un solo clic" y mantener la integridad de los datos, hemos implementado disparadores en el servidor:

### Creación Automática de Perfil
Cada vez que un usuario se registra (vía Google u otro método), Supabase ejecuta una función que inserta sus datos básicos en `public.profiles`.

```sql
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url)
  VALUES (
    new.id,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'avatar_url'
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
```

---

## 5. Buenas Prácticas para Desarrolladores 🚀

1. **Uso del UID del Servidor**: Nunca confíes en un `user_id` pasado manualmente desde el frontend para filtros críticos. Deja que las políticas RLS hagan el trabajo pesado usando `auth.uid()`.
2. **Sincronización de Contexto**: Al actualizar datos en Supabase, asegúrate de refrescar el `userState` en `AppContext` para mantener la UI coherente.
3. **Migraciones**: Cada cambio estructural debe ir precedido de un archivo SQL documentado.
4. **Relaciones**: Usa siempre `ON DELETE CASCADE` para asegurar que si un usuario borra su cuenta, todos sus datos personales se eliminen por completo (derecho al olvido).

---
*Última revisión: 23 de Enero de 2026 - Sprint Infraestructura*
