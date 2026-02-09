<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Paziify - AI Studio App (v2.3.0)

Bienvenido al repositorio oficial de Paziify. Esta es la versión **v2.3.0 (Academy & Cloud Sync)**, que introduce la arquitectura Offline-First y el módulo educativo completo.

View your app in AI Studio: https://ai.studio/apps/drive/1rb4V4qU4vKVmVlB2WCQHu2lJA3GEgg29

---

## 🚀 Ejecución y Desarrollo

### Ejecutar en Local
1.  Instalar dependencias:
    ```bash
    npm install
    ```
2.  Configurar API Key:
    Establece `GEMINI_API_KEY` en `.env.local`.
3.  Iniciar servidor de desarrollo:
    ```bash
    npx expo start --dev-client
    ```

### Ejecutar con Tunnel (Fuera de casa)
```bash
npx expo start --dev-client --tunnel
```

### Generar APK Debug (Android)
Para generar una build de desarrollo (`app-debug.apk`):

**Prerrequisitos**: Android Studio, JDK 17.

Ejecuta en PowerShell:
```powershell
$env:JAVA_HOME="C:\Program Files\Android\Android Studio\jbr"; if (Test-Path "android") { cd android }; ./gradlew assembleDebug
```
El APK se generará en: `android/app/build/outputs/apk/debug/app-debug.apk`

---

## 📚 Documentación Oficial

Toda la documentación detallada se encuentra en la carpeta `docs/`:

- **[Manual de Usuario](docs/guides/user_manual.md)**: Guía completa de funcionalidades, incluyendo la nueva **Academia**, el sistema de **Temas Visuales** y la **Sincronización Cloud**.
- **[Base de Datos](docs/guides/database.md)**: Esquema de Supabase, políticas RLS y diccionarios de datos (Cursos, Módulos, Lecciones).
- **[Diseño y Audio](docs/guides/designs_audio.md)**: Arquitectura del motor de audio multi-capa y sistema de diseño Skia + Oswald.

---

## 📋 Roadmap y Planes

- **[NEW] Espacios Sonoros (v2.4.0)**: Paisajes inmersivos con mezcla binaural y efectos visuales Skia.
- **Academy Implementation v2.3.0**: Módulo educativo completo con integración Supabase.
- **Catalog Mastery v1.9.0**: Sincronización de 119 audios y diseño tipo Netflix.
- **Expansión Contenido v1.2**: Audiobooks, Historias Reales y Glassmorphism.

---

## 🛠️ Workflows del Agente

Automatizaciones disponibles en `.agent/workflows/`:

- **`/catch-up`**: Sincroniza el estado mental del agente con el proyecto (requiere lectura de docs).
- **`/session-end`**: Documentación automática y cierre de sesión (requiere actualización de docs).

---

**Última actualización:** 9 de Febrero de 2026 - **Versión v2.3.0** (Academy Implementation)
