export interface Lesson {
    id: string;
    title: string;
    description: string;
    content: string;
    moduleId: string;
    isPlus: boolean;
    duration: string;
}

export interface AcademyModule {
    id: string;
    title: string;
    description: string;
    icon: string;
}

export const ACADEMY_MODULES: AcademyModule[] = [
    {
        id: 'basics',
        title: 'Fundamentos TCC',
        description: 'Aprende las bases de la Terapia Cognitivo-Conductual.',
        icon: 'book-outline',
    },
    {
        id: 'anxiety',
        title: 'Gestión de Ansiedad',
        description: 'Técnicas prácticas para calmar tu mente.',
        icon: 'rainy-outline',
    },
    {
        id: 'thoughts',
        title: 'Pensamientos Distorsionados',
        description: 'Identifica y desafía tus trampas mentales.',
        icon: 'flash-outline',
    },
];

export const ACADEMY_LESSONS: Lesson[] = [
    {
        id: 'lesson-1',
        moduleId: 'basics',
        title: '¿Qué es la TCC?',
        description: 'Una introducción a cómo tus pensamientos afectan tus sentimientos.',
        duration: '5 min',
        isPlus: false,
        content: `
# ¿Qué es la Terapia Cognitivo-Conductual?

La TCC se basa en una idea simple: **no son las situaciones las que nos perturban, sino nuestra interpretación de ellas.**

## El Triángulo de la TCC
La TCC explora la relación entre:
1. **Pensamientos**: Lo que dices en tu cabeza.
2. **Emociones**: Lo que sientes en tu cuerpo.
3. **Comportamientos**: Lo que haces.

> "Cambia tus pensamientos y cambiarás tu mundo."

### Tu primer ejercicio
Observa un pensamiento recurrente hoy. ¿Es un hecho o una interpretación?
        `,
    },
    {
        id: 'lesson-2',
        moduleId: 'basics',
        title: 'El Ciclo del Pensamiento',
        description: 'Entiende cómo se retroalimentan tus ideas y acciones.',
        duration: '7 min',
        isPlus: false,
        content: `
# El Ciclo del Pensamiento

Nuestros pensamientos automáticos a menudo ocurren tan rápido que no nos damos cuenta de ellos.

## Cómo funciona el ciclo:
- **Situación**: Un evento externo.
- **Pensamiento Automático**: La primera interpretación.
- **Respuesta Emocional**: Tristeza, ansiedad, alegría.
- **Acción**: Lo que hacemos después.

### Ejemplo:
*Situación:* Un amigo no te devuelve la llamada.
*Pensamiento:* "Seguro que está enfadado conmigo."
*Emoción:* Ansiedad, inseguridad.
*Acción:* Evitar hablar con él en el futuro.
        `,
    },
    {
        id: 'lesson-3',
        moduleId: 'anxiety',
        title: 'La Regla del 3-3-3',
        description: 'Una técnica rápida para cuando te sientes abrumado.',
        duration: '3 min',
        isPlus: false,
        content: `
# La Regla del 3-3-3

Esta es una técnica de **mindfulness** diseñada para aterrizar tu mente en el presente cuando la ansiedad toma el control.

## Instrucciones:
1. **Mira**: Identifica 3 objetos que veas a tu alrededor.
2. **Escucha**: Identifica 3 sonidos que oigas en este momento.
3. **Mueve**: Mueve 3 partes de tu cuerpo (dedos, hombros, cuello).

Esto distrae al cerebro de los pensamientos de pánico y lo devuelve a las sensaciones físicas reales.
        `,
    },
];
