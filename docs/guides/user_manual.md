# 📖 Guía de Funcionalidad - Manual de Usuario (v1.0.0 Native) 💎

Bienvenido a la guía oficial de **Paziify Native**. Esta versión migrada a React Native (Expo) ofrece una experiencia premium de bienestar mental.

---

## 1. Onboarding y "Wellness OS"
**Pantalla:** `RegisterScreen` -> `NotificationSettings`
- **Registro Inteligente**: Introduce tu nombre para que **G.G. Assistant** personalice tu experiencia.
- **Configuración de Notificaciones**: Diseño intuitivo para gestionar tus recordatorios de mañana y noche.
- **Zona de Calma**: Configura tus horas de silencio para proteger tu descanso.

---

## 2. El Panel de Control Adaptativo (Home)
**Pantalla:** `HomeScreen`
La pantalla principal ya no es estática; es un reflejo de tu estado:
- **Estados Contextuales**: 
    - **Día**: Enfoque solar y energía.
    - **Noche Proactiva**: Colores índigo y sugerencias de sueño (se activa tras las 21:00).
    - **Recuperación**: Si pierdes un día, G.G. Assistant te ofrecerá una sesión corta para retomar el hábito.
    - **Día Cumplido**: Celebración visual tras completar tu dosis diaria de resiliencia.
- **Simuladores (Dev Only)**: Al final de la pantalla verás botones para alternar estos estados y probar la respuesta del sistema.

---

## 3. Temporizador Inmersivo y Biblioteca Expandida
**Pantalla:** `BreathingTimer` -> `LibraryScreen`
Hemos rediseñado el núcleo de la meditación para una máxima inmersión:
- **Biblioteca de Élite (+25 Sesiones)**: 
    - **S.O.S. Pánico**: Intervención de 2 min para crisis.
    - **NSDR & Yoga Nidra**: Recuperación profunda sin sueño R.E.M.
    - **Espresso Mental**: Activación rápida para la jornada.
- **Voz Ultra-Zen (0.30 Rate)**: Locuciones minimalistas ("Inhala", "Mantén el aire") con un tempo ultra-lento diseñado para estados de relajación profunda.
- **Mezclador de Sonido (Mixer)**:
    - **Ondas Binaurales (Plus)**: Sincronización cerebral para foco o relax.
    - **Lluvia (Plus)**: Ambiente natural relajante.
    - **Campanas Tibetanas (Plus)**: Enfoque meditativo tradicional.
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

- [ ] ¿El temporizador marca el tiempo exacto de la sesión elegida (ej. 4 min para Respiración Cuadrada)?
- [ ] ¿La voz suena con el nuevo ritmo ultra-pausado (0.30)?
- [ ] ¿Aparece la opción "¿Compartimos la experiencia?" tras completar una sesión con cara feliz?
- [ ] ¿El Home cambia de estado al pulsar los botones de simulación?
- [ ] ¿Aparece el candado en los sonidos del Mezclador si eres usuario gratuito?
- [ ] ¿La pantalla de Paywall muestra la tabla comparativa correctamente?
- [ ] ¿Se actualiza el gráfico de barras tras completar una sesión?
- [ ] ¿Las lecciones de la Academia aparecen con check ✅ tras marcarlas como leídas?

---
*Última actualización de la guía: 23 de Enero de 2026 - Fase: Comunidad y Contenido Masivo*
