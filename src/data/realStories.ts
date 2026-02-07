import { RealStory } from '../types';

export const MENTES_MAESTRAS_STORIES: Omit<RealStory, 'id' | 'created_at'>[] = [
    // 1. Steve Jobs
    {
        title: 'El Zen en la Tecnología',
        subtitle: 'La simplicidad como máxima sofisticación',
        story_text: 'Steve Jobs no solo fue un visionario tecnológico, sino un practicante devoto del Zen durante gran parte de su vida.\n\n**El Desafío:** A principios de los 70, Jobs buscaba sentido más allá de la electrónica. Sentía que su mente era caótica y ruidosa.\n**El Descubrimiento:** Viajó a la India y descubrió la meditación Zen. Aprendió que si te sientas y observas, tu mente se aquieta.\n**La Transformación:** Esta práctica definió la estética de Apple. Eliminó lo innecesario, enfocándose en la pureza. "Tienes que trabajar duro para limpiar tu pensamiento y hacerlo simple", decía. Su intuición, afinada por años de silencio, se convirtió en su mayor herramienta de diseño.',
        character_name: 'Steve Jobs',
        character_role: 'Visionario Tech',
        category: 'professional',
        tags: ['focus', 'creativity', 'zen'],
        reading_time_minutes: 5,
        transformation_theme: 'Simplicidad',
        is_featured: true,
        is_premium: false
    },
    // 2. Kobe Bryant
    {
        title: 'La Mentalidad Mamba',
        subtitle: 'El silencio antes del estadio lleno',
        story_text: 'Kobe Bryant es sinónimo de intensidad, pero su secreto era la quietud.\n\n**El Desafío:** Con la presión de ganar anillos y el desgaste físico, Kobe necesitaba una forma de mantener su mente afilada.\n**El Descubrimiento:** Incorporó la meditación diaria (mindfulness) a su rutina. Phil Jackson, su entrenador, le introdujo a esta práctica.\n**La Transformación:** Kobe meditaba cada mañana. Esto le permitía "ver" el juego en cámara lenta. Decía que el mindfulness le ayudaba a recalibrar y estar presente, sin importar si fallaba un tiro o ganaba un campeonato. La Mamba Mentality nace de la calma interior.',
        character_name: 'Kobe Bryant',
        character_role: 'Leyenda NBA',
        category: 'professional',
        tags: ['focus', 'resilience', 'sports'],
        reading_time_minutes: 6,
        transformation_theme: 'Enfoque',
        is_featured: true,
        is_premium: false
    },
    // 3. Marco Aurelio
    {
        title: 'El Emperador Estoico',
        subtitle: 'Gobernando el mundo desde la calma',
        story_text: 'Considerado el último de los "Cinco Buenos Emperadores", Marco Aurelio gobernó Roma durante guerras y plagas, pero su batalla más importante fue interna.\n\n**El Desafío:** El peso del imperio más grande del mundo y la traición constante amenazaban con corromper su carácter.\n**El Descubrimiento:** Escribía un diario personal (sus "Meditaciones") cada noche, no para publicar, sino para recordarse a sí mismo cómo ser virtuoso.\n**La Transformación:** "Tienes poder sobre tu mente, no sobre los eventos externos". Su práctica estoica le permitió liderar con sabiduría y temple, recordándonos siglos después que la paz viene de nuestra percepción, no de nuestras circunstancias.',
        character_name: 'Marco Aurelio',
        character_role: 'Emperador Romano',
        category: 'growth',
        tags: ['stoicism', 'control', 'leadership'],
        reading_time_minutes: 7,
        transformation_theme: 'Resiliencia',
        is_featured: true,
        is_premium: false
    },
    // 4. Arianna Huffington
    {
        title: 'Del Colapso al Despertar',
        subtitle: 'El éxito no requiere quemarse',
        story_text: 'Fundadora de The Huffington Post, Arianna era la imagen del éxito moderno hasta que su cuerpo dijo basta.\n\n**El Desafío:** En 2007, colapsó por agotamiento y falta de sueño, rompiéndose el pómulo contra su escritorio. Se dio cuenta de que su definición de éxito la estaba matando.\n**El Descubrimiento:** Redefinió su vida priorizando el sueño y la desconexión digital.\n**La Transformación:** Se convirtió en una evangelista de la "Revolución del Sueño". Aprendió que dormir no es tiempo perdido, sino la base de la toma de decisiones efectiva y la alegría de vivir. Su transformación inspiró a millones a dejar el móvil fuera del dormitorio.',
        character_name: 'Arianna Huffington',
        character_role: 'Empresaria',
        category: 'sleep',
        tags: ['sleep', 'burnout', 'balance'],
        reading_time_minutes: 5,
        transformation_theme: 'Descanso',
        is_featured: true,
        is_premium: false
    },
    // 5. Michael Jordan
    {
        title: 'El Maestro del Ahora',
        subtitle: 'Estar presente en el último segundo',
        story_text: 'Muchos ven sus dunks, pero pocos ven su mente. Michael Jordan trabajó con el famoso entrenador de mindfulness George Mumford.\n\n**El Desafío:** La presión mediática y la expectativa de perfección generaban una ansiedad inmensa antes de cada partido crucial.\n**El Descubrimiento:** Aprendió a estar "en la zona", un estado de flujo donde no hay pasado ni futuro, solo el momento presente.\n**La Transformación:** Con ejercicios de respiración, Jordan lograba bajar sus pulsaciones en los momentos críticos. "Ese tiro fue Zen", decían sus compañeros. Su capacidad para bloquear el ruido externo es lo que le hacía letal en los últimos segundos.',
        character_name: 'Michael Jordan',
        character_role: 'Atleta GOAT',
        category: 'professional',
        tags: ['flow', 'pressure', 'sports'],
        reading_time_minutes: 6,
        transformation_theme: 'Presencia',
        is_featured: true,
        is_premium: false
    },
    // 6. Oprah Winfrey
    {
        title: 'La Quietud es Poder',
        subtitle: 'Conectando con la intuición',
        story_text: 'Oprah ha entrevistado a miles de personas, pero su conversación más importante es consigo misma cada mañana.\n\n**El Desafío:** Con una agenda imposible y el ruido de la fama, Oprah sentía que perdía su centro y su voz auténtica.\n**El Descubrimiento:** Empezó a practicar la Meditación Trascendental, dedicando 20 minutos dos veces al día a la quietud absoluta.\n**La Transformación:** "La meditación es como volver a casa", dice. Atribuye su capacidad de empatía y conexión con el público a ese espacio de silencio que cultiva. Afirma que sus mejores decisiones de negocios no vinieron del análisis, sino de la intuición surgida en la calma.',
        character_name: 'Oprah Winfrey',
        character_role: 'Icono Media',
        category: 'growth',
        tags: ['intuition', 'calm', 'spirituality'],
        reading_time_minutes: 5,
        transformation_theme: 'Intuición',
        is_featured: true,
        is_premium: true
    },
    // 7. Hugh Jackman
    {
        title: 'Lobezno Medita',
        subtitle: 'La vulnerabilidad detrás del héroe',
        story_text: 'Conocido por sus papeles de acción, Hugh Jackman lidió durante años con una ansiedad paralizante antes de salir a escena.\n\n**El Desafío:** El miedo escénico y la presión de Hollywood le generaban tensión constante.\n**El Descubrimiento:** Descubrió la meditación hace décadas y la practica religiosamente antes de cada rodaje o show en Broadway.\n**La Transformación:** "En la meditación, todo se vuelve claro y la ansiedad baja". Jackman usa la práctica para soltar el ego y conectar con sus personajes desde un lugar de verdad, no de miedo. Demuestra que ser fuerte también significa ser consciente.',
        character_name: 'Hugh Jackman',
        character_role: 'Actor',
        category: 'anxiety',
        tags: ['anxiety', 'performance', 'acting'],
        reading_time_minutes: 4,
        transformation_theme: 'Calma',
        is_featured: false,
        is_premium: false
    },
    // 8. Novak Djokovic
    {
        title: 'Resiliencia Mental',
        subtitle: 'Ganando partidos en la mente',
        story_text: 'Djokovic es conocido por su elasticidad física, pero su fuerza mental es lo que le separa del resto.\n\n**El Desafío:** En momentos de alta tensión, la frustración solía dominarle.\n**El Descubrimiento:** El mindfulness se convirtió en parte de su entrenamiento tanto como el tenis. Practica yoga y visualización diaria.\n**La Transformación:** Nole utiliza la respiración consciente en los descansos para resetear su sistema nervioso. Ha ganado innumerables partidos tras ir perdiendo, simplemente volviendo al presente punto a punto. Su mente es su mayor raqueta.',
        character_name: 'Novak Djokovic',
        character_role: 'Tenista N1',
        category: 'health',
        tags: ['resilience', 'focus', 'recovery'],
        reading_time_minutes: 6,
        transformation_theme: 'Fortaleza',
        is_featured: true,
        is_premium: false
    },
    // 9. The Beatles
    {
        title: 'El Viaje a Rishikesh',
        subtitle: 'El álbum blanco y la meditación',
        story_text: 'En 1968, la banda más grande del mundo hizo las maletas y se fue a la India.\n\n**El Desafío:** Tras la muerte de su manager Brian Epstein y el agotamiento de la fama, se sentían perdidos espiritualmente.\n**El Descubrimiento:** Estudiaron Meditación Trascendental con el Maharishi Mahesh Yogi.\n**La Transformación:** Ese viaje fue uno de sus periodos más creativos, escribiendo gran parte del "White Album". Canciones como "Dear Prudence" nacieron allí. Aprendieron que la creatividad fluye mejor cuando desconectas del mundo exterior y miras hacia adentro.',
        character_name: 'The Beatles',
        character_role: 'Músicos',
        category: 'growth',
        tags: ['creativity', 'music', 'history'],
        reading_time_minutes: 8,
        transformation_theme: 'Creatividad',
        is_featured: true,
        is_premium: true
    },
    // 10. Rick Rubin
    {
        title: 'El Productor Zen',
        subtitle: 'Escuchando lo que no se oye',
        story_text: 'Rick Rubin, productor legendario (Adele, RHCP, Johnny Cash), parece un gurú, y en cierto modo lo es.\n\n**El Desafío:** La industria musical está llena de ruido y egos. ¿Cómo sacar la verdad de un artista?\n**El Descubrimiento:** Practica meditación desde los 14 años. Su estudio es un santuario de calma.\n**La Transformación:** Rubin no impone, escucha. Su práctica le permite estar presente sin juzgar, creando un espacio vacío donde el artista se siente seguro para ser vulnerable. Enseña que la creatividad no es forzar, sino permitir que la idea llegue.',
        character_name: 'Rick Rubin',
        character_role: 'Productor Musical',
        category: 'professional',
        tags: ['creativity', 'listening', 'art'],
        reading_time_minutes: 5,
        transformation_theme: 'Escucha Profunda',
        is_featured: false,
        is_premium: false
    },
    // 11. David Lynch
    {
        title: 'Atrapando el Gran Pez',
        subtitle: 'Ideas desde la profundidad',
        story_text: 'El director de cine surrealista David Lynch es uno de los defensores más vocales de la meditación.\n\n**El Desafío:** Muchos creen que el arte necesita sufrimiento ("el artista torturado"), pero Lynch rechaza esto. El sufrimiento bloquea el flujo.\n**El Descubrimiento:** Lynch lleva más de 40 años sin fallar un día de Meditación Trascendental.\n**La Transformación:** Compara la consciencia con un océano. En la superficie hay olas (ruido), pero en la profundidad hay calma. Cuanto más profundo vas, "peces" (ideas) más grandes y puros puedes atrapar. Su cine único nace de esa profundidad silenciosa.',
        character_name: 'David Lynch',
        character_role: 'Director de Cine',
        category: 'growth',
        tags: ['creativity', 'ideas', 'flow'],
        reading_time_minutes: 5,
        transformation_theme: 'Profundidad',
        is_featured: false,
        is_premium: false
    },
    // 12. Gisele Bündchen
    {
        title: 'Lecciones de una Supermodelo',
        subtitle: 'La ansiedad no discrimina',
        story_text: 'A los 20 años, Gisele tenía ataques de pánico en ascensores y aviones, a pesar de estar en la cima de su carrera.\n\n**El Desafío:** Bebía café y vino para gestionar el estrés, creando un ciclo tóxico de ansiedad.\n**El Descubrimiento:** Cambió su estilo de vida radicalmente: yoga, meditación y nutrición natural.\n**La Transformación:** Gisele usa el pranayama (respiración yóguica) para anclarse. Aprendió a observar sus pensamientos ansiosos sin ser arrastrada por ellos. Hoy enseña que tu cuerpo es tu templo y la paz mental es el verdadero éxito.',
        character_name: 'Gisele Bündchen',
        character_role: 'Modelo y Autora',
        category: 'anxiety',
        tags: ['anxiety', 'panic', 'yoga'],
        reading_time_minutes: 6,
        transformation_theme: 'Equilibrio',
        is_featured: false,
        is_premium: false
    },
    // 13. Paul McCartney
    {
        title: 'Encontrando la Calma en la Tormenta',
        subtitle: 'Momentos de quietud en una vida legendaria',
        story_text: 'Más allá de The Beatles, Paul ha mantenido su práctica de meditación durante décadas.\n\n**El Desafío:** Mantenerse cuerdo y creativo durante 60 años de fama ininterrumpida.\n**El Descubrimiento:** "En momentos de locura, la meditación me da un momento de quietud".\n**La Transformación:** La usa antes de salir al escenario o entrar al estudio. No como una práctica mística compleja, sino como una herramienta práctica para "bajar las revoluciones" y reconectar con la alegría simple de hacer música.',
        character_name: 'Paul McCartney',
        character_role: 'Músico',
        category: 'growth',
        tags: ['music', 'longevity', 'calm'],
        reading_time_minutes: 4,
        transformation_theme: 'Constancia',
        is_featured: false,
        is_premium: false
    },
    // 14. Emma Watson
    {
        title: 'La Magia del Slow Living',
        subtitle: 'Creciendo bajo los focos',
        story_text: 'Crecer siendo Hermione Granger puso una presión inimaginable sobre Emma Watson desde niña.\n\n**El Desafío:** La necesidad constante de complacer y la exposición pública le generaban un fuerte síndrome del impostor.\n**El Descubrimiento:** Se certificó como instructora de yoga y meditación.\n**La Transformación:** Emma aboga por el "Slow Living", tomarse tiempo para estar y no solo hacer. La meditación le ayudó a diferenciar su valor personal de su imagen pública, permitiéndole ser activista y actriz desde un lugar de autenticidad.',
        character_name: 'Emma Watson',
        character_role: 'Actriz y Activista',
        category: 'growth',
        tags: ['imposter_syndrome', 'balance', 'yoga'],
        reading_time_minutes: 5,
        transformation_theme: 'Autenticidad',
        is_featured: false,
        is_premium: false
    },
    // 15. Seneca
    {
        title: 'El Filósofo Práctico',
        subtitle: 'Cartas para la vida moderna',
        story_text: 'Aunque vivió hace 2000 años, Séneca fue el "Tim Ferriss" de su época: rico, influyente, pero obsesionado con la sabiduría práctica.\n\n**El Desafío:** Vivir en la corte de Nerón, un emperador inestable, significaba peligro de muerte diario.\n**El Descubrimiento:** El Estoicismo: prepararse mentalmente para la adversidad ("Premeditatio Malorum").\n**La Transformación:** Séneca enseñaba a disfrutar de la riqueza sin apegarse a ella. "Sufrimos más en la imaginación que en la realidad". Sus cartas nos enseñan hoy a gestionar el tiempo y a no ser esclavos de la fortuna.',
        character_name: 'Séneca',
        character_role: 'Filósofo Estoico',
        category: 'growth',
        tags: ['stoicism', 'time_management', 'fear'],
        reading_time_minutes: 7,
        transformation_theme: 'Perspectiva',
        is_featured: true,
        is_premium: true
    },
    // 16. Viktor Frankl
    {
        title: 'El Hombre en Busca de Sentido',
        subtitle: 'La libertad última',
        story_text: 'Sobreviviente del Holocausto y psiquiatra, Frankl descubrió la verdad más profunda del ser humano en las peores condiciones imaginables.\n\n**El Desafío:** Sobrevivir a los campos de concentración nazis sin perder la esperanza.\n**El Descubrimiento:** "A un hombre le pueden robar todo, menos una cosa: la última de las libertades humanas — la elección de su actitud ante cualquier circunstancia".\n**La Transformación:** Frankl usó su mente para visualizar a su esposa y sus conferencias futuras mientras sufría. Su Logoterapia enseña que encontrar un "porqué" nos permite soportar cualquier "cómo".',
        character_name: 'Viktor Frankl',
        character_role: 'Psiquiatra',
        category: 'growth',
        tags: ['resilience', 'meaning', 'hope'],
        reading_time_minutes: 8,
        transformation_theme: 'Sentido',
        is_featured: true,
        is_premium: true
    },
    // 17. Keanu Reeves
    {
        title: 'La Bondad Silenciosa',
        subtitle: 'Sanando a través de la presencia',
        story_text: 'Keanu es famoso por su humildad y generosidad, a pesar de haber sufrido tragedias personales devastadoras.\n\n**El Desafío:** La pérdida de su mejor amigo, su hija y su pareja podrían haberle destruido.\n**El Descubrimiento:** No habla mucho de su práctica, pero encarna el no-apego y la compasión budista.\n**La Transformación:** En lugar de amargarse, Keanu eligió la bondad. "El luto cambia de forma, pero nunca termina". Su "meditación" es la acción: regalar motos a sus dobles, ceder su asiento en el metro. Nos enseña que la paz interior se manifiesta en cómo tratas a los demás.',
        character_name: 'Keanu Reeves',
        character_role: 'Actor',
        category: 'relationships',
        tags: ['grief', 'kindness', 'humility'],
        reading_time_minutes: 5,
        transformation_theme: 'Compasión',
        is_featured: true,
        is_premium: false
    },
    // 18. Nelson Mandela
    {
        title: '46664: Paciencia Infinita',
        subtitle: 'Libertad tras las rejas',
        story_text: '27 años en prisión podrían haberle llenado de odio. En cambio, salió listo para perdonar y unir a una nación.\n\n**El Desafío:** El aislamiento y la injusticia del Apartheid.\n**El Descubrimiento:** Mandela usó sus años en la celda para disciplinar su mente y estudiar a sus opresores.\n**La Transformación:** "Si no dejo atrás mi amargura y mi odio, seguiré estando en prisión". Su capacidad para gestionar sus emociones y ver la humanidad en el enemigo evitó una guerra civil. La paciencia no es pasividad, es una estrategia.',
        character_name: 'Nelson Mandela',
        character_role: 'Líder Mundial',
        category: 'growth',
        tags: ['patience', 'forgiveness', 'leadership'],
        reading_time_minutes: 7,
        transformation_theme: 'Paciencia',
        is_featured: true,
        is_premium: true
    },
    // 19. Phil Jackson
    {
        title: 'El Maestro Zen del Basket',
        subtitle: '11 Anillos de Plenitud',
        story_text: 'Entrenador de Jordan y Kobe. Phil Jackson trajo el mindfulness a la NBA cuando nadie sabía qué era.\n\n**El Desafío:** Gestionar los egos más grandes del deporte (Jordan, Pippen, Shaq, Kobe) y hacerlos jugar como uno.\n**El Descubrimiento:** Usaba el Zen y la cultura nativa americana. Hacía meditar a los Bulls en el vestuario a oscuras.\n**La Transformación:** Enseñó a sus jugadores a jugar el "baloncesto invisible": la conexión telepática que surge cuando dejas el ego ("yo") por el equipo ("nosotros"). Su éxito prueba que la espiritualidad y el alto rendimiento van de la mano.',
        character_name: 'Phil Jackson',
        character_role: 'Entrenador NBA',
        category: 'professional',
        tags: ['leadership', 'teamwork', 'zen'],
        reading_time_minutes: 6,
        transformation_theme: 'Liderazgo',
        is_featured: false,
        is_premium: false
    },
    // 20. Bruce Lee
    {
        title: 'Sé como el Agua',
        subtitle: 'La filosofía del combate y la vida',
        story_text: 'Bruce Lee no era solo un luchador, era un filósofo. Su arte marcial, Jeet Kune Do, es pura meditación en movimiento.\n\n**El Desafío:** Superar los límites rígidos de los estilos tradicionales y sus propias limitaciones físicas.\n**El Descubrimiento:** El Taoísmo. "Vacía tu mente, sé amorfo, moldeable, como el agua".\n**La Transformación:** El agua puede fluir o puede golpear. Bruce Lee aplicó la adaptabilidad total a su vida. No te quedes rígido en una creencia o técnica. Su legado es la flexibilidad mental: adáptate a lo que viene, y serás invencible.',
        character_name: 'Bruce Lee',
        character_role: 'Artista Marcial',
        category: 'professional',
        tags: ['adaptability', 'flow', 'philosophy'],
        reading_time_minutes: 5,
        transformation_theme: 'Fluidez',
        is_featured: true,
        is_premium: false
    },
    // 21. Thich Nhat Hanh
    {
        title: 'El Milagro del Mindfulness',
        subtitle: 'Paz en cada paso',
        story_text: 'Monje vietnamita nominado al Nobel por Martin Luther King. Trajo el mindfulness a Occidente con una simplicidad radical.\n\n**El Desafío:** Vivir la guerra de Vietnam y el exilio sin perder la compasión.\n**El Descubrimiento:** "Lavar los platos para lavar los platos". El mindfulness no es solo sentarse, es estar presente en cada acto cotidiano.\n**La Transformación:** Enseñó que podemos generar paz en cualquier momento simplemente respirando y sonriendo. "La paz está en cada paso". Su legado es que la iluminación está disponible ahora mismo, pelando una naranja o caminando.',
        character_name: 'Thich Nhat Hanh',
        character_role: 'Monje Zen',
        category: 'growth',
        tags: ['mindfulness', 'presence', 'peace'],
        reading_time_minutes: 6,
        transformation_theme: 'Sencillez',
        is_featured: true,
        is_premium: true
    },
    // 22. Jerry Seinfeld
    {
        title: 'Comedia y Trascendencia',
        subtitle: 'La consistencia del éxito',
        story_text: 'El comediante más exitoso del mundo atribuye su longevidad y energía a una técnica específica.\n\n**El Desafío:** El agotamiento de escribir y actuar en una sitcom semanal número uno.\n**El Descubrimiento:** Meditación Trascendental. "Es como un cargador de móvil para tu mente y cuerpo".\n**La Transformación:** Jerry lo hace cada día, al mediodía. Dice que le da la energía de haber dormido 5 horas. Su enfoque obsesivo en el detalle y su capacidad de trabajo incansable se apoyan en esta recuperación profunda diaria.',
        character_name: 'Jerry Seinfeld',
        character_role: 'Comediante',
        category: 'professional',
        tags: ['energy', 'consistency', 'work'],
        reading_time_minutes: 4,
        transformation_theme: 'Energía',
        is_featured: false,
        is_premium: false
    },
    // 23. Herman Hesse
    {
        title: 'Siddhartha y la Búsqueda',
        subtitle: 'Escuchando al río',
        story_text: 'Autor alemán que exploró la espiritualidad oriental, influenciando a generaciones de buscadores.\n\n**El Desafío:** La crisis espiritual de la Europa de entreguerras y su propia búsqueda de identidad.\n**El Descubrimiento:** En su libro "Siddhartha", el protagonista encuentra la iluminación no en la doctrina, sino escuchando al río y viviendo la experiencia simple.\n**La Transformación:** Hesse nos recuerda que la sabiduría no se puede enseñar, solo se puede aprender viviendo. Debemos encontrar nuestra propia verdad, incluso si eso significa dejar a los maestros atrás.',
        character_name: 'Hermann Hesse',
        character_role: 'Escritor',
        category: 'growth',
        tags: ['wisdom', 'journey', 'literature'],
        reading_time_minutes: 6,
        transformation_theme: 'Búsqueda',
        is_featured: false,
        is_premium: false
    },
    // 24. Mahatma Gandhi
    {
        title: 'La Fuerza de la Verdad',
        subtitle: 'Satyagraha y silencio',
        story_text: 'Lideró la independencia de la India sin disparar una bala, armado solo con su convicción espiritual.\n\n**El Desafío:** Enfrentar al Imperio Británico con violencia hubiera sido un suicidio y moralmente incorrecto para él.\n**El Descubrimiento:** El ayuno y el día de silencio semanal. Gandhi no hablaba los lunes para conservar energía y clarificar sus pensamientos.\n**La Transformación:** Su fuerza política nacía de su fuerza espiritual. Demostró que la no-violencia (Ahimsa) requiere más valentía que la violencia. Su paz interior era tan fuerte que desarmaba a sus oponentes.',
        character_name: 'Mahatma Gandhi',
        character_role: 'Líder Espiritual',
        category: 'relationships',
        tags: ['peace', 'non-violence', 'truth'],
        reading_time_minutes: 7,
        transformation_theme: 'Verdad',
        is_featured: true,
        is_premium: true
    },
    // 25. Frida Kahlo
    {
        title: 'Pintando el Dolor',
        subtitle: 'El arte como sanación',
        story_text: 'Frida vivió con dolor físico crónico toda su vida tras un accidente de autobús.\n\n**El Desafío:** Confinada a una cama durante meses, con la columna rota y dolor constante.\n**El Descubrimiento:** Usó la pintura como una forma de meditación activa y catarsis. "Pinto autorretratos porque estoy mucho tiempo sola".\n**La Transformación:** En lugar de ignorar su sufrimiento, lo miró de frente y lo transformó en belleza. Su resiliencia radical nos enseña a aceptar nuestras heridas ("Viva la Vida") y usarlas como combustible creativo en lugar de dejarnos consumir por ellas.',
        character_name: 'Frida Kahlo',
        character_role: 'Artista',
        category: 'anxiety',
        tags: ['pain', 'art', 'resilience'],
        reading_time_minutes: 5,
        transformation_theme: 'Transformación',
        is_featured: true,
        is_premium: false
    },
    // 26. Nikola Tesla
    {
        title: 'El Laboratorio Mental',
        subtitle: 'Construyendo en la imaginación',
        story_text: 'El inventor que electrificó el mundo tenía un método de trabajo único.\n\n**El Desafío:** Tesla no tenía dinero para construir prototipos infinitos.\n**El Descubrimiento:** La Visualización Hiper-realista. Tesla construía, probaba y corregía sus máquinas enteramente en su mente antes de tocar un tornillo.\n**La Transformación:** "Mis inventos son absolutamente reales en mi mente". Su capacidad de concentración era tan profunda que podía simular el desgaste de las piezas mentalmente. Nos enseña el poder ilimitado de la imaginación enfocada.',
        character_name: 'Nikola Tesla',
        character_role: 'Inventor',
        category: 'professional',
        tags: ['visualization', 'imagination', 'focus'],
        reading_time_minutes: 6,
        transformation_theme: 'Visualización',
        is_featured: true,
        is_premium: false
    },
    // 27. Ray Dalio
    {
        title: 'Principios y Meditación',
        subtitle: 'La clave del éxito financiero',
        story_text: 'Fundador de Bridgewater, el fondo de cobertura más grande del mundo.\n\n**El Desafío:** Tomar decisiones de miles de millones de dólares sin dejar que el miedo o la codicia interfieran.\n**El Descubrimiento:** Dalio atribuye TODO su éxito a la Meditación Trascendental, más que a cualquier otra cosa.\n**La Transformación:** La meditación le da "mente de ninja": la capacidad de ver las cosas como son, no como desearía que fueran. Su enfoque en la "Verdad Radical" y la transparencia nace de esa claridad mental desapegada del ego.',
        character_name: 'Ray Dalio',
        character_role: 'Inversor',
        category: 'professional',
        tags: ['decisions', 'business', 'truth'],
        reading_time_minutes: 5,
        transformation_theme: 'Claridad',
        is_featured: false,
        is_premium: false
    },
    // 28. Epicteto
    {
        title: 'El Esclavo que se hizo Libre',
        subtitle: 'El arte de vivir',
        story_text: 'Nació esclavo, cojo y pobre, pero se convirtió en uno de los grandes maestros estoicos.\n\n**El Desafío:** No tenía control sobre su cuerpo ni su libertad física.\n**El Descubrimiento:** La Dicotomía del Control. "Solo controla tu mente y tus reacciones. Lo demás (cuerpo, reputación, riqueza) no es tuyo".\n**La Transformación:** Epicteto era más libre que su amo porque nadie podía herir su mente. Enseñó que no son las cosas las que nos perturban, sino nuestra opinión sobre ellas. Su filosofía es la base de la Terapia Cognitiva Conductual moderna.',
        character_name: 'Epicteto',
        character_role: 'Filósofo Estoico',
        category: 'growth',
        tags: ['stoicism', 'freedom', 'perspective'],
        reading_time_minutes: 6,
        transformation_theme: 'Libertad',
        is_featured: true,
        is_premium: true
    },
    // 29. J.K. Rowling
    {
        title: 'Tocando Fondo',
        subtitle: 'Cuando el fracaso es la base',
        story_text: 'Antes de Harry Potter, Joanne era madre soltera, desempleada y clínicamente deprimida.\n\n**El Desafío:** Sentirse un fracaso total según los estándares de la sociedad. Destrozada por la ansiedad.\n**El Descubrimiento:** Aceptación. "Tocar fondo se convirtió en la base sólida sobre la que reconstruí mi vida".\n**La Transformación:** Al perder el miedo a fallar (porque ya había pasado), se liberó para escribir lo que realmente amaba. Los Dementores de sus libros son una metáfora de su depresión, y el Patronus es la fuerza de los recuerdos felices. Transformó sus demonios en magia.',
        character_name: 'J.K. Rowling',
        character_role: 'Escritora',
        category: 'growth',
        tags: ['failure', 'depression', 'creativity'],
        reading_time_minutes: 6,
        transformation_theme: 'Renacer',
        is_featured: true,
        is_premium: false
    },
    // 30. Walt Disney
    {
        title: 'El Soñador Práctico',
        subtitle: 'Si puedes soñarlo...',
        story_text: 'Disney creó mundos donde no existían, pero no era solo un soñador ingenuo.\n\n**El Desafío:** Múltiples bancarrotas y gente diciéndole que nadie vería una película de animación de una hora.\n**El Descubrimiento:** Tenía tres "habitaciones" mentales: El Soñador (sin límites), El Realista (cómo hacerlo) y El Crítico (qué falta).\n**La Transformación:** Su capacidad para visitar el estado del "Soñador" sin juicios prematuros es similar a la meditación creativa. Nos enseña a suspender la incredulidad y permitir que la imaginación florezca antes de juzgarla.',
        character_name: 'Walt Disney',
        character_role: 'Creador',
        category: 'growth',
        tags: ['creativity', 'dreams', 'persistence'],
        reading_time_minutes: 5,
        transformation_theme: 'Imaginación',
        is_featured: false,
        is_premium: false
    },
    // 31. Simone Biles
    {
        title: 'El Valor de Parar',
        subtitle: 'La salud mental es oro',
        story_text: 'La mejor gimnasta de la historia sorprendió al mundo al retirarse en las Olimpiadas de Tokio.\n\n**El Desafío:** Los "twisties" (pérdida de orientación en el aire) y una presión global aplastante.\n**El Descubrimiento:** Poner límites. "Tengo que hacer lo que es bueno para mí y centrarme en mi salud mental, no ponerla en peligro".\n**La Transformación:** Su valiente "no" inspiró más que sus medallas. Enseñó al mundo que somos humanos antes que productos o atletas. La verdadera fortaleza a veces es saber cuándo parar y respirar.',
        character_name: 'Simone Biles',
        character_role: 'Atleta Olímpica',
        category: 'health',
        tags: ['mental_health', 'boundaries', 'courage'],
        reading_time_minutes: 5,
        transformation_theme: 'Límites',
        is_featured: true,
        is_premium: false
    },
    // 32. Jeff Weiner
    {
        title: 'Liderazgo Compasivo',
        subtitle: 'El CEO de LinkedIn',
        story_text: 'En un mundo tech despiadado, Jeff Weiner apostó por la compasión.\n\n**El Desafío:** Gestionar una empresa de hiper-crecimiento sin perder la cultura humana.\n**El Descubrimiento:** El concepto de "Compassionate Management" del Dalai Lama.\n**La Transformación:** Weiner usa la meditación diaria (app Headspace, curiosamente) para cultivar espacio entre estímulo y respuesta. "La compasión no es ser blando, es ponerte en los zapatos del otro para entender cómo ayudarle mejor". Transformó la cultura corporativa moderna.',
        character_name: 'Jeff Weiner',
        character_role: 'Ex-CEO LinkedIn',
        category: 'professional',
        tags: ['leadership', 'compassion', 'business'],
        reading_time_minutes: 5,
        transformation_theme: 'Gestión',
        is_featured: false,
        is_premium: false
    },
    // 33. Lao Tsé
    {
        title: 'El Viejo Maestro',
        subtitle: 'El arte de no hacer nada',
        story_text: 'El legendario autor del Tao Te Ching nos dejó el concepto de Wu Wei.\n\n**El Desafío:** Vivir en un mundo de conflicto y ambición desmedida.\n**El Descubrimiento:** Wu Wei (Acción sin esfuerzo). "La naturaleza no se apresura, y sin embargo todo se cumple".\n**La Transformación:** Enseñó que forzar las cosas va contra el Tao (el flujo del universo). Ser flexible como el bambú es mejor que ser rígido como el roble. Su sabiduría nos invita a dejar de remar contra corriente y empezar a navegar.',
        character_name: 'Lao Tsé',
        character_role: 'Filósofo Taoísta',
        category: 'growth',
        tags: ['tao', 'flow', 'nature'],
        reading_time_minutes: 6,
        transformation_theme: 'Wu Wei',
        is_featured: true,
        is_premium: true
    },
    // 34. Tim Ferriss
    {
        title: 'Estoicismo Moderno',
        subtitle: 'Diseñando tu vida',
        story_text: 'El autor de "La semana laboral de 4 horas" es un obseso de optimizar la mente humana.\n\n**El Desafío:** Tendencia al suicidio en su juventud y ansiedad crónica.\n**El Descubrimiento:** El Estoicismo como "sistema operativo" para decisiones difíciles. "Fear Setting" (Definición del Miedo) en lugar de Goal Setting.\n**La Transformación:** Tim visualiza el peor escenario posible para quitarle poder al miedo. Su práctica de meditación y escritura matutina le permite filtrar el ruido y centrarse en lo esencial. Ha popularizado la sabiduría antigua para problemas modernos.',
        character_name: 'Tim Ferriss',
        character_role: 'Podcaster',
        category: 'professional',
        tags: ['stoicism', 'optimization', 'fear'],
        reading_time_minutes: 6,
        transformation_theme: 'Estrategia',
        is_featured: false,
        is_premium: false
    },
    // 35. Dalai Lama
    {
        title: 'La Sonrisa del Tíbet',
        subtitle: 'La felicidad es un entrenamiento',
        story_text: 'El líder espiritual del budismo tibetano es la encarnación de la alegría, a pesar del exilio.\n\n**El Desafío:** La pérdida de su país y el sufrimiento de su pueblo.\n**El Descubrimiento:** "La felicidad no es algo que viene hecho. Viene de tus propias acciones".\n**La Transformación:** Entrena su mente cada día en la compasión analítica. Insiste en que la empatía y el altruismo son egoístas, porque nos hacen sentir mejor a nosotros mismos. Su risa contagiosa es prueba de una mente libre de odio.',
        character_name: 'Dalai Lama',
        character_role: 'Líder Espiritual',
        category: 'growth',
        tags: ['happiness', 'compassion', 'mind'],
        reading_time_minutes: 5,
        transformation_theme: 'Alegría',
        is_featured: true,
        is_premium: true
    },
    // 36. Michael Phelps
    {
        title: 'El Peso del Oro',
        subtitle: 'Nadando a través de la depresión',
        story_text: 'El atleta olímpico más condecorado luchó contra la depresión severa después de cada olimpiada.\n\n**El Desafío:** La pérdida de identidad fuera de la piscina y pensamientos suicidas.\n**El Descubrimiento:** Terapia y Mindfulness. Aprender a verbalizar sus sentimientos.\n**La Transformación:** Phelps ahora promueve la salud mental con la misma pasión que la natación. Usa la visualización no solo para ganar carreras, sino para verse a sí mismo sano y equilibrado. "Está bien no estar bien".',
        character_name: 'Michael Phelps',
        character_role: 'Nadador',
        category: 'health',
        tags: ['depression', 'therapy', 'recovery'],
        reading_time_minutes: 5,
        transformation_theme: 'Recuperación',
        is_featured: true,
        is_premium: false
    },
    // 37. Ellen DeGeneres
    {
        title: 'Quietud y Risa',
        subtitle: 'Encontrando paz en el caos',
        story_text: 'La comediante y presentadora utiliza la Meditación Trascendental para equilibrar su energía.\n\n**El Desafío:** La presión de ser amable y divertida constantemente frente a millones.\n**El Descubrimiento:** "Es lo único que me permite sentarme y que mi cerebro deje de girar".\n**La Transformación:** Ellen describe la meditación como un "silencio que no sabía que existía". Le permite desconectar del personaje público y recargar la batería de su bondad natural. Sin ese silencio, el ruido de la fama sería ensordecedor.',
        character_name: 'Ellen DeGeneres',
        character_role: 'Presentadora',
        category: 'anxiety',
        tags: ['quiet', 'balance', 'peace'],
        reading_time_minutes: 4,
        transformation_theme: 'Silencio',
        is_featured: false,
        is_premium: false
    },
    // 38. Rumi
    {
        title: 'El Poeta del Corazón',
        subtitle: 'Lo que buscas te está buscando',
        story_text: 'Poeta místico persa del siglo XIII, Rumi hablaba el lenguaje del alma.\n\n**El Desafío:** La pérdida de su amado maestro Shams le sumió en un dolor profundo.\n**El Descubrimiento:** Encontró a Dios y al Amor dentro de su propio corazón roto. El giro derviche como meditación activa.\n**La Transformación:** "La herida es el lugar por donde entra la luz". Rumi transformó el duelo en poesía extática. Nos enseña que el amor no es algo que se encuentra fuera, sino un estado de ser que se cultiva dentro.',
        character_name: 'Rumi',
        character_role: 'Poeta Místico',
        category: 'relationships',
        tags: ['love', 'poetry', 'grief'],
        reading_time_minutes: 5,
        transformation_theme: 'Amor',
        is_featured: true,
        is_premium: true
    },
    // 39. Kendrick Lamar
    {
        title: 'Eckhart Tolle en el Barrio',
        subtitle: 'Rap consciente',
        story_text: 'Kendrick no es solo un rapero, es un cronista del alma humana, influenciado por la espiritualidad.\n\n**El Desafío:** Crecer en Compton rodeado de violencia y mantener la cordura y la sensibilidad.\n**El Descubrimiento:** Estudia a Eckhart Tolle ("El Poder del Ahora"). A menudo samplea o refiere a conceptos espirituales.\n**La Transformación:** Su álbum "Mr. Morale & The Big Steppers" es básicamente una sesión de terapia pública. Kendrick usa su arte para romper ciclos de trauma generacional, predicando la vulnerabilidad y el perdón como la verdadera fortaleza del hombre.',
        character_name: 'Kendrick Lamar',
        character_role: 'Artista Hip-Hop',
        category: 'growth',
        tags: ['trauma', 'art', 'consciousness'],
        reading_time_minutes: 6,
        transformation_theme: 'Consciencia',
        is_featured: false,
        is_premium: false
    },
    // 40. Marie Curie
    {
        title: 'Enfoque Radiante',
        subtitle: 'La concentración absoluta',
        story_text: 'La única persona con dos Nobeles en distintas ciencias tenía una capacidad de atención sobrenatural.\n\n**El Desafío:** Trabajar en condiciones precarias, siendo mujer en un mundo de hombres, y con materiales peligrosos.\n**El Descubrimiento:** El "Flow" profundo. Se cuenta que Marie se concentraba tanto que se olvidaba de comer o del frío.\n**La Transformación:** Su capacidad para bloquear el mundo exterior y sumergirse en su trabajo le permitió descubrir el Radio y el Polonio. Nos enseña que el genio es, en gran parte, la capacidad de sostener la atención en un solo punto durante mucho tiempo.',
        character_name: 'Marie Curie',
        character_role: 'Científica',
        category: 'professional',
        tags: ['focus', 'science', 'determination'],
        reading_time_minutes: 6,
        transformation_theme: 'Atención',
        is_featured: true,
        is_premium: true
    },
    // 41. Rafael Nadal
    {
        title: 'Rituales de Batalla',
        subtitle: 'Ordenando la mente en el caos',
        story_text: 'Nadal es famoso por sus tics y rutinas antes de sacar. No son superstición, son anclajes.\n\n**El Desafío:** La soledad de la pista y la necesidad de silenciar las dudas en momentos críticos.\n**El Descubrimiento:** Los rituales (botellas alineadas, gestos) le ayudan a entrar en "modo automático" y silenciar el ruido mental.\n**La Transformación:** "Es una forma de colocarme en un partido, ordenando mi entorno para que coincida con el orden que busco en mi cabeza". Nadal nos enseña que la disciplina externa puede crear calma interna bajo presión máxima.',
        character_name: 'Rafael Nadal',
        character_role: 'Tenista',
        category: 'professional',
        tags: ['rituals', 'order', 'focus'],
        reading_time_minutes: 5,
        transformation_theme: 'Orden',
        is_featured: true,
        is_premium: false
    },
    // 42. Buda
    {
        title: 'El Despertar',
        subtitle: 'El camino del medio',
        story_text: 'Siddhartha Gautama lo tenía todo (príncipe) y lo dejó todo para entender el sufrimiento.\n\n**El Desafío:** ¿Por qué sufrimos, enfermamos y morimos?\n**El Descubrimiento:** Tras años de ascetismo extremo, descubrió que ni el placer ni el castigo llevan a la verdad. Se sentó bajo el árbol Bodhi hasta despertar.\n**La Transformación:** Las Cuatro Nobles Verdades. El sufrimiento existe, pero hay un camino para trascenderlo: el desapego y la consciencia plena. Su legado no es una religión, sino una ciencia de la mente para liberar al ser humano del dolor autogenerado.',
        character_name: 'Buda',
        character_role: 'Maestro',
        category: 'growth',
        tags: ['enlightenment', 'mind', 'history'],
        reading_time_minutes: 8,
        transformation_theme: 'Despertar',
        is_featured: true,
        is_premium: true
    },
    // 43. Tom Brady
    {
        title: 'La Mente sin Edad',
        subtitle: 'Jugando hasta los 45',
        story_text: 'El mejor quarterback de la historia desafió al tiempo gracias a su mentalidad.\n\n**El Desafío:** Un deporte violento diseñado para cuerpos de 25 años.\n**El Descubrimiento:** El Método TB12, que prioriza la "Pliabilidad" (flexibilidad) y la mentalidad positiva sobre la fuerza bruta. Sueño disciplinado y enfoque cognitivo.\n**La Transformación:** Brady ve los partidos como ajedrez a alta velocidad. Su calma en el "pocket" mientras gigantes intentan placarle es fruto de una preparación mental obsesiva. Nos enseña que la edad es, en gran parte, una mentalidad.',
        character_name: 'Tom Brady',
        character_role: 'NFL GOAT',
        category: 'health',
        tags: ['longevity', 'discipline', 'mindset'],
        reading_time_minutes: 5,
        transformation_theme: 'Longevidad',
        is_featured: false,
        is_premium: false
    },
    // 44. Denzel Washington
    {
        title: 'Fe y Gratitud',
        subtitle: 'Pon tus zapatos debajo de la cama',
        story_text: 'Uno de los mejores actores de la historia, guiado por una fe inquebrantable.\n\n**El Desafío:** Las tentaciones de Hollywood y el ego.\n**El Descubrimiento:** "Pon tus zapatos tan adentro debajo de la cama que tengas que ponerte de rodillas por la mañana para encontrarlos". La gratitud diaria.\n**La Transformación:** Denzel predica que el talento es un regalo, pero el carácter es una elección. Su práctica diaria de agradecimiento le mantiene humilde y enfocado en servir a otros a través de su arte. "Di gracias por adelantado por lo que ya es tuyo".',
        character_name: 'Denzel Washington',
        character_role: 'Actor',
        category: 'growth',
        tags: ['gratitude', 'faith', 'humility'],
        reading_time_minutes: 5,
        transformation_theme: 'Gratitud',
        is_featured: true,
        is_premium: false
    },
    // 45. Matthew McConaughey
    {
        title: 'Luces Verdes',
        subtitle: 'Surfeando la vida',
        story_text: 'El actor oscarizado tiene una filosofía de vida única sobre capturar momentos.\n\n**El Desafío:** Estar encasillado en comedias románticas y buscar profundidad.\n**El Descubrimiento:** Journaling. Lleva escribiendo diarios desde los 14 años.\n**La Transformación:** Al revisar sus diarios, se dio cuenta de que los éxitos ("greenlights") dejan pistas igual que los fracasos. Aprendió a "atrapar" las señales del universo. Su enfoque relajado pero intencional es una forma de Taoísmo moderno: "Just keep livin".',
        character_name: 'Matthew McConaughey',
        character_role: 'Actor y Autor',
        category: 'growth',
        tags: ['journaling', 'flow', 'perspective'],
        reading_time_minutes: 6,
        transformation_theme: 'Flujo',
        is_featured: true,
        is_premium: false
    },
    // 46. Pau Gasol
    {
        title: 'El Gigante Amable',
        subtitle: 'Inteligencia emocional en la cancha',
        story_text: 'Pau no solo ganó anillos con Kobe, fue su ancla emocional.\n\n**El Desafío:** Adaptarse a una cultura ultracompetitiva sin perder su esencia humana y culta.\n**El Descubrimiento:** Pau lee vorazmente y practica mindfulness. Es embajador del bienestar.\n**La Transformación:** Su capacidad para mantener la calma y unir al vestuario fue clave para los Lakers. Pau demuestra que se puede ser un competidor feroz y una persona profundamente empática y serena al mismo tiempo. El liderazgo silencioso.',
        character_name: 'Pau Gasol',
        character_role: 'Leyenda Basket',
        category: 'professional',
        tags: ['teamwork', 'empathy', 'culture'],
        reading_time_minutes: 5,
        transformation_theme: 'Empatía',
        is_featured: true,
        is_premium: false
    },
    // 47. Maya Angelou
    {
        title: 'La Voz del Pájaro Enjaulado',
        subtitle: 'Palabras que sanan',
        story_text: 'Poeta, activista y voz de la conciencia americana.\n\n**El Desafío:** Mudez voluntaria durante 5 años en su infancia tras un trauma.\n**El Descubrimiento:** Descubrió que su voz podía liberar a otros. La escritura como sanación.\n**La Transformación:** "He aprendido que la gente olvidará lo que dijiste, olvidará lo que hiciste, pero nunca olvidará cómo les hiciste sentir". Maya vivía con una presencia plena, haciendo sentir a cada persona como la más importante del mundo. Eso es mindfulness relacional.',
        character_name: 'Maya Angelou',
        character_role: 'Poeta',
        category: 'growth',
        tags: ['voice', 'healing', 'connection'],
        reading_time_minutes: 6,
        transformation_theme: 'Presencia',
        is_featured: true,
        is_premium: true
    },
    // 48. George Harrison
    {
        title: 'El Beatle Espiritual',
        subtitle: 'Mi dulce señor',
        story_text: 'Mientras otros buscaban fama, George buscaba a Dios.\n\n**El Desafío:** Encontrar su identidad compositiva a la sombra de Lennon y McCartney.\n**El Descubrimiento:** El hinduismo, la cítara y el mantra. "Todo lo demás puede esperar, pero la búsqueda de Dios no puede esperar".\n**La Transformación:** George introdujo la espiritualidad oriental en la cultura pop. Vivió y murió con desapego, preparando su alma para el "arte de morir". Nos recuerda que somos seres espirituales teniendo una experiencia humana.',
        character_name: 'George Harrison',
        character_role: 'Músico',
        category: 'growth',
        tags: ['spirituality', 'music', 'peace'],
        reading_time_minutes: 5,
        transformation_theme: 'Trascendencia',
        is_featured: false,
        is_premium: false
    },
    // 49. Cristiano Ronaldo
    {
        title: 'La Máquina Perfecta',
        subtitle: 'Descanso como arma',
        story_text: 'CR7 ha dominado el fútbol por dos décadas gracias a una disciplina espartana, especialmente en el sueño.\n\n**El Desafío:** Mantener el pico físico más allá de los 30 años.\n**El Descubrimiento:** No duerme 8 horas seguidas. Usa el método del "Sleep Coach" Nick Littlehales: 5 ciclos de 90 minutos de sueño polifásico al día.\n**La Transformación:** Ronaldo no deja nada al azar. Su recuperación mental es tan importante como la física. Desconecta de pantallas horas antes de dormir. Su éxito es la suma de miles de pequeñas decisiones conscientes diarias.',
        character_name: 'Cristiano Ronaldo',
        character_role: 'Futbolista',
        category: 'health',
        tags: ['discipline', 'sleep', 'recovery'],
        reading_time_minutes: 4,
        transformation_theme: 'Disciplina',
        is_featured: false,
        is_premium: false
    },
    // 50. Confucio
    {
        title: 'El Maestro del Orden',
        subtitle: 'Armonía social',
        story_text: 'Filósofo chino que definió la moral de una civilización entera.\n\n**El Desafío:** Una China fragmentada por guerras feudales y caos.\n**El Descubrimiento:** La rectitud ritual. Si cada uno cumple su papel con virtud (Ren), el mundo estará en paz.\n**La Transformación:** "Nuestra mayor gloria no está en no caer nunca, sino en levantarnos cada vez que caemos". Confucio enseñaba la consciencia en las relaciones: respeto a los padres, lealtad a los amigos. La meditación confuciana es la acción correcta en sociedad.',
        character_name: 'Confucio',
        character_role: 'Filósofo',
        category: 'relationships',
        tags: ['virtue', 'society', 'respect'],
        reading_time_minutes: 7,
        transformation_theme: 'Armonía',
        is_featured: true,
        is_premium: true
    }
];
