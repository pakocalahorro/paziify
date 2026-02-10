<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Paziify - AI Studio App (v2.5.0) 🚀

Bienvenido al repositorio oficial de Paziify. Esta es la versión **v2.5.0 (Audio Automation & Professional CMS)**, que introduce la generación masiva de audio premium con SSML y un panel de administración transformado en CMS.

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

## 📋 Roadmap y Logros

- **[NEW] Audio Automation 101 (v2.5.0)**: Flujo completo de generación masiva con voces premium restauradas.
- **[NEW] Professional CMS (v2.4.5)**: Panel Admin avanzado con gestión de media inteligente y filtros.
- **Academy Implementation v2.3.0**: Módulo educativo completo con integración Supabase.
- **Catalog Mastery v1.9.0**: Diseño tipo Netflix y sincronización de 119 audios.

---

**Última actualización:** 10 de Febrero de 2026 - **Versión v2.5.0** (Audio Automation & CMS)
