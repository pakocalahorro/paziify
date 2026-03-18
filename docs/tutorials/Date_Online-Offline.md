# Arquitectura de Datos: Online, Offline y ZeroEgress

Este documento detalla el recorrido de la información en Paziify, especificando cómo se sincronizan los datos, dónde residen y cómo se optimiza el tráfico mediante la estrategia **ZeroEgress**.

## 1. Matriz de Localización de Datos

|           Dato / Recurso           | Nube (Supabase) | Local (Móvil) | ZeroEgress (CDN) |        Estado Offline        |
| :--------------------------------: | :-------------: | :-----------: | :--------------: | :--------------------------: |
| **Perfil (Racha, Score, Nombre)**  |       SÍ        |      SÍ       |        NO        |  **Disponible** (Caché local) |
| **Reto Activo (Estado 1/3, ID)**   |       SÍ        |      SÍ       |        NO        |   **Disponible** (Blindado)   |
|     **Favoritos e Historial**      |       SÍ        |      SÍ       |        NO        |  **Disponible** (Fusión/Merge) |
|     **Logs de Sesión (Nuevos)**    |   Sincroniza    |      SÍ       |        NO        | **En cola** (Sinc. diferida) |
|     **Estadísticas y Gráficos**    |       SÍ        |      SÍ       |        NO        | **Disponible** (Dash. local) |
|     **Metadatos de Contenido**     |       SÍ        |      SÍ       |      **SÍ**      | **Disponible** (Caché pers.) |
|    **Archivos de Audio (MP3)**     |     Stream      |    Parcial    |      **SÍ**      |  Según caché del reproductor  |
|         **Imágenes y WebP**        |       SÍ        |      SÍ       |      **SÍ**      |  **Disponible** (Expo Image)  |
|      **Configuración y Metas**     |       SÍ        |      SÍ       |        NO        |        **Disponible**        |
|        **Login / Registro**        |       SÍ        |      NO       |        NO        |        **No disponible**       |

---

## 2. Recorrido de la Información (Life of a Byte)

### A. Flujo de Perfil y Estados (Detección de Carrera)
1. **Inicio**: El móvil consulta Supabase.
2. **Caché**: Si no hay red, carga inmediatamente de `AsyncStorage`.
3. **Escritura**: Cualquier cambio local (ej. avanzar en el Reto Express) se guarda en `AsyncStorage` al instante.
4. **Sincronización**: Solo si detecta red y `isProfileLoaded` es `true`, el móvil envía el `UPDATE` a Supabase. Esto evita que una instalación limpia borre los datos de la nube.

### B. Estrategia ZeroEgress (Optimización de Costos y Velocidad)
Para evitar saturar Supabase con consultas repetitivas (`SELECT * FROM sessions`):
- **Capa 1 (Local)**: Los hooks de contenido mantienen una copia en memoria mientras la app está abierta.
- **Capa 2 (CDN/Cloudflare)**: Las peticiones a la API de Supabase pasan por una capa de caché en el "Edge". Si 1000 usuarios piden la misma lista de sesiones, Supabase solo responde 1 vez; las otras 999 se sirven desde el nodo de Cloudflare más cercano al usuario.
- **Capa 3 (Media)**: Todos los recursos pesados (.webp, .mp3) se sirven desde el Storage pero se "congelan" en la CDN.

### C. Manejo de Archivos y Binarios
- **Carga**: Las imágenes usan el componente `Expo Image` que gestiona un sistema de archivos local para no volver a descargar la misma imagen dos veces.
- **Ficheros Críticos**: El video de fondo del Login tiene un fallback local por si la descarga inicial falla o no hay conexión.

---

## 3. Prevención de Cuellos de Botella (Escalabilidad)

### Puntos de Riesgo Actuales
1. **Sobrecarga de Consultas en Home**: 
   - *Solución*: La Home solo pide `Analytics` y las sesiones recomendadas. No carga todo el catálogo de golpe.
2. **Lentitud por gran historial de logs**:
   - *Solución*: Implementar paginación o resúmenes (vistas) en Supabase para no descargar miles de registros de golpe en el perfil.
3. **Sincronización de Retos**:
   - *Solución*: El nuevo blindaje de `isProfileLoaded` asegura que la integridad de los datos sea prioridad sobre la velocidad de subida inicial.

---
*Documento de referencia para ingeniería - Paziify v2.52.2*
