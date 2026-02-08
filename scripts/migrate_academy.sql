BEGIN;
-- 1. Insert Modules
INSERT INTO public.academy_modules (id, title, description, icon, category, author, duration, image_url, is_published)
            VALUES ('anxiety', 'Domina tu Ansiedad', 'Curso Piloto: 5 días para cambiar tu relación con el miedo.', 'rainy-outline', 'anxiety', 'Dra. Aria', '5 Días', 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400&q=80', true)
            ON CONFLICT (id) DO UPDATE SET 
            title = EXCLUDED.title, 
            description = EXCLUDED.description,
            author = EXCLUDED.author;
INSERT INTO public.academy_modules (id, title, description, icon, category, author, duration, image_url, is_published)
            VALUES ('basics_intro', 'Fundamentos TCC', 'Tu kit de inicio. Entiende cómo tus pensamientos crean tu realidad.', 'book-outline', 'basics', 'Dr. Ziro', '4 Lecciones', 'https://images.unsplash.com/photo-1454165833744-96e6cf582bb1?w=400&q=80', true)
            ON CONFLICT (id) DO UPDATE SET 
            title = EXCLUDED.title, 
            description = EXCLUDED.description,
            author = EXCLUDED.author;
INSERT INTO public.academy_modules (id, title, description, icon, category, author, duration, image_url, is_published)
            VALUES ('self_esteem', 'Autoestima de Acero', 'Deja de ser tu peor crítico. Construye una confianza inquebrantable.', 'flash-outline', 'growth', 'Dra. Aria', '6 Lecciones', 'https://images.unsplash.com/photo-1499728603263-137cb7ab3e1f?w=400&q=80', true)
            ON CONFLICT (id) DO UPDATE SET 
            title = EXCLUDED.title, 
            description = EXCLUDED.description,
            author = EXCLUDED.author;
INSERT INTO public.academy_modules (id, title, description, icon, category, author, duration, image_url, is_published)
            VALUES ('grief', 'Superando el Duelo', 'Navega las olas de la tristeza y encuentra luz tras la tormenta.', 'heart-outline', 'growth', 'Dra. Aria', '5 Lecciones', 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?w=400&q=80', true)
            ON CONFLICT (id) DO UPDATE SET 
            title = EXCLUDED.title, 
            description = EXCLUDED.description,
            author = EXCLUDED.author;
INSERT INTO public.academy_modules (id, title, description, icon, category, author, duration, image_url, is_published)
            VALUES ('insomnia', 'Adiós al Insomnio', 'Higiene del sueño y técnicas cognitivas para descansar de verdad.', 'moon-outline', 'sleep', 'Dr. Ziro', '7 Días', 'https://images.unsplash.com/photo-1511296183654-10129df48a55?w=400&q=80', true)
            ON CONFLICT (id) DO UPDATE SET 
            title = EXCLUDED.title, 
            description = EXCLUDED.description,
            author = EXCLUDED.author;
INSERT INTO public.academy_modules (id, title, description, icon, category, author, duration, image_url, is_published)
            VALUES ('burnout', 'Burnout: Apaga el Incendio', 'Para cuando el trabajo te consume. Recupera tu energía y límites.', 'flame-outline', 'professional', 'Coach Marco', '5 Lecciones', 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=400&q=80', true)
            ON CONFLICT (id) DO UPDATE SET 
            title = EXCLUDED.title, 
            description = EXCLUDED.description,
            author = EXCLUDED.author;
INSERT INTO public.academy_modules (id, title, description, icon, category, author, duration, image_url, is_published)
            VALUES ('leadership', 'Liderazgo Consciente', 'Aprende a liderar sin imponer. Comunicación asertiva y empatía.', 'briefcase-outline', 'professional', 'Coach Marco', '6 Lecciones', 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=400&q=80', true)
            ON CONFLICT (id) DO UPDATE SET 
            title = EXCLUDED.title, 
            description = EXCLUDED.description,
            author = EXCLUDED.author;
INSERT INTO public.academy_modules (id, title, description, icon, category, author, duration, image_url, is_published)
            VALUES ('parenting', 'Crianza Consciente', 'Gestiona tus propias emociones para educar con calma y amor.', 'people-outline', 'family', 'Dra. Elena', '8 Lecciones', 'https://images.unsplash.com/photo-1591035897819-f4bdf739f446?w=400&q=80', true)
            ON CONFLICT (id) DO UPDATE SET 
            title = EXCLUDED.title, 
            description = EXCLUDED.description,
            author = EXCLUDED.author;
INSERT INTO public.academy_modules (id, title, description, icon, category, author, duration, image_url, is_published)
            VALUES ('kids_mindfulness', 'Mindfulness para Niños', 'Aventuras cortas para que los peques aprendan a calmarse.', 'balloon-outline', 'family', 'Paziify Kids', '10 Minijuegos', 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=400&q=80', true)
            ON CONFLICT (id) DO UPDATE SET 
            title = EXCLUDED.title, 
            description = EXCLUDED.description,
            author = EXCLUDED.author;
INSERT INTO public.academy_modules (id, title, description, icon, category, author, duration, image_url, is_published)
            VALUES ('teens_cbt', 'TCC para Adolescentes', 'Hackea tu mente: Guía de supervivencia para el caos emocional.', 'headset-outline', 'family', 'Coach Joven', '6 Lecciones', 'https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?w=400&q=80', true)
            ON CONFLICT (id) DO UPDATE SET 
            title = EXCLUDED.title, 
            description = EXCLUDED.description,
            author = EXCLUDED.author;

-- 2. Insert Lessons
INSERT INTO public.academy_lessons (id, module_id, title, description, duration, is_premium, content, audio_url, order_index)
        VALUES ('anxiety-1', 'anxiety', 'Día 1: La Falsa Alarma', 'Entiende por qué sientes lo que sientes. La neurociencia del miedo.', '10 min', false, '
# Día 1: La Falsa Alarma 🚨

**Bienvenido/a al curso.** Hoy empezamos por lo básico: entender a tu "enemigo".

## ¿Por qué tengo ansiedad?
No es porque estés "roto". Es porque funcionas **demasiado bien**.
Tu cerebro tiene una alarma de incendios llamada **amígdala**. Su trabajo es detectar tigres.

El problema es que hoy no hay tigres. Hay emails, facturas y opiniones ajenas.
Pero tu amígdala no sabe la diferencia.

> "La ansiedad es una señal de protección mal calibrada."

## Ejercicio de hoy: Etiquetado
Cuando sientas el nudo en el estómago, di en voz alta (o mentalmente):
**"Esto es una Falsa Alarma. Gracias, cerebro, pero estoy a salvo."**
        ', 'https://ueuxjtyottluwkvdreqe.supabase.co/storage/v1/object/public/academy-voices/anxiety-1.mp3', 0)
        ON CONFLICT (id) DO UPDATE SET
        content = EXCLUDED.content,
        audio_url = EXCLUDED.audio_url,
        title = EXCLUDED.title;
INSERT INTO public.academy_lessons (id, module_id, title, description, duration, is_premium, content, audio_url, order_index)
        VALUES ('anxiety-2', 'anxiety', 'Día 2: El Ciclo del Pensamiento', 'Tus pensamientos no son hechos. Son hipótesis.', '12 min', false, '
# Día 2: El Triángulo Cognitivo 🔺

La TCC nos enseña que no son las situaciones las que nos duelen, sino lo que **pensamos** sobre ellas.

## El Bucle
1. **Situación**: Tu jefe te mira serio.
2. **Pensamiento**: "Me va a despedir".
3. **Emoción**: Pánico.
4. **Acción**: Te escondes o trabajas con miedo.

Si cambias el paso 2 ("Quizás tuvo una mala noche"), el paso 3 cambia automáticamente (Compasión).

## Tarea
Sé un **Detective**. Atrapa un pensamiento catastrófico hoy y pregúntale:
*"¿Tengo pruebas reales de esto ante un tribunal?"*
        ', 'https://ueuxjtyottluwkvdreqe.supabase.co/storage/v1/object/public/academy-voices/anxiety-2.mp3', 1)
        ON CONFLICT (id) DO UPDATE SET
        content = EXCLUDED.content,
        audio_url = EXCLUDED.audio_url,
        title = EXCLUDED.title;
INSERT INTO public.academy_lessons (id, module_id, title, description, duration, is_premium, content, audio_url, order_index)
        VALUES ('anxiety-3', 'anxiety', 'Día 3: Surfeando la Ola', 'Aprende a no luchar contra la sensación física.', '8 min', true, '
# Día 3: El Efecto del Oso Blanco 🐻‍❄️

Si te digo **"No pienses en un oso blanco"**, ¿en qué piensas?

Luchar contra la ansiedad ("¡No quiero sentir esto!") solo le da más fuerza. Le confirma a tu cerebro que ES un peligro.

## La Alternativa: Surfear 🏄
Imagina que la ansiedad es una ola.
- Si te pones rígido, te revuelca.
- Si te relajas y la observas, pasará por debajo de ti.

**Acéptala.** Di "Sí, siento ansiedad. Y está bien. Es solo energía atravesando mi cuerpo".
        ', 'https://ueuxjtyottluwkvdreqe.supabase.co/storage/v1/object/public/academy-voices/anxiety-3.mp3', 2)
        ON CONFLICT (id) DO UPDATE SET
        content = EXCLUDED.content,
        audio_url = EXCLUDED.audio_url,
        title = EXCLUDED.title;
INSERT INTO public.academy_lessons (id, module_id, title, description, duration, is_premium, content, audio_url, order_index)
        VALUES ('anxiety-4', 'anxiety', 'Día 4: La Pausa Sagrada', 'Entre el estímulo y la respuesta, hay un espacio.', '9 min', true, '
# Día 4: Tu Superpoder Oculto ⏸️

Viktor Frankl sobrevivió al horror nazi descubriendo esto:
> "Entre el estímulo y la respuesta hay un espacio. En ese espacio está nuestra libertad."

La ansiedad nos roba ese espacio. Nos hace reactivos.

## Técnica S.T.O.P. 🛑
Cuando el mundo se acelere:
- **S**top (Para).
- **T**ake a breath (Respira).
- **O**bserve (Observa qué sientes).
- **P**roceed (Procede con intención).

Ensancha tu espacio. Recupera tu libertad.
        ', 'https://ueuxjtyottluwkvdreqe.supabase.co/storage/v1/object/public/academy-voices/anxiety-4.mp3', 3)
        ON CONFLICT (id) DO UPDATE SET
        content = EXCLUDED.content,
        audio_url = EXCLUDED.audio_url,
        title = EXCLUDED.title;
INSERT INTO public.academy_lessons (id, module_id, title, description, duration, is_premium, content, audio_url, order_index)
        VALUES ('anxiety-5', 'anxiety', 'Día 5: Tu Caja de Herramientas', 'Plan de crisis y graduación.', '11 min', true, '
# Día 5: Plan de Crisis 🧰

La ansiedad volverá. Y eso no es un fracaso. Es la vida.
La diferencia es que ahora ya no estás indefenso/a.

## Tu Protocolo de Emergencia
1. **Etiqueta**: "Falsa Alarma".
2. **Cuestiona**: "¿Es un hecho o una historia?".
3. **Acepta**: Surfea la ola física.
4. **Pausa**: Usa S.T.O.P. antes de actuar.

¡Felicidades! Has completado el curso piloto. 
Estás listo/a para tu **Examen Final**.
        ', 'https://ueuxjtyottluwkvdreqe.supabase.co/storage/v1/object/public/academy-voices/anxiety-5.mp3', 4)
        ON CONFLICT (id) DO UPDATE SET
        content = EXCLUDED.content,
        audio_url = EXCLUDED.audio_url,
        title = EXCLUDED.title;
INSERT INTO public.academy_lessons (id, module_id, title, description, duration, is_premium, content, audio_url, order_index)
        VALUES ('basics-1', 'basics_intro', 'Lección 1: ¿Qué es la realidad?', 'El modelo cognitivo.', '5 min', false, '
# 🧠 ¿Qué es la Realidad?

## Las gafas con las que miras
Imagina que llevas unas gafas de sol azules. Todo lo que veas será azul. ¿Significa que el mundo ES azul? No. 

La TCC (Terapia Cognitivo Conductual) dice que no sufrimos por lo que nos pasa, sino por cómo **INTERPRETAMOS** lo que nos pasa.

### El Filtro Mental
Cada uno tiene sus propias gafas (creencias). 
- Si crees que "nadie te quiere", verás rechazo en cada mirada.
- Si crees que "eres capaz", verás oportunidades en los problemas.

**Tu tarea hoy:**
Empieza a cuestionar tus gafas. ¿Es la realidad, o es mi filtro?
', 'https://ueuxjtyottluwkvdreqe.supabase.co/storage/v1/object/public/academy-voices/basics-1.mp3', 5)
        ON CONFLICT (id) DO UPDATE SET
        content = EXCLUDED.content,
        audio_url = EXCLUDED.audio_url,
        title = EXCLUDED.title;
INSERT INTO public.academy_lessons (id, module_id, title, description, duration, is_premium, content, audio_url, order_index)
        VALUES ('basics-2', 'basics_intro', 'Lección 2: Pensamiento vs Hecho', 'Cómo distinguirlos.', '6 min', false, '
# 🕵️ Pensamiento vs. Hecho

A menudo confundimos nuestras opiniones con verdades absolutas.

* **Hecho:** "Mi amigo no me saludó." (Es objetivo, una cámara lo grabaría igual).
* **Pensamiento:** "Mi amigo está enfadado conmigo." (Es una hipótesis, una interpretación).

La ansiedad y la tristeza suelen venir de **tomar nuestros pensamientos como hechos**.

**Ejercicio:**
Escribe 3 cosas que te preocupan hoy. Luego marca cuáles son Hechos y cuáles son Pensamientos. Te sorprenderá.
', 'https://ueuxjtyottluwkvdreqe.supabase.co/storage/v1/object/public/academy-voices/basics-2.mp3', 6)
        ON CONFLICT (id) DO UPDATE SET
        content = EXCLUDED.content,
        audio_url = EXCLUDED.audio_url,
        title = EXCLUDED.title;
INSERT INTO public.academy_lessons (id, module_id, title, description, duration, is_premium, content, audio_url, order_index)
        VALUES ('basics-3', 'basics_intro', 'Lección 3: Emociones Básicas', 'El lenguaje de tu cuerpo.', '5 min', true, '
# 💓 El Lenguaje del Cuerpo

Las emociones no son "malas". Son mensajeros químicos con una función vital:

* **Miedo:** "¡Peligro! Protégete."
* **Ira:** "¡Injusticia! Defiende tus límites."
* **Tristeza:** "¡Pérdida! Refúgiate y sana."
* **Alegría:** "¡Esto es bueno! Repítelo."

No intentes matar al mensajero. Escucha el mensaje y la emoción se suavizará. 
', 'https://ueuxjtyottluwkvdreqe.supabase.co/storage/v1/object/public/academy-voices/basics-3.mp3', 7)
        ON CONFLICT (id) DO UPDATE SET
        content = EXCLUDED.content,
        audio_url = EXCLUDED.audio_url,
        title = EXCLUDED.title;
INSERT INTO public.academy_lessons (id, module_id, title, description, duration, is_premium, content, audio_url, order_index)
        VALUES ('basics-4', 'basics_intro', 'Lección 4: Conducta y Consecuencia', 'Rompiendo patrones.', '7 min', true, '
# 🔄 Rompiendo el Bucle

Lo que piensas afecta a lo que sientes.
Lo que sientes afecta a lo que **HACES**.

Si piensas "Voy a fallar", sientes miedo.
Si sientes miedo, **evitas** la situación.
Al evitarla, **confirmas** que era peligrosa. ¡Alerta de Bucle!

Para cambiar tu vida, a veces tienes que cambiar la Conducta (hacerlo con miedo) para demostrarle a tu cerebro que tu Pensamiento estaba equivocado.
', 'https://ueuxjtyottluwkvdreqe.supabase.co/storage/v1/object/public/academy-voices/basics-4.mp3', 8)
        ON CONFLICT (id) DO UPDATE SET
        content = EXCLUDED.content,
        audio_url = EXCLUDED.audio_url,
        title = EXCLUDED.title;
INSERT INTO public.academy_lessons (id, module_id, title, description, duration, is_premium, content, audio_url, order_index)
        VALUES ('esteem-1', 'self_esteem', 'Lección 1: El Crítico Interior', 'Identificando el sabotaje.', '8 min', false, '
# 👹 El Crítico Interior

Todos tenemos una voz que nos dice:
- "No eres suficiente."
- "Vas a hacer el ridículo."
- "¿Quién te crees que eres?"

Esa voz NO ERES TÚ. Es una grabación antigua de miedos, críticas de otros o presiones sociales.

**Paso 1:** Ponle nombre a tu crítico (ej: "El Gruñón").
Cuando empiece a hablar, dile: "Gracias por tu opinión, Gruñón, pero yo estoy al mando".
', 'https://ueuxjtyottluwkvdreqe.supabase.co/storage/v1/object/public/academy-voices/esteem-1.mp3', 9)
        ON CONFLICT (id) DO UPDATE SET
        content = EXCLUDED.content,
        audio_url = EXCLUDED.audio_url,
        title = EXCLUDED.title;
INSERT INTO public.academy_lessons (id, module_id, title, description, duration, is_premium, content, audio_url, order_index)
        VALUES ('esteem-2', 'self_esteem', 'Lección 2: Orígenes de la Duda', '¿De quién es esa voz?', '9 min', false, '
# 🌱 La Raíz

¿Cuándo empezaste a dudar de ti?
A menudo adoptamos la voz de un padre exigente, un profesor duro o un compañero cruel como nuestra propia voz interior.

**Ejercicio de arqueología:**
Esa frase hiriente que te repites... ¿a quién te recuerda? 
Devuelve esa crítica a su dueño original. No te pertenece. Tú naciste valioso/a.
', 'https://ueuxjtyottluwkvdreqe.supabase.co/storage/v1/object/public/academy-voices/esteem-2.mp3', 10)
        ON CONFLICT (id) DO UPDATE SET
        content = EXCLUDED.content,
        audio_url = EXCLUDED.audio_url,
        title = EXCLUDED.title;
INSERT INTO public.academy_lessons (id, module_id, title, description, duration, is_premium, content, audio_url, order_index)
        VALUES ('esteem-3', 'self_esteem', 'Lección 3: Autocompasión Radical', 'Ser tu propio aliado.', '7 min', true, '
# 🫂 Sé tu Mejor Amigo

Si tu mejor amigo cometiera un error, ¿le dirías "Eres un inútil, ríndete"?
Probablemente no. Le dirías: "No pasa nada, aprendes y sigues".

¿Por qué te tratas a ti peor que a nadie?
La autocompasión no es autolástima. Es tratarte con la misma amabilidad y apoyo que das a quienes amas. Es la base de la verdadera fuerza.
', 'https://ueuxjtyottluwkvdreqe.supabase.co/storage/v1/object/public/academy-voices/esteem-3.mp3', 11)
        ON CONFLICT (id) DO UPDATE SET
        content = EXCLUDED.content,
        audio_url = EXCLUDED.audio_url,
        title = EXCLUDED.title;
INSERT INTO public.academy_lessons (id, module_id, title, description, duration, is_premium, content, audio_url, order_index)
        VALUES ('esteem-4', 'self_esteem', 'Lección 4: Reescribiendo el Guion', 'Nuevas narrativas.', '10 min', true, '
# 📝 Nuevo Guion

Tu cerebro busca confirmación de lo que cree. Si crees que eres "torpe", tu cerebro ignorará 10 aciertos y señalará 1 error: "¿Lo ves?".

Vamos a entrenar al cerebro para buscar lo bueno.
**Diario de Logros:**
Cada noche, escribe 3 cosas que hiciste bien. Por pequeñas que sean.
"Me levanté a tiempo". "Fui amable con el camarero". "Terminé ese informe".

Reescribe tu identidad basándote en la evidencia de tus éxitos.
', 'https://ueuxjtyottluwkvdreqe.supabase.co/storage/v1/object/public/academy-voices/esteem-4.mp3', 12)
        ON CONFLICT (id) DO UPDATE SET
        content = EXCLUDED.content,
        audio_url = EXCLUDED.audio_url,
        title = EXCLUDED.title;
INSERT INTO public.academy_lessons (id, module_id, title, description, duration, is_premium, content, audio_url, order_index)
        VALUES ('grief-1', 'grief', 'Lección 1: El Shock', 'Cuando el mundo se detiene.', '10 min', false, '
# ⛈️ El Shock

Acaba de ocurrir. El mundo sigue girando, pero el tuyo se ha parado.
Es normal sentirse entumecido, irreal o "en una película".
Es el mecanismo de defensa de tu cerebro para no recibir todo el dolor de golpe.

No te exijas "funcionar" ahora. Solo respira. Tu única tarea hoy es sobrevivir. Bebe agua. Come algo. Descansa.
', 'https://ueuxjtyottluwkvdreqe.supabase.co/storage/v1/object/public/academy-voices/grief-1.mp3', 13)
        ON CONFLICT (id) DO UPDATE SET
        content = EXCLUDED.content,
        audio_url = EXCLUDED.audio_url,
        title = EXCLUDED.title;
INSERT INTO public.academy_lessons (id, module_id, title, description, duration, is_premium, content, audio_url, order_index)
        VALUES ('grief-2', 'grief', 'Lección 2: La Negación', 'Mecanismos de defensa.', '8 min', false, '
# 🚫 "No puede ser verdad"

Te descubres esperando su llamada. O pensando que es un error.
La negación nos da treguas. Nos permite dosificar el dolor.

No te juzgues si te pillas "olvidando" que pasó por un segundo. Es tu mente descansando.
Poco a poco, la realidad irá calando. Ten paciencia con tus ritmos.
', 'https://ueuxjtyottluwkvdreqe.supabase.co/storage/v1/object/public/academy-voices/grief-2.mp3', 14)
        ON CONFLICT (id) DO UPDATE SET
        content = EXCLUDED.content,
        audio_url = EXCLUDED.audio_url,
        title = EXCLUDED.title;
INSERT INTO public.academy_lessons (id, module_id, title, description, duration, is_premium, content, audio_url, order_index)
        VALUES ('grief-3', 'grief', 'Lección 3: Ira y Negociación', 'El fuego interior.', '9 min', true, '
# 🔥 ¿Por qué a mí?

La tristeza puede disfrazarse de rabia.
Rabia contra el médico, contra Dios, contra la vida, o incluso contra quien se fue por "abandonarte".
Es normal. La ira es energía; la tristeza es agotadora. A veces preferimos estar enfadados para no sentirnos rotos.

Y la negociación: "Si hago esto, ¿despertaré de la pesadilla?".
Permite que la ira salga (escribe, grita en el coche, haz deporte). No la guardes.
', 'https://ueuxjtyottluwkvdreqe.supabase.co/storage/v1/object/public/academy-voices/grief-3.mp3', 15)
        ON CONFLICT (id) DO UPDATE SET
        content = EXCLUDED.content,
        audio_url = EXCLUDED.audio_url,
        title = EXCLUDED.title;
INSERT INTO public.academy_lessons (id, module_id, title, description, duration, is_premium, content, audio_url, order_index)
        VALUES ('grief-4', 'grief', 'Lección 4: La Tristeza Profunda', 'Honrar el dolor.', '12 min', true, '
# 🌊 La Ola

Cuando el shock y la ira bajan, llega la ola gigante de la tristeza.
Duele físicamente. El pecho, el estómago, el cansancio infinito.

No huyas. Este dolor es el precio del amor. Duele tanto porque importaba mucho.
Honra ese dolor. Llévalo contigo. No tienes que "superarlo" hoy. Solo tienes que dejar que te atraviese.
', 'https://ueuxjtyottluwkvdreqe.supabase.co/storage/v1/object/public/academy-voices/grief-4.mp3', 16)
        ON CONFLICT (id) DO UPDATE SET
        content = EXCLUDED.content,
        audio_url = EXCLUDED.audio_url,
        title = EXCLUDED.title;
INSERT INTO public.academy_lessons (id, module_id, title, description, duration, is_premium, content, audio_url, order_index)
        VALUES ('grief-5', 'grief', 'Lección 5: Aceptación', 'Construyendo el nuevo yo.', '10 min', true, '
# 🌅 Un Nuevo Amanecer

Aceptación no es "estar feliz" de lo que pasó. Es aceptar que la realidad ha cambiado y decidir vivir en ella.
La cicatriz siempre estará, pero dejará de doler al tacto.

Empezarás a sonreír de nuevo, y al principio te sentirás culpable. No lo hagas. Tu alegría es el mejor homenaje a la vida.
', 'https://ueuxjtyottluwkvdreqe.supabase.co/storage/v1/object/public/academy-voices/grief-5.mp3', 17)
        ON CONFLICT (id) DO UPDATE SET
        content = EXCLUDED.content,
        audio_url = EXCLUDED.audio_url,
        title = EXCLUDED.title;
INSERT INTO public.academy_lessons (id, module_id, title, description, duration, is_premium, content, audio_url, order_index)
        VALUES ('insomnia-1', 'insomnia', 'Día 1: Ritmos Circadianos', 'Tu reloj interno.', '8 min', false, '
# ⏰ Tu Reloj Maestro

Tu cuerpo tiene un reloj interno de 24h. Si está desajustado, dormir es imposible.
El principal "ajustador" es la **LUZ**.

**Regla de Oro:**
Exponte a mucha luz natural por la mañana.
Evita la luz azul (pantallas) 2 horas antes de dormir.

Dile a tu cerebro cuándo es de día y cuándo es de noche.
', 'https://ueuxjtyottluwkvdreqe.supabase.co/storage/v1/object/public/academy-voices/insomnia-1.mp3', 18)
        ON CONFLICT (id) DO UPDATE SET
        content = EXCLUDED.content,
        audio_url = EXCLUDED.audio_url,
        title = EXCLUDED.title;
INSERT INTO public.academy_lessons (id, module_id, title, description, duration, is_premium, content, audio_url, order_index)
        VALUES ('insomnia-2', 'insomnia', 'Día 2: Higiene del Sueño', 'El santuario del descanso.', '10 min', false, '
# 🛌 El Santuario

Tu habitación debe ser una cueva: Oscura, Fresca y Silenciosa.

Pero la higiene también es mental.
La cama es SOLO para dormir (y sexo).
No trabajes, no comas y NO DISCUTAS en la cama.
Tu cerebro debe asociar: Almohada = Apagado.
', 'https://ueuxjtyottluwkvdreqe.supabase.co/storage/v1/object/public/academy-voices/insomnia-2.mp3', 19)
        ON CONFLICT (id) DO UPDATE SET
        content = EXCLUDED.content,
        audio_url = EXCLUDED.audio_url,
        title = EXCLUDED.title;
INSERT INTO public.academy_lessons (id, module_id, title, description, duration, is_premium, content, audio_url, order_index)
        VALUES ('insomnia-3', 'insomnia', 'Día 3: Desactivar la Mente', 'Técnicas de ', '12 min', true, '
# 🧠 Apagar el Ruido

¿Tu cabeza empieza a repasar la lista de la compra o errores de 2012 nada más tocar la almohada?
Tu cerebro está en "Modo Resolución de Problemas".

**Técnica: Descarga Mental**
2 horas antes de dormir, escribe en un papel todo lo que te preocupa o tienes pendiente. Cierra la libreta.
Dile a tu cerebro: "Ya está anotado. Mañana nos ocupamos. Ahora no puedo hacer nada".
', 'https://ueuxjtyottluwkvdreqe.supabase.co/storage/v1/object/public/academy-voices/insomnia-3.mp3', 20)
        ON CONFLICT (id) DO UPDATE SET
        content = EXCLUDED.content,
        audio_url = EXCLUDED.audio_url,
        title = EXCLUDED.title;
INSERT INTO public.academy_lessons (id, module_id, title, description, duration, is_premium, content, audio_url, order_index)
        VALUES ('insomnia-4', 'insomnia', 'Día 4: Pesadillas y Despertares', 'Volver a dormir.', '9 min', true, '
# 🌃 Despertar a las 3 AM

Te despiertas. Miras el reloj. "Oh no, solo me quedan 3 horas". Pánico.
La ansiedad por no dormir ES lo que te impide dormir.

**Regla de los 20 minutos:**
Si no te duermes en lo que parecen 20 mins, SAL DE LA CAMA.
Ve al sofá, lee algo aburrido con luz tenue. Vuelve solo cuando tengas sueño real.
No te quedes en la cama peleando.
', 'https://ueuxjtyottluwkvdreqe.supabase.co/storage/v1/object/public/academy-voices/insomnia-4.mp3', 21)
        ON CONFLICT (id) DO UPDATE SET
        content = EXCLUDED.content,
        audio_url = EXCLUDED.audio_url,
        title = EXCLUDED.title;
INSERT INTO public.academy_lessons (id, module_id, title, description, duration, is_premium, content, audio_url, order_index)
        VALUES ('insomnia-5', 'insomnia', 'Día 5: Relajación Progresiva', 'Escáner corporal profundo.', '15 min', true, '
# 🧘 Relajación de Jacobson

A veces la tensión es física y no te das cuenta.
Esta técnica consiste en tensar fuerte un grupo muscular (ej: puños) por 5 segundos, y soltar de golpe.
Siente el contraste.

Recorre todo tu cuerpo: pies, piernas, glúteos, abdomen, hombros, cara.
Deja tu cuerpo pesado, hundido en el colchón.
', 'https://ueuxjtyottluwkvdreqe.supabase.co/storage/v1/object/public/academy-voices/insomnia-5.mp3', 22)
        ON CONFLICT (id) DO UPDATE SET
        content = EXCLUDED.content,
        audio_url = EXCLUDED.audio_url,
        title = EXCLUDED.title;
INSERT INTO public.academy_lessons (id, module_id, title, description, duration, is_premium, content, audio_url, order_index)
        VALUES ('insomnia-6', 'insomnia', 'Día 6: La Cama es para Dormir', 'Reasociación cognitiva.', '8 min', true, '
# 🛌 Control de Estímulos

Si pasas horas despierto/a en la cama sufriendo, tu cerebro asocia CAMA = SUFRIMIENTO.
Tenemos que romper esa asociación.

La cama es solo para dormir. Si no duermes, fuera.
Al principio dormirás menos tiempo total, pero el tiempo que pases en la cama será de sueño real (Eficiencia del Sueño).
Con el tiempo, tu cerebro volverá a asociar Cama = Placer y Descanso.
', 'https://ueuxjtyottluwkvdreqe.supabase.co/storage/v1/object/public/academy-voices/insomnia-6.mp3', 23)
        ON CONFLICT (id) DO UPDATE SET
        content = EXCLUDED.content,
        audio_url = EXCLUDED.audio_url,
        title = EXCLUDED.title;
INSERT INTO public.academy_lessons (id, module_id, title, description, duration, is_premium, content, audio_url, order_index)
        VALUES ('insomnia-7', 'insomnia', 'Día 7: Tu Rutina Nocturna', 'Plan de mantenimiento.', '10 min', true, '
# 🌙 Ritual de Buenas Noches

Diseña tu rutina de 30-60 min antes de dormir:
1. Apagar pantallas.
2. Ducha tibia o infusión.
3. Leer papel o escuchar audio relajante (Paziify).
4. Agradecer 3 cosas del día.

Repite esto cada noche. Tu cuerpo aprenderá que esta secuencia significa "es hora de apagarse". ¡Dulces sueños!
', 'https://ueuxjtyottluwkvdreqe.supabase.co/storage/v1/object/public/academy-voices/insomnia-7.mp3', 24)
        ON CONFLICT (id) DO UPDATE SET
        content = EXCLUDED.content,
        audio_url = EXCLUDED.audio_url,
        title = EXCLUDED.title;
INSERT INTO public.academy_lessons (id, module_id, title, description, duration, is_premium, content, audio_url, order_index)
        VALUES ('burnout-1', 'burnout', 'Lección 1: Señales de Alarma', 'Cansancio vs Agotamiento.', '8 min', false, '
# 🔥 ¿Estoy Quemado?

El Burnout no es solo "estar cansado". Un fin de semana no lo cura.
Síntomas clave:
1. **Agotamiento Emocional**: Sentirte vaciado/a.
2. **Cinismo**: Odiar tu trabajo, criticar a todos, "me da igual todo".
3. **Ineficacia**: Sentir que nada de lo que haces importa.

Si estás aquí, para. Tu cuerpo te está gritando. Escúchalo.
', 'https://ueuxjtyottluwkvdreqe.supabase.co/storage/v1/object/public/academy-voices/burnout-1.mp3', 25)
        ON CONFLICT (id) DO UPDATE SET
        content = EXCLUDED.content,
        audio_url = EXCLUDED.audio_url,
        title = EXCLUDED.title;
INSERT INTO public.academy_lessons (id, module_id, title, description, duration, is_premium, content, audio_url, order_index)
        VALUES ('burnout-2', 'burnout', 'Lección 2: Desconectar de Verdad', 'El derecho a no hacer nada.', '10 min', false, '
# 🔌 Recovery

Desconectar no es mirar Instagram mientras piensas en el email de mañana.
Desconectar es:
- No mirar el móvil del trabajo.
- Hacer cosas que absorban tu atención (deporte, pintar, cocinar).
- O simplemente... NO HACER NADA. Mirar el techo.

El "dolce far niente". Tu cerebro necesita esos espacios vacíos para regenerarse.
', 'https://ueuxjtyottluwkvdreqe.supabase.co/storage/v1/object/public/academy-voices/burnout-2.mp3', 26)
        ON CONFLICT (id) DO UPDATE SET
        content = EXCLUDED.content,
        audio_url = EXCLUDED.audio_url,
        title = EXCLUDED.title;
INSERT INTO public.academy_lessons (id, module_id, title, description, duration, is_premium, content, audio_url, order_index)
        VALUES ('burnout-3', 'burnout', 'Lección 3: Límites Laborales', 'Decir no sin culpa.', '9 min', true, '
# 🚧 Poniendo Límites

Si siempre dices SÍ, tu SÍ pierde valor. Y tú pierdes salud.
Decir NO es profesional.
"No puedo asumir este proyecto si queremos mantener la calidad del otro".
"No respondo correos después de las 18h".

Al principio da miedo. Luego da respeto. La gente respeta a quien se respeta a sí mismo.
', 'https://ueuxjtyottluwkvdreqe.supabase.co/storage/v1/object/public/academy-voices/burnout-3.mp3', 27)
        ON CONFLICT (id) DO UPDATE SET
        content = EXCLUDED.content,
        audio_url = EXCLUDED.audio_url,
        title = EXCLUDED.title;
INSERT INTO public.academy_lessons (id, module_id, title, description, duration, is_premium, content, audio_url, order_index)
        VALUES ('burnout-4', 'burnout', 'Lección 4: Recuperación Activa', 'Qué te recarga energía.', '11 min', true, '
# 🔋 ¿Qué te carga las pilas?

Haz dos listas:
1. **Vampiros de Energía**: Reuniones eternas, gente que se queja, el tráfico.
2. **Generadores de Energía**: Pasear, música, reír con amigos, dormir.

Tu objetivo: Minimizar la lista 1 y Maximizar la lista 2 cada día.
El equilibrio no se encuentra, se crea.
', 'https://ueuxjtyottluwkvdreqe.supabase.co/storage/v1/object/public/academy-voices/burnout-4.mp3', 28)
        ON CONFLICT (id) DO UPDATE SET
        content = EXCLUDED.content,
        audio_url = EXCLUDED.audio_url,
        title = EXCLUDED.title;
INSERT INTO public.academy_lessons (id, module_id, title, description, duration, is_premium, content, audio_url, order_index)
        VALUES ('burnout-5', 'burnout', 'Lección 5: Rediseñando el Trabajo', 'Job crafting.', '12 min', true, '
# 🛠️ Job Crafting

A veces no puedes cambiar de trabajo, pero puedes cambiar CÓMO lo haces.
- ¿Puedes delegar lo que odias?
- ¿Puedes hacer más de lo que se te da bien?
- ¿Cómo puedes conectar tu tarea con un propósito mayor?

Recupera el control. No eres un engranaje, eres el conductor.
', 'https://ueuxjtyottluwkvdreqe.supabase.co/storage/v1/object/public/academy-voices/burnout-5.mp3', 29)
        ON CONFLICT (id) DO UPDATE SET
        content = EXCLUDED.content,
        audio_url = EXCLUDED.audio_url,
        title = EXCLUDED.title;
INSERT INTO public.academy_lessons (id, module_id, title, description, duration, is_premium, content, audio_url, order_index)
        VALUES ('lead-1', 'leadership', 'Lección 1: Estilos de Liderazgo', 'Conócete a ti mismo.', '10 min', false, '
# 🦁 Tipos de Líder

¿Eres un líder autoritario ("haz lo que digo"), democrático ("¿qué opináis?") o coach ("te ayudo a crecer")?
El mejor líder no es fijo; se adapta.

Pero la base siempre es la **Autenticidad**.
No intentes imitar a Steve Jobs. Sé la mejor versión de ti mismo guiando a otros.
', 'https://ueuxjtyottluwkvdreqe.supabase.co/storage/v1/object/public/academy-voices/lead-1.mp3', 30)
        ON CONFLICT (id) DO UPDATE SET
        content = EXCLUDED.content,
        audio_url = EXCLUDED.audio_url,
        title = EXCLUDED.title;
INSERT INTO public.academy_lessons (id, module_id, title, description, duration, is_premium, content, audio_url, order_index)
        VALUES ('lead-2', 'leadership', 'Lección 2: Escucha Activa', 'Más allá de las palabras.', '12 min', false, '
# 👂 Escuchar para Entender

La mayoría escuchamos para responder. "Sí, pero...", "Yo haría...".
La Escucha Activa es escuchar para **ENTENDER**.

- Mira a los ojos.
- No interrumpas.
- Haz preguntas: "¿Qué quieres decir con...?", "¿Cómo te sientes con eso?".

Cuando alguien se siente realmente escuchado, baja sus defensas y la confianza se dispara.
', 'https://ueuxjtyottluwkvdreqe.supabase.co/storage/v1/object/public/academy-voices/lead-2.mp3', 31)
        ON CONFLICT (id) DO UPDATE SET
        content = EXCLUDED.content,
        audio_url = EXCLUDED.audio_url,
        title = EXCLUDED.title;
INSERT INTO public.academy_lessons (id, module_id, title, description, duration, is_premium, content, audio_url, order_index)
        VALUES ('lead-3', 'leadership', 'Lección 3: Feedback Constructivo', 'Crecimiento, no crítica.', '15 min', true, '
# 🎁 El Regalo del Feedback

El feedback no es regañar. Es información para mejorar.
Modelo **SBI**:
- **Situation** (Situación): "Ayer en la reunión..."
- **Behavior** (Comportamiento): "...interrumpiste a Juan 3 veces..."
- **Impact** (Impacto): "...y él dejó de aportar ideas."

Sé específico. Duro con el problema, suave con la persona.
', 'https://ueuxjtyottluwkvdreqe.supabase.co/storage/v1/object/public/academy-voices/lead-3.mp3', 32)
        ON CONFLICT (id) DO UPDATE SET
        content = EXCLUDED.content,
        audio_url = EXCLUDED.audio_url,
        title = EXCLUDED.title;
INSERT INTO public.academy_lessons (id, module_id, title, description, duration, is_premium, content, audio_url, order_index)
        VALUES ('lead-4', 'leadership', 'Lección 4: Gestión de Conflictos', 'El conflicto como oportunidad.', '14 min', true, '
# ⚔️ El Conflicto es Necesario

Un equipo sin conflictos es un equipo artificial o asustado.
El conflicto sano trae innovación y mejora.

No lo evites. Medialo.
Busca el interés común debajo de la posición de cada uno.
"Ambos queremos que el proyecto salga bien, solo diferimos en el CÓMO. Busquemos un tercer camino."
', 'https://ueuxjtyottluwkvdreqe.supabase.co/storage/v1/object/public/academy-voices/lead-4.mp3', 33)
        ON CONFLICT (id) DO UPDATE SET
        content = EXCLUDED.content,
        audio_url = EXCLUDED.audio_url,
        title = EXCLUDED.title;
INSERT INTO public.academy_lessons (id, module_id, title, description, duration, is_premium, content, audio_url, order_index)
        VALUES ('lead-5', 'leadership', 'Lección 5: Motivación de Equipos', 'Propósito compartido.', '10 min', true, '
# 🚀 Motivación Intrínseca

El dinero motiva a corto plazo. El propósito a largo plazo.
La gente quiere sentir que su trabajo **IMPORTA**.

Conecta las tareas diarias con la visión global.
Celebra los pequeños avances. Hazles sentir parte de algo grande.
', 'https://ueuxjtyottluwkvdreqe.supabase.co/storage/v1/object/public/academy-voices/lead-5.mp3', 34)
        ON CONFLICT (id) DO UPDATE SET
        content = EXCLUDED.content,
        audio_url = EXCLUDED.audio_url,
        title = EXCLUDED.title;
INSERT INTO public.academy_lessons (id, module_id, title, description, duration, is_premium, content, audio_url, order_index)
        VALUES ('lead-6', 'leadership', 'Lección 6: Liderazgo Remoto', 'Conectar en la distancia.', '9 min', true, '
# 💻 Liderar por Zoom

En remoto, perdemos el lenguaje corporal y la charla de café.
Debes ser intencional.
- Haz check-ins personales: "¿Cómo estáis hoy?" antes de hablar de trabajo.
- Sobrecomunica: lo obvio no es obvio en remoto.
- Confía: Mide resultados, no horas de silla.
', 'https://ueuxjtyottluwkvdreqe.supabase.co/storage/v1/object/public/academy-voices/lead-6.mp3', 35)
        ON CONFLICT (id) DO UPDATE SET
        content = EXCLUDED.content,
        audio_url = EXCLUDED.audio_url,
        title = EXCLUDED.title;
INSERT INTO public.academy_lessons (id, module_id, title, description, duration, is_premium, content, audio_url, order_index)
        VALUES ('parent-1', 'parenting', 'Lección 1: Tu Propia Calma', 'Co-regulación nerviosa.', '10 min', false, '
# 🧘 Tú eres el Barómetro

No puedes pedirle a un niño que se calme si tú estás gritando.
Los niños tienen "neuronas espejo": copian tu estado nervioso.

Antes de intervenir en una rabieta, hazte un "Chequeo de Pulso".
¿Estoy yo calmado?
Si no, tómate 1 minuto. "Mamá necesita respirar un momento".
Estás modelando autocontrol. Eso es educar.
', 'https://ueuxjtyottluwkvdreqe.supabase.co/storage/v1/object/public/academy-voices/parent-1.mp3', 36)
        ON CONFLICT (id) DO UPDATE SET
        content = EXCLUDED.content,
        audio_url = EXCLUDED.audio_url,
        title = EXCLUDED.title;
INSERT INTO public.academy_lessons (id, module_id, title, description, duration, is_premium, content, audio_url, order_index)
        VALUES ('parent-2', 'parenting', 'Lección 2: Entender la Rabia', 'El cerebro del niño.', '12 min', false, '
# 🧠 El Cerebro en Construcción

El cerebro racional (cortex prefrontal) no termina de formarse hasta los 25 años.
Cuando un niño tiene una rabieta, su cerebro racional está "desconectado". Ha sido secuestrado por la emoción.

Intentar razonar con un niño en plena rabieta es inútil.
Primero **CONECTA** (abrazo, validación), luego **REDIRIGE** (razonamiento).
', 'https://ueuxjtyottluwkvdreqe.supabase.co/storage/v1/object/public/academy-voices/parent-2.mp3', 37)
        ON CONFLICT (id) DO UPDATE SET
        content = EXCLUDED.content,
        audio_url = EXCLUDED.audio_url,
        title = EXCLUDED.title;
INSERT INTO public.academy_lessons (id, module_id, title, description, duration, is_premium, content, audio_url, order_index)
        VALUES ('parent-3', 'parenting', 'Lección 3: Límites con Amor', 'Firmeza y amabilidad.', '11 min', true, '
# 🚧 Límites Seguros

Los límites dan seguridad. Un mundo sin límites asusta.
Pero poner límites no significa enfadarse.

Fórmula:
1. **Validar deseo**: "Sé que quieres seguir jugando..."
2. **Poner límite**: "...pero es hora de cenar."
3. **Dar opción**: "¿Quieres ir saltando o caminando a la mesa?"

Firme en el límite, amable en la forma.
', 'https://ueuxjtyottluwkvdreqe.supabase.co/storage/v1/object/public/academy-voices/parent-3.mp3', 38)
        ON CONFLICT (id) DO UPDATE SET
        content = EXCLUDED.content,
        audio_url = EXCLUDED.audio_url,
        title = EXCLUDED.title;
INSERT INTO public.academy_lessons (id, module_id, title, description, duration, is_premium, content, audio_url, order_index)
        VALUES ('parent-4', 'parenting', 'Lección 4: Validar Emociones', 'Todas son bienvenidas.', '9 min', true, '
# 😭 "No llores"

Decir "no llores, no es para tanto" enseña al niño que sus emociones están mal o no son válidas.
En cambio, di: "Veo que estás triste/enfadado. Es normal. Estoy aquí contigo".

Validar la emoción no significa aceptar la conducta (pegar no vale).
"Está bien estar enfadado, pero no está bien pegar".
', 'https://ueuxjtyottluwkvdreqe.supabase.co/storage/v1/object/public/academy-voices/parent-4.mp3', 39)
        ON CONFLICT (id) DO UPDATE SET
        content = EXCLUDED.content,
        audio_url = EXCLUDED.audio_url,
        title = EXCLUDED.title;
INSERT INTO public.academy_lessons (id, module_id, title, description, duration, is_premium, content, audio_url, order_index)
        VALUES ('parent-5', 'parenting', 'Lección 5: Juego y Conexión', 'El lenguaje del niño.', '15 min', true, '
# 🎲 El Juego es Serio

El juego es el lenguaje del niño. Conectas más jugando 10 minutos en el suelo que hablando 1 hora.
Dedica 15 minutos al día de "Tiempo Especial":
- Sin pantallas.
- El niño dirige el juego.
- Tú solo sigues y disfrutas.

Eso llena su "tanque de amor" y reduce los problemas de conducta.
', 'https://ueuxjtyottluwkvdreqe.supabase.co/storage/v1/object/public/academy-voices/parent-5.mp3', 40)
        ON CONFLICT (id) DO UPDATE SET
        content = EXCLUDED.content,
        audio_url = EXCLUDED.audio_url,
        title = EXCLUDED.title;
INSERT INTO public.academy_lessons (id, module_id, title, description, duration, is_premium, content, audio_url, order_index)
        VALUES ('parent-6', 'parenting', 'Lección 6: Autonomía', 'Dejar hacer para crecer.', '10 min', true, '
# 🧒 "Yo Solito"

Es más rápido vestirlo tú. Pero es mejor que aprenda él.
Fomenta la autonomía dándole tareas adecuadas a su edad.
- Poner la mesa.
- Elegir su ropa (entre 2 opciones).

La autoestima nace de sentirse capaz (''Soy útil'').
', 'https://ueuxjtyottluwkvdreqe.supabase.co/storage/v1/object/public/academy-voices/parent-6.mp3', 41)
        ON CONFLICT (id) DO UPDATE SET
        content = EXCLUDED.content,
        audio_url = EXCLUDED.audio_url,
        title = EXCLUDED.title;
INSERT INTO public.academy_lessons (id, module_id, title, description, duration, is_premium, content, audio_url, order_index)
        VALUES ('parent-7', 'parenting', 'Lección 7: Conflictos entre Hermanos', 'Mediación.', '12 min', true, '
# 🥊 Peleas de Hermanos

No hagas de juez ("¿Quién empezó?"). Haz de mediador.
1. Describe lo que ves: "Veo dos niños enfadados y un solo juguete".
2. Escucha a ambos.
3. Pídeles soluciones: "¿Cómo podemos resolver esto para que los dos estéis bien?".

Enséñales a negociar, no a ganar.
', 'https://ueuxjtyottluwkvdreqe.supabase.co/storage/v1/object/public/academy-voices/parent-7.mp3', 42)
        ON CONFLICT (id) DO UPDATE SET
        content = EXCLUDED.content,
        audio_url = EXCLUDED.audio_url,
        title = EXCLUDED.title;
INSERT INTO public.academy_lessons (id, module_id, title, description, duration, is_premium, content, audio_url, order_index)
        VALUES ('parent-8', 'parenting', 'Lección 8: Autocuidado para Padres', 'Llenar tu propia taza.', '10 min', true, '
# ☕ Cuídate para Cuidar

No eres un robot. Si estás agotado, tendrás menos paciencia.
El autocuidado no es un lujo, es responsabilidad parental.

Pide ayuda. Túrnate. Tómate ese café caliente. Lee 10 minutos.
Un padre descansado es un mejor padre que uno mártir y amargado.
', 'https://ueuxjtyottluwkvdreqe.supabase.co/storage/v1/object/public/academy-voices/parent-8.mp3', 43)
        ON CONFLICT (id) DO UPDATE SET
        content = EXCLUDED.content,
        audio_url = EXCLUDED.audio_url,
        title = EXCLUDED.title;
INSERT INTO public.academy_lessons (id, module_id, title, description, duration, is_premium, content, audio_url, order_index)
        VALUES ('kids-1', 'kids_mindfulness', '1: El Globo Mágico', 'Respiración abdominal.', '5 min', false, '
# 🎈 El Globo Mágico

Imagina que tienes un globo de tu color favorito en la barriga.
Cuando entra el aire por la nariz... ¡el globo se hincha! (Pon las manos en la barriga).
Cuando sale el aire... ¡el globo se deshincha! fffffff...

Vamos a hincharlo y deshincharlo 5 veces. Muy despacito.
', 'https://ueuxjtyottluwkvdreqe.supabase.co/storage/v1/object/public/academy-voices/kids-1.mp3', 44)
        ON CONFLICT (id) DO UPDATE SET
        content = EXCLUDED.content,
        audio_url = EXCLUDED.audio_url,
        title = EXCLUDED.title;
INSERT INTO public.academy_lessons (id, module_id, title, description, duration, is_premium, content, audio_url, order_index)
        VALUES ('kids-2', 'kids_mindfulness', '2: La Ranita Quieta', 'Atención plena.', '4 min', false, '
# 🐸 La Ranita

Las ranas saltan mucho, pero también saben estar MUY quietas observando moscas.
Vamos a jugar a ser ranas.
Siéntate como una rana. Cierra los ojos.
Quédate muy muy quieto. ¿Qué escuchas? ¿Qué hueles?
Si te viene un pensamiento "saltarín", déjalo pasar y vuelve a estar quieto.
', 'https://ueuxjtyottluwkvdreqe.supabase.co/storage/v1/object/public/academy-voices/kids-2.mp3', 45)
        ON CONFLICT (id) DO UPDATE SET
        content = EXCLUDED.content,
        audio_url = EXCLUDED.audio_url,
        title = EXCLUDED.title;
INSERT INTO public.academy_lessons (id, module_id, title, description, duration, is_premium, content, audio_url, order_index)
        VALUES ('kids-3', 'kids_mindfulness', '3: El Botón de Pausa', 'Parar y sentir.', '5 min', false, '
# ⏸️ El Botón de Pausa

Imagina que tienes un botón de PAUSA en el pecho.
Cuando estés enfadado o quieras pegar... ¡PULSA EL BOTÓN!
(Hacemos el gesto de pulsar).

Todo se para. Respira 3 veces.
Ahora, ¿qué quieres hacer? ¿Seguimos jugando o necesitamos un abrazo?
', 'https://ueuxjtyottluwkvdreqe.supabase.co/storage/v1/object/public/academy-voices/kids-3.mp3', 46)
        ON CONFLICT (id) DO UPDATE SET
        content = EXCLUDED.content,
        audio_url = EXCLUDED.audio_url,
        title = EXCLUDED.title;
INSERT INTO public.academy_lessons (id, module_id, title, description, duration, is_premium, content, audio_url, order_index)
        VALUES ('kids-4', 'kids_mindfulness', '4: Superpoderes de Escucha', 'Sonidos lejanos.', '6 min', false, '
# 👂 Oídos de Búho

Vamos a activar nuestros super-oídos.
Cierra los ojos.
Intenta escuchar un sonido que esté muy lejos (fuera de la casa, un coche, un pájaro...).
Ahora uno que esté dentro de la habitación (el reloj, tu respiración...).
¡Qué bien oyes!
', 'https://ueuxjtyottluwkvdreqe.supabase.co/storage/v1/object/public/academy-voices/kids-4.mp3', 47)
        ON CONFLICT (id) DO UPDATE SET
        content = EXCLUDED.content,
        audio_url = EXCLUDED.audio_url,
        title = EXCLUDED.title;
INSERT INTO public.academy_lessons (id, module_id, title, description, duration, is_premium, content, audio_url, order_index)
        VALUES ('kids-5', 'kids_mindfulness', '5: Escáner de Rayos X', 'Sintiendo el cuerpo.', '7 min', true, '
# 🦴 Rayos X

Túmbate. Vamos a pasar un escáner mágico desde los pies a la cabeza.
¿Cómo sientes los dedos del pie? Muevelos.
¿Y las rodillas? ¿Y la barriga? ¿Está blanda o dura?
¿Los hombros están arriba o abajo?
La la cara... ¿estás apretando los dientes? Suelta la mandíbula como si estuviera dormida.
', 'https://ueuxjtyottluwkvdreqe.supabase.co/storage/v1/object/public/academy-voices/kids-5.mp3', 48)
        ON CONFLICT (id) DO UPDATE SET
        content = EXCLUDED.content,
        audio_url = EXCLUDED.audio_url,
        title = EXCLUDED.title;
INSERT INTO public.academy_lessons (id, module_id, title, description, duration, is_premium, content, audio_url, order_index)
        VALUES ('kids-6', 'kids_mindfulness', '6: La Montaña Fuerte', 'Postura y fortaleza.', '5 min', true, '
# 🏔️ La Montaña

Ponte de pie, piernas separadas como un superhéroe.
Eres una montaña gigante.
Viene el viento (sopla)... pero la montaña no se mueve.
Viene la lluvia... la montaña sigue ahí.
Aunque estés triste o enfadado (como una tormenta), tú eres fuerte como la montaña. La tormenta pasará, la montaña se queda.
', 'https://ueuxjtyottluwkvdreqe.supabase.co/storage/v1/object/public/academy-voices/kids-6.mp3', 49)
        ON CONFLICT (id) DO UPDATE SET
        content = EXCLUDED.content,
        audio_url = EXCLUDED.audio_url,
        title = EXCLUDED.title;
INSERT INTO public.academy_lessons (id, module_id, title, description, duration, is_premium, content, audio_url, order_index)
        VALUES ('kids-7', 'kids_mindfulness', '7: Nubes en el Cielo', 'Observar pensamientos.', '6 min', true, '
# ☁️ Nubes

Tu mente es el cielo azul.
Tus pensamientos son nubes que pasan.
A veces hay nubes negras y feas (miedo, enfado).
A veces nubes blancas y bonitas.
Pero tú no eres las nubes. Tú eres el cielo.
Mira cómo pasan las nubes sin agarrarlas. Adiós nube.
', 'https://ueuxjtyottluwkvdreqe.supabase.co/storage/v1/object/public/academy-voices/kids-7.mp3', 50)
        ON CONFLICT (id) DO UPDATE SET
        content = EXCLUDED.content,
        audio_url = EXCLUDED.audio_url,
        title = EXCLUDED.title;
INSERT INTO public.academy_lessons (id, module_id, title, description, duration, is_premium, content, audio_url, order_index)
        VALUES ('kids-8', 'kids_mindfulness', '8: Corazón Amable', 'Enviando amor.', '5 min', true, '
# ❤️ Corazón Mágico

Pon las manos en tu corazón. ¿Lo sientes latir?
Imagina una luz dorada y calentita que sale de él.
Vamos a enviarle esa luz a:
1. Ti mismo (di: "Que yo sea feliz").
2. A alguien que quieres mucho (mamá, papá, abuelos...).
3. A todo el mundo. ¡Luz para todos!
', 'https://ueuxjtyottluwkvdreqe.supabase.co/storage/v1/object/public/academy-voices/kids-8.mp3', 51)
        ON CONFLICT (id) DO UPDATE SET
        content = EXCLUDED.content,
        audio_url = EXCLUDED.audio_url,
        title = EXCLUDED.title;
INSERT INTO public.academy_lessons (id, module_id, title, description, duration, is_premium, content, audio_url, order_index)
        VALUES ('kids-9', 'kids_mindfulness', '9: El Espagueti', 'Tensión y relajación.', '6 min', true, '
# 🍝 El Espagueti

Imagina que eres un espagueti crudo. ¡Duro y tieso!
Aprieta todo el cuerpo: puños, cara, piernas. ¡Duro, duro, duro! (Aguanta 3 segundos).

¡Ahora al agua caliente!
Te pones blandito, fofo y relajado. Muévete como un fideo cocido.
¡Ahhh, qué a gusto se está blandito!
', 'https://ueuxjtyottluwkvdreqe.supabase.co/storage/v1/object/public/academy-voices/kids-9.mp3', 52)
        ON CONFLICT (id) DO UPDATE SET
        content = EXCLUDED.content,
        audio_url = EXCLUDED.audio_url,
        title = EXCLUDED.title;
INSERT INTO public.academy_lessons (id, module_id, title, description, duration, is_premium, content, audio_url, order_index)
        VALUES ('kids-10', 'kids_mindfulness', '10: El Lugar Seguro', 'Visualización.', '8 min', true, '
# 🏰 Tu Escondite Secreto

Cierra los ojos. Vamos a viajar a tu Lugar Seguro.
Puede ser una cabaña en un árbol, una playa, una nube...
¿Cómo es? Constrúyelo en tu mente.
Aquí nada malo puede pasar. Tienes todo lo que te gusta.
Siempre que tengas miedo, puedes cerrar los ojos y venir aquí.
', 'https://ueuxjtyottluwkvdreqe.supabase.co/storage/v1/object/public/academy-voices/kids-10.mp3', 53)
        ON CONFLICT (id) DO UPDATE SET
        content = EXCLUDED.content,
        audio_url = EXCLUDED.audio_url,
        title = EXCLUDED.title;
INSERT INTO public.academy_lessons (id, module_id, title, description, duration, is_premium, content, audio_url, order_index)
        VALUES ('teens-1', 'teens_cbt', 'Lección 1: Tu Cerebro Hackeado', 'Neurociencia teen.', '8 min', false, '
# 🧠 Cerebro en Obras

Si sientes que nadie te entiende o que tus emociones son una montaña rusa... ¡Felicidades, tu cerebro funciona!
Durante la adolescencia, tu zona emocional (Sistema Límbico) está a tope de Power.
Pero tu freno racional (Cortex Prefrontal) está en obras.

Es como tener un Ferrari con frenos de bicicleta.
No estás loco/a. Es biología. Ten paciencia contigo mismo/a.
', 'https://ueuxjtyottluwkvdreqe.supabase.co/storage/v1/object/public/academy-voices/teens-1.mp3', 54)
        ON CONFLICT (id) DO UPDATE SET
        content = EXCLUDED.content,
        audio_url = EXCLUDED.audio_url,
        title = EXCLUDED.title;
INSERT INTO public.academy_lessons (id, module_id, title, description, duration, is_premium, content, audio_url, order_index)
        VALUES ('teens-2', 'teens_cbt', 'Lección 2: Drama vs Realidad', 'Pensamientos extremos.', '10 min', false, '
# 🎭 Drama Queen / King

El cerebro adolescente tiende al **"Todo o Nada"**.
- "Si suspendo esto, mi vida se acaba."
- "Si no le gusto, moriré solo."

Esto se llama **Catastrofismo**.
Cuando pienses en extremos, busca el gris.
"Si suspendo, es una faena, pero puedo recuperar. No es el fin del mundo."
', 'https://ueuxjtyottluwkvdreqe.supabase.co/storage/v1/object/public/academy-voices/teens-2.mp3', 55)
        ON CONFLICT (id) DO UPDATE SET
        content = EXCLUDED.content,
        audio_url = EXCLUDED.audio_url,
        title = EXCLUDED.title;
INSERT INTO public.academy_lessons (id, module_id, title, description, duration, is_premium, content, audio_url, order_index)
        VALUES ('teens-3', 'teens_cbt', 'Lección 3: La Presión Social', 'Ser tú mismo.', '9 min', true, '
# 👁️ El Ojo que Todo lo Ve

A esta edad, sentimos que todos nos miran (Audiencia Imaginaria).
"Si llevo estas zapatillas, se reirán".

Spoiler: La gente está demasiado ocupada pensando en sus propias zapatillas y miedos como para fijarse tanto en ti.
Sé tú. Es la única forma de encontrar a tu verdadera tribu.
', 'https://ueuxjtyottluwkvdreqe.supabase.co/storage/v1/object/public/academy-voices/teens-3.mp3', 56)
        ON CONFLICT (id) DO UPDATE SET
        content = EXCLUDED.content,
        audio_url = EXCLUDED.audio_url,
        title = EXCLUDED.title;
INSERT INTO public.academy_lessons (id, module_id, title, description, duration, is_premium, content, audio_url, order_index)
        VALUES ('teens-4', 'teens_cbt', 'Lección 4: Ansiedad en Exámenes', 'Rendir bajo presión.', '12 min', true, '
# 📝 Miedo al Blanco

La ansiedad antes de un examen es normal. Un poco te ayuda a estudiar. Demasiada te bloquea.

Si te bloqueas:
1. Suelta el boli.
2. Respira hondo 3 veces (hincha la barriga).
3. Di: "Me lo sé. Solo necesito un momento para que mi cerebro encuentre el archivo".
4. Empieza por la pregunta más fácil para ganar confianza.
', 'https://ueuxjtyottluwkvdreqe.supabase.co/storage/v1/object/public/academy-voices/teens-4.mp3', 57)
        ON CONFLICT (id) DO UPDATE SET
        content = EXCLUDED.content,
        audio_url = EXCLUDED.audio_url,
        title = EXCLUDED.title;
INSERT INTO public.academy_lessons (id, module_id, title, description, duration, is_premium, content, audio_url, order_index)
        VALUES ('teens-5', 'teens_cbt', 'Lección 5: Redes Anti-Sociales', 'Comparación y FOMO.', '10 min', true, '
# 📱 La Trampa de Instagram

En redes ves los "Highlights" de los demás. Sus mejores momentos, filtros y fiestas.
Tú comparas SU peli editada con TU "detrás de las cámaras" (tus granos, tu aburrimiento, tus dudas).

Esa comparación es injusta y falsa.
Si te hace sentir mal, deja de seguir (Unfollow terapéutico). Tu feed debe inspirarte, no hundirte.
', 'https://ueuxjtyottluwkvdreqe.supabase.co/storage/v1/object/public/academy-voices/teens-5.mp3', 58)
        ON CONFLICT (id) DO UPDATE SET
        content = EXCLUDED.content,
        audio_url = EXCLUDED.audio_url,
        title = EXCLUDED.title;
INSERT INTO public.academy_lessons (id, module_id, title, description, duration, is_premium, content, audio_url, order_index)
        VALUES ('teens-6', 'teens_cbt', 'Lección 6: Tu Futuro', 'Metas y valores.', '15 min', true, '
# 🚀 Tu Propio Camino

Te preguntan "¿Qué quieres ser?" y te agobias.
Mejor pregunta: "¿Quién quieres ser?".
¿Qué valores te importan? ¿La libertad, la ayuda, la creatividad, el dinero?

No tienes que decidir tu vida entera hoy. Solo el siguiente paso.
Prueba cosas. Equivócate. El camino se hace andando.
', 'https://ueuxjtyottluwkvdreqe.supabase.co/storage/v1/object/public/academy-voices/teens-6.mp3', 59)
        ON CONFLICT (id) DO UPDATE SET
        content = EXCLUDED.content,
        audio_url = EXCLUDED.audio_url,
        title = EXCLUDED.title;
COMMIT;