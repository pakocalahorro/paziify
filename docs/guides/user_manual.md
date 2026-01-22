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

## 3. Temporizador Inmersivo y Mezclador Premium
**Pantalla:** `BreathingTimer`
Hemos rediseñado el núcleo de la meditación para una máxima inmersión:
- **Mezclador de Sonido (Mixer)**:
    - **Ondas Binaurales (Plus)**: Sincronización cerebral para foco o relax.
    - **Lluvia (Plus)**: Ambiente natural relajante.
    - **Campanas Tibetanas (Plus)**: Enfoque meditativo tradicional.
- **Lógica de Bloqueo**: Las funciones avanzadas muestran un candado para usuarios gratuitos, redirigiendo al Paywall de forma fluida.
- **Orbe de Respiración**: Guía visual fluida que coordina tus inhalaciones y exhalaciones.

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

## 6. Comunidad de Apoyo
**Pantalla:** `CommunityScreen`
- **Muro Social**: Comparte y recibe apoyo.
- **"Dar Paz" 🍃**: Refuerzo positivo recíproco para mantener la motivación comunitaria.

---

## 🚀 Checklist para testers:
- [ ] ¿El Home cambia de estado al pulsar los botones de simulación?
- [ ] ¿Aparece el candado en los sonidos del Mezclador si eres usuario gratuito?
- [ ] ¿La pantalla de Paywall muestra la tabla comparativa correctamente?
- [ ] ¿Se actualiza el gráfico de barras tras completar una sesión?
- [ ] ¿Las lecciones de la Academia aparecen con check ✅ tras marcarlas como leídas?

---
*Última actualización de la guía: 22 de Enero de 2026 - Sprint de Migración Nativa*
