# 🎙️ Guía Maestra de Audio - Paziify

Esta guía documenta la arquitectura técnica del motor de audio, los protocolos de nomenclatura, el catálogo auditado y los parámetros de identidad de los guías.

---

## 1. Arquitectura del Motor de Audio

El motor de audio de Paziify ha sido diseñado para ser inmersivo, multi-capa y personalizable.

### Motor Multi-Capa (`AudioEngineService.ts`)
Paziify permite la mezcla simultánea de cuatro tipos de fuentes:
1.  **Voice Track (Pre-grabado)**: Pistas de voz MP3 generadas con Google Cloud TTS para ejecución en segundo plano confiable.
2.  **Guía Vocal (Dinámica)**: Instrucciones TTS en tiempo real para sesiones sin voice track.
3.  **Soundscapes (Ambientes)**: Paisajes sonoros infinitos (lluvia, bosque) que pueden reproducirse solos o mezclados.
4.  **Ondas Binaurales**: Frecuencias (Theta, Alpha, Gamma) inyectadas como capa secundaria para potenciar el enfoque o la relajación.

### Implementaciones Técnicas
*   **Supabase Storage**: Todos los assets estáticos (Voice Tracks, Soundscapes, Binaurales, Audiolibros) se sirven desde buckets dedicados (`meditation-voices`, `soundscapes`, `binaurals`, `audiobooks`).
*   **Background Execution**: Audio configurado con `staysActiveInBackground: true` para mantener la reproducción incluso con la pantalla apagada.
*   **Sincronización Quirúrgica**: 
    - **Compensación Aditiva**: El motor visual suma dinámicamente el tiempo de voz para evitar la desincronización por "drift".
    - **Offset de Anticipación**: Adelanto visual de 350ms respecto al audio para una respuesta intuitiva.
*   **Protocolo de Nomenclatura ASCII**: Todos los archivos y URLs deben ser 100% ASCII (ej. `sueno`, `lluvia`, `bosque`, `cosmos`). Hemos estandarizado los paisajes sonoros para evitar errores de carga.
*   **Security Hardening (RLS)**: Los buckets de audio (`meditation-voices`, `audiobooks`, `soundscapes`) cuentan con políticas RLS de lectura protegida para garantizar la integridad del contenido.

### Reproductor Global y Persistencia (`AudioPlayerContext.tsx`)
Para audiolibros e historias:
*   **Global Context**: Mantiene el estado del audio vivo entre cambios de pantalla.
*   **MiniPlayer**: Componente flotante que permite el control de reproducción en toda la app.

---

## 2. Identidad de los Guías (Parámetros Premium)

A continuación se detallan los parámetros técnicos de Google Cloud TTS validados para mantener la calidad profesional de Paziify.

### 📋Resumen de Guías (Identidad Restaurada)
- **Aria (Femenina - Calm)**: `es-ES-Wavenet-F` | Pitch: -3.0 | Rate: 0.72 | [Muestra de Audio](https://ueuxjtyottluwkvdreqe.supabase.co/storage/v1/object/public/meditation-voices/samples/sample_aria.mp3)
- **Gaia (Infantil - Dulce)**: `es-ES-Wavenet-C` | Pitch: +3.5 | Rate: 0.80 | [Muestra de Audio](https://ueuxjtyottluwkvdreqe.supabase.co/storage/v1/object/public/meditation-voices/samples/sample_gaia.mp3)
- **Ziro (Masculina - Power)**: `es-ES-Neural2-G` | Pitch: -2.5 | Rate: 0.75 | [Muestra de Audio](https://ueuxjtyottluwkvdreqe.supabase.co/storage/v1/object/public/meditation-voices/samples/sample_ziro.mp3)
- **Éter (Masculina - Deep)**: `es-ES-Studio-F` | Pitch: 0.0 | Rate: 0.75 | [Muestra de Audio](https://ueuxjtyottluwkvdreqe.supabase.co/storage/v1/object/public/meditation-voices/samples/sample_eter.mp3)

### SSML Prosody (Calidad Premium) 🎙️
Para una experiencia meditativa superior, el motor de audio (`generate_audiobook.py`) utiliza etiquetas SSML para controlar la prosodia:
- **Pausas Automáticas**: Se insertan etiquetas `<break time="2000ms"/>` entre párrafos.
- **Ritmo Espiritual**: Las tasas de habla (`speaking_rate`) se mantienen por debajo de 0.8x para facilitar la introspección.

---

## 3. Herramientas de Mantenimiento y Scripts

Disponemos de herramientas en la carpeta `scripts/` para mantener el catálogo organizado:

*   **`sync_sessions.js`**: Cruza los guiones de `docs/scripts/` con `sessionsData.ts`. Asigna guías y genera URLs ASCII.
*   **`prepare_upload.js`**: Renombra físicamente los MP3 locales para que coincidan con la base de datos.
*   **`bulk_generate_scripts.py`**: Migración masiva de guiones profesionales (`docs/scripts/`) a formato `.txt`.
*   **`generate_audiobook.py`**: Motor de síntesis masiva usando los parámetros premium SSML detallados arriba.

> [!TIP]
> **Regla de Oro**: Si cambias algo en la autoría o categorías, primero corre `sync_sessions.js`, luego `prepare_upload.js`, y finalmente sube a Supabase.

---

## 4. Auditoría de Sesiones (101 Guiadas)

Este es el registro del estado de las sesiones tras la auditoría del 10 de febrero de 2026.

### 🛑 Calma SOS (Guía: Aria)
| Sesión | Guía | Confirmado |
| :--- | :--- | :--- |
| Alivio de la Opresión en el Pecho | Aria | OK |
| Coherencia Cardíaca (Ritmo 5-5) | Aria | OK |
| Desanclaje de Pensamientos (Defusión Cognitiva) | Aria | OK |
| El Refugio de la Respiración | Aria | |
| Gestión del Pánico (Tierra) | Aria | OK |
| Neutralización de la Rumiación | Aria | |
| Reset de 3 Minutos | Aria | OK |
| Respiración Cuadrada (Estabilidad Mental) | Aria | OK |
| SOS: Antes de una Reunión (Confianza Rápida) | Aria | |
| Sosiego de los Pensamientos | Aria | OK |
| Técnica 5-4-3-2-1 (Anclaje Sensorial) | Aria | |

### 🌅 Despertar y Energía (Guía: Ziro - REASIGNADO)
| Sesión | Guía | Confirmado |
| :--- | :--- | :--- |
| Activación de Dopamina Natural | Ziro | OK |
| Afirmaciones de Poder | Ziro | OK |
| Afirmaciones de Propósito | Ziro | OK |
| Amanecer en el Cuerpo (Movilidad y Consciencia) | Gaia | |
| Café Mental (Respiración de Fuego) | Ziro | OK |
| Cardio-Energía (Respiración Activa) | Ziro | OK |
| Despertar de la Mente (Focus) | Ziro | OK |
| Respiración Alterna (Nadi Shodhana) | Ziro | OK |
| Superar la Niebla Mental | Ziro | OK |
| Visualización de Éxito Diario | Ziro | OK |

### 🧠 Inteligencia Emocional (Guía: Aria)
| Sesión | Guía | Confirmado |
| :--- | :--- | :--- |
| Auto-responsabilidad | Aria | |
| Autogestión de la Ansiedad | Aria | |
| Bondad Amorosa (Metta) | Aria | OK |
| Celebrar el Logro Ajeno (Mudita) | Aria | OK |
| Compassión por los Demás | Aria | OK |
| El Espacio entre Estímulo y Respuesta | Aria | |
| Escucha Empática (Preparación) | Aria | OK |
| Gestionar la Tristeza | Aria | OK |
| Observar la Ira (El Volcán) | Aria | |
| Reconocer la Emoción | Aria | OK |

### 🏃‍♂️ Hábitos y Estilo de Vida (Guía: Aria)
| Sesión | Guía | Confirmado |
| :--- | :--- | :--- |
| Caminar sin Prisa (Mindful Walking) | Aria | |
| Comer Consciente (Mindful Eating) | Aria | |
| Detox Digital (Soltar la Pantalla) | Aria | |
| Escucha Profunda (Relaciones) | Aria | |
| Gratitud Antes de Dormir | Aria | |
| Mi Nuevo Yo (Identidad y Hábito) | Aria | |
| Paciencia ante la Espera (Cola o Tráfico) | Aria | |
| Respiración Consciente en el Trabajo | Aria | |
| Valorar lo Pequeño (Mindfulness Diario) | Aria | |
| Vivir con Minimalismo Mental | Aria | |

### 🧸 Paziify Kids (Guía: Gaia)
| Sesión | Guía | Confirmado |
| :--- | :--- | :--- |
| Adiós al "Enfado Monstruo" | Gaia | |
| Concentración para Niños (El Rayo Láser) | Gaia | |
| El Bosque de la Relajación | Gaia | |
| El Superpoder del Silencio | Gaia | |
| El Viaje en la Nube | Gaia | |
| Estiramiento Estrella (Despertar Niños) | Gaia | |
| Gratitud para Niños (El Árbol de la Suerte) | Gaia | |
| Habitantes de la Mente (Mindfulness para Niños) | Gaia | |
| La Aventura del Aire (Respiración Mágica) | Gaia | |
| Soy el Capitán de mi Barco | Gaia | |

### 🧘 Mindfulness y Presencia (Guía: Aria)
| Sesión | Guía | Confirmado |
| :--- | :--- | :--- |
| Caminata Lenta Consciente | Aria | OK |
| Consciencia de las Sensaciones (El Mapa Vivo) | Aria | |
| El Observador de Pensamientos | Aria | OK |
| El Observador Imparcial | Aria | OK |
| Escáner Corporal para el Día | Aria | OK |
| La Pausa entre Pensamientos | Aria | OK |
| Mindfulness en la Respiración (Anapanasati) | Aria | |
| Mindfulness en los Sonidos | Aria | OK |
| Presencia en el "Ahora" | Aria | OK |
| Vipassana: El Cuerpo Revelado | Aria | OK |

### ⚡ Rendimiento y Foco (Guía: Ziro)
| Sesión | Guía | Confirmado |
| :--- | :--- | :--- |
| Bloqueo de Distracciones | Ziro | OK |
| Concentración Láser | Ziro | OK |
| Enfoque antes de Estudiar | Ziro | OK |
| Flow State: Inmersión Total | Ziro | OK |
| Foco en la Monotarea | Ziro | OK |
| Mentalidad Ganadora (Efecto Ganador) | Ziro | OK |
| Preparación para la Creatividad | Ziro | OK |
| Resiliencia bajo Presión | Ziro | |
| Superar la Procrastinación | Ziro | OK |
| Visión Periférica y Calma (Hakalau) | Ziro | OK |

### 🛡️ Resiliencia y Poder Mental (Guía: Éter)
| Sesión | Guía | Confirmado |
| :--- | :--- | :--- |
| Auto-compasión ante el Error | Éter | OK |
| Desaprender el Juicio | Éter | OK |
| Ecuanimidad en el Caos | Éter | OK |
| El Observador de la Tormenta | Éter | OK |
| Fortaleza ante la Adversidad | Éter | OK |
| Gestión del Cambio (Aceptación Estoica) | Éter | OK |
| Gratitud Radical | Éter | OK |
| La Ciudadela Interior (Estoicismo) | Éter | OK |
| Previsualización de Dificultades (Pre-mortum) | Éter | OK |
| Transformar el Fracaso (Resiliencia) | Éter | OK |

### 🏥 Salud y Cuerpo (Guía: Aria)
| Sesión | Guía | Confirmado |
| :--- | :--- | :--- |
| Alivio del Dolor (Escáner) | Aria | OK |
| Conexión Mente-Intestino | Aria | OK |
| Consciencia de la Postura | Aria | |
| El Cuerpo como Aliado | Aria | OK |
| Escucha de la Incomodidad | Aria | |
| Gestión de la Cefalea por Tensión | Aria | |
| Recuperación Post-Ejercicio | Aria | |
| Relajación de Mandíbula y Rostro | Aria | OK |
| Respiración para la Digestión | Aria | |
| Vitalidad Sistémica | Aria | |

### 💤 Sueño y Descanso (Guía: Éter)
| Sesión | Guía | Confirmado |
| :--- | :--- | :--- |
| 4-7-8 Nocturno (Hacia el Sueño) | Éter | OK |
| El Lago de la Calma | Éter | OK |
| El Silencio de la Mente | Éter | OK |
| Preparación para el Ensueño | Éter | OK |
| Relajación Muscular Progresiva (Jacobson) | Éter | OK |
| Relajación Post-Pantallas | Éter | OK |
| Respiración Abdominal Profunda | Éter | OK |
| Respiración de la Luna (Chandra Bhedana) | Éter | OK |
| Soltar el Día (Vaciado Mental) | Éter | OK |
| Sosiego del Insomnio | Éter | OK |

---

## 🔍 Resumen Técnico de la Auditoría
1. **Total Sesiones**: 101
2. **Confirmadas (OK)**: 63
3. **Pendientes**: 38
4. **Estado por Guía**: 
   - **Éter y Ziro**: 100% OK.
   - **Aria**: Parcial (70% OK - Restauración de identidad aplicada).
   - **Gaia**: 100% OK (Identidad Infantil/Dulce aplicada).

---
*Última revisión: 11 de Febrero de 2026 - Versión 2.6.5 (Spiritual & Security Audit)*
