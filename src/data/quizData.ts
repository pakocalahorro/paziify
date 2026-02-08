export interface QuizQuestion {
    id: string;
    text: string;
    options: string[];
    correctIndex: number;
}

export interface CourseQuiz {
    courseId: string;
    title: string;
    questions: QuizQuestion[];
    passingScore: number;
}

export const ACADEMY_QUIZZES: Record<string, CourseQuiz> = {
    'anxiety': {
        courseId: 'anxiety',
        title: 'Examen Final: Domina tu Ansiedad',
        passingScore: 4, // 80% pass rate
        questions: [
            {
                id: 'q1',
                text: '¿Cuál es la función principal de la amígdala según el curso?',
                options: [
                    'Producir pensamientos felices',
                    'Detectar peligros (como tigres) para protegerte',
                    'Controlar la digestión',
                    'Generar sueño profundo'
                ],
                correctIndex: 1
            },
            {
                id: 'q2',
                text: 'En el Triángulo Cognitivo, ¿qué viene justo antes de la Emoción?',
                options: [
                    'La Situación',
                    'La Acción',
                    'El Pensamiento (Interpretación)',
                    'El Castigo'
                ],
                correctIndex: 2
            },
            {
                id: 'q3',
                text: '¿Qué efecto produce intentar suprimir la ansiedad ("No quiero sentir esto")?',
                options: [
                    'La elimina inmediatamente',
                    'La hace más fuerte (Efecto Oso Blanco)',
                    'Te hace dormir mejor',
                    'No tiene ningún efecto'
                ],
                correctIndex: 1
            },
            {
                id: 'q4',
                text: '¿Qué significa la "S" en la técnica S.T.O.P.?',
                options: [
                    'Salir corriendo',
                    'Saltar',
                    'Stop (Detente físicamente)',
                    'Sonreír'
                ],
                correctIndex: 2
            },
            {
                id: 'q5',
                text: '¿Cuál es el objetivo final de este curso respecto a la ansiedad?',
                options: [
                    'Eliminarla para siempre',
                    'Ignorarla hasta que desaparezca',
                    'Cambiar tu relación con ella y gestionarla',
                    'Tomar medicación inmediatamente'
                ],
                correctIndex: 2
            }
        ]
    },
    // --- NUEVOS EXÁMENES ---
    'basics_intro': {
        courseId: 'basics_intro',
        title: 'Examen: Fundamentos TCC',
        passingScore: 3,
        questions: [
            { id: 'b1', text: '¿Qué es un pensamiento automático?', options: ['Una verdad absoluta', 'Una interpretación rápida y subjetiva', 'Una orden divina', 'Un hecho científico'], correctIndex: 1 },
            { id: 'b2', text: '¿Las emociones son buenas o malas?', options: ['Las negativas son malas', 'Todas son información valiosa', 'Debemos ignorarlas', 'Solo las positivas importan'], correctIndex: 1 },
            { id: 'b3', text: '¿Qué conecta el modelo TCC?', options: ['Pensamiento, Emoción y Conducta', 'Cuerpo y Alma', 'Pasado y Futuro', 'Sueño y Vigilia'], correctIndex: 0 },
            { id: 'b4', text: '¿Podemos cambiar lo que sentimos directamente?', options: ['Sí, con fuerza de voluntad', 'No, pero podemos cambiar lo que pensamos y hacemos', 'Solo con medicación', 'Nadie puede cambiar nada'], correctIndex: 1 }
        ]
    },
    'self_esteem': {
        courseId: 'self_esteem',
        title: 'Examen: Autoestima de Acero',
        passingScore: 4,
        questions: [
            { id: 's1', text: '¿Quién es el crítico interior?', options: ['Tu mejor amigo', 'Una voz saboteadora interna', 'Tu jefe', 'Tu madre'], correctIndex: 1 },
            { id: 's2', text: '¿Qué es la autocompasión?', options: ['Sentir lástima por uno mismo', 'Tratarse con la misma amabilidad que a un amigo', 'Ser egoísta', 'Ignorar tus errores'], correctIndex: 1 },
            { id: 's3', text: '¿Los límites son...', options: ['Muros para aislarte', 'Actos de egoísmo', 'Necesarios para el autorespeto', 'Opcionales'], correctIndex: 2 },
            { id: 's4', text: '¿Tu valor depende de tus logros?', options: ['Sí, totalmente', 'No, es intrínseco', 'Solo si ganas mucho dinero', 'Depende de la opinión de otros'], correctIndex: 1 },
            { id: 's5', text: '¿Cómo se "reescribe el guion"?', options: ['Borrando la memoria', 'Cuestionando creencias limitantes antiguas', 'Mintiendo sobre el pasado', 'Ignorando la realidad'], correctIndex: 1 }
        ]
    },
    'grief': {
        courseId: 'grief',
        title: 'Examen: Superando el Duelo',
        passingScore: 3,
        questions: [
            { id: 'g1', text: '¿El duelo es un proceso lineal?', options: ['Sí, tiene pasos fijos', 'No, es cíclico y desordenado', 'Dura exactamente un año', 'Se supera en una semana'], correctIndex: 1 },
            { id: 'g2', text: '¿Es normal sentir ira durante el duelo?', options: ['No, es incorrecto', 'Sí, es una parte natural del proceso', 'Solo si eres mala persona', 'Nunca sucede'], correctIndex: 1 },
            { id: 'g3', text: '¿Qué es la aceptación?', options: ['Olvidar a la persona', 'Estar feliz de que se fuera', 'Integrar la pérdida y seguir viviendo', 'Rendirse'], correctIndex: 2 },
            { id: 'g4', text: '¿Se debe llorar?', options: ['No, hay que ser fuerte', 'Sí, las lágrimas liberan estrés', 'Solo en privado', 'Es signo de debilidad'], correctIndex: 1 }
        ]
    },
    'insomnia': {
        courseId: 'insomnia',
        title: 'Examen: Adiós al Insomnio',
        passingScore: 4,
        questions: [
            { id: 'i1', text: '¿Qué luz perjudica más el sueño?', options: ['Luz roja', 'Luz azul (pantallas)', 'Luz de velas', 'Luz de luna'], correctIndex: 1 },
            { id: 'i2', text: 'Si no puedes dormir en 20 min, debes...', options: ['Quedarte en la cama sufriendo', 'Levantarte y hacer algo aburrido', 'Mirar el móvil', 'Tomar café'], correctIndex: 1 },
            { id: 'i3', text: '¿La cama es para...', options: ['Comer y ver TV', 'Trabajar y dormir', 'Solo dormir y sexo', 'Discutir con la pareja'], correctIndex: 2 },
            { id: 'i4', text: '¿El alcohol ayuda a dormir?', options: ['Sí, mejora la calidad', 'No, fragmenta el sueño y reduce el descanso profundo', 'Es indiferente', 'Solo cerveza'], correctIndex: 1 },
            { id: 'i5', text: '¿Qué es la relajación progresiva?', options: ['Tensar y relajar músculos', 'Correr antes de dormir', 'Ver una película de acción', 'Gritar en la almohada'], correctIndex: 0 }
        ]
    },
    'burnout': {
        courseId: 'burnout',
        title: 'Examen: Burnout',
        passingScore: 3,
        questions: [
            { id: 'bu1', text: 'Diferencia entre estrés y burnout', options: ['Son lo mismo', 'El estrés es exceso, el burnout es vacío/agotamiento', 'El burnout es físico, el estrés mental', 'No existen'], correctIndex: 1 },
            { id: 'bu2', text: '¿Qué es esencial para prevenir el burnout?', options: ['Trabajar más horas', 'Poner límites claros', 'Ignorar el cansancio', 'Quejarse siempre'], correctIndex: 1 },
            { id: 'bu3', text: '¿Descansar es...', options: ['Perder el tiempo', 'Un premio por trabajar', 'Una necesidad biológica y productiva', 'De vagos'], correctIndex: 2 },
            { id: 'bu4', text: '¿Qué es el Job Crafting?', options: ['Hacer manualidades', 'Rediseñar tu trabajo para que encaje contigo', 'Cambiar de empleo cada mes', 'Delegar todo'], correctIndex: 1 }
        ]
    },
    'leadership': {
        courseId: 'leadership',
        title: 'Examen: Liderazgo Consciente',
        passingScore: 4,
        questions: [
            { id: 'l1', text: 'Un líder empático...', options: ['Es débil', 'Entiende y valida las emociones de su equipo', 'Hace el trabajo de todos', 'Nunca se enfada'], correctIndex: 1 },
            { id: 'l2', text: 'La escucha activa implica...', options: ['Oír esperando tu turno para hablar', 'Prestar atención total y preguntar', 'Mirar el móvil mientras te hablan', 'Interrumpir para corregir'], correctIndex: 1 },
            { id: 'l3', text: 'El feedback debe ser...', options: ['Duro y público', 'Constructivo, específico y privado', 'Anónimo y vago', 'Evitado siempre'], correctIndex: 1 },
            { id: 'l4', text: '¿El conflicto es siempre malo?', options: ['Sí, debe evitarse', 'No, puede ser una oportunidad de crecimiento', 'Depende del día', 'Solo si gritan'], correctIndex: 1 },
            { id: 'l5', text: '¿Motivar es solo dar dinero?', options: ['Sí, es lo único que importa', 'No, el propósito y reconocimiento importan más', 'El dinero no importa nada', 'Solo con pizza'], correctIndex: 1 }
        ]
    },
    'parenting': {
        courseId: 'parenting',
        title: 'Examen: Crianza Consciente',
        passingScore: 4,
        questions: [
            { id: 'p1', text: '¿Qué es la co-regulación?', options: ['El niño se calma solo', 'El adulto presta su calma al sistema nervioso del niño', 'Castigar para calmar', 'Ignorar el llanto'], correctIndex: 1 },
            { id: 'p2', text: '¿Todas las emociones son aceptables?', options: ['Solo las felices', 'Sí, todas las emociones, pero no todas las conductas', 'No, la rabia es mala', 'Solo si no molestan'], correctIndex: 1 },
            { id: 'p3', text: 'Para poner límites efectivos...', options: ['Hay que gritar', 'Hay que ser firme y amable a la vez', 'Hay que pegar', 'Mejor no ponerlos'], correctIndex: 1 },
            { id: 'p4', text: '¿El autocuidado de los padres es...', options: ['Egoísta', 'Necesario para poder cuidar bien', 'Un lujo inalcanzable', 'Pérdida de tiempo'], correctIndex: 1 },
            { id: 'p5', text: '¿Qué aprenden los niños del juego?', options: ['Nada, solo pierden el tiempo', 'Habilidades sociales, emocionales y cognitivas', 'A ser competitivos', 'A desordenar'], correctIndex: 1 }
        ]
    },
    'kids_mindfulness': {
        courseId: 'kids_mindfulness',
        title: 'Diploma de Superhéroe',
        passingScore: 3,
        questions: [
            { id: 'k1', text: '¿Cómo respiramos para calmarnos?', options: ['Rápido como un perro', 'Lento hinchando la barriga como un globo', 'No respiramos', 'Por la boca haciendo ruido'], correctIndex: 1 },
            { id: 'k2', text: '¿Qué hace la Ranita?', options: ['Salta sin parar', 'Se queda quieta y atenta', 'Se esconde', 'Come moscas'], correctIndex: 1 },
            { id: 'k3', text: 'Si tienes un pensamiento feo...', options: ['Pégale', 'Déjalo pasar como una nube', 'Grita', 'Llora'], correctIndex: 1 },
            { id: 'k4', text: '¿Dónde está tu lugar seguro?', options: ['En tu imaginación', 'En la escuela', 'En el hospital', 'En la calle'], correctIndex: 0 }
        ]
    },
    'teens_cbt': {
        courseId: 'teens_cbt',
        title: 'Examen: Hackea tu Mente',
        passingScore: 4,
        questions: [
            { id: 't1', text: '¿Por qué las emociones se sienten tan intensas en la adolescencia?', options: ['Porque el cerebro emocional madura antes que el racional', 'Porque sois dramáticos', 'No es real', 'Por la comida'], correctIndex: 0 },
            { id: 't2', text: '¿Qué es el FOMO?', options: ['Miedo a las arañas', 'Miedo a perderse algo (Fear Of Missing Out)', 'Una marca de ropa', 'Un tipo de música'], correctIndex: 1 },
            { id: 't3', text: 'Ante un ataque de ansiedad...', options: ['Respira y racionaliza', 'Corre en círculos', 'Publicalo en TikTok', 'Desmayate'], correctIndex: 0 },
            { id: 't4', text: '¿Tu valor depende de los likes?', options: ['Sí, totalmente', 'No, tu valor es incondicional', 'Solo si eres influencer', 'A veces'], correctIndex: 1 },
            { id: 't5', text: '¿Qué hacer si te sientes abrumado?', options: ['Guardártelo todo', 'Pedir ayuda y hablar', 'Explotar', 'Dormir 24h'], correctIndex: 1 }
        ]
    }
};
