# Guía: Configuración de Google Cloud para Paziify 🛠️

Sigue estos pasos para obtener las credenciales necesarias para que el inicio de sesión con Google funcione en tu app.

## 1. Google Cloud Console
1. Entra en [Google Cloud Console](https://console.cloud.google.com/).
2. Arriba a la izquierda, haz clic en el selector de proyectos y elige **"Nuevo proyecto"** (llámalo `Paziify`).

## 2. Configurar Pantalla de Consentimiento (OAuth Consent Screen)
Es lo que verá el usuario al loguearse.
1. Busca en el menú lateral: **APIs y servicios > Pantalla de consentimiento de OAuth**.
2. Tipo de usuario: Selecciona **Externo** y dale a Crear.
3. **Información de la aplicación**:
   - Nombre de la aplicación: `Paziify`.
   - Correo de asistencia técnica: Tu email.
   - Logotipo (opcional): Puedes subirlo después.
4. **Dominios autorizados**: Añade `supabase.co`.
5. **Información de contacto del desarrollador**: Tu email de nuevo.
6. Pulsa "Guardar y continuar" hasta el final.

## 3. Crear Credenciales (Client ID & Secret)
1. Ve a **APIs y servicios > Credenciales**.
2. Haz clic en **+ Crear credenciales** > **ID de cliente de OAuth**.
3. **Tipo de aplicación**: Selecciona **Web application** (aunque sea para móvil, Supabase actúa como intermediario web).
4. **Nombre**: `Paziify Auth`.
5. **URIs de redireccionamiento autorizados**: Aquí es donde pegas la URL que te da Supabase.
   - Ve a tu panel de Supabase > `Authentication` > `Providers` > `Google`.
   - Copia la **Redirect URI** que aparece allí (será algo como `https://ueuxjtyottluwkvdreqe.supabase.co/auth/v1/callback`).
   - Pégala en Google Cloud.
6. Dale a **Crear**.

## 4. Vincular con Supabase
1. Copia el **ID de cliente** y el **Secreto de cliente** que te acaba de dar Google.
2. Ve a Supabase (`Auth > Providers > Google`).
3. Pégalos en los campos correspondientes y dale a **Save**.

---
> [!TIP]
> Una vez hecho esto, haz un `reload` en tu terminal donde corres Expo (`r`) y prueba el botón de Google en tu móvil/emulador.
