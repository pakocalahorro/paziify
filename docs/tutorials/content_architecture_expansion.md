# 🏗️ Arquitectura de Contenido y Almacenamiento v2.0 (101 Sesiones) 💎

Este documento detalla la infraestructura técnica y estratégica de Paziify para gestionar un catálogo a gran escala (101 sesiones) manteniendo una aplicación ligera y de alto rendimiento.

---

## 1. La Matriz de Contenido 10x10

Para ofrecer un catálogo de nivel mundial sin abrumar al usuario, hemos organizado el contenido en una **Matriz 10x10 (100 sesiones + 1 sesión de bienvenida)**.

### Categorías Especializadas:
1.  **Calma SOS**: Control inmediato del sistema nervioso (4-7-8, Grounding).
2.  **Despertar y Energía**: Activación matutina (Bhastrika, Kapalbhati).
3.  **Sueño y Descanso**: Recuperación profunda (Yoga Nidra, NSDR).
4.  **Mindfulness y Presencia**: Entrenamiento de la atención pura.
5.  **Resiliencia y Poder Mental**: Filosofía aplicada (Estoicismo, Gratitud).
6.  **Rendimiento y Foco**: Productividad y estado de flujo (Flow State).
7.  **Salud y Cuerpo**: Gestión del dolor y recuperación física.
8.  **Inteligencia Emocional**: Relaciones, ira y auto-compasión.
9.  **Paziify Kids**: Contenido adaptado para niños y jóvenes.
10. **Estilo de Vida y Hábitos**: Mindfulness en lo cotidiano (Comer, Caminar).

---

## 2. Infraestructura en Supabase Storage (Zero Local Media)

Para mantener el APK/IPA por debajo de los **30MB**, Paziify sigue una política estricta de **Zero Local Media**. Ningún audio o imagen de alta resolución se almacena dentro de la aplicación.

### Buckets y Estructura:

#### 🎙️ `meditation-voices`
Almacena las voces pre-grabadas con calidad de estudio (Google Cloud TTS Journey/WaveNet).
- **Convención de Nombres**: `[session_id]_voices.mp3`
- **Ejemplo**: `anx_478_voices.mp3`
- **Configuración**: Public read access habilitado.

#### 🖼️ `meditation-thumbnails`
Almacena las imágenes artísticas generadas por IA para cada sesión.
- **Convención de Nombres**: `[thumbnail_slug]_[timestamp].png`
- **Ejemplo**: `calma_sos_1_emerald_rings_1770031469977.png`

#### 🎵 `soundscapes` & `binaurals`
Almacena las capas de audio ambiental y frecuencias.
- **Formato**: MP3 optimizado a 128kbps para streaming fluido.

---

## 3. Integración en la App

La aplicación sincroniza este contenido remoto mediante el fichero `src/data/sessionsData.ts` y el servicio `AudioEngineService.ts`.

### Lógica de Referencia:
En `sessionsData.ts`, cada sesión apunta a sus activos remotos:
```typescript
{
  id: "anx_478",
  audioLayers: {
    voiceTrack: "https://.../storage/v1/object/public/meditation-voices/anx_478_voices.mp3",
    defaultSoundscape: "bird_relaxation",
    defaultBinaural: "theta_waves"
  },
  thumbnailUrl: "https://.../storage/v1/object/public/meditation-thumbnails/..."
}
```

### Proceso de Carga:
1. **Detección**: Al seleccionar una sesión, el sistema identifica si tiene un `voiceTrack`.
2. **Streaming**: El `AudioEngineService` carga el buffer de audio desde Supabase Storage.
3. **Sincronización**: Gracias al motor de 60 FPS implementado hoy (v1.8.0), el orbe visual se sincroniza con el timestamp del audio remoto de forma perfecta.

---

## 4. Gestión de Escalabilidad

- **Ingesta Masiva**: Se ha utilizado el fichero `newSessionsGenerated.json` como puente para la creación por lotes de las 101 sesiones.
- **Actualizaciones Dinámicas**: Al cambiar un archivo en el Storage (pero manteniendo el mismo nombre), todas las aplicaciones clientes reciben la actualización de sonido o imagen instantáneamente sin necesidad de una nueva build en la tienda.

---
*Última revisión: 2 de Febrero de 2026 - Milestone 3: Content King (v2.0 Architecture)*
