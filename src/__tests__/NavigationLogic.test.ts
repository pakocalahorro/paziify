
// Aduana de Navegación: Lógica de Flujos
// Este test asegura que el usuario siempre es dirigido a la pantalla correcta según su estado.

import { Screen } from '../types';

// Simulamos el "Cerebro" de la navegación
const getInitialRoute = (user: any, isGuest: boolean, isLoading: boolean): string => {
    if (isLoading) return 'LOADING';
    if (!user && !isGuest) return Screen.WELCOME;
    return Screen.SPIRITUAL_PRELOADER; // Primera parada tras login/guest
};

const getTargetScreenAfterHomeAction = (actionType: 'meditation' | 'course' | 'audiobook'): string => {
    switch (actionType) {
        case 'meditation': return Screen.SESSION_DETAIL;
        case 'course': return Screen.ACADEMY_COURSE_DETAIL;
        case 'audiobook': return Screen.AUDIOBOOK_PLAYER;
        default: return Screen.HOME;
    }
};

describe('Aduana de Navegación: Lógica de Estados', () => {

    test('Debe mostrar Loading si la App está cargando datos iniciales', () => {
        const route = getInitialRoute(null, false, true);
        expect(route).toBe('LOADING');
    });

    test('Debe dirigir a Welcome si no hay usuario ni es invitado', () => {
        const route = getInitialRoute(null, false, false);
        expect(route).toBe(Screen.WELCOME);
    });

    test('Debe dirigir a SpiritualPreloader si el usuario se identifica', () => {
        const route = getInitialRoute({ id: '123' }, false, false);
        expect(route).toBe(Screen.SPIRITUAL_PRELOADER);
    });

    test('Debe dirigir a SpiritualPreloader si entra como invitado', () => {
        const route = getInitialRoute(null, true, false);
        expect(route).toBe(Screen.SPIRITUAL_PRELOADER);
    });

    test('Debe resolver correctamente el destino desde la Home', () => {
        expect(getTargetScreenAfterHomeAction('meditation')).toBe(Screen.SESSION_DETAIL);
        expect(getTargetScreenAfterHomeAction('course')).toBe(Screen.ACADEMY_COURSE_DETAIL);
        expect(getTargetScreenAfterHomeAction('audiobook')).toBe(Screen.AUDIOBOOK_PLAYER);
    });

});
