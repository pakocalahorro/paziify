<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Paziify - AI Studio App (v2.7.0) 🚀

Bienvenido al repositorio oficial de Paziify. Esta es la versión **v2.7.0 (Unified Branding & Safe Area Mastery)**, una evolución que consolida la identidad corporativa unificando todos los catálogos y blinda la experiencia visual con una gestión avanzada de áreas seguras y un nuevo sistema de navegación flotante.

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

---

## 📚 Documentación Maestra (docs/)

Paziify se rige por 4 pilares de documentación que deben estar siempre sincronizados:

- **[Audio & Voces](docs/guides/audio.md)**: Parámetros de identidad (Gaia, Aria, Ziro, Éter), motor de síntesis SSML y auditoría de las 101 sesiones.
- **[Diseño Visual (Oasis)](docs/guides/designs.md)**: Principios de diseño, orbes Skia, tipografía Oswald y jerarquía de imágenes (Admin > Local).
- **[Base de Datos & Seguridad](docs/guides/database.md)**: Esquema de Supabase, diccionarios de datos y políticas RLS.
- **[Manual de Usuario](docs/guides/user_manual.md)**: Guía de funcionalidades y manual del Panel Admin/CMS.

---

## 🛠️ Scripts y Herramientas (`scripts/`)

- **`bulk_generate_scripts.py`**: [NEW] Migra guiones profesionales de `docs/scripts/` a texto plano para TTS.
- **`generate_audiobook.py`**: [PREMIUM] Generador de audio con soporte **SSML Prosody** (pausas de 2s).
- **`sync_sessions.js`**: Sincroniza metadatos de guiones con la base de datos `sessionsData.ts`.

---

- **[NEW] Unified Branding & UI Mastery (v2.7.0)**: Unificación visual de Biblioteca, Academia y Audiolibros. Sistema de navegación flotante con `StarCore` y tipografía premium Skia.
- **[NEW] Spiritual Flow (v2.6.5)**: Implementación de `SpiritualPreloader` y navegación simplificada de fricción cero.
- **[NEW] Profile 3.0 (v2.6.5)**: Rediseño integral con Glassmorphism, objetivos dinámicos y Árbol de Resiliencia orgánico.
- **[NEW] Total Cloud Sync (v2.6.5)**: Persistencia 100% en Supabase (Favoritos, Historial y Ajustes en JSONB).
- **[NEW] Monthly Challenge (v2.6.0)**: Motor de compromiso con Reto de 30 días y 30 luces de progreso.
- **[NEW] Audio Automation 101 (v2.5.0)**: Flujo completo de generación masiva con voces premium restauradas.
- **Academy Implementation v2.3.0**: Módulo educativo completo con integración Supabase.
- **Catalog Mastery v1.9.0**: Diseño tipo Netflix y sincronización de 119 audios.

---

**Última actualización:** 12 de Febrero de 2026 - **Versión v2.7.0** (Unified Branding & Safe Area Mastery)
