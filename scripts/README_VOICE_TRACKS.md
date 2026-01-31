# Voice Track Generator

Este script genera pistas de voz pre-grabadas para todas las sesiones de meditación de Paziify, siguiendo el estándar de la industria (Headspace, Calm, Insight Timer).

## ¿Por qué pre-grabar las voces?

**Ventajas**:
- ✅ Funciona 100% en background (pantalla bloqueada)
- ✅ No depende de servicios externos (Google TTS)
- ✅ Funciona offline
- ✅ Mejor calidad y consistencia
- ✅ Inicio de sesión instantáneo

## Proceso

### Fase 1: Generar Schedules (ACTUAL)

```bash
node scripts/generateVoiceSchedules.js
```

Esto genera archivos JSON con los horarios exactos de cada voz:
- `assets/voice-tracks/anx_478_schedule.json`
- `assets/voice-tracks/anx_box_schedule.json`
- etc...

### Fase 2: Generar Audios con TTS (PRÓXIMO)

Necesitarás implementar la generación real de audio usando:
1. **Opción A**: Supabase Edge Function (meditation-tts) - Recomendado
2. **Opción B**: Script local con Google Cloud TTS SDK

### Fase 3: Subir a Supabase Storage

```bash
# Crear bucket en Supabase
meditation-voices/
  ├── anx_478_voices.mp3
  ├── anx_box_voices.mp3
  └── ...
```

### Fase 4: Actualizar Código

Modificar `AudioEngineService.ts` para cargar la pista de voz como una capa adicional de audio.

## Estructura de Schedule

Cada archivo JSON contiene:

```json
{
  "sessionId": "anx_478",
  "title": "Respiración 4-7-8",
  "duration": 300,
  "pattern": { "inhale": 4, "hold": 7, "exhale": 8, "holdPost": 0 },
  "schedule": [
    { "time": 0, "phase": "inhale", "text": "Inhala" },
    { "time": 4, "phase": "hold", "text": "Mantén" },
    { "time": 11, "phase": "exhale", "text": "Exhala" },
    { "time": 19, "phase": "inhale", "text": "Inhala" },
    ...
  ]
}
```

## Costos Estimados

- **TTS Google**: ~$0.50 USD (una sola vez, 20 sesiones)
- **Storage Supabase**: GRATIS (plan free incluye 1GB)
- **Total**: ~$0.50 USD

## Próximos Pasos

1. ✅ Generar schedules (este script)
2. ⏳ Implementar generación de audio con TTS
3. ⏳ Subir a Supabase Storage
4. ⏳ Actualizar AudioEngineService
5. ⏳ Probar en dispositivo con pantalla bloqueada
