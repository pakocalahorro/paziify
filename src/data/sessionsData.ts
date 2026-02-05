export interface AudioLayers {
  voice?: any;
  voiceTrack?: string; // Pre-recorded voice track URL (for background execution)
  defaultSoundscape?: string;
  defaultBinaural?: string;
  defaultElements?: string;
  postSilence?: number;
}

export interface MeditationSession {
  id: string;
  title: string;
  description: string;
  durationMinutes: number;

  // Categorización
  category: 'ansiedad' | 'despertar' | 'sueno' | 'mindfulness' | 'resiliencia' | 'salud' | 'rendimiento' | 'emocional' | 'kids' | 'habitos' | 'calmasos';
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

  // UI Display & Synchronization
  visualSync: boolean; // false for atmospheric sessions (no titles, generic breath)
  audioAdjustmentFactor?: number; // micro-adjustment for the 18 core sessions
  color: string;
  practiceInstruction: string;
  thumbnailUrl?: string;
  isTechnical?: boolean;
}

export const MEDITATION_SESSIONS: MeditationSession[] = [
  {
    "id": "anx_478",
    "title": "Respiración 4-7-8",
    "description": "El \"sedante natural\" del sistema nervioso diseñado por el Dr. Andrew Weil.",
    "scientificBenefits": "Al forzar una exhalación el doble de larga que la inhalación, obligamos al nervio vago a enviar una señal de calma al corazón, reduciendo el cortisol en sangre.",
    "durationMinutes": 5,
    "category": "calmasos",
    "moodTags": [
      "pánico",
      "estrés",
      "nervios"
    ],
    "timeOfDay": "cualquiera",
    "difficultyLevel": "principiante",
    "sessionType": "guided_pure",
    "isCustomizable": false,
    "audioLayers": {
      "voiceTrack": "https://ueuxjtyottluwkvdreqe.supabase.co/storage/v1/object/public/meditation-voices/calmasos_tecnica_001_respiracion-4-7-8.mp3",
      "defaultBinaural": "theta_waves",
      "defaultSoundscape": "bird_relaxation"
    },
    "breathingPattern": {
      "inhale": 4,
      "hold": 7,
      "exhale": 8,
      "holdPost": 0
    },
    "voiceStyle": "deep",
    "creatorName": "Paziify Team",
    "creatorCredentials": "Protocolo Técnico Paziify",
    "isTechnical": true,
    "visualSync": true,
    "isPremium": false,
    "color": "#FF6B6B",
    "practiceInstruction": "Cierra los ojos y déjate guiar por la voz y las vibraciones.",
    "thumbnailUrl": "https://ueuxjtyottluwkvdreqe.supabase.co/storage/v1/object/public/meditation-thumbnails/calmasos_tecnica_001_respiracion-4-7-8.webp"
  },
  {
    "id": "anx_box",
    "title": "Respiración Cuadrada (Box Breathing)",
    "description": "Técnica utilizada por Navy Seals para mantener la calma bajo fuego.",
    "scientificBenefits": "Sincroniza el ritmo cardíaco con la presión arterial (coherencia cardiovascular), permitiendo que el cerebro racional (neocórtex) mantenga el control sobre el emocional (amígdala).",
    "durationMinutes": 4,
    "category": "calmasos",
    "moodTags": [
      "presión",
      "calma",
      "enfoque"
    ],
    "timeOfDay": "cualquiera",
    "difficultyLevel": "principiante",
    "sessionType": "guided_pure",
    "isCustomizable": false,
    "audioLayers": {
      "voiceTrack": "https://ueuxjtyottluwkvdreqe.supabase.co/storage/v1/object/public/meditation-voices/calmasos_tecnica_002_respiracion-cuadrada-box-breathing-.mp3",
      "defaultBinaural": "alpha_waves",
      "defaultSoundscape": "moon_stretched"
    },
    "breathingPattern": {
      "inhale": 4,
      "hold": 4,
      "exhale": 4,
      "holdPost": 4
    },
    "voiceStyle": "standard",
    "creatorName": "Paziify Team",
    "creatorCredentials": "Protocolo Técnico Paziify",
    "isTechnical": true,
    "visualSync": true,
    "isPremium": false,
    "color": "#FF6B6B",
    "practiceInstruction": "Enfócate en el orbe o mantén los ojos cerrados sintiendo el ritmo constante.",
    "thumbnailUrl": "https://ueuxjtyottluwkvdreqe.supabase.co/storage/v1/object/public/meditation-thumbnails/calmasos_tecnica_002_respiracion-cuadrada-box-breathing-.webp"
  },
  {
    "id": "anx_sigh",
    "title": "Suspiro Cíclico",
    "description": "La forma más rápida de bajar la frecuencia cardíaca según Stanford.",
    "scientificBenefits": "Investigaciones del Dr. Andrew Huberman demuestran que el suspiro cíclico descarga el exceso de CO2 de los pulmones de forma más eficiente que cualquier otra técnica.",
    "durationMinutes": 3,
    "category": "calmasos",
    "moodTags": [
      "estrés agudo",
      "pánico",
      "alivio"
    ],
    "timeOfDay": "cualquiera",
    "difficultyLevel": "principiante",
    "sessionType": "guided_pure",
    "isCustomizable": false,
    "audioLayers": {
      "voiceTrack": "https://ueuxjtyottluwkvdreqe.supabase.co/storage/v1/object/public/meditation-voices/calmasos_tecnica_003_suspiro-ciclico.mp3",
      "defaultSoundscape": "ethereal_voices"
    },
    "breathingPattern": {
      "inhale": 2,
      "hold": 1,
      "exhale": 6,
      "holdPost": 0
    },
    "voiceStyle": "deep",
    "creatorName": "Paziify Team",
    "creatorCredentials": "Protocolo Técnico Paziify",
    "isTechnical": true,
    "visualSync": true,
    "isPremium": true,
    "color": "#FF6B6B",
    "practiceInstruction": "Realiza una doble inhalación por la nariz y un suspiro largo por la boca.",
    "thumbnailUrl": "https://ueuxjtyottluwkvdreqe.supabase.co/storage/v1/object/public/meditation-thumbnails/calmasos_tecnica_003_suspiro-ciclico.webp"
  },
  {
    "id": "wake_bellows",
    "title": "Respiración de Fuelle (Bhastrika)",
    "description": "Genera energía interna y despierta tu claridad mental instantánea.",
    "scientificBenefits": "Al realizar respiraciones rítmicas e intensas, aumentamos la tasa de intercambio de gases en los pulmones, elevando el estado de alerta del cerebro y eliminando la niebla mental matutina sin cafeína.",
    "durationMinutes": 3,
    "category": "despertar",
    "moodTags": [
      "energía",
      "foco",
      "mañana"
    ],
    "timeOfDay": "mañana",
    "difficultyLevel": "intermedio",
    "sessionType": "guided_pure",
    "isCustomizable": false,
    "audioLayers": {
      "voiceTrack": "https://ueuxjtyottluwkvdreqe.supabase.co/storage/v1/object/public/meditation-voices/despertar_tecnica_004_respiracion-de-fuelle-bhastrika-.mp3",
      "defaultBinaural": "gamma_waves",
      "defaultSoundscape": "meditation_bowls"
    },
    "breathingPattern": {
      "inhale": 2,
      "hold": 0.5,
      "exhale": 2,
      "holdPost": 0.5
    },
    "voiceStyle": "energizing",
    "creatorName": "Paziify Team",
    "creatorCredentials": "Protocolo Técnico Paziify",
    "isTechnical": true,
    "visualSync": true,
    "isPremium": false,
    "color": "#FFD93D",
    "practiceInstruction": "Mantén los ojos abiertos y sigue el orbe para sincronizar tu energía.",
    "thumbnailUrl": "https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?w=800&q=80"
  },
  {
    "id": "wake_sun",
    "title": "Aliento de Fuego (Kapalbhati)",
    "description": "Purifica tus pulmones y activa tu metabolismo con exhalaciones rítmicas.",
    "scientificBenefits": "Esta técnica de \"limpieza de cráneo\" estimula el nervio frénico y masajea los órganos abdominales, forzando la renovación del aire residual de los pulmones y aumentando la vitalidad basal.",
    "durationMinutes": 5,
    "category": "despertar",
    "moodTags": [
      "despertar",
      "fuerza",
      "claridad"
    ],
    "timeOfDay": "mañana",
    "difficultyLevel": "avanzado",
    "sessionType": "guided_pure",
    "isCustomizable": false,
    "audioLayers": {
      "voiceTrack": "https://ueuxjtyottluwkvdreqe.supabase.co/storage/v1/object/public/meditation-voices/despertar_tecnica_005_aliento-de-fuego-kapalbhati-.mp3",
      "defaultBinaural": "beta_waves",
      "defaultSoundscape": "sirens_call_a"
    },
    "breathingPattern": {
      "inhale": 1.5,
      "hold": 0,
      "exhale": 0.5,
      "holdPost": 1
    },
    "voiceStyle": "energizing",
    "creatorName": "Paziify Team",
    "creatorCredentials": "Protocolo Técnico Paziify",
    "isTechnical": true,
    "visualSync": true,
    "isPremium": true,
    "color": "#FFD93D",
    "practiceInstruction": "Ojos abiertos enfocados en un punto o el orbe. Exhalaciones vigorosas."
  },
  {
    "id": "sleep_nsdr",
    "title": "NSDR (Non-Sleep Deep Rest)",
    "description": "Protocolo de descanso profundo para recuperar el cerebro sin dormir.",
    "scientificBenefits": "Utiliza el escaneo corporal para entrar en un estado de hipnagogia (limbo entre vigilia y sueño), donde el cerebro repara circuitos dopaminérgicos dañados por el estrés.",
    "durationMinutes": 10,
    "category": "sueno",
    "moodTags": [
      "fatiga",
      "descanso",
      "siesta"
    ],
    "timeOfDay": "tarde",
    "difficultyLevel": "principiante",
    "sessionType": "guided_pure",
    "isCustomizable": false,
    "audioLayers": {
      "voiceTrack": "https://ueuxjtyottluwkvdreqe.supabase.co/storage/v1/object/public/meditation-voices/sueno_tecnica_006_nsdr-non-sleep-deep-rest-.mp3",
      "defaultBinaural": "delta_waves",
      "defaultSoundscape": "lotus_peace"
    },
    "breathingPattern": {
      "inhale": 6,
      "hold": 0,
      "exhale": 6,
      "holdPost": 0
    },
    "voiceStyle": "deep",
    "creatorName": "Paziify Team",
    "creatorCredentials": "Protocolo Técnico Paziify",
    "isTechnical": true,
    "visualSync": false,
    "isPremium": false,
    "color": "#4A90E2",
    "practiceInstruction": "Cierra los ojos. Escucha el escaneo corporal y relájate profundamente.",
    "thumbnailUrl": "https://ueuxjtyottluwkvdreqe.supabase.co/storage/v1/object/public/meditation-thumbnails/sueno_tecnica_006_nsdr-non-sleep-deep-rest-.webp"
  },
  {
    "id": "sleep_478_night",
    "title": "4-7-8 Nocturno",
    "description": "La variante optimizada para inducción al sueño profundo.",
    "scientificBenefits": "La retención de 7 segundos permite que la hemoglobina se cargue de oxígeno mientras el CO2 se acumula ligeramente, lo que induce una somnolencia natural y segura.",
    "durationMinutes": 10,
    "category": "sueno",
    "moodTags": [
      "insomnio",
      "sueño",
      "paz"
    ],
    "timeOfDay": "noche",
    "difficultyLevel": "principiante",
    "sessionType": "guided_pure",
    "isCustomizable": false,
    "audioLayers": {
      "voiceTrack": "https://ueuxjtyottluwkvdreqe.supabase.co/storage/v1/object/public/meditation-voices/sueno_tecnica_007_4-7-8-nocturno.mp3",
      "defaultBinaural": "delta_waves",
      "defaultSoundscape": "atlantic_loop"
    },
    "breathingPattern": {
      "inhale": 4,
      "hold": 7,
      "exhale": 8,
      "holdPost": 0
    },
    "voiceStyle": "deep",
    "creatorName": "Paziify Team",
    "creatorCredentials": "Protocolo Técnico Paziify",
    "isTechnical": true,
    "visualSync": true,
    "isPremium": true,
    "color": "#4A90E2",
    "practiceInstruction": "Ojos cerrados. Deja que la exhalación sea un alivio total.",
    "thumbnailUrl": "https://ueuxjtyottluwkvdreqe.supabase.co/storage/v1/object/public/meditation-thumbnails/sueno_tecnica_007_4-7-8-nocturno.webp"
  },
  {
    "id": "mind_open",
    "title": "Monitorización Abierta",
    "description": "Aprende a ser el observador de tus pensamientos sin juzgar.",
    "scientificBenefits": "Reduce la conectividad en la Red Neuronal por Defecto (DMN), disminuyendo la rumiación sobre el pasado y la preocupación por el futuro.",
    "durationMinutes": 15,
    "category": "mindfulness",
    "moodTags": [
      "rumiación",
      "presencia",
      "paz"
    ],
    "timeOfDay": "cualquiera",
    "difficultyLevel": "intermedio",
    "sessionType": "guided_pure",
    "isCustomizable": false,
    "audioLayers": {
      "voiceTrack": "https://ueuxjtyottluwkvdreqe.supabase.co/storage/v1/object/public/meditation-voices/mindfulness_tecnica_008_monitorizacion-abierta.mp3",
      "defaultBinaural": "alpha_waves",
      "defaultSoundscape": "forest_meditation"
    },
    "breathingPattern": {
      "inhale": 4,
      "hold": 0,
      "exhale": 4,
      "holdPost": 0
    },
    "voiceStyle": "calm",
    "creatorName": "Paziify Team",
    "creatorCredentials": "Protocolo Técnico Paziify",
    "isTechnical": true,
    "visualSync": false,
    "isPremium": true,
    "color": "#9B59B6",
    "practiceInstruction": "Cierra los ojos y observa tus pensamientos como nubes pasando.",
    "thumbnailUrl": "https://ueuxjtyottluwkvdreqe.supabase.co/storage/v1/object/public/meditation-thumbnails/mindfulness_tecnica_008_monitorizacion-abierta.webp"
  },
  {
    "id": "mind_breath",
    "title": "Anclaje en la Respiración",
    "description": "La técnica fundamental de atención plena paso a paso.",
    "scientificBenefits": "Fortalece la corteza prefrontal dorsolateral, mejorando la capacidad de redirigir la atención voluntariamente tras una distracción.",
    "durationMinutes": 10,
    "category": "mindfulness",
    "moodTags": [
      "atención",
      "calma",
      "presente"
    ],
    "timeOfDay": "cualquiera",
    "difficultyLevel": "principiante",
    "sessionType": "guided_pure",
    "isCustomizable": false,
    "audioLayers": {
      "voiceTrack": "https://ueuxjtyottluwkvdreqe.supabase.co/storage/v1/object/public/meditation-voices/mindfulness_tecnica_009_anclaje-en-la-respiracion.mp3",
      "defaultBinaural": "alpha_waves",
      "defaultSoundscape": "wind_chimes"
    },
    "breathingPattern": {
      "inhale": 4,
      "hold": 0,
      "exhale": 4,
      "holdPost": 0
    },
    "voiceStyle": "calm",
    "creatorName": "Paziify Team",
    "creatorCredentials": "Protocolo Técnico Paziify",
    "isTechnical": true,
    "visualSync": false,
    "isPremium": false,
    "color": "#9B59B6",
    "practiceInstruction": "Ojos cerrados. Siente el aire entrar y salir por tus fosas nasales.",
    "thumbnailUrl": "https://ueuxjtyottluwkvdreqe.supabase.co/storage/v1/object/public/meditation-thumbnails/mindfulness_tecnica_009_anclaje-en-la-respiracion.webp"
  },
  {
    "id": "res_stoic",
    "title": "Visualización Negativa (Estoicismo)",
    "description": "Inmunízate contra las dificultades del día mediante la anticipación.",
    "scientificBenefits": "Utiliza el principio de \"pre-exposición cognitiva\" para reducir la respuesta galvánica de la piel ante eventos estresantes reales imprevistos.",
    "durationMinutes": 8,
    "category": "resiliencia",
    "moodTags": [
      "fortaleza",
      "estoicismo",
      "preparación"
    ],
    "timeOfDay": "mañana",
    "difficultyLevel": "intermedio",
    "sessionType": "guided_pure",
    "isCustomizable": false,
    "audioLayers": {
      "voiceTrack": "https://ueuxjtyottluwkvdreqe.supabase.co/storage/v1/object/public/meditation-voices/resiliencia_tecnica_010_visualizacion-negativa-estoicismo-.mp3",
      "defaultBinaural": "alpha_waves",
      "defaultSoundscape": "meditative_motion"
    },
    "breathingPattern": {
      "inhale": 4,
      "hold": 2,
      "exhale": 4,
      "holdPost": 2
    },
    "voiceStyle": "standard",
    "creatorName": "Paziify Team",
    "creatorCredentials": "Protocolo Técnico Paziify",
    "isTechnical": true,
    "visualSync": false,
    "isPremium": true,
    "color": "#FF9F43",
    "practiceInstruction": "Enfócate en la voz. Visualiza los desafíos con serenidad y ojos cerrados.",
    "thumbnailUrl": "https://ueuxjtyottluwkvdreqe.supabase.co/storage/v1/object/public/meditation-thumbnails/resiliencia_tecnica_010_visualizacion-negativa.webp"
  },
  {
    "id": "res_gratitude",
    "title": "Gratitud: Re-cableado de Sesgos",
    "description": "Entrena tu cerebro para detectar lo positivo por encima del peligro.",
    "scientificBenefits": "La práctica activa de la gratitud aumenta la densidad de materia gris en la corteza cingulada anterior, el área encargada de la empatía y el control emocional.",
    "durationMinutes": 10,
    "category": "resiliencia",
    "moodTags": [
      "optimismo",
      "ánimo",
      "felicidad"
    ],
    "timeOfDay": "noche",
    "difficultyLevel": "principiante",
    "sessionType": "guided_pure",
    "isCustomizable": false,
    "audioLayers": {
      "voiceTrack": "https://ueuxjtyottluwkvdreqe.supabase.co/storage/v1/object/public/meditation-voices/resiliencia_tecnica_011_gratitud-re-cableado-de-sesgos.mp3",
      "defaultBinaural": "528hz",
      "defaultSoundscape": "forest_meditation"
    },
    "breathingPattern": {
      "inhale": 5,
      "hold": 0,
      "exhale": 5,
      "holdPost": 0
    },
    "voiceStyle": "calm",
    "creatorName": "Paziify Team",
    "creatorCredentials": "Protocolo Técnico Paziify",
    "isTechnical": true,
    "visualSync": false,
    "isPremium": false,
    "color": "#FF9F43",
    "practiceInstruction": "Ojos cerrados. Evoca tres momentos de gratitud mientras respiras.",
    "thumbnailUrl": "https://ueuxjtyottluwkvdreqe.supabase.co/storage/v1/object/public/meditation-thumbnails/resiliencia_tecnica_011_gratitud-recableado.webp"
  },
  {
    "id": "res_vagus",
    "title": "Tonificación del Vago",
    "description": "Gimnasia interna para tu sistema nervioso parasimpático.",
    "scientificBenefits": "Combina micro-movimientos de ojos con respiración controlada para liberar la compresión del nervio vago en la base del cráneo.",
    "durationMinutes": 6,
    "category": "resiliencia",
    "moodTags": [
      "sistema nervioso",
      "paz",
      "salud"
    ],
    "timeOfDay": "cualquiera",
    "difficultyLevel": "intermedio",
    "sessionType": "guided_pure",
    "isCustomizable": false,
    "audioLayers": {
      "voiceTrack": "https://ueuxjtyottluwkvdreqe.supabase.co/storage/v1/object/public/meditation-voices/resiliencia_tecnica_012_tonificacion-del-vago.mp3",
      "defaultBinaural": "theta_waves",
      "defaultSoundscape": "theta_state"
    },
    "breathingPattern": {
      "inhale": 4,
      "hold": 0,
      "exhale": 6,
      "holdPost": 0
    },
    "voiceStyle": "standard",
    "creatorName": "Paziify Team",
    "creatorCredentials": "Protocolo Técnico Paziify",
    "isTechnical": true,
    "visualSync": false,
    "isPremium": true,
    "color": "#FF9F43",
    "practiceInstruction": "Ojos suavemente cerrados. Sigue las instrucciones para liberar tensión.",
    "thumbnailUrl": "https://ueuxjtyottluwkvdreqe.supabase.co/storage/v1/object/public/meditation-thumbnails/resiliencia_tecnica_012_tonificacion-del-vago.webp"
  },
  {
    "id": "anx_sos",
    "title": "S.O.S. Rescate de Pánico",
    "description": "Intervención de emergencia para detener ataques de pánico mediante hiper-regulación.",
    "scientificBenefits": "Saturación deliberada del sistema vestibular para forzar el cese de la respuesta de lucha o huida.",
    "durationMinutes": 2,
    "category": "calmasos",
    "moodTags": [
      "pánico",
      "crisis",
      "ayuda"
    ],
    "timeOfDay": "cualquiera",
    "difficultyLevel": "principiante",
    "sessionType": "guided_pure",
    "isCustomizable": false,
    "audioLayers": {
      "voiceTrack": "https://ueuxjtyottluwkvdreqe.supabase.co/storage/v1/object/public/meditation-voices/calmasos_tecnica_013_s-o-s-rescate-de-panico.mp3",
      "defaultBinaural": "theta_waves",
      "defaultSoundscape": "athmo_motion"
    },
    "breathingPattern": {
      "inhale": 2,
      "hold": 2,
      "exhale": 4,
      "holdPost": 0
    },
    "voiceStyle": "standard",
    "creatorName": "Paziify Team",
    "creatorCredentials": "Protocolo Técnico Paziify",
    "isTechnical": true,
    "visualSync": true,
    "isPremium": false,
    "color": "#FF6B6B",
    "practiceInstruction": "Sigue el orbe visualmente si te ayuda a anclarte en el presente.",
    "thumbnailUrl": "https://ueuxjtyottluwkvdreqe.supabase.co/storage/v1/object/public/meditation-thumbnails/calmasos_tecnica_013_s-o-s-rescate-de-panico.webp"
  },
  {
    "id": "anx_calm_ocean",
    "title": "Calma Oceánica",
    "description": "Respiración rítmica síncrona con las mareas.",
    "scientificBenefits": "La sincronía con ritmos naturales (0.1Hz) induce coherencia cardíaca instantánea.",
    "durationMinutes": 7,
    "category": "calmasos",
    "moodTags": [
      "paz",
      "ritmo",
      "calma"
    ],
    "timeOfDay": "tarde",
    "difficultyLevel": "principiante",
    "sessionType": "guided_pure",
    "isCustomizable": false,
    "audioLayers": {
      "voiceTrack": "https://ueuxjtyottluwkvdreqe.supabase.co/storage/v1/object/public/meditation-voices/calmasos_tecnica_014_calma-oceanica.mp3",
      "defaultSoundscape": "atlantic_loop"
    },
    "breathingPattern": {
      "inhale": 5,
      "hold": 0,
      "exhale": 5,
      "holdPost": 0
    },
    "voiceStyle": "calm",
    "creatorName": "Paziify Team",
    "creatorCredentials": "Protocolo Técnico Paziify",
    "isTechnical": true,
    "visualSync": true,
    "isPremium": true,
    "color": "#FF6B6B",
    "practiceInstruction": "Cierra los ojos e imagina el vaivén de las olas con tu respiración.",
    "thumbnailUrl": "https://ueuxjtyottluwkvdreqe.supabase.co/storage/v1/object/public/meditation-thumbnails/calmasos_tecnica_014_calma-oceanica.webp"
  },
  {
    "id": "sleep_yoganidra",
    "title": "Yoga Nidra Directo",
    "description": "El sueño psíquico de los yoguis para una recuperación total en minutos.",
    "scientificBenefits": "Lleva al cerebro a las ondas Delta profundas sin necesidad de sueño R.E.M. completo.",
    "durationMinutes": 20,
    "category": "sueno",
    "moodTags": [
      "insomnio",
      "agotamiento",
      "sueño"
    ],
    "timeOfDay": "noche",
    "difficultyLevel": "intermedio",
    "sessionType": "guided_pure",
    "isCustomizable": false,
    "audioLayers": {
      "voiceTrack": "https://ueuxjtyottluwkvdreqe.supabase.co/storage/v1/object/public/meditation-voices/sueno_tecnica_015_yoga-nidra-directo.mp3",
      "defaultBinaural": "delta_waves",
      "defaultSoundscape": "moon_stretched"
    },
    "breathingPattern": {
      "inhale": 4,
      "hold": 4,
      "exhale": 4,
      "holdPost": 4
    },
    "voiceStyle": "deep",
    "creatorName": "Paziify Team",
    "creatorCredentials": "Protocolo Técnico Paziify",
    "isTechnical": true,
    "visualSync": false,
    "isPremium": true,
    "color": "#4A90E2",
    "practiceInstruction": "Ojos cerrados. Entra en el descanso profundo sin dormirte.",
    "thumbnailUrl": "https://ueuxjtyottluwkvdreqe.supabase.co/storage/v1/object/public/meditation-thumbnails/sueno_tecnica_015_yoga-nidra-directo.webp"
  },
  {
    "id": "sleep_soft_rain",
    "title": "Lluvia Mental",
    "description": "Visualización de limpieza para calmar el pensamiento rumiante antes de dormir.",
    "scientificBenefits": "El ruido rosa de la lluvia reduce la variabilidad del pulso facilitando el inicio del sueño.",
    "durationMinutes": 15,
    "category": "sueno",
    "moodTags": [
      "mente agitada",
      "noche",
      "paz"
    ],
    "timeOfDay": "noche",
    "difficultyLevel": "principiante",
    "sessionType": "guided_pure",
    "isCustomizable": false,
    "audioLayers": {
      "voiceTrack": "https://ueuxjtyottluwkvdreqe.supabase.co/storage/v1/object/public/meditation-voices/sueno_tecnica_016_lluvia-mental.mp3",
      "defaultSoundscape": "bird_relaxation"
    },
    "breathingPattern": {
      "inhale": 6,
      "hold": 0,
      "exhale": 6,
      "holdPost": 0
    },
    "voiceStyle": "calm",
    "creatorName": "Paziify Team",
    "creatorCredentials": "Protocolo Técnico Paziify",
    "isTechnical": true,
    "visualSync": false,
    "isPremium": false,
    "color": "#4A90E2",
    "practiceInstruction": "Cierra los ojos y déjate llevar por el sonido de la lluvia.",
    "thumbnailUrl": "https://ueuxjtyottluwkvdreqe.supabase.co/storage/v1/object/public/meditation-thumbnails/sueno_tecnica_016_lluvia-mental.webp"
  },
  {
    "id": "wake_espresso",
    "title": "Espresso Mental",
    "description": "Sustituye el café con un protocolo de hiper-alerta de 2 minutos.",
    "scientificBenefits": "Estimulamos el locus coeruleus mediante una respiración rítmica y continua, lo que libera norepinefrina de forma natural para combatir la fatiga de media tarde sin \"crash\" posterior.",
    "durationMinutes": 2,
    "category": "despertar",
    "moodTags": [
      "energía",
      "foco",
      "fatiga"
    ],
    "timeOfDay": "tarde",
    "difficultyLevel": "intermedio",
    "sessionType": "guided_pure",
    "isCustomizable": false,
    "audioLayers": {
      "voiceTrack": "https://ueuxjtyottluwkvdreqe.supabase.co/storage/v1/object/public/meditation-voices/despertar_tecnica_017_espresso-mental.mp3",
      "defaultBinaural": "gamma_waves",
      "defaultSoundscape": "meditation_bowls"
    },
    "breathingPattern": {
      "inhale": 2,
      "hold": 0,
      "exhale": 2,
      "holdPost": 0
    },
    "voiceStyle": "energizing",
    "creatorName": "Paziify Team",
    "creatorCredentials": "Protocolo Técnico Paziify",
    "isTechnical": true,
    "visualSync": true,
    "isPremium": false,
    "color": "#FFD93D",
    "practiceInstruction": "Sigue el ritmo del orbe. Mantente activo y alerta."
  },
  {
    "id": "mind_sky",
    "title": "Mente como el Cielo",
    "description": "Visualización avanzada para disolver nubes de preocupación.",
    "scientificBenefits": "Entrena la desidentificación cognitiva, clave en terapias de tercera generación.",
    "durationMinutes": 12,
    "category": "mindfulness",
    "moodTags": [
      "claridad",
      "visión",
      "paz"
    ],
    "timeOfDay": "mañana",
    "difficultyLevel": "avanzado",
    "sessionType": "guided_pure",
    "isCustomizable": false,
    "audioLayers": {
      "voiceTrack": "https://ueuxjtyottluwkvdreqe.supabase.co/storage/v1/object/public/meditation-voices/mindfulness_tecnica_018_mente-como-el-cielo.mp3",
      "defaultSoundscape": "ethereal_voices"
    },
    "breathingPattern": {
      "inhale": 4,
      "hold": 0,
      "exhale": 4,
      "holdPost": 0
    },
    "voiceStyle": "calm",
    "creatorName": "Paziify Team",
    "creatorCredentials": "Protocolo Técnico Paziify",
    "isTechnical": true,
    "visualSync": false,
    "isPremium": true,
    "color": "#9B59B6",
    "practiceInstruction": "Cierra los ojos y expande tu consciencia como el cielo infinito.",
    "thumbnailUrl": "https://ueuxjtyottluwkvdreqe.supabase.co/storage/v1/object/public/meditation-thumbnails/mindfulness_tecnica_018_mente-como-el-cielo.webp"
  },
  {
    "id": "01_respiracion_cuadrada",
    "title": "Respiración Cuadrada (Estabilidad Mental)",
    "description": "Estabilizar el ritmo cardíaco y calmar la mente de forma instantánea mediante una técnica usada por los Navy SEALs.",
    "durationMinutes": 5,
    "category": "calmasos",
    "moodTags": [
      "ansiedad"
    ],
    "timeOfDay": "cualquiera",
    "difficultyLevel": "principiante",
    "sessionType": "guided_pure",
    "isCustomizable": false,
    "audioLayers": {
      "voiceTrack": "https://ueuxjtyottluwkvdreqe.supabase.co/storage/v1/object/public/meditation-voices/calmasos_aria_019_respiracion-cuadrada-estabilidad-mental-.mp3",
      "defaultSoundscape": "meditation_bowls"
    },
    "creatorName": "Aria",
    "creatorCredentials": "Guía Especialista en Mindfulness",
    "scientificBenefits": "Basado en protocolos clínicos de regulación emocional y bio-feedback.",
    "breathingPattern": {
      "inhale": 4,
      "hold": 0,
      "exhale": 4,
      "holdPost": 0
    },
    "voiceStyle": "calm",
    "visualSync": true,
    "isPremium": false,
    "color": "#FF6B6B",
    "practiceInstruction": "Cierra los ojos y déjate guiar por la voz.",
    "thumbnailUrl": "https://ueuxjtyottluwkvdreqe.supabase.co/storage/v1/object/public/meditation-thumbnails/calmasos_aria_019_respiracion-cuadrada-estabilidad-mental-.webp"
  },
  {
    "id": "02_coherencia_cardiaca",
    "title": "Coherencia Cardíaca (Ritmo 5-5)",
    "description": "Sincronizar el ritmo cardíaco con el respiratorio para equilibrar el sistema nervioso autónomo.",
    "durationMinutes": 5,
    "category": "calmasos",
    "moodTags": [
      "ansiedad"
    ],
    "timeOfDay": "cualquiera",
    "difficultyLevel": "principiante",
    "sessionType": "guided_pure",
    "isCustomizable": false,
    "audioLayers": {
      "voiceTrack": "https://ueuxjtyottluwkvdreqe.supabase.co/storage/v1/object/public/meditation-voices/calmasos_aria_020_coherencia-cardiaca-ritmo-5-5-.mp3",
      "defaultSoundscape": "meditation_bowls"
    },
    "creatorName": "Aria",
    "creatorCredentials": "Guía Especialista en Mindfulness",
    "scientificBenefits": "Basado en protocolos clínicos de regulación emocional y bio-feedback.",
    "breathingPattern": {
      "inhale": 4,
      "hold": 0,
      "exhale": 4,
      "holdPost": 0
    },
    "voiceStyle": "calm",
    "visualSync": true,
    "isPremium": false,
    "color": "#FF6B6B",
    "practiceInstruction": "Cierra los ojos y déjate guiar por la voz.",
    "thumbnailUrl": "https://ueuxjtyottluwkvdreqe.supabase.co/storage/v1/object/public/meditation-thumbnails/calmasos_aria_020_coherencia-cardiaca-ritmo-5-5-.webp"
  },
  {
    "id": "03_sosiego_pensamientos",
    "title": "Sosiego de los Pensamientos",
    "description": "Detener el torbellino mental mediante la visualización de los pensamientos como hojas en un río.",
    "durationMinutes": 5,
    "category": "calmasos",
    "moodTags": [
      "ansiedad"
    ],
    "timeOfDay": "cualquiera",
    "difficultyLevel": "principiante",
    "sessionType": "guided_pure",
    "isCustomizable": false,
    "audioLayers": {
      "voiceTrack": "https://ueuxjtyottluwkvdreqe.supabase.co/storage/v1/object/public/meditation-voices/calmasos_aria_021_sosiego-de-los-pensamientos.mp3",
      "defaultSoundscape": "meditation_bowls"
    },
    "creatorName": "Aria",
    "creatorCredentials": "Guía Especialista en Mindfulness",
    "scientificBenefits": "Basado en protocolos clínicos de regulación emocional y bio-feedback.",
    "breathingPattern": {
      "inhale": 4,
      "hold": 0,
      "exhale": 4,
      "holdPost": 0
    },
    "voiceStyle": "calm",
    "visualSync": true,
    "isPremium": false,
    "color": "#FF6B6B",
    "practiceInstruction": "Cierra los ojos y déjate guiar por la voz.",
    "thumbnailUrl": "https://ueuxjtyottluwkvdreqe.supabase.co/storage/v1/object/public/meditation-thumbnails/calmasos_aria_021_sosiego-de-los-pensamientos.webp"
  },
  {
    "id": "04_tecnica_54321",
    "title": "Técnica 5-4-3-2-1 (Anclaje Sensorial)",
    "description": "Detener el ciclo de ansiedad o pánico mediante el anclaje en el momento presente a través de los sentidos.",
    "durationMinutes": 4,
    "category": "calmasos",
    "moodTags": [
      "ansiedad"
    ],
    "timeOfDay": "cualquiera",
    "difficultyLevel": "principiante",
    "sessionType": "guided_pure",
    "isCustomizable": false,
    "audioLayers": {
      "voiceTrack": "https://ueuxjtyottluwkvdreqe.supabase.co/storage/v1/object/public/meditation-voices/calmasos_aria_022_tecnica-5-4-3-2-1-anclaje-sensorial-.mp3",
      "defaultSoundscape": "meditation_bowls"
    },
    "creatorName": "Aria",
    "creatorCredentials": "Guía Especialista en Mindfulness",
    "scientificBenefits": "Basado en protocolos clínicos de regulación emocional y bio-feedback.",
    "breathingPattern": {
      "inhale": 4,
      "hold": 0,
      "exhale": 4,
      "holdPost": 0
    },
    "voiceStyle": "calm",
    "visualSync": true,
    "isPremium": false,
    "color": "#FF6B6B",
    "practiceInstruction": "Cierra los ojos y déjate guiar por la voz.",
    "thumbnailUrl": "https://ueuxjtyottluwkvdreqe.supabase.co/storage/v1/object/public/meditation-thumbnails/calmasos_aria_022_tecnica-de-anclaje-5-4-3-2-1.webp"
  },
  {
    "id": "05_desanclaje_pensamientos",
    "title": "Desanclaje de Pensamientos (Defusión Cognitiva)",
    "description": "Reducir el impacto de los pensamientos intrusivos o rumiantes mediante la técnica de defusión (ver los pensamientos como eventos, no como hechos).",
    "durationMinutes": 4,
    "category": "calmasos",
    "moodTags": [
      "ansiedad"
    ],
    "timeOfDay": "cualquiera",
    "difficultyLevel": "principiante",
    "sessionType": "guided_pure",
    "isCustomizable": false,
    "audioLayers": {
      "voiceTrack": "https://ueuxjtyottluwkvdreqe.supabase.co/storage/v1/object/public/meditation-voices/calmasos_aria_023_desanclaje-de-pensamientos-defusion-cognitiva-.mp3",
      "defaultSoundscape": "meditation_bowls"
    },
    "creatorName": "Aria",
    "creatorCredentials": "Guía Especialista en Mindfulness",
    "scientificBenefits": "Basado en protocolos clínicos de regulación emocional y bio-feedback.",
    "breathingPattern": {
      "inhale": 4,
      "hold": 0,
      "exhale": 4,
      "holdPost": 0
    },
    "voiceStyle": "calm",
    "visualSync": true,
    "isPremium": false,
    "color": "#FF6B6B",
    "practiceInstruction": "Cierra los ojos y déjate guiar por la voz.",
    "thumbnailUrl": "https://ueuxjtyottluwkvdreqe.supabase.co/storage/v1/object/public/meditation-thumbnails/calmasos_aria_023_desanclaje-de-pensamientos.webp"
  },
  {
    "id": "06_refugio_respiracion",
    "title": "El Refugio de la Respiración",
    "description": "Crear un santuario mental de seguridad y calma utilizando la respiración como ancla constante.",
    "durationMinutes": 5,
    "category": "calmasos",
    "moodTags": [
      "ansiedad"
    ],
    "timeOfDay": "cualquiera",
    "difficultyLevel": "principiante",
    "sessionType": "guided_pure",
    "isCustomizable": false,
    "audioLayers": {
      "voiceTrack": "https://ueuxjtyottluwkvdreqe.supabase.co/storage/v1/object/public/meditation-voices/calmasos_aria_024_el-refugio-de-la-respiracion.mp3",
      "defaultSoundscape": "meditation_bowls"
    },
    "creatorName": "Aria",
    "creatorCredentials": "Guía Especialista en Mindfulness",
    "scientificBenefits": "Basado en protocolos clínicos de regulación emocional y bio-feedback.",
    "breathingPattern": {
      "inhale": 4,
      "hold": 0,
      "exhale": 4,
      "holdPost": 0
    },
    "voiceStyle": "calm",
    "visualSync": true,
    "isPremium": false,
    "color": "#FF6B6B",
    "practiceInstruction": "Cierra los ojos y déjate guiar por la voz.",
    "thumbnailUrl": "https://ueuxjtyottluwkvdreqe.supabase.co/storage/v1/object/public/meditation-thumbnails/calmasos_aria_024_la-respiracion-como-refugio.webp"
  },
  {
    "id": "07_sos_reunion",
    "title": "SOS: Antes de una Reunión (Confianza Rápida)",
    "description": "Reducir el cortisol y la ansiedad social antes de una interacción importante, proyectando calma y seguridad.",
    "durationMinutes": 3,
    "category": "calmasos",
    "moodTags": [
      "ansiedad"
    ],
    "timeOfDay": "cualquiera",
    "difficultyLevel": "principiante",
    "sessionType": "guided_pure",
    "isCustomizable": false,
    "audioLayers": {
      "voiceTrack": "https://ueuxjtyottluwkvdreqe.supabase.co/storage/v1/object/public/meditation-voices/calmasos_aria_025_sos-antes-de-una-reunion-confianza-rapida-.mp3",
      "defaultSoundscape": "meditation_bowls"
    },
    "creatorName": "Aria",
    "creatorCredentials": "Guía Especialista en Mindfulness",
    "scientificBenefits": "Basado en protocolos clínicos de regulación emocional y bio-feedback.",
    "breathingPattern": {
      "inhale": 4,
      "hold": 0,
      "exhale": 4,
      "holdPost": 0
    },
    "voiceStyle": "calm",
    "visualSync": true,
    "isPremium": false,
    "color": "#FF6B6B",
    "practiceInstruction": "Cierra los ojos y déjate guiar por la voz.",
    "thumbnailUrl": "https://ueuxjtyottluwkvdreqe.supabase.co/storage/v1/object/public/meditation-thumbnails/calmasos_aria_026_gestion-del-panico-tierra-.webp"
  },
  {
    "id": "08_gestion_panico",
    "title": "Gestión del Pánico (Tierra)",
    "description": "Cortar la escalada fisiológica del ataque de pánico mediante la estimulación del nervio vago y el anclaje físico extremo.",
    "durationMinutes": 4,
    "category": "calmasos",
    "moodTags": [
      "ansiedad"
    ],
    "timeOfDay": "cualquiera",
    "difficultyLevel": "principiante",
    "sessionType": "guided_pure",
    "isCustomizable": false,
    "audioLayers": {
      "voiceTrack": "https://ueuxjtyottluwkvdreqe.supabase.co/storage/v1/object/public/meditation-voices/calmasos_aria_026_gestion-del-panico-tierra-.mp3",
      "defaultSoundscape": "meditation_bowls"
    },
    "creatorName": "Aria",
    "creatorCredentials": "Guía Especialista en Mindfulness",
    "scientificBenefits": "Basado en protocolos clínicos de regulación emocional y bio-feedback.",
    "breathingPattern": {
      "inhale": 4,
      "hold": 0,
      "exhale": 4,
      "holdPost": 0
    },
    "voiceStyle": "calm",
    "visualSync": true,
    "isPremium": false,
    "color": "#FF6B6B",
    "practiceInstruction": "Cierra los ojos y déjate guiar por la voz.",
    "thumbnailUrl": "https://ueuxjtyottluwkvdreqe.supabase.co/storage/v1/object/public/meditation-thumbnails/calmasos_aria_025_sos-antes-de-una-reunion-confianza-rapida-.webp"
  },
  {
    "id": "09_alivio_pecho",
    "title": "Alivio de la Opresión en el Pecho",
    "description": "Aliviar la sensación física de opresión o \"nudo\" en el pecho causada por el estrés agudo mediante la relajación miofascial y la respiración dirigida.",
    "durationMinutes": 5,
    "category": "calmasos",
    "moodTags": [
      "ansiedad"
    ],
    "timeOfDay": "cualquiera",
    "difficultyLevel": "principiante",
    "sessionType": "guided_pure",
    "isCustomizable": false,
    "audioLayers": {
      "voiceTrack": "https://ueuxjtyottluwkvdreqe.supabase.co/storage/v1/object/public/meditation-voices/calmasos_aria_027_alivio-de-la-opresion-en-el-pecho.mp3",
      "defaultSoundscape": "meditation_bowls"
    },
    "creatorName": "Aria",
    "creatorCredentials": "Guía Especialista en Mindfulness",
    "scientificBenefits": "Basado en protocolos clínicos de regulación emocional y bio-feedback.",
    "breathingPattern": {
      "inhale": 4,
      "hold": 0,
      "exhale": 4,
      "holdPost": 0
    },
    "voiceStyle": "calm",
    "visualSync": true,
    "isPremium": false,
    "color": "#FF6B6B",
    "practiceInstruction": "Cierra los ojos y déjate guiar por la voz.",
    "thumbnailUrl": "https://ueuxjtyottluwkvdreqe.supabase.co/storage/v1/object/public/meditation-thumbnails/calmasos_aria_028_neutralizacion-de-la-rumiacion.webp"
  },
  {
    "id": "10_neutralizar_rumiacion",
    "title": "Neutralización de la Rumiación",
    "description": "Interrumpir el ciclo de pensamientos repetitivos y negativos mediante la técnica de \"Contar hacia atrás\" y la focalización externa.",
    "durationMinutes": 4,
    "category": "calmasos",
    "moodTags": [
      "ansiedad"
    ],
    "timeOfDay": "cualquiera",
    "difficultyLevel": "principiante",
    "sessionType": "guided_pure",
    "isCustomizable": false,
    "audioLayers": {
      "voiceTrack": "https://ueuxjtyottluwkvdreqe.supabase.co/storage/v1/object/public/meditation-voices/calmasos_aria_028_neutralizacion-de-la-rumiacion.mp3",
      "defaultSoundscape": "meditation_bowls"
    },
    "creatorName": "Aria",
    "creatorCredentials": "Guía Especialista en Mindfulness",
    "scientificBenefits": "Basado en protocolos clínicos de regulación emocional y bio-feedback.",
    "breathingPattern": {
      "inhale": 4,
      "hold": 0,
      "exhale": 4,
      "holdPost": 0
    },
    "voiceStyle": "calm",
    "visualSync": false,
    "isPremium": false,
    "color": "#FF6B6B",
    "practiceInstruction": "Cierra los ojos y déjate guiar por la voz.",
    "thumbnailUrl": "https://ueuxjtyottluwkvdreqe.supabase.co/storage/v1/object/public/meditation-thumbnails/calmasos_aria_027_alivio-de-la-opresion-en-el-pecho.webp"
  },
  {
    "id": "11_reset_3min",
    "title": "Reset de 3 Minutos",
    "description": "Un rescate rápido ante picos de estrés durante el día de trabajo.",
    "durationMinutes": 3,
    "category": "calmasos",
    "moodTags": [
      "ansiedad"
    ],
    "timeOfDay": "cualquiera",
    "difficultyLevel": "principiante",
    "sessionType": "guided_pure",
    "isCustomizable": false,
    "audioLayers": {
      "voiceTrack": "https://ueuxjtyottluwkvdreqe.supabase.co/storage/v1/object/public/meditation-voices/calmasos_aria_029_reset-de-3-minutos.mp3",
      "defaultSoundscape": "meditation_bowls"
    },
    "creatorName": "Aria",
    "creatorCredentials": "Guía Especialista en Mindfulness",
    "scientificBenefits": "Basado en protocolos clínicos de regulación emocional y bio-feedback.",
    "breathingPattern": {
      "inhale": 4,
      "hold": 0,
      "exhale": 4,
      "holdPost": 0
    },
    "voiceStyle": "calm",
    "visualSync": false,
    "isPremium": false,
    "color": "#FF6B6B",
    "practiceInstruction": "Cierra los ojos y déjate guiar por la voz.",
    "thumbnailUrl": "https://ueuxjtyottluwkvdreqe.supabase.co/storage/v1/object/public/meditation-thumbnails/calmasos_aria_029_reset-de-3-minutos.webp"
  },
  {
    "id": "11_despertar_mente",
    "title": "Despertar de la Mente (Focus)",
    "description": "Enfocar la atención de forma aguda tras despertar, preparando la mente para la resolución de problemas.",
    "durationMinutes": 4,
    "category": "despertar",
    "moodTags": [
      "despertar"
    ],
    "timeOfDay": "cualquiera",
    "difficultyLevel": "principiante",
    "sessionType": "guided_pure",
    "isCustomizable": false,
    "audioLayers": {
      "voiceTrack": "https://ueuxjtyottluwkvdreqe.supabase.co/storage/v1/object/public/meditation-voices/despertar_gaia_030_despertar-de-la-mente-focus-.mp3",
      "defaultSoundscape": "meditation_bowls"
    },
    "creatorName": "Gaia",
    "creatorCredentials": "Guía de Energía y Conexión",
    "scientificBenefits": "Basado en protocolos clínicos de regulación emocional y bio-feedback.",
    "breathingPattern": {
      "inhale": 4,
      "hold": 0,
      "exhale": 4,
      "holdPost": 0
    },
    "voiceStyle": "calm",
    "visualSync": false,
    "isPremium": false,
    "color": "#FFD93D",
    "practiceInstruction": "Cierra los ojos y déjate guiar por la voz."
  },
  {
    "id": "12_cardio_energia",
    "title": "Cardio-Energía (Respiración Activa)",
    "description": "Aumentar el pulso y la oxigenación de forma voluntaria para eliminar el letargo matutino.",
    "durationMinutes": 5,
    "category": "despertar",
    "moodTags": [
      "despertar"
    ],
    "timeOfDay": "cualquiera",
    "difficultyLevel": "principiante",
    "sessionType": "guided_pure",
    "isCustomizable": false,
    "audioLayers": {
      "voiceTrack": "https://ueuxjtyottluwkvdreqe.supabase.co/storage/v1/object/public/meditation-voices/despertar_gaia_031_cardio-energia-respiracion-activa-.mp3",
      "defaultSoundscape": "meditation_bowls"
    },
    "creatorName": "Gaia",
    "creatorCredentials": "Guía de Energía y Conexión",
    "scientificBenefits": "Basado en protocolos clínicos de regulación emocional y bio-feedback.",
    "breathingPattern": {
      "inhale": 4,
      "hold": 0,
      "exhale": 4,
      "holdPost": 0
    },
    "voiceStyle": "calm",
    "visualSync": false,
    "isPremium": false,
    "color": "#FFD93D",
    "practiceInstruction": "Cierra los ojos y déjate guiar por la voz."
  },
  {
    "id": "13_afirmaciones_poder",
    "title": "Afirmaciones de Poder",
    "description": "Fortalecer la auto-confianza y la auto-eficacia mediante la repetición de mantras de poder.",
    "durationMinutes": 5,
    "category": "despertar",
    "moodTags": [
      "despertar"
    ],
    "timeOfDay": "cualquiera",
    "difficultyLevel": "principiante",
    "sessionType": "guided_pure",
    "isCustomizable": false,
    "audioLayers": {
      "voiceTrack": "https://ueuxjtyottluwkvdreqe.supabase.co/storage/v1/object/public/meditation-voices/despertar_gaia_032_afirmaciones-de-poder.mp3",
      "defaultSoundscape": "meditation_bowls"
    },
    "creatorName": "Gaia",
    "creatorCredentials": "Guía de Energía y Conexión",
    "scientificBenefits": "Basado en protocolos clínicos de regulación emocional y bio-feedback.",
    "breathingPattern": {
      "inhale": 4,
      "hold": 0,
      "exhale": 4,
      "holdPost": 0
    },
    "voiceStyle": "calm",
    "visualSync": false,
    "isPremium": false,
    "color": "#FFD93D",
    "practiceInstruction": "Cierra los ojos y déjate guiar por la voz."
  },
  {
    "id": "14_cafe_mental",
    "title": "Café Mental (Respiración de Fuego)",
    "description": "Activación cortical instantánea mediante Kapalbhati suave, ideal para mediodía o mañanas lentas.",
    "durationMinutes": 5,
    "category": "despertar",
    "moodTags": [
      "despertar"
    ],
    "timeOfDay": "cualquiera",
    "difficultyLevel": "principiante",
    "sessionType": "guided_pure",
    "isCustomizable": false,
    "audioLayers": {
      "voiceTrack": "https://ueuxjtyottluwkvdreqe.supabase.co/storage/v1/object/public/meditation-voices/despertar_gaia_033_cafe-mental-respiracion-de-fuego-.mp3",
      "defaultSoundscape": "meditation_bowls"
    },
    "creatorName": "Gaia",
    "creatorCredentials": "Guía de Energía y Conexión",
    "scientificBenefits": "Basado en protocolos clínicos de regulación emocional y bio-feedback.",
    "breathingPattern": {
      "inhale": 4,
      "hold": 0,
      "exhale": 4,
      "holdPost": 0
    },
    "voiceStyle": "calm",
    "visualSync": false,
    "isPremium": false,
    "color": "#FFD93D",
    "practiceInstruction": "Cierra los ojos y déjate guiar por la voz."
  },
  {
    "id": "15_amanecer_cuerpo",
    "title": "Amanecer en el Cuerpo (Movilidad y Consciencia)",
    "description": "Despertar el cuerpo físico después del sueño, integrando respiración con consciencia cinemática.",
    "durationMinutes": 5,
    "category": "despertar",
    "moodTags": [
      "despertar"
    ],
    "timeOfDay": "cualquiera",
    "difficultyLevel": "principiante",
    "sessionType": "guided_pure",
    "isCustomizable": false,
    "audioLayers": {
      "voiceTrack": "https://ueuxjtyottluwkvdreqe.supabase.co/storage/v1/object/public/meditation-voices/despertar_gaia_034_amanecer-en-el-cuerpo-movilidad-y-consciencia-.mp3",
      "defaultSoundscape": "meditation_bowls"
    },
    "creatorName": "Gaia",
    "creatorCredentials": "Guía de Energía y Conexión",
    "scientificBenefits": "Basado en protocolos clínicos de regulación emocional y bio-feedback.",
    "breathingPattern": {
      "inhale": 4,
      "hold": 0,
      "exhale": 4,
      "holdPost": 0
    },
    "voiceStyle": "calm",
    "visualSync": false,
    "isPremium": false,
    "color": "#FFD93D",
    "practiceInstruction": "Cierra los ojos y déjate guiar por la voz."
  },
  {
    "id": "16_afirmaciones_proposito",
    "title": "Afirmaciones de Propósito",
    "description": "Programar la mente subconsciente al inicio del día con valores y objetivos claros para evitar la deriva mental.",
    "durationMinutes": 5,
    "category": "despertar",
    "moodTags": [
      "despertar"
    ],
    "timeOfDay": "cualquiera",
    "difficultyLevel": "principiante",
    "sessionType": "guided_pure",
    "isCustomizable": false,
    "audioLayers": {
      "voiceTrack": "https://ueuxjtyottluwkvdreqe.supabase.co/storage/v1/object/public/meditation-voices/despertar_gaia_035_afirmaciones-de-proposito.mp3",
      "defaultSoundscape": "meditation_bowls"
    },
    "creatorName": "Gaia",
    "creatorCredentials": "Guía de Energía y Conexión",
    "scientificBenefits": "Basado en protocolos clínicos de regulación emocional y bio-feedback.",
    "breathingPattern": {
      "inhale": 4,
      "hold": 0,
      "exhale": 4,
      "holdPost": 0
    },
    "voiceStyle": "calm",
    "visualSync": false,
    "isPremium": false,
    "color": "#FFD93D",
    "practiceInstruction": "Cierra los ojos y déjate guiar por la voz."
  },
  {
    "id": "17_activacion_dopamina",
    "title": "Activación de Dopamina Natural",
    "description": "Estimular el sistema de recompensa y motivación mediante la visualización de logros y respiración rítmica rápida.",
    "durationMinutes": 5,
    "category": "despertar",
    "moodTags": [
      "despertar"
    ],
    "timeOfDay": "cualquiera",
    "difficultyLevel": "principiante",
    "sessionType": "guided_pure",
    "isCustomizable": false,
    "audioLayers": {
      "voiceTrack": "https://ueuxjtyottluwkvdreqe.supabase.co/storage/v1/object/public/meditation-voices/despertar_gaia_036_activacion-de-dopamina-natural.mp3",
      "defaultSoundscape": "meditation_bowls"
    },
    "creatorName": "Gaia",
    "creatorCredentials": "Guía de Energía y Conexión",
    "scientificBenefits": "Basado en protocolos clínicos de regulación emocional y bio-feedback.",
    "breathingPattern": {
      "inhale": 4,
      "hold": 0,
      "exhale": 4,
      "holdPost": 0
    },
    "voiceStyle": "calm",
    "visualSync": false,
    "isPremium": false,
    "color": "#FFD93D",
    "practiceInstruction": "Cierra los ojos y déjate guiar por la voz."
  },
  {
    "id": "18_superar_niebla",
    "title": "Superar la Niebla Mental",
    "description": "Eliminar la sensación de confusión o letargo mental mediante la oxigenación forzada y el foco en un punto único.",
    "durationMinutes": 5,
    "category": "despertar",
    "moodTags": [
      "despertar"
    ],
    "timeOfDay": "cualquiera",
    "difficultyLevel": "principiante",
    "sessionType": "guided_pure",
    "isCustomizable": false,
    "audioLayers": {
      "voiceTrack": "https://ueuxjtyottluwkvdreqe.supabase.co/storage/v1/object/public/meditation-voices/despertar_gaia_037_superar-la-niebla-mental.mp3",
      "defaultSoundscape": "meditation_bowls"
    },
    "creatorName": "Gaia",
    "creatorCredentials": "Guía de Energía y Conexión",
    "scientificBenefits": "Basado en protocolos clínicos de regulación emocional y bio-feedback.",
    "breathingPattern": {
      "inhale": 4,
      "hold": 0,
      "exhale": 4,
      "holdPost": 0
    },
    "voiceStyle": "calm",
    "visualSync": false,
    "isPremium": false,
    "color": "#FFD93D",
    "practiceInstruction": "Cierra los ojos y déjate guiar por la voz."
  },
  {
    "id": "19_visualizacion_exito",
    "title": "Visualización de Éxito Diario",
    "description": "Entrenar la mente para el éxito mediante el ensayo mental de los desafíos del día, reduciendo la fricción a la hora de actuar.",
    "durationMinutes": 5,
    "category": "despertar",
    "moodTags": [
      "despertar"
    ],
    "timeOfDay": "cualquiera",
    "difficultyLevel": "principiante",
    "sessionType": "guided_pure",
    "isCustomizable": false,
    "audioLayers": {
      "voiceTrack": "https://ueuxjtyottluwkvdreqe.supabase.co/storage/v1/object/public/meditation-voices/despertar_gaia_038_visualizacion-de-exito-diario.mp3",
      "defaultSoundscape": "meditation_bowls"
    },
    "creatorName": "Gaia",
    "creatorCredentials": "Guía de Energía y Conexión",
    "scientificBenefits": "Basado en protocolos clínicos de regulación emocional y bio-feedback.",
    "breathingPattern": {
      "inhale": 4,
      "hold": 0,
      "exhale": 4,
      "holdPost": 0
    },
    "voiceStyle": "calm",
    "visualSync": false,
    "isPremium": false,
    "color": "#FFD93D",
    "practiceInstruction": "Cierra los ojos y déjate guiar por la voz."
  },
  {
    "id": "20_respiracion_alterna",
    "title": "Respiración Alterna (Nadi Shodhana)",
    "description": "Equilibrar los hemisferios cerebrales y el sistema nervioso autónomo, preparando la mente para un foco sostenido.",
    "durationMinutes": 5,
    "category": "despertar",
    "moodTags": [
      "despertar"
    ],
    "timeOfDay": "cualquiera",
    "difficultyLevel": "principiante",
    "sessionType": "guided_pure",
    "isCustomizable": false,
    "audioLayers": {
      "voiceTrack": "https://ueuxjtyottluwkvdreqe.supabase.co/storage/v1/object/public/meditation-voices/despertar_gaia_039_respiracion-alterna-nadi-shodhana-.mp3",
      "defaultSoundscape": "meditation_bowls"
    },
    "creatorName": "Gaia",
    "creatorCredentials": "Guía de Energía y Conexión",
    "scientificBenefits": "Basado en protocolos clínicos de regulación emocional y bio-feedback.",
    "breathingPattern": {
      "inhale": 4,
      "hold": 0,
      "exhale": 4,
      "holdPost": 0
    },
    "voiceStyle": "calm",
    "visualSync": false,
    "isPremium": false,
    "color": "#FFD93D",
    "practiceInstruction": "Cierra los ojos y déjate guiar por la voz."
  },
  {
    "id": "100_mi_nuevo_yo",
    "title": "Mi Nuevo Yo (Identidad y Hábito)",
    "description": "Consolidar cambios de identidad para el mantenimiento de hábitos a largo plazo.",
    "durationMinutes": 1,
    "category": "habitos",
    "moodTags": [
      "habitos"
    ],
    "timeOfDay": "cualquiera",
    "difficultyLevel": "principiante",
    "sessionType": "guided_pure",
    "isCustomizable": false,
    "audioLayers": {
      "voiceTrack": "https://ueuxjtyottluwkvdreqe.supabase.co/storage/v1/object/public/meditation-voices/habitos_aria_040_mi-nuevo-yo-identidad-y-habito-.mp3",
      "defaultSoundscape": "meditation_bowls"
    },
    "creatorName": "Aria",
    "creatorCredentials": "Guía Especialista en Mindfulness",
    "scientificBenefits": "Basado en protocolos clínicos de regulación emocional y bio-feedback.",
    "breathingPattern": {
      "inhale": 4,
      "hold": 0,
      "exhale": 4,
      "holdPost": 0
    },
    "voiceStyle": "calm",
    "visualSync": false,
    "isPremium": false,
    "color": "#34495E",
    "practiceInstruction": "Cierra los ojos y déjate guiar por la voz."
  },
  {
    "id": "91_comer_consciente",
    "title": "Comer Consciente (Mindful Eating)",
    "description": "Romper el hábito de comer de forma automática y ansiosa, mejorando la digestión y la relación con la comida.",
    "durationMinutes": 1,
    "category": "habitos",
    "moodTags": [
      "habitos"
    ],
    "timeOfDay": "cualquiera",
    "difficultyLevel": "principiante",
    "sessionType": "guided_pure",
    "isCustomizable": false,
    "audioLayers": {
      "voiceTrack": "https://ueuxjtyottluwkvdreqe.supabase.co/storage/v1/object/public/meditation-voices/habitos_aria_041_comer-consciente-mindful-eating-.mp3",
      "defaultSoundscape": "meditation_bowls"
    },
    "creatorName": "Aria",
    "creatorCredentials": "Guía Especialista en Mindfulness",
    "scientificBenefits": "Basado en protocolos clínicos de regulación emocional y bio-feedback.",
    "breathingPattern": {
      "inhale": 4,
      "hold": 0,
      "exhale": 4,
      "holdPost": 0
    },
    "voiceStyle": "calm",
    "visualSync": false,
    "isPremium": false,
    "color": "#34495E",
    "practiceInstruction": "Cierra los ojos y déjate guiar por la voz."
  },
  {
    "id": "92_caminar_sin_prisa",
    "title": "Caminar sin Prisa (Mindful Walking)",
    "description": "Romper la inercia de la prisa urbana.",
    "durationMinutes": 1,
    "category": "habitos",
    "moodTags": [
      "habitos"
    ],
    "timeOfDay": "cualquiera",
    "difficultyLevel": "principiante",
    "sessionType": "guided_pure",
    "isCustomizable": false,
    "audioLayers": {
      "voiceTrack": "https://ueuxjtyottluwkvdreqe.supabase.co/storage/v1/object/public/meditation-voices/habitos_aria_042_caminar-sin-prisa-mindful-walking-.mp3",
      "defaultSoundscape": "meditation_bowls"
    },
    "creatorName": "Aria",
    "creatorCredentials": "Guía Especialista en Mindfulness",
    "scientificBenefits": "Basado en protocolos clínicos de regulación emocional y bio-feedback.",
    "breathingPattern": {
      "inhale": 4,
      "hold": 0,
      "exhale": 4,
      "holdPost": 0
    },
    "voiceStyle": "calm",
    "visualSync": false,
    "isPremium": false,
    "color": "#34495E",
    "practiceInstruction": "Cierra los ojos y déjate guiar por la voz."
  },
  {
    "id": "93_detox_digital",
    "title": "Detox Digital (Soltar la Pantalla)",
    "description": "Recuperar la autonomía atencional tras periodos largos de uso de dispositivos, reduciendo la sobreestimulación dopaminérgica.",
    "durationMinutes": 1,
    "category": "habitos",
    "moodTags": [
      "habitos"
    ],
    "timeOfDay": "cualquiera",
    "difficultyLevel": "principiante",
    "sessionType": "guided_pure",
    "isCustomizable": false,
    "audioLayers": {
      "voiceTrack": "https://ueuxjtyottluwkvdreqe.supabase.co/storage/v1/object/public/meditation-voices/habitos_aria_043_detox-digital-soltar-la-pantalla-.mp3",
      "defaultSoundscape": "meditation_bowls"
    },
    "creatorName": "Aria",
    "creatorCredentials": "Guía Especialista en Mindfulness",
    "scientificBenefits": "Basado en protocolos clínicos de regulación emocional y bio-feedback.",
    "breathingPattern": {
      "inhale": 4,
      "hold": 0,
      "exhale": 4,
      "holdPost": 0
    },
    "voiceStyle": "calm",
    "visualSync": false,
    "isPremium": false,
    "color": "#34495E",
    "practiceInstruction": "Cierra los ojos y déjate guiar por la voz."
  },
  {
    "id": "94_gratitud_dormir",
    "title": "Gratitud Antes de Dormir",
    "description": "Cerrar el día con positividad.",
    "durationMinutes": 1,
    "category": "habitos",
    "moodTags": [
      "habitos"
    ],
    "timeOfDay": "cualquiera",
    "difficultyLevel": "principiante",
    "sessionType": "guided_pure",
    "isCustomizable": false,
    "audioLayers": {
      "voiceTrack": "https://ueuxjtyottluwkvdreqe.supabase.co/storage/v1/object/public/meditation-voices/habitos_aria_044_gratitud-antes-de-dormir.mp3",
      "defaultSoundscape": "meditation_bowls"
    },
    "creatorName": "Aria",
    "creatorCredentials": "Guía Especialista en Mindfulness",
    "scientificBenefits": "Basado en protocolos clínicos de regulación emocional y bio-feedback.",
    "breathingPattern": {
      "inhale": 4,
      "hold": 0,
      "exhale": 4,
      "holdPost": 0
    },
    "voiceStyle": "calm",
    "visualSync": false,
    "isPremium": false,
    "color": "#34495E",
    "practiceInstruction": "Cierra los ojos y déjate guiar por la voz."
  },
  {
    "id": "95_paciencia_espera",
    "title": "Paciencia ante la Espera (Cola o Tráfico)",
    "description": "Transformar los tiempos muertos en oportunidades de práctica.",
    "durationMinutes": 1,
    "category": "habitos",
    "moodTags": [
      "habitos"
    ],
    "timeOfDay": "cualquiera",
    "difficultyLevel": "principiante",
    "sessionType": "guided_pure",
    "isCustomizable": false,
    "audioLayers": {
      "voiceTrack": "https://ueuxjtyottluwkvdreqe.supabase.co/storage/v1/object/public/meditation-voices/habitos_aria_045_paciencia-ante-la-espera-cola-o-trafico-.mp3",
      "defaultSoundscape": "meditation_bowls"
    },
    "creatorName": "Aria",
    "creatorCredentials": "Guía Especialista en Mindfulness",
    "scientificBenefits": "Basado en protocolos clínicos de regulación emocional y bio-feedback.",
    "breathingPattern": {
      "inhale": 4,
      "hold": 0,
      "exhale": 4,
      "holdPost": 0
    },
    "voiceStyle": "calm",
    "visualSync": false,
    "isPremium": false,
    "color": "#34495E",
    "practiceInstruction": "Cierra los ojos y déjate guiar por la voz."
  },
  {
    "id": "96_escucha_relaciones",
    "title": "Escucha Profunda (Relaciones)",
    "description": "Mejorar la calidad de las relaciones personales.",
    "durationMinutes": 1,
    "category": "habitos",
    "moodTags": [
      "habitos"
    ],
    "timeOfDay": "cualquiera",
    "difficultyLevel": "principiante",
    "sessionType": "guided_pure",
    "isCustomizable": false,
    "audioLayers": {
      "voiceTrack": "https://ueuxjtyottluwkvdreqe.supabase.co/storage/v1/object/public/meditation-voices/habitos_aria_046_escucha-profunda-relaciones-.mp3",
      "defaultSoundscape": "meditation_bowls"
    },
    "creatorName": "Aria",
    "creatorCredentials": "Guía Especialista en Mindfulness",
    "scientificBenefits": "Basado en protocolos clínicos de regulación emocional y bio-feedback.",
    "breathingPattern": {
      "inhale": 4,
      "hold": 0,
      "exhale": 4,
      "holdPost": 0
    },
    "voiceStyle": "calm",
    "visualSync": false,
    "isPremium": false,
    "color": "#34495E",
    "practiceInstruction": "Cierra los ojos y déjate guiar por la voz."
  },
  {
    "id": "97_respiracion_trabajo",
    "title": "Respiración Consciente en el Trabajo",
    "description": "Mantener el equilibrio durante la jornada laboral.",
    "durationMinutes": 1,
    "category": "habitos",
    "moodTags": [
      "habitos"
    ],
    "timeOfDay": "cualquiera",
    "difficultyLevel": "principiante",
    "sessionType": "guided_pure",
    "isCustomizable": false,
    "audioLayers": {
      "voiceTrack": "https://ueuxjtyottluwkvdreqe.supabase.co/storage/v1/object/public/meditation-voices/habitos_aria_047_respiracion-consciente-en-el-trabajo.mp3",
      "defaultSoundscape": "meditation_bowls"
    },
    "creatorName": "Aria",
    "creatorCredentials": "Guía Especialista en Mindfulness",
    "scientificBenefits": "Basado en protocolos clínicos de regulación emocional y bio-feedback.",
    "breathingPattern": {
      "inhale": 4,
      "hold": 0,
      "exhale": 4,
      "holdPost": 0
    },
    "voiceStyle": "calm",
    "visualSync": false,
    "isPremium": false,
    "color": "#34495E",
    "practiceInstruction": "Cierra los ojos y déjate guiar por la voz."
  },
  {
    "id": "98_minimalismo_mental",
    "title": "Vivir con Minimalismo Mental",
    "description": "Simplificar el paisaje interno eliminando el ruido de las preocupaciones innecesarias y el exceso de información.",
    "durationMinutes": 1,
    "category": "habitos",
    "moodTags": [
      "habitos"
    ],
    "timeOfDay": "cualquiera",
    "difficultyLevel": "principiante",
    "sessionType": "guided_pure",
    "isCustomizable": false,
    "audioLayers": {
      "voiceTrack": "https://ueuxjtyottluwkvdreqe.supabase.co/storage/v1/object/public/meditation-voices/habitos_aria_048_vivir-con-minimalismo-mental.mp3",
      "defaultSoundscape": "meditation_bowls"
    },
    "creatorName": "Aria",
    "creatorCredentials": "Guía Especialista en Mindfulness",
    "scientificBenefits": "Basado en protocolos clínicos de regulación emocional y bio-feedback.",
    "breathingPattern": {
      "inhale": 4,
      "hold": 0,
      "exhale": 4,
      "holdPost": 0
    },
    "voiceStyle": "calm",
    "visualSync": false,
    "isPremium": false,
    "color": "#34495E",
    "practiceInstruction": "Cierra los ojos y déjate guiar por la voz."
  },
  {
    "id": "99_valorar_pequeno",
    "title": "Valorar lo Pequeño (Mindfulness Diario)",
    "description": "Encontrar la felicidad en lo cotidiano.",
    "durationMinutes": 1,
    "category": "habitos",
    "moodTags": [
      "habitos"
    ],
    "timeOfDay": "cualquiera",
    "difficultyLevel": "principiante",
    "sessionType": "guided_pure",
    "isCustomizable": false,
    "audioLayers": {
      "voiceTrack": "https://ueuxjtyottluwkvdreqe.supabase.co/storage/v1/object/public/meditation-voices/habitos_aria_049_valorar-lo-pequeno-mindfulness-diario-.mp3",
      "defaultSoundscape": "meditation_bowls"
    },
    "creatorName": "Aria",
    "creatorCredentials": "Guía Especialista en Mindfulness",
    "scientificBenefits": "Basado en protocolos clínicos de regulación emocional y bio-feedback.",
    "breathingPattern": {
      "inhale": 4,
      "hold": 0,
      "exhale": 4,
      "holdPost": 0
    },
    "voiceStyle": "calm",
    "visualSync": false,
    "isPremium": false,
    "color": "#34495E",
    "practiceInstruction": "Cierra los ojos y déjate guiar por la voz."
  },
  {
    "id": "71_reconocer_emocion",
    "title": "Reconocer la Emoción",
    "description": "Identificar y nombrar las emociones en el momento en que surgen, reduciendo su carga impulsiva mediante el etiquetado afectivo.",
    "durationMinutes": 5,
    "category": "emocional",
    "moodTags": [
      "emocional"
    ],
    "timeOfDay": "cualquiera",
    "difficultyLevel": "principiante",
    "sessionType": "guided_pure",
    "isCustomizable": false,
    "audioLayers": {
      "voiceTrack": "https://ueuxjtyottluwkvdreqe.supabase.co/storage/v1/object/public/meditation-voices/emocional_aria_050_reconocer-la-emocion.mp3",
      "defaultSoundscape": "meditation_bowls"
    },
    "creatorName": "Aria",
    "creatorCredentials": "Guía Especialista en Mindfulness",
    "scientificBenefits": "Basado en protocolos clínicos de regulación emocional y bio-feedback.",
    "breathingPattern": {
      "inhale": 4,
      "hold": 0,
      "exhale": 4,
      "holdPost": 0
    },
    "voiceStyle": "calm",
    "visualSync": false,
    "isPremium": false,
    "color": "#F1C40F",
    "practiceInstruction": "Cierra los ojos y déjate guiar por la voz."
  },
  {
    "id": "72_espacio_respuesta",
    "title": "El Espacio entre Estímulo y Respuesta",
    "description": "Ampliar el margen de maniobra consciente ante situaciones provocadoras, evitando reacciones automáticas de las que podamos arrepentirnos.",
    "durationMinutes": 5,
    "category": "emocional",
    "moodTags": [
      "emocional"
    ],
    "timeOfDay": "cualquiera",
    "difficultyLevel": "principiante",
    "sessionType": "guided_pure",
    "isCustomizable": false,
    "audioLayers": {
      "voiceTrack": "https://ueuxjtyottluwkvdreqe.supabase.co/storage/v1/object/public/meditation-voices/emocional_aria_051_el-espacio-entre-estimulo-y-respuesta.mp3",
      "defaultSoundscape": "meditation_bowls"
    },
    "creatorName": "Aria",
    "creatorCredentials": "Guía Especialista en Mindfulness",
    "scientificBenefits": "Basado en protocolos clínicos de regulación emocional y bio-feedback.",
    "breathingPattern": {
      "inhale": 4,
      "hold": 0,
      "exhale": 4,
      "holdPost": 0
    },
    "voiceStyle": "calm",
    "visualSync": false,
    "isPremium": false,
    "color": "#F1C40F",
    "practiceInstruction": "Cierra los ojos y déjate guiar por la voz."
  },
  {
    "id": "73_autogestion_ansiedad",
    "title": "Autogestión de la Ansiedad",
    "description": "Proporcionar una herramienta métrica y somática para reducir la ansiedad cuando se detecta a tiempo.",
    "durationMinutes": 5,
    "category": "emocional",
    "moodTags": [
      "emocional"
    ],
    "timeOfDay": "cualquiera",
    "difficultyLevel": "principiante",
    "sessionType": "guided_pure",
    "isCustomizable": false,
    "audioLayers": {
      "voiceTrack": "https://ueuxjtyottluwkvdreqe.supabase.co/storage/v1/object/public/meditation-voices/emocional_aria_052_autogestion-de-la-ansiedad.mp3",
      "defaultSoundscape": "meditation_bowls"
    },
    "creatorName": "Aria",
    "creatorCredentials": "Guía Especialista en Mindfulness",
    "scientificBenefits": "Basado en protocolos clínicos de regulación emocional y bio-feedback.",
    "breathingPattern": {
      "inhale": 4,
      "hold": 0,
      "exhale": 4,
      "holdPost": 0
    },
    "voiceStyle": "calm",
    "visualSync": false,
    "isPremium": false,
    "color": "#F1C40F",
    "practiceInstruction": "Cierra los ojos y déjate guiar por la voz."
  },
  {
    "id": "74_bondad_amorosa",
    "title": "Bondad Amorosa (Metta)",
    "description": "Cultivar sentimientos de benevolencia y conexión hacia uno mismo y hacia los demás, reduciendo el aislamiento y la hostilidad.",
    "durationMinutes": 5,
    "category": "emocional",
    "moodTags": [
      "emocional"
    ],
    "timeOfDay": "cualquiera",
    "difficultyLevel": "principiante",
    "sessionType": "guided_pure",
    "isCustomizable": false,
    "audioLayers": {
      "voiceTrack": "https://ueuxjtyottluwkvdreqe.supabase.co/storage/v1/object/public/meditation-voices/emocional_aria_053_bondad-amorosa-metta-.mp3",
      "defaultSoundscape": "meditation_bowls"
    },
    "creatorName": "Aria",
    "creatorCredentials": "Guía Especialista en Mindfulness",
    "scientificBenefits": "Basado en protocolos clínicos de regulación emocional y bio-feedback.",
    "breathingPattern": {
      "inhale": 4,
      "hold": 0,
      "exhale": 4,
      "holdPost": 0
    },
    "voiceStyle": "calm",
    "visualSync": false,
    "isPremium": false,
    "color": "#F1C40F",
    "practiceInstruction": "Cierra los ojos y déjate guiar por la voz."
  },
  {
    "id": "75_compasion_demas",
    "title": "Compassión por los Demás",
    "description": "Entender el sufrimiento ajeno para mejorar las relaciones y reducir los conflictos interpersonales.",
    "durationMinutes": 5,
    "category": "emocional",
    "moodTags": [
      "emocional"
    ],
    "timeOfDay": "cualquiera",
    "difficultyLevel": "principiante",
    "sessionType": "guided_pure",
    "isCustomizable": false,
    "audioLayers": {
      "voiceTrack": "https://ueuxjtyottluwkvdreqe.supabase.co/storage/v1/object/public/meditation-voices/emocional_aria_054_compassion-por-los-demas.mp3",
      "defaultSoundscape": "meditation_bowls"
    },
    "creatorName": "Aria",
    "creatorCredentials": "Guía Especialista en Mindfulness",
    "scientificBenefits": "Basado en protocolos clínicos de regulación emocional y bio-feedback.",
    "breathingPattern": {
      "inhale": 4,
      "hold": 0,
      "exhale": 4,
      "holdPost": 0
    },
    "voiceStyle": "calm",
    "visualSync": false,
    "isPremium": false,
    "color": "#F1C40F",
    "practiceInstruction": "Cierra los ojos y déjate guiar por la voz."
  },
  {
    "id": "76_observar_ira",
    "title": "Observar la Ira (El Volcán)",
    "description": "Desactivar la carga destructiva de la ira mediante la observación somática y la visualización de enfriamiento, evitando la supresión.",
    "durationMinutes": 5,
    "category": "emocional",
    "moodTags": [
      "emocional"
    ],
    "timeOfDay": "cualquiera",
    "difficultyLevel": "principiante",
    "sessionType": "guided_pure",
    "isCustomizable": false,
    "audioLayers": {
      "voiceTrack": "https://ueuxjtyottluwkvdreqe.supabase.co/storage/v1/object/public/meditation-voices/emocional_aria_055_observar-la-ira-el-volcan-.mp3",
      "defaultSoundscape": "meditation_bowls"
    },
    "creatorName": "Aria",
    "creatorCredentials": "Guía Especialista en Mindfulness",
    "scientificBenefits": "Basado en protocolos clínicos de regulación emocional y bio-feedback.",
    "breathingPattern": {
      "inhale": 4,
      "hold": 0,
      "exhale": 4,
      "holdPost": 0
    },
    "voiceStyle": "calm",
    "visualSync": false,
    "isPremium": false,
    "color": "#F1C40F",
    "practiceInstruction": "Cierra los ojos y déjate guiar por la voz."
  },
  {
    "id": "77_gestionar_tristeza",
    "title": "Gestionar la Tristeza",
    "description": "Validar y dar espacio a la tristeza como un proceso natural de pérdida y renovación, evitando la depresión reactiva.",
    "durationMinutes": 5,
    "category": "emocional",
    "moodTags": [
      "emocional"
    ],
    "timeOfDay": "cualquiera",
    "difficultyLevel": "principiante",
    "sessionType": "guided_pure",
    "isCustomizable": false,
    "audioLayers": {
      "voiceTrack": "https://ueuxjtyottluwkvdreqe.supabase.co/storage/v1/object/public/meditation-voices/emocional_aria_056_gestionar-la-tristeza.mp3",
      "defaultSoundscape": "meditation_bowls"
    },
    "creatorName": "Aria",
    "creatorCredentials": "Guía Especialista en Mindfulness",
    "scientificBenefits": "Basado en protocolos clínicos de regulación emocional y bio-feedback.",
    "breathingPattern": {
      "inhale": 4,
      "hold": 0,
      "exhale": 4,
      "holdPost": 0
    },
    "voiceStyle": "calm",
    "visualSync": false,
    "isPremium": false,
    "color": "#F1C40F",
    "practiceInstruction": "Cierra los ojos y déjate guiar por la voz."
  },
  {
    "id": "78_escucha_empatica",
    "title": "Escucha Empática (Preparación)",
    "description": "Preparar el estado mental para una conversación importante, limpiando los prejuicios y abriendo el canal de recepción.",
    "durationMinutes": 4,
    "category": "emocional",
    "moodTags": [
      "emocional"
    ],
    "timeOfDay": "cualquiera",
    "difficultyLevel": "principiante",
    "sessionType": "guided_pure",
    "isCustomizable": false,
    "audioLayers": {
      "voiceTrack": "https://ueuxjtyottluwkvdreqe.supabase.co/storage/v1/object/public/meditation-voices/emocional_aria_057_escucha-empatica-preparacion-.mp3",
      "defaultSoundscape": "meditation_bowls"
    },
    "creatorName": "Aria",
    "creatorCredentials": "Guía Especialista en Mindfulness",
    "scientificBenefits": "Basado en protocolos clínicos de regulación emocional y bio-feedback.",
    "breathingPattern": {
      "inhale": 4,
      "hold": 0,
      "exhale": 4,
      "holdPost": 0
    },
    "voiceStyle": "calm",
    "visualSync": false,
    "isPremium": false,
    "color": "#F1C40F",
    "practiceInstruction": "Cierra los ojos y déjate guiar por la voz."
  },
  {
    "id": "79_autoresponsabilidad",
    "title": "Auto-responsabilidad",
    "description": "Dejar de culpar a las circunstancias externas y recuperar el poder personal sobre las propias elecciones y estados de ánimo.",
    "durationMinutes": 5,
    "category": "emocional",
    "moodTags": [
      "emocional"
    ],
    "timeOfDay": "cualquiera",
    "difficultyLevel": "principiante",
    "sessionType": "guided_pure",
    "isCustomizable": false,
    "audioLayers": {
      "voiceTrack": "https://ueuxjtyottluwkvdreqe.supabase.co/storage/v1/object/public/meditation-voices/emocional_aria_058_auto-responsabilidad.mp3",
      "defaultSoundscape": "meditation_bowls"
    },
    "creatorName": "Aria",
    "creatorCredentials": "Guía Especialista en Mindfulness",
    "scientificBenefits": "Basado en protocolos clínicos de regulación emocional y bio-feedback.",
    "breathingPattern": {
      "inhale": 4,
      "hold": 0,
      "exhale": 4,
      "holdPost": 0
    },
    "voiceStyle": "calm",
    "visualSync": false,
    "isPremium": false,
    "color": "#F1C40F",
    "practiceInstruction": "Cierra los ojos y déjate guiar por la voz."
  },
  {
    "id": "80_celebrar_logro",
    "title": "Celebrar el Logro Ajeno (Mudita)",
    "description": "Combatir la envidia y la comparación mediante la alegría compartida por el éxito de los demás.",
    "durationMinutes": 4,
    "category": "emocional",
    "moodTags": [
      "emocional"
    ],
    "timeOfDay": "cualquiera",
    "difficultyLevel": "principiante",
    "sessionType": "guided_pure",
    "isCustomizable": false,
    "audioLayers": {
      "voiceTrack": "https://ueuxjtyottluwkvdreqe.supabase.co/storage/v1/object/public/meditation-voices/emocional_aria_059_celebrar-el-logro-ajeno-mudita-.mp3",
      "defaultSoundscape": "meditation_bowls"
    },
    "creatorName": "Aria",
    "creatorCredentials": "Guía Especialista en Mindfulness",
    "scientificBenefits": "Basado en protocolos clínicos de regulación emocional y bio-feedback.",
    "breathingPattern": {
      "inhale": 4,
      "hold": 0,
      "exhale": 4,
      "holdPost": 0
    },
    "voiceStyle": "calm",
    "visualSync": false,
    "isPremium": false,
    "color": "#F1C40F",
    "practiceInstruction": "Cierra los ojos y déjate guiar por la voz."
  },
  {
    "id": "81_aventura_aire",
    "title": "La Aventura del Aire (Respiración Mágica)",
    "description": "Introducir a los niños en el mindfulness mediante el juego y la imaginación, enseñándoles a calmarse solos.",
    "durationMinutes": 1,
    "category": "kids",
    "moodTags": [
      "kids"
    ],
    "timeOfDay": "cualquiera",
    "difficultyLevel": "principiante",
    "sessionType": "guided_pure",
    "isCustomizable": false,
    "audioLayers": {
      "voiceTrack": "https://ueuxjtyottluwkvdreqe.supabase.co/storage/v1/object/public/meditation-voices/kids_gaia_060_la-aventura-del-aire-respiracion-magica-.mp3",
      "defaultSoundscape": "meditation_bowls"
    },
    "creatorName": "Gaia",
    "creatorCredentials": "Guía de Energía y Conexión",
    "scientificBenefits": "Basado en protocolos clínicos de regulación emocional y bio-feedback.",
    "breathingPattern": {
      "inhale": 4,
      "hold": 0,
      "exhale": 4,
      "holdPost": 0
    },
    "voiceStyle": "calm",
    "visualSync": false,
    "isPremium": false,
    "color": "#1ABC9C",
    "practiceInstruction": "Cierra los ojos y déjate guiar por la voz."
  },
  {
    "id": "82_bosque_relajacion",
    "title": "El Bosque de la Relajación",
    "description": "Relajación profunda para niños antes de dormir o tras un día movido.",
    "durationMinutes": 1,
    "category": "kids",
    "moodTags": [
      "kids"
    ],
    "timeOfDay": "cualquiera",
    "difficultyLevel": "principiante",
    "sessionType": "guided_pure",
    "isCustomizable": false,
    "audioLayers": {
      "voiceTrack": "https://ueuxjtyottluwkvdreqe.supabase.co/storage/v1/object/public/meditation-voices/kids_gaia_061_el-bosque-de-la-relajacion.mp3",
      "defaultSoundscape": "meditation_bowls"
    },
    "creatorName": "Gaia",
    "creatorCredentials": "Guía de Energía y Conexión",
    "scientificBenefits": "Basado en protocolos clínicos de regulación emocional y bio-feedback.",
    "breathingPattern": {
      "inhale": 4,
      "hold": 0,
      "exhale": 4,
      "holdPost": 0
    },
    "voiceStyle": "calm",
    "visualSync": false,
    "isPremium": false,
    "color": "#1ABC9C",
    "practiceInstruction": "Cierra los ojos y déjate guiar por la voz."
  },
  {
    "id": "83_superpoder_silencio",
    "title": "El Superpoder del Silencio",
    "description": "Enseñar a los niños a valorar los momentos de quietud y escucha interna.",
    "durationMinutes": 1,
    "category": "kids",
    "moodTags": [
      "kids"
    ],
    "timeOfDay": "cualquiera",
    "difficultyLevel": "principiante",
    "sessionType": "guided_pure",
    "isCustomizable": false,
    "audioLayers": {
      "voiceTrack": "https://ueuxjtyottluwkvdreqe.supabase.co/storage/v1/object/public/meditation-voices/kids_gaia_062_el-superpoder-del-silencio.mp3",
      "defaultSoundscape": "meditation_bowls"
    },
    "creatorName": "Gaia",
    "creatorCredentials": "Guía de Energía y Conexión",
    "scientificBenefits": "Basado en protocolos clínicos de regulación emocional y bio-feedback.",
    "breathingPattern": {
      "inhale": 4,
      "hold": 0,
      "exhale": 4,
      "holdPost": 0
    },
    "voiceStyle": "calm",
    "visualSync": false,
    "isPremium": false,
    "color": "#1ABC9C",
    "practiceInstruction": "Cierra los ojos y déjate guiar por la voz."
  },
  {
    "id": "84_enfado_monstruo",
    "title": "Adiós al \"Enfado Monstruo\"",
    "description": "Ayudar a los niños a gestionar rabietas o frustración personificando la emoción y usando la exhalación como liberación.",
    "durationMinutes": 1,
    "category": "kids",
    "moodTags": [
      "kids"
    ],
    "timeOfDay": "cualquiera",
    "difficultyLevel": "principiante",
    "sessionType": "guided_pure",
    "isCustomizable": false,
    "audioLayers": {
      "voiceTrack": "https://ueuxjtyottluwkvdreqe.supabase.co/storage/v1/object/public/meditation-voices/kids_gaia_063_adios-al-.mp3",
      "defaultSoundscape": "meditation_bowls"
    },
    "creatorName": "Gaia",
    "creatorCredentials": "Guía de Energía y Conexión",
    "scientificBenefits": "Basado en protocolos clínicos de regulación emocional y bio-feedback.",
    "breathingPattern": {
      "inhale": 4,
      "hold": 0,
      "exhale": 4,
      "holdPost": 0
    },
    "voiceStyle": "calm",
    "visualSync": false,
    "isPremium": false,
    "color": "#1ABC9C",
    "practiceInstruction": "Cierra los ojos y déjate guiar por la voz."
  },
  {
    "id": "85_habitantes_mente",
    "title": "Habitantes de la Mente (Mindfulness para Niños)",
    "description": "Enseñar el concepto de observación de pensamientos (testigo) de forma metafórica para niños.",
    "durationMinutes": 1,
    "category": "kids",
    "moodTags": [
      "kids"
    ],
    "timeOfDay": "cualquiera",
    "difficultyLevel": "principiante",
    "sessionType": "guided_pure",
    "isCustomizable": false,
    "audioLayers": {
      "voiceTrack": "https://ueuxjtyottluwkvdreqe.supabase.co/storage/v1/object/public/meditation-voices/kids_gaia_064_habitantes-de-la-mente-mindfulness-para-ninos-.mp3",
      "defaultSoundscape": "meditation_bowls"
    },
    "creatorName": "Gaia",
    "creatorCredentials": "Guía de Energía y Conexión",
    "scientificBenefits": "Basado en protocolos clínicos de regulación emocional y bio-feedback.",
    "breathingPattern": {
      "inhale": 4,
      "hold": 0,
      "exhale": 4,
      "holdPost": 0
    },
    "voiceStyle": "calm",
    "visualSync": false,
    "isPremium": false,
    "color": "#1ABC9C",
    "practiceInstruction": "Cierra los ojos y déjate guiar por la voz."
  },
  {
    "id": "86_viaje_nube",
    "title": "El Viaje en la Nube",
    "description": "Visualización para dormir para niños.",
    "durationMinutes": 1,
    "category": "kids",
    "moodTags": [
      "kids"
    ],
    "timeOfDay": "cualquiera",
    "difficultyLevel": "principiante",
    "sessionType": "guided_pure",
    "isCustomizable": false,
    "audioLayers": {
      "voiceTrack": "https://ueuxjtyottluwkvdreqe.supabase.co/storage/v1/object/public/meditation-voices/kids_gaia_065_el-viaje-en-la-nube.mp3",
      "defaultSoundscape": "meditation_bowls"
    },
    "creatorName": "Gaia",
    "creatorCredentials": "Guía de Energía y Conexión",
    "scientificBenefits": "Basado en protocolos clínicos de regulación emocional y bio-feedback.",
    "breathingPattern": {
      "inhale": 4,
      "hold": 0,
      "exhale": 4,
      "holdPost": 0
    },
    "voiceStyle": "calm",
    "visualSync": false,
    "isPremium": false,
    "color": "#1ABC9C",
    "practiceInstruction": "Cierra los ojos y déjate guiar por la voz."
  },
  {
    "id": "87_capitan_barco",
    "title": "Soy el Capitán de mi Barco",
    "description": "Auto-estima y control emocional para niños.",
    "durationMinutes": 1,
    "category": "kids",
    "moodTags": [
      "kids"
    ],
    "timeOfDay": "cualquiera",
    "difficultyLevel": "principiante",
    "sessionType": "guided_pure",
    "isCustomizable": false,
    "audioLayers": {
      "voiceTrack": "https://ueuxjtyottluwkvdreqe.supabase.co/storage/v1/object/public/meditation-voices/kids_gaia_066_soy-el-capitan-de-mi-barco.mp3",
      "defaultSoundscape": "meditation_bowls"
    },
    "creatorName": "Gaia",
    "creatorCredentials": "Guía de Energía y Conexión",
    "scientificBenefits": "Basado en protocolos clínicos de regulación emocional y bio-feedback.",
    "breathingPattern": {
      "inhale": 4,
      "hold": 0,
      "exhale": 4,
      "holdPost": 0
    },
    "voiceStyle": "calm",
    "visualSync": false,
    "isPremium": false,
    "color": "#1ABC9C",
    "practiceInstruction": "Cierra los ojos y déjate guiar por la voz."
  },
  {
    "id": "88_arbol_gratitud",
    "title": "Gratitud para Niños (El Árbol de la Suerte)",
    "description": "Fomentar el agradecimiento.",
    "durationMinutes": 1,
    "category": "kids",
    "moodTags": [
      "kids"
    ],
    "timeOfDay": "cualquiera",
    "difficultyLevel": "principiante",
    "sessionType": "guided_pure",
    "isCustomizable": false,
    "audioLayers": {
      "voiceTrack": "https://ueuxjtyottluwkvdreqe.supabase.co/storage/v1/object/public/meditation-voices/kids_gaia_067_gratitud-para-ninos-el-arbol-de-la-suerte-.mp3",
      "defaultSoundscape": "meditation_bowls"
    },
    "creatorName": "Gaia",
    "creatorCredentials": "Guía de Energía y Conexión",
    "scientificBenefits": "Basado en protocolos clínicos de regulación emocional y bio-feedback.",
    "breathingPattern": {
      "inhale": 4,
      "hold": 0,
      "exhale": 4,
      "holdPost": 0
    },
    "voiceStyle": "calm",
    "visualSync": false,
    "isPremium": false,
    "color": "#1ABC9C",
    "practiceInstruction": "Cierra los ojos y déjate guiar por la voz."
  },
  {
    "id": "89_rayo_laser",
    "title": "Concentración para Niños (El Rayo Láser)",
    "description": "Fomentar el foco.",
    "durationMinutes": 1,
    "category": "kids",
    "moodTags": [
      "kids"
    ],
    "timeOfDay": "cualquiera",
    "difficultyLevel": "principiante",
    "sessionType": "guided_pure",
    "isCustomizable": false,
    "audioLayers": {
      "voiceTrack": "https://ueuxjtyottluwkvdreqe.supabase.co/storage/v1/object/public/meditation-voices/kids_gaia_068_concentracion-para-ninos-el-rayo-laser-.mp3",
      "defaultSoundscape": "meditation_bowls"
    },
    "creatorName": "Gaia",
    "creatorCredentials": "Guía de Energía y Conexión",
    "scientificBenefits": "Basado en protocolos clínicos de regulación emocional y bio-feedback.",
    "breathingPattern": {
      "inhale": 4,
      "hold": 0,
      "exhale": 4,
      "holdPost": 0
    },
    "voiceStyle": "calm",
    "visualSync": false,
    "isPremium": false,
    "color": "#1ABC9C",
    "practiceInstruction": "Cierra los ojos y déjate guiar por la voz."
  },
  {
    "id": "90_estiramiento_estrella",
    "title": "Estiramiento Estrella (Despertar Niños)",
    "description": "Despertar con energía.",
    "durationMinutes": 1,
    "category": "kids",
    "moodTags": [
      "kids"
    ],
    "timeOfDay": "cualquiera",
    "difficultyLevel": "principiante",
    "sessionType": "guided_pure",
    "isCustomizable": false,
    "audioLayers": {
      "voiceTrack": "https://ueuxjtyottluwkvdreqe.supabase.co/storage/v1/object/public/meditation-voices/kids_gaia_069_estiramiento-estrella-despertar-ninos-.mp3",
      "defaultSoundscape": "meditation_bowls"
    },
    "creatorName": "Gaia",
    "creatorCredentials": "Guía de Energía y Conexión",
    "scientificBenefits": "Basado en protocolos clínicos de regulación emocional y bio-feedback.",
    "breathingPattern": {
      "inhale": 4,
      "hold": 0,
      "exhale": 4,
      "holdPost": 0
    },
    "voiceStyle": "calm",
    "visualSync": false,
    "isPremium": false,
    "color": "#1ABC9C",
    "practiceInstruction": "Cierra los ojos y déjate guiar por la voz."
  },
  {
    "id": "31_mindfulness_respiracion",
    "title": "Mindfulness en la Respiración (Anapanasati)",
    "description": "Entrenar la atención pura utilizando el flujo natural de la respiración como objeto único de observación.",
    "durationMinutes": 5,
    "category": "mindfulness",
    "moodTags": [
      "mindfulness"
    ],
    "timeOfDay": "cualquiera",
    "difficultyLevel": "principiante",
    "sessionType": "guided_pure",
    "isCustomizable": false,
    "audioLayers": {
      "voiceTrack": "https://ueuxjtyottluwkvdreqe.supabase.co/storage/v1/object/public/meditation-voices/mindfulness_aria_070_mindfulness-en-la-respiracion-anapanasati-.mp3",
      "defaultSoundscape": "meditation_bowls"
    },
    "creatorName": "Aria",
    "creatorCredentials": "Guía Especialista en Mindfulness",
    "scientificBenefits": "Basado en protocolos clínicos de regulación emocional y bio-feedback.",
    "breathingPattern": {
      "inhale": 4,
      "hold": 0,
      "exhale": 4,
      "holdPost": 0
    },
    "voiceStyle": "calm",
    "visualSync": false,
    "isPremium": false,
    "color": "#9B59B6",
    "practiceInstruction": "Cierra los ojos y déjate guiar por la voz.",
    "thumbnailUrl": "https://ueuxjtyottluwkvdreqe.supabase.co/storage/v1/object/public/meditation-thumbnails/mindfulness_aria_070_mindfulness-en-la-respiracion-anapanasati-.webp"
  },
  {
    "id": "32_escaner_corporal",
    "title": "Escáner Corporal para el Día",
    "description": "Reconectar con el estado físico y emocional al inicio de la jornada, detectando tensiones antes de que crezcan.",
    "durationMinutes": 5,
    "category": "mindfulness",
    "moodTags": [
      "mindfulness"
    ],
    "timeOfDay": "cualquiera",
    "difficultyLevel": "principiante",
    "sessionType": "guided_pure",
    "isCustomizable": false,
    "audioLayers": {
      "voiceTrack": "https://ueuxjtyottluwkvdreqe.supabase.co/storage/v1/object/public/meditation-voices/mindfulness_aria_071_escaner-corporal-para-el-dia.mp3",
      "defaultSoundscape": "meditation_bowls"
    },
    "creatorName": "Aria",
    "creatorCredentials": "Guía Especialista en Mindfulness",
    "scientificBenefits": "Basado en protocolos clínicos de regulación emocional y bio-feedback.",
    "breathingPattern": {
      "inhale": 4,
      "hold": 0,
      "exhale": 4,
      "holdPost": 0
    },
    "voiceStyle": "calm",
    "visualSync": false,
    "isPremium": false,
    "color": "#9B59B6",
    "practiceInstruction": "Cierra los ojos y déjate guiar por la voz.",
    "thumbnailUrl": "https://ueuxjtyottluwkvdreqe.supabase.co/storage/v1/object/public/meditation-thumbnails/mindfulness_aria_071_escaner-corporal-para-el-dia.webp"
  },
  {
    "id": "33_observador_pensamientos",
    "title": "El Observador de Pensamientos",
    "description": "Diferenciar entre el \"yo\" que experimenta y los pensamientos que son experimentados, reduciendo la identificación egoica.",
    "durationMinutes": 5,
    "category": "mindfulness",
    "moodTags": [
      "mindfulness"
    ],
    "timeOfDay": "cualquiera",
    "difficultyLevel": "principiante",
    "sessionType": "guided_pure",
    "isCustomizable": false,
    "audioLayers": {
      "voiceTrack": "https://ueuxjtyottluwkvdreqe.supabase.co/storage/v1/object/public/meditation-voices/mindfulness_aria_072_el-observador-de-pensamientos.mp3",
      "defaultSoundscape": "meditation_bowls"
    },
    "creatorName": "Aria",
    "creatorCredentials": "Guía Especialista en Mindfulness",
    "scientificBenefits": "Basado en protocolos clínicos de regulación emocional y bio-feedback.",
    "breathingPattern": {
      "inhale": 4,
      "hold": 0,
      "exhale": 4,
      "holdPost": 0
    },
    "voiceStyle": "calm",
    "visualSync": false,
    "isPremium": false,
    "color": "#9B59B6",
    "practiceInstruction": "Cierra los ojos y déjate guiar por la voz.",
    "thumbnailUrl": "https://ueuxjtyottluwkvdreqe.supabase.co/storage/v1/object/public/meditation-thumbnails/mindfulness_aria_072_el-observador-de-pensamientos.webp"
  },
  {
    "id": "34_observador_imparcial",
    "title": "El Observador Imparcial",
    "description": "Desarrollar la capacidad de observar la propia mente sin identificarse con los contenidos, reduciendo la reactividad emocional.",
    "durationMinutes": 5,
    "category": "mindfulness",
    "moodTags": [
      "mindfulness"
    ],
    "timeOfDay": "cualquiera",
    "difficultyLevel": "principiante",
    "sessionType": "guided_pure",
    "isCustomizable": false,
    "audioLayers": {
      "voiceTrack": "https://ueuxjtyottluwkvdreqe.supabase.co/storage/v1/object/public/meditation-voices/mindfulness_aria_073_el-observador-imparcial.mp3",
      "defaultSoundscape": "meditation_bowls"
    },
    "creatorName": "Aria",
    "creatorCredentials": "Guía Especialista en Mindfulness",
    "scientificBenefits": "Basado en protocolos clínicos de regulación emocional y bio-feedback.",
    "breathingPattern": {
      "inhale": 4,
      "hold": 0,
      "exhale": 4,
      "holdPost": 0
    },
    "voiceStyle": "calm",
    "visualSync": false,
    "isPremium": false,
    "color": "#9B59B6",
    "practiceInstruction": "Cierra los ojos y déjate guiar por la voz.",
    "thumbnailUrl": "https://ueuxjtyottluwkvdreqe.supabase.co/storage/v1/object/public/meditation-thumbnails/mindfulness_aria_073_el-observador-imparcial.webp"
  },
  {
    "id": "35_mindfulness_sonidos",
    "title": "Mindfulness en los Sonidos",
    "description": "Utilizar el paisaje sonoro como ancla para la presencia absoluta, entrenando la escucha sin juicio.",
    "durationMinutes": 4,
    "category": "mindfulness",
    "moodTags": [
      "mindfulness"
    ],
    "timeOfDay": "cualquiera",
    "difficultyLevel": "principiante",
    "sessionType": "guided_pure",
    "isCustomizable": false,
    "audioLayers": {
      "voiceTrack": "https://ueuxjtyottluwkvdreqe.supabase.co/storage/v1/object/public/meditation-voices/mindfulness_aria_074_mindfulness-en-los-sonidos.mp3",
      "defaultSoundscape": "meditation_bowls"
    },
    "creatorName": "Aria",
    "creatorCredentials": "Guía Especialista en Mindfulness",
    "scientificBenefits": "Basado en protocolos clínicos de regulación emocional y bio-feedback.",
    "breathingPattern": {
      "inhale": 4,
      "hold": 0,
      "exhale": 4,
      "holdPost": 0
    },
    "voiceStyle": "calm",
    "visualSync": false,
    "isPremium": false,
    "color": "#9B59B6",
    "practiceInstruction": "Cierra los ojos y déjate guiar por la voz.",
    "thumbnailUrl": "https://ueuxjtyottluwkvdreqe.supabase.co/storage/v1/object/public/meditation-thumbnails/mindfulness_aria_074_mindfulness-en-los-sonidos.webp"
  },
  {
    "id": "36_consciencia_sensaciones",
    "title": "Consciencia de las Sensaciones (El Mapa Vivo)",
    "description": "Reconectar con el cuerpo como un mapa dinámico de sensaciones en tiempo real, saliendo de la narrativa mental.",
    "durationMinutes": 4,
    "category": "mindfulness",
    "moodTags": [
      "mindfulness"
    ],
    "timeOfDay": "cualquiera",
    "difficultyLevel": "principiante",
    "sessionType": "guided_pure",
    "isCustomizable": false,
    "audioLayers": {
      "voiceTrack": "https://ueuxjtyottluwkvdreqe.supabase.co/storage/v1/object/public/meditation-voices/mindfulness_aria_075_consciencia-de-las-sensaciones-el-mapa-vivo-.mp3",
      "defaultSoundscape": "meditation_bowls"
    },
    "creatorName": "Aria",
    "creatorCredentials": "Guía Especialista en Mindfulness",
    "scientificBenefits": "Basado en protocolos clínicos de regulación emocional y bio-feedback.",
    "breathingPattern": {
      "inhale": 4,
      "hold": 0,
      "exhale": 4,
      "holdPost": 0
    },
    "voiceStyle": "calm",
    "visualSync": false,
    "isPremium": false,
    "color": "#9B59B6",
    "practiceInstruction": "Cierra los ojos y déjate guiar por la voz.",
    "thumbnailUrl": "https://ueuxjtyottluwkvdreqe.supabase.co/storage/v1/object/public/meditation-thumbnails/mindfulness_aria_075_consciencia-de-las-sensaciones-el-mapa-vivo-.webp"
  },
  {
    "id": "37_caminata_consciente",
    "title": "Caminata Lenta Consciente",
    "description": "Integrar el mindfulness en el movimiento cotidiano, convirtiendo el acto de caminar en una meditación profunda.",
    "durationMinutes": 4,
    "category": "mindfulness",
    "moodTags": [
      "mindfulness"
    ],
    "timeOfDay": "cualquiera",
    "difficultyLevel": "principiante",
    "sessionType": "guided_pure",
    "isCustomizable": false,
    "audioLayers": {
      "voiceTrack": "https://ueuxjtyottluwkvdreqe.supabase.co/storage/v1/object/public/meditation-voices/mindfulness_aria_076_caminata-lenta-consciente.mp3",
      "defaultSoundscape": "meditation_bowls"
    },
    "creatorName": "Aria",
    "creatorCredentials": "Guía Especialista en Mindfulness",
    "scientificBenefits": "Basado en protocolos clínicos de regulación emocional y bio-feedback.",
    "breathingPattern": {
      "inhale": 4,
      "hold": 0,
      "exhale": 4,
      "holdPost": 0
    },
    "voiceStyle": "calm",
    "visualSync": false,
    "isPremium": false,
    "color": "#9B59B6",
    "practiceInstruction": "Cierra los ojos y déjate guiar por la voz.",
    "thumbnailUrl": "https://ueuxjtyottluwkvdreqe.supabase.co/storage/v1/object/public/meditation-thumbnails/mindfulness_aria_076_caminata-lenta-consciente.webp"
  },
  {
    "id": "38_pausa_pensamientos",
    "title": "La Pausa entre Pensamientos",
    "description": "Identificar y habitar los breves momentos de silencio entre un pensamiento y el siguiente, cultivando la quietud profunda.",
    "durationMinutes": 4,
    "category": "mindfulness",
    "moodTags": [
      "mindfulness"
    ],
    "timeOfDay": "cualquiera",
    "difficultyLevel": "principiante",
    "sessionType": "guided_pure",
    "isCustomizable": false,
    "audioLayers": {
      "voiceTrack": "https://ueuxjtyottluwkvdreqe.supabase.co/storage/v1/object/public/meditation-voices/mindfulness_aria_077_la-pausa-entre-pensamientos.mp3",
      "defaultSoundscape": "meditation_bowls"
    },
    "creatorName": "Aria",
    "creatorCredentials": "Guía Especialista en Mindfulness",
    "scientificBenefits": "Basado en protocolos clínicos de regulación emocional y bio-feedback.",
    "breathingPattern": {
      "inhale": 4,
      "hold": 0,
      "exhale": 4,
      "holdPost": 0
    },
    "voiceStyle": "calm",
    "visualSync": false,
    "isPremium": false,
    "color": "#9B59B6",
    "practiceInstruction": "Cierra los ojos y déjate guiar por la voz.",
    "thumbnailUrl": "https://ueuxjtyottluwkvdreqe.supabase.co/storage/v1/object/public/meditation-thumbnails/mindfulness_aria_077_la-pausa-entre-pensamientos.webp"
  },
  {
    "id": "39_vipassana_cuerpo",
    "title": "Vipassana: El Cuerpo Revelado",
    "description": "Practicar la observación sistemática de las sensaciones físicas para comprender la naturaleza de la impermanencia (Anicca).",
    "durationMinutes": 5,
    "category": "mindfulness",
    "moodTags": [
      "mindfulness"
    ],
    "timeOfDay": "cualquiera",
    "difficultyLevel": "principiante",
    "sessionType": "guided_pure",
    "isCustomizable": false,
    "audioLayers": {
      "voiceTrack": "https://ueuxjtyottluwkvdreqe.supabase.co/storage/v1/object/public/meditation-voices/mindfulness_aria_078_vipassana-el-cuerpo-revelado.mp3",
      "defaultSoundscape": "meditation_bowls"
    },
    "creatorName": "Aria",
    "creatorCredentials": "Guía Especialista en Mindfulness",
    "scientificBenefits": "Basado en protocolos clínicos de regulación emocional y bio-feedback.",
    "breathingPattern": {
      "inhale": 4,
      "hold": 0,
      "exhale": 4,
      "holdPost": 0
    },
    "voiceStyle": "calm",
    "visualSync": false,
    "isPremium": false,
    "color": "#9B59B6",
    "practiceInstruction": "Cierra los ojos y déjate guiar por la voz.",
    "thumbnailUrl": "https://ueuxjtyottluwkvdreqe.supabase.co/storage/v1/object/public/meditation-thumbnails/mindfulness_aria_078_vipassana-el-cuerpo-revelado.webp"
  },
  {
    "id": "40_presencia_ahora",
    "title": "Presencia en el \"Ahora\"",
    "description": "Colapsar la narrativa temporal (pasado y futuro) para habitar el único momento real que existe: el presente.",
    "durationMinutes": 4,
    "category": "mindfulness",
    "moodTags": [
      "mindfulness"
    ],
    "timeOfDay": "cualquiera",
    "difficultyLevel": "principiante",
    "sessionType": "guided_pure",
    "isCustomizable": false,
    "audioLayers": {
      "voiceTrack": "https://ueuxjtyottluwkvdreqe.supabase.co/storage/v1/object/public/meditation-voices/mindfulness_aria_079_presencia-en-el-.mp3",
      "defaultSoundscape": "meditation_bowls"
    },
    "creatorName": "Aria",
    "creatorCredentials": "Guía Especialista en Mindfulness",
    "scientificBenefits": "Basado en protocolos clínicos de regulación emocional y bio-feedback.",
    "breathingPattern": {
      "inhale": 4,
      "hold": 0,
      "exhale": 4,
      "holdPost": 0
    },
    "voiceStyle": "calm",
    "visualSync": false,
    "isPremium": false,
    "color": "#9B59B6",
    "practiceInstruction": "Cierra los ojos y déjate guiar por la voz.",
    "thumbnailUrl": "https://ueuxjtyottluwkvdreqe.supabase.co/storage/v1/object/public/meditation-thumbnails/mindfulness_aria_079_presencia-en-el-.webp"
  },
  {
    "id": "51_flow_state",
    "title": "Flow State: Inmersión Total",
    "description": "Facilitar la entrada en el estado de \"flujo\" (Flow), donde la acción y la consciencia se fusionan, eliminando las distracciones y el sentido del tiempo.",
    "durationMinutes": 5,
    "category": "rendimiento",
    "moodTags": [
      "rendimiento"
    ],
    "timeOfDay": "cualquiera",
    "difficultyLevel": "principiante",
    "sessionType": "guided_pure",
    "isCustomizable": false,
    "audioLayers": {
      "voiceTrack": "https://ueuxjtyottluwkvdreqe.supabase.co/storage/v1/object/public/meditation-voices/rendimiento_ziro_080_flow-state-inmersion-total.mp3",
      "defaultSoundscape": "meditation_bowls"
    },
    "creatorName": "Ziro",
    "creatorCredentials": "Guía de Resiliencia y Enfoque",
    "scientificBenefits": "Basado en protocolos clínicos de regulación emocional y bio-feedback.",
    "breathingPattern": {
      "inhale": 4,
      "hold": 0,
      "exhale": 4,
      "holdPost": 0
    },
    "voiceStyle": "calm",
    "visualSync": false,
    "isPremium": false,
    "color": "#E67E22",
    "practiceInstruction": "Cierra los ojos y déjate guiar por la voz."
    ,
    "thumbnailUrl": "https://ueuxjtyottluwkvdreqe.supabase.co/storage/v1/object/public/meditation-thumbnails/rendimiento_ziro_080_flow-state-inmersion-total.webp"
  },
  {
    "id": "52_concentracion_laser",
    "title": "Concentración Láser",
    "description": "Entrenar la atención sostenida mediante la técnica Trataka (fijación visual o mental) para evitar la fragmentación mental actual.",
    "durationMinutes": 4,
    "category": "rendimiento",
    "moodTags": [
      "rendimiento"
    ],
    "timeOfDay": "cualquiera",
    "difficultyLevel": "principiante",
    "sessionType": "guided_pure",
    "isCustomizable": false,
    "audioLayers": {
      "voiceTrack": "https://ueuxjtyottluwkvdreqe.supabase.co/storage/v1/object/public/meditation-voices/rendimiento_ziro_081_concentracion-laser.mp3",
      "defaultSoundscape": "meditation_bowls"
    },
    "creatorName": "Ziro",
    "creatorCredentials": "Guía de Resiliencia y Enfoque",
    "scientificBenefits": "Basado en protocolos clínicos de regulación emocional y bio-feedback.",
    "breathingPattern": {
      "inhale": 4,
      "hold": 0,
      "exhale": 4,
      "holdPost": 0
    },
    "voiceStyle": "calm",
    "visualSync": false,
    "isPremium": false,
    "color": "#E67E22",
    "practiceInstruction": "Cierra los ojos y déjate guiar por la voz."
    ,
    "thumbnailUrl": "https://ueuxjtyottluwkvdreqe.supabase.co/storage/v1/object/public/meditation-thumbnails/rendimiento_ziro_081_concentracion-laser.webp"
  },
  {
    "id": "53_preparacion_creatividad",
    "title": "Preparación para la Creatividad",
    "description": "Abrir el espacio de pensamiento divergente relajando el modo de red neuronal por defecto, permitiendo que surjan nuevas conexiones.",
    "durationMinutes": 4,
    "category": "rendimiento",
    "moodTags": [
      "rendimiento"
    ],
    "timeOfDay": "cualquiera",
    "difficultyLevel": "principiante",
    "sessionType": "guided_pure",
    "isCustomizable": false,
    "audioLayers": {
      "voiceTrack": "https://ueuxjtyottluwkvdreqe.supabase.co/storage/v1/object/public/meditation-voices/rendimiento_ziro_082_preparacion-para-la-creatividad.mp3",
      "defaultSoundscape": "meditation_bowls"
    },
    "creatorName": "Ziro",
    "creatorCredentials": "Guía de Resiliencia y Enfoque",
    "scientificBenefits": "Basado en protocolos clínicos de regulación emocional y bio-feedback.",
    "breathingPattern": {
      "inhale": 4,
      "hold": 0,
      "exhale": 4,
      "holdPost": 0
    },
    "voiceStyle": "calm",
    "visualSync": false,
    "isPremium": false,
    "color": "#E67E22",
    "practiceInstruction": "Cierra los ojos y déjate guiar por la voz."
    ,
    "thumbnailUrl": "https://ueuxjtyottluwkvdreqe.supabase.co/storage/v1/object/public/meditation-thumbnails/rendimiento_ziro_082_preparacion-para-la-creatividad.webp"
  },
  {
    "id": "54_enfoque_estudiar",
    "title": "Enfoque antes de Estudiar",
    "description": "Optimizar la retención de información y la velocidad de procesamiento cognitivo mediante la calma atenta.",
    "durationMinutes": 4,
    "category": "rendimiento",
    "moodTags": [
      "rendimiento"
    ],
    "timeOfDay": "cualquiera",
    "difficultyLevel": "principiante",
    "sessionType": "guided_pure",
    "isCustomizable": false,
    "audioLayers": {
      "voiceTrack": "https://ueuxjtyottluwkvdreqe.supabase.co/storage/v1/object/public/meditation-voices/rendimiento_ziro_083_enfoque-antes-de-estudiar.mp3",
      "defaultSoundscape": "meditation_bowls"
    },
    "creatorName": "Ziro",
    "creatorCredentials": "Guía de Resiliencia y Enfoque",
    "scientificBenefits": "Basado en protocolos clínicos de regulación emocional y bio-feedback.",
    "breathingPattern": {
      "inhale": 4,
      "hold": 0,
      "exhale": 4,
      "holdPost": 0
    },
    "voiceStyle": "calm",
    "visualSync": false,
    "isPremium": false,
    "color": "#E67E22",
    "practiceInstruction": "Cierra los ojos y déjate guiar por la voz."
    ,
    "thumbnailUrl": "https://ueuxjtyottluwkvdreqe.supabase.co/storage/v1/object/public/meditation-thumbnails/rendimiento_ziro_083_enfoque-antes-de-estudiar.webp"
  },
  {
    "id": "55_mentalidad_ganadora",
    "title": "Mentalidad Ganadora (Efecto Ganador)",
    "description": "Generar confianza y seguridad antes de un desafío competitivo o profesional mediante la técnica de \"Visualización del Resultado Final\".",
    "durationMinutes": 4,
    "category": "rendimiento",
    "moodTags": [
      "rendimiento"
    ],
    "timeOfDay": "cualquiera",
    "difficultyLevel": "principiante",
    "sessionType": "guided_pure",
    "isCustomizable": false,
    "audioLayers": {
      "voiceTrack": "https://ueuxjtyottluwkvdreqe.supabase.co/storage/v1/object/public/meditation-voices/rendimiento_ziro_084_mentalidad-ganadora-efecto-ganador-.mp3",
      "defaultSoundscape": "meditation_bowls"
    },
    "creatorName": "Ziro",
    "creatorCredentials": "Guía de Resiliencia y Enfoque",
    "scientificBenefits": "Basado en protocolos clínicos de regulación emocional y bio-feedback.",
    "breathingPattern": {
      "inhale": 4,
      "hold": 0,
      "exhale": 4,
      "holdPost": 0
    },
    "voiceStyle": "calm",
    "visualSync": false,
    "isPremium": false,
    "color": "#E67E22",
    "practiceInstruction": "Cierra los ojos y déjate guiar por la voz."
  },
  {
    "id": "56_superar_procrastinacion",
    "title": "Superar la Procrastinación",
    "description": "Romper la inercia de la evitación mediante la técnica de \"Los 5 segundos\" y el enfoque en el micro-paso inicial.",
    "durationMinutes": 4,
    "category": "rendimiento",
    "moodTags": [
      "rendimiento"
    ],
    "timeOfDay": "cualquiera",
    "difficultyLevel": "principiante",
    "sessionType": "guided_pure",
    "isCustomizable": false,
    "audioLayers": {
      "voiceTrack": "https://ueuxjtyottluwkvdreqe.supabase.co/storage/v1/object/public/meditation-voices/rendimiento_ziro_085_superar-la-procrastinacion.mp3",
      "defaultSoundscape": "meditation_bowls"
    },
    "creatorName": "Ziro",
    "creatorCredentials": "Guía de Resiliencia y Enfoque",
    "scientificBenefits": "Basado en protocolos clínicos de regulación emocional y bio-feedback.",
    "breathingPattern": {
      "inhale": 4,
      "hold": 0,
      "exhale": 4,
      "holdPost": 0
    },
    "voiceStyle": "calm",
    "visualSync": false,
    "isPremium": false,
    "color": "#E67E22",
    "practiceInstruction": "Cierra los ojos y déjate guiar por la voz."
  },
  {
    "id": "57_foco_monotarea",
    "title": "Foco en la Monotarea",
    "description": "Combatir el agotamiento por multitasking entrenando la mente para dedicarse a un solo objeto de atención con profundidad.",
    "durationMinutes": 4,
    "category": "rendimiento",
    "moodTags": [
      "rendimiento"
    ],
    "timeOfDay": "cualquiera",
    "difficultyLevel": "principiante",
    "sessionType": "guided_pure",
    "isCustomizable": false,
    "audioLayers": {
      "voiceTrack": "https://ueuxjtyottluwkvdreqe.supabase.co/storage/v1/object/public/meditation-voices/rendimiento_ziro_086_foco-en-la-monotarea.mp3",
      "defaultSoundscape": "meditation_bowls"
    },
    "creatorName": "Ziro",
    "creatorCredentials": "Guía de Resiliencia y Enfoque",
    "scientificBenefits": "Basado en protocolos clínicos de regulación emocional y bio-feedback.",
    "breathingPattern": {
      "inhale": 4,
      "hold": 0,
      "exhale": 4,
      "holdPost": 0
    },
    "voiceStyle": "calm",
    "visualSync": false,
    "isPremium": false,
    "color": "#E67E22",
    "practiceInstruction": "Cierra los ojos y déjate guiar por la voz."
  },
  {
    "id": "58_vision_periferica",
    "title": "Visión Periférica y Calma (Hakalau)",
    "description": "Inducir un estado de calma alerta instantánea mediante la expansión de la visión periférica, técnica usada por antiguos navegantes polinesios.",
    "durationMinutes": 4,
    "category": "rendimiento",
    "moodTags": [
      "rendimiento"
    ],
    "timeOfDay": "cualquiera",
    "difficultyLevel": "principiante",
    "sessionType": "guided_pure",
    "isCustomizable": false,
    "audioLayers": {
      "voiceTrack": "https://ueuxjtyottluwkvdreqe.supabase.co/storage/v1/object/public/meditation-voices/rendimiento_ziro_087_vision-periferica-y-calma-hakalau-.mp3",
      "defaultSoundscape": "meditation_bowls"
    },
    "creatorName": "Ziro",
    "creatorCredentials": "Guía de Resiliencia y Enfoque",
    "scientificBenefits": "Basado en protocolos clínicos de regulación emocional y bio-feedback.",
    "breathingPattern": {
      "inhale": 4,
      "hold": 0,
      "exhale": 4,
      "holdPost": 0
    },
    "voiceStyle": "calm",
    "visualSync": false,
    "isPremium": false,
    "color": "#E67E22",
    "practiceInstruction": "Cierra los ojos y déjate guiar por la voz."
  },
  {
    "id": "59_resiliencia_presion",
    "title": "Resiliencia bajo Presión",
    "description": "Mantener el rendimiento cognitivo bajo situaciones de alta demanda o estrés agudo, controlando la respuesta cardíaca.",
    "durationMinutes": 4,
    "category": "rendimiento",
    "moodTags": [
      "rendimiento"
    ],
    "timeOfDay": "cualquiera",
    "difficultyLevel": "principiante",
    "sessionType": "guided_pure",
    "isCustomizable": false,
    "audioLayers": {
      "voiceTrack": "https://ueuxjtyottluwkvdreqe.supabase.co/storage/v1/object/public/meditation-voices/rendimiento_ziro_088_resiliencia-bajo-presion.mp3",
      "defaultSoundscape": "meditation_bowls"
    },
    "creatorName": "Ziro",
    "creatorCredentials": "Guía de Resiliencia y Enfoque",
    "scientificBenefits": "Basado en protocolos clínicos de regulación emocional y bio-feedback.",
    "breathingPattern": {
      "inhale": 4,
      "hold": 0,
      "exhale": 4,
      "holdPost": 0
    },
    "voiceStyle": "calm",
    "visualSync": false,
    "isPremium": false,
    "color": "#E67E22",
    "practiceInstruction": "Cierra los ojos y déjate guiar por la voz."
  },
  {
    "id": "60_bloqueo_distracciones",
    "title": "Bloqueo de Distracciones",
    "description": "Crear una barrera mental contra las interrupciones externas e impulsos internos de distracción (teléfono, pensamientos azarosos).",
    "durationMinutes": 5,
    "category": "rendimiento",
    "moodTags": [
      "rendimiento"
    ],
    "timeOfDay": "cualquiera",
    "difficultyLevel": "principiante",
    "sessionType": "guided_pure",
    "isCustomizable": false,
    "audioLayers": {
      "voiceTrack": "https://ueuxjtyottluwkvdreqe.supabase.co/storage/v1/object/public/meditation-voices/rendimiento_ziro_089_bloqueo-de-distracciones.mp3",
      "defaultSoundscape": "meditation_bowls"
    },
    "creatorName": "Ziro",
    "creatorCredentials": "Guía de Resiliencia y Enfoque",
    "scientificBenefits": "Basado en protocolos clínicos de regulación emocional y bio-feedback.",
    "breathingPattern": {
      "inhale": 4,
      "hold": 0,
      "exhale": 4,
      "holdPost": 0
    },
    "voiceStyle": "calm",
    "visualSync": false,
    "isPremium": false,
    "color": "#E67E22",
    "practiceInstruction": "Cierra los ojos y déjate guiar por la voz."
  },
  {
    "id": "41_ciudadela_interior",
    "title": "La Ciudadela Interior (Estoicismo)",
    "description": "Fortalecer el centro interno de juicio y voluntad, creando una barrera protectora contra el estrés externo basada en las enseñanzas de Marco Aurelio.",
    "durationMinutes": 4,
    "category": "resiliencia",
    "moodTags": [
      "resiliencia"
    ],
    "timeOfDay": "cualquiera",
    "difficultyLevel": "principiante",
    "sessionType": "guided_pure",
    "isCustomizable": false,
    "audioLayers": {
      "voiceTrack": "https://ueuxjtyottluwkvdreqe.supabase.co/storage/v1/object/public/meditation-voices/resiliencia_eter_090_la-ciudadela-interior-estoicismo-.mp3",
      "defaultSoundscape": "meditation_bowls"
    },
    "creatorName": "Éter",
    "creatorCredentials": "Guía de Sueño y Alivio Profundo",
    "scientificBenefits": "Basado en protocolos clínicos de regulación emocional y bio-feedback.",
    "breathingPattern": {
      "inhale": 4,
      "hold": 0,
      "exhale": 4,
      "holdPost": 0
    },
    "voiceStyle": "calm",
    "visualSync": false,
    "isPremium": false,
    "color": "#FF9F43",
    "practiceInstruction": "Cierra los ojos y déjate guiar por la voz."
    ,
    "thumbnailUrl": "https://ueuxjtyottluwkvdreqe.supabase.co/storage/v1/object/public/meditation-thumbnails/resiliencia_eter_090_la-ciudadela-interior.webp"
  },
  {
    "id": "42_gestion_cambio",
    "title": "Gestión del Cambio (Aceptación Estoica)",
    "description": "Cultivar la flexibilidad psicológica ante las transiciones de la vida mediante la aceptación de la impermanencia (Amor Fati).",
    "durationMinutes": 4,
    "category": "resiliencia",
    "moodTags": [
      "resiliencia"
    ],
    "timeOfDay": "cualquiera",
    "difficultyLevel": "principiante",
    "sessionType": "guided_pure",
    "isCustomizable": false,
    "audioLayers": {
      "voiceTrack": "https://ueuxjtyottluwkvdreqe.supabase.co/storage/v1/object/public/meditation-voices/resiliencia_eter_091_gestion-del-cambio-aceptacion-estoica-.mp3",
      "defaultSoundscape": "meditation_bowls"
    },
    "creatorName": "Éter",
    "creatorCredentials": "Guía de Sueño y Alivio Profundo",
    "scientificBenefits": "Basado en protocolos clínicos de regulación emocional y bio-feedback.",
    "breathingPattern": {
      "inhale": 4,
      "hold": 0,
      "exhale": 4,
      "holdPost": 0
    },
    "voiceStyle": "calm",
    "visualSync": false,
    "isPremium": false,
    "color": "#FF9F43",
    "practiceInstruction": "Cierra los ojos y déjate guiar por la voz."
    ,
    "thumbnailUrl": "https://ueuxjtyottluwkvdreqe.supabase.co/storage/v1/object/public/meditation-thumbnails/resiliencia_eter_091_gestion-del-cambio.webp"
  },
  {
    "id": "43_gratitud_radical",
    "title": "Gratitud Radical",
    "description": "Reentrenar el cerebro para detectar la abundancia en lugar de la carencia, reduciendo la ansiedad y mejorando el bienestar subjetivo.",
    "durationMinutes": 4,
    "category": "resiliencia",
    "moodTags": [
      "resiliencia"
    ],
    "timeOfDay": "cualquiera",
    "difficultyLevel": "principiante",
    "sessionType": "guided_pure",
    "isCustomizable": false,
    "audioLayers": {
      "voiceTrack": "https://ueuxjtyottluwkvdreqe.supabase.co/storage/v1/object/public/meditation-voices/resiliencia_eter_092_gratitud-radical.mp3",
      "defaultSoundscape": "meditation_bowls"
    },
    "creatorName": "Éter",
    "creatorCredentials": "Guía de Sueño y Alivio Profundo",
    "scientificBenefits": "Basado en protocolos clínicos de regulación emocional y bio-feedback.",
    "breathingPattern": {
      "inhale": 4,
      "hold": 0,
      "exhale": 4,
      "holdPost": 0
    },
    "voiceStyle": "calm",
    "visualSync": false,
    "isPremium": false,
    "color": "#FF9F43",
    "practiceInstruction": "Cierra los ojos y déjate guiar por la voz."
    ,
    "thumbnailUrl": "https://ueuxjtyottluwkvdreqe.supabase.co/storage/v1/object/public/meditation-thumbnails/resiliencia_eter_092_gratitud-radical.webp"
  },
  {
    "id": "44_transformar_fracaso",
    "title": "Transformar el Fracaso (Resiliencia)",
    "description": "Reencuadrar las experiencias negativas como oportunidades de aprendizaje y crecimiento, rompiendo el estigma del fallo.",
    "durationMinutes": 4,
    "category": "resiliencia",
    "moodTags": [
      "resiliencia"
    ],
    "timeOfDay": "cualquiera",
    "difficultyLevel": "principiante",
    "sessionType": "guided_pure",
    "isCustomizable": false,
    "audioLayers": {
      "voiceTrack": "https://ueuxjtyottluwkvdreqe.supabase.co/storage/v1/object/public/meditation-voices/resiliencia_eter_093_transformar-el-fracaso-resiliencia-.mp3",
      "defaultSoundscape": "meditation_bowls"
    },
    "creatorName": "Éter",
    "creatorCredentials": "Guía de Sueño y Alivio Profundo",
    "scientificBenefits": "Basado en protocolos clínicos de regulación emocional y bio-feedback.",
    "breathingPattern": {
      "inhale": 4,
      "hold": 0,
      "exhale": 4,
      "holdPost": 0
    },
    "voiceStyle": "calm",
    "visualSync": false,
    "isPremium": false,
    "color": "#FF9F43",
    "practiceInstruction": "Cierra los ojos y déjate guiar por la voz.",
    "thumbnailUrl": "https://ueuxjtyottluwkvdreqe.supabase.co/storage/v1/object/public/meditation-thumbnails/resiliencia_eter_093_transformar-el-fracaso.webp"
  },
  {
    "id": "45_observador_tormenta",
    "title": "El Observador de la Tormenta",
    "description": "Mantener la estabilidad emocional y el centro interno durante periodos de crisis o alta turbulencia externa.",
    "durationMinutes": 4,
    "category": "resiliencia",
    "moodTags": [
      "resiliencia"
    ],
    "timeOfDay": "cualquiera",
    "difficultyLevel": "principiante",
    "sessionType": "guided_pure",
    "isCustomizable": false,
    "audioLayers": {
      "voiceTrack": "https://ueuxjtyottluwkvdreqe.supabase.co/storage/v1/object/public/meditation-voices/resiliencia_eter_094_el-observador-de-la-tormenta.mp3",
      "defaultSoundscape": "meditation_bowls"
    },
    "creatorName": "Éter",
    "creatorCredentials": "Guía de Sueño y Alivio Profundo",
    "scientificBenefits": "Basado en protocolos clínicos de regulación emocional y bio-feedback.",
    "breathingPattern": {
      "inhale": 4,
      "hold": 0,
      "exhale": 4,
      "holdPost": 0
    },
    "voiceStyle": "calm",
    "visualSync": false,
    "isPremium": false,
    "color": "#FF9F43",
    "practiceInstruction": "Cierra los ojos y déjate guiar por la voz.",
    "thumbnailUrl": "https://ueuxjtyottluwkvdreqe.supabase.co/storage/v1/object/public/meditation-thumbnails/resiliencia_eter_094_el-observador-de-la-tormenta.webp"
  },
  {
    "id": "46_fortaleza_adversidad",
    "title": "Fortaleza ante la Adversidad",
    "description": "Desarrollar la mentalidad de \"Antifragilidad\", donde la presión y las dificultades se utilizan para fortalecerse en lugar de quebrarse.",
    "durationMinutes": 4,
    "category": "resiliencia",
    "moodTags": [
      "resiliencia"
    ],
    "timeOfDay": "cualquiera",
    "difficultyLevel": "principiante",
    "sessionType": "guided_pure",
    "isCustomizable": false,
    "audioLayers": {
      "voiceTrack": "https://ueuxjtyottluwkvdreqe.supabase.co/storage/v1/object/public/meditation-voices/resiliencia_eter_095_fortaleza-ante-la-adversidad.mp3",
      "defaultSoundscape": "meditation_bowls"
    },
    "creatorName": "Éter",
    "creatorCredentials": "Guía de Sueño y Alivio Profundo",
    "scientificBenefits": "Basado en protocolos clínicos de regulación emocional y bio-feedback.",
    "breathingPattern": {
      "inhale": 4,
      "hold": 0,
      "exhale": 4,
      "holdPost": 0
    },
    "voiceStyle": "calm",
    "visualSync": false,
    "isPremium": false,
    "color": "#FF9F43",
    "practiceInstruction": "Cierra los ojos y déjate guiar por la voz.",
    "thumbnailUrl": "https://ueuxjtyottluwkvdreqe.supabase.co/storage/v1/object/public/meditation-thumbnails/resiliencia_eter_095_fortaleza-ante-la-adversidad.webp"
  },
  {
    "id": "47_autocompasion_error",
    "title": "Auto-compasión ante el Error",
    "description": "Sustituir el crítico interno por una voz de apoyo y amabilidad tras cometer un error, acelerando la recuperación emocional.",
    "durationMinutes": 4,
    "category": "resiliencia",
    "moodTags": [
      "resiliencia"
    ],
    "timeOfDay": "cualquiera",
    "difficultyLevel": "principiante",
    "sessionType": "guided_pure",
    "isCustomizable": false,
    "audioLayers": {
      "voiceTrack": "https://ueuxjtyottluwkvdreqe.supabase.co/storage/v1/object/public/meditation-voices/resiliencia_eter_096_auto-compasion-ante-el-error.mp3",
      "defaultSoundscape": "meditation_bowls"
    },
    "creatorName": "Éter",
    "creatorCredentials": "Guía de Sueño y Alivio Profundo",
    "scientificBenefits": "Basado en protocolos clínicos de regulación emocional y bio-feedback.",
    "breathingPattern": {
      "inhale": 4,
      "hold": 0,
      "exhale": 4,
      "holdPost": 0
    },
    "voiceStyle": "calm",
    "visualSync": false,
    "isPremium": false,
    "color": "#FF9F43",
    "practiceInstruction": "Cierra los ojos y déjate guiar por la voz.",
    "thumbnailUrl": "https://ueuxjtyottluwkvdreqe.supabase.co/storage/v1/object/public/meditation-thumbnails/resiliencia_eter_096_autocompasion-ante-el-error.webp"
  },
  {
    "id": "48_desaprender_juicio",
    "title": "Desaprender el Juicio",
    "description": "Reducir el sufrimiento causado por las etiquetas mentales de \"bueno\" o \"malo\", cultivando una mirada objetiva y ecuánime.",
    "durationMinutes": 4,
    "category": "resiliencia",
    "moodTags": [
      "resiliencia"
    ],
    "timeOfDay": "cualquiera",
    "difficultyLevel": "principiante",
    "sessionType": "guided_pure",
    "isCustomizable": false,
    "audioLayers": {
      "voiceTrack": "https://ueuxjtyottluwkvdreqe.supabase.co/storage/v1/object/public/meditation-voices/resiliencia_eter_097_desaprender-el-juicio.mp3",
      "defaultSoundscape": "meditation_bowls"
    },
    "creatorName": "Éter",
    "creatorCredentials": "Guía de Sueño y Alivio Profundo",
    "scientificBenefits": "Basado en protocolos clínicos de regulación emocional y bio-feedback.",
    "breathingPattern": {
      "inhale": 4,
      "hold": 0,
      "exhale": 4,
      "holdPost": 0
    },
    "voiceStyle": "calm",
    "visualSync": false,
    "isPremium": false,
    "color": "#FF9F43",
    "practiceInstruction": "Cierra los ojos y déjate guiar por la voz.",
    "thumbnailUrl": "https://ueuxjtyottluwkvdreqe.supabase.co/storage/v1/object/public/meditation-thumbnails/resiliencia_eter_097_desaprender-el-juicio.webp"
  },
  {
    "id": "49_ecuanimidad_caos",
    "title": "Ecuanimidad en el Caos",
    "description": "Mantener la estabilidad emocional independientemente de los resultados externos, evitando las subidas y bajadas emocionales extremas.",
    "durationMinutes": 4,
    "category": "resiliencia",
    "moodTags": [
      "resiliencia"
    ],
    "timeOfDay": "cualquiera",
    "difficultyLevel": "principiante",
    "sessionType": "guided_pure",
    "isCustomizable": false,
    "audioLayers": {
      "voiceTrack": "https://ueuxjtyottluwkvdreqe.supabase.co/storage/v1/object/public/meditation-voices/resiliencia_eter_098_ecuanimidad-en-el-caos.mp3",
      "defaultSoundscape": "meditation_bowls"
    },
    "creatorName": "Éter",
    "creatorCredentials": "Guía de Sueño y Alivio Profundo",
    "scientificBenefits": "Basado en protocolos clínicos de regulación emocional y bio-feedback.",
    "breathingPattern": {
      "inhale": 4,
      "hold": 0,
      "exhale": 4,
      "holdPost": 0
    },
    "voiceStyle": "calm",
    "visualSync": false,
    "isPremium": false,
    "color": "#FF9F43",
    "practiceInstruction": "Cierra los ojos y déjate guiar por la voz.",
    "thumbnailUrl": "https://ueuxjtyottluwkvdreqe.supabase.co/storage/v1/object/public/meditation-thumbnails/resiliencia_eter_098_ecuanimidad-en-el-caos.webp"
  },
  {
    "id": "50_previsualizacion_males",
    "title": "Previsualización de Dificultades (Pre-mortum)",
    "description": "Preparar la mente estoicamente para los posibles contratiempos del día, eliminando el factor sorpresa y la frustración.",
    "durationMinutes": 5,
    "category": "resiliencia",
    "moodTags": [
      "resiliencia"
    ],
    "timeOfDay": "cualquiera",
    "difficultyLevel": "principiante",
    "sessionType": "guided_pure",
    "isCustomizable": false,
    "audioLayers": {
      "voiceTrack": "https://ueuxjtyottluwkvdreqe.supabase.co/storage/v1/object/public/meditation-voices/resiliencia_eter_099_previsualizacion-de-dificultades-pre-mortum-.mp3",
      "defaultSoundscape": "meditation_bowls"
    },
    "creatorName": "Éter",
    "creatorCredentials": "Guía de Sueño y Alivio Profundo",
    "scientificBenefits": "Basado en protocolos clínicos de regulación emocional y bio-feedback.",
    "breathingPattern": {
      "inhale": 4,
      "hold": 0,
      "exhale": 4,
      "holdPost": 0
    },
    "voiceStyle": "calm",
    "visualSync": false,
    "isPremium": false,
    "color": "#FF9F43",
    "practiceInstruction": "Cierra los ojos y déjate guiar por la voz.",
    "thumbnailUrl": "https://ueuxjtyottluwkvdreqe.supabase.co/storage/v1/object/public/meditation-thumbnails/resiliencia_eter_099_previsualizacion-de-males.webp"
  },
  {
    "id": "61_alivio_dolor",
    "title": "Alivio del Dolor (Escáner)",
    "description": "Cambiar la percepción subjetiva del dolor crónico o agudo mediante la observación sin resistencia y la respiración dirigida.",
    "durationMinutes": 4,
    "category": "salud",
    "moodTags": [
      "salud"
    ],
    "timeOfDay": "cualquiera",
    "difficultyLevel": "principiante",
    "sessionType": "guided_pure",
    "isCustomizable": false,
    "audioLayers": {
      "voiceTrack": "https://ueuxjtyottluwkvdreqe.supabase.co/storage/v1/object/public/meditation-voices/salud_aria_100_alivio-del-dolor-escaner-.mp3",
      "defaultSoundscape": "meditation_bowls"
    },
    "creatorName": "Aria",
    "creatorCredentials": "Guía Especialista en Mindfulness",
    "scientificBenefits": "Basado en protocolos clínicos de regulación emocional y bio-feedback.",
    "breathingPattern": {
      "inhale": 4,
      "hold": 0,
      "exhale": 4,
      "holdPost": 0
    },
    "voiceStyle": "calm",
    "visualSync": false,
    "isPremium": false,
    "color": "#2ECC71",
    "practiceInstruction": "Cierra los ojos y déjate guiar por la voz."
  },
  {
    "id": "62_consciencia_postura",
    "title": "Consciencia de la Postura",
    "description": "Corregir la alineación física y reducir la tensión estructural mediante la visualización de la columna y el equilibrio gravitatorio.",
    "durationMinutes": 4,
    "category": "salud",
    "moodTags": [
      "salud"
    ],
    "timeOfDay": "cualquiera",
    "difficultyLevel": "principiante",
    "sessionType": "guided_pure",
    "isCustomizable": false,
    "audioLayers": {
      "voiceTrack": "https://ueuxjtyottluwkvdreqe.supabase.co/storage/v1/object/public/meditation-voices/salud_aria_101_consciencia-de-la-postura.mp3",
      "defaultSoundscape": "meditation_bowls"
    },
    "creatorName": "Aria",
    "creatorCredentials": "Guía Especialista en Mindfulness",
    "scientificBenefits": "Basado en protocolos clínicos de regulación emocional y bio-feedback.",
    "breathingPattern": {
      "inhale": 4,
      "hold": 0,
      "exhale": 4,
      "holdPost": 0
    },
    "voiceStyle": "calm",
    "visualSync": false,
    "isPremium": false,
    "color": "#2ECC71",
    "practiceInstruction": "Cierra los ojos y déjate guiar por la voz."
  },
  {
    "id": "63_recuperacion_post_ejercicio",
    "title": "Recuperación Post-Ejercicio",
    "description": "Acelerar la recuperación muscular y el retorno al equilibrio homeostático tras el esfuerzo físico intenso.",
    "durationMinutes": 4,
    "category": "salud",
    "moodTags": [
      "salud"
    ],
    "timeOfDay": "cualquiera",
    "difficultyLevel": "principiante",
    "sessionType": "guided_pure",
    "isCustomizable": false,
    "audioLayers": {
      "voiceTrack": "https://ueuxjtyottluwkvdreqe.supabase.co/storage/v1/object/public/meditation-voices/salud_aria_102_recuperacion-post-ejercicio.mp3",
      "defaultSoundscape": "meditation_bowls"
    },
    "creatorName": "Aria",
    "creatorCredentials": "Guía Especialista en Mindfulness",
    "scientificBenefits": "Basado en protocolos clínicos de regulación emocional y bio-feedback.",
    "breathingPattern": {
      "inhale": 4,
      "hold": 0,
      "exhale": 4,
      "holdPost": 0
    },
    "voiceStyle": "calm",
    "visualSync": false,
    "isPremium": false,
    "color": "#2ECC71",
    "practiceInstruction": "Cierra los ojos y déjate guiar por la voz."
  },
  {
    "id": "64_respiracion_digestion",
    "title": "Respiración para la Digestión",
    "description": "Calmar el tracto digestivo y mejorar la absorción de nutrientes estimulando el nervio vago tras las comidas.",
    "durationMinutes": 4,
    "category": "salud",
    "moodTags": [
      "salud"
    ],
    "timeOfDay": "cualquiera",
    "difficultyLevel": "principiante",
    "sessionType": "guided_pure",
    "isCustomizable": false,
    "audioLayers": {
      "voiceTrack": "https://ueuxjtyottluwkvdreqe.supabase.co/storage/v1/object/public/meditation-voices/salud_aria_103_respiracion-para-la-digestion.mp3",
      "defaultSoundscape": "meditation_bowls"
    },
    "creatorName": "Aria",
    "creatorCredentials": "Guía Especialista en Mindfulness",
    "scientificBenefits": "Basado en protocolos clínicos de regulación emocional y bio-feedback.",
    "breathingPattern": {
      "inhale": 4,
      "hold": 0,
      "exhale": 4,
      "holdPost": 0
    },
    "voiceStyle": "calm",
    "visualSync": false,
    "isPremium": false,
    "color": "#2ECC71",
    "practiceInstruction": "Cierra los ojos y déjate guiar por la voz."
  },
  {
    "id": "65_escucha_incomodidad",
    "title": "Escucha de la Incomodidad",
    "description": "Aprender a descifrar los mensajes somáticos del cuerpo antes de que se conviertan en patologías, promoviendo la salud preventiva.",
    "durationMinutes": 5,
    "category": "salud",
    "moodTags": [
      "salud"
    ],
    "timeOfDay": "cualquiera",
    "difficultyLevel": "principiante",
    "sessionType": "guided_pure",
    "isCustomizable": false,
    "audioLayers": {
      "voiceTrack": "https://ueuxjtyottluwkvdreqe.supabase.co/storage/v1/object/public/meditation-voices/salud_aria_104_escucha-de-la-incomodidad.mp3",
      "defaultSoundscape": "meditation_bowls"
    },
    "creatorName": "Aria",
    "creatorCredentials": "Guía Especialista en Mindfulness",
    "scientificBenefits": "Basado en protocolos clínicos de regulación emocional y bio-feedback.",
    "breathingPattern": {
      "inhale": 4,
      "hold": 0,
      "exhale": 4,
      "holdPost": 0
    },
    "voiceStyle": "calm",
    "visualSync": false,
    "isPremium": false,
    "color": "#2ECC71",
    "practiceInstruction": "Cierra los ojos y déjate guiar por la voz."
  },
  {
    "id": "66_relajacion_rostro",
    "title": "Relajación de Mandíbula y Rostro",
    "description": "Soltar la tensión involuntaria en los músculos faciales y temporomandibulares (bruxismo), que suele ser el centro de la respuesta de estrés.",
    "durationMinutes": 4,
    "category": "salud",
    "moodTags": [
      "salud"
    ],
    "timeOfDay": "cualquiera",
    "difficultyLevel": "principiante",
    "sessionType": "guided_pure",
    "isCustomizable": false,
    "audioLayers": {
      "voiceTrack": "https://ueuxjtyottluwkvdreqe.supabase.co/storage/v1/object/public/meditation-voices/salud_aria_105_relajacion-de-mandibula-y-rostro.mp3",
      "defaultSoundscape": "meditation_bowls"
    },
    "creatorName": "Aria",
    "creatorCredentials": "Guía Especialista en Mindfulness",
    "scientificBenefits": "Basado en protocolos clínicos de regulación emocional y bio-feedback.",
    "breathingPattern": {
      "inhale": 4,
      "hold": 0,
      "exhale": 4,
      "holdPost": 0
    },
    "voiceStyle": "calm",
    "visualSync": false,
    "isPremium": false,
    "color": "#2ECC71",
    "practiceInstruction": "Cierra los ojos y déjate guiar por la voz."
  },
  {
    "id": "67_cuerpo_aliado",
    "title": "El Cuerpo como Aliado",
    "description": "Reconciliar la relación con el propio cuerpo, pasando del juicio estético o funcional a la gratitud biológica por el soporte vital.",
    "durationMinutes": 5,
    "category": "salud",
    "moodTags": [
      "salud"
    ],
    "timeOfDay": "cualquiera",
    "difficultyLevel": "principiante",
    "sessionType": "guided_pure",
    "isCustomizable": false,
    "audioLayers": {
      "voiceTrack": "https://ueuxjtyottluwkvdreqe.supabase.co/storage/v1/object/public/meditation-voices/salud_aria_106_el-cuerpo-como-aliado.mp3",
      "defaultSoundscape": "meditation_bowls"
    },
    "creatorName": "Aria",
    "creatorCredentials": "Guía Especialista en Mindfulness",
    "scientificBenefits": "Basado en protocolos clínicos de regulación emocional y bio-feedback.",
    "breathingPattern": {
      "inhale": 4,
      "hold": 0,
      "exhale": 4,
      "holdPost": 0
    },
    "voiceStyle": "calm",
    "visualSync": false,
    "isPremium": false,
    "color": "#2ECC71",
    "practiceInstruction": "Cierra los ojos y déjate guiar por la voz."
  },
  {
    "id": "68_gestion_cefalea",
    "title": "Gestión de la Cefalea por Tensión",
    "description": "Aliviar los dolores de cabeza tensionales mediante la descompresión mental y la relajación de los músculos del cuello y el cuero cabelludo.",
    "durationMinutes": 4,
    "category": "salud",
    "moodTags": [
      "salud"
    ],
    "timeOfDay": "cualquiera",
    "difficultyLevel": "principiante",
    "sessionType": "guided_pure",
    "isCustomizable": false,
    "audioLayers": {
      "voiceTrack": "https://ueuxjtyottluwkvdreqe.supabase.co/storage/v1/object/public/meditation-voices/salud_aria_107_gestion-de-la-cefalea-por-tension.mp3",
      "defaultSoundscape": "meditation_bowls"
    },
    "creatorName": "Aria",
    "creatorCredentials": "Guía Especialista en Mindfulness",
    "scientificBenefits": "Basado en protocolos clínicos de regulación emocional y bio-feedback.",
    "breathingPattern": {
      "inhale": 4,
      "hold": 0,
      "exhale": 4,
      "holdPost": 0
    },
    "voiceStyle": "calm",
    "visualSync": false,
    "isPremium": false,
    "color": "#2ECC71",
    "practiceInstruction": "Cierra los ojos y déjate guiar por la voz."
  },
  {
    "id": "69_vitalidad_sistemica",
    "title": "Vitalidad Sistémica",
    "description": "Energizar el cuerpo a nivel celular y fortalecer la respuesta inmunológica mediante la respiración rítmica y la visualización de vitalidad.",
    "durationMinutes": 5,
    "category": "salud",
    "moodTags": [
      "salud"
    ],
    "timeOfDay": "cualquiera",
    "difficultyLevel": "principiante",
    "sessionType": "guided_pure",
    "isCustomizable": false,
    "audioLayers": {
      "voiceTrack": "https://ueuxjtyottluwkvdreqe.supabase.co/storage/v1/object/public/meditation-voices/salud_aria_108_vitalidad-sistemica.mp3",
      "defaultSoundscape": "meditation_bowls"
    },
    "creatorName": "Aria",
    "creatorCredentials": "Guía Especialista en Mindfulness",
    "scientificBenefits": "Basado en protocolos clínicos de regulación emocional y bio-feedback.",
    "breathingPattern": {
      "inhale": 4,
      "hold": 0,
      "exhale": 4,
      "holdPost": 0
    },
    "voiceStyle": "calm",
    "visualSync": false,
    "isPremium": false,
    "color": "#2ECC71",
    "practiceInstruction": "Cierra los ojos y déjate guiar por la voz."
  },
  {
    "id": "70_conexion_intestino",
    "title": "Conexión Mente-Intestino",
    "description": "Mejorar la salud digestiva y emocional alineando los dos \"cerebros\" mediante la calma profunda y la consciencia entérica.",
    "durationMinutes": 5,
    "category": "salud",
    "moodTags": [
      "salud"
    ],
    "timeOfDay": "cualquiera",
    "difficultyLevel": "principiante",
    "sessionType": "guided_pure",
    "isCustomizable": false,
    "audioLayers": {
      "voiceTrack": "https://ueuxjtyottluwkvdreqe.supabase.co/storage/v1/object/public/meditation-voices/salud_aria_109_conexion-mente-intestino.mp3",
      "defaultSoundscape": "meditation_bowls"
    },
    "creatorName": "Aria",
    "creatorCredentials": "Guía Especialista en Mindfulness",
    "scientificBenefits": "Basado en protocolos clínicos de regulación emocional y bio-feedback.",
    "breathingPattern": {
      "inhale": 4,
      "hold": 0,
      "exhale": 4,
      "holdPost": 0
    },
    "voiceStyle": "calm",
    "visualSync": false,
    "isPremium": false,
    "color": "#2ECC71",
    "practiceInstruction": "Cierra los ojos y déjate guiar por la voz."
  },
  {
    "id": "21_preparacion_ensueno",
    "title": "Preparación para el Ensueño",
    "description": "Facilitar la transición de ondas beta a ondas alfa y theta, preparando el subconsciente para un sueño reparador.",
    "durationMinutes": 5,
    "category": "sueno",
    "moodTags": [
      "sueño"
    ],
    "timeOfDay": "cualquiera",
    "difficultyLevel": "principiante",
    "sessionType": "guided_pure",
    "isCustomizable": false,
    "audioLayers": {
      "voiceTrack": "https://ueuxjtyottluwkvdreqe.supabase.co/storage/v1/object/public/meditation-voices/sueno_eter_110_preparacion-para-el-ensueno.mp3",
      "defaultSoundscape": "meditation_bowls"
    },
    "creatorName": "Éter",
    "creatorCredentials": "Guía de Sueño y Alivio Profundo",
    "scientificBenefits": "Basado en protocolos clínicos de regulación emocional y bio-feedback.",
    "breathingPattern": {
      "inhale": 4,
      "hold": 0,
      "exhale": 4,
      "holdPost": 0
    },
    "voiceStyle": "calm",
    "visualSync": false,
    "isPremium": false,
    "color": "#4A90E2",
    "practiceInstruction": "Cierra los ojos y déjate guiar por la voz.",
    "thumbnailUrl": "https://ueuxjtyottluwkvdreqe.supabase.co/storage/v1/object/public/meditation-thumbnails/sueno_eter_110_preparacion-para-el-ensueno.webp"
  },
  {
    "id": "22_descanso_post_pantallas",
    "title": "Relajación Post-Pantallas",
    "description": "Mitigar el impacto de la luz azul en el cerebro mediante la relajación visual y mental nocturna.",
    "durationMinutes": 5,
    "category": "sueno",
    "moodTags": [
      "sueño"
    ],
    "timeOfDay": "cualquiera",
    "difficultyLevel": "principiante",
    "sessionType": "guided_pure",
    "isCustomizable": false,
    "audioLayers": {
      "voiceTrack": "https://ueuxjtyottluwkvdreqe.supabase.co/storage/v1/object/public/meditation-voices/sueno_eter_111_relajacion-post-pantallas.mp3",
      "defaultSoundscape": "meditation_bowls"
    },
    "creatorName": "Éter",
    "creatorCredentials": "Guía de Sueño y Alivio Profundo",
    "scientificBenefits": "Basado en protocolos clínicos de regulación emocional y bio-feedback.",
    "breathingPattern": {
      "inhale": 4,
      "hold": 0,
      "exhale": 4,
      "holdPost": 0
    },
    "voiceStyle": "calm",
    "visualSync": false,
    "isPremium": false,
    "color": "#4A90E2",
    "practiceInstruction": "Cierra los ojos y déjate guiar por la voz.",
    "thumbnailUrl": "https://ueuxjtyottluwkvdreqe.supabase.co/storage/v1/object/public/meditation-thumbnails/sueno_eter_111_relajacion-post-pantallas.webp"
  },
  {
    "id": "23_lago_calma",
    "title": "El Lago de la Calma",
    "description": "Inducir un estado de relajación profunda mediante la visualización de un paisaje acuático estático, ideal para desconectar el sistema de alerta.",
    "durationMinutes": 5,
    "category": "sueno",
    "moodTags": [
      "sueño"
    ],
    "timeOfDay": "cualquiera",
    "difficultyLevel": "principiante",
    "sessionType": "guided_pure",
    "isCustomizable": false,
    "audioLayers": {
      "voiceTrack": "https://ueuxjtyottluwkvdreqe.supabase.co/storage/v1/object/public/meditation-voices/sueno_eter_112_el-lago-de-la-calma.mp3",
      "defaultSoundscape": "meditation_bowls"
    },
    "creatorName": "Éter",
    "creatorCredentials": "Guía de Sueño y Alivio Profundo",
    "scientificBenefits": "Basado en protocolos clínicos de regulación emocional y bio-feedback.",
    "breathingPattern": {
      "inhale": 4,
      "hold": 0,
      "exhale": 4,
      "holdPost": 0
    },
    "voiceStyle": "calm",
    "visualSync": false,
    "isPremium": false,
    "color": "#4A90E2",
    "practiceInstruction": "Cierra los ojos y déjate guiar por la voz.",
    "thumbnailUrl": "https://ueuxjtyottluwkvdreqe.supabase.co/storage/v1/object/public/meditation-thumbnails/sueno_eter_112_el-lago-de-la-calma.webp"
  },
  {
    "id": "24_respiracion_luna",
    "title": "Respiración de la Luna (Chandra Bhedana)",
    "description": "Enfriar el sistema y calmar la mente inhalando exclusivamente por la fosa natal izquierda.",
    "durationMinutes": 5,
    "category": "sueno",
    "moodTags": [
      "sueño"
    ],
    "timeOfDay": "cualquiera",
    "difficultyLevel": "principiante",
    "sessionType": "guided_pure",
    "isCustomizable": false,
    "audioLayers": {
      "voiceTrack": "https://ueuxjtyottluwkvdreqe.supabase.co/storage/v1/object/public/meditation-voices/sueno_eter_113_respiracion-de-la-luna-chandra-bhedana-.mp3",
      "defaultSoundscape": "meditation_bowls"
    },
    "creatorName": "Éter",
    "creatorCredentials": "Guía de Sueño y Alivio Profundo",
    "scientificBenefits": "Basado en protocolos clínicos de regulación emocional y bio-feedback.",
    "breathingPattern": {
      "inhale": 4,
      "hold": 0,
      "exhale": 4,
      "holdPost": 0
    },
    "voiceStyle": "calm",
    "visualSync": false,
    "isPremium": false,
    "color": "#4A90E2",
    "practiceInstruction": "Cierra los ojos y déjate guiar por la voz.",
    "thumbnailUrl": "https://ueuxjtyottluwkvdreqe.supabase.co/storage/v1/object/public/meditation-thumbnails/sueno_eter_113_respiracion-de-la-luna-chandra-bhedana-.webp"
  },
  {
    "id": "25_478_nocturno",
    "title": "4-7-8 Nocturno (Hacia el Sueño)",
    "description": "Preparar la química cerebral para el sueño profundo mediante la técnica 4-7-8, optimizada con una guía narrativa de entrega al descanso.",
    "durationMinutes": 5,
    "category": "sueno",
    "moodTags": [
      "sueño"
    ],
    "timeOfDay": "cualquiera",
    "difficultyLevel": "principiante",
    "sessionType": "guided_pure",
    "isCustomizable": false,
    "audioLayers": {
      "voiceTrack": "https://ueuxjtyottluwkvdreqe.supabase.co/storage/v1/object/public/meditation-voices/sueno_eter_114_4-7-8-nocturno-hacia-el-sueno-.mp3",
      "defaultSoundscape": "meditation_bowls"
    },
    "creatorName": "Éter",
    "creatorCredentials": "Guía de Sueño y Alivio Profundo",
    "scientificBenefits": "Basado en protocolos clínicos de regulación emocional y bio-feedback.",
    "breathingPattern": {
      "inhale": 4,
      "hold": 0,
      "exhale": 4,
      "holdPost": 0
    },
    "voiceStyle": "calm",
    "visualSync": false,
    "isPremium": false,
    "color": "#4A90E2",
    "practiceInstruction": "Cierra los ojos y déjate guiar por la voz.",
    "thumbnailUrl": "https://ueuxjtyottluwkvdreqe.supabase.co/storage/v1/object/public/meditation-thumbnails/sueno_eter_114_4-7-8-nocturno-hacia-el-sueno-.webp"
  },
  {
    "id": "26_relajacion_jacobson",
    "title": "Relajación Muscular Progresiva (Jacobson)",
    "description": "Eliminar la tensión residual en los músculos para asegurar un descanso sin interrupciones físicas.",
    "durationMinutes": 5,
    "category": "sueno",
    "moodTags": [
      "sueño"
    ],
    "timeOfDay": "cualquiera",
    "difficultyLevel": "principiante",
    "sessionType": "guided_pure",
    "isCustomizable": false,
    "audioLayers": {
      "voiceTrack": "https://ueuxjtyottluwkvdreqe.supabase.co/storage/v1/object/public/meditation-voices/sueno_eter_115_relajacion-muscular-progresiva-jacobson-.mp3",
      "defaultSoundscape": "meditation_bowls"
    },
    "creatorName": "Éter",
    "creatorCredentials": "Guía de Sueño y Alivio Profundo",
    "scientificBenefits": "Basado en protocolos clínicos de regulación emocional y bio-feedback.",
    "breathingPattern": {
      "inhale": 4,
      "hold": 0,
      "exhale": 4,
      "holdPost": 0
    },
    "voiceStyle": "calm",
    "visualSync": false,
    "isPremium": false,
    "color": "#4A90E2",
    "practiceInstruction": "Cierra los ojos y déjate guiar por la voz.",
    "thumbnailUrl": "https://ueuxjtyottluwkvdreqe.supabase.co/storage/v1/object/public/meditation-thumbnails/sueno_eter_115_relajacion-muscular-progresiva-jacobson-.webp"
  },
  {
    "id": "27_vaciado_mental",
    "title": "Soltar el Día (Vaciado Mental)",
    "description": "Cerrar psicológicamente los asuntos pendientes del día para evitar el insomnio ansioso.",
    "durationMinutes": 5,
    "category": "sueno",
    "moodTags": [
      "sueño"
    ],
    "timeOfDay": "cualquiera",
    "difficultyLevel": "principiante",
    "sessionType": "guided_pure",
    "isCustomizable": false,
    "audioLayers": {
      "voiceTrack": "https://ueuxjtyottluwkvdreqe.supabase.co/storage/v1/object/public/meditation-voices/sueno_eter_116_soltar-el-dia-vaciado-mental-.mp3",
      "defaultSoundscape": "meditation_bowls"
    },
    "creatorName": "Éter",
    "creatorCredentials": "Guía de Sueño y Alivio Profundo",
    "scientificBenefits": "Basado en protocolos clínicos de regulación emocional y bio-feedback.",
    "breathingPattern": {
      "inhale": 4,
      "hold": 0,
      "exhale": 4,
      "holdPost": 0
    },
    "voiceStyle": "calm",
    "visualSync": false,
    "isPremium": false,
    "color": "#4A90E2",
    "practiceInstruction": "Cierra los ojos y déjate guiar por la voz.",
    "thumbnailUrl": "https://ueuxjtyottluwkvdreqe.supabase.co/storage/v1/object/public/meditation-thumbnails/sueno_eter_116_soltar-el-dia-vaciado-mental-.webp"
  },
  {
    "id": "28_alivio_insomnio",
    "title": "Sosiego del Insomnio",
    "description": "Reducir la ansiedad de no poder dormir mediante la aceptación y el descanso consciente sin presión.",
    "durationMinutes": 5,
    "category": "sueno",
    "moodTags": [
      "sueño"
    ],
    "timeOfDay": "cualquiera",
    "difficultyLevel": "principiante",
    "sessionType": "guided_pure",
    "isCustomizable": false,
    "audioLayers": {
      "voiceTrack": "https://ueuxjtyottluwkvdreqe.supabase.co/storage/v1/object/public/meditation-voices/sueno_eter_117_sosiego-del-insomnio.mp3",
      "defaultSoundscape": "meditation_bowls"
    },
    "creatorName": "Éter",
    "creatorCredentials": "Guía de Sueño y Alivio Profundo",
    "scientificBenefits": "Basado en protocolos clínicos de regulación emocional y bio-feedback.",
    "breathingPattern": {
      "inhale": 4,
      "hold": 0,
      "exhale": 4,
      "holdPost": 0
    },
    "voiceStyle": "calm",
    "visualSync": false,
    "isPremium": false,
    "color": "#4A90E2",
    "practiceInstruction": "Cierra los ojos y déjate guiar por la voz.",
    "thumbnailUrl": "https://ueuxjtyottluwkvdreqe.supabase.co/storage/v1/object/public/meditation-thumbnails/sueno_eter_117_sosiego-del-insomnio.webp"
  },
  {
    "id": "29_respiracion_abdominal",
    "title": "Respiración Abdominal Profunda",
    "description": "Activar el sistema parasimpático de forma inmediata para bajar el pulso antes de dormir.",
    "durationMinutes": 5,
    "category": "sueno",
    "moodTags": [
      "sueño"
    ],
    "timeOfDay": "cualquiera",
    "difficultyLevel": "principiante",
    "sessionType": "guided_pure",
    "isCustomizable": false,
    "audioLayers": {
      "voiceTrack": "https://ueuxjtyottluwkvdreqe.supabase.co/storage/v1/object/public/meditation-voices/sueno_eter_118_respiracion-abdominal-profunda.mp3",
      "defaultSoundscape": "meditation_bowls"
    },
    "creatorName": "Éter",
    "creatorCredentials": "Guía de Sueño y Alivio Profundo",
    "scientificBenefits": "Basado en protocolos clínicos de regulación emocional y bio-feedback.",
    "breathingPattern": {
      "inhale": 4,
      "hold": 0,
      "exhale": 4,
      "holdPost": 0
    },
    "voiceStyle": "calm",
    "visualSync": false,
    "isPremium": false,
    "color": "#4A90E2",
    "practiceInstruction": "Cierra los ojos y déjate guiar por la voz.",
    "thumbnailUrl": "https://ueuxjtyottluwkvdreqe.supabase.co/storage/v1/object/public/meditation-thumbnails/sueno_eter_118_respiracion-abdominal-profunda.webp"
  },
  {
    "id": "30_silencio_mente",
    "title": "El Silencio de la Mente",
    "description": "Alcanzar un estado de vacuidad mental antes del sueño profundo, eliminando el ruido blanco atencional.",
    "durationMinutes": 5,
    "category": "sueno",
    "moodTags": [
      "sueño"
    ],
    "timeOfDay": "cualquiera",
    "difficultyLevel": "principiante",
    "sessionType": "guided_pure",
    "isCustomizable": false,
    "audioLayers": {
      "voiceTrack": "https://ueuxjtyottluwkvdreqe.supabase.co/storage/v1/object/public/meditation-voices/sueno_eter_119_el-silencio-de-la-mente.mp3",
      "defaultSoundscape": "meditation_bowls"
    },
    "creatorName": "Éter",
    "creatorCredentials": "Guía de Sueño y Alivio Profundo",
    "scientificBenefits": "Basado en protocolos clínicos de regulación emocional y bio-feedback.",
    "breathingPattern": {
      "inhale": 4,
      "hold": 0,
      "exhale": 4,
      "holdPost": 0
    },
    "voiceStyle": "calm",
    "visualSync": false,
    "isPremium": false,
    "color": "#4A90E2",
    "practiceInstruction": "Cierra los ojos y déjate guiar por la voz.",
    "thumbnailUrl": "https://ueuxjtyottluwkvdreqe.supabase.co/storage/v1/object/public/meditation-thumbnails/sueno_eter_119_el-silencio-de-la-mente.webp"
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
