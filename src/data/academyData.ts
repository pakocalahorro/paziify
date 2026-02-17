export interface Lesson {
    id: string;
    title: string;
    description: string;
    content: string;
    moduleId: string;
    isPlus: boolean;
    duration: string;
    audio_url?: any; // Standardized from audioSource
}

export interface AcademyModule {
    id: string;
    title: string;
    description: string;
    icon: string;
    image?: any; // For cover image
    category: 'anxiety' | 'growth' | 'professional' | 'health' | 'sleep' | 'basics' | 'family';
    author?: string;
    duration?: string;
}

export const ACADEMY_MODULES: AcademyModule[] = [
    // 1. EXISTENTE
    {
        id: 'anxiety',
        title: 'Domina tu Ansiedad',
        description: 'Curso Piloto: 5 días para cambiar tu relación con el miedo.',
        icon: 'rainy-outline',
        category: 'anxiety',
        author: 'Dra. Aria',
        duration: '5 Días',
        image: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400&q=80',
    },
    // 2. FUNDAMENTOS
    {
        id: 'basics_intro',
        title: 'Fundamentos TCC',
        description: 'Tu kit de inicio. Entiende cómo tus pensamientos crean tu realidad.',
        icon: 'book-outline',
        category: 'basics',
        author: 'Dr. Ziro',
        duration: '4 Lecciones',
        image: 'https://images.unsplash.com/photo-1454165833744-96e6cf582bb1?w=400&q=80',
    },
    // 3. AUTOESTIMA
    {
        id: 'self_esteem',
        title: 'Autoestima de Acero',
        description: 'Deja de ser tu peor crítico. Construye una confianza inquebrantable.',
        icon: 'flash-outline',
        category: 'growth',
        author: 'Dra. Aria',
        duration: '6 Lecciones',
        image: 'https://images.unsplash.com/photo-1499728603263-137cb7ab3e1f?w=400&q=80',
    },
    // 4. DUELO
    {
        id: 'grief',
        title: 'Superando el Duelo',
        description: 'Navega las olas de la tristeza y encuentra luz tras la tormenta.',
        icon: 'heart-outline',
        category: 'growth',
        author: 'Dra. Aria',
        duration: '5 Lecciones',
        image: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?w=400&q=80',
    },
    // 5. INSOMNIO
    {
        id: 'insomnia',
        title: 'Adiós al Insomnio',
        description: 'Higiene del sueño y técnicas cognitivas para descansar de verdad.',
        icon: 'moon-outline',
        category: 'sleep',
        author: 'Dr. Ziro',
        duration: '7 Días',
        image: 'https://images.unsplash.com/photo-1511296183654-10129df48a55?w=400&q=80',
    },
    // 6. BURNOUT
    {
        id: 'burnout',
        title: 'Burnout: Apaga el Incendio',
        description: 'Para cuando el trabajo te consume. Recupera tu energía y límites.',
        icon: 'flame-outline',
        category: 'professional',
        author: 'Coach Marco',
        duration: '5 Lecciones',
        image: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=400&q=80',
    },
    // 7. LIDERAZGO
    {
        id: 'leadership',
        title: 'Liderazgo Consciente',
        description: 'Aprende a liderar sin imponer. Comunicación asertiva y empatía.',
        icon: 'briefcase-outline',
        category: 'professional',
        author: 'Coach Marco',
        duration: '6 Lecciones',
        image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=400&q=80',
    },
    // 8. CRIANZA
    {
        id: 'parenting',
        title: 'Crianza Consciente',
        description: 'Gestiona tus propias emociones para educar con calma y amor.',
        icon: 'people-outline',
        category: 'family',
        author: 'Dra. Elena',
        duration: '8 Lecciones',
        image: 'https://images.unsplash.com/photo-1591035897819-f4bdf739f446?w=400&q=80',
    },
    // 9. MINDFULNESS NIÑOS
    {
        id: 'kids_mindfulness',
        title: 'Mindfulness para Niños',
        description: 'Aventuras cortas para que los peques aprendan a calmarse.',
        icon: 'balloon-outline',
        category: 'family',
        author: 'Paziify Kids',
        duration: '10 Minijuegos',
        image: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=400&q=80',
    },
    // 10. ADOLESCENTES
    {
        id: 'teens_cbt',
        title: 'TCC para Adolescentes',
        description: 'Hackea tu mente: Guía de supervivencia para el caos emocional.',
        icon: 'headset-outline',
        category: 'family',
        author: 'Coach Joven',
        duration: '6 Lecciones',
        image: 'https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?w=400&q=80',
    },
];

export const ACADEMY_LESSONS: Lesson[] = [
    // --- 1. PILOT COURSE: DOMINA TU ANSIEDAD (Complete) ---
    {
        id: 'anxiety-1',
        audio_url: 'https://ueuxjtyottluwkvdreqe.supabase.co/storage/v1/object/public/academy-voices/anxiety-1.mp3',
        moduleId: 'anxiety',
        title: 'Día 1: La Falsa Alarma',
        description: 'Entiende por qué sientes lo que sientes. La neurociencia del miedo.',
        duration: '10 min',
        isPlus: false,

        content: `
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
        `,
    },
    {
        id: 'anxiety-2',
        audio_url: 'https://ueuxjtyottluwkvdreqe.supabase.co/storage/v1/object/public/academy-voices/anxiety-2.mp3',
        moduleId: 'anxiety',
        title: 'Día 2: El Ciclo del Pensamiento',
        description: 'Tus pensamientos no son hechos. Son hipótesis.',
        duration: '12 min',
        isPlus: false,

        content: `
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
        `,
    },
    {
        id: 'anxiety-3',
        audio_url: 'https://ueuxjtyottluwkvdreqe.supabase.co/storage/v1/object/public/academy-voices/anxiety-3.mp3',
        moduleId: 'anxiety',
        title: 'Día 3: Surfeando la Ola',
        description: 'Aprende a no luchar contra la sensación física.',
        duration: '8 min',
        isPlus: true,

        content: `
# Día 3: El Efecto del Oso Blanco 🐻‍❄️

Si te digo **"No pienses en un oso blanco"**, ¿en qué piensas?

Luchar contra la ansiedad ("¡No quiero sentir esto!") solo le da más fuerza. Le confirma a tu cerebro que ES un peligro.

## La Alternativa: Surfear 🏄
Imagina que la ansiedad es una ola.
- Si te pones rígido, te revuelca.
- Si te relajas y la observas, pasará por debajo de ti.

**Acéptala.** Di "Sí, siento ansiedad. Y está bien. Es solo energía atravesando mi cuerpo".
        `,
    },
    {
        id: 'anxiety-4',
        audio_url: 'https://ueuxjtyottluwkvdreqe.supabase.co/storage/v1/object/public/academy-voices/anxiety-4.mp3',
        moduleId: 'anxiety',
        title: 'Día 4: La Pausa Sagrada',
        description: 'Entre el estímulo y la respuesta, hay un espacio.',
        duration: '9 min',
        isPlus: true,

        content: `
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
        `,
    },
    {
        id: 'anxiety-5',
        audio_url: 'https://ueuxjtyottluwkvdreqe.supabase.co/storage/v1/object/public/academy-voices/anxiety-5.mp3',
        moduleId: 'anxiety',
        title: 'Día 5: Tu Caja de Herramientas',
        description: 'Plan de crisis y graduación.',
        duration: '11 min',
        isPlus: true,

        content: `
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
        `,
    },

    // --- 2. FUNDAMENTOS TCC ---
    {
        id: 'basics-1',
        audio_url: 'https://ueuxjtyottluwkvdreqe.supabase.co/storage/v1/object/public/academy-voices/basics-1.mp3',
        moduleId: 'basics_intro',
        title: 'Lección 1: ¿Qué es la realidad?',
        description: 'El modelo cognitivo.',
        duration: '5 min',
        isPlus: false,
        content: `
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
`
    },
    {
        id: 'basics-2',
        audio_url: 'https://ueuxjtyottluwkvdreqe.supabase.co/storage/v1/object/public/academy-voices/basics-2.mp3',
        moduleId: 'basics_intro',
        title: 'Lección 2: Pensamiento vs Hecho',
        description: 'Cómo distinguirlos.',
        duration: '6 min',
        isPlus: false,
        content: `
# 🕵️ Pensamiento vs. Hecho

A menudo confundimos nuestras opiniones con verdades absolutas.

* **Hecho:** "Mi amigo no me saludó." (Es objetivo, una cámara lo grabaría igual).
* **Pensamiento:** "Mi amigo está enfadado conmigo." (Es una hipótesis, una interpretación).

La ansiedad y la tristeza suelen venir de **tomar nuestros pensamientos como hechos**.

**Ejercicio:**
Escribe 3 cosas que te preocupan hoy. Luego marca cuáles son Hechos y cuáles son Pensamientos. Te sorprenderá.
`
    },
    {
        id: 'basics-3',
        audio_url: 'https://ueuxjtyottluwkvdreqe.supabase.co/storage/v1/object/public/academy-voices/basics-3.mp3',
        moduleId: 'basics_intro',
        title: 'Lección 3: Emociones Básicas',
        description: 'El lenguaje de tu cuerpo.',
        duration: '5 min',
        isPlus: true,
        content: `
# 💓 El Lenguaje del Cuerpo

Las emociones no son "malas". Son mensajeros químicos con una función vital:

* **Miedo:** "¡Peligro! Protégete."
* **Ira:** "¡Injusticia! Defiende tus límites."
* **Tristeza:** "¡Pérdida! Refúgiate y sana."
* **Alegría:** "¡Esto es bueno! Repítelo."

No intentes matar al mensajero. Escucha el mensaje y la emoción se suavizará. 
`
    },
    {
        id: 'basics-4',
        audio_url: 'https://ueuxjtyottluwkvdreqe.supabase.co/storage/v1/object/public/academy-voices/basics-4.mp3',
        moduleId: 'basics_intro',
        title: 'Lección 4: Conducta y Consecuencia',
        description: 'Rompiendo patrones.',
        duration: '7 min',
        isPlus: true,
        content: `
# 🔄 Rompiendo el Bucle

Lo que piensas afecta a lo que sientes.
Lo que sientes afecta a lo que **HACES**.

Si piensas "Voy a fallar", sientes miedo.
Si sientes miedo, **evitas** la situación.
Al evitarla, **confirmas** que era peligrosa. ¡Alerta de Bucle!

Para cambiar tu vida, a veces tienes que cambiar la Conducta (hacerlo con miedo) para demostrarle a tu cerebro que tu Pensamiento estaba equivocado.
`
    },

    // --- 3. AUTOESTIMA DE ACERO ---
    {
        id: 'esteem-1',
        audio_url: 'https://ueuxjtyottluwkvdreqe.supabase.co/storage/v1/object/public/academy-voices/esteem-1.mp3',
        moduleId: 'self_esteem',
        title: 'Lección 1: El Crítico Interior',
        description: 'Identificando el sabotaje.',
        duration: '8 min',
        isPlus: false,
        content: `
# 👹 El Crítico Interior

Todos tenemos una voz que nos dice:
- "No eres suficiente."
- "Vas a hacer el ridículo."
- "¿Quién te crees que eres?"

Esa voz NO ERES TÚ. Es una grabación antigua de miedos, críticas de otros o presiones sociales.

**Paso 1:** Ponle nombre a tu crítico (ej: "El Gruñón").
Cuando empiece a hablar, dile: "Gracias por tu opinión, Gruñón, pero yo estoy al mando".
`
    },
    {
        id: 'esteem-2',
        audio_url: 'https://ueuxjtyottluwkvdreqe.supabase.co/storage/v1/object/public/academy-voices/esteem-2.mp3',
        moduleId: 'self_esteem',
        title: 'Lección 2: Orígenes de la Duda',
        description: '¿De quién es esa voz?',
        duration: '9 min',
        isPlus: false,
        content: `
# 🌱 La Raíz

¿Cuándo empezaste a dudar de ti?
A menudo adoptamos la voz de un padre exigente, un profesor duro o un compañero cruel como nuestra propia voz interior.

**Ejercicio de arqueología:**
Esa frase hiriente que te repites... ¿a quién te recuerda? 
Devuelve esa crítica a su dueño original. No te pertenece. Tú naciste valioso/a.
`
    },
    {
        id: 'esteem-3',
        audio_url: 'https://ueuxjtyottluwkvdreqe.supabase.co/storage/v1/object/public/academy-voices/esteem-3.mp3',
        moduleId: 'self_esteem',
        title: 'Lección 3: Autocompasión Radical',
        description: 'Ser tu propio aliado.',
        duration: '7 min',
        isPlus: true,
        content: `
# 🫂 Sé tu Mejor Amigo

Si tu mejor amigo cometiera un error, ¿le dirías "Eres un inútil, ríndete"?
Probablemente no. Le dirías: "No pasa nada, aprendes y sigues".

¿Por qué te tratas a ti peor que a nadie?
La autocompasión no es autolástima. Es tratarte con la misma amabilidad y apoyo que das a quienes amas. Es la base de la verdadera fuerza.
`
    },
    {
        id: 'esteem-4',
        audio_url: 'https://ueuxjtyottluwkvdreqe.supabase.co/storage/v1/object/public/academy-voices/esteem-4.mp3',
        moduleId: 'self_esteem',
        title: 'Lección 4: Reescribiendo el Guion',
        description: 'Nuevas narrativas.',
        duration: '10 min',
        isPlus: true,
        content: `
# 📝 Nuevo Guion

Tu cerebro busca confirmación de lo que cree. Si crees que eres "torpe", tu cerebro ignorará 10 aciertos y señalará 1 error: "¿Lo ves?".

Vamos a entrenar al cerebro para buscar lo bueno.
**Diario de Logros:**
Cada noche, escribe 3 cosas que hiciste bien. Por pequeñas que sean.
"Me levanté a tiempo". "Fui amable con el camarero". "Terminé ese informe".

Reescribe tu identidad basándote en la evidencia de tus éxitos.
`
    },

    // --- 4. SUPERANDO EL DUELO ---
    {
        id: 'grief-1',
        audio_url: 'https://ueuxjtyottluwkvdreqe.supabase.co/storage/v1/object/public/academy-voices/grief-1.mp3',
        moduleId: 'grief',
        title: 'Lección 1: El Shock',
        description: 'Cuando el mundo se detiene.',
        duration: '10 min',
        isPlus: false,
        content: `
# ⛈️ El Shock

Acaba de ocurrir. El mundo sigue girando, pero el tuyo se ha parado.
Es normal sentirse entumecido, irreal o "en una película".
Es el mecanismo de defensa de tu cerebro para no recibir todo el dolor de golpe.

No te exijas "funcionar" ahora. Solo respira. Tu única tarea hoy es sobrevivir. Bebe agua. Come algo. Descansa.
`
    },
    {
        id: 'grief-2',
        audio_url: 'https://ueuxjtyottluwkvdreqe.supabase.co/storage/v1/object/public/academy-voices/grief-2.mp3',
        moduleId: 'grief',
        title: 'Lección 2: La Negación',
        description: 'Mecanismos de defensa.',
        duration: '8 min',
        isPlus: false,
        content: `
# 🚫 "No puede ser verdad"

Te descubres esperando su llamada. O pensando que es un error.
La negación nos da treguas. Nos permite dosificar el dolor.

No te juzgues si te pillas "olvidando" que pasó por un segundo. Es tu mente descansando.
Poco a poco, la realidad irá calando. Ten paciencia con tus ritmos.
`
    },
    // Truncated for space, assume next chunk fills the rest... 
    // Wait, I need to fill ALL placeholders for grief and insomnia here based on my plan.
    // I will fit Grief 3-5 and Insomnia 1-2 here.
    {
        id: 'grief-3',
        audio_url: 'https://ueuxjtyottluwkvdreqe.supabase.co/storage/v1/object/public/academy-voices/grief-3.mp3',
        moduleId: 'grief',
        title: 'Lección 3: Ira y Negociación',
        description: 'El fuego interior.',
        duration: '9 min',
        isPlus: true,
        content: `
# 🔥 ¿Por qué a mí?

La tristeza puede disfrazarse de rabia.
Rabia contra el médico, contra Dios, contra la vida, o incluso contra quien se fue por "abandonarte".
Es normal. La ira es energía; la tristeza es agotadora. A veces preferimos estar enfadados para no sentirnos rotos.

Y la negociación: "Si hago esto, ¿despertaré de la pesadilla?".
Permite que la ira salga (escribe, grita en el coche, haz deporte). No la guardes.
`
    },
    {
        id: 'grief-4',
        audio_url: 'https://ueuxjtyottluwkvdreqe.supabase.co/storage/v1/object/public/academy-voices/grief-4.mp3',
        moduleId: 'grief',
        title: 'Lección 4: La Tristeza Profunda',
        description: 'Honrar el dolor.',
        duration: '12 min',
        isPlus: true,
        content: `
# 🌊 La Ola

Cuando el shock y la ira bajan, llega la ola gigante de la tristeza.
Duele físicamente. El pecho, el estómago, el cansancio infinito.

No huyas. Este dolor es el precio del amor. Duele tanto porque importaba mucho.
Honra ese dolor. Llévalo contigo. No tienes que "superarlo" hoy. Solo tienes que dejar que te atraviese.
`
    },
    {
        id: 'grief-5',
        audio_url: 'https://ueuxjtyottluwkvdreqe.supabase.co/storage/v1/object/public/academy-voices/grief-5.mp3',
        moduleId: 'grief',
        title: 'Lección 5: Aceptación',
        description: 'Construyendo el nuevo yo.',
        duration: '10 min',
        isPlus: true,
        content: `
# 🌅 Un Nuevo Amanecer

Aceptación no es "estar feliz" de lo que pasó. Es aceptar que la realidad ha cambiado y decidir vivir en ella.
La cicatriz siempre estará, pero dejará de doler al tacto.

Empezarás a sonreír de nuevo, y al principio te sentirás culpable. No lo hagas. Tu alegría es el mejor homenaje a la vida.
`
    },

    // --- 5. ADIÓS AL INSOMNIO ---
    {
        id: 'insomnia-1',
        audio_url: 'https://ueuxjtyottluwkvdreqe.supabase.co/storage/v1/object/public/academy-voices/insomnia-1.mp3',
        moduleId: 'insomnia',
        title: 'Día 1: Ritmos Circadianos',
        description: 'Tu reloj interno.',
        duration: '8 min',
        isPlus: false,
        content: `
# ⏰ Tu Reloj Maestro

Tu cuerpo tiene un reloj interno de 24h. Si está desajustado, dormir es imposible.
El principal "ajustador" es la **LUZ**.

**Regla de Oro:**
Exponte a mucha luz natural por la mañana.
Evita la luz azul (pantallas) 2 horas antes de dormir.

Dile a tu cerebro cuándo es de día y cuándo es de noche.
`
    },
    {
        id: 'insomnia-2',
        audio_url: 'https://ueuxjtyottluwkvdreqe.supabase.co/storage/v1/object/public/academy-voices/insomnia-2.mp3',
        moduleId: 'insomnia',
        title: 'Día 2: Higiene del Sueño',
        description: 'El santuario del descanso.',
        duration: '10 min',
        isPlus: false,
        content: `
# 🛌 El Santuario

Tu habitación debe ser una cueva: Oscura, Fresca y Silenciosa.

Pero la higiene también es mental.
La cama es SOLO para dormir (y sexo).
No trabajes, no comas y NO DISCUTAS en la cama.
Tu cerebro debe asociar: Almohada = Apagado.
`
    },
    {
        id: 'insomnia-3',
        audio_url: 'https://ueuxjtyottluwkvdreqe.supabase.co/storage/v1/object/public/academy-voices/insomnia-3.mp3',
        moduleId: 'insomnia',
        title: 'Día 3: Desactivar la Mente',
        description: 'Técnicas de "apagado".',
        duration: '12 min',
        isPlus: true,
        content: `
# 🧠 Apagar el Ruido

¿Tu cabeza empieza a repasar la lista de la compra o errores de 2012 nada más tocar la almohada?
Tu cerebro está en "Modo Resolución de Problemas".

**Técnica: Descarga Mental**
2 horas antes de dormir, escribe en un papel todo lo que te preocupa o tienes pendiente. Cierra la libreta.
Dile a tu cerebro: "Ya está anotado. Mañana nos ocupamos. Ahora no puedo hacer nada".
`
    },
    {
        id: 'insomnia-4',
        audio_url: 'https://ueuxjtyottluwkvdreqe.supabase.co/storage/v1/object/public/academy-voices/insomnia-4.mp3',
        moduleId: 'insomnia',
        title: 'Día 4: Pesadillas y Despertares',
        description: 'Volver a dormir.',
        duration: '9 min',
        isPlus: true,
        content: `
# 🌃 Despertar a las 3 AM

Te despiertas. Miras el reloj. "Oh no, solo me quedan 3 horas". Pánico.
La ansiedad por no dormir ES lo que te impide dormir.

**Regla de los 20 minutos:**
Si no te duermes en lo que parecen 20 mins, SAL DE LA CAMA.
Ve al sofá, lee algo aburrido con luz tenue. Vuelve solo cuando tengas sueño real.
No te quedes en la cama peleando.
`
    },
    {
        id: 'insomnia-5',
        audio_url: 'https://ueuxjtyottluwkvdreqe.supabase.co/storage/v1/object/public/academy-voices/insomnia-5.mp3',
        moduleId: 'insomnia',
        title: 'Día 5: Relajación Progresiva',
        description: 'Escáner corporal profundo.',
        duration: '15 min',
        isPlus: true,
        content: `
# 🧘 Relajación de Jacobson

A veces la tensión es física y no te das cuenta.
Esta técnica consiste en tensar fuerte un grupo muscular (ej: puños) por 5 segundos, y soltar de golpe.
Siente el contraste.

Recorre todo tu cuerpo: pies, piernas, glúteos, abdomen, hombros, cara.
Deja tu cuerpo pesado, hundido en el colchón.
`
    },
    {
        id: 'insomnia-6',
        audio_url: 'https://ueuxjtyottluwkvdreqe.supabase.co/storage/v1/object/public/academy-voices/insomnia-6.mp3',
        moduleId: 'insomnia',
        title: 'Día 6: La Cama es para Dormir',
        description: 'Reasociación cognitiva.',
        duration: '8 min',
        isPlus: true,
        content: `
# 🛌 Control de Estímulos

Si pasas horas despierto/a en la cama sufriendo, tu cerebro asocia CAMA = SUFRIMIENTO.
Tenemos que romper esa asociación.

La cama es solo para dormir. Si no duermes, fuera.
Al principio dormirás menos tiempo total, pero el tiempo que pases en la cama será de sueño real (Eficiencia del Sueño).
Con el tiempo, tu cerebro volverá a asociar Cama = Placer y Descanso.
`
    },
    {
        id: 'insomnia-7',
        audio_url: 'https://ueuxjtyottluwkvdreqe.supabase.co/storage/v1/object/public/academy-voices/insomnia-7.mp3',
        moduleId: 'insomnia',
        title: 'Día 7: Tu Rutina Nocturna',
        description: 'Plan de mantenimiento.',
        duration: '10 min',
        isPlus: true,
        content: `
# 🌙 Ritual de Buenas Noches

Diseña tu rutina de 30-60 min antes de dormir:
1. Apagar pantallas.
2. Ducha tibia o infusión.
3. Leer papel o escuchar audio relajante (Paziify).
4. Agradecer 3 cosas del día.

Repite esto cada noche. Tu cuerpo aprenderá que esta secuencia significa "es hora de apagarse". ¡Dulces sueños!
`
    },

    // --- 6. BURNOUT ---
    {
        id: 'burnout-1',
        audio_url: 'https://ueuxjtyottluwkvdreqe.supabase.co/storage/v1/object/public/academy-voices/burnout-1.mp3',
        moduleId: 'burnout',
        title: 'Lección 1: Señales de Alarma',
        description: 'Cansancio vs Agotamiento.',
        duration: '8 min',
        isPlus: false,
        content: `
# 🔥 ¿Estoy Quemado?

El Burnout no es solo "estar cansado". Un fin de semana no lo cura.
Síntomas clave:
1. **Agotamiento Emocional**: Sentirte vaciado/a.
2. **Cinismo**: Odiar tu trabajo, criticar a todos, "me da igual todo".
3. **Ineficacia**: Sentir que nada de lo que haces importa.

Si estás aquí, para. Tu cuerpo te está gritando. Escúchalo.
`
    },
    {
        id: 'burnout-2',
        audio_url: 'https://ueuxjtyottluwkvdreqe.supabase.co/storage/v1/object/public/academy-voices/burnout-2.mp3',
        moduleId: 'burnout',
        title: 'Lección 2: Desconectar de Verdad',
        description: 'El derecho a no hacer nada.',
        duration: '10 min',
        isPlus: false,
        content: `
# 🔌 Recovery

Desconectar no es mirar Instagram mientras piensas en el email de mañana.
Desconectar es:
- No mirar el móvil del trabajo.
- Hacer cosas que absorban tu atención (deporte, pintar, cocinar).
- O simplemente... NO HACER NADA. Mirar el techo.

El "dolce far niente". Tu cerebro necesita esos espacios vacíos para regenerarse.
`
    },
    {
        id: 'burnout-3',
        audio_url: 'https://ueuxjtyottluwkvdreqe.supabase.co/storage/v1/object/public/academy-voices/burnout-3.mp3',
        moduleId: 'burnout',
        title: 'Lección 3: Límites Laborales',
        description: 'Decir no sin culpa.',
        duration: '9 min',
        isPlus: true,
        content: `
# 🚧 Poniendo Límites

Si siempre dices SÍ, tu SÍ pierde valor. Y tú pierdes salud.
Decir NO es profesional.
"No puedo asumir este proyecto si queremos mantener la calidad del otro".
"No respondo correos después de las 18h".

Al principio da miedo. Luego da respeto. La gente respeta a quien se respeta a sí mismo.
`
    },
    {
        id: 'burnout-4',
        audio_url: 'https://ueuxjtyottluwkvdreqe.supabase.co/storage/v1/object/public/academy-voices/burnout-4.mp3',
        moduleId: 'burnout',
        title: 'Lección 4: Recuperación Activa',
        description: 'Qué te recarga energía.',
        duration: '11 min',
        isPlus: true,
        content: `
# 🔋 ¿Qué te carga las pilas?

Haz dos listas:
1. **Vampiros de Energía**: Reuniones eternas, gente que se queja, el tráfico.
2. **Generadores de Energía**: Pasear, música, reír con amigos, dormir.

Tu objetivo: Minimizar la lista 1 y Maximizar la lista 2 cada día.
El equilibrio no se encuentra, se crea.
`
    },
    {
        id: 'burnout-5',
        audio_url: 'https://ueuxjtyottluwkvdreqe.supabase.co/storage/v1/object/public/academy-voices/burnout-5.mp3',
        moduleId: 'burnout',
        title: 'Lección 5: Rediseñando el Trabajo',
        description: 'Job crafting.',
        duration: '12 min',
        isPlus: true,
        content: `
# 🛠️ Job Crafting

A veces no puedes cambiar de trabajo, pero puedes cambiar CÓMO lo haces.
- ¿Puedes delegar lo que odias?
- ¿Puedes hacer más de lo que se te da bien?
- ¿Cómo puedes conectar tu tarea con un propósito mayor?

Recupera el control. No eres un engranaje, eres el conductor.
`
    },

    // --- 7. LIDERAZGO ---
    {
        id: 'lead-1',
        audio_url: 'https://ueuxjtyottluwkvdreqe.supabase.co/storage/v1/object/public/academy-voices/lead-1.mp3',
        moduleId: 'leadership',
        title: 'Lección 1: Estilos de Liderazgo',
        description: 'Conócete a ti mismo.',
        duration: '10 min',
        isPlus: false,
        content: `
# 🦁 Tipos de Líder

¿Eres un líder autoritario ("haz lo que digo"), democrático ("¿qué opináis?") o coach ("te ayudo a crecer")?
El mejor líder no es fijo; se adapta.

Pero la base siempre es la **Autenticidad**.
No intentes imitar a Steve Jobs. Sé la mejor versión de ti mismo guiando a otros.
`
    },
    {
        id: 'lead-2',
        audio_url: 'https://ueuxjtyottluwkvdreqe.supabase.co/storage/v1/object/public/academy-voices/lead-2.mp3',
        moduleId: 'leadership',
        title: 'Lección 2: Escucha Activa',
        description: 'Más allá de las palabras.',
        duration: '12 min',
        isPlus: false,
        content: `
# 👂 Escuchar para Entender

La mayoría escuchamos para responder. "Sí, pero...", "Yo haría...".
La Escucha Activa es escuchar para **ENTENDER**.

- Mira a los ojos.
- No interrumpas.
- Haz preguntas: "¿Qué quieres decir con...?", "¿Cómo te sientes con eso?".

Cuando alguien se siente realmente escuchado, baja sus defensas y la confianza se dispara.
`
    },
    {
        id: 'lead-3',
        audio_url: 'https://ueuxjtyottluwkvdreqe.supabase.co/storage/v1/object/public/academy-voices/lead-3.mp3',
        moduleId: 'leadership',
        title: 'Lección 3: Feedback Constructivo',
        description: 'Crecimiento, no crítica.',
        duration: '15 min',
        isPlus: true,
        content: `
# 🎁 El Regalo del Feedback

El feedback no es regañar. Es información para mejorar.
Modelo **SBI**:
- **Situation** (Situación): "Ayer en la reunión..."
- **Behavior** (Comportamiento): "...interrumpiste a Juan 3 veces..."
- **Impact** (Impacto): "...y él dejó de aportar ideas."

Sé específico. Duro con el problema, suave con la persona.
`
    },
    {
        id: 'lead-4',
        audio_url: 'https://ueuxjtyottluwkvdreqe.supabase.co/storage/v1/object/public/academy-voices/lead-4.mp3',
        moduleId: 'leadership',
        title: 'Lección 4: Gestión de Conflictos',
        description: 'El conflicto como oportunidad.',
        duration: '14 min',
        isPlus: true,
        content: `
# ⚔️ El Conflicto es Necesario

Un equipo sin conflictos es un equipo artificial o asustado.
El conflicto sano trae innovación y mejora.

No lo evites. Medialo.
Busca el interés común debajo de la posición de cada uno.
"Ambos queremos que el proyecto salga bien, solo diferimos en el CÓMO. Busquemos un tercer camino."
`
    },
    {
        id: 'lead-5',
        audio_url: 'https://ueuxjtyottluwkvdreqe.supabase.co/storage/v1/object/public/academy-voices/lead-5.mp3',
        moduleId: 'leadership',
        title: 'Lección 5: Motivación de Equipos',
        description: 'Propósito compartido.',
        duration: '10 min',
        isPlus: true,
        content: `
# 🚀 Motivación Intrínseca

El dinero motiva a corto plazo. El propósito a largo plazo.
La gente quiere sentir que su trabajo **IMPORTA**.

Conecta las tareas diarias con la visión global.
Celebra los pequeños avances. Hazles sentir parte de algo grande.
`
    },
    {
        id: 'lead-6',
        audio_url: 'https://ueuxjtyottluwkvdreqe.supabase.co/storage/v1/object/public/academy-voices/lead-6.mp3',
        moduleId: 'leadership',
        title: 'Lección 6: Liderazgo Remoto',
        description: 'Conectar en la distancia.',
        duration: '9 min',
        isPlus: true,
        content: `
# 💻 Liderar por Zoom

En remoto, perdemos el lenguaje corporal y la charla de café.
Debes ser intencional.
- Haz check-ins personales: "¿Cómo estáis hoy?" antes de hablar de trabajo.
- Sobrecomunica: lo obvio no es obvio en remoto.
- Confía: Mide resultados, no horas de silla.
`
    },

    // --- 8. CRIANZA CONSCIENTE ---
    {
        id: 'parent-1',
        audio_url: 'https://ueuxjtyottluwkvdreqe.supabase.co/storage/v1/object/public/academy-voices/parent-1.mp3',
        moduleId: 'parenting',
        title: 'Lección 1: Tu Propia Calma',
        description: 'Co-regulación nerviosa.',
        duration: '10 min',
        isPlus: false,
        content: `
# 🧘 Tú eres el Barómetro

No puedes pedirle a un niño que se calme si tú estás gritando.
Los niños tienen "neuronas espejo": copian tu estado nervioso.

Antes de intervenir en una rabieta, hazte un "Chequeo de Pulso".
¿Estoy yo calmado?
Si no, tómate 1 minuto. "Mamá necesita respirar un momento".
Estás modelando autocontrol. Eso es educar.
`
    },
    {
        id: 'parent-2',
        audio_url: 'https://ueuxjtyottluwkvdreqe.supabase.co/storage/v1/object/public/academy-voices/parent-2.mp3',
        moduleId: 'parenting',
        title: 'Lección 2: Entender la Rabia',
        description: 'El cerebro del niño.',
        duration: '12 min',
        isPlus: false,
        content: `
# 🧠 El Cerebro en Construcción

El cerebro racional (cortex prefrontal) no termina de formarse hasta los 25 años.
Cuando un niño tiene una rabieta, su cerebro racional está "desconectado". Ha sido secuestrado por la emoción.

Intentar razonar con un niño en plena rabieta es inútil.
Primero **CONECTA** (abrazo, validación), luego **REDIRIGE** (razonamiento).
`
    },
    {
        id: 'parent-3',
        audio_url: 'https://ueuxjtyottluwkvdreqe.supabase.co/storage/v1/object/public/academy-voices/parent-3.mp3',
        moduleId: 'parenting',
        title: 'Lección 3: Límites con Amor',
        description: 'Firmeza y amabilidad.',
        duration: '11 min',
        isPlus: true,
        content: `
# 🚧 Límites Seguros

Los límites dan seguridad. Un mundo sin límites asusta.
Pero poner límites no significa enfadarse.

Fórmula:
1. **Validar deseo**: "Sé que quieres seguir jugando..."
2. **Poner límite**: "...pero es hora de cenar."
3. **Dar opción**: "¿Quieres ir saltando o caminando a la mesa?"

Firme en el límite, amable en la forma.
`
    },
    {
        id: 'parent-4',
        audio_url: 'https://ueuxjtyottluwkvdreqe.supabase.co/storage/v1/object/public/academy-voices/parent-4.mp3',
        moduleId: 'parenting',
        title: 'Lección 4: Validar Emociones',
        description: 'Todas son bienvenidas.',
        duration: '9 min',
        isPlus: true,
        content: `
# 😭 "No llores"

Decir "no llores, no es para tanto" enseña al niño que sus emociones están mal o no son válidas.
En cambio, di: "Veo que estás triste/enfadado. Es normal. Estoy aquí contigo".

Validar la emoción no significa aceptar la conducta (pegar no vale).
"Está bien estar enfadado, pero no está bien pegar".
`
    },
    {
        id: 'parent-5',
        audio_url: 'https://ueuxjtyottluwkvdreqe.supabase.co/storage/v1/object/public/academy-voices/parent-5.mp3',
        moduleId: 'parenting',
        title: 'Lección 5: Juego y Conexión',
        description: 'El lenguaje del niño.',
        duration: '15 min',
        isPlus: true,
        content: `
# 🎲 El Juego es Serio

El juego es el lenguaje del niño. Conectas más jugando 10 minutos en el suelo que hablando 1 hora.
Dedica 15 minutos al día de "Tiempo Especial":
- Sin pantallas.
- El niño dirige el juego.
- Tú solo sigues y disfrutas.

Eso llena su "tanque de amor" y reduce los problemas de conducta.
`
    },
    {
        id: 'parent-6',
        audio_url: 'https://ueuxjtyottluwkvdreqe.supabase.co/storage/v1/object/public/academy-voices/parent-6.mp3',
        moduleId: 'parenting',
        title: 'Lección 6: Autonomía',
        description: 'Dejar hacer para crecer.',
        duration: '10 min',
        isPlus: true,
        content: `
# 🧒 "Yo Solito"

Es más rápido vestirlo tú. Pero es mejor que aprenda él.
Fomenta la autonomía dándole tareas adecuadas a su edad.
- Poner la mesa.
- Elegir su ropa (entre 2 opciones).

La autoestima nace de sentirse capaz ('Soy útil').
`
    },
    {
        id: 'parent-7',
        audio_url: 'https://ueuxjtyottluwkvdreqe.supabase.co/storage/v1/object/public/academy-voices/parent-7.mp3',
        moduleId: 'parenting',
        title: 'Lección 7: Conflictos entre Hermanos',
        description: 'Mediación.',
        duration: '12 min',
        isPlus: true,
        content: `
# 🥊 Peleas de Hermanos

No hagas de juez ("¿Quién empezó?"). Haz de mediador.
1. Describe lo que ves: "Veo dos niños enfadados y un solo juguete".
2. Escucha a ambos.
3. Pídeles soluciones: "¿Cómo podemos resolver esto para que los dos estéis bien?".

Enséñales a negociar, no a ganar.
`
    },
    {
        id: 'parent-8',
        audio_url: 'https://ueuxjtyottluwkvdreqe.supabase.co/storage/v1/object/public/academy-voices/parent-8.mp3',
        moduleId: 'parenting',
        title: 'Lección 8: Autocuidado para Padres',
        description: 'Llenar tu propia taza.',
        duration: '10 min',
        isPlus: true,
        content: `
# ☕ Cuídate para Cuidar

No eres un robot. Si estás agotado, tendrás menos paciencia.
El autocuidado no es un lujo, es responsabilidad parental.

Pide ayuda. Túrnate. Tómate ese café caliente. Lee 10 minutos.
Un padre descansado es un mejor padre que uno mártir y amargado.
`
    },

    // --- 9. MINDFULNESS NIÑOS ---
    {
        id: 'kids-1',
        audio_url: 'https://ueuxjtyottluwkvdreqe.supabase.co/storage/v1/object/public/academy-voices/kids-1.mp3',
        moduleId: 'kids_mindfulness',
        title: '1: El Globo Mágico',
        description: 'Respiración abdominal.',
        duration: '5 min',
        isPlus: false,
        content: `
# 🎈 El Globo Mágico

Imagina que tienes un globo de tu color favorito en la barriga.
Cuando entra el aire por la nariz... ¡el globo se hincha! (Pon las manos en la barriga).
Cuando sale el aire... ¡el globo se deshincha! fffffff...

Vamos a hincharlo y deshincharlo 5 veces. Muy despacito.
`
    },
    {
        id: 'kids-2',
        audio_url: 'https://ueuxjtyottluwkvdreqe.supabase.co/storage/v1/object/public/academy-voices/kids-2.mp3',
        moduleId: 'kids_mindfulness',
        title: '2: La Ranita Quieta',
        description: 'Atención plena.',
        duration: '4 min',
        isPlus: false,
        content: `
# 🐸 La Ranita

Las ranas saltan mucho, pero también saben estar MUY quietas observando moscas.
Vamos a jugar a ser ranas.
Siéntate como una rana. Cierra los ojos.
Quédate muy muy quieto. ¿Qué escuchas? ¿Qué hueles?
Si te viene un pensamiento "saltarín", déjalo pasar y vuelve a estar quieto.
`
    },
    {
        id: 'kids-3',
        audio_url: 'https://ueuxjtyottluwkvdreqe.supabase.co/storage/v1/object/public/academy-voices/kids-3.mp3',
        moduleId: 'kids_mindfulness',
        title: '3: El Botón de Pausa',
        description: 'Parar y sentir.',
        duration: '5 min',
        isPlus: false,
        content: `
# ⏸️ El Botón de Pausa

Imagina que tienes un botón de PAUSA en el pecho.
Cuando estés enfadado o quieras pegar... ¡PULSA EL BOTÓN!
(Hacemos el gesto de pulsar).

Todo se para. Respira 3 veces.
Ahora, ¿qué quieres hacer? ¿Seguimos jugando o necesitamos un abrazo?
`
    },
    {
        id: 'kids-4',
        audio_url: 'https://ueuxjtyottluwkvdreqe.supabase.co/storage/v1/object/public/academy-voices/kids-4.mp3',
        moduleId: 'kids_mindfulness',
        title: '4: Superpoderes de Escucha',
        description: 'Sonidos lejanos.',
        duration: '6 min',
        isPlus: false,
        content: `
# 👂 Oídos de Búho

Vamos a activar nuestros super-oídos.
Cierra los ojos.
Intenta escuchar un sonido que esté muy lejos (fuera de la casa, un coche, un pájaro...).
Ahora uno que esté dentro de la habitación (el reloj, tu respiración...).
¡Qué bien oyes!
`
    },
    {
        id: 'kids-5',
        audio_url: 'https://ueuxjtyottluwkvdreqe.supabase.co/storage/v1/object/public/academy-voices/kids-5.mp3',
        moduleId: 'kids_mindfulness',
        title: '5: Escáner de Rayos X',
        description: 'Sintiendo el cuerpo.',
        duration: '7 min',
        isPlus: true,
        content: `
# 🦴 Rayos X

Túmbate. Vamos a pasar un escáner mágico desde los pies a la cabeza.
¿Cómo sientes los dedos del pie? Muevelos.
¿Y las rodillas? ¿Y la barriga? ¿Está blanda o dura?
¿Los hombros están arriba o abajo?
La la cara... ¿estás apretando los dientes? Suelta la mandíbula como si estuviera dormida.
`
    },
    {
        id: 'kids-6',
        audio_url: 'https://ueuxjtyottluwkvdreqe.supabase.co/storage/v1/object/public/academy-voices/kids-6.mp3',
        moduleId: 'kids_mindfulness',
        title: '6: La Montaña Fuerte',
        description: 'Postura y fortaleza.',
        duration: '5 min',
        isPlus: true,
        content: `
# 🏔️ La Montaña

Ponte de pie, piernas separadas como un superhéroe.
Eres una montaña gigante.
Viene el viento (sopla)... pero la montaña no se mueve.
Viene la lluvia... la montaña sigue ahí.
Aunque estés triste o enfadado (como una tormenta), tú eres fuerte como la montaña. La tormenta pasará, la montaña se queda.
`
    },
    {
        id: 'kids-7',
        audio_url: 'https://ueuxjtyottluwkvdreqe.supabase.co/storage/v1/object/public/academy-voices/kids-7.mp3',
        moduleId: 'kids_mindfulness',
        title: '7: Nubes en el Cielo',
        description: 'Observar pensamientos.',
        duration: '6 min',
        isPlus: true,
        content: `
# ☁️ Nubes

Tu mente es el cielo azul.
Tus pensamientos son nubes que pasan.
A veces hay nubes negras y feas (miedo, enfado).
A veces nubes blancas y bonitas.
Pero tú no eres las nubes. Tú eres el cielo.
Mira cómo pasan las nubes sin agarrarlas. Adiós nube.
`
    },
    {
        id: 'kids-8',
        audio_url: 'https://ueuxjtyottluwkvdreqe.supabase.co/storage/v1/object/public/academy-voices/kids-8.mp3',
        moduleId: 'kids_mindfulness',
        title: '8: Corazón Amable',
        description: 'Enviando amor.',
        duration: '5 min',
        isPlus: true,
        content: `
# ❤️ Corazón Mágico

Pon las manos en tu corazón. ¿Lo sientes latir?
Imagina una luz dorada y calentita que sale de él.
Vamos a enviarle esa luz a:
1. Ti mismo (di: "Que yo sea feliz").
2. A alguien que quieres mucho (mamá, papá, abuelos...).
3. A todo el mundo. ¡Luz para todos!
`
    },
    {
        id: 'kids-9',
        audio_url: 'https://ueuxjtyottluwkvdreqe.supabase.co/storage/v1/object/public/academy-voices/kids-9.mp3',
        moduleId: 'kids_mindfulness',
        title: '9: El Espagueti',
        description: 'Tensión y relajación.',
        duration: '6 min',
        isPlus: true,
        content: `
# 🍝 El Espagueti

Imagina que eres un espagueti crudo. ¡Duro y tieso!
Aprieta todo el cuerpo: puños, cara, piernas. ¡Duro, duro, duro! (Aguanta 3 segundos).

¡Ahora al agua caliente!
Te pones blandito, fofo y relajado. Muévete como un fideo cocido.
¡Ahhh, qué a gusto se está blandito!
`
    },
    {
        id: 'kids-10',
        audio_url: 'https://ueuxjtyottluwkvdreqe.supabase.co/storage/v1/object/public/academy-voices/kids-10.mp3',
        moduleId: 'kids_mindfulness',
        title: '10: El Lugar Seguro',
        description: 'Visualización.',
        duration: '8 min',
        isPlus: true,
        content: `
# 🏰 Tu Escondite Secreto

Cierra los ojos. Vamos a viajar a tu Lugar Seguro.
Puede ser una cabaña en un árbol, una playa, una nube...
¿Cómo es? Constrúyelo en tu mente.
Aquí nada malo puede pasar. Tienes todo lo que te gusta.
Siempre que tengas miedo, puedes cerrar los ojos y venir aquí.
`
    },

    // --- 10. TCC ADOLESCENTES ---
    {
        id: 'teens-1',
        audio_url: 'https://ueuxjtyottluwkvdreqe.supabase.co/storage/v1/object/public/academy-voices/teens-1.mp3',
        moduleId: 'teens_cbt',
        title: 'Lección 1: Tu Cerebro Hackeado',
        description: 'Neurociencia teen.',
        duration: '8 min',
        isPlus: false,
        content: `
# 🧠 Cerebro en Obras

Si sientes que nadie te entiende o que tus emociones son una montaña rusa... ¡Felicidades, tu cerebro funciona!
Durante la adolescencia, tu zona emocional (Sistema Límbico) está a tope de Power.
Pero tu freno racional (Cortex Prefrontal) está en obras.

Es como tener un Ferrari con frenos de bicicleta.
No estás loco/a. Es biología. Ten paciencia contigo mismo/a.
`
    },
    {
        id: 'teens-2',
        audio_url: 'https://ueuxjtyottluwkvdreqe.supabase.co/storage/v1/object/public/academy-voices/teens-2.mp3',
        moduleId: 'teens_cbt',
        title: 'Lección 2: Drama vs Realidad',
        description: 'Pensamientos extremos.',
        duration: '10 min',
        isPlus: false,
        content: `
# 🎭 Drama Queen / King

El cerebro adolescente tiende al **"Todo o Nada"**.
- "Si suspendo esto, mi vida se acaba."
- "Si no le gusto, moriré solo."

Esto se llama **Catastrofismo**.
Cuando pienses en extremos, busca el gris.
"Si suspendo, es una faena, pero puedo recuperar. No es el fin del mundo."
`
    },
    {
        id: 'teens-3',
        audio_url: 'https://ueuxjtyottluwkvdreqe.supabase.co/storage/v1/object/public/academy-voices/teens-3.mp3',
        moduleId: 'teens_cbt',
        title: 'Lección 3: La Presión Social',
        description: 'Ser tú mismo.',
        duration: '9 min',
        isPlus: true,
        content: `
# 👁️ El Ojo que Todo lo Ve

A esta edad, sentimos que todos nos miran (Audiencia Imaginaria).
"Si llevo estas zapatillas, se reirán".

Spoiler: La gente está demasiado ocupada pensando en sus propias zapatillas y miedos como para fijarse tanto en ti.
Sé tú. Es la única forma de encontrar a tu verdadera tribu.
`
    },
    {
        id: 'teens-4',
        audio_url: 'https://ueuxjtyottluwkvdreqe.supabase.co/storage/v1/object/public/academy-voices/teens-4.mp3',
        moduleId: 'teens_cbt',
        title: 'Lección 4: Ansiedad en Exámenes',
        description: 'Rendir bajo presión.',
        duration: '12 min',
        isPlus: true,
        content: `
# 📝 Miedo al Blanco

La ansiedad antes de un examen es normal. Un poco te ayuda a estudiar. Demasiada te bloquea.

Si te bloqueas:
1. Suelta el boli.
2. Respira hondo 3 veces (hincha la barriga).
3. Di: "Me lo sé. Solo necesito un momento para que mi cerebro encuentre el archivo".
4. Empieza por la pregunta más fácil para ganar confianza.
`
    },
    {
        id: 'teens-5',
        audio_url: 'https://ueuxjtyottluwkvdreqe.supabase.co/storage/v1/object/public/academy-voices/teens-5.mp3',
        moduleId: 'teens_cbt',
        title: 'Lección 5: Redes Anti-Sociales',
        description: 'Comparación y FOMO.',
        duration: '10 min',
        isPlus: true,
        content: `
# 📱 La Trampa de Instagram

En redes ves los "Highlights" de los demás. Sus mejores momentos, filtros y fiestas.
Tú comparas SU peli editada con TU "detrás de las cámaras" (tus granos, tu aburrimiento, tus dudas).

Esa comparación es injusta y falsa.
Si te hace sentir mal, deja de seguir (Unfollow terapéutico). Tu feed debe inspirarte, no hundirte.
`
    },
    {
        id: 'teens-6',
        audio_url: 'https://ueuxjtyottluwkvdreqe.supabase.co/storage/v1/object/public/academy-voices/teens-6.mp3',
        moduleId: 'teens_cbt',
        title: 'Lección 6: Tu Futuro',
        description: 'Metas y valores.',
        duration: '15 min',
        isPlus: true,
        content: `
# 🚀 Tu Propio Camino

Te preguntan "¿Qué quieres ser?" y te agobias.
Mejor pregunta: "¿Quién quieres ser?".
¿Qué valores te importan? ¿La libertad, la ayuda, la creatividad, el dinero?

No tienes que decidir tu vida entera hoy. Solo el siguiente paso.
Prueba cosas. Equivócate. El camino se hace andando.
`
    },
];

