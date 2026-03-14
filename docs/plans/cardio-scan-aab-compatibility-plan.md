# Plan: Resolver Compatibilidad CardioScan + AAB para Play Store

## Estado Actual

### Problema
1. **Botón CardioScan**: Error `TypeError: useFrameProcessor is not a function`
2. **AAB para Play Store**: Incompatibilidad entre `worklets-core` y `worklets` de Reanimated

### Causa Raíz (CORREGIDA)
- Las notas del 10 de marzo documentan que se reemplazó `react-native-worklets-core` por `react-native-worklets@0.7.4` para resolver crash de Reanimated v4
- **NUEVO HALLAZGO**: El problema NO es incompatibilidad de versiones
- El verdadero problema es que **falta la configuración de Frame Processors en app.json**
- El backup `app.json.bak` tenía la config correcta pero no se migró al app.json activo

**Evidencia**:
```
app.json.bak (líneas 44-48):
  ["react-native-vision-camera", {
    "cameraPermissionText": "...",
    "enableFrameProcessors": true   ← ESTO ACTIVABA useFrameProcessor
  }]

app.json actual (líneas 32-51):
  "plugins": [
    "expo-web-browser",
    ["expo-build-properties", {...}],
    ["expo-camera", {...}],
    "expo-video"
  ]
  → FALTA: plugin de react-native-vision-camera con enableFrameProcessors
```

---

## Opciones de Solución

| # | Descripción | Tiempo | Riesgo Científico | Recomendación |
|---|-------------|--------|------------------|---------------|
| **A** | Añadir plugin VisionCamera a app.json + prebuild | 15 min | **CERO** - preserva 30fps | ✅ **PRIMERA** |
| **B** | Reescribir a takePhoto() (ORIGINAL) | 2 horas | **ALTO** - reduce a 10fps | ⚠️ Fallback |

---

## Opción A: Quick Fix (RECOMENDADA)

### Estrategia
Añadir la configuración faltante de Frame Processors al plugin de VisionCamera en app.json, regenerar el build nativo y probar.

### Beneficios
- ✅ Preserva tasa de muestreo de 30fps (precisión científica intacta)
- ✅ No requiere reescribir código del CardioScan
- ✅ Solución mínima y targeted
- ✅ Mantiene compatibilidad con AAB

### Pasos de Implementación

#### Fase 1: Actualizar app.json

Añadir plugin de react-native-vision-camera con enableFrameProcessors:

```json
{
  "expo": {
    "plugins": [
      "expo-web-browser",
      [
        "expo-build-properties",
        {
          "android": {
            "kotlinVersion": "2.1.0",
            "minSdkVersion": 26
          }
        }
      ],
      [
        "react-native-vision-camera",
        {
          "cameraPermissionText": "Paziify necesita acceso a la cámara para el escaneo de cardio y bio-feedback.",
          "enableFrameProcessors": true
        }
      ],
      [
        "expo-camera",
        {
          "cameraPermission": "Paziify necesita acceso a la cámara para el escaneo de cardio y bio-feedback.",
          "microphonePermission": "Paziify necesita acceso al micrófono para sesiones guiadas interactivas."
        }
      ],
      "expo-video"
    ]
  }
}
```

#### Fase 2: Regenerar Build Nativo

```bash
npx expo prebuild --clean
```

#### Fase 3: Verificar Dependencias

Verificar que babel.config.js tenga solo el plugin de reanimated (el plugin de worklets-core ya no es necesario con worklets):

```javascript
module.exports = function (api) {
    api.cache(true);
    return {
        presets: ['babel-preset-expo'],
        plugins: [
            'react-native-reanimated/plugin'
        ]
    };
};
```

#### Fase 4: Test CardioScan

1. Build de desarrollo: `npx expo run:android`
2. Probar CardioScan en dispositivo físico
3. Verificar flujo completo: Calibración → Countdown → Medición → Resultados

#### Fase 5: Generar AAB

1. Verificar que build funcione
2. Generar AAB firmado
3. Verificar en Play Store Console

---

## Opción B: Reescribir a takePhoto() (FALLBACK)

⚠️ **ADVERTENCIA**: Esta opción implica una regresión científica significativa. Solo ejecutar si la Opción A falla.

### Estrategia
Reemplazar el procesamiento en tiempo real (FrameProcessor) por captura periódica de fotos usando `camera.takePhoto()`.

### Beneficios
- No requiere `worklets-core`
- Compatible con `worklets` de Reanimated
- Compatible con AAB para Play Store

### Riesgos (NO DOCUMENTADOS EN VERSIÓN ORIGINAL)

#### 🔴 Regresión Científica Crítica

| Aspecto | FrameProcessor (Original) | takePhoto() (Propuesto) | Impacto |
|---------|---------------------------|------------------------|---------|
| Tasa de muestreo | ~30 fps | ~10 fps | **-66% datos** |
| Latencia | Tiempo real (hilo C++) | Escritura + lectura disco | **>100ms/ciclo** |
| Precisión rPPG |within clinical spec | Fuera de spec | **HRV inaccurate** |

#### Detalle técnico del problema:
- El filtro bandpass (0.7-4 Hz) en BioSignalProcessor.ts fue calibrado para señales a 30Hz
- Con señales a 10Hz, la detección de picos y cálculo de HRV dará resultados incorrectos
- El mínimo clínico para rPPG fiable es ~30fps
- Contradice el endurecimiento científico de v2.47.0 (sesión 11-mar)

### Plan de Implementación (ORIGINAL)

#### 1.1 Eliminar imports innecesarios
```typescript
// ELIMINAR:
import { useFrameProcessor } from 'react-native-vision-camera';
import { runOnJS } from 'react-native-reanimated';

// CAMBIAR el import de Camera:
import { Camera, useCameraDevice, useCameraPermission } from 'react-native-vision-camera';
```

#### 1.2 Crear sistema de captura por timer
- Usar `camera.takePhoto()` cada ~100ms
- Almacenar fotos capturadas en una cola
- Procesar cada imagen asíncronamente

#### 1.3 Nuevo flujo de código
```typescript
useEffect(() => {
    if (scanPhase === 'calibration' || scanPhase === 'measuring') {
        captureInterval.current = setInterval(async () => {
            if (cameraRef.current) {
                const photo = await cameraRef.current.takePhoto();
                processPhoto(photo);
            }
        }, 100);
    }
    return () => clearInterval(captureInterval.current);
}, [scanPhase]);
```

#### 1.4 Función para procesar foto
```typescript
const processPhoto = async (photo: PhotoFile) => {
    const imageUri = `file://${photo.path}`;
    Image.getSize(imageUri, (width, height) => {
        // Procesar RGB...
    });
};
```

#### 1.5 Actualizar RGB Extraction
El archivo `src/utils/rgbExtraction.ts` necesita modificación para procesar `PhotoFile` en lugar de `Frame`.

---

## Dependencias Actuales (mantener)

| Paquete | Versión | Acción |
|---------|---------|--------|
| react-native-vision-camera | 5.0.0-beta.5 | Mantener |
| react-native-worklets | ^0.7.4 | Mantener |
| react-native-reanimated | ~4.1.1 | Mantener |
| react-native-worklets-core | NO | **No instalar** |

---

## Orden de Ejecución

1. **PRIMERO**: Opción A (Quick Fix) - 15 minutos
2. **SI FALLA**: Opción B como fallback - 2 horas

---

## Archivos a Modificar

### Opción A
1. `app.json` - Añadir plugin de VisionCamera

### Opción B (FALLBACK)
1. `app.json` - Añadir plugin de VisionCamera
2. `src/screens/Bio/CardioScanScreen.tsx` - Refactor principal
3. `src/utils/rgbExtraction.ts` - Adaptar para PhotoFile

---

## Tiempo Estimado

### Opción A
- Implementación: 15 minutos
- Testing: 15 minutos
- AAB Build: 15-30 minutos
- **Total: ~1 hora**

### Opción B
- Implementación: 1-2 horas
- Testing: 30 minutos
- AAB Build: 15-30 minutos
- **Total: ~2.5 horas**

---

## Alternativas Consideradas

### Opción C: Downgrade a VisionCamera 4.x + worklets-core
- **Descartada**: Genera problemas de build con AAB (documentado en sesiones)

### Opción D: Actualizar a VisionCamera 5.x estable
- **Descartada**: No existe versión estable released aún

---

## Nota Final

**Este plan ha sido revisado tras análisis crítico**. La Opción A es la solución correcta porque:

1. Resuelve el problema real (configuración faltante, no incompatibilidad)
2. Preserva la precisión científica del algoritmo de cardio
3. Minimiza el riesgo de regresión

La Opción B solo debe usarse como fallback si la Opción A falla, y requiere aprobación del responsable científico debido a la regresión de precisión.

---

*Documento actualizado tras análisis de causa raíz*
*Versión del proyecto: v2.47.0*
*Fecha de actualización: 13-marzo-2026*