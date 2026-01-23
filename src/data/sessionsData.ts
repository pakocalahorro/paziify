export interface AudioLayers {
  voice?: any;
  defaultSoundscape?: string;
  defaultBinaural?: string;
  defaultElements?: string;
}

export interface MeditationSession {
  id: string;
  title: string;
  description: string;
  durationMinutes: number;

  // Categorización
  category: 'ansiedad' | 'despertar' | 'sueño' | 'mindfulness' | 'resiliencia';
  moodTags: string[];
  timeOfDay: 'mañana' | 'tarde' | 'noche' | 'cualquiera';
  difficultyLevel: 'principiante' | 'intermedio' | 'avanzado';

  // Tipo de sesión
  sessionType: 'guided_pure' | 'guided_customizable' | 'ambient_only';
  isCustomizable: boolean;

  // Audio
  audioLayers: AudioLayers;

  // Creador
  creatorName: string;
  creatorCredentials: string;

  // Respaldo Científico
  scientificBenefits: string;
  breathingPattern: {
    inhale: number;
    hold: number;
    exhale: number;
    holdPost: number;
  };
  voiceStyle: 'calm' | 'energizing' | 'deep' | 'standard';

  // Freemium
  isPremium: boolean;

  // UI
  color: string;
}

export const MEDITATION_SESSIONS: MeditationSession[] = [
  // ===== ANSIEDAD (Regulación del Nervio Vago) =====
  {
    id: 'anx_478',
    title: 'Respiración 4-7-8',
    description: 'El "sedante natural" del sistema nervioso diseñado por el Dr. Andrew Weil.',
    scientificBenefits: 'Al forzar una exhalación el doble de larga que la inhalación, obligamos al nervio vago a enviar una señal de calma al corazón, reduciendo el cortisol en sangre.',
    durationMinutes: 5,
    category: 'ansiedad',
    moodTags: ['pánico', 'estrés', 'nervios'],
    timeOfDay: 'cualquiera',
    difficultyLevel: 'principiante',
    sessionType: 'guided_pure',
    isCustomizable: false,
    audioLayers: { defaultBinaural: 'theta_waves', defaultSoundscape: 'rain_soft' },
    breathingPattern: { inhale: 4, hold: 7, exhale: 8, holdPost: 0 },
    voiceStyle: 'deep',
    creatorName: 'Dr. Michael Chen',
    creatorCredentials: 'Neurocientífico, PhD',
    isPremium: false,
    color: '#FF6B6B',
  },
  {
    id: 'anx_box',
    title: 'Respiración Cuadrada (Box Breathing)',
    description: 'Técnica utilizada por Navy Seals para mantener la calma bajo fuego.',
    scientificBenefits: 'Sincroniza el ritmo cardíaco con la presión arterial (coherencia cardiovascular), permitiendo que el cerebro racional (neocórtex) mantenga el control sobre el emocional (amígdala).',
    durationMinutes: 4,
    category: 'ansiedad',
    moodTags: ['presión', 'calma', 'enfoque'],
    timeOfDay: 'cualquiera',
    difficultyLevel: 'principiante',
    sessionType: 'guided_pure',
    isCustomizable: false,
    audioLayers: { defaultBinaural: 'alpha_waves' },
    breathingPattern: { inhale: 4, hold: 4, exhale: 4, holdPost: 4 },
    voiceStyle: 'standard',
    creatorName: 'Sarah Jenkins',
    creatorCredentials: 'Performance Coach',
    isPremium: false,
    color: '#FF6B6B',
  },
  {
    id: 'anx_sigh',
    title: 'Suspiro Cíclico',
    description: 'La forma más rápida de bajar la frecuencia cardíaca según Stanford.',
    scientificBenefits: 'Investigaciones del Dr. Andrew Huberman demuestran que el suspiro cíclico descarga el exceso de CO2 de los pulmones de forma más eficiente que cualquier otra técnica.',
    durationMinutes: 3,
    category: 'ansiedad',
    moodTags: ['estrés agudo', 'pánico', 'alivio'],
    timeOfDay: 'cualquiera',
    difficultyLevel: 'principiante',
    sessionType: 'guided_pure',
    isCustomizable: false,
    audioLayers: { defaultSoundscape: 'wind_soft' },
    breathingPattern: { inhale: 2, hold: 1, exhale: 6, holdPost: 0 },
    voiceStyle: 'deep',
    creatorName: 'Dr. David Spiegel',
    creatorCredentials: 'Psiquiatra, Stanford Medicine',
    isPremium: true,
    color: '#FF6B6B',
  },

  // ===== DESPERTAR (Activación y Alerta) =====
  {
    id: 'wake_bellows',
    title: 'Respiración de Fuelle (Bhastrika)',
    description: 'Genera energía interna y claridad mental instantánea.',
    scientificBenefits: 'Aumenta la tasa metabólica basal y la oxigenación en los capilares pre-frontales, estimulando el estado de alerta sin los picos de ansiedad de la cafeína.',
    durationMinutes: 3,
    category: 'despertar',
    moodTags: ['energía', 'foco', 'mañana'],
    timeOfDay: 'mañana',
    difficultyLevel: 'intermedio',
    sessionType: 'guided_pure',
    isCustomizable: false,
    audioLayers: { defaultBinaural: 'gamma_waves', defaultSoundscape: 'river_mountain' },
    breathingPattern: { inhale: 1.5, hold: 0, exhale: 1.5, holdPost: 0 },
    voiceStyle: 'energizing',
    creatorName: 'Ananda Gupta',
    creatorCredentials: 'Maestro de Pranayama',
    isPremium: false,
    color: '#FFD93D',
  },
  {
    id: 'wake_sun',
    title: 'Aliento de Fuego (Kapalbhati)',
    description: 'Purifica los canales energéticos y activa el core.',
    scientificBenefits: 'Estimula el plexo solar y el diafragma, mejorando la digestión y enviando señales de vigilia al tronco encefálico mediante exhalaciones vigorosas.',
    durationMinutes: 5,
    category: 'despertar',
    moodTags: ['despertar', 'fuerza', 'claridad'],
    timeOfDay: 'mañana',
    difficultyLevel: 'avanzado',
    sessionType: 'guided_pure',
    isCustomizable: false,
    audioLayers: { defaultBinaural: 'beta_waves' },
    breathingPattern: { inhale: 0.8, hold: 0, exhale: 0.2, holdPost: 0 },
    voiceStyle: 'energizing',
    creatorName: 'Yogi Vini',
    creatorCredentials: 'Especialista en Hatha Yoga',
    isPremium: true,
    color: '#FFD93D',
  },

  // ===== SUEÑO (Descenso a Delta) =====
  {
    id: 'sleep_nsdr',
    title: 'NSDR (Non-Sleep Deep Rest)',
    description: 'Protocolo de descanso profundo para recuperar el cerebro sin dormir.',
    scientificBenefits: 'Utiliza el escaneo corporal para entrar en un estado de hipnagogia (limbo entre vigilia y sueño), donde el cerebro repara circuitos dopaminérgicos dañados por el estrés.',
    durationMinutes: 10,
    category: 'sueño',
    moodTags: ['fatiga', 'descanso', 'siesta'],
    timeOfDay: 'tarde',
    difficultyLevel: 'principiante',
    sessionType: 'guided_pure',
    isCustomizable: false,
    audioLayers: { defaultBinaural: 'delta_waves', defaultSoundscape: 'forest_night' },
    breathingPattern: { inhale: 6, hold: 0, exhale: 6, holdPost: 0 },
    voiceStyle: 'deep',
    creatorName: 'Dr. Andrew Huberman',
    creatorCredentials: 'Neurobiólogo, Stanford',
    isPremium: false,
    color: '#4A90E2',
  },
  {
    id: 'sleep_478_night',
    title: '4-7-8 Nocturno',
    description: 'La variante optimizada para inducción al sueño profundo.',
    scientificBenefits: 'La retención de 7 segundos permite que la hemoglobina se cargue de oxígeno mientras el CO2 se acumula ligeramente, lo que induce una somnolencia natural y segura.',
    durationMinutes: 10,
    category: 'sueño',
    moodTags: ['insomnio', 'sueño', 'paz'],
    timeOfDay: 'noche',
    difficultyLevel: 'principiante',
    sessionType: 'guided_pure',
    isCustomizable: false,
    audioLayers: { defaultBinaural: 'delta_waves', defaultSoundscape: 'ocean_calm' },
    breathingPattern: { inhale: 4, hold: 7, exhale: 8, holdPost: 0 },
    voiceStyle: 'deep',
    creatorName: 'Dr. Andrew Weil',
    creatorCredentials: 'Fundador de Medicina Integrativa',
    isPremium: true,
    color: '#4A90E2',
  },

  // ===== MINDFULNESS (Consciencia Pura) =====
  {
    id: 'mind_open',
    title: 'Monitorización Abierta',
    description: 'Aprende a ser el observador de tus pensamientos sin juzgar.',
    scientificBenefits: 'Reduce la conectividad en la Red Neuronal por Defecto (DMN), disminuyendo la rumiación sobre el pasado y la preocupación por el futuro.',
    durationMinutes: 15,
    category: 'mindfulness',
    moodTags: ['rumiación', 'presencia', 'paz'],
    timeOfDay: 'cualquiera',
    difficultyLevel: 'intermedio',
    sessionType: 'guided_pure',
    isCustomizable: false,
    audioLayers: { defaultBinaural: 'alpha_waves' },
    breathingPattern: { inhale: 4, hold: 0, exhale: 4, holdPost: 0 },
    voiceStyle: 'calm',
    creatorName: 'Jon Kabat-Zinn',
    creatorCredentials: 'Fundador del MBSR',
    isPremium: true,
    color: '#9B59B6',
  },
  {
    id: 'mind_breath',
    title: 'Anclaje en la Respiración',
    description: 'La técnica fundamental de atención plena paso a paso.',
    scientificBenefits: 'Fortalece la corteza prefrontal dorsolateral, mejorando la capacidad de redirigir la atención voluntariamente tras una distracción.',
    durationMinutes: 10,
    category: 'mindfulness',
    moodTags: ['atención', 'calma', 'presente'],
    timeOfDay: 'cualquiera',
    difficultyLevel: 'principiante',
    sessionType: 'guided_pure',
    isCustomizable: false,
    audioLayers: { defaultBinaural: 'alpha_waves', defaultSoundscape: 'wind_soft' },
    breathingPattern: { inhale: 4, hold: 0, exhale: 4, holdPost: 0 },
    voiceStyle: 'calm',
    creatorName: 'Laura Sánchez',
    creatorCredentials: 'Instructora MBSR',
    isPremium: false,
    color: '#9B59B6',
  },

  // ===== RESILIENCIA (Fortalecimiento Cognitivo) =====
  {
    id: 'res_stoic',
    title: 'Visualización Negativa (Estoicismo)',
    description: 'Inmunízate contra las dificultades del día mediante la anticipación.',
    scientificBenefits: 'Utiliza el principio de "pre-exposición cognitiva" para reducir la respuesta galvánica de la piel ante eventos estresantes reales imprevistos.',
    durationMinutes: 8,
    category: 'resiliencia',
    moodTags: ['fortaleza', 'estoicismo', 'preparación'],
    timeOfDay: 'mañana',
    difficultyLevel: 'intermedio',
    sessionType: 'guided_pure',
    isCustomizable: false,
    audioLayers: { defaultBinaural: 'alpha_waves' },
    breathingPattern: { inhale: 4, hold: 2, exhale: 4, holdPost: 2 },
    voiceStyle: 'standard',
    creatorName: 'Marcus Aurelius (Adapt.)',
    creatorCredentials: 'Filosofía Práctica TCC',
    isPremium: true,
    color: '#FF9F43',
  },
  {
    id: 'res_gratitude',
    title: 'Gratitud: Re-cableado de Sesgos',
    description: 'Entrena tu cerebro para detectar lo positivo por encima del peligro.',
    scientificBenefits: 'La práctica activa de la gratitud aumenta la densidad de materia gris en la corteza cingulada anterior, el área encargada de la empatía y el control emocional.',
    durationMinutes: 10,
    category: 'resiliencia',
    moodTags: ['optimismo', 'ánimo', 'felicidad'],
    timeOfDay: 'noche',
    difficultyLevel: 'principiante',
    sessionType: 'guided_pure',
    isCustomizable: false,
    audioLayers: { defaultBinaural: '528hz', defaultSoundscape: 'forest_day' },
    breathingPattern: { inhale: 5, hold: 0, exhale: 5, holdPost: 0 },
    voiceStyle: 'calm',
    creatorName: 'Dr. Carlos Méndez',
    creatorCredentials: 'Psicólogo Clínico, PhD',
    isPremium: false,
    color: '#FF9F43',
  },
  {
    id: 'res_vagus',
    title: 'Tonificación del Vago',
    description: 'Gimnasia interna para tu sistema nervioso parasimpático.',
    scientificBenefits: 'Combina micro-movimientos de ojos con respiración controlada para liberar la compresión del nervio vago en la base del cráneo.',
    durationMinutes: 6,
    category: 'resiliencia',
    moodTags: ['sistema nervioso', 'paz', 'salud'],
    timeOfDay: 'cualquiera',
    difficultyLevel: 'intermedio',
    sessionType: 'guided_pure',
    isCustomizable: false,
    audioLayers: { defaultBinaural: 'theta_waves' },
    breathingPattern: { inhale: 4, hold: 0, exhale: 6, holdPost: 0 },
    voiceStyle: 'standard',
    creatorName: 'Stanley Rosenberg',
    creatorCredentials: 'Terapeuta Craneosacral',
    isPremium: true,
    color: '#FF9F43',
  },
  // ===== NUEVAS SESIONES: ANSIEDAD =====
  {
    id: 'anx_sos',
    title: 'S.O.S. Rescate de Pánico',
    description: 'Intervención de emergencia para detener ataques de pánico mediante hiper-regulación.',
    scientificBenefits: 'Saturación deliberada del sistema vestibular para forzar el cese de la respuesta de lucha o huida.',
    durationMinutes: 2,
    category: 'ansiedad',
    moodTags: ['pánico', 'crisis', 'ayuda'],
    timeOfDay: 'cualquiera',
    difficultyLevel: 'principiante',
    sessionType: 'guided_pure',
    isCustomizable: false,
    audioLayers: { defaultBinaural: 'theta_waves', defaultSoundscape: 'wind_soft' },
    breathingPattern: { inhale: 2, hold: 2, exhale: 4, holdPost: 0 },
    voiceStyle: 'standard',
    creatorName: 'Dra. Elena Ruiz',
    creatorCredentials: 'Psicóloga de Emergencias',
    isPremium: false,
    color: '#FF6B6B',
  },
  {
    id: 'anx_calm_ocean',
    title: 'Calma Oceánica',
    description: 'Respiración rítmica síncrona con las mareas.',
    scientificBenefits: 'La sincronía con ritmos naturales (0.1Hz) induce coherencia cardíaca instantánea.',
    durationMinutes: 7,
    category: 'ansiedad',
    moodTags: ['paz', 'ritmo', 'calma'],
    timeOfDay: 'tarde',
    difficultyLevel: 'principiante',
    sessionType: 'guided_pure',
    isCustomizable: false,
    audioLayers: { defaultSoundscape: 'ocean_calm' },
    breathingPattern: { inhale: 5, hold: 0, exhale: 5, holdPost: 0 },
    voiceStyle: 'calm',
    creatorName: 'Julian Ray',
    creatorCredentials: 'Especialista en Sonoterapia',
    isPremium: true,
    color: '#FF6B6B',
  },
  // ===== NUEVAS SESIONES: SUEÑO =====
  {
    id: 'sleep_yoganidra',
    title: 'Yoga Nidra Directo',
    description: 'El sueño psíquico de los yoguis para una recuperación total en minutos.',
    scientificBenefits: 'Lleva al cerebro a las ondas Delta profundas sin necesidad de sueño R.E.M. completo.',
    durationMinutes: 20,
    category: 'sueño',
    moodTags: ['insomnio', 'agotamiento', 'sueño'],
    timeOfDay: 'noche',
    difficultyLevel: 'intermedio',
    sessionType: 'guided_pure',
    isCustomizable: false,
    audioLayers: { defaultBinaural: 'delta_waves', defaultSoundscape: 'forest_night' },
    breathingPattern: { inhale: 4, hold: 4, exhale: 4, holdPost: 4 },
    voiceStyle: 'deep',
    creatorName: 'Swami Veda',
    creatorCredentials: 'Maestro de Yoga Nidra',
    isPremium: true,
    color: '#4A90E2',
  },
  {
    id: 'sleep_soft_rain',
    title: 'Lluvia Mental',
    description: 'Visualización de limpieza para calmar el pensamiento rumiante antes de dormir.',
    scientificBenefits: 'El ruido rosa de la lluvia reduce la variabilidad del pulso facilitando el inicio del sueño.',
    durationMinutes: 15,
    category: 'sueño',
    moodTags: ['mente agitada', 'noche', 'paz'],
    timeOfDay: 'noche',
    difficultyLevel: 'principiante',
    sessionType: 'guided_pure',
    isCustomizable: false,
    audioLayers: { defaultSoundscape: 'rain_soft' },
    breathingPattern: { inhale: 6, hold: 0, exhale: 6, holdPost: 0 },
    voiceStyle: 'calm',
    creatorName: 'Dra. Lisa Miller',
    creatorCredentials: 'Clínica del Sueño',
    isPremium: false,
    color: '#4A90E2',
  },
  // ===== NUEVAS SESIONES: DESPERTAR =====
  {
    id: 'wake_espresso',
    title: 'Espresso Mental',
    description: 'Protocolo de alerta rápida para combatir la fatiga de media tarde.',
    scientificBenefits: 'Estimulación del locus coeruleus mediante hiperventilación controlada.',
    durationMinutes: 2,
    category: 'despertar',
    moodTags: ['energía', 'foco', 'fatiga'],
    timeOfDay: 'tarde',
    difficultyLevel: 'intermedio',
    sessionType: 'guided_pure',
    isCustomizable: false,
    audioLayers: { defaultBinaural: 'gamma_waves' },
    breathingPattern: { inhale: 1, hold: 0, exhale: 1, holdPost: 0 },
    voiceStyle: 'energizing',
    creatorName: 'Coach Mark',
    creatorCredentials: 'Biohacker Coach',
    isPremium: false,
    color: '#FFD93D',
  },
  // ===== NUEVAS SESIONES: MINDFULNESS =====
  {
    id: 'mind_sky',
    title: 'Mente como el Cielo',
    description: 'Visualización avanzada para disolver nubes de preocupación.',
    scientificBenefits: 'Entrena la desidentificación cognitiva, clave en terapias de tercera generación.',
    durationMinutes: 12,
    category: 'mindfulness',
    moodTags: ['claridad', 'visión', 'paz'],
    timeOfDay: 'mañana',
    difficultyLevel: 'avanzado',
    sessionType: 'guided_pure',
    isCustomizable: false,
    audioLayers: { defaultSoundscape: 'wind_soft' },
    breathingPattern: { inhale: 4, hold: 0, exhale: 4, holdPost: 0 },
    voiceStyle: 'calm',
    creatorName: 'Zen Master Kim',
    creatorCredentials: 'Abad del Monasterio Shoin',
    isPremium: true,
    color: '#9B59B6',
  }
];

export const getSessionsByCategory = (category: string) => {
  return MEDITATION_SESSIONS.filter(s => s.category === category);
};

export const getSessionsByMood = (mood: string) => {
  return MEDITATION_SESSIONS.filter(s => s.moodTags.includes(mood));
};

export const getFreeSessionsCount = () => {
  return MEDITATION_SESSIONS.filter(s => !s.isPremium).length;
};

export const getPremiumSessionsCount = () => {
  return MEDITATION_SESSIONS.filter(s => s.isPremium).length;
};
