import HomeScreen from '../screens/Home/HomeScreen';

describe('Prueba de Vacío', () => {
    it('puede cargar el componente sin mocks', () => {
        expect(HomeScreen).toBeDefined();
    });
});
