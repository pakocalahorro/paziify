# 📖 Guía de Funcionalidad - Manual de Usuario (v2.11.0) 💎

Bienvenido a la guía oficial de **Paziify v2.11.0 (Premium Calibration)**. Esta versión introduce el **Sistema de Calibración Premium** para el Escáner Cardio, con tecnología rPPG y algoritmo POS de precisión clínica (±3 BPM).

---

## 1. Zero-Egress Caching (Navegación sin Gastar Datos) 🛡️
Paziify v2.8 introduce un motor de caché inteligente que protege tu plan de datos:
- **Carga Instantánea**: Una vez que escuchas una sesión o ves una carátula, la app la guarda en tu móvil para siempre.
- **Modo Offline Automático**: Si pierdes la conexión, todo el contenido que ya hayas visitado seguirá disponible sin esperas.
- **Optimización de Almacenamiento**: Hemos reducido la redundancia de archivos en un 50%, asegurando que cada lección de la Academia ocupe el mínimo espacio necesario.

---

## 2. Academia Paziify: Cursos y Lecciones 🎓
La Academia ahora cuenta con 10 cursos completos dedicados a tu salud mental:
- **Novedad: Adiós al Insomnio**: Recuperado íntegramente con la voz relajante de **Éter**.
- **Audio Profesional**: Todas las lecciones han sido optimizadas para una calidad de estudio constante.
- **Resiliencia Técnica**: El sistema ahora utiliza identificadores técnicos que garantizan que el audio cargue siempre, eliminando errores de descarga.

---

## 3. Escáner Cardio Premium (v2.11.0) 🫀✨
Transforma tu cámara en un sensor de bienestar emocional con tecnología rPPG (remote PhotoPlethysmoGraphy) y algoritmo POS de precisión clínica.

### Sistema de Calibración en 3 Fases

#### **FASE 1: Calibración Guiada (5-10s)**
1. **Preparación**: Coloca suavemente tu dedo índice sobre la lente trasera y el flash
2. **Feedback Visual en Tiempo Real**:
   - **Anillo de Calibración**: Muestra tu score de calidad (0-100%)
   - **Colores Dinámicos**: 
     - 🔴 Rojo (<60%): "Ajusta la posición del dedo"
     - 🟡 Amarillo (60-79%): "Casi perfecto, mantén así"
     - 🟢 Verde (≥80%): "¡Perfecto! Mantén así"
3. **Recomendaciones Contextuales**:
   - "Cubre completamente cámara y flash"
   - "Reduce la presión ligeramente"
   - "Mantén el dedo quieto"
4. **Transición Automática**: Cuando mantienes score ≥80% durante 3 segundos, avanza automáticamente

#### **FASE 2: Cuenta Regresiva (3s)**
- Overlay fullscreen con cuenta regresiva: 3... 2... 1...
- Vibración en cada segundo
- Mensaje: "¡Perfecto! Iniciando medición..."
- Subtítulo: "Mantén el dedo quieto"

#### **FASE 3: Medición (15s)**
- **Análisis Continuo**: Algoritmo POS procesa 30 frames por segundo
- **Barra de Progreso**: Visualización clara del tiempo restante
- **Monitoreo de Calidad**: Si la calidad cae, aparece alerta flotante con recomendaciones
- **Datos en Tiempo Real**: BPM (pulsaciones) y HRV (variabilidad cardíaca)

### Resultados Terapéuticos (No Médicos)
El sistema interpreta tus métricas con un tono de cuidado, no clínico:
- **🔴 Sobrecarga Mental**: "Tu sistema necesita un respiro" → Recomendación: Calma SOS
- **🟡 Energía Baja**: "Necesitas recarga suave" → Recomendación: Resiliencia
- **🟢 Resonancia Vital**: "Estás en equilibrio óptimo" → Recomendación: Mantén tu práctica

### Tecnología rPPG con Algoritmo POS
- **Precisión Clínica**: ±3 BPM vs ECG
- **Robusto al Movimiento**: Tolera movimiento moderado
- **Universal**: Funciona en todos los tonos de piel
- **Validado Científicamente**: Basado en paper de De Haan & Jeanne (2013)
### Privacidad Total
- ✅ **Análisis Local**: Todo el procesamiento ocurre en tu dispositivo
- ✅ **Cero Almacenamiento**: No se guardan imágenes ni videos de tu dedo
- ✅ **Sin Conexión Requerida**: Funciona completamente offline

---

## 4. Onboarding Zen y Flujo Espiritual ✨
Paziify v2.6 ha simplificado el viaje del usuario para maximizar la introspección:
- **Paso 1: Spiritual Preloader**: La app te recibe con una pausa de 3.5 segundos que decide inteligentemente si llevarte a la Brújula (Nexus) o directo a la Home.
- **Paso 2: Brújula Adaptativa (Nexus)**: Selección directa de tu intención ("Sanar" con Emerald Heart o "Crecer" con Solar Plasma).

---

## 5. El Menú de Navegación Flotante 🛸💎
**Componente:** `CustomTabBar`
- **Isla de Cristal**: Un menú ergonómico que flota sobre el contenido.
- **Efecto Orbital**: El botón central late orgánicamente reflejando tu energía actual.

---

## 6. Sincronización 100% Cloud y Perfil 3.0 🌟
- **Tu Oasis te Sigue**: Favoritos, historial y ajustes persistidos en Supabase.
- **Árbol de Resiliencia**: Un árbol vivo en tu perfil que crece con cada día de racha, iluminando sus 30 luces neón según tu progreso.

---

## 7. Panel de Administración (CMS Profesional) ⚙️
**Acceso:** Panel Web dedicado.
- **Gestión Total**: El contenido de la Academia, Audiolibros e Historias se gestiona ahora de forma profesional sin tocar código, permitiendo subidas masivas de media y edición de metadatos.
- **Categorías Dinámicas (NUEVO v2.9)**: Ahora puedes crear/editar Historias con categorías estándar (`Rendimiento`, `Despertar`, etc.) y aparecerán automáticamente en la App.

---

## 8. Modo Offline "Zero-Egress" Total 🛡️
- **Independencia de la Red**: La aplicación detecta si no tienes internet o si falla el servidor.
- **Contenido Siempre Disponible**: Carga automáticamente versiones locales de alta calidad para Meditaciones, Historias y Paisajes Sonoros.
- **Sin Pantallas en Blanco**: El sistema "Resiliencia" garantiza que siempre haya contenido que mostrar.


---
*Última revisión: 15 de Febrero de 2026 - Versión 2.10.0 (Bio-Metric Awakening)*  
**Pantalla:** `WelcomeScreen` -> `SpiritualPreloader` -> `CompassScreen` -> `HomeScreen` -> `CardioScanScreen`

