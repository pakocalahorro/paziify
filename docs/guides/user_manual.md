# 📖 Guía de Funcionalidad - Manual de Usuario (v1.1.0 Stable) 💎

Bienvenido a la guía oficial de **Paziify Stable**. Esta versión ofrece una experiencia visual premium y cinemática optimizada para máxima estabilidad.

---

## 1. Onboarding Zen (Acceso Flexible) 🚪
**Pantalla:** `WelcomeScreen` -> `RegisterScreen` / `LoginScreen`
Paziify prioriza tu entrada al bienestar. Ahora tienes dos caminos:
- **Continuar con Google**: Acceso instantáneo y seguro. Tu progreso se sincronizará automáticamente con la nube.
- **Explorar como Invitado**: Acceso directo sin registros. Ideal para probar la experiencia. Solo necesitas introducir tu nombre para que **G.G. Assistant** te salude.

---

## 2. El Santuario Empático (Experiencia Inicial) ✨
**Pantalla:** `CompassScreen` -> `ManifestoScreen`
Antes de entrar al panel principal, Paziify te invita a un momento de introspección:
- **La Brújula**: Elige entre dos orbes de energía viva.
    - **Sanar**: Enfocado en la paz, la calma y la liberación de estrés.
    - **Crecer**: Enfocado en la energía, el foco y el potencial personal.
- **El Manifiesto**: Una revelación cinemática de texto sobre una nebulosa cósmica que te sumerge en el estado mental adecuado para tu sesión.

---

## 3. Modo Invitado (Ghost Mode) 👻
**Estado:** Activo si eliges "Explorar como invitado"
Para una privacidad total y cero fricción:
- **Sin Huella**: No se guarda ningún dato en la memoria permanente del teléfono (`AsyncStorage`).
- **Efímero**: Si cierras la aplicación, tu racha y progreso de ese día desaparecerán.
- **Persuasión Amable**: Verás un **GuestBanner** en la parte superior que te recordará el beneficio de registrarte para asegurar tu progreso. Puedes convertir tu cuenta a Google en cualquier momento desde el Home o el Perfil.

---

## 4. El Panel de Control Adaptativo (Home)
**Pantalla:** `HomeScreen`
La pantalla principal es un reflejo de tu estado y tu intención elegida:
- **Flotabilidad Visual**: Toda la interfaz flota sobre una **nebulosa inmersiva** que respira contigo.
- **Efecto Cristal (Glassmorphism)**: Las tarjetas y menús tienen un acabado de cristal esmerilado nativo para una lectura clara y elegante.
- **Estados Contextuales**: 
    - **Día/Noche**: Adaptación de colores y sugerencias según la hora.
    - **Intención (Sanar/Crecer)**: El fondo y la atmósfera cambian según tu elección en la Brújula.

---

## 3. Temporizador Inmersivo y Biblioteca Expandida
**Pantalla:** `BreathingTimer` -> `LibraryScreen`
Hemos rediseñado el núcleo de la meditación para una máxima inmersión:
- **Biblioteca de Élite (+25 Sesiones)**: 
    - **S.O.S. Pánico**: Intervención de 2-3 min para crisis de ansiedad.
    - **Sueño Profundo**: Yoga Nidra, NSDR Extendido y Escaneo Corporal para insomnio.
    - **Enfoque y Mañana**: Alerta Stanford y Espresso Mental para activar el foco.
    - **Resiliencia**: Coherencia Cardíaca Avanzada para regular el sistema nervioso.
- **Voz Ultra-Zen (0.30 Rate)**: Locuciones en plural rítmico ("Inhalamos", "Mantenemos") con un tempo ultra-lento diseñado para estados de relajación theta y delta.
- **Mezclador de Sonido (Mixer)**:
    - **Ondas Binaurales (Plus)**: Sincronización cerebral para foco o relax.
    - **Lluvia (Plus)**: Ambiente natural relajante.
    - **Campanas Tibetanas (Plus)**: Enfoque meditativo tradicional.
- **Feedback Sensorial**:
    - **Aura de Latido**: Animación pulsante sincronizada con el estado de ánimo.
    - **Háptica Paziify**: Siente una vibración sutil al cambiar de fase (inhala/exhala) o al completar objetivos.
- **Precisión Total**: Temporizador sincronizado al segundo con la duración real de cada técnica (4-7-8, Respire 4s, etc.).

---

## 4. Academia TCC e Interactividad
**Pantalla:** `CBTAcademyScreen` -> `CBTDetailScreen`
- **Lectura Markdown**: Contenido educativo con formato rico (negritas, citas, listas) perfectamente legible.
- **Progreso Real**: Al completar una lección, tu barra de progreso se actualiza y ganas **+5 puntos de resiliencia**.

---

## 5. Perfil, Analítica y Paziify Plus
**Pantalla:** `ProfileScreen` -> `WeeklyReportScreen` / `PaywallScreen`
- **Dashboards de Datos**:
    - **Línea de Bienestar**: Gráfico de tendencia mensual.
    - **Minutos por Día**: Histograma de actividad semanal.
- **Insignias**: Logros visuales que se desbloquean con tu progreso.
- **Suscripción Plus**: Accede a la comparativa de planes desde el botón dorado en el Perfil para desbloquear el mezclador y las métricas avanzadas.

---

## 6. Comunidad y Feedback Social
**Pantalla:** `CommunityScreen` -> `SessionEndScreen`
- **¿Compartimos la experiencia?**: Al finalizar una sesión con ánimo positivo, podrás activar un check para publicar tu reflexión en la comunidad.
- **Muro Social**: Visualiza el apoyo de otros usuarios y sus reflexiones en tiempo real.
- **"Dar Paz" 🍃**: Refuerzo positivo recíproco para mantener la motivación comunitaria.

---

- [x] ¿El temporizador marca el tiempo exacto de la sesión elegida?
- [x] ¿La voz suena con el nuevo ritmo rítmico plural ("Inhalamos...") y tempo 0.30?
- [x] ¿Aparece la opción "¿Compartimos la experiencia?" tras completar una sesión?
- [x] ¿Funciona el acceso como Invitado sin pedir registro?
- [x] ¿El Home muestra el banner de advertencia si eres invitado?
- [ ] ¿Se guardan los datos en Supabase tras loguearse con Google? (Pendiente configuración final).

---
*Última actualización de la guía: 23 de Enero de 2026 - Fase: Infraestructura y Onboarding Híbrido*
