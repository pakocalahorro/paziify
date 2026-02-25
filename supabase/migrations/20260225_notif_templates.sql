-- 1. Crear la tabla de plantillas de notificaciones
CREATE TABLE IF NOT EXISTS public.notification_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category TEXT NOT NULL CHECK (category IN ('behavioral', 'editorial')),
    type TEXT NOT NULL UNIQUE,
    title TEXT NOT NULL,
    body TEXT NOT NULL,
    is_active BOOLEAN DEFAULT true,
    scheduled_at TIMESTAMPTZ,
    sent_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Habilitar RLS
ALTER TABLE public.notification_templates ENABLE ROW LEVEL SECURITY;

-- 3. Políticas básicas (Lectura para todos, Escritura solo para autenticados/admin)
CREATE POLICY "Templates are viewable by everyone" ON public.notification_templates
    FOR SELECT USING (true);

CREATE POLICY "Templates are manageable by authenticated users" ON public.notification_templates
    FOR ALL USING (auth.role() = 'authenticated');

-- 4. Seed de las 25 plantillas iniciales
INSERT INTO public.notification_templates (category, type, title, body)
VALUES 
-- BEHAVIORAL: Rachas
('behavioral', 'streak_0', '¿Hoy empezamos? 🌱', '5 minutos son suficientes para empezar, {name}. Cada gran paso comienza con un pequeño respiro.'),
('behavioral', 'streak_1', 'Buen inicio 🌿', 'Segundo día consecutivo. El hábito de la paz se está formando en ti.'),
('behavioral', 'streak_3', 'Racha de {streak} días 🔥', '¡Vas con todo! No rompas tu racha hoy, tu mente te lo agradecerá.'),
('behavioral', 'streak_7', 'Una semana de Calma 💚', '7 días sin fallar. Ya no eres un principiante, eres un practicante constante.'),
('behavioral', 'streak_14', '{streak} días de disciplina 🌟', 'Dos semanas de constancia. Estás en el top 5% de usuarios más disciplinados.'),
('behavioral', 'streak_30', 'Eres imparable 🏆', '{streak} días de racha. Has integrado la paz en tu propia biología, {name}.'),

-- BEHAVIORAL: Alertas
('behavioral', 'streak_danger', '🔥 Racha en peligro', 'Tu racha de {streak} días termina en poco tiempo. ¿Dedicamos 5 minutos ahora?'),
('behavioral', 'streak_broken', 'Mañana es un nuevo inicio ☀️', 'Has perdido tu racha, pero no tu progreso interno. Vuelve a empezar hoy.'),

-- BEHAVIORAL: Rutinas
('behavioral', 'morning', 'Buenos días, {name} ☀️', 'Empieza tu día con claridad mental. Tu sesión matutina te espera.'),
('behavioral', 'night', 'Termina el día en paz 🌙', 'Suelta las tensiones del día. Tu descanso será más profundo tras meditar.'),

-- BEHAVIORAL: Hitos
('behavioral', 'milestone_first', '¡Tu primera piedra! 💎', 'Acabas de completar tu primera sesión. El camino hacia la paz ha comenzado.'),
('behavioral', 'milestone_week', '7 días de evolución 📈', 'Has meditado los últimos 7 días. Tu constancia es admirable.'),
('behavioral', 'milestone_month', '30 días de transformación ✨', 'Un mes entero dedicando tiempo a tu interior. Nota la diferencia en tu paz.'),
('behavioral', 'milestone_hours', '¡Primera hora meditada! ⏱️', 'Has acumulado 60 minutos de presencia total. Tu cerebro te lo agradece.'),
('behavioral', 'milestone_challenge', '¡Reto Completado! 🏆', 'Misión cumplida. Has demostrado una disciplina excepcional en este reto.'),

-- BEHAVIORAL: Recordatorios Inteligentes
('behavioral', 'scan_reminder', '¿Cómo está tu corazón? 💓', 'Llevas 3 días sin hacer un Cardio Scan. Tómate 1 minuto para ver tu equilibrio.'),
('behavioral', 'weekly_report', 'Tu Reporte Semanal 📊', 'Ya puedes ver el análisis de tu bio-ritmo y evolución de esta semana.'),

-- EDITORIAL: Campañas (Ejemplos iniciales)
('editorial', 'seasonal', 'Bienvenido al Invierno ❄️', 'Días cortos, meditación profunda. Mantén tu calidez interna con Paziify.'),
('editorial', 'new_content', 'Nueva sesión disponible 🆕', 'Hemos añadido contenido fresco para tu práctica. ¡Descúbrelo ahora!'),
('editorial', 'new_feature', 'Algo nuevo en Paziify ✨', 'Descubre las mejoras que hemos implementado para tu bienestar.'),
('editorial', 'reengagement_soft', 'Te echamos de menos 🌿', 'Paziify no es lo mismo sin tu presencia. ¿Volvemos hoy?'),
('editorial', 'reengagement_strong', 'Tu rincón de paz te espera 🛋️', 'Llevas tiempo desconectado. 2 minutos son suficientes para reconectar.'),
('editorial', 'promotion', 'Regala(te) Paz 🎁', 'Descubre nuestras opciones premium para llevar tu práctica al siguiente nivel.'),
('editorial', 'event', 'Sesión en Directo 🔴', 'Únete a nuestra sesión comunitaria hoy. Juntos vibramos más alto.'),
('editorial', 'announcement', 'Comunicado Importante 📢', 'Tenemos noticias frescas sobre el futuro de Paziify. Entra para leer más.');
