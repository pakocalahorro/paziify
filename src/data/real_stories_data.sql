-- Clean existing stories to avoid duplicates
TRUNCATE TABLE real_stories;

-- Insert 50 "Mentes Maestras" Biographies
INSERT INTO real_stories (title, subtitle, story_text, character_name, character_role, category, tags, reading_time_minutes, transformation_theme, is_featured, is_premium) VALUES

-- 1. Steve Jobs (Growth/Professional)
('El Zen en la Tecnología', 'La simplicidad como máxima sofisticación', 
'Steve Jobs no solo fue un visionario tecnológico, sino un practicante devoto del Zen durante gran parte de su vida. 

**El Desafío:** A principios de los 70, Jobs buscaba sentido más allá de la electrónica. Sentía que su mente era caótica y ruidosa.
**El Descubrimiento:** Viajó a la India y descubrió la meditación Zen. Aprendió que si te sientas y observas, tu mente se aquieta.
**La Transformación:** Esta práctica definió la estética de Apple. Eliminó lo innecesario, enfocándose en la pureza. "Tienes que trabajar duro para limpiar tu pensamiento y hacerlo simple", decía. Su intuición, afinada por años de silencio, se convirtió en su mayor herramienta de diseño.', 
'Steve Jobs', 'Visionario Tech', 'professional', ARRAY['focus', 'creativity', 'zen'], 5, 'Simplicidad', true, false),

-- 2. Kobe Bryant (Professional/Focus)
('La Mentalidad Mamba', 'El silencio antes del estadio lleno', 
'Kobe Bryant es sinónimo de intensidad, pero su secreto era la quietud.

**El Desafío:** Con la presión de ganar anillos y el desgaste físico, Kobe necesitaba una forma de mantener su mente afilada.
**El Descubrimiento:** Incorporó la meditación diaria (mindfulness) a su rutina. Phil Jackson, su entrenador, le introdujo a esta práctica.
**La Transformación:** Kobe meditaba cada mañana. Esto le permitía "ver" el juego en cámara lenta. Decía que el mindfulness le ayudaba a recalibrar y estar presente, sin importar si fallaba un tiro o ganaba un campeonato. La Mamba Mentality nace de la calma interior.', 
'Kobe Bryant', 'Leyenda NBA', 'professional', ARRAY['focus', 'resilience', 'sports'], 6, 'Enfoque', true, false),

-- 3. Marco Aurelio (Growth/Resilience)
('El Emperador Estoico', 'Gobernando el mundo desde la calma', 
'Considerado el último de los "Cinco Buenos Emperadores", Marco Aurelio gobernó Roma durante guerras y plagas, pero su batalla más importante fue interna.

**El Desafío:** El peso del imperio más grande del mundo y la traición constante amenazaban con corromper su carácter.
**El Descubrimiento:** Escribía un diario personal (sus "Meditaciones") cada noche, no para publicar, sino para recordarse a sí mismo cómo ser virtuoso.
**La Transformación:** "Tienes poder sobre tu mente, no sobre los eventos externos". Su práctica estoica le permitió liderar con sabiduría y temple, recordándonos siglos después que la paz viene de nuestra percepción, no de nuestras circunstancias.', 
'Marco Aurelio', 'Emperador Romano', 'growth', ARRAY['stoicism', 'control', 'leadership'], 7, 'Resiliencia', true, false),

-- 4. Arianna Huffington (Sleep/Health)
('Del Colapso al Despertar', 'El éxito no requiere quemarse', 
'Fundadora de The Huffington Post, Arianna era la imagen del éxito moderno hasta que su cuerpo dijo basta.

**El Desafío:** En 2007, colapsó por agotamiento y falta de sueño, rompiéndose el pómulo contra su escritorio. Se dio cuenta de que su definición de éxito la estaba matando.
**El Descubrimiento:** Redefinió su vida priorizando el sueño y la desconexión digital.
**La Transformación:** Se convirtió en una evangelista de la "Revolución del Sueño". Aprendió que dormir no es tiempo perdido, sino la base de la toma de decisiones efectiva y la alegría de vivir. Su transformación inspiró a millones a dejar el móvil fuera del dormitorio.', 
'Arianna Huffington', 'Empresaria', 'sleep', ARRAY['sleep', 'burnout', 'balance'], 5, 'Descanso', true, false),

-- 5. Michael Jordan (Professional/Focus)
('El Maestro del Ahora', 'Estar presente en el último segundo', 
'Muchos ven sus dunks, pero pocos ven su mente. Michael Jordan trabajó con el famoso entrenador de mindfulness George Mumford.

**El Desafío:** La presión mediática y la expectativa de perfección generaban una ansiedad inmensa antes de cada partido crucial.
**El Descubrimiento:** Aprendió a estar "en la zona", un estado de flujo donde no hay pasado ni futuro, solo el momento presente.
**La Transformación:** Con ejercicios de respiración, Jordan lograba bajar sus pulsaciones en los momentos críticos. "Ese tiro fue Zen", decían sus compañeros. Su capacidad para bloquear el ruido externo es lo que le hacía letal en los últimos segundos.', 
'Michael Jordan', 'Atleta GOAT', 'professional', ARRAY['flow', 'pressure', 'sports'], 6, 'Presencia', true, false),

-- 6. Oprah Winfrey (Growth/Spiritual)
('La Quietud es Poder', 'Conectando con la intuición', 
'Oprah ha entrevistado a miles de personas, pero su conversación más importante es consigo misma cada mañana.

**El Desafío:** Con una agenda imposible y el ruido de la fama, Oprah sentía que perdía su centro y su voz auténtica.
**El Descubrimiento:** Empezó a practicar la Meditación Trascendental, dedicando 20 minutos dos veces al día a la quietud absoluta.
**La Transformación:** "La meditación es como volver a casa", dice. Atribuye su capacidad de empatía y conexión con el público a ese espacio de silencio que cultiva. Afirma que sus mejores decisiones de negocios no vinieron del análisis, sino de la intuición surgida en la calma.', 
'Oprah Winfrey', 'Icono Media', 'growth', ARRAY['intuition', 'calm', 'spirituality'], 5, 'Intuición', true, true),

-- 7. Hugh Jackman (Anxiety/Performance)
('Lobezno Medita', 'La vulnerabilidad detrás del héroe', 
'Conocido por sus papeles de acción, Hugh Jackman lidió durante años con una ansiedad paralizante antes de salir a escena.

**El Desafío:** El miedo escénico y la presión de Hollywood le generaban tensión constante.
**El Descubrimiento:** Descubrió la meditación hace décadas y la practica religiosamente antes de cada rodaje o show en Broadway.
**La Transformación:** "En la meditación, todo se vuelve claro y la ansiedad baja". Jackman usa la práctica para soltar el ego y conectar con sus personajes desde un lugar de verdad, no de miedo. Demuestra que ser fuerte también significa ser consciente.', 
'Hugh Jackman', 'Actor', 'anxiety', ARRAY['anxiety', 'performance', 'acting'], 4, 'Calma', false, false),

-- 8. Novak Djokovic (Health/Resilience)
('Resiliencia Mental', 'Ganando partidos en la mente', 
'Djokovic es conocido por su elasticidad física, pero su fuerza mental es lo que le separa del resto.

**El Desafío:** En momentos de alta tensión, la frustración solía dominarle.
**El Descubrimiento:** El mindfulness se convirtió en parte de su entrenamiento tanto como el tenis. Practica yoga y visualización diaria.
**La Transformación:** Nole utiliza la respiración consciente en los descansos para resetear su sistema nervioso. Ha ganado innumerables partidos tras ir perdiendo, simplemente volviendo al presente punto a punto. Su mente es su mayor raqueta.', 
'Novak Djokovic', 'Tenista N1', 'health', ARRAY['resilience', 'focus', 'recovery'], 6, 'Fortaleza', true, false),

-- 9. The Beatles (Growth/Creativity)
('El Viaje a Rishikesh', 'El álbum blanco y la meditación', 
'En 1968, la banda más grande del mundo hizo las maletas y se fue a la India.

**El Desafío:** Tras la muerte de su manager Brian Epstein y el agotamiento de la fama, se sentían perdidos espiritualmente.
**El Descubrimiento:** Estudiaron Meditación Trascendental con el Maharishi Mahesh Yogi.
**La Transformación:** Ese viaje fue uno de sus periodos más creativos, escribiendo gran parte del "White Album". Canciones como "Dear Prudence" nacieron allí. Aprendieron que la creatividad fluye mejor cuando desconectas del mundo exterior y miras hacia adentro.', 
'The Beatles', 'Músicos', 'growth', ARRAY['creativity', 'music', 'history'], 8, 'Creatividad', true, true),

-- 10. Rick Rubin (Creativity/Professional)
('El Productor Zen', 'Escuchando lo que no se oye', 
'Rick Rubin, productor legendario (Adele, RHCP, Johnny Cash), parece un gurú, y en cierto modo lo es.

**El Desafío:** La industria musical está llena de ruido y egos. ¿Cómo sacar la verdad de un artista?
**El Descubrimiento:** Practica meditación desde los 14 años. Su estudio es un santuario de calma.
**La Transformación:** Rubin no impone, escucha. Su práctica le permite estar presente sin juzgar, creando un espacio vacío donde el artista se siente seguro para ser vulnerable. Enseña que la creatividad no es forzar, sino permitir que la idea llegue.', 
'Rick Rubin', 'Productor Musical', 'professional', ARRAY['creativity', 'listening', 'art'], 5, 'Escucha Profunda', false, false),

-- 11. David Lynch (Creativity/Growth)
('Atrapando el Gran Pez', 'Ideas desde la profundidad', 
'El director de cine surrealista David Lynch es uno de los defensores más vocales de la meditación.

**El Desafío:** Muchos creen que el arte necesita sufrimiento ("el artista torturado"), pero Lynch rechaza esto. El sufrimiento bloquea el flujo.
**El Descubrimiento:** Lynch lleva más de 40 años sin fallar un día de Meditación Trascendental.
**La Transformación:** Compara la consciencia con un océano. En la superficie hay olas (ruido), pero en la profundidad hay calma. Cuanto más profundo vas, "peces" (ideas) más grandes y puros puedes atrapar. Su cine único nace de esa profundidad silenciosa.', 
'David Lynch', 'Director de Cine', 'growth', ARRAY['creativity', 'ideas', 'flow'], 5, 'Profundidad', false, false),

-- 12. Gisele Bündchen (Anxiety/Balance)
('Lecciones de una Supermodelo', 'La ansiedad no discrimina', 
'A los 20 años, Gisele tenía ataques de pánico en ascensores y aviones, a pesar de estar en la cima de su carrera.

**El Desafío:** Bebía café y vino para gestionar el estrés, creando un ciclo tóxico de ansiedad.
**El Descubrimiento:** Cambió su estilo de vida radicalmente: yoga, meditación y nutrición natural.
**La Transformación:** Gisele usa el pranayama (respiración yóguica) para anclarse. Aprendió a observar sus pensamientos ansiosos sin ser arrastrada por ellos. Hoy enseña que tu cuerpo es tu templo y la paz mental es el verdadero éxito.', 
'Gisele Bündchen', 'Modelo y Autora', 'anxiety', ARRAY['anxiety', 'panic', 'yoga'], 6, 'Equilibrio', false, false),

-- 13. Paul McCartney (Growth/Music)
('Encontrando la Calma en la Tormenta', 'Momentos de quietud en una vida legendaria', 
'Más allá de The Beatles, Paul ha mantenido su práctica de meditación durante décadas.

**El Desafío:** Mantenerse cuerdo y creativo durante 60 años de fama ininterrumpida.
**El Descubrimiento:** "En momentos de locura, la meditación me da un momento de quietud".
**La Transformación:** La usa antes de salir al escenario o entrar al estudio. No como una práctica mística compleja, sino como una herramienta práctica para "bajar las revoluciones" y reconectar con la alegría simple de hacer música.', 
'Paul McCartney', 'Músico', 'growth', ARRAY['music', 'longevity', 'calm'], 4, 'Constancia', false, false),

-- 14. Emma Watson (Anxiety/Growth)
('La Magia del Slow Living', 'Creciendo bajo los focos', 
'Crecer siendo Hermione Granger puso una presión inimaginable sobre Emma Watson desde niña.

**El Desafío:** La necesidad constante de complacer y la exposición pública le generaban un fuerte síndrome del impostor.
**El Descubrimiento:** Se certificó como instructora de yoga y meditación.
**La Transformación:** Emma aboga por el "Slow Living", tomarse tiempo para estar y no solo hacer. La meditación le ayudó a diferenciar su valor personal de su imagen pública, permitiéndole ser activista y actriz desde un lugar de autenticidad.', 
'Emma Watson', 'Actriz y Activista', 'growth', ARRAY['imposter_syndrome', 'balance', 'yoga'], 5, 'Autenticidad', false, false),

-- 15. Seneca (Pioneering Stoicism/Growth)
('El Filósofo Práctico', 'Cartas para la vida moderna', 
'Aunque vivió hace 2000 años, Séneca fue el "Tim Ferriss" de su época: rico, influyente, pero obsesionado con la sabiduría práctica.

**El Desafío:** Vivir en la corte de Nerón, un emperador inestable, significaba peligro de muerte diario.
**El Descubrimiento:** El Estoicismo: prepararse mentalmente para la adversidad ("Premeditatio Malorum").
**La Transformación:** Séneca enseñaba a disfrutar de la riqueza sin apegarse a ella. "Sufrimos más en la imaginación que en la realidad". Sus cartas nos enseñan hoy a gestionar el tiempo y a no ser esclavos de la fortuna.', 
'Séneca', 'Filósofo Estoico', 'growth', ARRAY['stoicism', 'time_management', 'fear'], 7, 'Perspectiva', true, true),

-- 16. Viktor Frankl (Resilience/Meaning)
('El Hombre en Busca de Sentido', 'La libertad última', 
'Sobreviviente del Holocausto y psiquiatra, Frankl descubrió la verdad más profunda del ser humano en las peores condiciones imaginables.

**El Desafío:** Sobrevivir a los campos de concentración nazis sin perder la esperanza.
**El Descubrimiento:** "A un hombre le pueden robar todo, menos una cosa: la última de las libertades humanas — la elección de su actitud ante cualquier circunstancia".
**La Transformación:** Frankl usó su mente para visualizar a su esposa y sus conferencias futuras mientras sufría. Su Logoterapia enseña que encontrar un "porqué" nos permite soportar cualquier "cómo".', 
'Viktor Frankl', 'Psiquiatra', 'growth', ARRAY['resilience', 'meaning', 'hope'], 8, 'Sentido', true, true),

-- 17. Keanu Reeves (Grief/Peace)
('La Bondad Silenciosa', 'Sanando a través de la presencia', 
'Keanu es famoso por su humildad y generosidad, a pesar de haber sufrido tragedias personales devastadoras.

**El Desafío:** La pérdida de su mejor amigo, su hija y su pareja podrían haberle destruido.
**El Descubrimiento:** No habla mucho de su práctica, pero encarna el no-apego y la compasión budista.
**La Transformación:** En lugar de amargarse, Keanu eligió la bondad. "El luto cambia de forma, pero nunca termina". Su "meditación" es la acción: regalar motos a sus dobles, ceder su asiento en el metro. Nos enseña que la paz interior se manifiesta en cómo tratas a los demás.', 
'Keanu Reeves', 'Actor', 'relationships', ARRAY['grief', 'kindness', 'humility'], 5, 'Compasión', true, false),

-- 18. Nelson Mandela (Resilience/Freedom)
('46664: Paciencia Infinita', 'Libertad tras las rejas', 
'27 años en prisión podrían haberle llenado de odio. En cambio, salió listo para perdonar y unir a una nación.

**El Desafío:** El aislamiento y la injusticia del Apartheid.
**El Descubrimiento:** Mandela usó sus años en la celda para disciplinar su mente y estudiar a sus opresores.
**La Transformación:** "Si no dejo atrás mi amargura y mi odio, seguiré estando en prisión". Su capacidad para gestionar sus emociones y ver la humanidad en el enemigo evitó una guerra civil. La paciencia no es pasividad, es una estrategia.', 
'Nelson Mandela', 'Líder Mundial', 'growth', ARRAY['patience', 'forgiveness', 'leadership'], 7, 'Paciencia', true, true),

-- 19. Phil Jackson (Leadership/Professional)
('El Maestro Zen del Basket', '11 Anillos de Plenitud', 
'Entrenador de Jordan y Kobe. Phil Jackson trajo el mindfulness a la NBA cuando nadie sabía qué era.

**El Desafío:** Gestionar los egos más grandes del deporte (Jordan, Pippen, Shaq, Kobe) y hacerlos jugar como uno.
**El Descubrimiento:** Usaba el Zen y la cultura nativa americana. Hacía meditar a los Bulls en el vestuario a oscuras.
**La Transformación:** Enseñó a sus jugadores a jugar el "baloncesto invisible": la conexión telepática que surge cuando dejas el ego ("yo") por el equipo ("nosotros"). Su éxito prueba que la espiritualidad y el alto rendimiento van de la mano.', 
'Phil Jackson', 'Entrenador NBA', 'professional', ARRAY['leadership', 'teamwork', 'zen'], 6, 'Liderazgo', false, false),

-- 20. Bruce Lee (Flow/Performance)
('Sé como el Agua', 'La filosofía del combate y la vida', 
'Bruce Lee no era solo un luchador, era un filósofo. Su arte marcial, Jeet Kune Do, es pura meditación en movimiento.

**El Desafío:** Superar los límites rígidos de los estilos tradicionales y sus propias limitaciones físicas.
**El Descubrimiento:** El Taoísmo. "Vacía tu mente, sé amorfo, moldeable, como el agua".
**La Transformación:** El agua puede fluir o puede golpear. Bruce Lee aplicó la adaptabilidad total a su vida. No te quedes rígido en una creencia o técnica. Su legado es la flexibilidad mental: adáptate a lo que viene, y serás invencible.', 
'Bruce Lee', 'Artista Marcial', 'professional', ARRAY['adaptability', 'flow', 'philosophy'], 5, 'Fluidez', true, false),

-- 21. Thich Nhat Hanh (Mindfulness/Peace)
('El Milagro del Mindfulness', 'Paz en cada paso', 
'Monje vietnamita nominado al Nobel por Martin Luther King. Trajo el mindfulness a Occidente con una simplicidad radical.

**El Desafío:** Vivir la guerra de Vietnam y el exilio sin perder la compasión.
**El Descubrimiento:** "Lavar los platos para lavar los platos". El mindfulness no es solo sentarse, es estar presente en cada acto cotidiano.
**La Transformación:** Enseñó que podemos generar paz en cualquier momento simplemente respirando y sonriendo. "La paz está en cada paso". Su legado es que la iluminación está disponible ahora mismo, pelando una naranja o caminando.', 
'Thich Nhat Hanh', 'Monje Zen', 'growth', ARRAY['mindfulness', 'presence', 'peace'], 6, 'Sencillez', true, true),

-- 22. Jerry Seinfeld (Professional/Routine)
('Comedia y Trascendencia', 'La consistencia del éxito', 
'El comediante más exitoso del mundo atribuye su longevidad y energía a una técnica específica.

**El Desafío:** El agotamiento de escribir y actuar en una sitcom semanal número uno.
**El Descubrimiento:** Meditación Trascendental. "Es como un cargador de móvil para tu mente y cuerpo".
**La Transformación:** Jerry lo hace cada día, al mediodía. Dice que le da la energía de haber dormido 5 horas. Su enfoque obsesivo en el detalle y su capacidad de trabajo incansable se apoyan en esta recuperación profunda diaria.', 
'Jerry Seinfeld', 'Comediante', 'professional', ARRAY['energy', 'consistency', 'work'], 4, 'Energía', false, false),

-- 23. Herman Hesse (Growth/Literature)
('Siddhartha y la Búsqueda', 'Escuchando al río', 
'Autor alemán que exploró la espiritualidad oriental, influenciando a generaciones de buscadores.

**El Desafío:** La crisis espiritual de la Europa de entreguerras y su propia búsqueda de identidad.
**El Descubrimiento:** En su libro "Siddhartha", el protagonista encuentra la iluminación no en la doctrina, sino escuchando al río y viviendo la experiencia simple.
**La Transformación:** Hesse nos recuerda que la sabiduría no se puede enseñar, solo se puede aprender viviendo. Debemos encontrar nuestra propia verdad, incluso si eso significa dejar a los maestros atrás.', 
'Hermann Hesse', 'Escritor', 'growth', ARRAY['wisdom', 'journey', 'literature'], 6, 'Búsqueda', false, false),

-- 24. Mahatma Gandhi (Peace/Resilience)
('La Fuerza de la Verdad', 'Satyagraha y silencio', 
'Lideró la independencia de la India sin disparar una bala, armado solo con su convicción espiritual.

**El Desafío:** Enfrentar al Imperio Británico con violencia hubiera sido un suicidio y moralmente incorrecto para él.
**El Descubrimiento:** El ayuno y el día de silencio semanal. Gandhi no hablaba los lunes para conservar energía y clarificar sus pensamientos.
**La Transformación:** Su fuerza política nacía de su fuerza espiritual. Demostró que la no-violencia (Ahimsa) requiere más valentía que la violencia. Su paz interior era tan fuerte que desarmaba a sus oponentes.', 
'Mahatma Gandhi', 'Líder Espiritual', 'relationships', ARRAY['peace', 'non-violence', 'truth'], 7, 'Verdad', true, true),

-- 25. Frida Kahlo (Anxiety/Pain)
('Pintando el Dolor', 'El arte como sanación', 
'Frida vivió con dolor físico crónico toda su vida tras un accidente de autobús.

**El Desafío:** Confinada a una cama durante meses, con la columna rota y dolor constante.
**El Descubrimiento:** Usó la pintura como una forma de meditación activa y catarsis. "Pinto autorretratos porque estoy mucho tiempo sola".
**La Transformación:** En lugar de ignorar su sufrimiento, lo miró de frente y lo transformó en belleza. Su resiliencia radical nos enseña a aceptar nuestras heridas ("Viva la Vida") y usarlas como combustible creativo en lugar de dejarnos consumir por ellas.', 
'Frida Kahlo', 'Artista', 'anxiety', ARRAY['pain', 'art', 'resilience'], 5, 'Transformación', true, false),

-- 26. Nikola Tesla (Creativity/Visualization)
('El Laboratorio Mental', 'Construyendo en la imaginación', 
'El inventor que electrificó el mundo tenía un método de trabajo único.

**El Desafío:** Tesla no tenía dinero para construir prototipos infinitos.
**El Descubrimiento:** La Visualización Hiper-realista. Tesla construía, probaba y corregía sus máquinas enteramente en su mente antes de tocar un tornillo.
**La Transformación:** "Mis inventos son absolutamente reales en mi mente". Su capacidad de concentración era tan profunda que podía simular el desgaste de las piezas mentalmente. Nos enseña el poder ilimitado de la imaginación enfocada.', 
'Nikola Tesla', 'Inventor', 'professional', ARRAY['visualization', 'imagination', 'focus'], 6, 'Visualización', true, false),

-- 27. Ray Dalio (Professional/Decisions)
('Principios y Meditación', 'La clave del éxito financiero', 
'Fundador de Bridgewater, el fondo de cobertura más grande del mundo.

**El Desafío:** Tomar decisiones de miles de millones de dólares sin dejar que el miedo o la codicia interfieran.
**El Descubrimiento:** Dalio atribuye TODO su éxito a la Meditación Trascendental, más que a cualquier otra cosa.
**La Transformación:** La meditación le da "mente de ninja": la capacidad de ver las cosas como son, no como desearía que fueran. Su enfoque en la "Verdad Radical" y la transparencia nace de esa claridad mental desapegada del ego.', 
'Ray Dalio', 'Inversor', 'professional', ARRAY['decisions', 'business', 'truth'], 5, 'Claridad', false, false),

-- 28. Epicteto (Control/Resilience)
('El Esclavo que se hizo Libre', 'El arte de vivir', 
'Nació esclavo, cojo y pobre, pero se convirtió en uno de los grandes maestros estoicos.

**El Desafío:** No tenía control sobre su cuerpo ni su libertad física.
**El Descubrimiento:** La Dicotomía del Control. "Solo controla tu mente y tus reacciones. Lo demás (cuerpo, reputación, riqueza) no es tuyo".
**La Transformación:** Epicteto era más libre que su amo porque nadie podía herir su mente. Enseñó que no son las cosas las que nos perturban, sino nuestra opinión sobre ellas. Su filosofía es la base de la Terapia Cognitiva Conductual moderna.', 
'Epicteto', 'Filósofo Estoico', 'growth', ARRAY['stoicism', 'freedom', 'perspective'], 6, 'Libertad', true, true),

-- 29. J.K. Rowling (Resilience/Professional)
('Tocando Fondo', 'Cuando el fracaso es la base', 
'Antes de Harry Potter, Joanne era madre soltera, desempleada y clínicamente deprimida.

**El Desafío:** Sentirse un fracaso total según los estándares de la sociedad. Destrozada por la ansiedad.
**El Descubrimiento:** Aceptación. "Tocar fondo se convirtió en la base sólida sobre la que reconstruí mi vida".
**La Transformación:** Al perder el miedo a fallar (porque ya había pasado), se liberó para escribir lo que realmente amaba. Los Dementores de sus libros son una metáfora de su depresión, y el Patronus es la fuerza de los recuerdos felices. Transformó sus demonios en magia.', 
'J.K. Rowling', 'Escritora', 'growth', ARRAY['failure', 'depression', 'creativity'], 6, 'Renacer', true, false),

-- 30. Walt Disney (Creativity/Dreams)
('El Soñador Práctico', 'Si puedes soñarlo...', 
'Disney creó mundos donde no existían, pero no era solo un soñador ingenuo.

**El Desafío:** Múltiples bancarrotas y gente diciéndole que nadie vería una película de animación de una hora.
**El Descubrimiento:** Tenía tres "habitaciones" mentales: El Soñador (sin límites), El Realista (cómo hacerlo) y El Crítico (qué falta).
**La Transformación:** Su capacidad para visitar el estado del "Soñador" sin juicios prematuros es similar a la meditación creativa. Nos enseña a suspender la incredulidad y permitir que la imaginación florezca antes de juzgarla.', 
'Walt Disney', 'Creador', 'growth', ARRAY['creativity', 'dreams', 'persistence'], 5, 'Imaginación', false, false),

-- 31. Simone Biles (Health/Boundaries)
('El Valor de Parar', 'La salud mental es oro', 
'La mejor gimnasta de la historia sorprendió al mundo al retirarse en las Olimpiadas de Tokio.

**El Desafío:** Los "twisties" (pérdida de orientación en el aire) y una presión global aplastante.
**El Descubrimiento:** Poner límites. "Tengo que hacer lo que es bueno para mí y centrarme en mi salud mental, no ponerla en peligro".
**La Transformación:** Su valiente "no" inspiró más que sus medallas. Enseñó al mundo que somos humanos antes que productos o atletas. La verdadera fortaleza a veces es saber cuándo parar y respirar.', 
'Simone Biles', 'Atleta Olímpica', 'health', ARRAY['mental_health', 'boundaries', 'courage'], 5, 'Límites', true, false),

-- 32. Jeff Weiner (Professional/Leadership)
('Liderazgo Compasivo', 'El CEO de LinkedIn', 
'En un mundo tech despiadado, Jeff Weiner apostó por la compasión.

**El Desafío:** Gestionar una empresa de hiper-crecimiento sin perder la cultura humana.
**El Descubrimiento:** El concepto de "Compassionate Management" del Dalai Lama.
**La Transformación:** Weiner usa la meditación diaria (app Headspace, curiosamente) para cultivar espacio entre estímulo y respuesta. "La compasión no es ser blando, es ponerte en los zapatos del otro para entender cómo ayudarle mejor". Transformó la cultura corporativa moderna.', 
'Jeff Weiner', 'Ex-CEO LinkedIn', 'professional', ARRAY['leadership', 'compassion', 'business'], 5, 'Gestión', false, false),

-- 33. Lao Tsé (Growth/Philosophy)
('El Viejo Maestro', 'El arte de no hacer nada', 
'El legendario autor del Tao Te Ching nos dejó el concepto de Wu Wei.

**El Desafío:** Vivir en un mundo de conflicto y ambición desmedida.
**El Descubrimiento:** Wu Wei (Acción sin esfuerzo). "La naturaleza no se apresura, y sin embargo todo se cumple".
**La Transformación:** Enseñó que forzar las cosas va contra el Tao (el flujo del universo). Ser flexible como el bambú es mejor que ser rígido como el roble. Su sabiduría nos invita a dejar de remar contra corriente y empezar a navegar.', 
'Lao Tsé', 'Filósofo Taoísta', 'growth', ARRAY['tao', 'flow', 'nature'], 6, 'Wu Wei', true, true),

-- 34. Tim Ferriss (Professional/Stoicism)
('Estoicismo Moderno', 'Diseñando tu vida', 
'El autor de "La semana laboral de 4 horas" es un obseso de optimizar la mente humana.

**El Desafío:** Tendencia al suicidio en su juventud y ansiedad crónica.
**El Descubrimiento:** El Estoicismo como "sistema operativo" para decisiones difíciles. "Fear Setting" (Definición del Miedo) en lugar de Goal Setting.
**La Transformación:** Tim visualiza el peor escenario posible para quitarle poder al miedo. Su práctica de meditación y escritura matutina le permite filtrar el ruido y centrarse en lo esencial. Ha popularizado la sabiduría antigua para problemas modernos.', 
'Tim Ferriss', 'Podcaster', 'professional', ARRAY['stoicism', 'optimization', 'fear'], 6, 'Estrategia', false, false),

-- 35. Dalai Lama (Growth/Happiness)
('La Sonrisa del Tíbet', 'La felicidad es un entrenamiento', 
'El líder espiritual del budismo tibetano es la encarnación de la alegría, a pesar del exilio.

**El Desafío:** La pérdida de su país y el sufrimiento de su pueblo.
**El Descubrimiento:** "La felicidad no es algo que viene hecho. Viene de tus propias acciones".
**La Transformación:** Entrena su mente cada día en la compasión analítica. Insiste en que la empatía y el altruismo son egoístas, porque nos hacen sentir mejor a nosotros mismos. Su risa contagiosa es prueba de una mente libre de odio.', 
'Dalai Lama', 'Líder Espiritual', 'growth', ARRAY['happiness', 'compassion', 'mind'], 5, 'Alegría', true, true),

-- 36. Michael Phelps (Health/Focus)
('El Peso del Oro', 'Nadando a través de la depresión', 
'El atleta olímpico más condecorado luchó contra la depresión severa después de cada olimpiada.

**El Desafío:** La pérdida de identidad fuera de la piscina y pensamientos suicidas.
**El Descubrimiento:** Terapia y Mindfulness. Aprender a verbalizar sus sentimientos.
**La Transformación:** Phelps ahora promueve la salud mental con la misma pasión que la natación. Usa la visualización no solo para ganar carreras, sino para verse a sí mismo sano y equilibrado. "Está bien no estar bien".', 
'Michael Phelps', 'Nadador', 'health', ARRAY['depression', 'therapy', 'recovery'], 5, 'Recuperación', true, false),

-- 37. Ellen DeGeneres (Anxiety/Peace)
('Quietud y Risa', 'Encontrando paz en el caos', 
'La comediante y presentadora utiliza la Meditación Trascendental para equilibrar su energía.

**El Desafío:** La presión de ser amable y divertida constantemente frente a millones.
**El Descubrimiento:** "Es lo único que me permite sentarme y que mi cerebro deje de girar".
**La Transformación:** Ellen describe la meditación como un "silencio que no sabía que existía". Le permite desconectar del personaje público y recargar la batería de su bondad natural. Sin ese silencio, el ruido de la fama sería ensordecedor.', 
'Ellen DeGeneres', 'Presentadora', 'anxiety', ARRAY['quiet', 'balance', 'peace'], 4, 'Silencio', false, false),

-- 38. Rumi (Relationships/Love)
('El Poeta del Corazón', 'Lo que buscas te está buscando', 
'Poeta místico persa del siglo XIII, Rumi hablaba el lenguaje del alma.

**El Desafío:** La pérdida de su amado maestro Shams le sumió en un dolor profundo.
**El Descubrimiento:** Encontró a Dios y al Amor dentro de su propio corazón roto. El giro derviche como meditación activa.
**La Transformación:** "La herida es el lugar por donde entra la luz". Rumi transformó el duelo en poesía extática. Nos enseña que el amor no es algo que se encuentra fuera, sino un estado de ser que se cultiva dentro.', 
'Rumi', 'Poeta Místico', 'relationships', ARRAY['love', 'poetry', 'grief'], 5, 'Amor', true, true),

-- 39. Kendrick Lamar (Creativity/Growth)
('Eckhart Tolle en el Barrio', 'Rap consciente', 
'Kendrick no es solo un rapero, es un cronista del alma humana, influenciado por la espiritualidad.

**El Desafío:** Crecer en Compton rodeado de violencia y mantener la cordura y la sensibilidad.
**El Descubrimiento:** Estudia a Eckhart Tolle ("El Poder del Ahora"). A menudo samplea o refiere a conceptos espirituales.
**La Transformación:** Su álbum "Mr. Morale & The Big Steppers" es básicamente una sesión de terapia pública. Kendrick usa su arte para romper ciclos de trauma generacional, predicando la vulnerabilidad y el perdón como la verdadera fortaleza del hombre.', 
'Kendrick Lamar', 'Artista Hip-Hop', 'growth', ARRAY['trauma', 'art', 'consciousness'], 6, 'Consciencia', false, false),

-- 40. Marie Curie (Focus/Professional)
('Enfoque Radiante', 'La concentración absoluta', 
'La única persona con dos Nobeles en distintas ciencias tenía una capacidad de atención sobrenatural.

**El Desafío:** Trabajar en condiciones precarias, siendo mujer en un mundo de hombres, y con materiales peligrosos.
**El Descubrimiento:** El "Flow" profundo. Se cuenta que Marie se concentraba tanto que se olvidaba de comer o del frío.
**La Transformación:** Su capacidad para bloquear el mundo exterior y sumergirse en su trabajo le permitió descubrir el Radio y el Polonio. Nos enseña que el genio es, en gran parte, la capacidad de sostener la atención en un solo punto durante mucho tiempo.', 
'Marie Curie', 'Científica', 'professional', ARRAY['focus', 'science', 'determination'], 6, 'Atención', true, true),

-- 41. Rafael Nadal (Professional/Rituals)
('Rituales de Batalla', 'Ordenando la mente en el caos', 
'Nadal es famoso por sus tics y rutinas antes de sacar. No son superstición, son anclajes.

**El Desafío:** La soledad de la pista y la necesidad de silenciar las dudas en momentos críticos.
**El Descubrimiento:** Los rituales (botellas alineadas, gestos) le ayudan a entrar en "modo automático" y silenciar el ruido mental.
**La Transformación:** "Es una forma de colocarme en un partido, ordenando mi entorno para que coincida con el orden que busco en mi cabeza". Nadal nos enseña que la disciplina externa puede crear calma interna bajo presión máxima.', 
'Rafael Nadal', 'Tenista', 'professional', ARRAY['rituals', 'order', 'focus'], 5, 'Orden', true, false),

-- 42. Buda (Gautama) (Growth/Enlightenment)
('El Despertar', 'El camino del medio', 
'Siddhartha Gautama lo tenía todo (príncipe) y lo dejó todo para entender el sufrimiento.

**El Desafío:** ¿Por qué sufrimos, enfermamos y morimos?
**El Descubrimiento:** Tras años de ascetismo extremo, descubrió que ni el placer ni el castigo llevan a la verdad. Se sentó bajo el árbol Bodhi hasta despertar.
**La Transformación:** Las Cuatro Nobles Verdades. El sufrimiento existe, pero hay un camino para trascenderlo: el desapego y la consciencia plena. Su legado no es una religión, sino una ciencia de la mente para liberar al ser humano del dolor autogenerado.', 
'Buda', 'Maestro', 'growth', ARRAY['enlightenment', 'mind', 'history'], 8, 'Despertar', true, true),

-- 43. Tom Brady (Health/Longevity)
('La Mente sin Edad', 'Jugando hasta los 45', 
'El mejor quarterback de la historia desafió al tiempo gracias a su mentalidad.

**El Desafío:** Un deporte violento diseñado para cuerpos de 25 años.
**El Descubrimiento:** El Método TB12, que prioriza la "Pliabilidad" (flexibilidad) y la mentalidad positiva sobre la fuerza bruta. Sueño disciplinado y enfoque cognitivo.
**La Transformación:** Brady ve los partidos como ajedrez a alta velocidad. Su calma en el "pocket" mientras gigantes intentan placarle es fruto de una preparación mental obsesiva. Nos enseña que la edad es, en gran parte, una mentalidad.', 
'Tom Brady', 'NFL GOAT', 'health', ARRAY['longevity', 'discipline', 'mindset'], 5, 'Longevidad', false, false),

-- 44. Denzel Washington (Growth/Values)
('Fe y Gratitud', 'Pon tus zapatos debajo de la cama', 
'Uno de los mejores actores de la historia, guiado por una fe inquebrantable.

**El Desafío:** Las tentaciones de Hollywood y el ego.
**El Descubrimiento:** "Pon tus zapatos tan adentro debajo de la cama que tengas que ponerte de rodillas por la mañana para encontrarlos". La gratitud diaria.
**La Transformación:** Denzel predica que el talento es un regalo, pero el carácter es una elección. Su práctica diaria de agradecimiento le mantiene humilde y enfocado en servir a otros a través de su arte. "Di gracias por adelantado por lo que ya es tuyo".', 
'Denzel Washington', 'Actor', 'growth', ARRAY['gratitude', 'faith', 'humility'], 5, 'Gratitud', true, false),

-- 45. Matthew McConaughey (Growth/Perspective)
('Luces Verdes', 'Surfeando la vida', 
'El actor oscarizado tiene una filosofía de vida única sobre capturar momentos.

**El Desafío:** Estar encasillado en comedias románticas y buscar profundidad.
**El Descubrimiento:** Journaling. Lleva escribiendo diarios desde los 14 años.
**La Transformación:** Al revisar sus diarios, se dio cuenta de que los éxitos ("greenlights") dejan pistas igual que los fracasos. Aprendió a "atrapar" las señales del universo. Su enfoque relajado pero intencional es una forma de Taoísmo moderno: "Just keep livin".', 
'Matthew McConaughey', 'Actor y Autor', 'growth', ARRAY['journaling', 'flow', 'perspective'], 6, 'Flujo', true, false),

-- 46. Pau Gasol (Professional/Mindfulness)
('El Gigante Amable', 'Inteligencia emocional en la cancha', 
'Pau no solo ganó anillos con Kobe, fue su ancla emocional.

**El Desafío:** Adaptarse a una cultura ultracompetitiva sin perder su esencia humana y culta.
**El Descubrimiento:** Pau lee vorazmente y practica mindfulness. Es embajador del bienestar.
**La Transformación:** Su capacidad para mantener la calma y unir al vestuario fue clave para los Lakers. Pau demuestra que se puede ser un competidor feroz y una persona profundamente empática y serena al mismo tiempo. El liderazgo silencioso.', 
'Pau Gasol', 'Leyenda Basket', 'professional', ARRAY['teamwork', 'empathy', 'culture'], 5, 'Empatía', true, false),

-- 47. Maya Angelou (Growth/Resilience)
('La Voz del Pájaro Enjaulado', 'Palabras que sanan', 
'Poeta, activista y voz de la conciencia americana.

**El Desafío:** Mudez voluntaria durante 5 años en su infancia tras un trauma.
**El Descubrimiento:** Descubrió que su voz podía liberar a otros. La escritura como sanación.
**La Transformación:** "He aprendido que la gente olvidará lo que dijiste, olvidará lo que hiciste, pero nunca olvidará cómo les hiciste sentir". Maya vivía con una presencia plena, haciendo sentir a cada persona como la más importante del mundo. Eso es mindfulness relacional.', 
'Maya Angelou', 'Poeta', 'growth', ARRAY['voice', 'healing', 'connection'], 6, 'Presencia', true, true),

-- 48. George Harrison (Growth/Spirituality)
('El Beatle Espiritual', 'Mi dulce señor', 
'Mientras otros buscaban fama, George buscaba a Dios.

**El Desafío:** Encontrar su identidad compositiva a la sombra de Lennon y McCartney.
**El Descubrimiento:** El hinduismo, la cítara y el mantra. "Todo lo demás puede esperar, pero la búsqueda de Dios no puede esperar".
**La Transformación:** George introdujo la espiritualidad oriental en la cultura pop. Vivió y murió con desapego, preparando su alma para el "arte de morir". Nos recuerda que somos seres espirituales teniendo una experiencia humana.', 
'George Harrison', 'Músico', 'growth', ARRAY['spirituality', 'music', 'peace'], 5, 'Trascendencia', false, false),

-- 49. Cristiano Ronaldo (Health/Discipline)
('La Máquina Perfecta', 'Descanso como arma', 
'CR7 ha dominado el fútbol por dos décadas gracias a una disciplina espartana, especialmente en el sueño.

**El Desafío:** Mantener el pico físico más allá de los 30 años.
**El Descubrimiento:** No duerme 8 horas seguidas. Usa el método del "Sleep Coach" Nick Littlehales: 5 ciclos de 90 minutos de sueño polifásico al día.
**La Transformación:** Ronaldo no deja nada al azar. Su recuperación mental es tan importante como la física. Desconecta de pantallas horas antes de dormir. Su éxito es la suma de miles de pequeñas decisiones conscientes diarias.', 
'Cristiano Ronaldo', 'Futbolista', 'health', ARRAY['discipline', 'sleep', 'recovery'], 4, 'Disciplina', false, false),

-- 50. Confucio (Relationships/Order)
('El Maestro del Orden', 'Armonía social', 
'Filósofo chino que definió la moral de una civilización entera.

**El Desafío:** Una China fragmentada por guerras feudales y caos.
**El Descubrimiento:** La rectitud ritual. Si cada uno cumple su papel con virtud (Ren), el mundo estará en paz.
**La Transformación:** "Nuestra mayor gloria no está en no caer nunca, sino en levantarnos cada vez que caemos". Confucio enseñaba la consciencia en las relaciones: respeto a los padres, lealtad a los amigos. La meditación confuciana es la acción correcta en sociedad.', 
'Confucio', 'Filósofo', 'relationships', ARRAY['virtue', 'society', 'respect'], 7, 'Armonía', true, true);
