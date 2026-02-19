<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Paziify - AI Studio App (v2.12.0) 🚀

Bienvenido al repositorio oficial de Paziify. Esta es la versión **v2.12.0 (Medical Grade)**, que introduce la **Fiabilidad Científica** para el Escáner Cardio, con acumulación de sesión, filtros estadísticos MAD y gamificación terapéutica avanzada (OrbFlow).

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

- **`regenerate_insomnia.py`**: [NEW] Motor de recuperación de audio para el curso de Insomnio (Voz Eter).
- **`optimize_academy_assets.py`**: [NEW] Limpieza forense de archivos redundantes en el almacenamiento.
- **`bulk_generate_scripts.py`**: Migra guiones profesionales de `docs/scripts/` a texto plano para TTS.
- **`generate_audiobook.py`**: [PREMIUM] Generador de audio con soporte **SSML Prosody** (pausas de 2s).

---

- **[NEW] Medical Grade Cardio (v2.12.0)**: Algoritmo biométrico validado con acumulación de sesión y filtro estadístico MAD. Precisión clínica (±4 BPM). Incluye gamificación terapéutica (OrbFlow v2).
- **[NEW] Premium Calibration System (v2.11.0)**: Sistema de calibración en 3 fases para Cardio Scan con tecnología rPPG y algoritmo POS. Incluye CalibrationRing, CountdownOverlay, QualityAlert y 6 bug fixes críticos para precisión clínica (±3 BPM).

---

**Última actualización:** 19 de Febrero de 2026 - **Versión v2.12.0** (Medical Grade & Gamification)


