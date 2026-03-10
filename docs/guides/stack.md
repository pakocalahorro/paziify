# 🏗️ The Paziify Architecture Blueprint
*Actualizado: 10 de Marzo de 2026*

Este documento es la **"Biblia" Técnica** de Paziify. Describe exactamente qué herramientas usamos, en qué versiones, por qué se eligieron, cómo interactúan entre sí, y cuáles son los protocolos robóticos y manuales (Workflows) bajo los que se ha esculpido la aplicación desde cero hasta el día de hoy.

Si en el futuro decides crear otra app (por ejemplo, *Paziify Pro* o un proyecto completamente distinto), este documento asegura que recrearás el éxito fundacional con una arquitectura élite probada en batalla y sin la curva de aprendizaje de meses previos.

---

## 🧠 0. El Origen: "Toolchain" de Inteligencia Artificial (Ecosistema Google)

Paziify no nació programando "a mano" en la primera fase. El proyecto es hijo de una cadena de montaje de Inteligencia Artificial de primer nivel. Para replicar su génesis exacta en un proyecto futuro, este es el flujo operativo inalterable:

1. **Ideación Visual (Google Stitch):** El punto de partida. Los mockups visuales y la inspiración inicial del proyecto nacen aquí. Se usa para tangibilizar la experiencia de usuario (UX) antes de tocar un solo archivo.
2. **Definición Arquitectónica (Google AI Studio):** El puente. El lugar donde los mockups de Stitch son asimilados, estructurados y donde se da forma lógica y técnica tanto al proyecto general como a las especificaciones de la aplicación.
3. **Desarrollo Operativo Global (Google Antigravity):** El músculo ejecutor. La IA agente (yo) que interactúa con tu propia máquina. Es el cerebro que convierte las especificaciones de AI Studio en código puro `.ts/.tsx`, compila módulos nativos en C++, gestiona las dependencias de Gradle/Expo y domina el repositorio de control de versiones.

---

## 📱 1. Core Stack (El Núcleo Base)

La base metodológica siempre es arrancar el esqueleto de la app en la versión más puntera (cutting-edge) estable posible. 
*La herramienta de inicialización es `npx create-expo-app@latest`.*

| Tecnología | Versión | Propósito & Razón de elección |
| :--- | :--- | :--- |
| **Expo SDK** | `~54.0.33` | El corazón del proyecto. Abstrae la configuración infernal de Android/iOS. Proporciona enrutamiento web y compila nativo. Se actualizó de SDK 51 a 54 para soportar la Nueva Arquitectura y Nitro Modules. |
| **React Native** | `0.81.5` | El motor que renderiza la UI. En esta versión `0.81+`, la **Nueva Arquitectura** está activa por defecto aportando *Fabric* (renderizado ultrarrápido) y *TurboModules* (conexión nativa instantánea sin puentes). |
| **React** | `19.1.0` | Librería central de UI. Adaptación a la ultimísima versión. |
| **TypeScript** | `~5.9.2` | (Dev) Todo el código del proyecto está estrictamente tipado para prevenir el 90% de crashes de variables inválidas antes incluso de compilar. |

**Configuración Clave en `app.json`:**
```json
{
  "newArchEnabled": true,
  "android": { "minSdkVersion": 26, "kotlinVersion": "2.1.0" }
}
```

---

## 📡 2. Backend & Data Fetching (El Cerebro de Datos)

El flujo de información es local-first, con persistencia y conexión a base de datos asíncrona real-time.

| Tecnología | Versión | Propósito & Razón de elección |
| :--- | :--- | :--- |
| **Supabase JS** | `^2.91.1` | Base de datos PostgreSQL en la nube, Autenticación (Email/Password), Row Level Security (RLS) y Almacenamiento. Reemplaza por completo a Firebase y aporta estructuración relacional pura. |
| **TanStack Query** | `^5.90.20` | (*React Query v5*) El orquestador de peticiones a Supabase. Gestiona la caché, re-intentos y paginación (`useInfiniteQuery`). |
| **AsyncStorage / Persist Q.** | `^5.90.22` | La capa de persistencia offline. Guarda en la memoria del móvil las meditaciones y queries de Tanstack para que la app arranque instantánea incluso sin internet. |
| **Expo File System** | `~19.0.21` | Manejo nativo de descarga de audios. Esencial para la funcionalidad offline del reproductor. |

---

## 🚀 3. Motores Gráficos y Multimedia (El Alma Visual)

Paziify no es un simple panel de botones; es una experiencia inmersiva. Estas librerías se exigen al máximo.

| Tecnología | Versión | Propósito & Razón de elección |
| :--- | :--- | :--- |
| **React Navigation** | `^7.10.1` | Toda la gestión de navegación. Bottom Tabs y Native Stacks. Última versión v7. |
| **React Native Reanimated** | `~4.1.1` (Alpha) | Librería de animaciones declarativas corriendo 100% en C++ (en el UI Thread). Capaz de animar gráficos sin afectar la fluidez del código JS. **Versión Alpha obligatoria** por la actualización de RN 0.81. |
| **React Native Skia** | `^2.2.12` | El motor gráfico 2D de Google (el mismo de Chrome y Flutter) empaquetado para React Native. Se usa para pintar las complicadas ondas gráficas (HRV, Bio-ritmo) a 60FPS. |
| **FlashList** (Shopify) | `2.0.2` | Reemplazo de `FlatList`. Es brutalmente más rápida mapeando el catálogo inmenso de meditaciones en el Discover/Home. |

---

## 👁️ 4. Visión Artificial & Integración Nativa Sensible (El Ojo del Cardio)

Esta es la zona de máximo dolor de compilación que requirió la cura más quirúrgica.

| Tecnología | Versión | Propósito & Razón de elección |
| :--- | :--- | :--- |
| **Vision Camera** | `5.0.0-beta` | La biblioteca de cámara más potente y compleja. Lee los frames a 30fps/60fps. La v5 era obligatoria por los requerimientos de la nueva arquitectura de React 0.81. |
| **Nitro Modules** | `^0.35.0` | El motor subyacente de la V.Camera v5. Un sistema turbo C++ ultrarrápido diseñado por Margelo para pasar imágenes masivas saltándose el puente JS. |
| **Worklets** | `^0.7.4` | Una dependencia crítica obligada por Reanimated. Ejecuta mini-hilos de JS en paralelo. Se eliminó la antigua `worklets-core` en favor de esta porque causaba conflictos mortales en compilación (*Crashes SIGABRT*). |

---

## 🤖 5. Protocolos Robóticos y Reglas de Inteligencia Artificial

Paziify no solo se programó con IA; se instauró una serie de **reglas y workflows restrictivos** para guiar a los agentes de IA futuros (*PCO y Workflows*). Estos son el verdadero secreto del trabajo exitoso.

### 5.1. Regla Sagrada: "Protocolo de Confirmación Obligatoria" (PCO)
Inyectado globalmente en la memoria del agente de desarrollo (`<user_global>`).
1. **NO EJECUTAR** modificaciones de código ni creaciones sin permiso explícito.
2. Explicar siempre el plan primero y terminar con: *"¿Procedo con estos cambios?"*.
3. Si el usuario hace una pregunta, se responde solo con información.
4. **Barrera Final**: El sistema siempre espera un "Adelante", "Sí", "Procede" antes de tocar un caracter del código.

*(Nota: Instaurar esta regla en aplicaciones futuras evitará el 99% de código destruido por "alucinaciones" proactivas).*

### 5.2. Workflows (Flujos de Trabajo Estandarizados)
Ubicados en `.agents/workflows/`, estas automatizaciones garantizan el orden en el caos:
- **`/catch-up`**: El comando de re-enganche. Lee el `task.md` y `walkthrough.md` para poner a la IA al día sobre en qué punto se quedó el desarrollo hace 1 semana.
- **`/session-end`**: El pilar de cierre diario. Fuerza a la IA a verificar cada archivo modificado, documentarlo en la memoria del proyecto, actualizar las guías y empujar el código limpio a GitHub (`git tag`, `git commit`). Sin esta rutina, el control de versiones muere en 2 días.

---

## 🛠️ 6. El Blueprint de Reconstrucción (Zero-to-Prod)

Si la misión directiva es "Recrear Paziify o una app clon" desde cero absoluto, esta es la secuencia inalterable que la IA debe ejecutar para garantizar el éxito estructural:

### ⏱️ Fase A: Inicialización y Núcleo
1. **Andamiaje Base:** `npx create-expo-app@latest NombreApp`
2. **Instalación de Dependencias Críticas:** 
   - UI/Navegación: `@react-navigation/native`, `@react-navigation/bottom-tabs`, `@react-navigation/native-stack`, `react-native-screens`, `react-native-safe-area-context`.
   - Estado/Backend: `@supabase/supabase-js`, `@tanstack/react-query`, `@react-native-async-storage/async-storage`.
   - Graficos/Animaciones: `react-native-reanimated`, `@shopify/react-native-skia`, `react-native-svg`.
   - Visión/Hardware: `react-native-vision-camera`, `react-native-worklets`, `react-native-nitro-modules`.

### ⏱️ Fase B: Configuración Obligatoria (El punto de fallo común)
La IA **debe** configurar estos tres archivos antes de escribir un solo componente JS:
1. **`app.json` (Plugins):** Inyectar permisos de cámara/micrófono y el plugin de `expo-build-properties` forzando `kotlinVersion: "2.1.0"` y `minSdkVersion: 26`.
2. **`babel.config.js`:** Añadir **exclusivamente** `plugins: ['react-native-reanimated/plugin']`. Si se añade `worklets/plugin` también, el empaquetador JS (`metro`) se romperá por duplicidad.
3. **`src/__tests__/setup.ts`:** Si se usa Jest, se deben mockear expresamente `react-native-reanimated` y `react-native-worklets` (jamás `worklets-core`).

### ⏱️ Fase C: Arquitectura de Carpetas (`src/`)
La IA destruirá la estructura plana que trae Expo por defecto y creará estrictamente la siguiente jerarquía bajo la carpeta `src/`. Todo el código vivirá aquí:

```text
src/
 ├── __tests__/  # Suite de Jest (setup.ts obligatorio)
 ├── assets/     # Imágenes locales, audios enbebidos
 ├── components/ # Ui-Kits (Botones, Tarjetas, Modales), agnósticos de negocio
 ├── constants/  # Theme.ts (Colores), Layout.ts
 ├── context/    # UserContext (Estado de Auth global)
 ├── data/       # Textos estáticos, diccionarios
 ├── hooks/      # Lógica extraída (ej: useInfiniteSessions de TanStack)
 ├── lib/        # Configuración de clientes (supabase.ts, react-query)
 ├── navigation/ # AppNavigator, RootStack, BottomTabNavigator
 ├── screens/    # Pantallas completas separadas por Features (Auth, Home, Bio)
 ├── services/   # Funciones de fetching puras (auth.ts, catalog.ts)
 ├── types/      # Interfaces de TypeScript (database.types.ts)
 └── utils/      # Helpers matemáticos, formateo de fechas
```

### ⏱️ Fase D: Entorno de Despliegue (La Ley de la Nube)
- **Desarrollo Diario:** Ejecutar `npx expo start --dev-client`. Probar en Expo Go o con build de desarrollo.
- **Producción Final (APK/AAB):** La regla inquebrantable para Paziify es **NUNCA compilar C++ en local (Windows)** para la release. La IA instruirá al humano para usar `eas build --platform android --profile production`. Esto asegura que los servidores de Linux aíslen la compilación, eviten cachés corruptas y generen un `.apk` / `.aab` inmaculado. Solo si EAS no es opción, derivar a la *Guía Maestra Android* para la purga de cachés de PowerShell.
