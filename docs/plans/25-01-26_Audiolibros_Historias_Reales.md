# 📚 Plan de Implementación: Audiolibros + Historias Reales
**Fecha**: 25-26 de Enero de 2026  
**Versión**: 1.0  
**Estado**: Aprobado para Implementación

---

## Resumen Ejecutivo

Expansión de Paziify con dos nuevas secciones en la **Biblioteca**:

1. **📖 Audiolibros** (Audio - LibriVox)
   - 40+ títulos de dominio público
   - Organizados en 8 categorías de vida
   - Descarga directa de MP3

2. **🌟 Historias Reales** (Texto - Lectura)
   - 80 testimonios inspiradores
   - Mismas 8 categorías que audiolibros
   - Curados de Quora/Medium/Insight Timer

**Integración**: Ambas secciones accesibles desde nueva pantalla "Biblioteca" junto con las sesiones de meditación existentes.

---

## 📂 Catálogo de Contenido

### **8 Categorías Unificadas**

1. 😰 **Ansiedad y Manejo del Estrés**
2. 💼 **Éxito Profesional y Concentración**
3. 👨‍👩‍👧‍👦 **Familia y Crianza**
4. 🧒 **Niños y Adolescentes**
5. 😴 **Sueño y Descanso**
6. 💑 **Relaciones y Comunicación**
7. 💪 **Salud Física y Bienestar**
8. 🌱 **Crecimiento Personal y Propósito**

---

## 🗄️ Arquitectura de Base de Datos (Supabase)

### **Tabla: `audiobooks`**

```sql
CREATE TABLE audiobooks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  author TEXT NOT NULL,
  narrator TEXT DEFAULT 'LibriVox Volunteer',
  description TEXT,
  
  -- Clasificación
  category TEXT NOT NULL, -- 'anxiety', 'professional', 'family', 'children', 'sleep', 'relationships', 'health', 'growth'
  tags TEXT[],
  
  -- Audio
  audio_url TEXT NOT NULL, -- URL de Supabase Storage
  duration_minutes INTEGER,
  
  -- Metadata
  source TEXT DEFAULT 'librivox',
  librivox_id TEXT,
  language TEXT DEFAULT 'en',
  is_premium BOOLEAN DEFAULT false,
  is_featured BOOLEAN DEFAULT false,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para búsqueda rápida
CREATE INDEX idx_audiobooks_category ON audiobooks(category);
CREATE INDEX idx_audiobooks_tags ON audiobooks USING GIN(tags);
CREATE INDEX idx_audiobooks_featured ON audiobooks(is_featured) WHERE is_featured = true;

-- RLS: Todos pueden leer
ALTER TABLE audiobooks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Audiobooks son públicos" 
  ON audiobooks FOR SELECT 
  USING (true);
```

### **Tabla: `real_stories`**

```sql
CREATE TABLE real_stories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  subtitle TEXT,
  story_text TEXT NOT NULL, -- 300-500 palabras
  
  -- Personaje
  character_name TEXT,
  character_age INTEGER,
  character_role TEXT,
  
  -- Clasificación
  category TEXT NOT NULL,
  subcategory TEXT,
  tags TEXT[],
  
  -- Metadata
  reading_time_minutes INTEGER,
  transformation_theme TEXT,
  related_meditation_id TEXT, -- Link a session_id de sessionsData.ts
  
  -- Engagement
  is_featured BOOLEAN DEFAULT false,
  is_premium BOOLEAN DEFAULT false,
  
  -- Source
  source_platform TEXT, -- 'quora', 'medium', 'insight_timer'
  source_attribution TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices
CREATE INDEX idx_stories_category ON real_stories(category);
CREATE INDEX idx_stories_tags ON real_stories USING GIN(tags);
CREATE INDEX idx_stories_featured ON real_stories(is_featured) WHERE is_featured = true;

-- RLS: Todos pueden leer
ALTER TABLE real_stories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Historias son públicas" 
  ON real_stories FOR SELECT 
  USING (true);
```

### **Tabla: `user_favorites`**

```sql
CREATE TABLE user_favorites (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  content_type TEXT NOT NULL, -- 'audiobook' o 'story'
  content_id UUID NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(user_id, content_type, content_id)
);

-- RLS: Solo el usuario ve sus favoritos
ALTER TABLE user_favorites ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuarios gestionan sus favoritos" 
  ON user_favorites FOR ALL 
  USING (auth.uid() = user_id);
```

---

## 🎨 Componentes React Native

### **Nuevos Componentes a Crear**

#### **1. AudiobookCard.tsx**
```typescript
interface AudiobookCardProps {
  audiobook: Audiobook;
  onPress: () => void;
  isFavorite?: boolean;
}

// Diseño similar a SessionCard
// - Icono de libro
// - Título y autor
// - Duración
// - Categoría badge
// - Botón de favorito
```

#### **2. AudiobookPlayer.tsx**
```typescript
// Player de audio usando expo-av (actual) o expo-audio (futuro)
// Controles:
// - Play/Pause
// - Skip 15s adelante/atrás
// - Barra de progreso
// - Control de velocidad (0.75x, 1x, 1.25x, 1.5x)
```

#### **3. StoryCard.tsx**
```typescript
interface StoryCardProps {
  story: RealStory;
  onPress: () => void;
  isFavorite?: boolean;
}

// Tarjeta de lectura
// - Título y subtítulo
// - Personaje (nombre, edad, rol)
// - Tiempo de lectura
// - Categoría badge
// - Preview del texto (primeras 2 líneas)
```

#### **4. StoryDetailScreen.tsx**
```typescript
// Pantalla de lectura completa
// - Texto completo scrollable
// - Botón de favorito
// - Link a meditación relacionada
// - Compartir
```

---

## 📱 Navegación

### **Actualización de Tab Navigator**

```typescript
// src/navigation/MainNavigator.tsx

// Agregar nueva pantalla "Biblioteca"
<Tab.Screen 
  name="Library" 
  component={LibraryScreen}
  options={{
    tabBarIcon: ({ color }) => <Ionicons name="library" size={24} color={color} />,
    tabBarLabel: 'Biblioteca'
  }}
/>
```

### **LibraryScreen.tsx**

```
┌─────────────────────────────────────────┐
│  📚 Biblioteca                          │
├─────────────────────────────────────────┤
│                                         │
│  ┌─────────────────────────────────┐   │
│  │ 🧘 Sesiones de Meditación       │   │
│  │ 25 sesiones disponibles         │   │
│  │ [Ver Catálogo →]                │   │
│  └─────────────────────────────────┘   │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │ 📖 Audiolibros                  │   │
│  │ 40+ títulos de sabiduría        │   │
│  │ [Explorar →]                    │   │
│  └─────────────────────────────────┘   │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │ 🌟 Historias Reales             │   │
│  │ 80 testimonios inspiradores     │   │
│  │ [Leer →]                        │   │
│  └─────────────────────────────────┘   │
│                                         │
└─────────────────────────────────────────┘
```

---

## 🗓️ Roadmap de Implementación (4 semanas)

### **Semana 1: Infraestructura de Audiolibros**
- [ ] Crear tablas en Supabase (`audiobooks`, `user_favorites`)
- [ ] Configurar Supabase Storage bucket para MP3s
- [ ] Descargar 10 audiolibros de LibriVox (prueba inicial)
- [ ] Subir a Supabase Storage
- [ ] Insertar metadata en tabla `audiobooks`
- [ ] Crear componente `AudiobookCard`
- [ ] Crear pantalla `AudiobooksScreen` con categorías
- [ ] Implementar búsqueda y filtros

### **Semana 2: Player de Audio**
- [ ] Crear componente `AudiobookPlayer`
- [ ] Integrar con `expo-av` (actual sistema de audio)
- [ ] Implementar controles (play/pause, skip, velocidad)
- [ ] Guardar progreso de reproducción en AsyncStorage
- [ ] Sistema de favoritos (tabla `user_favorites`)
- [ ] Descargar y subir 30 audiolibros restantes

### **Semana 3: Historias Reales**
- [ ] Crear tabla `real_stories`
- [ ] Curar 80 historias de Quora/Medium/Insight Timer
- [ ] Parafrasear y adaptar (300-500 palabras cada una)
- [ ] Insertar en base de datos con categorización
- [ ] Crear componente `StoryCard`
- [ ] Crear pantalla `StoriesScreen` con categorías
- [ ] Crear pantalla `StoryDetailScreen`
- [ ] Sistema de búsqueda y filtros

### **Semana 4: Integración y Pulido**
- [ ] Crear pantalla `LibraryScreen` (hub principal)
- [ ] Actualizar navegación principal
- [ ] Sistema unificado de favoritos
- [ ] Enlazar historias con meditaciones relacionadas
- [ ] UI/UX premium (glassmorphism, animaciones)
- [ ] Testing exhaustivo
- [ ] Actualizar documentación

---

## 🎯 Estrategia Freemium

### **Contenido Gratuito**
- ✅ **Meditaciones**: Todas las sesiones gratuitas actuales
- ✅ **Audiolibros**: 15 títulos (2 por categoría)
- ✅ **Historias**: 40 historias (5 por categoría)

### **Contenido Premium (Plus)**
- ⭐ **Meditaciones**: Todas las sesiones premium
- ⭐ **Audiolibros**: 40+ títulos completos
- ⭐ **Historias**: 80 historias completas
- ⭐ **Features**:
  - Favoritos ilimitados
  - Descarga offline de audiolibros
  - Control de velocidad de reproducción
  - Sin límite de lectura

---

## 💰 Costos Estimados

### **Infraestructura**
- **Supabase Storage**: $0 (plan gratuito hasta 1GB) → $25/mes (100GB si escalamos)
- **Audiolibros LibriVox**: $0 (dominio público)
- **Curación de Historias**: $0 (trabajo interno)

### **Total**
- **Fase MVP**: $0/mes
- **Producción Escalada**: $25/mes (solo si superamos 1GB de storage)

---

## 🔧 Consideraciones Técnicas

### **Compatibilidad con Sistema Actual**

1. **Audio Engine**: 
   - Usar `expo-av` (actual)
   - ⚠️ Planificar migración a `expo-audio` antes de SDK 54

2. **Navegación**:
   - Integrar con `MainNavigator.tsx` existente
   - Mantener patrón de Stack Navigator

3. **Estilos**:
   - Usar sistema de diseño actual (glassmorphism, blur)
   - Componentes con `Animated` API nativo (no Reanimated)

4. **Seguridad**:
   - Todas las tablas con RLS activado
   - Políticas usando `auth.uid()`
   - Relaciones con `ON DELETE CASCADE`

5. **Estado Global**:
   - Integrar con `AppContext` existente
   - Sincronizar favoritos con `userState`

---

## 📊 Métricas de Éxito

### **KPIs a Monitorear**

1. **Engagement**:
   - % usuarios que acceden a Biblioteca
   - Tiempo promedio de escucha de audiolibros
   - Número de historias leídas por usuario
   - Tasa de completación de audiolibros

2. **Conversión Premium**:
   - % usuarios que actualizan tras consumir contenido gratuito
   - Contenido más popular que impulsa conversión

3. **Retención**:
   - Usuarios que regresan para más contenido
   - Sesiones diarias con contenido mixto (meditación + audio + lectura)

4. **Favoritos**:
   - Promedio de favoritos por usuario
   - Contenido más guardado

---

## ✅ Checklist de Aprobación

- [x] Arquitectura de base de datos definida
- [x] Catálogo de contenido curado (40 audiolibros + 80 historias)
- [x] Componentes React Native diseñados
- [x] Navegación planificada
- [x] Estrategia freemium definida
- [x] Roadmap de 4 semanas establecido
- [x] Compatibilidad con sistema actual verificada
- [ ] **Pendiente**: Aprobación del usuario para iniciar implementación

---

## 🚀 Próximos Pasos Inmediatos

1. **Crear migraciones SQL** en Supabase
2. **Configurar Storage bucket** para MP3s
3. **Descargar primeros 10 audiolibros** de LibriVox
4. **Crear componente AudiobookCard** siguiendo patrón de SessionCard

---

*Última actualización: 25 de Enero de 2026*  
*Autor: CTO - Paziify*  
*Estado: Listo para Implementación*
